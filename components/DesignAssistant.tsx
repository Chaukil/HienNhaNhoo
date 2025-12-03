import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot } from 'lucide-react';
import { PlacedItem, ChatMessage } from '../types';
import { getDesignAdvice } from '../services/geminiService';

interface DesignAssistantProps {
  items: PlacedItem[];
  isOpen: boolean;
  onClose: () => void;
}

const DesignAssistant: React.FC<DesignAssistantProps> = ({ items, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm CozyBot. Need help decorating your room?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const responseText = await getDesignAdvice(items, userText);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-24 right-6 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-fade-in-up z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-full">
            <Sparkles size={18} />
          </div>
          <span className="font-bold">CozyBot Designer</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 h-64 overflow-y-auto bg-slate-50 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-violet-500 text-white rounded-tr-sm' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-100 flex gap-1">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for advice..."
          className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DesignAssistant;
