import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
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
  },
});

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram = ({ chart, className = "" }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      try {
        // Generate unique ID for each render
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram");
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-destructive/10 text-destructive text-sm ${className}`}>
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
      className={`overflow-x-auto rounded-lg bg-card/50 p-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
