# Notes assets

Drop technical-note files here. Each note needs two files referenced from `src/data/notes.ts`:

1. **Thumbnail**: `your-note-id.jpg` (or `.webp`) — ~1600px wide, 80% quality, ideally <200KB.
2. **PDF**: `your-note-id.pdf` — exported from Figma (File → Export Frames to PDF).

Then add an entry to `src/data/notes.ts`:

```ts
{
  id: "your-note-id",
  title: "...",
  description: "...",
  thumbnail_url: "/notes/your-note-id.jpg",
  pdf_url: "/notes/your-note-id.pdf",
  tags: ["LLMOps"],
  published_date: "2025-04-17",
  linkedin_url: "https://...",
  read_time_minutes: 6,
}
```

Tip: compress PDFs with Ghostscript before upload:

```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=out.pdf in.pdf
```
