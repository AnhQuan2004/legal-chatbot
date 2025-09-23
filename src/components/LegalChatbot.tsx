import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Users, Home, Briefcase, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const LegalChatbot = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào, bạn cần hỏi gì?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load chat history from local storage
    try {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          // Convert timestamp strings back to Date objects
          const historyWithDates = parsedHistory.map(session => ({
            ...session,
            timestamp: new Date(session.timestamp),
            messages: session.messages.map(message => ({
              ...message,
              timestamp: new Date(message.timestamp)
            }))
          }));
          setChatHistory(historyWithDates);
        }
      }
    } catch (error) {
      console.error("Failed to parse chat history from local storage:", error);
      localStorage.removeItem("chatHistory");
    }
  }, []);

  useEffect(() => {
    // Save chat history to local storage
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChatSession: ChatSession = {
      id: newChatId,
      title: `New Chat ${chatHistory.length + 1}`,
      messages: [
        {
          id: "welcome",
          text: "Hello! I'm your Legal Assistant AI. How can I assist you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, newChatSession]);
    setCurrentChatId(newChatId);
    setMessages(newChatSession.messages);
  };

  const handleSelectChat = (id: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === id);
    if (selectedChat) {
      setCurrentChatId(id);
      setMessages(selectedChat.messages);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    if (currentChatId) {
      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat
        )
      );
    } else {
      const newChatId = Date.now().toString();
      const newChatSession: ChatSession = {
        id: newChatId,
        title: messageText.substring(0, 20),
        messages: updatedMessages,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, newChatSession]);
      setCurrentChatId(newChatId);
    }

    // IMPORTANT: This is a client-side implementation for demonstration purposes.
    // In a production environment, the API key should be kept secret on a backend server.
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "qwen/qwen-turbo",
          "messages": [
            { "role": "system", "content": "You are a helpful Vietnamese legal assistant. Provide clear, concise, and accurate information about Vietnamese law. Always respond in Vietnamese." },
            { "role": "user", "content": messageText }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API response was not ok.');
      }

      const data = await response.json();
      const aiText = data.choices[0]?.message?.content || "Sorry, I couldn't get a response.";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      if (currentChatId) {
        setChatHistory(prev =>
          prev.map(chat =>
            chat.id === currentChatId ? { ...chat, messages: finalMessages } : chat
          )
        );
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong while fetching the response.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-chat-background">
      {isSidebarOpen && (
        <ChatSidebar 
          chatHistory={chatHistory.map(c => ({ id: c.id, title: c.title, timestamp: c.timestamp }))}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      )}
      <div className="flex flex-col flex-1">
        <ChatHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Chat Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <ChatMessage
                message=""
                isUser={false}
                isTyping
              />
            )}
          </div>
        </div>

          {/* Input Area */}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default LegalChatbot;
