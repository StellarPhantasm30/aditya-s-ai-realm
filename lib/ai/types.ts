// Shared types for the AI provider abstraction.
import type { LanguageModel, ModelMessage } from "ai";

export type ProviderId = "groq" | "google" | (string & {});

export interface ProviderConfig {
  id: ProviderId;
  enabled: boolean;
  priority: number;
  apiKeyEnv: string;
  defaultModel: string;
  concurrency: number;
}

export interface RegistryConfig {
  ttlDays: number;
}

export interface AppConfig {
  providers: ProviderConfig[];
  registry: RegistryConfig;
}

export interface ModelInfo {
  id: string;
  provider: ProviderId;
  // Higher = preferred. Rough heuristic based on name.
  rank: number;
}

export interface StreamParams {
  model: string;
  messages: ModelMessage[];
  abortSignal?: AbortSignal;
}

export interface Provider {
  id: ProviderId;
  isConfigured(): boolean;
  getLanguageModel(modelId: string): LanguageModel;
  listModels(): Promise<ModelInfo[]>;
}
