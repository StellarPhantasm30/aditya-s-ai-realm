import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";
import { classifyError } from "../errors.js";
import type { ModelInfo, Provider } from "../types.js";

// Rank helper: bigger/newer text-focused models score higher.
function rankGroqModel(id: string): number {
  const lower = id.toLowerCase();
  if (lower.includes("whisper") || lower.includes("tts")) return -1;
  let r = 0;
  if (lower.includes("versatile")) r += 20;
  if (lower.includes("llama-3.3")) r += 30;
  if (lower.includes("llama-3.1")) r += 20;
  if (lower.includes("llama-3")) r += 10;
  if (lower.includes("70b")) r += 15;
  if (lower.includes("8b")) r += 5;
  if (lower.includes("mixtral")) r += 8;
  return r;
}

export function createGroqProvider(): Provider {
  const apiKey = process.env.GROQ_API_KEY;
  const client = apiKey ? createGroq({ apiKey }) : null;

  return {
    id: "groq",
    isConfigured: () => Boolean(apiKey),
    getLanguageModel(modelId: string): LanguageModel {
      if (!client) throw new Error("GROQ_API_KEY not set");
      return client(modelId);
    },
    async listModels(): Promise<ModelInfo[]> {
      if (!apiKey) return [];
      try {
        const res = await fetch("https://api.groq.com/openai/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) throw Object.assign(new Error(await res.text()), { status: res.status });
        const json = (await res.json()) as { data: Array<{ id: string }> };
        return json.data
          .map((m) => ({
            id: m.id,
            provider: "groq" as const,
            rank: rankGroqModel(m.id),
          }))
          .filter((m) => m.rank >= 0)
          .sort((a, b) => b.rank - a.rank);
      } catch (e) {
        throw classifyError(e, "groq");
      }
    },
  };
}
