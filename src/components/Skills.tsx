import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Code, Cloud, Brain, Server, Settings, Layers
} from "lucide-react";
import { 
  SiPython, SiMysql, SiFastapi, SiFlask, SiDocker,
  SiStreamlit, SiApachekafka, SiRedis, SiGit, SiTensorflow,
  SiLangchain, SiOpenai, SiMlflow, SiWeightsandbiases
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

// Tool node interface
interface ToolNode {
  name: string;
  icon?: IconType;
  color: string;
}

// Hub data with tools
interface HubData {
  name: string;
  shortName: string;
  icon: LucideIcon;
  color: string;
  colorHex: string;
  tools: ToolNode[];
}

const hubsData: HubData[] = [
  {
    name: "Programming & Databases",
    shortName: "Programming",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    colorHex: "#3b82f6",
    tools: [
      { name: "Java", icon: FaJava, color: "#f89820" },
      { name: "Python", icon: SiPython, color: "#3776ab" },
      { name: "MySQL", icon: SiMysql, color: "#4479a1" },
      { name: "FAISS", color: "#00bcff" },
      { name: "Chroma", color: "#ff6b6b" },
      { name: "Pinecone", color: "#00d4aa" },
    ],
  },
  {
    name: "Backend & APIs",
    shortName: "Backend",
    icon: Server,
    color: "from-green-500 to-emerald-500",
    colorHex: "#22c55e",
    tools: [
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Flask", icon: SiFlask, color: "#ffffff" },
      { name: "REST", color: "#6c5ce7" },
      { name: "MCP", color: "#ff7675" },
      { name: "Streamlit", icon: SiStreamlit, color: "#ff4b4b" },
      { name: "Docker", icon: SiDocker, color: "#2496ed" },
    ],
  },
  {
    name: "Cloud & DevOps",
    shortName: "Cloud",
    icon: Cloud,
    color: "from-orange-500 to-amber-500",
    colorHex: "#f97316",
    tools: [
      { name: "AWS", icon: FaAws, color: "#ff9900" },
      { name: "Azure", icon: VscAzure, color: "#0089d6" },
      { name: "Kafka", icon: SiApachekafka, color: "#231f20" },
      { name: "Redis", icon: SiRedis, color: "#dc382d" },
      { name: "Git", icon: SiGit, color: "#f05032" },
      { name: "Serverless", color: "#fd5750" },
      { name: "LiteLLM", color: "#a855f7" },
    ],
  },
  {
    name: "Generative AI & ML",
    shortName: "GenAI",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    colorHex: "#a855f7",
    tools: [
      { name: "LangChain", icon: SiLangchain, color: "#1c3c3c" },
      { name: "LangGraph", color: "#2dd4bf" },
      { name: "CrewAI", color: "#ff6b6b" },
      { name: "TensorFlow", icon: SiTensorflow, color: "#ff6f00" },
      { name: "PEFT", color: "#fbbf24" },
      { name: "QLoRA", color: "#8b5cf6" },
      { name: "Bedrock", color: "#ff9900" },
      { name: "OpenAI", icon: SiOpenai, color: "#412991" },
    ],
  },
  {
    name: "LLMOps / MLOps",
    shortName: "LLMOps",
    icon: Settings,
    color: "from-red-500 to-rose-500",
    colorHex: "#ef4444",
    tools: [
      { name: "MLflow", icon: SiMlflow, color: "#0194e2" },
      { name: "DVC", color: "#13adc7" },
      { name: "W&B", icon: SiWeightsandbiases, color: "#ffbe00" },
      { name: "Langfuse", color: "#3b82f6" },
      { name: "LangSmith", color: "#10b981" },
    ],
  },
  {
    name: "Architecture & Practices",
    shortName: "Architecture",
    icon: Layers,
    color: "from-indigo-500 to-violet-500",
    colorHex: "#6366f1",
    tools: [
      { name: "Microservices", color: "#06b6d4" },
      { name: "System Design", color: "#8b5cf6" },
      { name: "Agile/SCRUM", color: "#22c55e" },
      { name: "DSA", color: "#f59e0b" },
    ],
  },
];

// Hub cluster positions (percentage-based for responsive layout)
const hubPositions = [
  { x: 16, y: 22 },   // Programming - top left
  { x: 50, y: 18 },   // Backend - top center
  { x: 84, y: 22 },   // Cloud - top right
  { x: 50, y: 52 },   // GenAI - center (main)
  { x: 16, y: 82 },   // LLMOps - bottom left
  { x: 84, y: 82 },   // Architecture - bottom right
];

// Generate tool positions around a hub in a circular pattern
const getToolPositions = (hubX: number, hubY: number, numTools: number, radius: number = 12) => {
  const positions: { x: number; y: number }[] = [];
  const startAngle = -90; // Start from top
  const angleStep = 360 / numTools;
  
  for (let i = 0; i < numTools; i++) {
    const angle = (startAngle + i * angleStep) * (Math.PI / 180);
    positions.push({
      x: hubX + radius * Math.cos(angle),
      y: hubY + radius * Math.sin(angle) * 0.7, // Compress vertically slightly
    });
  }
  return positions;
};

// Hub Node Component
const HubNode = ({ 
  hub, 
  position, 
  index, 
  isInView 
}: { 
  hub: HubData; 
  position: { x: number; y: number }; 
  index: number;
  isInView: boolean;
}) => {
  const Icon = hub.icon;
  const isCenter = index === 3; // GenAI is center

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 150 }}
    >
      {/* Outer pulse glow */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${hub.colorHex}60 0%, transparent 70%)`,
          transform: "scale(2)",
        }}
      />
      
      {/* Hub circle with gradient ring */}
      <div
        className={`${isCenter ? "w-[90px] h-[90px]" : "w-[80px] h-[80px]"} rounded-full p-[3px] relative`}
        style={{ 
          background: `linear-gradient(135deg, ${hub.colorHex}, ${hub.colorHex}88)`,
          boxShadow: `0 0 30px ${hub.colorHex}40, 0 0 60px ${hub.colorHex}20`,
        }}
      >
        {/* Inner glassmorphism circle */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              background: `radial-gradient(circle at center, ${hub.colorHex}50, transparent 70%)`,
            }}
          />
          <Icon className={`${isCenter ? "w-10 h-10" : "w-8 h-8"} relative z-10`} style={{ color: hub.colorHex }} />
        </div>
      </div>

      {/* Hub Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span 
          className="text-xs font-bold uppercase tracking-wider"
          style={{ 
            color: hub.colorHex,
            textShadow: `0 0 10px ${hub.colorHex}60`,
          }}
        >
          {hub.shortName}
        </span>
      </div>
    </motion.div>
  );
};

// Tool Node Component
const ToolNode = ({ 
  tool, 
  position, 
  delay, 
  isInView 
}: { 
  tool: ToolNode; 
  position: { x: number; y: number }; 
  delay: number;
  isInView: boolean;
}) => {
  const Icon = tool.icon;

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, type: "spring", stiffness: 200 }}
    >
      {/* Tool circle */}
      <div
        className="w-[52px] h-[52px] rounded-full p-[2px] relative group"
        style={{ 
          background: `linear-gradient(135deg, ${tool.color}cc, ${tool.color}66)`,
          boxShadow: `0 0 15px ${tool.color}30`,
        }}
      >
        {/* Inner glassmorphism circle */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-110"
          style={{
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
            style={{ 
              background: `radial-gradient(circle at center, ${tool.color}60, transparent 70%)`,
            }}
          />
          {Icon ? (
            <Icon className="w-5 h-5 relative z-10" style={{ color: tool.color }} />
          ) : (
            <span 
              className="text-xs font-bold relative z-10"
              style={{ color: tool.color }}
            >
              {tool.name.slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      {/* Tool Label */}
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span 
          className="text-[10px] font-medium text-muted-foreground"
        >
          {tool.name}
        </span>
      </div>
    </motion.div>
  );
};

// Connection Line Component
const ConnectionLine = ({
  from,
  to,
  color,
  delay,
  isInView,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  delay: number;
  isInView: boolean;
}) => (
  <motion.line
    x1={`${from.x}%`}
    y1={`${from.y}%`}
    x2={`${to.x}%`}
    y2={`${to.y}%`}
    stroke={color}
    strokeWidth="1.5"
    strokeOpacity="0.5"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
    transition={{ duration: 0.8, delay }}
    filter="url(#lineGlow)"
  />
);

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  return (
    <section id="skills" className="py-20 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ 
            background: "radial-gradient(circle, hsl(217, 91%, 60%) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ 
            background: "radial-gradient(circle, hsl(270, 60%, 50%) 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
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

        {/* Desktop: Static Hierarchical Skill Graph */}
        {!isMobile && (
          <div className="hidden lg:block relative h-[800px] mb-12">
            {/* SVG for all connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                {/* Glow filter for lines */}
                <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Gradient for connecting lines */}
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                  <stop offset="100%" stopColor="hsl(270, 60%, 50%)" />
                </linearGradient>
              </defs>

              {/* Draw connection lines from each hub to its tools */}
              {hubsData.map((hub, hubIndex) => {
                const hubPos = hubPositions[hubIndex];
                const toolPositions = getToolPositions(hubPos.x, hubPos.y, hub.tools.length);
                
                return hub.tools.map((tool, toolIndex) => (
                  <ConnectionLine
                    key={`${hubIndex}-${toolIndex}`}
                    from={hubPos}
                    to={toolPositions[toolIndex]}
                    color={hub.colorHex}
                    delay={0.5 + hubIndex * 0.1 + toolIndex * 0.05}
                    isInView={isInView}
                  />
                ));
              })}

              {/* Inter-hub connections (subtle background lines) */}
              {[
                { from: 0, to: 1 },
                { from: 1, to: 2 },
                { from: 0, to: 3 },
                { from: 1, to: 3 },
                { from: 2, to: 3 },
                { from: 3, to: 4 },
                { from: 3, to: 5 },
                { from: 4, to: 5 },
              ].map((conn, idx) => (
                <motion.line
                  key={`hub-conn-${idx}`}
                  x1={`${hubPositions[conn.from].x}%`}
                  y1={`${hubPositions[conn.from].y}%`}
                  x2={`${hubPositions[conn.to].x}%`}
                  y2={`${hubPositions[conn.to].y}%`}
                  stroke="url(#connectionGradient)"
                  strokeWidth="1"
                  strokeOpacity="0.15"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.2 + idx * 0.05 }}
                />
              ))}
            </svg>

            {/* Render all hub clusters */}
            {hubsData.map((hub, hubIndex) => {
              const hubPos = hubPositions[hubIndex];
              const toolPositions = getToolPositions(hubPos.x, hubPos.y, hub.tools.length);

              return (
                <div key={hub.name}>
                  {/* Hub Node */}
                  <HubNode
                    hub={hub}
                    position={hubPos}
                    index={hubIndex}
                    isInView={isInView}
                  />

                  {/* Tool Nodes */}
                  {hub.tools.map((tool, toolIndex) => (
                    <ToolNode
                      key={tool.name}
                      tool={tool}
                      position={toolPositions[toolIndex]}
                      delay={0.5 + hubIndex * 0.1 + toolIndex * 0.05}
                      isInView={isInView}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile & Tablet: Card Grid */}
        <div className={`${isMobile ? "block" : "lg:hidden"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hubsData.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass rounded-xl p-6 card-hover neon-border"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool) => (
                      <span
                        key={tool.name}
                        className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-colors"
                      >
                        {tool.name}
                      </span>
                    ))}
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
