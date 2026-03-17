import { motion } from "framer-motion";
import avatarImg from "@/assets/avatar-historian.png";

interface AvatarCharacterProps {
  isSpeaking: boolean;
}

const AvatarCharacter = ({ isSpeaking }: AvatarCharacterProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ring when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-accent/20 pulse-ring" />
        </div>
      )}

      <motion.div
        className="avatar-alive relative z-10"
        animate={isSpeaking ? { scale: [1, 1.03, 1] } : {}}
        transition={isSpeaking ? { duration: 0.6, repeat: Infinity } : {}}
      >
        <img
          src={avatarImg}
          alt="Katha - Your Historical Storyteller"
          className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Name badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-display font-semibold shadow-md"
      >
        Katha
      </motion.div>
    </div>
  );
};

export default AvatarCharacter;
