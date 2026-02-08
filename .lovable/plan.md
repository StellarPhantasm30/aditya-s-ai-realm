
# Project Documentation Modal/Page System

## Overview

Create an in-app documentation system for Featured Projects that renders rich markdown content with two structured sections per project, supporting images and mermaid diagrams.

---

## Fumadocs Analysis

**Recommendation: Do NOT use Fumadocs**

| Aspect | Fumadocs | Custom Solution |
|--------|----------|-----------------|
| Framework | Next.js required | Works with Vite/React |
| Scope | Full doc sites (100+ pages) | Project case studies (6 pages) |
| Complexity | Heavy setup, routing changes | Lightweight, modal-based |
| Control | Opinionated structure | Full customization |
| Bundle size | Large (MDX, search, etc.) | Minimal (react-markdown + mermaid) |

For a portfolio with 6 project case studies, a custom solution is cleaner and more performant.

---

## Approach: Slide-Over Panel (Sheet)

Instead of a popup dialog, use a **full-height slide-over panel** from the right side of the screen. This provides:
- More reading space for documentation
- Better mobile experience
- Maintains page context (user can see the projects grid behind the overlay)
- Clean, professional look (similar to Notion/Linear side panels)

---

## Data Structure Enhancement

Extend the Project interface to include structured documentation content:

```typescript
interface ProjectDocumentation {
  // Section 1: High-Level Overview (always visible)
  overview: {
    problem: string;         // Problem statement (business + tech)
    role: string;            // Your role and ownership
    techStack: string[];     // Tech stack (can reuse existing tags)
    scale: string;           // Scale and constraints
    outcome: string;         // Impact (without sensitive numbers)
  };
  
  // Section 2: Architecture & Approach (expandable)
  architecture: {
    diagram?: string;        // Mermaid diagram code
    designDecisions: string; // Markdown content
    alternatives: string;    // Why this approach
    edgeCases: string;       // Edge cases handled
  };
  
  // Optional additional images
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  type: "personal" | "enterprise";
  links: {
    code?: string;
    demo?: string;
  };
  documentation?: ProjectDocumentation; // New field
}
```

---

## Component Architecture

```text
+-- Projects.tsx (existing)
|   |
|   +-- ProjectCard (existing, modified)
|   |   +-- Docs Button -> Opens Sheet
|   |
|   +-- ProjectDocsSheet (new component)
|       |
|       +-- SheetContent (slide-over panel)
|           |
|           +-- DocHeader
|           |   +-- Project Title + Type Badge
|           |   +-- Gradient accent bar
|           |
|           +-- Section 1: Project Overview
|           |   +-- Problem Statement
|           |   +-- Role & Ownership
|           |   +-- Tech Stack Tags
|           |   +-- Scale & Constraints
|           |   +-- Outcome/Impact
|           |
|           +-- Section 2: Architecture (Collapsible)
|               +-- AccordionTrigger
|               +-- AccordionContent
|                   +-- MermaidDiagram (rendered SVG)
|                   +-- MarkdownContent (react-markdown)
|                   +-- ImageGallery (optional)
```

---

## Technical Implementation

### Dependencies to Install

```bash
npm install react-markdown remark-gfm mermaid
```

- **react-markdown**: Renders markdown to React components
- **remark-gfm**: GitHub Flavored Markdown (tables, strikethrough, etc.)
- **mermaid**: Renders diagrams from text definitions

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/ProjectDocsSheet.tsx` | Main sheet/modal component |
| `src/components/MermaidDiagram.tsx` | Wrapper for mermaid rendering |
| `src/components/MarkdownRenderer.tsx` | Styled markdown component |
| `src/data/projectDocs.ts` | Documentation content (separate from Projects.tsx for cleanliness) |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/Projects.tsx` | Import Sheet, add state for selected project, change Docs button to open Sheet |
| `src/components/ui/sheet.tsx` | Possibly extend max-width for larger panels |

---

## Visual Design

### Sheet Panel Layout

```text
+-------------------------------------------+
| [X]                                        |
|                                            |
| [Gradient Bar]                             |
| PROJECT TITLE                    [Badge]   |
|                                            |
| ------------------------------------------ |
|                                            |
| PROBLEM STATEMENT                          |
| Lorem ipsum dolor sit amet...              |
|                                            |
| YOUR ROLE                                  |
| Lead architect for...                      |
|                                            |
| TECH STACK                                 |
| [Python] [FastAPI] [LangChain] [AWS]       |
|                                            |
| SCALE & CONSTRAINTS                        |
| Handles 100K requests/day...               |
|                                            |
| OUTCOME                                    |
| Reduced latency by 40%...                  |
|                                            |
| ------------------------------------------ |
|                                            |
| [v] ARCHITECTURE & APPROACH                |
|                                            |
|    +------------------+                    |
|    |  Mermaid Diagram |                    |
|    |  (rendered SVG)  |                    |
|    +------------------+                    |
|                                            |
|    Design Decisions...                     |
|    Why this approach...                    |
|    Edge cases...                           |
|                                            |
+-------------------------------------------+
```

### Styling Notes

- Use existing glass/neon-border styling for consistency
- Section headers with gradient underlines
- Mermaid diagrams styled with dark theme to match portfolio
- Smooth accordion animation for Architecture section

---

## Mermaid Integration

Create a reusable MermaidDiagram component that:
1. Takes diagram code as a prop
2. Uses mermaid.render() to generate SVG
3. Applies dark theme configuration
4. Handles async rendering properly

```typescript
// Example usage in documentation data
architecture: {
  diagram: `
    flowchart TB
      A[User Request] --> B[API Gateway]
      B --> C[LLM Router]
      C --> D[Model A]
      C --> E[Model B]
      D --> F[Response Aggregator]
      E --> F
      F --> G[User]
  `,
  // ...
}
```

---

## Documentation Content Storage

Store documentation in a separate data file for maintainability:

```typescript
// src/data/projectDocs.ts
export const projectDocumentation: Record<string, ProjectDocumentation> = {
  "Validate.AI": {
    overview: {
      problem: "Organizations needed centralized control over LLM usage...",
      role: "Lead architect responsible for core routing engine...",
      techStack: ["Python", "FastAPI", "LiteLLM", "Langfuse"],
      scale: "Processing 100% organizational LLM traffic (~50K requests/day)",
      outcome: "Enabled compliance, reduced costs by 30%, improved observability"
    },
    architecture: {
      diagram: `flowchart TB...`,
      designDecisions: "Chose FastAPI for async performance...",
      alternatives: "Considered Kong gateway but needed deeper LLM integration...",
      edgeCases: "Handled model failover, rate limiting, token budget enforcement..."
    }
  },
  // ... other projects
};
```

---

## Implementation Order

1. **Install dependencies**: react-markdown, remark-gfm, mermaid
2. **Create MermaidDiagram component**: Handles async mermaid rendering
3. **Create MarkdownRenderer component**: Styled markdown with prose classes
4. **Create ProjectDocsSheet component**: Main sheet with sections
5. **Create projectDocs.ts**: Move documentation data here
6. **Modify Projects.tsx**: Integrate sheet and change Docs button behavior
7. **Add sample documentation**: Start with 1-2 projects as examples

---

## Mobile Considerations

- Sheet will take full width on mobile (already handled by Sheet component)
- Accordion starts collapsed on mobile to reduce scroll
- Mermaid diagrams will be horizontally scrollable if needed
- Touch-friendly close button and gestures

---

## Future Enhancements (Optional)

- PDF export of documentation
- Print-friendly styles
- Table of contents navigation for longer docs
- Syntax highlighting for code blocks in markdown

