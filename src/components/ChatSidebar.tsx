import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  chatHistory: ChatHistoryItem[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

const ChatSidebar = ({ chatHistory, onNewChat, onSelectChat }: ChatSidebarProps) => {
  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Button onClick={onNewChat} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {chatHistory.map((chat) => (
            <Card 
              key={chat.id} 
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {chat.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
