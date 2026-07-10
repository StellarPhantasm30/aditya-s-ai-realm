import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadConfig } from "./config.js";
import type { ModelInfo, Provider, ProviderId } from "./types.js";

interface CacheShape {
  fetchedAt: number;
  models: Record<string, ModelInfo[]>;
}

const CACHE_FILE = path.join("/tmp", "ai-model-registry.json");

let mem: CacheShape | null = null;

function readDiskCache(): CacheShape | null {
  try {
    if (!existsSync(CACHE_FILE)) return null;
    return JSON.parse(readFileSync(CACHE_FILE, "utf8")) as CacheShape;
  } catch {
    return null;
  }
}

function writeDiskCache(c: CacheShape): void {
  try {
    mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(c));
  } catch {
    /* /tmp may be unavailable — mem cache is still fine */
  }
}

function isFresh(c: CacheShape | null, ttlMs: number): boolean {
  return !!c && Date.now() - c.fetchedAt < ttlMs;
}

async function fetchAll(providers: Provider[]): Promise<Record<string, ModelInfo[]>> {
  const entries = await Promise.all(
    providers.map(async (p) => {
      try {
        return [p.id, await p.listModels()] as const;
      } catch {
        return [p.id, [] as ModelInfo[]] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

export async function getRegistry(
  providers: Provider[],
  opts: { force?: boolean } = {},
): Promise<Record<string, ModelInfo[]>> {
  const { registry } = loadConfig();
  const ttlMs = registry.ttlDays * 24 * 60 * 60 * 1000;

  if (!opts.force) {
    if (isFresh(mem, ttlMs)) return mem!.models;
    const disk = readDiskCache();
    if (isFresh(disk, ttlMs)) {
      mem = disk;
      return disk!.models;
    }
  }

  const models = await fetchAll(providers);
  const cache: CacheShape = { fetchedAt: Date.now(), models };
  mem = cache;
  writeDiskCache(cache);
  return models;
}

export async function getModelsFor(
  providers: Provider[],
  providerId: ProviderId,
  opts: { force?: boolean } = {},
): Promise<ModelInfo[]> {
  const reg = await getRegistry(providers, opts);
  return reg[providerId] ?? [];
}
