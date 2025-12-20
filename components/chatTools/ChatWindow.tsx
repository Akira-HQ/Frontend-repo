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
    }, 10); // Fast for smooth feel
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
  const [remaining, setRemaining] = useState<number | null>(null);

  // 1. INITIAL LOAD: Fetch ID and full history from DB
  useEffect(() => {
    let id = localStorage.getItem("cliva_visitor_id");
    if (!id) {
      id = `vis_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cliva_visitor_id", id);
    }
    setVisitorId(id);

    const loadData = async () => {
      try {
        const res = await callApi(`/chat-history?visitorId=${id}`, "GET");
        const data = res?.data || res;

        if (data?.messages) {
          // Set all previous messages from DB (isNew: false so they don't typewriter again)
          const historyWithFlags = data.messages.map((m: any) => ({
            ...m,
            isNew: false
          }));
          setMessages(historyWithFlags);

          if (typeof data.remaining === 'number') {
            setRemaining(data.remaining);
          }
        }
      } catch (err) {
        console.error("Cliva History Error:", err);
      }
    };
    loadData();
  }, []);

  // 2. GREETING: Only if database is empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: "cliva",
        content: "Hi! I'm Kliva Agent. Your autonomous sales partner. Ready to unlock hidden revenue in your store today?",
        isNew: true
      }]);
    }
  }, [isOpen]);

  // 3. AUTO-SCROLL TO LATEST: Triggers whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isApiLoading]);

  // 4. SEND MESSAGE: Properly appending to history
  const handleSend = async () => {
    if (!input.trim() || isApiLoading) return;

    const userMsg = input.trim();
    setInput("");

    // Append User message locally using functional update (PREV)
    setMessages(prev => [...prev, { role: "user", content: userMsg, isNew: false }]);
    setIsApiLoading(true);

    try {
      const res = await callApi("/cliva-info", "POST", {
        message: userMsg,
        visitorId
      });

      const data = res?.data || res;

      if (data?.reply) {
        // Append AI message locally using functional update (PREV)
        setMessages(prev => [...prev, {
          role: "cliva",
          content: data.reply,
          isNew: true
        }]);
        setRemaining(data.remaining);
      }
    } catch (err) {
      addToast("Connection flicker. Cliva is recalibrating.", "error");
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] font-inter">
      {/* Visual Scrollbar Correction */}
      <style jsx global>{`
        .cliva-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .cliva-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .cliva-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(165, 0, 255, 0.3);
          border-radius: 10px;
        }
        .cliva-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A500FF;
        }
      `}</style>

      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-gradient-to-tr from-[#A500FF] to-[#7000FF] p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group relative">
          <div className="absolute -top-2 -right-2 bg-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce text-black shadow-lg uppercase">Live</div>
          <MessageSquare className="text-white" />
        </button>
      ) : (
        <div className="w-[calc(100vw-2rem)] h-[80vh] max-h-[600px] sm:w-[400px] sm:h-[550px] bg-[#0d0d0d]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#A500FF]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#A500FF]/20 rounded-lg">
                <Sparkles className="text-[#A500FF] animate-pulse" size={18} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Cliva Agent</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                  {remaining !== null ? `${remaining}/10 messages left` : "Secure Session"}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="text-gray-500 hover:text-white" size={20} />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto space-y-5 cliva-scrollbar scroll-smooth flex flex-col"
          >
            {messages.map((m, i) => {
              const isBot = m.role === 'cliva' || m.role === 'model';
              return (
                <div key={i} className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-[14px] leading-relaxed shadow-xl border ${!isBot ? 'bg-white text-black font-semibold rounded-tr-none border-white' : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none backdrop-blur-sm'}`}>
                    {isBot && m.isNew ? (
                      <TypewriterMessage
                        text={m.content}
                        onComplete={() => {
                          setMessages(prev => {
                            const updated = [...prev];
                            if (updated[i]) updated[i].isNew = false;
                            return updated;
                          });
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking Indicator */}
            {isApiLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-2">
                  <Loader2 className="animate-spin text-[#A500FF]" size={14} />
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Thinking</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-6 border-t border-white/5 bg-[#080808]/50">
            <div className="relative group">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white text-sm outline-none focus:border-[#A500FF]/40 transition-all placeholder:text-gray-700 shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Cliva about scaling..."
              />
              <button
                onClick={handleSend}
                disabled={isApiLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#A500FF] text-white rounded-xl active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-[8px] text-gray-700 mt-4 uppercase tracking-[0.2em] font-black italic">
              Encryption active • Credits reset daily
            </p>
          </div>
        </div>
      )}
    </div>
  );
};