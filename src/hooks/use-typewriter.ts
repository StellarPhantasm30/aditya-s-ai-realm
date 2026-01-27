import { useState, useEffect, useCallback } from "react";

type Phase = "typing" | "pausing" | "deleting" | "pausingAfterDelete";

interface UseTypewriterOptions {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  pauseAfterDeleteDuration?: number;
}

export function useTypewriter({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  pauseAfterDeleteDuration = 500,
}: UseTypewriterOptions) {
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const currentPhrase = phrases[phraseIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    switch (phase) {
      case "typing":
        if (currentText.length < currentPhrase.length) {
          timeout = setTimeout(() => {
            setCurrentText(currentPhrase.slice(0, currentText.length + 1));
          }, typingSpeed);
        } else {
          timeout = setTimeout(() => {
            setPhase("pausing");
          }, pauseDuration);
        }
        break;

      case "pausing":
        timeout = setTimeout(() => {
          setPhase("deleting");
        }, 0);
        break;

      case "deleting":
        if (currentText.length > 0) {
          timeout = setTimeout(() => {
            setCurrentText(currentText.slice(0, -1));
          }, deletingSpeed);
        } else {
          setPhase("pausingAfterDelete");
        }
        break;

      case "pausingAfterDelete":
        timeout = setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setPhase("typing");
        }, pauseAfterDeleteDuration);
        break;
    }

    return () => clearTimeout(timeout);
  }, [
    currentText,
    phase,
    currentPhrase,
    phrases.length,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    pauseAfterDeleteDuration,
  ]);

  return { currentText, isTyping: phase === "typing", isDeleting: phase === "deleting" };
}
