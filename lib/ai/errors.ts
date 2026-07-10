// Provider-agnostic error taxonomy. Any provider-specific error should be
// normalized through `classifyError` before it leaves the provider layer.

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly provider?: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export class AuthError extends ProviderError {
  name = "AuthError";
}
export class RateLimitError extends ProviderError {
  name = "RateLimitError";
}
export class TimeoutError extends ProviderError {
  name = "TimeoutError";
}
export class UpstreamDownError extends ProviderError {
  name = "UpstreamDownError";
}
export class BadRequestError extends ProviderError {
  name = "BadRequestError";
}
export class AllProvidersFailedError extends ProviderError {
  name = "AllProvidersFailedError";
}

const FRIENDLY: Record<string, string> = {
  AuthError:
    "AI assistant is temporarily unavailable. Please try again shortly.",
  RateLimitError:
    "The assistant is busy right now — please retry in a moment.",
  TimeoutError:
    "That took too long. Try a shorter question or retry.",
  UpstreamDownError:
    "AI provider is having trouble. Please retry shortly.",
  BadRequestError: "Sorry, I couldn't process that message.",
  AllProvidersFailedError:
    "The assistant is unreachable right now. Please try again shortly.",
};

export function friendlyMessage(err: unknown): string {
  if (err instanceof ProviderError) {
    return FRIENDLY[err.name] ?? FRIENDLY.AllProvidersFailedError;
  }
  return FRIENDLY.AllProvidersFailedError;
}

export function classifyError(err: unknown, provider?: string): ProviderError {
  if (err instanceof ProviderError) return err;

  const anyErr = err as {
    status?: number;
    statusCode?: number;
    code?: string | number;
    name?: string;
    message?: string;
  };
  const status = anyErr?.status ?? anyErr?.statusCode;
  const msg = String(anyErr?.message ?? err ?? "");

  if (status === 401 || status === 403 || /api key|unauthori[sz]ed/i.test(msg))
    return new AuthError(msg, provider, err);
  if (status === 429 || /rate.?limit|quota/i.test(msg))
    return new RateLimitError(msg, provider, err);
  if (
    anyErr?.name === "AbortError" ||
    anyErr?.code === "ETIMEDOUT" ||
    /timeout/i.test(msg)
  )
    return new TimeoutError(msg, provider, err);
  if (status === 400 || /invalid|malformed|bad request/i.test(msg))
    return new BadRequestError(msg, provider, err);
  if ((status && status >= 500) || /unavailable|network|fetch/i.test(msg))
    return new UpstreamDownError(msg, provider, err);
  return new UpstreamDownError(msg, provider, err);
}
