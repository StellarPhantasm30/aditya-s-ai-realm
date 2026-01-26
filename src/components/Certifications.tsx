import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Trophy, Star, BookOpen, Code, Medal, TrendingUp, Newspaper } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const certifications = [
  {
    title: "Google Generative AI",
    type: "Certification",
    icon: Award,
    description: "Professional certification in Generative AI fundamentals and applications",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "GitHub Foundations",
    type: "Certification",
    icon: Code,
    description: "Certified in GitHub platform fundamentals and best practices",
    color: "from-gray-600 to-gray-400",
  },
  {
    title: "Infosys Topaz AI Innovation",
    type: "Winner",
    icon: Trophy,
    description: "First place in company-wide AI innovation challenge",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "IQE GenAI Hackathon",
    type: "Winner - AWS",
    icon: Medal,
    description: "Winning solution using AWS services for GenAI application",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "GFG Hack for Future",
    type: "Finalist",
    icon: Star,
    description: "Top finalist in GeeksforGeeks nationwide hackathon",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Employee of the Month",
    type: "Award",
    icon: Award,
    description: "Recognized for exceptional performance and contributions",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "LeetCode Achievements",
    type: "200+ Problems",
    icon: TrendingUp,
    description: "Solved 200+ problems, global rank under 60%",
    color: "from-amber-500 to-yellow-500",
  },
  {
    title: "Technical Blogging",
    type: "1000+ Views/Month",
    icon: Newspaper,
    description: "Active technical writer with growing readership",
    color: "from-indigo-500 to-violet-500",
  },
];

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                      <div className="h-full glass rounded-xl p-6 neon-border card-hover group">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
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
    </section>
  );
};

export default Certifications;
