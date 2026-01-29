import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SiJavascript, SiTypescript, SiDatabricks, SiLeetcode, SiAwslambda, SiPython, SiPostgresql, SiFastapi, SiFlask, SiDocker, SiStreamlit, SiApachekafka, SiRedis, SiGit, SiTensorflow, SiLangchain, SiOpenai, SiMlflow, SiWeightsandbiases, SiDvc, SiScikitlearn, SiCloudflare, SiGraphql, SiGooglecolab, SiPytorch, SiGooglecloud, SiBookstack, SiMonero, SiScrutinizerci } from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
// import {
//   LangGraph,
//   CrewAI,
//   Bedrock,
//   MCP,
//   AzureAI,
//   LangSmith
// } from "@lobehub/icons";

// Skill node interface for grid
interface SkillNode {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  color: string;
  x: number; // grid x
  y: number; // grid y
  connections: [number, number][]; // array of [x, y] grid coordinates to connect to
}
const x = -7;
const gap = 1.5;
const y = 0;

const position_programming = { x: x, y: y };
const position_databases = { x: x+gap, y: y };
const position_genai = { x: -4, y: y };
const position_llmops = { x: -2.5, y: y };
const position_backend = { x: -1, y: y };
const position_cloud = { x: 0.5, y: y };
const position_architecture = { x: 2, y: y };


// Define the grid and skills (example layout, can be tweaked for aesthetics)
const skillNodes: SkillNode[] = [
  // Programming Languages
  { name: "Programming", icon: SiDatabricks, color: "#3b82f6", x: position_programming.x, y: position_programming.y, connections: [[position_programming.x,position_programming.y+1]] },
  { name: "Java", icon: FaJava, color: "#f89820", x: position_programming.x, y: position_programming.y+1, connections: [[position_programming.x,position_programming.y+2]] },
  { name: "Python", icon: SiPython, color: "#3776ab", x: position_programming.x, y: position_programming.y+2, connections: [[position_programming.x,position_programming.y+3]] },
  { name: "JavaScript", icon: SiJavascript, color: "#3776ab", x: position_programming.x, y: position_programming.y+3, connections: [[position_programming.x,position_programming.y+4]] },
  { name: "TypeScript", icon: SiTypescript, color: "#3776ab", x: position_programming.x, y: position_programming.y+4, connections: [] },

  // Databases
  { name: "Databases", icon: SiDatabricks, color: "#3b82f6", x: position_databases.x, y: position_databases.y, connections: [[position_databases.x,position_databases.y+1]] },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4479a1", x: position_databases.x, y: position_databases.y+1, connections: [[position_databases.x,position_databases.y+2]] },
  { name: "FAISS", icon: SiDatabricks, color: "#00bcff", x: position_databases.x, y: position_databases.y+2, connections: [[position_databases.x,position_databases.y+3]] },
  { name: "Chroma", icon: SiDatabricks, color: "#ff6b6b", x: position_databases.x, y: position_databases.y+3, connections: [[position_databases.x,position_databases.y+4]] },
  { name: "Pinecone", icon: SiDatabricks, color: "#00d4aa", x: position_databases.x, y: position_databases.y+4, connections: [[position_databases.x,position_databases.y+5]] },
  { name: "Qdrant", icon: SiDatabricks, color: "#00d4aa", x: position_databases.x, y: position_databases.y+5, connections: [[position_databases.x,position_databases.y+6]] },
  { name: "Azure AI Search", icon: VscAzure, color: "#00d4aa", x: position_databases.x, y: position_databases.y+6, connections: [] },

  // Generative AI & ML
  { name: "Generative AI & ML", icon: SiBookstack, color: "#6366f1", x: position_genai.x, y: position_genai.y, connections: [[position_genai.x,position_genai.y+1]] },
  { name: "TensorFlow", icon: SiTensorflow, color: "#ff6f00", x: position_genai.x, y: position_genai.y+1, connections: [[position_genai.x,position_genai.y+2]] },
  { name: "LangChain", icon: SiLangchain, color: "#2dd4bf", x: position_genai.x, y: position_genai.y+2, connections: [[position_genai.x,position_genai.y+3]] },
  { name: "LangGraph", icon: SiLangchain, color: "#2dd4bf", x: position_genai.x, y: position_genai.y+3, connections: [[position_genai.x,position_genai.y+4]] },
  { name: "CrewAI", color: "#ff6b6b", x: position_genai.x, y: position_genai.y+4, connections: [[position_genai.x,position_genai.y+5]] },
  // { name: "PEFT", icon: SiPytorch, color: "#fbbf24", x: position_genai.x, y: position_genai.y+5, connections: [[position_genai.x,position_genai.y+6]] },
  // { name: "QLoRA", icon: null, color: "#8b5cf6", x: position_genai.x, y: position_genai.y+6, connections: [[position_genai.x,position_genai.y+7]] },
  { name: "Bedrock", icon: FaAws, color: "#ff9900", x: position_genai.x, y: position_genai.y+5, connections: [[position_genai.x,position_genai.y+6]] },
  { name: "scikit-learn", icon: SiScikitlearn, color: "#f7931e", x: position_genai.x, y: position_genai.y+6, connections: [[position_genai.x,position_genai.y+7]] },
  { name: "MCP", color: "#ff7675", x: position_genai.x, y: position_genai.y+7, connections: [[position_genai.x,position_genai.y+8]] },
  { name: "A2A", icon: null, color: "#ff7675", x: position_genai.x, y: position_genai.y+8, connections: [] },

  // LLMOps/MLOps
  { name: "LLMOps/MLOps", icon: SiWeightsandbiases, color: "#ef4444", x: position_llmops.x, y: position_llmops.y, connections: [[position_llmops.x,position_llmops.y+1]] },
  { name: "DVC", icon: SiDvc, color: "#13adc7", x: position_llmops.x, y: position_llmops.y+1, connections: [[position_llmops.x,position_llmops.y+2]] },
  { name: "Langfuse", icon: SiGraphql, color: "#2dd4bf", x: position_llmops.x, y: position_llmops.y+2, connections: [[position_llmops.x,position_llmops.y+3]] },
  { name: "LangSmith", icon: SiLangchain, color: "#2dd4bf", x: position_llmops.x, y: position_llmops.y+3, connections: [[position_llmops.x,position_llmops.y+4]] },
  { name: "LiteLLM", icon: SiCloudflare, color: "#a855f7", x: position_llmops.x, y: position_llmops.y+4, connections: [[position_llmops.x,position_llmops.y+5]] },
  { name: "MLflow", icon: SiMlflow, color: "#0194e2", x: position_llmops.x, y: position_llmops.y+5, connections: [[position_llmops.x,position_llmops.y+6]] },
  { name: "W&B", icon: SiWeightsandbiases, color: "#ffbe00", x: position_llmops.x, y: position_llmops.y+6, connections: [] },

  // Backend & APIs
  { name: "Backend & APIs", icon: SiFastapi, color: "#22c55e", x: position_backend.x, y: position_backend.y, connections: [[position_backend.x,position_backend.y+1]] },
  { name: "FastAPI", icon: SiFastapi, color: "#009688", x: position_backend.x, y: position_backend.y+1, connections: [[position_backend.x, position_backend.y+2]] },
  { name: "Flask", icon: SiFlask, color: "#ffffff", x: position_backend.x, y: position_backend.y+2, connections: [[position_backend.x, position_backend.y+3]] },
  { name: "Docker", icon: SiDocker, color: "#2496ed", x: position_backend.x, y: position_backend.y+3, connections: [[position_backend.x, position_backend.y+4]] },
  { name: "Streamlit", icon: SiStreamlit, color: "#ff4b4b", x: position_backend.x, y: position_backend.y+4, connections: [[position_backend.x, position_backend.y+5]] },
  { name: "Kafka", icon: SiApachekafka, color: "#dc382d", x: position_backend.x, y: position_backend.y+5, connections: [[position_backend.x, position_backend.y+6]] },
  { name: "Redis", icon: SiRedis, color: "#dc382d", x: position_backend.x, y: position_backend.y+6, connections: [[position_backend.x, position_backend.y+7]] },

  // Cloud & DevOps
  { name: "Cloud & DevOps", icon: SiGooglecloud, color: "#f97316", x: position_cloud.x, y: position_cloud.y, connections: [[position_cloud.x,position_cloud.y+1]] },
  { name: "AWS", icon: FaAws, color: "#ff9900", x: position_cloud.x, y: position_cloud.y+1, connections: [[position_cloud.x,position_cloud.y+2]] },
  { name: "Azure", icon: VscAzure, color: "#0089d6", x: position_cloud.x, y: position_cloud.y+2, connections: [[position_cloud.x,position_cloud.y+3]] },
  { name: "OpenAI", icon: SiOpenai, color: "#ffffff", x: position_cloud.x, y: position_cloud.y+3, connections: [[position_cloud.x,position_cloud.y+4]] },
  { name: "Serverless", icon: SiAwslambda, color: "#fd5750", x: position_cloud.x, y: position_cloud.y+4, connections: [[position_cloud.x,position_cloud.y+5]] },
  { name: "Git", icon: SiGit, color: "#f05032", x: position_cloud.x, y: position_cloud.y+5, connections: [] },

  // Architecture & Practices
  { name: "Architecture & Practices", icon: SiBookstack, color: "#6366f1", x: position_architecture.x, y: position_architecture.y, connections: [[position_architecture.x,position_architecture.y+1]] },
  { name: "Microservices", icon: SiGraphql, color: "#06b6d4", x: position_architecture.x, y: position_architecture.y+1, connections: [[position_architecture.x,position_architecture.y+2]] },
  { name: "Monolithic", icon: SiMonero, color: "#6366f1", x: position_architecture.x, y: position_architecture.y+2, connections: [[position_architecture.x,position_architecture.y+3]] },
  { name: "REST", icon: null, color: "#6c5ce7", x: position_architecture.x, y: position_architecture.y+3, connections: [[position_architecture.x,position_architecture.y+4]] },
  { name: "System Design", icon: SiBookstack, color: "#8b5cf6", x: position_architecture.x, y: position_architecture.y+4, connections: [[position_architecture.x,position_architecture.y+5]] },
  { name: "Agile/SCRUM", icon: SiScrutinizerci, color: "#22c55e", x: position_architecture.x, y: position_architecture.y+5, connections: [[position_architecture.x,position_architecture.y+6]] },
  { name: "DSA", icon: SiLeetcode, color: "#f59e0b", x: position_architecture.x, y: position_architecture.y+6, connections: [[position_architecture.x,position_architecture.y+7]] },
];

// Dynamically calculate grid bounds for full-width usage
const cellSize = 120;
const nodeRadius = 28;
const minX = Math.min(...skillNodes.map(n => n.x));
const maxX = Math.max(...skillNodes.map(n => n.x));
const minY = Math.min(...skillNodes.map(n => n.y));
const maxY = Math.max(...skillNodes.map(n => n.y));

// Helper to get pixel position from grid, using minX/minY for left/top padding
const getPos = (x: number, y: number) => ({
  px: (x - minX) * cellSize + 60,
  py: (y - minY) * cellSize + 60,
});

// Draw orthogonal path (right-angle) between two grid points
function OrthogonalPath({ from, to, color }: { from: { x: number, y: number }, to: { x: number, y: number }, color: string }) {
  const { px: x1, py: y1 } = getPos(from.x, from.y);
  const { px: x2, py: y2 } = getPos(to.x, to.y);
  // Go horizontal, then vertical (or vice versa)
  const midX = x2;
  const midY = y1;
  return (
    <polyline
      points={`${x1},${y1} ${midX},${midY} ${x2},${y2}`}
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinejoin="round"
      strokeOpacity={0.3}
      style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
    />
  );
}

// Skill node visual
function SkillNodeCircle({ node, isInView }: { node: SkillNode, isInView: boolean }) {
  const { px, py } = getPos(node.x, node.y);
  const Icon = node.icon;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.2 + (node.x + node.y) * 0.05, type: "spring", stiffness: 200 }}
    >
      <circle
        cx={px}
        cy={py}
        r={nodeRadius}
        fill="#0f172a"
        stroke={node.color}
        strokeWidth="4"
        style={{ filter: `drop-shadow(0 0 12px ${node.color}99)` }}
      />
      {Icon ? (
        <foreignObject x={px - 16} y={py - 16} width={32} height={32}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            {Icon.Color ? (
              <Icon.Color size={28} />
            ) : (
              <Icon style={{ color: node.color, width: 28, height: 28 }} />
            )}
          </div>
        </foreignObject>
      ) : (
        <text x={px} y={py + 6} textAnchor="middle" fontSize="14" fill={node.color} fontWeight="bold">{node.name.slice(0,2)}</text>
      )}
      <text x={px} y={py + nodeRadius + 18} textAnchor="middle" fontSize="13" fill="#cbd5e1">{node.name}</text>
    </motion.g>
  );
}

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // SVG size (dynamic based on min/max x/y)
  const width = (maxX - minX + 1) * cellSize + 120;
  const height = (maxY - minY + 1) * cellSize + 120;

  return (
    <section id="skills" className="pt-20 pb-0 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-8 blur-3xl"
          style={{ 
            background: "radial-gradient(circle, hsl(217, 91%, 60%) 0%, transparent 70%)",
            left: "5%",
            top: "15%",
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-8 blur-3xl"
          style={{ 
            background: "radial-gradient(circle, hsl(270, 60%, 50%) 0%, transparent 70%)",
            right: "5%",
            bottom: "15%",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100px" } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </motion.div>

        {/* Desktop: Brain Circuit SVG */}
        <div className="hidden lg:flex justify-center mb-12">
          <svg width={width} height={height} className="block" style={{ maxWidth: "100%" }}>
            {/* Draw all connections first */}
            {skillNodes.map((node, idx) =>
              node.connections.map((conn, cidx) => {
                const target = skillNodes.find(n => n.x === conn[0] && n.y === conn[1]);
                if (!target) return null;
                return (
                  <OrthogonalPath key={`${idx}-${cidx}`} from={{ x: node.x, y: node.y }} to={{ x: target.x, y: target.y }} color={node.color} />
                );
              })
            )}
            {/* Draw all nodes */}
            {skillNodes.map((node, idx) => (
              <SkillNodeCircle key={node.name} node={node} isInView={isInView} />
            ))}
          </svg>
        </div>

        {/* Mobile & Tablet: Card Grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillNodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="glass rounded-xl p-6 card-hover neon-border flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: node.color + '22' }}>
                    {Icon ? (
                      Icon.Color ? (
                        <Icon.Color size={28} />
                      ) : (
                        <Icon className="w-7 h-7" style={{ color: node.color }} />
                      )
                    ) : (
                      <span className="font-bold text-lg" style={{ color: node.color }}>{node.name.slice(0,2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{node.name}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
