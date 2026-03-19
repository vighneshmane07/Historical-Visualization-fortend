import { useState, useCallback } from "react";
import type { Language } from "@/components/LanguageSwitcher";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const greetings: Record<Language, string> = {
  en: "Namaste! 🙏 I am Katha, your AI historical storyteller. Ask me about any historical place or event in the world!",
  hi: "नमस्ते! 🙏 मैं कथा हूँ — आपका AI ऐतिहासिक कहानीकार। दुनिया के किसी भी ऐतिहासिक स्थान के बारे में पूछें!",
  mr: "नमस्कार! 🙏 मी कथा आहे — तुमचा AI ऐतिहासिक कथाकार. जगातील कोणत्याही ऐतिहासिक ठिकाणाबद्दल विचारा!",
};

async function askAI(question: string) {
  try {
    const res = await fetch("https://historical-visualization-backend-production.up.railway.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    return data.answer;
  } catch (err) {
    return "⚠️ AI server is not running.";
  }
}

export function useStoryteller(language: Language) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: greetings["en"] },
  ]);

  const [isThinking, setIsThinking] = useState(false);

  const updateGreeting = useCallback((lang: Language) => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ role: "assistant", content: greetings[lang] }];
      }
      return prev;
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsThinking(true);

      const answer = await askAI(text);

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setIsThinking(false);
    },
    []
  );

  return { messages, isThinking, sendMessage, updateGreeting };
}
