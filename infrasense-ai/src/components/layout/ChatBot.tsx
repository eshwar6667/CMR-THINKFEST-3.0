import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import { chatService } from '../../services/chatService';
import type { ChatMessage } from '../../types';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am the **InfraSense AI Assistant**. How can I assist you with municipal infrastructure diagnostics today?",
      timestamp: new Date().toISOString(),
      suggestions: ["Show critical areas", "Find pending repairs", "Infrastructure health"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const reply = await chatService.sendMessage(text, messages);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting to the analytics engine right now. Please try again.",
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Toggle Icon Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 text-white shadow-lg hover:scale-105 transition-all duration-150 animate-bounce"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}

      {/* Floating Panel Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border rounded-2xl shadow-glass flex flex-col overflow-hidden transition-all duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-darkbg-border/40 border-b border-slate-200/50 dark:border-darkbg-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Cpu className="h-4.5 w-4.5 text-brand-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">AI Diagnostics Agent</h4>
                <span className="text-[9px] text-slate-400 font-medium">InfraSense AI Core</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-slate-250 dark:hover:bg-darkbg-border text-slate-400 hover:text-slate-650"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Body */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-lightbg/40 dark:bg-darkbg/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-darkbg-border border border-slate-100 dark:border-darkbg-border text-slate-800 dark:text-slate-205 rounded-tl-none shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
                
                {/* Suggestions buttons below AI message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSendMessage(s)}
                        className="text-[10px] font-semibold text-brand-650 dark:text-brand-400 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/20 dark:hover:bg-brand-900/35 border border-brand-100 dark:border-brand-900/30 px-2 py-0.5 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold select-none italic pl-2">
                <Cpu className="h-3.5 w-3.5 animate-spin text-brand-500" /> Diagnostics Engine calculating...
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-darkbg-card border-t border-slate-150 dark:border-darkbg-border flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask for pending reports, health score..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 dark:border-darkbg-border rounded-xl bg-slate-50 dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-all shadow-md shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatBot;
