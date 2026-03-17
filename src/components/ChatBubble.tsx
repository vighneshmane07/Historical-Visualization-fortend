import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble = ({ role, content }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border text-foreground rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <div className="prose prose-sm prose-stone max-w-none [&>p]:mb-1.5 [&>p:last-child]:mb-0">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
