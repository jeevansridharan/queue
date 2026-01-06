
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Message } from '../types';

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your RushX AI assistant. I can help you with campus orders, xerox status, or general queries. How can I assist you today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '', timestamp: Date.now() }]);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: 'You are a helpful, professional AI assistant inside the RushX campus application. You help students with food ordering and xerox management. Be concise but insightful.',
        },
      });

      let fullText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: 'Sorry, I encountered an error. Please check your connection or API key.' } : m));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-6 pb-24 scroll-smooth" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                ? 'bg-orange-600 text-white rounded-tr-none shadow-orange-900/20'
                : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
              }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content || (isTyping && msg.role === 'assistant' ? '...' : '')}</p>
              <span className="text-[10px] opacity-50 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 md:pl-72">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your orders or campus events..."
            className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-2xl"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            {isTyping ? '⌛' : '发送'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
