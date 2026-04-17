export interface TechNote {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string; // WebP/JPG cover in /public/notes/
  pdf_url: string; // PDF in /public/notes/
  tags: string[];
  published_date: string; // ISO date
  linkedin_url?: string;
  page_count?: number;
  read_time_minutes?: number;
}

// Phase 1: hardcoded. Drop your files in /public/notes/ and add an entry here.
export const notes: TechNote[] = [
  {
    id: "sample-llmops-primer",
    title: "LLMOps Primer: From Prototype to Production",
    description:
      "A visual breakdown of the LLMOps stack — gateways, observability, evaluation, and cost control.",
    thumbnail_url: "/notes/sample-llmops-primer.jpg",
    pdf_url: "/notes/sample-llmops-primer.pdf",
    tags: ["LLMOps", "System Design"],
    published_date: "2025-03-01",
    linkedin_url: "https://www.linkedin.com/in/aditya-ravi-raj/",
    page_count: 8,
    read_time_minutes: 6,
  },
  {
    id: "sample-rag-patterns",
    title: "RAG Patterns: Naive vs Agentic vs Graph",
    description:
      "When to reach for each retrieval pattern, with tradeoffs on latency, accuracy, and cost.",
    thumbnail_url: "/notes/sample-rag-patterns.jpg",
    pdf_url: "/notes/sample-rag-patterns.pdf",
    tags: ["RAG", "LLMOps"],
    published_date: "2025-02-12",
    linkedin_url: "https://www.linkedin.com/in/aditya-ravi-raj/",
    page_count: 10,
    read_time_minutes: 8,
  },
];

export const getAllTags = (items: TechNote[]): string[] => {
  const set = new Set<string>();
  items.forEach((n) => n.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
};
