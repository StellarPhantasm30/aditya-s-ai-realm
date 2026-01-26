import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Shield, BarChart3, Cog } from "lucide-react";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Rocket,
      title: "End-to-End GenAI Development",
      description: "From ideation to production deployment of Generative AI applications",
    },
    {
      icon: Shield,
      title: "Custom Guardrails",
      description: "Building robust safety mechanisms and evaluation pipelines",
    },
    {
      icon: BarChart3,
      title: "Observability & Cost Control",
      description: "Complete visibility into LLM usage, performance, and costs",
    },
    {
      icon: Cog,
      title: "Enterprise-Ready Deployment",
      description: "Scalable, secure, and compliant AI system implementations",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What I <span className="gradient-text">Offer</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100px" } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </motion.div>

        {/* Main Service Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl p-8 md:p-12 neon-border relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Enterprise Generative AI Solutions
              </h3>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                I help organizations build, deploy, and scale production-ready Generative AI 
                systems with proper guardrails, observability, and enterprise-grade security.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
