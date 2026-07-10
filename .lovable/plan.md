# Streaming AI Bot with Pluggable Providers

Replace the hardcoded responses in `AskBot.tsx` with real streaming completions from Groq (primary) and Google Gemini (fallback), served by a Vercel serverless function. Provider selection, model discovery, and fallback all happen server-side; the client never sees keys or provider names. Keep frequently asked questions cached do not completely replace the hardcoded responses. Since LLM calls are expensive.

---

## Architecture

```text
src/components/AskBot.tsx  ──POST /api/chat──▶  api/chat.ts (Vercel Edge fn)
                                                       │
                                                       ▼
                                              lib/ai/router.ts
                                              (reads providers.yaml,
                                               orders by priority,
                                               applies semaphore,
                                               retries on failure)
                                                       │
                                       ┌───────────────┼───────────────┐
                                       ▼               ▼               ▼
                              providers/groq.ts  providers/google.ts  providers/<future>.ts
                                       │               │
                                       └──── ai-sdk streamText ────┘
                                                       │
                                                       ▼
                                              lib/ai/registry.ts
                                              (fetch text-to-text model
                                               list, cache ~30 days)
```

---

## Files

### New


| File                         | Purpose                                                                                                                                                                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api/chat.ts`                | Vercel Edge Function. Accepts `{ messages }`, streams tokens back using AI SDK `toDataStreamResponse`.                                                                                                                                                                                                |
| `providers.yaml`             | Provider config (enabled, priority, api_key_env, default_model). Parsed at cold start.                                                                                                                                                                                                                |
| `lib/ai/config.ts`           | Loads and validates `providers.yaml` with Zod.                                                                                                                                                                                                                                                        |
| `lib/ai/types.ts`            | Shared types: `ChatMessage`, `Provider`, `ProviderError`, `ModelInfo`.                                                                                                                                                                                                                                |
| `lib/ai/registry.ts`         | Fetches text-to-text model lists from each provider's `/models` endpoint. In-memory cache with ~30-day TTL, persisted best-effort to `/tmp` on Vercel. Refreshes on cache miss or when a provider throws a rate-limit error.                                                                          |
| `lib/ai/semaphore.ts`        | Tiny async semaphore (concurrency limit per provider) to smooth rate limits.                                                                                                                                                                                                                          |
| `lib/ai/router.ts`           | Orchestrator: picks providers by priority, acquires semaphore, calls `streamText`, on failure classifies the error and either switches model (rate limit) or falls back to the next provider (downtime/auth/timeout). Returns a single readable stream to the caller.                                 |
| `lib/ai/providers/base.ts`   | `Provider` interface: `id`, `getModels()`, `stream(params)`.                                                                                                                                                                                                                                          |
| `lib/ai/providers/groq.ts`   | Groq implementation using `@ai-sdk/groq`. Default model `llama-3.3-70b-versatile`. Model list from official sdk implementation or `https://api.groq.com/openai/v1/models`.                                                                                                                            |
| `lib/ai/providers/google.ts` | Google implementation using `@ai-sdk/google`. Default model `gemini-3.5-flash` (your requested id — if the runtime 404s it, the registry auto-picks the top-ranked flash-tier text model). Model list using official sdk implementation or `https://generativelanguage.googleapis.com/v1beta/models`. |
| `lib/ai/errors.ts`           | Error taxonomy (`AuthError`, `RateLimitError`, `TimeoutError`, `UpstreamDownError`, `BadRequestError`) + `classifyError(e)` mapping HTTP/SDK errors to these classes and to user-facing messages.                                                                                                     |


### Modified


| File                        | Change                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/AskBot.tsx` | Replace `mockConversation`/hardcoded `if` branches with the AI SDK `useChat` hook pointed at `/api/chat`. Keep the existing visual design (glass card, sample prompts, avatars, animations). Render `message.parts` and show a shimmer/typing indicator while `status === "submitted" || "streaming"`. Keep the sample-prompt chips — clicking one calls `sendMessage`. Disable submit during streaming; surface errors via toast. |
| `package.json`              | Add `ai`, `@ai-sdk/react`, `@ai-sdk/groq`, `@ai-sdk/google`, `yaml`, `zod` (already present via shadcn).                                                                                                                                                                                                                                                                                                                           |
| `vercel.json` (new, small)  | Set the `/api/chat` function runtime to Edge (`"runtime": "edge"`) so streaming works and cold starts are fast.                                                                                                                                                                                                                                                                                                                    |
| `.env.example` (new)        | Document `GROQ_API_KEY`, `GOOGLE_API_KEY`.                                                                                                                                                                                                                                                                                                                                                                                         |


No changes to any other section of the site.

---

## `providers.yaml` shape

```yaml
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
    default_model: gemini-3.5-flash
    concurrency: 3
registry:
  ttl_days: 30
```

Adding a third provider = drop `providers/openrouter.ts` and add a block here. Zero changes elsewhere.

---

## Router logic (pseudocode)

```text
for provider in providers sorted by priority (enabled only):
  await semaphore.acquire(provider.id)
  try:
    model = provider.currentModel   # default or last-known-good from registry
    return streamText({ model, messages, abortSignal(timeout=30s) })
  catch e:
    switch classifyError(e):
      RateLimit  -> pick next model from registry for same provider, retry once
      Auth       -> log, mark provider unhealthy for this request, continue loop
      Timeout    -> continue loop
      UpstreamDown -> continue loop
      BadRequest -> throw (client error, don't fallback)
  finally: semaphore.release
throw AllProvidersFailedError  # surfaces friendly message to UI
```

---

## Registry / caching

- On first call per cold start, load cached JSON from `/tmp/model-registry.json` if fresh (< 30 days).
- Otherwise fetch `/models` from each enabled provider in parallel, filter to text→text chat models, sort (recency + name heuristics), write cache.
- Force-refresh path when the router catches a `RateLimitError` and needs a sibling model. This functionality needs to span to provider as well. So if rate limit of all sibling models are reached a new provider can be invoked and their all models limit can be checked. and to and fro, this will handle all the provider specific problems.
- Cache is per-instance (Vercel serverless is fine — worst case each instance refetches once a month).

---

## Streaming contract

- `/api/chat` accepts `{ messages: UIMessage[] }`, returns AI SDK's UI message stream (`result.toDataStreamResponse()`).
- Client uses `useChat` from `@ai-sdk/react` — no manual SSE parsing.
- Errors from the router are converted to a stream error part so the client `onError` fires cleanly.

---

## Error handling → user messages


| Class                            | Shown in chat                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `AuthError` (all providers)      | "AI assistant is temporarily unavailable. Please try again shortly." (logged as config issue server-side) |
| `RateLimitError` (all exhausted) | "The assistant is busy right now — please retry in a moment."                                             |
| `TimeoutError`                   | "That took too long. Try a shorter question or retry."                                                    |
| `UpstreamDownError`              | "AI provider is having trouble. Retrying with a backup…" (silent if fallback succeeds)                    |
| `BadRequestError`                | "Sorry, I couldn't process that message."                                                                 |


---

## Env vars

Nothing pasted into chat. Values live only in Vercel's project env (you confirmed they're already added). Locally, users can add a `.env.local` matching `.env.example`.

---

## Out of scope (call out for later)

- Persisting conversations (none currently — matches existing behavior).
- Auth-gated rate limits (Lovable knowledge notes there's no backend rate-limit primitive yet; provider-side limits + semaphore are what we rely on).
- Tool calling / RAG over your resume — easy add later since the router is provider-agnostic.