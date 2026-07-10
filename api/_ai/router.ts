import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { loadConfig } from "./config.js";
import {
  AllProvidersFailedError,
  classifyError,
  friendlyMessage,
  RateLimitError,
} from "./errors.js";
import { createGoogleProvider } from "./providers/google.js";
import { createGroqProvider } from "./providers/groq.js";
import { getSemaphore } from "./semaphore.js";
import type { Provider, ProviderConfig } from "./types.js";

// Registry of provider factories. Adding a new provider = one line here plus
// a block in providers.yaml.
const FACTORIES: Record<string, () => Provider> = {
  groq: createGroqProvider,
  google: createGoogleProvider,
};

function buildProviders(): { cfg: ProviderConfig; provider: Provider }[] {
  const { providers } = loadConfig();
  return providers
    .filter((c) => c.enabled && FACTORIES[c.id])
    .map((cfg) => ({ cfg, provider: FACTORIES[cfg.id]() }))
    .filter(({ provider }) => provider.isConfigured());
}

function timeoutSignal(signal: AbortSignal | undefined, ms: number): AbortSignal {
  const timeout = AbortSignal.timeout(ms);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

export interface RouteParams {
  messages: UIMessage[];
  system?: string;
  abortSignal?: AbortSignal;
}

/**
 * Try each configured provider in priority order and return the first
 * streaming response that starts successfully. Provider construction /
 * missing-key errors trigger fallback; runtime stream errors surface to
 * the client via `onError` with a user-friendly message.
 */
export async function routeStream(params: RouteParams): Promise<Response> {
  const entries = buildProviders();
  if (entries.length === 0) throw new AllProvidersFailedError("No providers configured");

  const modelMessages = convertToModelMessages(params.messages);
  const abortSignal = timeoutSignal(params.abortSignal, 25_000);
  const errors: string[] = [];
  console.info(
    "[api/chat] configured providers",
    entries.map(({ cfg }) => `${cfg.id}:${cfg.defaultModel}`).join(", "),
  );

  for (const { cfg, provider } of entries) {
    const sem = getSemaphore(cfg.id, cfg.concurrency);
    const release = await sem.acquire();
    let released = false;
    const releaseOnce = () => {
      if (released) return;
      released = true;
      release();
    };

    for (const modelId of [cfg.defaultModel]) {
      try {
        console.info(`[api/chat] starting ${cfg.id}/${modelId}`);
        const result = streamText({
          model: provider.getLanguageModel(modelId),
          system: params.system,
          messages: modelMessages,
          abortSignal,
          onError: ({ error }) => {
            console.error(`[ai:${cfg.id}:${modelId}] stream error`, error);
            releaseOnce();
          },
          onAbort: () => {
            console.warn(`[ai:${cfg.id}:${modelId}] stream aborted`);
            releaseOnce();
          },
          onFinish: () => {
            console.info(`[ai:${cfg.id}:${modelId}] stream finished`);
            releaseOnce();
          },
        });

        return result.toUIMessageStreamResponse({
          onError: (error) => friendlyMessage(error),
          consumeSseStream: async ({ stream }) => {
            try {
              await stream.pipeTo(new WritableStream());
            } catch (error) {
              console.error(`[ai:${cfg.id}:${modelId}] sse consume error`, error);
            } finally {
              releaseOnce();
            }
          },
        });
      } catch (e) {
        const err = classifyError(e, cfg.id);
        errors.push(`${cfg.id}/${modelId}: ${err.message}`);
        console.error(`[ai:${cfg.id}:${modelId}] start failed`, err);
        if (!(err instanceof RateLimitError)) break;
      }
    }

    releaseOnce();
  }

  throw new AllProvidersFailedError(errors.join(" | "));
}
