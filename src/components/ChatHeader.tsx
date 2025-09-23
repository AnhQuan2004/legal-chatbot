import { Scale, MessageCircle, Sparkles, Menu, User } from "lucide-react";
import legalHero from "@/assets/legal-hero.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

const ChatHeader = ({ onToggleSidebar }: ChatHeaderProps) => {
  return (
    <header className="gradient-legal shadow-legal border-b border-accent/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-primary-foreground">
            <Menu className="w-6 h-6" />
          </Button>
          <div className="relative">
            <img 
              src={legalHero} 
              alt="Legal Assistant" 
              className="w-16 h-16 rounded-full object-cover border-2 border-accent shadow-chat"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold text-primary-foreground">
                Chatbot Luật Việt Nam
              </h1>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Sản phẩm này là của đề tài QG.24.80
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
            <MessageCircle className="w-4 h-4 text-accent" />
            <span className="text-primary-foreground text-sm font-medium">
              Hỏi bất cứ điều gì về luật
            </span>
          </div>
          <Button variant="ghost" asChild className="text-primary-foreground">
            <Link to="/about">
              About
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
