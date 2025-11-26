import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotPanelProps {
  onClose: () => void;
  userRole?: string;
}

const mockResponses = [
  "Olá! Como posso ajudá-lo hoje?",
  "Entendi sua solicitação. Deixe-me buscar essas informações para você.",
  "Com base nos dados mais recentes, posso confirmar que...",
  "Aqui está um resumo do que encontrei: A taxa de crescimento está acima da média do setor.",
  "Posso ajudá-lo com mais alguma coisa?",
];

export function ChatbotPanel({ onClose, userRole = "Colaborador" }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual da Work On. Como posso ajudá-lo hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Block legal queries for unauthorized users
  const hasLegalAccess = userRole === "Admin" || userRole === "Jurídico";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    
    // Check if query is about legal/juridical topics
    const legalKeywords = ["juridico", "jurídico", "legal", "contrato", "documento", "lgpd", "compliance", "procuração", "licença"];
    const isLegalQuery = legalKeywords.some(keyword => inputValue.toLowerCase().includes(keyword));
    
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Block legal information for unauthorized users
      if (isLegalQuery && !hasLegalAccess) {
        responseText = "Desculpe, mas você não tem autorização para acessar informações da Central Jurídica. Para questões jurídicas, entre em contato com o departamento legal ou um administrador.";
      }
      
      const botResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white">Assistente IA</h3>
            <p className="text-blue-100">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "bot"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {message.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  message.sender === "bot"
                    ? "bg-slate-100 text-slate-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`mt-1 ${
                    message.sender === "bot" ? "text-slate-500" : "text-blue-100"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}