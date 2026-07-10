// Small, cheap FAQ cache. If the user's message matches a known question we
// short-circuit before hitting an LLM. Match is intentionally loose (keyword
// scoring) so paraphrases still hit. This is not intended to replace the LLM
// — it just avoids paying for the most common intro questions.

interface FaqEntry {
  keywords: string[][]; // OR of ANDs — matches if any group is fully covered
  answer: string;
}

const FAQ: FaqEntry[] = [
  {
    keywords: [["skill"], ["strength"], ["expertise"], ["good", "at"]],
    answer:
      "Aditya excels in Generative AI, LLMOps, and building enterprise-scale AI systems. His core strengths include LangChain, LangGraph, Python, FastAPI, and cloud platforms like AWS and Azure. He's particularly skilled at system design and building production-ready AI solutions.",
  },
  {
    keywords: [["project"], ["built"], ["portfolio"], ["work"]],
    answer:
      "Aditya has built several impressive projects including SentinelAI (an enterprise LLMOps platform), Agentic RAG systems for 900+ API testing, and autonomous AIOps agents. Each project demonstrates his ability to deliver scalable, production-ready solutions.",
  },
  {
    keywords: [["help"], ["organization"], ["company"], ["hire"]],
    answer:
      "Aditya can help your organization with end-to-end GenAI development, building custom guardrails and evaluation pipelines, implementing LLMOps infrastructure, and deploying enterprise-ready AI systems with proper observability and cost controls.",
  },
  {
    keywords: [["llmops"], ["experience"], ["background"]],
    answer:
      "Aditya has extensive experience building enterprise LLMOps platforms at Synechron, handling 100% of organizational LLM traffic. Previously at Infosys, he developed Agentic RAG systems and fine-tuned LLMs for production use.",
  },
];

export function matchFaq(question: string): string | null {
  const q = question.toLowerCase();
  for (const entry of FAQ) {
    for (const group of entry.keywords) {
      if (group.every((k) => q.includes(k))) return entry.answer;
    }
  }
  return null;
}
