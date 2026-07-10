import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import type { AppConfig, ProviderConfig } from "./types";

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

function locateYaml(): string {
  // Vercel bundles files listed in vercel.json `includeFiles` next to the fn.
  const candidates = [
    path.join(process.cwd(), "providers.yaml"),
    path.join(process.cwd(), "../../providers.yaml"),
  ];
  for (const p of candidates) {
    try {
      return readFileSync(p, "utf8");
    } catch {
      /* try next */
    }
  }
  throw new Error("providers.yaml not found");
}

export function loadConfig(): AppConfig {
  if (cached) return cached;
  const raw = parse(locateYaml());
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
