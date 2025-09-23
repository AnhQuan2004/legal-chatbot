import { useState, useEffect } from "react";
import { Bot, User, Scale, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isTyping?: boolean;
}

const ChatMessage = ({ message, isUser, timestamp, isTyping = false }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isUser && !isTyping) {
      setIsAnimating(true);
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= message.length) {
          setDisplayedText(message.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedText(message);
    }
  }, [message, isUser, isTyping]);

  return (
    <div className={cn(
      "flex gap-3 p-4 message-enter",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-chat",
        isUser 
          ? "bg-chat-user text-chat-user-foreground" 
          : "bg-accent text-accent-foreground"
      )}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Scale className="w-5 h-5" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[80%]",
        isUser ? "flex flex-col items-end" : "flex flex-col items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-chat border transition-all duration-300",
          isUser 
            ? "bg-chat-user text-chat-user-foreground border-primary/20 rounded-br-md" 
            : "bg-chat-bot text-chat-bot-foreground border-border rounded-bl-md"
        )}>
          {isTyping ? (
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-muted-foreground" />
              <span className="typing-indicator text-muted-foreground">
                Thinking
              </span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              <ReactMarkdown>{displayedText}</ReactMarkdown>
              {isAnimating && <span className="animate-pulse">|</span>}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && !isTyping && (
          <div className="flex items-center gap-1 mt-1 px-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
