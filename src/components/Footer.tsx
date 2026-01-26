import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative py-12 border-t border-border">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full h-32 opacity-10"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,64 C360,120 720,0 1080,64 C1260,96 1440,64 1440,64 L1440,120 L0,120 Z"
            fill="url(#wave-gradient)"
            animate={{
              d: [
                "M0,64 C360,120 720,0 1080,64 C1260,96 1440,64 1440,64 L1440,120 L0,120 Z",
                "M0,80 C360,0 720,120 1080,40 C1260,80 1440,80 1440,80 L1440,120 L0,120 Z",
                "M0,64 C360,120 720,0 1080,64 C1260,96 1440,64 1440,64 L1440,120 L0,120 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-2xl font-bold gradient-text cursor-pointer inline-block mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Aditya.AI
            </motion.a>
            <p className="text-muted-foreground text-sm">
              © {currentYear} Aditya Ravi Raj. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Built with */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              Built with{" "}
              <span className="text-red-500">❤</span>
              {" "}using React & Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
