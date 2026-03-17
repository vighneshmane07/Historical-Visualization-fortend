import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
        isListening
          ? "bg-destructive text-destructive-foreground"
          : "bg-accent text-accent-foreground"
      }`}
    >
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-destructive/30 pulse-ring" />
          <span className="absolute inset-0 rounded-full bg-destructive/20 pulse-ring" style={{ animationDelay: "0.5s" }} />
        </>
      )}
      {isListening ? <MicOff className="w-6 h-6 relative z-10" /> : <Mic className="w-6 h-6 relative z-10" />}
    </motion.button>
  );
};

export default MicButton;
