import { useState, useCallback, useRef, useEffect } from "react";
import type { Language } from "@/components/LanguageSwitcher";

const langMap: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

const API_BASE = "http://127.0.0.1:5000";

function splitText(text: string, maxLength = 250): string[] {
  const cleanText = text.replace(/\s+/g, " ").trim();
  if (!cleanText) return [];

  const sentences = cleanText.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxLength) {
      current = (current + " " + sentence).trim();
    } else {
      if (current) chunks.push(current);

      if (sentence.length <= maxLength) {
        current = sentence;
      } else {
        let start = 0;
        while (start < sentence.length) {
          chunks.push(sentence.slice(start, start + maxLength));
          start += maxLength;
        }
        current = "";
      }
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export function useSpeech(language: Language) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopRequestedRef = useRef(false);

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
     PLAY ONE AUDIO BLOB
  ----------------------------- */
  const playBlob = useCallback((blob: Blob) => {
    return new Promise<void>((resolve, reject) => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        resolve();
      };

      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        reject(e);
      };

      audio.play().catch((err) => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        reject(err);
      });
    });
  }, []);

  /* -----------------------------
     SPEAK FUNCTION
  ----------------------------- */
  const speak = useCallback(async (text: string) => {
    if (!text?.trim()) return;

    stopRequestedRef.current = false;
    setIsSpeaking(true);

    try {
      const chunks = splitText(text, 250);

      for (const chunk of chunks) {
        if (stopRequestedRef.current) break;

        const response = await fetch(`${API_BASE}/speak`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: chunk }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Speak API failed: ${errText}`);
        }

        const blob = await response.blob();

        if (stopRequestedRef.current) break;
        await playBlob(blob);
      }
    } catch (error) {
      console.error("Speak error:", error);
    } finally {
      setIsSpeaking(false);
    }
  }, [playBlob]);

  /* -----------------------------
     STOP SPEAKING
  ----------------------------- */
  const stopSpeaking = useCallback(() => {
    stopRequestedRef.current = true;
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
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
      currentAudioRef.current?.pause();
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