"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

const ClivaChat = ({ isOpen, onClose, activeProduct }: any) => {
  const { callApi } = UseAPI();
  const { user, addToast, syncQuotas } = useAppContext();
  const searchParams = useSearchParams();

  // 1. UNIQUE CONTEXT KEY
  const currentView = searchParams.get("view") || "general";
  const contextKey = activeProduct ? `product-${activeProduct.id}` : `view-${currentView}`;

  const [allThreads, setAllThreads] = useState<Record<string, any[]>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 2. LOAD HISTORY & SYNC QUOTA ON OPEN ---
  useEffect(() => {
    if (isOpen) {
      const initChat = async () => {
        if (typeof syncQuotas === 'function') await syncQuotas();

        const endpoint = activeProduct
          ? `/cliva-chat-history?productId=${activeProduct.id}`
          : `/cliva-chat-history?context=${currentView}`;

        try {
          const res = await callApi(endpoint, "GET");
          if (res?.data) {
            setAllThreads(prev => ({
              ...prev,
              [contextKey]: res.data
            }));
          }
        } catch (err) {
          console.error("Failed to load Cliva history");
        }
      };
      initChat();
    }
  }, [isOpen, activeProduct, currentView, contextKey]);

  // --- 3. QUICK ACTIONS LOGIC ---
  const getQuickActions = () => {
    if (activeProduct) {
      const actions = [
        { label: "What's holding this back?", value: "Explain the main friction points for this product." },
        { label: "Analyze Score", value: `Why did you give this product a health score of ${activeProduct.health}?` }
      ];
      if (!activeProduct.is_ai_audit) {
        actions.unshift({ label: "✨ Run Deep AI Audit", value: "DEEP_AUDIT_REQUEST" });
      }
      return actions;
    }
    return [
      { label: "General Audit", value: "Give me a summary of my entire inventory's health." },
      { label: "Conversion Tips", value: "What are 3 things I can do right now to increase sales?" }
    ];
  };

  // --- 4. MESSAGE HANDLING ---
  const currentMessages = useMemo(() => {
    if (allThreads[contextKey] && allThreads[contextKey].length > 0) {
      return allThreads[contextKey];
    }

    const greeting = activeProduct
      ? `I'm focused on **${activeProduct.name}**. I've got the audit data ready—what would you like to tweak or understand about this product?`
      : `I see we're in the **${currentView.replace('-', ' ')}** section. How can I assist with your store strategy here?`;

    return [{ role: "cliva", content: greeting }];
  }, [allThreads, contextKey, activeProduct, currentView]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [currentMessages, isTyping]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || isTyping || (user?.daily_chat_limit ?? 0) <= 0) return;

    if (messageToSend === "DEEP_AUDIT_REQUEST") {
      setIsTyping(true);
      try {
        const res = await callApi("/products/deep-audit", "POST", { productId: activeProduct.id });
        if (res?.success || res?.data) {
          addToast("Deep Audit Complete!", "success");
          const systemMsg = { role: "cliva", content: "✨ I've finished the Deep AI Audit. I've updated the friction points and health score based on high-conversion standards." };
          setAllThreads(prev => ({ ...prev, [contextKey]: [...currentMessages, systemMsg] }));
          if (typeof syncQuotas === 'function') await syncQuotas();
        }
      } catch (err) {
        addToast("Audit failed.", "error");
      } finally {
        setIsTyping(false);
      }
      return;
    }

    const userMsg = { role: "user", content: messageToSend };
    const updatedHistory = [...currentMessages, userMsg];

    setAllThreads(prev => ({ ...prev, [contextKey]: updatedHistory }));
    setInput("");
    setIsTyping(true);

    try {
      const res = await callApi("/chat", "POST", {
        message: messageToSend,
        context: currentView,
        productId: activeProduct?.id || null,
        productData: activeProduct || null,
      });

      if (res?.data) {
        const clivaMsg = { role: "cliva", content: res.data.reply };

        setAllThreads(prev => ({
          ...prev,
          [contextKey]: [...updatedHistory, clivaMsg]
        }));

        // Trigger immediate quota sync so header updates without refresh
        if (typeof syncQuotas === 'function') await syncQuotas();
        if (res.data.isLimitHit) addToast("Daily chat limit reached.", "warning");
      }
    } catch (error) {
      addToast("Connection issues. Trying to reconnect...", "warning");
    } finally {
      setIsTyping(false);
    }
  };

  const showActionButtons = currentMessages.length === 1 && input.length === 0;

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .cliva-scrollbar::-webkit-scrollbar { width: 4px; }
        .cliva-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .cliva-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(245, 158, 11, 0.2); 
          border-radius: 10px; 
        }
        .cliva-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.5); }
        
        .markdown-body strong { color: #f59e0b; font-weight: 700; }
        .markdown-body p { margin-bottom: 0.75rem; line-height: 1.6; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body ul { margin-bottom: 0.75rem; list-style-type: disc; padding-left: 1rem; }
      `}</style>

      <div className="fixed inset-y-0 right-0 w-[450px] bg-[#08090a]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#08090a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20 shadow-inner">
              <HiSparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight leading-none mb-1">Cliva's Lounge</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end mr-4">
            <span className="text-[11px] text-amber-500 font-black tracking-tighter uppercase leading-none">
              {user?.daily_chat_limit ?? 0}/10
            </span>
            <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">Energy</span>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors hover:text-white">
            <IoClose size={24} />
          </button>
        </div>

        {activeProduct && (
          <div className="px-6 py-3 bg-amber-500/5 border-b border-white/5 flex items-center gap-3">
            <img src={activeProduct.imageUrls?.[0]} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="" />
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest truncate italic">Product: {activeProduct.name}</span>
          </div>
        )}

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 cliva-scrollbar scroll-smooth">
          {currentMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] shadow-xl border ${m.role === 'user'
                  ? 'bg-white text-black font-semibold rounded-tr-none border-white'
                  : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none backdrop-blur-sm'
                }`}>
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {showActionButtons && (
            <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-1">Suggested Inquiries</p>
              {getQuickActions().map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.value)}
                  className="text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-amber-500/90 text-xs font-bold hover:bg-white/[0.06] transition-all hover:translate-x-1 active:scale-95"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start items-center gap-2 animate-pulse">
              <div className="bg-white/5 p-3 rounded-xl flex gap-1 border border-white/5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-50" />
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-20" />
              </div>
              <span className="text-[10px] text-gray-600 font-bold uppercase">Cliva is drafting...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#08090a] border-t border-white/5">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || (user?.daily_chat_limit ?? 0) <= 0}
              placeholder={(user?.daily_chat_limit ?? 0) <= 0 ? "Energy exhausted..." : "Message Cliva..."}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-gray-700 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || (user?.daily_chat_limit ?? 0) <= 0}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl hover:bg-amber-500 hover:text-white transition-all active:scale-90 disabled:bg-gray-800 disabled:text-gray-600"
            >
              <IoSend size={18} />
            </button>
          </form>
          <p className="text-center text-[9px] text-gray-700 mt-4 uppercase tracking-[0.2em] font-black italic">Refined Strategy by Cliva AI</p>
        </div>
      </div>
    </>
  );
};

export default ClivaChat;