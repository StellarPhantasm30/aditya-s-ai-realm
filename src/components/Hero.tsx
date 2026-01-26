import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-32 right-20 w-4 h-4 rounded-full bg-primary/40"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-48 right-40 w-2 h-2 rounded-full bg-accent/60"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-3 h-3 rounded-full bg-primary/30"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg mb-2"
            >
              Hi, I am
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              <span className="gradient-text">{`Aditya Ravi Raj`}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-primary/80 font-medium mb-6"
            >
              Senior AI Engineer | Generative AI | LLMOps | Agentic Systems
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Senior AI Engineer with close to 4 years of experience building and scaling 
              enterprise-grade Generative AI systems, LLMOps platforms, and Agentic RAG 
              solutions across retail, healthcare, and fintech domains.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="/Aditya Ravi Raj.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-base font-medium rounded-lg group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity px-6 py-3"
              >
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </a>

              <Button
                size="lg"
                variant="outline"
                className="neon-border hover:neon-glow transition-all duration-300"
                onClick={scrollToContact}
              >
                Start a Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Abstract Paint-Stroke Background */}
              <motion.div
                className="absolute inset-0 -z-10"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <svg
                  viewBox="0 0 400 400"
                  className="w-80 h-80 md:w-96 md:h-96"
                  fill="none"
                >
                  {/* Paint stroke blob */}
                  <path
                    d="M200 50C280 50 350 120 350 200C350 280 280 350 200 350C120 350 50 280 50 200C50 120 120 50 200 50Z"
                    className="fill-primary/20"
                  />
                  <path
                    d="M180 30C270 20 360 100 370 190C380 280 310 370 220 380C130 390 40 320 30 230C20 140 90 40 180 30Z"
                    className="fill-accent/15"
                    transform="translate(10, 10)"
                  />
                </svg>
              </motion.div>

              {/* Profile Image Placeholder */}
              <motion.div
                className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden neon-border neon-glow relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <img
                    src="/profile_picture.jpeg"
                    alt="Aditya Ravi Raj profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary/40 blur-sm"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-2 -left-6 w-6 h-6 rounded-full bg-accent/50 blur-sm"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/2 -right-8 w-4 h-4 rounded-full bg-primary/60"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
