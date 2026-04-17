# Technical Notes & Blog Page

Add a dedicated section to showcase your LinkedIn technical notes/PDFs created in Figma, with preview + download capability.

---

## Recommendation: Format Choice

**Use PDF as the primary format with a JPG/PNG cover image as the thumbnail.**


| Format                 | Pros                                                                               | Cons                                                                    | Verdict                         |
| ---------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| **PDF**                | Single file, preserves layout, downloadable, universally readable, searchable text | Larger size, needs viewer                                               | **Best for download + reading** |
| **SVG (Figma layers)** | Crisp at any zoom, small for vector content, web-native                            | Heavy if many embedded images/text layers, font issues, 1 file per page | Not ideal for multi-page notes  |
| **PNG/JPG**            | Fast preview, reliable rendering                                                   | Not selectable text, large at high-res, not great to download           | Good for **thumbnails only**    |


### Optimal hybrid approach

1. **Thumbnail**: Export the cover slide from Figma as **WebP** (or JPG, ~100-200KB) — fast loading grid preview
2. **Full document**: Upload the **PDF** — opens in a viewer modal and is downloadable
3. **Optionally**: Generate a low-res PDF preview for in-page viewing, full-res for download

This keeps the grid lightning fast while giving users the rich PDF experience.

---

## Where to Put It

**Recommendation: A dedicated `/notes` route** (not a section on the homepage).

Why a separate page over a homepage section:

- You'll likely accumulate many notes over time — homepage would get bloated
- Dedicated URL is shareable on LinkedIn posts (e.g., `yoursite.com/notes`)
- Allows filtering, searching, and pagination later
- Better SEO for individual notes

Add **"Notes"** to the top navigation alongside About/Skills/Projects.

---

## Page Architecture

```text
/notes route
+-- Page Header
|   +-- Title: "Technical Notes"
|   +-- Subtitle + LinkedIn link
|   +-- (Future) Search + tag filter
|
+-- Notes Grid (3 columns desktop, 1 mobile)
|   +-- NoteCard
|       +-- Cover thumbnail (WebP)
|       +-- Title + date + tags
|       +-- "Preview" + "Download PDF" buttons
|
+-- PDF Viewer Modal (on Preview click)
    +-- Embedded PDF (react-pdf or <iframe>)
    +-- Download button
    +-- Share link
```

---

## Technical Approach

### PDF Viewing Options


| Option                                   | Bundle Impact | Quality                 | Pick                                      |
| ---------------------------------------- | ------------- | ----------------------- | ----------------------------------------- |
| Browser native `<iframe src="file.pdf">` | None          | Good, varies by browser | **Recommended for v1**                    |
| `react-pdf` (PDF.js)                     | ~300KB        | Full control, custom UI | Use if you need annotations/zoom controls |
| `@react-pdf-viewer/core`                 | ~200KB        | Polished viewer UI      | Good middle ground                        |


Start with native `<iframe>` inside a Dialog — zero dependencies, works everywhere. Upgrade later if needed.

### File Storage

For now make a directory notes in public folder i will upload there. i will decide the cloud to use and then we can integrate with object store. 

- Create a public `notes` bucket(later)
- Upload PDFs + thumbnails through the dashboard or an admin form
- Metadata (title, date, tags, file paths) stored in a `notes` table
- Public read access; write restricted to you

Alternative for simplest start: drop PDFs in `/public/notes/` and hardcode in a `notesData.ts` file — but you'd need a code change for every new note. **Cloud is better long-term.**

---

## Data Structure

```typescript
interface TechNote {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;   // WebP cover
  pdf_url: string;         // Full PDF
  tags: string[];          // ["LLMOps", "RAG", "System Design"]
  published_date: string;
  linkedin_url?: string;   // Optional link to original post
  page_count?: number;
  read_time_minutes?: number;
}
```

---

## Performance Best Practices

1. **Thumbnails**: WebP @ ~800px wide, lazy-loaded with `loading="lazy"`
2. **PDFs**: Don't load until user clicks "Preview" (no preloading)
3. **Optimize PDFs before upload**: Use `gs` (Ghostscript) or online tools to compress — typically 50-70% size reduction with no visible quality loss
4. **CDN delivery**: Supabase Storage serves via CDN automatically
5. **Pagination**: Show 9-12 notes per page once you have many

---

## Figma Export Workflow (for you)

For each note you create in Figma:

1. Export the **first frame as WebP** (1600px wide, 80% quality) → thumbnail
2. Export **all frames as a single PDF** (File → Export Frames to PDF)
3. Upload both to the `/notes` admin page
4. Fill in title, tags, description

---

## Files to Create/Modify


| File                                        | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `src/pages/Notes.tsx`                       | New notes listing page                  |
| `src/components/NoteCard.tsx`               | Individual note card with thumbnail     |
| `src/components/PdfViewerDialog.tsx`        | Modal with iframe PDF viewer + download |
| `src/data/notes.ts` (or DB table)           | Notes metadata                          |
| `src/components/Navigation.tsx`             | Add "Notes" link                        |
| `src/App.tsx`                               | Add `/notes` route                      |
| (Optional) `src/pages/admin/NotesAdmin.tsx` | Form to upload new notes                |


---

## Implementation Phases

**Phase 1 (MVP)** — get something live fast

- Hardcoded notes array in `notes.ts`
- PDFs in `/public/notes/`
- Grid + iframe modal + download button

**Phase 2** — scale up

- Cloud storage bucket + `notes` table
- Admin upload page (protected by your role)
- Tags/search/filter

**Phase 3** — polish

- Replace iframe with `@react-pdf-viewer` for branded UI
- Track downloads (analytics)
- "Related notes" suggestions

---

## Questions to Confirm Before Building

1. Start with **Phase 1 hardcoded** (faster) or jump straight to **Phase 2 Cloud storage with admin upload** (more setup but no code changes per note)?phase 1
2. Should the PDF preview be **modal/dialog** (stays on page) or **full-screen page** (`/notes/[slug]`)? stay on page
3. Do you want **tags/categories** filtering from day one, or add later? Add now