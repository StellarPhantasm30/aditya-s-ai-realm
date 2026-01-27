import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Award, Trophy, Medal, BookOpen, TrendingUp, Newspaper } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const certifications = [
  {
    title: "Infosys Topaz AI Innovation",
    type: "Winner",
    icon: Trophy,
    description: "First place in company-wide AI innovation challenge",
    color: "from-yellow-500 to-orange-500",
    certificateImage: "/certifications/infosys-topaz-ai.png",
  },
  {
    title: "IQE GenAI Hackathon",
    type: "Winner",
    icon: Trophy,
    description: "Winning solution using AWS services for GenAI application",
    color: "from-orange-500 to-red-500",
    certificateImage: "/certifications/iqe-genai-hackathon.png",
  },
  {
    title: "GFG Hack for Future",
    type: "Finalist",
    icon: Medal,
    description: "Top finalist in GeeksforGeeks nationwide hackathon",
    color: "from-green-500 to-emerald-500",
    certificateImage: "/certifications/gfg-hack-for-future.png",
  },
  {
    title: "Google Generative AI",
    type: "Certification",
    icon: BookOpen,
    description: "Professional certification in Generative AI fundamentals and applications",
    color: "from-blue-500 to-cyan-500",
    certificateImage: "/certifications/google-generative-ai.png",
  },
  {
    title: "GitHub Foundations",
    type: "Certification",
    icon: BookOpen,
    description: "Certified in GitHub platform fundamentals and best practices",
    color: "from-gray-600 to-gray-400",
    certificateImage: "/certifications/github-foundations.png",
  },
  {
    title: "Employee of the Month",
    type: "Award",
    icon: Award,
    description: "Recognized for exceptional performance and contributions",
    color: "from-purple-500 to-pink-500",
    certificateImage: "/certifications/employee-of-month.png",
  },
  {
    title: "LeetCode Achievements",
    type: "200+ Problems",
    icon: TrendingUp,
    description: "Solved 200+ problems, global rank under 60%",
    color: "from-amber-500 to-yellow-500",
    certificateImage: "/certifications/leetcode-achievements.png",
  },
  {
    title: "Technical Blogging",
    type: "1000+ Views/Month",
    icon: Newspaper,
    description: "Active technical writer with growing readership",
    color: "from-indigo-500 to-violet-500",
    certificateImage: "/certifications/technical-blogging.png",
  },
];

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null);

  return (
    <section id="certifications" className="py-20 relative overflow-hidden">
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
            Certifications & <span className="gradient-text">Achievements</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100px" } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <CarouselItem key={cert.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="h-full"
                    >
                      <div 
                        className="h-full glass rounded-xl overflow-hidden neon-border card-hover group cursor-pointer"
                        onClick={() => setSelectedCert(cert)}
                      >
                        {/* Certificate Thumbnail */}
                        <div className="relative h-40 overflow-hidden bg-muted/30">
                          <img
                            src={cert.certificateImage}
                            alt={`${cert.title} certificate`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              // Fallback to gradient placeholder if image doesn't exist
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                              const fallback = document.createElement('div');
                              fallback.className = `w-full h-full bg-gradient-to-br ${cert.color} opacity-30 absolute inset-0`;
                              target.parentElement!.prepend(fallback);
                              const iconContainer = document.createElement('div');
                              iconContainer.className = 'relative z-10';
                              iconContainer.innerHTML = `<svg class="w-16 h-16 text-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`;
                              target.parentElement!.appendChild(iconContainer);
                            }}
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                          
                          {/* Click indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <span className="px-4 py-2 bg-primary/90 rounded-lg text-sm font-medium text-primary-foreground">
                              View Certificate
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Type Badge */}
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${cert.color} text-white mb-3`}>
                            {cert.type}
                          </span>

                          {/* Title */}
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {cert.title}
                          </h3>

                          {/* Description */}
                          <p className="text-muted-foreground text-sm">
                            {cert.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 bg-muted hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 bg-muted hover:bg-primary hover:text-primary-foreground" />
            </div>
          </Carousel>
        </motion.div>
      </div>

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl w-full bg-card/95 backdrop-blur-xl border-border p-2">
          {selectedCert && (
            <div className="relative">
              <img
                src={selectedCert.certificateImage}
                alt={`${selectedCert.title} certificate`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-4">
                <h3 className="text-lg font-bold gradient-text">{selectedCert.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedCert.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Certifications;
