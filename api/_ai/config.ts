import { parse } from "yaml";
import { z } from "zod";
import type { AppConfig, ProviderConfig } from "./types.js";

// providers.yaml is embedded here as a string constant so Vercel's serverless
// bundler doesn't have to ship an external file. The file at the repo root
// stays as the human-readable source of truth — keep them in sync when
// editing (or drop a build step that syncs one from the other).
const PROVIDERS_YAML = `
providers:
  groq:
    enabled: true
    priority: 1
    api_key_env: GROQ_API_KEY
    default_model: llama-3.3-70b-versatile
    concurrency: 3
  google:
    enabled: true
    priority: 2
    api_key_env: GOOGLE_API_KEY
    default_model: gemini-2.5-flash
    concurrency: 3
registry:
  ttl_days: 30
`;

const schema = z.object({
  providers: z.record(
    z.string(),
    z.object({
      enabled: z.boolean(),
      priority: z.number().int(),
      api_key_env: z.string(),
      default_model: z.string(),
      concurrency: z.number().int().positive().default(3),
    }),
  ),
  registry: z
    .object({ ttl_days: z.number().int().positive().default(30) })
    .default({ ttl_days: 30 }),
});

let cached: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (cached) return cached;
  const raw = parse(PROVIDERS_YAML);
  const parsed = schema.parse(raw);
  const providers: ProviderConfig[] = Object.entries(parsed.providers).map(
    ([id, p]) => ({
      id,
      enabled: p.enabled,
      priority: p.priority,
      apiKeyEnv: p.api_key_env,
      defaultModel: p.default_model,
      concurrency: p.concurrency,
    }),
  );
  providers.sort((a, b) => a.priority - b.priority);
  cached = {
    providers,
    registry: { ttlDays: parsed.registry.ttl_days },
  };
  return cached;
}
