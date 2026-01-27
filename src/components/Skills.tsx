import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Code, Cloud, Brain, Server, Settings, Layers
} from "lucide-react";

const skillCategories = [
  {
    name: "Programming & Databases",
    icon: Code,
    skills: ["Java", "Python", "MySQL", "FAISS", "Chroma", "Pinecone"],
    color: "from-blue-500 to-cyan-500",
    colorHex: "#3b82f6",
  },
  {
    name: "Backend & APIs",
    icon: Server,
    skills: ["FastAPI", "Flask", "REST", "MCP", "Streamlit", "Docker"],
    color: "from-green-500 to-emerald-500",
    colorHex: "#22c55e",
  },
  {
    name: "Cloud & DevOps",
    icon: Cloud,
    skills: ["AWS", "Azure", "Kafka", "Redis", "Git", "Serverless", "LiteLLM"],
    color: "from-orange-500 to-amber-500",
    colorHex: "#f97316",
  },
  {
    name: "Generative AI & ML",
    icon: Brain,
    skills: ["LangChain", "LangGraph", "CrewAI", "TensorFlow", "PEFT", "QLoRA", "Bedrock", "OpenAI"],
    color: "from-purple-500 to-pink-500",
    colorHex: "#a855f7",
  },
  {
    name: "LLMOps / MLOps",
    icon: Settings,
    skills: ["MLflow", "DVC", "Weights & Biases", "Langfuse", "LangSmith"],
    color: "from-red-500 to-rose-500",
    colorHex: "#ef4444",
  },
  {
    name: "Architecture & Practices",
    icon: Layers,
    skills: ["Microservices", "System Design", "Agile/SCRUM", "DSA"],
    color: "from-indigo-500 to-violet-500",
    colorHex: "#6366f1",
  },
];

// Fixed node positions for aesthetic neural network layout
const nodePositions = [
  { x: 50, y: 10 },   // Programming - top center
  { x: 20, y: 30 },   // Backend - top left
  { x: 80, y: 30 },   // Cloud - top right
  { x: 50, y: 50 },   // GenAI - center (main node)
  { x: 20, y: 70 },   // LLMOps - bottom left
  { x: 80, y: 70 },   // Architecture - bottom right
];

// Fixed connections between related skills
const connections = [
  { from: 0, to: 1 },  // Programming -> Backend
  { from: 0, to: 2 },  // Programming -> Cloud
  { from: 0, to: 3 },  // Programming -> GenAI
  { from: 1, to: 2 },  // Backend -> Cloud
  { from: 1, to: 4 },  // Backend -> LLMOps
  { from: 2, to: 4 },  // Cloud -> LLMOps
  { from: 2, to: 5 },  // Cloud -> Architecture
  { from: 3, to: 4 },  // GenAI -> LLMOps
  { from: 3, to: 5 },  // GenAI -> Architecture
  { from: 4, to: 5 },  // LLMOps -> Architecture
  { from: 1, to: 3 },  // Backend -> GenAI
  { from: 3, to: 2 },  // GenAI -> Cloud
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <section id="skills" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

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

        {/* Desktop: Neural Network Visualization */}
        {!isMobile && (
          <div className="hidden lg:block relative h-[700px] mb-12">
            {/* SVG for connections and glow effects */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                {/* Gradient for connection lines */}
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="hsl(270, 60%, 50%)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.6" />
                </linearGradient>
                {/* Glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Connection lines */}
              {connections.map((conn, idx) => {
                const from = nodePositions[conn.from];
                const to = nodePositions[conn.to];
                const isHighlighted = activeNode === conn.from || activeNode === conn.to;
                
                return (
                  <motion.line
                    key={idx}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeOpacity={isHighlighted ? 1 : 0.4}
                    filter={isHighlighted ? "url(#glow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.3 + idx * 0.05 }}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Animated particles along connections */}
              {connections.map((conn, idx) => {
                const from = nodePositions[conn.from];
                const to = nodePositions[conn.to];
                
                return (
                  <motion.circle
                    key={`particle-${idx}`}
                    r="3"
                    fill="hsl(217, 91%, 60%)"
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? {
                      opacity: [0, 1, 0],
                      cx: [`${from.x}%`, `${to.x}%`],
                      cy: [`${from.y}%`, `${to.y}%`],
                    } : {}}
                    transition={{
                      duration: 3,
                      delay: 1 + idx * 0.3,
                      repeat: Infinity,
                      repeatDelay: connections.length * 0.3,
                    }}
                  />
                );
              })}
            </svg>

            {/* Skill Nodes */}
            {skillCategories.map((category, index) => {
              const pos = nodePositions[index];
              const Icon = category.icon;
              const isActive = activeNode === index;
              const isCenter = index === 3; // GenAI is the center node

              return (
                <motion.div
                  key={category.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                  onMouseEnter={() => setActiveNode(index)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Node Circle with gradient ring */}
                  <motion.div
                    className={`relative cursor-pointer transition-all duration-300 ${
                      isActive ? "z-30" : "z-10"
                    }`}
                    whileHover={{ scale: 1.15 }}
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {/* Outer glow ring */}
                    <div 
                      className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                        isActive ? "opacity-60" : "opacity-0"
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${category.colorHex}, ${category.colorHex}88)`,
                        transform: "scale(1.3)",
                      }}
                    />
                    
                    {/* Gradient ring border */}
                    <div
                      className={`${isCenter ? "w-24 h-24" : "w-20 h-20"} rounded-full p-[3px] relative`}
                      style={{ 
                        background: `linear-gradient(135deg, ${category.colorHex}, ${category.colorHex}66)`,
                      }}
                    >
                      {/* Inner circle */}
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center relative overflow-hidden">
                        {/* Subtle inner glow */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{ 
                            background: `radial-gradient(circle at center, ${category.colorHex}40, transparent 70%)`,
                          }}
                        />
                        <Icon className={`${isCenter ? "w-10 h-10" : "w-8 h-8"} text-foreground relative z-10`} />
                      </div>
                    </div>

                    {/* Category Label */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span 
                        className={`text-sm font-semibold transition-all duration-300 ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                        style={isActive ? { color: category.colorHex } : {}}
                      >
                        {category.name}
                      </span>
                    </div>

                    {/* Expanded Skills Panel */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-14 z-40"
                      >
                        <div 
                          className="glass rounded-xl p-5 min-w-[280px] border border-border/50"
                          style={{ 
                            boxShadow: `0 0 30px ${category.colorHex}20`,
                          }}
                        >
                          {/* Panel header */}
                          <div className="mb-3 pb-2 border-b border-border/30">
                            <h4 
                              className="font-bold text-base"
                              style={{ 
                                background: `linear-gradient(135deg, ${category.colorHex}, hsl(270, 60%, 50%))`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {category.name}
                            </h4>
                          </div>
                          
                          {/* Skills chips */}
                          <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIdx) => (
                              <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: skillIdx * 0.03 }}
                                className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-transform hover:scale-105"
                                style={{ 
                                  background: `linear-gradient(135deg, ${category.colorHex}, ${category.colorHex}cc)`,
                                }}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile & Tablet: Card Grid */}
        <div className={`${isMobile ? "block" : "lg:hidden"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => {
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
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-colors"
                      >
                        {skill}
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
