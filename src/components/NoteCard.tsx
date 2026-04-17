import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TechNote } from "@/data/notes";

interface NoteCardProps {
  note: TechNote;
  onPreview: (note: TechNote) => void;
}

const NoteCard = ({ note, onPreview }: NoteCardProps) => {
  const formattedDate = new Date(note.published_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden glass border-border/50 hover:border-primary/50 transition-colors">
        <button
          onClick={() => onPreview(note)}
          className="relative aspect-[4/3] overflow-hidden bg-muted group"
          aria-label={`Preview ${note.title}`}
        >
          <img
            src={note.thumbnail_url}
            alt={`${note.title} cover`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <Badge variant="secondary" className="gap-1">
              <Eye className="h-3 w-3" /> Preview
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="gap-1 backdrop-blur">
              <FileText className="h-3 w-3" />
              PDF
            </Badge>
          </div>
        </button>

        <CardContent className="flex-1 flex flex-col p-5 gap-3">
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="text-lg font-semibold leading-snug line-clamp-2">{note.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {note.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            {note.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {note.read_time_minutes} min
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => onPreview(note)} className="flex-1" size="sm">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={note.pdf_url} download aria-label={`Download ${note.title}`}>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NoteCard;
