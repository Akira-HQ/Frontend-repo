"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoSend, IoClose, IoTimeOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

const ClivaChat = ({ isOpen, onClose, activeProduct }: any) => {
  const { callApi } = UseAPI();
  const { user, addToast } = useAppContext();
  const searchParams = useSearchParams();

  // 1. DYNAMIC CONTEXT DETECTION
  const currentView = searchParams.get("view") || "general";
  const isSettings = currentView === "settings" || currentView === "quotas";
  const contextKey = activeProduct ? `product-${activeProduct.id}` : `view-${currentView}`;

  const [allThreads, setAllThreads] = useState<Record<string, any[]>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState({ used: 0, limit: 10 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- RECHARGE CALCULATION ---
  const rechargeTime = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const isLimitHit = quotaInfo.used >= quotaInfo.limit;

  // --- LOAD HISTORY & QUOTA ON OPEN ---
  useEffect(() => {
    if (isOpen) {
      const initChat = async () => {
        const endpoint = activeProduct
          ? `/cliva-chat-history?productId=${activeProduct.id}`
          : `/cliva-chat-history?context=${currentView}`;

        try {
          const res = await callApi(endpoint, "GET");
          if (res?.data) {
            setAllThreads(prev => ({ ...prev, [contextKey]: res.data.messages || [] }));
            setQuotaInfo({ used: res.data.usedToday || 0, limit: res.data.limit || 10 });
          }
        } catch (err) {
          console.error("Failed to load Cliva history");
        }
      };
      initChat();
    }
  }, [isOpen, activeProduct, currentView, contextKey]);

  // --- QUICK ACTIONS LOGIC ---
  const getQuickActions = () => {
    if (activeProduct) {
      return [
        { label: "Identify Friction", value: "What are the specific conversion blockers for this product?" },
        { label: "Analyze Score", value: `Explain why this score is ${activeProduct.health}%` }
      ];
    }
    if (isSettings) {
      return [
        { label: "Quota Breakdown", value: "Give me a detailed report of my quota usage this week." },
        { label: "Limits explained", value: "How do my daily recharges work?" }
      ];
    }
    return [
      { label: "Store Health", value: "Summarize my overall store inventory performance." },
      { label: "Conversion Tips", value: "3 quick wins to improve my store today." }
    ];
  };

  // --- CONTEXT-BASED GREETING ---
  const currentMessages = useMemo(() => {
    const thread = allThreads[contextKey] || [];
    if (thread.length > 0) return thread;

    let greeting = `I see we're in the **${currentView.replace('-', ' ')}** section. How can I assist with your strategy?`;
    if (activeProduct) {
      greeting = `I'm focused on **${activeProduct.name}**. I've mapped the friction points—what should we optimize first?`;
    } else if (isSettings) {
      greeting = `Welcome to your **Settings & Control Center**. I can help you understand your energy recharges or subscription limits.`;
    }
    return [{ role: "cliva", content: greeting }];
  }, [allThreads, contextKey, activeProduct, currentView, isSettings]);

  // --- AUTO SCROLL ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [currentMessages, isTyping]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || isTyping || isLimitHit) return;

    const userMsg = { role: "user", content: messageToSend };
    const threadWithUserMsg = [...currentMessages, userMsg];

    // Optimistic Update
    setAllThreads(prev => ({ ...prev, [contextKey]: threadWithUserMsg }));
    setInput("");
    setIsTyping(true);

    try {
      const res = await callApi("/chat", "POST", {
        message: messageToSend,
        context: currentView,
        productId: activeProduct?.id || null,
      });

      if (res?.reply) {
        const clivaMsg = { role: "cliva", content: res.reply };
        setAllThreads(prev => ({
          ...prev,
          [contextKey]: [...threadWithUserMsg, clivaMsg]
        }));
        setQuotaInfo({ used: res.usedToday, limit: res.limit });
        if (res.isLimitHit) addToast("Dashboard chat limit reached.", "warning");
      }
    } catch (error) {
      addToast("Connection issues.", "error");
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * SUGGESTION VISIBILITY LOGIC:
   * 1. Only show if there is exactly 1 message (the greeting).
   * 2. Only show if the user isn't currently typing.
   * 3. Hide as soon as the first user message is sent or input starts.
   */
  const showSuggestions = currentMessages.length === 1 && input.length === 0 && !isTyping && !isLimitHit;

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .cliva-scrollbar::-webkit-scrollbar { width: 4px; }
        .cliva-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .cliva-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.2); border-radius: 10px; }
        .cliva-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.5); }
        .markdown-body strong { color: #f59e0b; font-weight: 700; }
        .markdown-body p { margin-bottom: 0.75rem; line-height: 1.6; }
      `}</style>

      <div className="fixed inset-y-0 right-0 w-[450px] bg-[#08090a]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-500">

        {/* Header */}
        <div className={`p-6 border-b border-white/5 flex justify-between items-center transition-colors duration-500 ${isLimitHit ? 'bg-red-500/10' : isSettings ? 'bg-blue-500/5' : activeProduct ? 'bg-amber-500/5' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border shadow-inner transition-all ${isLimitHit ? 'bg-red-500/10 text-red-500 border-red-500/20' : isSettings ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
              {isLimitHit ? <IoTimeOutline size={20} className="animate-pulse" /> : <HiSparkles size={20} className="animate-pulse" />}
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight leading-none mb-1">
                {isLimitHit ? "Battery Depleted" : isSettings ? "System Intelligence" : activeProduct ? "Product Strategist" : "Cliva's Lounge"}
              </h3>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isLimitHit ? 'text-red-500' : 'text-gray-500'}`}>
                {isLimitHit ? "Locked until midnight" : "Assistant Active"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end mr-4">
            <span className={`text-[11px] font-black tracking-tighter uppercase leading-none ${isLimitHit ? 'text-red-500' : 'text-amber-500'}`}>
              {Math.max(0, quotaInfo.limit - quotaInfo.used)} / {quotaInfo.limit}
            </span>
            <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">Logic Left</span>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors hover:text-white"><IoClose size={24} /></button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 cliva-scrollbar scroll-smooth">
          {currentMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] shadow-xl border ${m.role === 'user' ? 'bg-white text-black font-semibold rounded-tr-none border-white' : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none backdrop-blur-sm'}`}>
                <div className="markdown-body"><ReactMarkdown>{m.content}</ReactMarkdown></div>
              </div>
            </div>
          ))}

          {showSuggestions && (
            <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-1">Suggested for this section</p>
              {getQuickActions().map((action, idx) => (
                <button key={idx} onClick={() => handleSend(action.value)} className="text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-amber-500/90 text-xs font-bold hover:bg-white/[0.06] transition-all hover:translate-x-1 active:scale-95">
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {isTyping && <div className="text-[10px] text-gray-600 font-bold uppercase animate-pulse">Cliva is processing...</div>}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-[#08090a]">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || isLimitHit}
              placeholder={isLimitHit ? `Cliva recharges at ${rechargeTime}` : `Ask about ${isSettings ? 'limits...' : 'strategy...'}`}
              className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-6 pr-14 text-white outline-none transition-all placeholder:text-gray-700 ${isLimitHit ? 'border-red-500/20 cursor-not-allowed italic' : 'border-white/10 focus:border-amber-500/40'}`}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || isLimitHit}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isLimitHit ? 'bg-gray-900 text-red-500/40' : 'bg-white text-black hover:bg-amber-500 hover:text-white active:scale-90'}`}
            >
              {isLimitHit ? <IoTimeOutline size={18} /> : <IoSend size={18} />}
            </button>
          </form>
          {isLimitHit && (
            <p className="text-[9px] text-red-500/60 font-bold uppercase text-center mt-4 tracking-[0.2em] animate-pulse">
              Daily Strategy Quota Reached
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ClivaChat;