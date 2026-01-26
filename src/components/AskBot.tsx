import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const samplePrompts = [
  "What are Aditya's strongest skills?",
  "What GenAI projects has he built?",
  "How can Aditya help my organization?",
  "Tell me about his LLMOps experience",
];

const mockConversation = [
  {
    role: "bot",
    message: "Hi! I'm Aditya's AI assistant. I can tell you about his skills, projects, and experience in Generative AI and LLMOps. What would you like to know?",
  },
];

const AskBot = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [messages, setMessages] = useState(mockConversation);
  const [inputValue, setInputValue] = useState("");

  const handlePromptClick = (prompt: string) => {
    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", message: prompt },
    ];

    // Simulate bot response
    setTimeout(() => {
      let response = "";
      if (prompt.toLowerCase().includes("skills")) {
        response = "Aditya excels in Generative AI, LLMOps, and building enterprise-scale AI systems. His core strengths include LangChain, LangGraph, Python, FastAPI, and cloud platforms like AWS and Azure. He's particularly skilled at system design and building production-ready AI solutions.";
      } else if (prompt.toLowerCase().includes("project")) {
        response = "Aditya has built several impressive projects including Validate.AI (an enterprise LLMOps platform), Agentic RAG systems for 900+ API testing, and autonomous AIOps agents. Each project demonstrates his ability to deliver scalable, production-ready solutions.";
      } else if (prompt.toLowerCase().includes("help") || prompt.toLowerCase().includes("organization")) {
        response = "Aditya can help your organization with end-to-end GenAI development, building custom guardrails and evaluation pipelines, implementing LLMOps infrastructure, and deploying enterprise-ready AI systems with proper observability and cost controls.";
      } else {
        response = "Aditya has extensive experience building enterprise LLMOps platforms at Synechron, handling 100% of organizational LLM traffic. Previously at Infosys, he developed Agentic RAG systems and fine-tuned LLMs for production use.";
      }

      setMessages([...newMessages, { role: "bot", message: response }]);
    }, 1000);

    setMessages(newMessages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handlePromptClick(inputValue);
      setInputValue("");
    }
  };

  return (
    <section id="bot" className="py-20 relative">
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
            Ask My <span className="gradient-text">AI Bot</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100px" } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Have questions about my experience? Ask my AI assistant!
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl overflow-hidden neon-border"
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Aditya's AI Assistant</h3>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "bot" 
                      ? "bg-gradient-to-br from-primary to-accent" 
                      : "bg-muted"
                  }`}>
                    {msg.role === "bot" ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "bot"
                      ? "bg-muted text-foreground"
                      : "bg-gradient-to-r from-primary to-accent text-white"
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sample Prompts */}
            <div className="p-4 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 bg-muted border-muted"
                />
                <Button type="submit" size="icon" className="bg-gradient-to-r from-primary to-accent">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AskBot;
