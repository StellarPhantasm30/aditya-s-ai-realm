import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NoteCard from "@/components/NoteCard";
import PdfViewerDialog from "@/components/PdfViewerDialog";
import { notes, getAllTags, type TechNote } from "@/data/notes";

const Notes = () => {
  const [selectedNote, setSelectedNote] = useState<TechNote | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Technical Notes — Aditya Ravi Raj";
    const meta = document.querySelector('meta[name="description"]');
    const desc =
      "Visual technical notes on LLMOps, RAG, and AI systems — preview and download as PDF.";
    if (meta) meta.setAttribute("content", desc);
  }, []);

  const allTags = useMemo(() => getAllTags(notes), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        activeTags.length === 0 || activeTags.every((t) => n.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const openPreview = (note: TechNote) => {
    setSelectedNote(note);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 md:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="gradient-text">Notes</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Visual breakdowns of the systems I build and the ideas I explore — exported
            from Figma, free to download.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://www.linkedin.com/in/aditya-ravi-raj/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" /> Follow on LinkedIn
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/">← Back to portfolio</Link>
            </Button>
          </div>
        </motion.section>

        {/* Filters */}
        <section className="mb-10 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Filter:</span>
              {allTags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="focus:outline-none"
                    aria-pressed={active}
                  >
                    <Badge
                      variant={active ? "default" : "outline"}
                      className="cursor-pointer hover:border-primary transition-colors"
                    >
                      {tag}
                    </Badge>
                  </button>
                );
              })}
              {activeTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTags([])}
                  className="h-7 px-2 text-xs"
                >
                  <X className="h-3 w-3" /> Clear
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg mb-2">No notes match your filters.</p>
            <p className="text-sm">Try clearing tags or your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} onPreview={openPreview} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <PdfViewerDialog note={selectedNote} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Notes;
