

# Fix Mermaid Rendering + Convert Doc Sections to Markdown

Two issues to fix in the project documentation sheet.

---

## Issue 1: Mermaid Diagrams Stuck on "Loading diagram..."

### Root cause
Three compounding problems in `MermaidDiagram.tsx` + how it's mounted:

1. **Renders while hidden**: The diagram lives inside a `Collapsible` that starts **closed**. Radix mounts the content but hides it. Mermaid v11's `render()` can silently fail or hang when invoked against a hidden/unmeasurable container during the initial render.
2. **Indented chart strings**: The diagrams in `projectDocs.ts` are written inside template literals with **leading indentation on every line** (4–8 spaces). Mermaid v11 is stricter — leading whitespace before `flowchart TB` and on `subgraph` blocks can cause parse errors that we currently swallow.
3. **No validation / poor error surfacing**: We `console.error` but show a generic "Failed to render". When parsing fails the user just sees "Loading diagram…" forever because the catch sets `error` but only after the await — and any thrown sync error inside `render` isn't caught with the current ID format (`mermaid.render` rejects IDs starting with a digit in some cases — ours uses `mermaid-{timestamp}` which is fine, but worth hardening).

### Fix

**`src/components/MermaidDiagram.tsx`**:
- Add a `dedent` helper that strips the common leading whitespace from the chart string before rendering (handles the indented template literals cleanly).
- Call `await mermaid.parse(chart)` first to validate — if it throws, show the actual error message so we can debug, instead of just "Failed to render".
- Render lazily: only call `mermaid.render` when the component is actually visible. Use an `IntersectionObserver` (or just trigger when `chart` changes after mount) so the collapsible-hidden case is handled.
- Use a safer unique ID: `mermaid-${crypto.randomUUID().replace(/-/g, '')}` (no dependency on `Math.random` substr quirks).

**`src/components/ProjectDocsSheet.tsx`**:
- Mount the `MermaidDiagram` only when `architectureOpen === true` (conditional render). This guarantees mermaid renders against a visible DOM node and eliminates the hidden-container failure mode entirely.

**`src/data/projectDocs.ts`**:
- Optional: clean up the diagram strings to remove unnecessary leading indentation so they're consistent. The dedent helper handles it either way, but cleaner data is better.

---

## Issue 2: Doc Sections Render as Plain Text (No Markdown)

Currently in `ProjectDocsSheet.tsx`, only `designDecisions`, `alternatives`, and `edgeCases` use `MarkdownRenderer`. The four overview sections use plain `<p>` tags:

| Section | Current | Should be |
|---|---|---|
| Problem Statement | `<p>` | `MarkdownRenderer` |
| My Role | `<p>` | `MarkdownRenderer` |
| Scale & Constraints | `<p>` | `MarkdownRenderer` |
| Outcome & Impact | `<p>` | `MarkdownRenderer` |

This is why the SentinelAI problem statement renders as one giant blob — the bullet lines (`- No centralized control...`) and section headers (`Business Problems:`) never get formatted.

### Fix

**`src/components/ProjectDocsSheet.tsx`**: Replace the four `<p className="text-muted-foreground...">{...}</p>` blocks with `<MarkdownRenderer content={...} />`.

**`src/data/projectDocs.ts`**: Clean the overview content so it's valid markdown:
- Remove leading per-line indentation from template literals (current indentation makes markdown parsers treat lines as code blocks).
- Convert the manual `Business Problems:` / `Technical Problems:` style into proper markdown headings (`### Business Problems`) and bullet lists.
- Same dedent treatment for `role`, `scale`, `outcome` where multi-line.

I'll do this for all 6 projects in a single pass so formatting is consistent.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/MermaidDiagram.tsx` | Add dedent, validate with `mermaid.parse`, surface real errors, safer unique ID |
| `src/components/ProjectDocsSheet.tsx` | Lazy-mount diagram on open; switch overview sections to `MarkdownRenderer` |
| `src/data/projectDocs.ts` | Dedent diagrams; rewrite overview fields as proper markdown for all 6 projects |

No new dependencies. No visual layout changes — diagrams will simply appear, and overview text will gain bullets/headings.

