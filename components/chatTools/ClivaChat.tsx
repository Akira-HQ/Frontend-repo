"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoSend, IoClose, IoTimeOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

// --- ⚡️ TYPING EFFECT COMPONENT ---
const TypewriterText = ({ text, speed = 15, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    index.current = 0;
    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

const ClivaChat = ({ isOpen, onClose, activeProduct }: any) => {
  const { callApi } = UseAPI();
  const { user, addToast, syncQuotas } = useAppContext();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "general";
  const isSettings = currentView === "settings" || currentView === "quotas";
  const isInbox = currentView === "inbox";
  const isIntegration = currentView === "integrations";

  const contextKey = activeProduct ? `product-${activeProduct.id}` : `view-${currentView}`;

  const [allThreads, setAllThreads] = useState<Record<string, any[]>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFinishingType, setIsFinishingType] = useState(false);

  // ⚡️ UPDATED: Added nextRechargeAt to state
  const [quotaInfo, setQuotaInfo] = useState({
    used: 0,
    limit: 10,
    nextRechargeAt: null as string | null
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // ⚡️ UPDATED: Uses dynamic time from backend or defaults to midnight
  const rechargeDisplay = useMemo(() => {
    if (!quotaInfo.nextRechargeAt) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      return tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const date = new Date(quotaInfo.nextRechargeAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [quotaInfo.nextRechargeAt]);

  const isLimitHit = quotaInfo.used >= quotaInfo.limit;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token || !isOpen) return;

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}&type=dashboard`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "CLIVA_MESSAGE") {
          const clivaMsg = { role: "cliva", content: data.message };
          setAllThreads(prev => ({ ...prev, [contextKey]: [...(prev[contextKey] || []), clivaMsg] }));
        }
        if (data.type === "QUOTA_UPDATE" || data.type === "AUDIT_COMPLETE") syncQuotas();
        if (data.type === "CLIVA_THINKING") setIsTyping(data.status);
      };
      return () => ws.close();
    }
  }, [isOpen, contextKey, syncQuotas]);

  useEffect(() => {
    if (isOpen) {
      const initChat = async () => {
        const endpoint = activeProduct ? `/cliva-chat-history?productId=${activeProduct.id}` : `/cliva-chat-history?context=${currentView}`;
        try {
          const res = await callApi(endpoint, "GET");
          if (res?.data) {
            setAllThreads(prev => ({ ...prev, [contextKey]: res.data.messages || [] }));
            // ⚡️ UPDATED: Map response to include nextRechargeAt
            setQuotaInfo({
              used: res.data.usedToday || 0,
              limit: res.data.limit || 10,
              nextRechargeAt: res.data.nextRechargeAt || null
            });
          }
        } catch (err) { console.error("Failed to load Cliva history"); }
      };
      initChat();
    }
  }, [isOpen, activeProduct, currentView, contextKey, callApi]);

  const getQuickActions = () => {
    if (activeProduct) {
      const score = activeProduct.health_score ?? activeProduct.health ?? 0;
      return [
        { label: "Identify Friction", value: "What are the specific conversion blockers for this product?" },
        { label: "Analyze Score", value: `Explain why this score is ${score}%` }
      ];
    }
    if (isInbox) {
      return [
        { label: "High-Intent Leads", value: "Analyze the current inbox and list customers who are closest to buying." },
        { label: "Summary", value: "What is the general sentiment in the inbox right now?" }
      ];
    }
    if (isIntegration) {
      return [
        { label: "Installation Guide", value: "Show me exactly how to install the snippet in my Shopify theme." },
        { label: "Verification Status", value: "Is my neural link currently active and tracking?" }
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

  const currentMessages = useMemo(() => {
    const thread = allThreads[contextKey] || [];
    if (thread.length > 0) return thread;

    let greeting = `I see we're in the **${currentView.replace('-', ' ')}** section. How can I assist?`;
    if (activeProduct) {
      greeting = `I'm focused on **${activeProduct.name}**. I've mapped the friction points—what should we optimize first?`;
    } else if (isInbox) {
      greeting = `I am analyzing your live customer chats. I can help you spot hot leads or summarize feedback.`;
    } else if (isIntegration) {
      greeting = `Ready to go live? I can walk you through pasting your snippet into **theme.liquid** step-by-step.`;
    } else if (isSettings) {
      greeting = `Welcome to your **Settings**. I can explain your energy limits or help with plan details.`;
    }
    return [{ role: "cliva", content: greeting }];
  }, [allThreads, contextKey, activeProduct, currentView, isSettings, isInbox, isIntegration]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [currentMessages, isTyping, isFinishingType]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || isTyping || isLimitHit) return;

    const userMsg = { role: "user", content: messageToSend };
    const threadWithUserMsg = [...(allThreads[contextKey] || []), userMsg];

    setAllThreads(prev => ({ ...prev, [contextKey]: threadWithUserMsg }));
    setInput("");
    setIsTyping(true);
    setIsFinishingType(true);

    const snapshot = activeProduct ? {
      selectedProduct: activeProduct.name,
      health: activeProduct.health_score ?? activeProduct.health ?? 0,
      is_audited: !!activeProduct.is_ai_audited
    } : null;

    try {
      const res = await callApi("/chat", "POST", {
        message: messageToSend,
        context: currentView,
        productId: activeProduct?.id || null,
        productData: activeProduct || null,
        storeSnapshot: snapshot,
        accountStats: { history: [], currentQuotas: [] }
      });

      if (res?.reply) {
        const clivaMsg = { role: "cliva", content: res.reply };
        setAllThreads(prev => ({ ...prev, [contextKey]: [...threadWithUserMsg, clivaMsg] }));
        // ⚡️ UPDATED: Handling backend field names for dynamic reset
        setQuotaInfo({
          used: res.usedInWindow ?? res.usedToday,
          limit: res.windowLimit ?? res.limit,
          nextRechargeAt: res.nextRechargeAt || null
        });
        if (res.isLimitHit) addToast("Dashboard chat limit reached.", "warning");
      }
    } catch (error) { addToast("Connection issues.", "error"); } finally { setIsTyping(false); }
  };

  const showSuggestions = currentMessages.length === 1 && !isFinishingType && input.length === 0 && !isTyping && !isLimitHit;

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
        <div className={`p-6 border-b border-white/5 flex justify-between items-center transition-colors duration-500 ${isLimitHit ? 'bg-red-500/10' : isSettings ? 'bg-blue-500/5' : isInbox ? 'bg-green-500/5' : isIntegration ? 'bg-purple-500/5' : activeProduct ? 'bg-amber-500/5' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border shadow-inner transition-all ${isLimitHit ? 'bg-red-500/10 text-red-500 border-red-500/20' : isSettings ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : isInbox ? 'bg-green-500/10 text-green-500 border-green-500/20' : isIntegration ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
              {isLimitHit ? <IoTimeOutline size={20} className="animate-pulse" /> : <HiSparkles size={20} className="animate-pulse" />}
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight leading-none mb-1">
                {isLimitHit ? "Battery Depleted" : isSettings ? "System Intelligence" : isInbox ? "Sales Intelligence" : isIntegration ? "Neural Architect" : activeProduct ? "Product Strategist" : "Cliva's Lounge"}
              </h3>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isLimitHit ? 'text-red-500' : 'text-gray-500'}`}>
                {isLimitHit ? `Next Window: ${rechargeDisplay}` : "Assistant Active"}
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
          {currentMessages.map((m, i) => {
            const isLastMessage = i === currentMessages.length - 1;
            return (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] shadow-xl border ${m.role === 'user' ? 'bg-white text-black font-semibold rounded-tr-none border-white' : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none backdrop-blur-sm'}`}>
                  <div className="markdown-body">
                    {m.role === 'cliva' && isLastMessage ? (
                      <TypewriterText
                        text={m.content}
                        onComplete={() => setIsFinishingType(false)}
                      />
                    ) : (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

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
              placeholder={isLimitHit ? `Cliva recharges at ${rechargeDisplay}` : `Ask about ${isSettings ? 'limits...' : isInbox ? 'this inbox...' : isIntegration ? 'installation...' : 'strategy...'}`}
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