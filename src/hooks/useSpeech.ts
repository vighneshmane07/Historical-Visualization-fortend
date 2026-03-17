import { useState, useCallback, useRef, useEffect } from "react";
import type { Language } from "@/components/LanguageSwitcher";

const langMap: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export function useSpeech(language: Language) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  /* -----------------------------
     LOAD AVAILABLE VOICES
  ----------------------------- */
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };

    loadVoices();

    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* -----------------------------
     SPEAK FUNCTION
  ----------------------------- */
  const speak = useCallback(async (text: string) => {

  setIsSpeaking(true);

  const response = await fetch("http://127.0.0.1:5001/speak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const blob = await response.blob();

  const audio = new Audio(URL.createObjectURL(blob));

  audio.onended = () => setIsSpeaking(false);

  audio.play();

}, []);
  /* -----------------------------
     STOP SPEAKING
  ----------------------------- */
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  /* -----------------------------
     START LISTENING
  ----------------------------- */
  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();

      recognition.lang = langMap[language];
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;

      recognition.start();
      setIsListening(true);
    },
    [language]
  );

  /* -----------------------------
     STOP LISTENING
  ----------------------------- */
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  /* -----------------------------
     CLEANUP
  ----------------------------- */
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}