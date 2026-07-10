import type { UIMessage } from "ai";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { AllProvidersFailedError, friendlyMessage } from "./_ai/errors.js";
import { matchFaq } from "./_ai/faq.js";
import { routeStream } from "./_ai/router.js";

export const config = { maxDuration: 30 };

const SYSTEM_PROMPT = `You are Aditya's professional AI assistant on his portfolio website.
Answer questions about his skills, projects, and experience concisely (2-4 short paragraphs max).

Background:
- Generative AI and LLMOps engineer.
- Current: Synechron — built SentinelAI, an enterprise LLMOps platform handling 100% of org LLM traffic (guardrails, evals, observability, cost controls).
- Previously: Infosys — Agentic RAG for 900+ API testing, autonomous AIOps agents, fine-tuned LLMs for production.
- Stack: LangChain, LangGraph, Python, FastAPI, AWS, Azure, vector DBs (Pinecone), Groq, Google Gemini.

Tone: confident, specific, helpful. Never invent facts. If unsure, say so and suggest contacting Aditya via the contact form.`;

function faqResponse(answer: string): Response {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = crypto.randomUUID();
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: answer });
      writer.write({ type: "text-end", id });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

function errorResponse(message: string, status = 500): Response {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "error", errorText: message });
    },
  });
  return createUIMessageStreamResponse({ stream, status });
}

async function handler(req: Request): Promise<Response> {
  console.info(`[api/chat] ${req.method} request received`);

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Malformed request body.", 400);
  }

  const messages = body.messages ?? [];
  console.info(`[api/chat] parsed ${messages.length} message(s)`);

  if (!Array.isArray(messages) || messages.length === 0) {
    return errorResponse("No messages provided.", 400);
  }

  // FAQ short-circuit — avoids an LLM call for the most common questions.
  const last = messages[messages.length - 1];
  const lastText =
    last?.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as { text: string }).text)
      .join(" ") ?? "";
  const faq = matchFaq(lastText);
  if (faq) {
    console.info("[api/chat] answered from FAQ cache");
    return faqResponse(faq);
  }

  try {
    return await routeStream({
      messages,
      system: SYSTEM_PROMPT,
      abortSignal: req.signal,
    });
  } catch (e) {
    console.error("[api/chat] routing failed", e);
    const msg =
      e instanceof AllProvidersFailedError
        ? friendlyMessage(e)
        : friendlyMessage(e);
    return errorResponse(msg, 503);
  }
}

export default { fetch: handler };
