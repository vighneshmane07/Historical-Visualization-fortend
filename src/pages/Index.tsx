import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin } from "lucide-react";
import bgTajMahal from "@/assets/bg-taj-mahal.jpg";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";
import AvatarCharacter from "@/components/AvatarCharacter";
import PlaceCard from "@/components/PlaceCard";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";
import { historicalPlaces } from "@/data/historicalPlaces";
import { useSpeech } from "@/hooks/useSpeech";
import { useStoryteller } from "@/hooks/useStoryteller";
import { askAI } from "../App";


const categoryLabels: Record<string, Record<Language, string>> = {
  india: { en: "🇮🇳 India", hi: "🇮🇳 भारत", mr: "🇮🇳 भारत" },
  world: { en: "🌍 World", hi: "🌍 विश्व", mr: "🌍 जग" },
};

const Index = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<"india" | "world">("india");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isListening, isSpeaking, speak, stopSpeaking, startListening, stopListening } = useSpeech(language);
  const { messages, isThinking, selectPlace, sendMessage, updateGreeting } = useStoryteller(language);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Update greeting when language changes
  useEffect(() => {
    updateGreeting(language);
  }, [language, updateGreeting]);

  // Speak new assistant messages
  const lastMsgRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > lastMsgRef.current) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        // Strip markdown for speech
        const plainText = last.content.replace(/\*\*/g, "").replace(/[#*_~`]/g, "").replace(/\n/g, ". ");
        speak(plainText);
      }
    }
    lastMsgRef.current = messages.length;
  }, [messages, speak]);

  const handleSend = useCallback(() => {
  const text = input.trim();
  if (!text) return;
  stopSpeaking();
  sendMessage(text);
  setInput("");
}, [input, sendMessage, stopSpeaking]);

  const handleMic = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening((transcript) => {
        sendMessage(transcript);
      });
    }
  }, [isListening, startListening, stopListening, stopSpeaking, sendMessage]);

  const handlePlaceSelect = useCallback(
    (placeId: string) => {
      setSelectedPlaceId(placeId);
      stopSpeaking();
      const place = historicalPlaces.find((p) => p.id === placeId);
      if (place) selectPlace(place);
    },
    [selectPlace, stopSpeaking]
  );

  const filteredPlaces = historicalPlaces.filter((p) => p.category === category);

  const placeholderText: Record<Language, string> = {
    en: "Ask Katha anything...",
    hi: "कथा से कुछ भी पूछें...",
    mr: "कथाला काहीही विचारा...",
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={bgTajMahal} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">Katha</h1>
        </div>
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </header>

      {/* Avatar */}
      <div className="relative z-10 flex justify-center py-2">
        <AvatarCharacter isSpeaking={isSpeaking} />
      </div>

      {/* Place Selector */}
      <div className="relative z-10 px-4 mt-4">
        <div className="flex gap-2 mb-2">
          {(["india", "world"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs font-body font-semibold px-3 py-1 rounded-full transition-all ${
                category === cat
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {categoryLabels[cat][language]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {filteredPlaces.map((place) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <PlaceCard
                  place={place}
                  language={language}
                  isSelected={selectedPlaceId === place.id}
                  onClick={() => handlePlaceSelect(place.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 px-4 mt-3">
        <div className="flex-1 overflow-y-auto chat-scroll space-y-3 pb-2">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 px-4 py-2"
            >
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="relative z-10 px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-2xl px-3 py-2 shadow-md">
          <MicButton isListening={isListening} onClick={handleMic} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={placeholderText[language]}
            className="flex-1 bg-transparent outline-none text-sm font-body text-foreground placeholder:text-muted-foreground"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Index;
