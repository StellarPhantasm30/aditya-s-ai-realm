import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { SiLinkedin, SiGithub, SiMedium, SiX, SiLeetcode, SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      href: "https://linkedin.com/in/adityadev30",
      color: "hover:text-blue-500",
    },
    {
      name: "GitHub",
      icon: SiGithub,
      href: "https://github.com/stellarphantasm30",
      color: "hover:text-violet-400",
    },
    {
      name: "Medium",
      icon: SiMedium,
      href: "https://medium.com/@aditya_dev30",
      color: "hover:text-green-500",
    },
    {
      name: "LeetCode",
      icon: SiLeetcode,
      href: "https://leetcode.com/aditya_dev30",
      color: "hover:text-yellow-500",
    },
    {
      name: "X",
      icon: SiX,
      href: "https://x.com/aditya_dev30",
      color: "hover:text-black dark:hover:text-white",
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      href: "https://instagram.com/neuralnotes30",
      color: "hover:text-pink-500",
    },
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Main CTA */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Let's start something{" "}
            <span className="gradient-text">great together</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Ready to bring your AI vision to life? Let's discuss how I can help 
            build your next enterprise-grade Generative AI solution.
          </motion.p>

          {/* Get in Touch Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6"
              onClick={() => window.open("mailto:adityame0010@gmail.com")}
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10"
          >
            <a
              href="mailto:adityame0010@gmail.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
              adityame0010@gmail.com
            </a>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              Pune, India
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full glass flex items-center justify-center text-muted-foreground ${link.color} transition-all duration-300 hover:neon-glow`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
