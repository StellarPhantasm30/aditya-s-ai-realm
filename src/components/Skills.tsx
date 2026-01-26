import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Code, Cloud, Brain, Database, Settings, Layers,
  Cpu, Server, GitBranch, Zap
} from "lucide-react";

const skillCategories = [
  {
    name: "Programming & Databases",
    icon: Code,
    skills: ["Java", "Python", "MySQL", "FAISS", "Chroma", "Pinecone"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Backend & APIs",
    icon: Server,
    skills: ["FastAPI", "Flask", "REST", "MCP", "Streamlit", "Docker"],
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Cloud & DevOps",
    icon: Cloud,
    skills: ["AWS", "Azure", "Kafka", "Redis", "Git", "Serverless", "LiteLLM"],
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Generative AI & ML",
    icon: Brain,
    skills: ["LangChain", "LangGraph", "CrewAI", "TensorFlow", "PEFT", "QLoRA", "Bedrock", "OpenAI"],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "LLMOps / MLOps",
    icon: Settings,
    skills: ["MLflow", "DVC", "Weights & Biases", "Langfuse", "LangSmith"],
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Architecture & Practices",
    icon: Layers,
    skills: ["Microservices", "System Design", "Agile/SCRUM", "DSA"],
    color: "from-indigo-500 to-violet-500",
  },
];

// Node positions for desktop visualization
const nodePositions = [
  { x: 50, y: 20 },
  { x: 80, y: 35 },
  { x: 20, y: 40 },
  { x: 50, y: 55 },
  { x: 85, y: 65 },
  { x: 15, y: 75 },
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [connections, setConnections] = useState<{from: number, to: number}[]>([]);

  useEffect(() => {
    // Generate random connections between nodes
    const newConnections: {from: number, to: number}[] = [];
    for (let i = 0; i < skillCategories.length; i++) {
      for (let j = i + 1; j < skillCategories.length; j++) {
        if (Math.random() > 0.5) {
          newConnections.push({ from: i, to: j });
        }
      }
    }
    setConnections(newConnections);
  }, []);

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

        {/* Desktop: Node Network Visualization */}
        {!isMobile && (
          <div className="hidden lg:block relative h-[600px] mb-12">
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, idx) => {
                const from = nodePositions[conn.from];
                const to = nodePositions[conn.to];
                return (
                  <motion.line
                    key={idx}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    className="skill-line"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                );
              })}
            </svg>

            {/* Skill Nodes */}
            {skillCategories.map((category, index) => {
              const pos = nodePositions[index];
              const Icon = category.icon;
              const isActive = activeNode === index;

              return (
                <motion.div
                  key={category.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onMouseEnter={() => setActiveNode(index)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Node Circle */}
                  <motion.div
                    className={`relative cursor-pointer transition-all duration-300 ${
                      isActive ? "z-20" : "z-10"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${category.color} p-[2px] ${
                        isActive ? "neon-glow" : ""
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                    </div>

                    {/* Category Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-sm font-medium text-muted-foreground">
                        {category.name}
                      </span>
                    </div>

                    {/* Expanded Skills Panel */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-12 glass rounded-lg p-4 min-w-[200px] z-30"
                      >
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => (
                            <span
                              key={skill}
                              className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}
                            >
                              {skill}
                            </span>
                          ))}
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
