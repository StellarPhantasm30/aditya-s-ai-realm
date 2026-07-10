import { streamText, type ModelMessage, type UIMessage, convertToModelMessages } from "ai";
import { loadConfig } from "./config";
import {
  AllProvidersFailedError,
  BadRequestError,
  RateLimitError,
  classifyError,
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

async function pickSiblingModel(
  provider: Provider,
  currentModel: string,
): Promise<string | null> {
  const providers = buildProviders().map((p) => p.provider);
  const models = await getModelsFor(providers, provider.id, { force: true });
  const next = models.find((m) => m.id !== currentModel);
  return next?.id ?? null;
}

export interface RouteParams {
  messages: UIMessage[];
  system?: string;
  abortSignal?: AbortSignal;
}

/**
 * Try each configured provider in priority order. Within a provider, if the
 * default model is rate-limited, try the next-ranked sibling model once.
 * Returns the AI SDK stream result of the first provider that succeeds.
 */
export async function routeStream(params: RouteParams) {
  const entries = buildProviders();
  if (entries.length === 0) throw new AllProvidersFailedError("No providers configured");

  const modelMessages: ModelMessage[] = await convertToModelMessages(params.messages);
  const errors: unknown[] = [];

  for (const { cfg, provider } of entries) {
    const sem = getSemaphore(cfg.id, cfg.concurrency);
    const release = await sem.acquire();
    try {
      const attemptModels = [cfg.defaultModel];
      let lastErr: unknown = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        const modelId = attemptModels[attempt];
        if (!modelId) break;
        try {
          const result = streamText({
            model: provider.getLanguageModel(modelId),
            system: params.system,
            messages: modelMessages,
            abortSignal: params.abortSignal,
          });
          // Return the streamText result; caller will convert to a Response.
          // Release only after the stream is done.
          void result.consumeStream().finally(release);
          return result;
        } catch (e) {
          lastErr = classifyError(e, cfg.id);
          if (lastErr instanceof BadRequestError) throw lastErr;
          if (lastErr instanceof RateLimitError && attempt === 0) {
            const sibling = await pickSiblingModel(provider, modelId);
            if (sibling) {
              attemptModels.push(sibling);
              continue;
            }
          }
          break;
        }
      }
      release();
      if (lastErr) errors.push(lastErr);
    } catch (e) {
      release();
      if (e instanceof BadRequestError) throw e;
      errors.push(e);
    }
  }

  throw new AllProvidersFailedError(
    `All providers failed: ${errors.map((e) => (e as Error).message).join(" | ")}`,
  );
}
