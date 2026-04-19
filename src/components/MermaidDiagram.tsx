import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#8b5cf6",
    primaryTextColor: "#fef6f3",
    primaryBorderColor: "#a78bfa",
    lineColor: "#a78bfa",
    secondaryColor: "#1e1b4b",
    tertiaryColor: "#0f0a1e",
    background: "#0f0a1e",
    mainBkg: "#1e1b4b",
    nodeBorder: "#a78bfa",
    clusterBkg: "#1e1b4b",
    edgeLabelBackground: "#1e1b4b",
    fontFamily: "Inter, sans-serif",
  },
  flowchart: {
    curve: "basis",
    padding: 20,
    htmlLabels: true,
  },
});

/**
 * Strip the common leading whitespace from every line of a multi-line string.
 * Mermaid v11 is strict about leading indentation before directives like
 * `flowchart TB` or `subgraph`, so we normalize template-literal indentation.
 */
const dedent = (input: string): string => {
  if (!input) return input;
  // Drop leading/trailing blank lines
  const lines = input.replace(/^\n+|\n+$/g, "").split("\n");
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^(\s*)/)?.[1].length ?? 0);
  const minIndent = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(minIndent)).join("\n");
};

const makeId = () => {
  const raw =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now()}${Math.floor(Math.random() * 1e9)}`;
  return `mermaid-${raw}`;
};

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram = ({ chart, className = "" }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const renderDiagram = async () => {
      if (!chart) return;
      const cleaned = dedent(chart);

      try {
        // Validate first so we surface real syntax errors instead of hanging.
        await mermaid.parse(cleaned);
        const id = makeId();
        const { svg: renderedSvg } = await mermaid.render(id, cleaned);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to render diagram";
          setError(message);
        }
      }
    };

    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-destructive/10 text-destructive text-xs font-mono whitespace-pre-wrap ${className}`}>
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className={`p-4 rounded-lg bg-muted animate-pulse ${className}`}>
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          Loading diagram...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto rounded-lg bg-card/50 p-4 [&_svg]:max-w-full [&_svg]:h-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
