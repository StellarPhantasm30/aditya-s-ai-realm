import { motion } from "framer-motion";
import { Briefcase, Code, ChevronDown, Layers, Target, User, Gauge, Award } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import MermaidDiagram from "./MermaidDiagram";
import MarkdownRenderer from "./MarkdownRenderer";
import { ProjectDocumentation } from "@/data/projectDocs";

interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  type: "personal" | "enterprise";
}

interface ProjectDocsSheetProps {
  project: Project | null;
  documentation: ProjectDocumentation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="w-4 h-4 text-primary" />
    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h3>
  </div>
);

const ProjectDocsSheet = ({
  project,
  documentation,
  open,
  onOpenChange,
}: ProjectDocsSheetProps) => {
  const [architectureOpen, setArchitectureOpen] = useState(false);

  if (!project || !documentation) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 glass border-l border-primary/20"
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header with gradient bar */}
            <div className={`h-2 w-full bg-gradient-to-r ${project.gradient} rounded-full mb-6`} />

            <SheetHeader className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <SheetTitle className="text-2xl font-bold text-foreground">
                  {project.title}
                </SheetTitle>
                <Badge
                  className={`shrink-0 ${
                    project.type === "personal"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-purple-500 to-amber-500"
                  } text-white border-0`}
                >
                  {project.type === "personal" ? (
                    <>
                      <Code className="w-3 h-3 mr-1" />
                      Personal
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-3 h-3 mr-1" />
                      Enterprise
                    </>
                  )}
                </Badge>
              </div>
              <SheetDescription className="text-muted-foreground">
                {project.description}
              </SheetDescription>
            </SheetHeader>

            {/* Section 1: Project Overview */}
            <div className="space-y-6 mb-8">
              <div className="h-px bg-gradient-to-r from-primary/50 via-accent/50 to-transparent" />

              {/* Problem Statement */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SectionHeader icon={Target} title="Problem Statement" />
                <p className="text-muted-foreground leading-relaxed">
                  {documentation.overview.problem}
                </p>
              </motion.div>

              {/* Role & Ownership */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <SectionHeader icon={User} title="Your Role" />
                <p className="text-muted-foreground leading-relaxed">
                  {documentation.overview.role}
                </p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SectionHeader icon={Layers} title="Tech Stack" />
                <div className="flex flex-wrap gap-2">
                  {documentation.overview.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Scale & Constraints */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <SectionHeader icon={Gauge} title="Scale & Constraints" />
                <p className="text-muted-foreground leading-relaxed">
                  {documentation.overview.scale}
                </p>
              </motion.div>

              {/* Outcome */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SectionHeader icon={Award} title="Outcome & Impact" />
                <p className="text-muted-foreground leading-relaxed">
                  {documentation.overview.outcome}
                </p>
              </motion.div>
            </div>

            {/* Section 2: Architecture & Approach (Collapsible) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="h-px bg-gradient-to-r from-primary/50 via-accent/50 to-transparent mb-4" />

              <Collapsible open={architectureOpen} onOpenChange={setArchitectureOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 group">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold text-foreground">
                      Architecture & Approach
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      architectureOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-6 pt-4">
                  {/* Mermaid Diagram */}
                  {documentation.architecture.diagram && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                        System Architecture
                      </h4>
                      <MermaidDiagram
                        chart={documentation.architecture.diagram}
                        className="border border-primary/20 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Design Decisions */}
                  <div>
                    <MarkdownRenderer content={documentation.architecture.designDecisions} />
                  </div>

                  {/* Alternatives Considered */}
                  <div>
                    <MarkdownRenderer content={documentation.architecture.alternatives} />
                  </div>

                  {/* Edge Cases */}
                  <div>
                    <MarkdownRenderer content={documentation.architecture.edgeCases} />
                  </div>

                  {/* Optional Images */}
                  {documentation.images && documentation.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                        Additional Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentation.images.map((image, index) => (
                          <figure key={index} className="space-y-2">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="rounded-lg border border-primary/20"
                            />
                            {image.caption && (
                              <figcaption className="text-sm text-muted-foreground text-center">
                                {image.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectDocsSheet;
