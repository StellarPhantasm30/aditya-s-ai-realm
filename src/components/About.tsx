import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Terminal } from "lucide-react";

const aboutContent = `> Senior AI Engineer at Synechron working on Validate.AI
> Building enterprise-wide LLMOps platform handling 100% organizational LLM traffic
> Implementing RBAC, observability, cost tracking, and compliance systems
> Standardizing LLM interfaces across the organization

> Previous experience at Infosys:
> - Developed Agentic RAG systems for test case generation
> - Fine-tuned LLMs and built evaluation pipelines
> - Led large-scale automation initiatives

> Core focus areas:
> - System Design & Scalability
> - Applied Generative AI
> - Enterprise-grade AI Solutions`;

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isInView && currentIndex < aboutContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(aboutContent.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [isInView, currentIndex]);

  return (
    <section id="about" className="py-20 relative">
      {/* Background decorative elements */}
      <div className="absolute left-10 top-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute right-10 bottom-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              About <span className="gradient-text">Me</span>
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100px" } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
            />
          </div>

          {/* Terminal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass rounded-xl overflow-hidden neon-border"
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 ml-4 text-muted-foreground text-sm">
                <Terminal className="h-4 w-4" />
                <span>about</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm md:text-base">
              <pre className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {displayedText}
                <span className="terminal-cursor inline-block w-2 h-5 bg-primary ml-1" />
              </pre>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {[
              { value: "4+", label: "Years Experience" },
              { value: "10+", label: "Enterprise Projects" },
              { value: "900+", label: "APIs Tested" },
              { value: "100%", label: "LLM Traffic Managed" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center p-4 rounded-lg glass card-hover"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
