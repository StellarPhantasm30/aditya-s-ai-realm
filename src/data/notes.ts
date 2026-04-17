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
    id: "1",
    title: "Stanford CS230 Lecture 8 Notes",
    description:
      "A quick, structured breakdown, of my notes for the Stanford Lecture 8 to make this easier to revisit.",
    thumbnail_url: "/notes/Stanford_CS230_Lecture_8_Notes_thumbnail.jpg",
    pdf_url: "/notes/Stanford_CS230_Lecture_8_Notes.pdf",
    tags: ["Generative AI", "Introduction"],
    published_date: "16-04-2026",
    linkedin_url: "https://www.linkedin.com/posts/adityadev30_stanford-cs230-lecture-8-notes-activity-7450431536216043520-hO5a?utm_source=share&utm_medium=member_desktop&rcm=ACoAACcQekMBJ2rrr5HEHxQhg9lPnppfY5NQy0c",
    page_count: 17,
    read_time_minutes: 15-20,
  },
  // {
  //   id: "sample-rag-patterns",
  //   title: "RAG Patterns: Naive vs Agentic vs Graph",
  //   description:
  //     "When to reach for each retrieval pattern, with tradeoffs on latency, accuracy, and cost.",
  //   thumbnail_url: "/notes/sample-rag-patterns.jpg",
  //   pdf_url: "/notes/sample-rag-patterns.pdf",
  //   tags: ["RAG", "LLMOps"],
  //   published_date: "2025-02-12",
  //   linkedin_url: "https://www.linkedin.com/in/aditya-ravi-raj/",
  //   page_count: 10,
  //   read_time_minutes: 8,
  // },
];

export const getAllTags = (items: TechNote[]): string[] => {
  const set = new Set<string>();
  items.forEach((n) => n.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
};
