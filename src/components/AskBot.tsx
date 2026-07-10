import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const samplePrompts = [
  "What are Aditya's strongest skills?",
  "What GenAI projects has he built?",
  "How can Aditya help my organization?",
  "Tell me about his LLMOps experience",
];

const GREETING: UIMessage = {
  id: "greeting",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi! I'm Aditya's AI assistant. I can tell you about his skills, projects, and experience in Generative AI and LLMOps. What would you like to know?",
    },
  ],
};

function messageText(m: UIMessage): string {
  return m.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");
}

const AskBot = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    messages: [GREETING],
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "The assistant is unavailable right now."),
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    if (!text.trim() || isBusy) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <section id="bot" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 relative">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl overflow-hidden neon-border"
          >
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

            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const text = messageText(msg);
                if (!text) return null;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-muted"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Sparkles className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap ${
                        msg.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "bg-gradient-to-r from-primary to-accent text-white"
                      }`}
                    >
                      <p className="text-sm">{text}</p>
                    </div>
                  </motion.div>
                );
              })}
              {status === "submitted" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl p-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking…
                  </div>
                </div>
              )}
              {error && (
                <p className="text-xs text-destructive text-center">
                  {error.message}
                </p>
              )}
            </div>

            <div className="p-4 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    disabled={isBusy}
                    className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-primary/20 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 bg-muted border-muted"
                  disabled={isBusy}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isBusy || !input.trim()}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
