import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { classifyError } from "../errors";
import type { ModelInfo, Provider } from "../types";

function rankGoogleModel(id: string): number {
  const lower = id.toLowerCase();
  // Skip non text-to-text.
  if (
    lower.includes("embedding") ||
    lower.includes("aqa") ||
    lower.includes("imagen") ||
    lower.includes("veo") ||
    lower.includes("tts") ||
    lower.includes("audio")
  )
    return -1;
  if (!lower.includes("gemini")) return -1;

  let r = 0;
  const versionMatch = lower.match(/gemini-(\d+(?:\.\d+)?)/);
  if (versionMatch) r += Math.round(parseFloat(versionMatch[1]) * 10);
  if (lower.includes("flash")) r += 5;
  if (lower.includes("pro")) r += 3;
  if (lower.includes("lite")) r -= 2;
  if (lower.includes("preview") || lower.includes("exp")) r -= 1;
  return r;
}

export function createGoogleProvider(): Provider {
  const apiKey = process.env.GOOGLE_API_KEY;
  const client = apiKey ? createGoogleGenerativeAI({ apiKey }) : null;

  return {
    id: "google",
    isConfigured: () => Boolean(apiKey),
    getLanguageModel(modelId: string): LanguageModel {
      if (!client) throw new Error("GOOGLE_API_KEY not set");
      return client(modelId);
    },
    async listModels(): Promise<ModelInfo[]> {
      if (!apiKey) return [];
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        );
        if (!res.ok) throw Object.assign(new Error(await res.text()), { status: res.status });
        const json = (await res.json()) as {
          models: Array<{ name: string; supportedGenerationMethods?: string[] }>;
        };
        return json.models
          .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
          .map((m) => ({
            id: m.name.replace(/^models\//, ""),
            provider: "google" as const,
            rank: rankGoogleModel(m.name),
          }))
          .filter((m) => m.rank >= 0)
          .sort((a, b) => b.rank - a.rank);
      } catch (e) {
        throw classifyError(e, "google");
      }
    },
  };
}
