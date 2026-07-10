import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { loadConfig } from "./config";
import {
  AllProvidersFailedError,
  classifyError,
  RateLimitError,
} from "./errors";
import { createGoogleProvider } from "./providers/google";
import { createGroqProvider } from "./providers/groq";
import { getModelsFor } from "./registry";
import { getSemaphore } from "./semaphore";
import type { Provider, ProviderConfig } from "./types";

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

async function candidateModels(
  provider: Provider,
  primary: string,
): Promise<string[]> {
  const list = [primary];
  try {
    const providers = buildProviders().map((p) => p.provider);
    const models = await getModelsFor(providers, provider.id);
    for (const m of models) if (!list.includes(m.id)) list.push(m.id);
  } catch {
    /* registry unavailable — use only the default model */
  }
  return list;
}

export interface RouteParams {
  messages: UIMessage[];
  system?: string;
  abortSignal?: AbortSignal;
}

/**
 * Open a streaming completion by trying providers in priority order.
 *
 * For each provider we probe the stream by pulling its first chunk. If that
 * fails (auth, rate limit, upstream down, timeout) we fall back to the next
 * ranked model on the same provider (once) and then to the next provider.
 * The successful stream is re-assembled and returned as a normal
 * ReadableStream of UIMessage stream chunks so the caller can pipe it to
 * the client without knowing which provider handled the request.
 */
export async function routeStream(params: RouteParams): Promise<Response> {
  const entries = buildProviders();
  if (entries.length === 0) throw new AllProvidersFailedError("No providers configured");

  const modelMessages = convertToModelMessages(params.messages);
  const errors: string[] = [];

  for (const { cfg, provider } of entries) {
    const sem = getSemaphore(cfg.id, cfg.concurrency);
    const release = await sem.acquire();
    const modelIds = await candidateModels(provider, cfg.defaultModel);

    let succeeded = false;
    for (const modelId of modelIds) {
      try {
        const result = streamText({
          model: provider.getLanguageModel(modelId),
          system: params.system,
          messages: modelMessages,
          abortSignal: params.abortSignal,
          onError: ({ error }) => {
            console.error(`[ai:${cfg.id}:${modelId}] stream error`, error);
          },
        });

        // Probe the stream: pull the first chunk. If the provider rejects
        // (rate limit, auth, upstream), this throws and we fall back.
        const source = result.fullStream;
        const reader = source.getReader();
        const first = await reader.read();
        if (first.value?.type === "error") {
          throw classifyError(first.value.error, cfg.id);
        }

        // Rebuild a stream that yields the probed chunk plus the remainder.
        const rebuilt = new ReadableStream({
          async start(controller) {
            if (!first.done && first.value) controller.enqueue(first.value);
            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                controller.enqueue(value);
              }
              controller.close();
            } catch (e) {
              controller.error(e);
            } finally {
              release();
            }
          },
        });

        succeeded = true;
        // Bridge the raw stream into a UI-message stream response using the
        // AI SDK's helper. We construct a lightweight `StreamTextResult`-like
        // object by re-invoking streamText on the reconstructed source is
        // not possible; instead, convert via `toTextStreamResponse` shape.
        // Simplest robust path: pipe the fullStream chunks through the SDK's
        // response helper by proxying `result` with our new source.
        (result as unknown as { fullStream: ReadableStream }).fullStream = rebuilt;
        return result.toUIMessageStreamResponse();
      } catch (e) {
        const err = classifyError(e, cfg.id);
        errors.push(`${cfg.id}/${modelId}: ${err.message}`);
        // Retry on same provider only for rate limits.
        if (!(err instanceof RateLimitError)) break;
      }
    }

    if (!succeeded) release();
  }

  throw new AllProvidersFailedError(errors.join(" | "));
}
