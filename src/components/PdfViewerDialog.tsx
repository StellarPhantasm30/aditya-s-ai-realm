import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import type { TechNote } from "@/data/notes";

interface PdfViewerDialogProps {
  note: TechNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PdfViewerDialog = ({ note, open, onOpenChange }: PdfViewerDialogProps) => {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0 bg-background border-border">
        <DialogHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <div className="min-w-0 pr-8">
            <DialogTitle className="truncate text-lg">{note.title}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {note.tags.join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 mr-6">
            {note.linkedin_url && (
              <Button asChild variant="ghost" size="sm">
                <a href={note.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </Button>
            )}
            <Button asChild size="sm">
              <a href={note.pdf_url} download>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 bg-muted">
          <iframe
            src={`${note.pdf_url}#view=FitH`}
            title={note.title}
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerDialog;
