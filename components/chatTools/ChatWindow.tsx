"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "../AppContext";

const TypewriterMessage = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text, onComplete]);
  return <span>{displayedText}</span>;
};

export const LandingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { callApi } = UseAPI();
  const { addToast } = useAppContext();

  // Initialize Visitor and History
  // 1. Initialize Visitor & Load Data
  useEffect(() => {
    let id = localStorage.getItem("akira_visitor_id");
    if (!id) {
      id = `vis_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("akira_visitor_id", id);
    }
    setVisitorId(id);

    const loadHistory = async () => {
      try {
        const res = await callApi(`/chat-history?visitorId=${id}`, "GET");

        // If we have messages in DB, load them
        if (res?.data?.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
        // IMPORTANT: If DB is empty, we DON'T set messages yet. 
        // The "Proactive Trigger" below will handle it when the user opens the chat.
      } catch (err) {
        console.error("History fetch failed", err);
      }
    };
    loadHistory();
  }, []);

  // 2. The Proactive Greeting Trigger
  useEffect(() => {
    // If the chat is opened AND there are no messages yet...
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "akira",
          content: "Hi! I'm Akira. Your autonomous sales partner. I've been watching your store—want to know how we can scale your conversions today?",
          isNew: true // This triggers the Typewriter
        }
      ]);
    }
  }, [isOpen, messages]);

  

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isApiLoading]);

  const handleSend = async () => {
    if (!input.trim() || isApiLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg, isNew: false }]);
    setIsApiLoading(true);

    try {
      const res = await callApi("/akira-info", "POST", {
        message: userMsg,
        visitorId,
        history: messages.map(({ role, content }) => ({ role, content })).slice(-5)
      });

      if (res?.data?.reply) {
        setMessages(prev => [...prev, { role: "akira", content: res.data.reply, isNew: true }]);
      }
    } catch (err) {
      addToast("Connection error", "error");
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] font-inter">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-gradient-to-tr from-[#A500FF] to-[#7000FF] p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group relative">
          <div className="absolute -top-2 -right-2 bg-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce text-black shadow-lg">LIVE</div>
          <MessageSquare className="text-white" />
        </button>
      ) : (
        <div className="w-[calc(100vw-2rem)] h-[80vh] max-h-[600px] sm:w-[400px] sm:h-[550px] bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#A500FF]/10 to-transparent">
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#A500FF] animate-pulse" />
              <div>
                <h3 className="text-white font-bold text-sm">Akira Agent</h3>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <X className="cursor-pointer text-gray-500 hover:text-white transition-colors" onClick={() => setIsOpen(false)} />
          </div>

          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-5 custom-scrollbar scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-[14px] leading-relaxed shadow-xl border ${m.role === 'user' ? 'bg-white text-black font-semibold rounded-tr-none' : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none'}`}>
                  {m.role === 'akira' && m.isNew ? (
                    <TypewriterMessage
                      text={m.content}
                      onComplete={() => {
                        const newMsgs = [...messages];
                        newMsgs[i].isNew = false;
                        setMessages(newMsgs);
                      }}
                    />
                  ) : m.content}
                </div>
              </div>
            ))}
            {isApiLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <Loader2 className="animate-spin text-[#A500FF] size={5}" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-[#080808]/50">
            <div className="relative group">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white text-sm outline-none focus:border-[#A500FF]/40 transition-all placeholder:text-gray-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Akira anything..."
              />
              <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#A500FF] text-white rounded-xl active:scale-90 transition-transform"><Send size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};