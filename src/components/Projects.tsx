import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Validate.AI",
    description: "Enterprise-wide LLMOps platform handling 100% organizational LLM traffic with RBAC, observability, cost tracking, and compliance.",
    tags: ["LLMOps", "Python", "FastAPI", "LiteLLM", "Langfuse"],
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    title: "Agentic RAG System",
    description: "Intelligent test case generation system for 900+ APIs using agentic RAG architecture with automated validation pipelines.",
    tags: ["LangGraph", "CrewAI", "RAG", "Python", "AWS"],
    gradient: "from-purple-600 to-pink-600",
  },
  {
    title: "GenAI Chatbot",
    description: "Production-ready chatbot with fine-tuned LLMs, custom guardrails, and evaluation pipelines for enterprise deployment.",
    tags: ["LLM Fine-tuning", "PEFT", "QLoRA", "TensorFlow"],
    gradient: "from-green-600 to-emerald-600",
  },
  {
    title: "AIOps Agents",
    description: "Autonomous AI agents for IT operations, enabling self-healing infrastructure and intelligent incident response.",
    tags: ["LangChain", "Agents", "Azure", "Microservices"],
    gradient: "from-orange-600 to-amber-600",
  },
  {
    title: "Azure LLM Deployment",
    description: "End-to-end deployment pipeline for open-source LLMs on Azure with scalable inference and cost optimization.",
    tags: ["Azure ML", "Docker", "Kubernetes", "MLOps"],
    gradient: "from-red-600 to-rose-600",
  },
  {
    title: "Full-stack GenAI App",
    description: "Complete GenAI application with Dockerized microservices, real-time streaming, and enterprise-grade security.",
    tags: ["Docker", "FastAPI", "React", "Redis", "Kafka"],
    gradient: "from-indigo-600 to-violet-600",
  },
];

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100px" } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Enterprise-grade AI solutions built with cutting-edge technologies
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full glass neon-border card-hover group overflow-hidden">
                {/* Gradient Thumbnail */}
                <div className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Sparkles className="w-12 h-12 text-white/80" />
                  </motion.div>
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
