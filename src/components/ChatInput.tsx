import { useState, useRef, useEffect } from "react";
import { Send, Mic, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Hỏi tôi bất cứ điều gì về luật" 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-background">
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "relative flex items-end gap-3 p-3 bg-card border rounded-2xl shadow-card transition-all duration-300",
            isFocused && "ring-2 ring-accent/50 border-accent/30"
          )}>
            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-muted-foreground hover:text-accent"
              disabled={isLoading}
            >
              <PlusCircle className="w-5 h-5" />
            </Button>

            {/* Text Input */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 min-h-[44px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
              disabled={isLoading}
            />

            {/* Voice Input Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-muted-foreground hover:text-accent"
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || isLoading}
              className="flex-shrink-0 gradient-legal shadow-legal transition-all duration-300 hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setMessage(suggestion)}
              className="text-xs bg-muted/50 hover:bg-accent/10 hover:border-accent/30 hover:text-accent-foreground"
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
