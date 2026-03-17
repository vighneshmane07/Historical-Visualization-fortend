import { motion } from "framer-motion";
import type { HistoricalPlace } from "@/data/historicalPlaces";
import type { Language } from "./LanguageSwitcher";

interface PlaceCardProps {
  place: HistoricalPlace;
  language: Language;
  isSelected: boolean;
  onClick: () => void;
}

const PlaceCard = ({ place, language, isSelected, onClick }: PlaceCardProps) => {
  const name = language === "hi" ? place.nameHi : language === "mr" ? place.nameMr : place.name;
  const loc = language === "hi" ? place.locationHi : language === "mr" ? place.locationMr : place.location;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex-shrink-0 w-36 p-3 rounded-xl border text-left transition-all ${
        isSelected
          ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
          : "bg-card border-border hover:border-primary/40"
      }`}
    >
      <span className="text-2xl">{place.emoji}</span>
      <p className="font-display font-semibold text-sm mt-1.5 leading-tight">{name}</p>
      <p className={`text-[10px] mt-0.5 ${isSelected ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
        {loc}
      </p>
      <p className={`text-[9px] mt-0.5 font-body ${isSelected ? "text-secondary-foreground/50" : "text-muted-foreground/60"}`}>
        {place.era}
      </p>
    </motion.button>
  );
};

export default PlaceCard;
