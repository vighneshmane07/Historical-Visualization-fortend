import { motion } from "framer-motion";

export type Language = "en" | "hi" | "mr";

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const labels: Record<Language, string> = { en: "EN", hi: "हिं", mr: "मरा" };

const LanguageSwitcher = ({ language, onLanguageChange }: LanguageSwitcherProps) => {
  const langs: Language[] = ["en", "hi", "mr"];

  return (
    <div className="flex items-center gap-1 rounded-full bg-card/80 backdrop-blur-sm p-1 border border-border shadow-sm">
      {langs.map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className="relative px-3 py-1.5 text-xs font-body font-semibold rounded-full transition-colors"
        >
          {language === lang && (
            <motion.div
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${language === lang ? "text-primary-foreground" : "text-muted-foreground"}`}>
            {labels[lang]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
