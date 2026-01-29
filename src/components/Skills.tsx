import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SiJavascript, SiTypescript, SiDatabricks, SiLeetcode, SiAwslambda, SiPython, SiPostgresql, SiFastapi, SiFlask, SiDocker, SiStreamlit, SiApachekafka, SiRedis, SiGit, SiTensorflow, SiLangchain, SiOpenai, SiMlflow, SiWeightsandbiases, SiDvc, SiScikitlearn, SiCloudflare, SiGraphql, SiBookstack, SiMonero, SiScrutinizerci } from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import { IconType } from "react-icons";

// Clean category-based data structure
interface Skill {
  name: string;
  icon?: IconType;
  color: string;
}

interface SkillCategory {
  name: string;
  icon: IconType;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Programming",
    icon: SiDatabricks,
    color: "#3b82f6",
    skills: [
      { name: "Java", icon: FaJava, color: "#f89820" },
      { name: "Python", icon: SiPython, color: "#3776ab" },
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
    ]
  },
  {
    name: "Databases",
    icon: SiDatabricks,
    color: "#3b82f6",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4479a1" },
      { name: "FAISS", icon: SiDatabricks, color: "#00bcff" },
      { name: "Chroma", icon: SiDatabricks, color: "#ff6b6b" },
      { name: "Pinecone", icon: SiDatabricks, color: "#00d4aa" },
      { name: "Qdrant", icon: SiDatabricks, color: "#00d4aa" },
      { name: "Azure AI Search", icon: VscAzure, color: "#0089d6" },
    ]
  },
  {
    name: "Generative AI & ML",
    icon: SiBookstack,
    color: "#6366f1",
    skills: [
      { name: "TensorFlow", icon: SiTensorflow, color: "#ff6f00" },
      { name: "LangChain", icon: SiLangchain, color: "#2dd4bf" },
      { name: "LangGraph", icon: SiLangchain, color: "#2dd4bf" },
      { name: "CrewAI", color: "#ff6b6b" },
      { name: "Bedrock", icon: FaAws, color: "#ff9900" },
      { name: "scikit-learn", icon: SiScikitlearn, color: "#f7931e" },
      { name: "MCP", color: "#ff7675" },
      { name: "A2A", color: "#ff7675" },
    ]
  },
  {
    name: "LLMOps/MLOps",
    icon: SiWeightsandbiases,
    color: "#ef4444",
    skills: [
      { name: "DVC", icon: SiDvc, color: "#13adc7" },
      { name: "Langfuse", icon: SiGraphql, color: "#2dd4bf" },
      { name: "LangSmith", icon: SiLangchain, color: "#2dd4bf" },
      { name: "LiteLLM", icon: SiCloudflare, color: "#a855f7" },
      { name: "MLflow", icon: SiMlflow, color: "#0194e2" },
      { name: "W&B", icon: SiWeightsandbiases, color: "#ffbe00" },
    ]
  },
  {
    name: "Backend & APIs",
    icon: SiFastapi,
    color: "#22c55e",
    skills: [
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Flask", icon: SiFlask, color: "#ffffff" },
      { name: "Docker", icon: SiDocker, color: "#2496ed" },
      { name: "Streamlit", icon: SiStreamlit, color: "#ff4b4b" },
      { name: "Kafka", icon: SiApachekafka, color: "#dc382d" },
      { name: "Redis", icon: SiRedis, color: "#dc382d" },
    ]
  },
  {
    name: "Cloud & DevOps",
    icon: FaAws,
    color: "#f97316",
    skills: [
      { name: "AWS", icon: FaAws, color: "#ff9900" },
      { name: "Azure", icon: VscAzure, color: "#0089d6" },
      { name: "OpenAI", icon: SiOpenai, color: "#ffffff" },
      { name: "Serverless", icon: SiAwslambda, color: "#fd5750" },
      { name: "Git", icon: SiGit, color: "#f05032" },
    ]
  },
  {
    name: "Architecture",
    icon: SiBookstack,
    color: "#6366f1",
    skills: [
      { name: "Microservices", icon: SiGraphql, color: "#06b6d4" },
      { name: "Monolithic", icon: SiMonero, color: "#6366f1" },
      { name: "REST", color: "#6c5ce7" },
      { name: "System Design", icon: SiBookstack, color: "#8b5cf6" },
      { name: "Agile/SCRUM", icon: SiScrutinizerci, color: "#22c55e" },
      { name: "DSA", icon: SiLeetcode, color: "#f59e0b" },
    ]
  },
];

// Layout constants
const COLUMN_WIDTH = 170;
const ROW_HEIGHT = 100;
const PADDING = 60;
const NODE_RADIUS = 28;

// Calculate positions dynamically
const getPosition = (colIndex: number, rowIndex: number) => ({
  px: colIndex * COLUMN_WIDTH + PADDING,
  py: rowIndex * ROW_HEIGHT + PADDING,
});

// Get maximum number of rows across all categories
const maxRows = Math.max(...skillCategories.map(cat => cat.skills.length + 1));

// SVG dimensions
const svgWidth = skillCategories.length * COLUMN_WIDTH + PADDING * 2;
const svgHeight = maxRows * ROW_HEIGHT + PADDING;

// Skill node component
const SkillNode = ({ 
  name, 
  icon: Icon, 
  color, 
  colIndex, 
  rowIndex, 
  isInView,
  isHeader = false 
}: { 
  name: string; 
  icon?: IconType; 
  color: string; 
  colIndex: number; 
  rowIndex: number; 
  isInView: boolean;
  isHeader?: boolean;
}) => {
  const { px, py } = getPosition(colIndex, rowIndex);
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.2 + (colIndex + rowIndex) * 0.05, type: "spring", stiffness: 200 }}
    >
      <circle
        cx={px}
        cy={py}
        r={NODE_RADIUS}
        fill="#0f172a"
        stroke={color}
        strokeWidth={isHeader ? 5 : 4}
        style={{ filter: `drop-shadow(0 0 12px ${color}99)` }}
      />
      {Icon ? (
        <foreignObject x={px - 16} y={py - 16} width={32} height={32}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            <Icon style={{ color: color, width: 28, height: 28 }} />
          </div>
        </foreignObject>
      ) : (
        <text x={px} y={py + 6} textAnchor="middle" fontSize="14" fill={color} fontWeight="bold">
          {name.slice(0, 2)}
        </text>
      )}
      <text 
        x={px} 
        y={py + NODE_RADIUS + 18} 
        textAnchor="middle" 
        fontSize={isHeader ? "12" : "13"} 
        fill="#cbd5e1"
        fontWeight={isHeader ? "600" : "400"}
      >
        {name}
      </text>
    </motion.g>
  );
};

// Column connection line with glowing dot animation
const ColumnLine = ({ 
  colIndex, 
  skillCount, 
  color, 
  isInView 
}: { 
  colIndex: number; 
  skillCount: number; 
  color: string; 
  isInView: boolean;
}) => {
  const { px: x1, py: y1 } = getPosition(colIndex, 0);
  const { py: y2 } = getPosition(colIndex, skillCount);
  const lineId = `line-gradient-${colIndex}`;
  const glowId = `glow-${colIndex}`;
  
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay: 0.1 + colIndex * 0.05 }}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id={lineId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Main connection line */}
      <line
        x1={x1}
        y1={y1 + NODE_RADIUS}
        x2={x1}
        y2={y2}
        stroke={`url(#${lineId})`}
        strokeWidth="4"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
      />
      
      {/* Animated glowing dot */}
      <circle r="6" fill={color} filter={`url(#${glowId})`}>
        <animateMotion
          dur={`${3 + colIndex * 0.5}s`}
          repeatCount="indefinite"
          path={`M${x1},${y1 + NODE_RADIUS} L${x1},${y2}`}
        />
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </motion.g>
  );
};

// Mobile skill card
const SkillCard = ({ 
  skill, 
  index, 
  isInView 
}: { 
  skill: Skill; 
  index: number; 
  isInView: boolean;
}) => {
  const Icon = skill.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.03 }}
      className="glass rounded-xl p-4 card-hover neon-border flex items-center gap-3"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center" 
        style={{ background: skill.color + '22' }}
      >
        {Icon ? (
          <Icon className="w-6 h-6" style={{ color: skill.color }} />
        ) : (
          <span className="font-bold text-sm" style={{ color: skill.color }}>
            {skill.name.slice(0, 2)}
          </span>
        )}
      </div>
      <span className="font-medium text-sm">{skill.name}</span>
    </motion.div>
  );
};

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

        {/* Desktop: SVG Grid */}
        <div className="hidden lg:flex justify-center mb-12">
          <svg width={svgWidth} height={svgHeight} className="block" style={{ maxWidth: "100%" }}>
            {/* Draw connection lines first */}
            {skillCategories.map((category, colIndex) => (
              <ColumnLine
                key={`line-${category.name}`}
                colIndex={colIndex}
                skillCount={category.skills.length}
                color={category.color}
                isInView={isInView}
              />
            ))}
            
            {/* Draw category headers and skill nodes */}
            {skillCategories.map((category, colIndex) => (
              <g key={category.name}>
                {/* Category header */}
                <SkillNode
                  name={category.name}
                  icon={category.icon}
                  color={category.color}
                  colIndex={colIndex}
                  rowIndex={0}
                  isInView={isInView}
                  isHeader
                />
                
                {/* Skills in this category */}
                {category.skills.map((skill, rowIndex) => (
                  <SkillNode
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                    color={skill.color}
                    colIndex={colIndex}
                    rowIndex={rowIndex + 1}
                    isInView={isInView}
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>

        {/* Mobile & Tablet: Category Cards */}
        <div className="lg:hidden space-y-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + catIndex * 0.1 }}
            >
              <h3 
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: category.color }}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    index={catIndex * 10 + skillIndex}
                    isInView={isInView}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
