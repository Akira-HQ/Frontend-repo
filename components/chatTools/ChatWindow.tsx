"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Sparkles, Loader2, ThumbsUp, Lock } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "../AppContext"; // Corrected Hook Import
import ReactMarkdown from "react-markdown";
import Link from "next/link";

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
    }, 10);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <div className="markdown-content"><ReactMarkdown>{displayedText}</ReactMarkdown></div>;
};

export const LandingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { callApi } = UseAPI();
  const { addToast } = useAppContext(); // Fixed: Calling the hook properly

  // --- 1. INITIAL LOAD & HISTORY ---
  useEffect(() => {
    let id = localStorage.getItem("cliva_visitor_id") || `vis_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("cliva_visitor_id", id);
    setVisitorId(id);

    const loadData = async () => {
      try {
        const res = await callApi(`/chat-history?visitorId=${id}`, "GET");
        const data = res?.data || res;
        if (data?.messages) {
          setMessages(data.messages.map((m: any) => ({ ...m, isNew: false })));
          setRemaining(data.remaining);
        }
      } catch (err) {
        console.error("Cliva History Error:", err);
      }
    };
    loadData();
  }, [callApi]);

  // --- 2. WEBSOCKET REAL-TIME SYNC ---
  useEffect(() => {
    if (!visitorId || !isOpen) return;

    // Use specific 'snippet' type for visitor tracking
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?type=snippet&visitorId=${visitorId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // If server pushes a real-time action (e.g. Coupon or automated reply)
      if (data.type === "CLIVA_MESSAGE") {
        setMessages(prev => [...prev, { role: "cliva", content: data.message, isNew: true }]);
      }

      if (data.type === "QUOTA_UPDATE") {
        setRemaining(data.remaining);
      }
    };

    return () => ws.close();
  }, [visitorId, isOpen]);

  // --- 3. UI LOGIC ---
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: "cliva",
        content: "Hi! I'm **Cliva**. Welcome to the future of **Shopify Scaling**. Want to secure **early access** to our launch? Drop your email below.",
        isNew: true
      }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isApiLoading]);

  const handleSend = async () => {
    if (!input.trim() || isApiLoading || remaining === 0) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg, isNew: false }]);
    setIsApiLoading(true);

    try {
      const res = await callApi("/cliva-info", "POST", { message: userMsg, visitorId });
      const data = res?.data || res;
      if (data?.reply) {
        setMessages(prev => [...prev, { role: "cliva", content: data.reply, isNew: true }]);
        setRemaining(data.remaining);
      }
    } catch (err) {
      addToast("Connection flicker.", "error");
    } finally { setIsApiLoading(false); }
  };

  const sendFeedback = async () => {
    await callApi("/chat/feedback", "POST", { identifier: visitorId, sentiment: "positive", message: "User liked the landing response." });
    addToast("Strategy feedback received! 🧪", "success");
  };

  const isLocked = remaining === 0;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] font-inter">
      <style jsx global>{`
        .cliva-scrollbar::-webkit-scrollbar { width: 4px; }
        .cliva-scrollbar::-webkit-scrollbar-thumb { background: #A500FF; border-radius: 10px; }
        .markdown-content strong { color: #A500FF; font-weight: 800; }
        .markdown-content p { margin-bottom: 0.8rem; line-height: 1.6; }
        
        @keyframes custom-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: custom-bounce 2s infinite ease-in-out;
        }
      `}</style>

      {!isOpen ? (
        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
            <div className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-black/10">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              LIVE
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-tr from-[#A500FF] to-[#7000FF] p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 animate-ping rounded-full opacity-20 group-hover:opacity-40" />
            <MessageSquare className="text-white relative z-10" />
          </button>
        </div>
      ) : (
        <div className="w-[calc(100vw-2rem)] h-[80vh] max-h-[600px] sm:w-[400px] sm:h-[550px] bg-[#0d0d0d]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#A500FF]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#A500FF]/20 rounded-xl">
                <Sparkles className="text-[#A500FF] animate-pulse" size={18} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Cliva Agent</h3>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isLocked ? 'text-red-500' : 'text-gray-500'}`}>
                  {isLocked ? "Limit Reached" : `${remaining ?? 5}/5 Messages`}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <X className="text-gray-500 hover:text-white" size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-5 cliva-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-[13.5px] border ${m.role === 'user' ? 'bg-white text-black font-bold rounded-tr-none' : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none backdrop-blur-sm'}`}>
                  {m.role === 'cliva' && m.isNew ? (
                    <TypewriterMessage text={m.content} />
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  )}
                  {m.role === 'cliva' && (
                    <button onClick={sendFeedback} className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-[#A500FF] transition-colors font-bold uppercase tracking-tighter">
                      <ThumbsUp size={11} /> Helpful
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isApiLoading && (
              <div className="flex justify-start items-center gap-2 px-2">
                <Loader2 className="animate-spin text-[#A500FF]" size={16} />
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Thinking</span>
              </div>
            )}
          </div>

          {/* Input / Lock Area */}
          <div className="p-6 border-t border-white/5 bg-black/20">
            {isLocked ? (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-center gap-2 text-amber-500 py-2">
                  <Lock size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Daily Limit Reached</span>
                </div>
                <Link
                  href="/waitlist#join"
                  className="w-full bg-[#A500FF] text-white text-center py-3 rounded-2xl font-bold text-sm hover:bg-[#8e00db] transition-all shadow-lg shadow-[#A500FF]/20"
                >
                  Join the Waitlist for Full Access
                </Link>
              </div>
            ) : (
              <div className="relative group">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white text-sm outline-none focus:border-[#A500FF]/50 transition-all placeholder:text-gray-700"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Shopify scaling..."
                />
                <button
                  onClick={handleSend}
                  disabled={isApiLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#A500FF] text-white rounded-xl active:scale-90 transition-all disabled:opacity-30 shadow-lg shadow-[#A500FF]/20"
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};