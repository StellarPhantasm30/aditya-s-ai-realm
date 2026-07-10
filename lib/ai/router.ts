import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { loadConfig } from "./config";
import {
  AllProvidersFailedError,
  classifyError,
  friendlyMessage,
  RateLimitError,
} from "./errors";
import { createGoogleProvider } from "./providers/google";
import { createGroqProvider } from "./providers/groq";
import { getModelsFor, getRegistry } from "./registry";
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
 * Try each configured provider in priority order and return the first
 * streaming response that starts successfully. Provider construction /
 * missing-key errors trigger fallback; runtime stream errors surface to
 * the client via `onError` with a user-friendly message.
 */
export async function routeStream(params: RouteParams): Promise<Response> {
  const entries = buildProviders();
  if (entries.length === 0) throw new AllProvidersFailedError("No providers configured");

  const modelMessages = convertToModelMessages(params.messages);
  const errors: string[] = [];

  // Warm the registry in the background; don't block the request.
  void getRegistry(entries.map((e) => e.provider)).catch(() => {});

  for (const { cfg, provider } of entries) {
    const sem = getSemaphore(cfg.id, cfg.concurrency);
    const release = await sem.acquire();
    const modelIds = await candidateModels(provider, cfg.defaultModel);

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
          onFinish: () => release(),
        });

        return result.toUIMessageStreamResponse({
          onError: (error) => friendlyMessage(error),
        });
      } catch (e) {
        const err = classifyError(e, cfg.id);
        errors.push(`${cfg.id}/${modelId}: ${err.message}`);
        if (!(err instanceof RateLimitError)) break;
      }
    }

    release();
  }

  throw new AllProvidersFailedError(errors.join(" | "));
}
