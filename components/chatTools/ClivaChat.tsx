"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { useSearchParams } from "next/navigation";

const ClivaChat = ({ isOpen, onClose, activeProduct }: any) => {
  const { callApi } = UseAPI();
  const { addToast } = useAppContext();
  const searchParams = useSearchParams();

  // 1. DETERMINE UNIQUE CONTEXT KEY
  const currentView = searchParams.get("view") || "general";
  const contextKey = activeProduct ? `product-${activeProduct.id}` : `view-${currentView}`;

  const [allThreads, setAllThreads] = useState<Record<string, any[]>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 2. PERSISTENCE & MULTI-THREAD LOGIC ---
  useEffect(() => {
    const savedData = localStorage.getItem("cliva_threaded_chats");
    if (savedData) {
      const { timestamp, threads } = JSON.parse(savedData);
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;

      if (isExpired) {
        localStorage.removeItem("cliva_threaded_chats");
        setAllThreads({});
      } else {
        setAllThreads(threads);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(allThreads).length > 0) {
      localStorage.setItem("cliva_threaded_chats", JSON.stringify({
        timestamp: Date.now(),
        threads: allThreads,
      }));
    }
  }, [allThreads]);

  // --- 3. QUICK ACTIONS LOGIC ---
  const getQuickActions = () => {
    if (activeProduct) {
      const actions = [
        { label: "What's holding this back?", value: "Explain the main friction points for this product and how to fix them." },
        { label: "Analyze Score", value: `Why did you give this product a health score of ${activeProduct.health}?` }
      ];
      // Add Deep Audit only if it hasn't been done yet
      if (!activeProduct.is_ai_audit) {
        actions.unshift({ label: "✨ Run Deep AI Audit (1 Left)", value: "DEEP_AUDIT_REQUEST" });
      }
      return actions;
    }

    if (currentView === "integrations") {
      return [
        { label: "Check API Health", value: "Are my external store connections working correctly?" },
        { label: "Shopify Sync Help", value: "How do I ensure my latest inventory is synced with Cliva?" }
      ];
    }

    return [
      { label: "General Audit", value: "Give me a summary of my entire inventory's health." },
      { label: "Conversion Tips", value: "What are 3 things I can do right now to increase sales?" }
    ];
  };

  // --- 4. MESSAGE HANDLING ---
  const currentMessages = useMemo(() => {
    if (allThreads[contextKey]) return allThreads[contextKey];

    const greeting = activeProduct
      ? `I'm focused on **${activeProduct.name}**. I've got the audit data ready—what would you like to tweak or understand about this product?`
      : `I see we're in the **${currentView.replace('-', ' ')}** section. How can I assist with your store strategy here?`;

    return [{ role: "cliva", content: greeting }];
  }, [allThreads, contextKey, activeProduct, currentView]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [currentMessages, isTyping]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || isTyping) return;

    // INTERCEPT: Handle Deep Audit Command
    if (messageToSend === "DEEP_AUDIT_REQUEST") {
      setIsTyping(true);
      try {
        const res = await callApi("/products/deep-audit", "POST", { productId: activeProduct.id });
        if (res?.data?.success || res?.success) {
          addToast("Deep Audit Complete!", "success");
          // Add a system message to the chat
          const systemMsg = { role: "cliva", content: "✨ I've finished the Deep AI Audit. I've updated the friction points and health score based on high-conversion standards." };
          setAllThreads(prev => ({ ...prev, [contextKey]: [...currentMessages, systemMsg] }));
        }
      } catch (err) {
        addToast("Audit failed. Credits preserved.", "error");
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
      const res = await callApi("/products/chat", "POST", {
        message: messageToSend,
        context: currentView,
        productId: activeProduct?.id || null,
        productData: activeProduct || null,
        history: currentMessages.slice(-6)
      });

      if (res?.data) {
        const clivaMsg = { role: "cliva", content: res.data.reply };
        setAllThreads(prev => ({
          ...prev,
          [contextKey]: [...updatedHistory, clivaMsg]
        }));
      }
    } catch (error: any) {
      addToast("Connection flickering. Trying to reconnect...", "warning");
    } finally {
      setIsTyping(false);
    }
  };

  const showActionButtons = currentMessages.length === 1 && input.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-[#08090a]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20 shadow-inner">
            <HiSparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight leading-none mb-1">Cliva's Lounge</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Contextual Assistant</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors hover:text-white">
          <IoClose size={24} />
        </button>
      </div>

      {/* Context Banner */}
      {activeProduct && (
        <div className="px-6 py-3 bg-amber-500/5 border-b border-white/5 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <img src={activeProduct.imageUrls?.[0]} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="" />
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest truncate italic">Locked Context: {activeProduct.name}</span>
        </div>
      )}

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
        {currentMessages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-xl border ${m.role === 'user'
              ? 'bg-white text-black font-semibold rounded-tr-none border-white'
              : 'bg-white/5 text-gray-200 border-white/5 rounded-tl-none backdrop-blur-sm'
              }`}>
              {m.content}
            </div>
          </div>
        ))}

        {showActionButtons && (
          <div className="flex flex-col gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-1">Suggested for this context</p>
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
          <div className="flex justify-start items-center gap-2">
            <div className="bg-white/5 p-3 rounded-xl flex gap-1 border border-white/5 shadow-inner">
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Cliva is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#08090a] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={activeProduct ? `Instruction for this product...` : `Ask about ${currentView}...`}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white outline-none focus:border-amber-500/40 transition-all placeholder:text-gray-700 shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-all active:scale-90 disabled:bg-gray-800 disabled:text-gray-600 shadow-xl"
          >
            <IoSend size={18} />
          </button>
        </form>
        <p className="text-center text-[9px] text-gray-700 mt-4 uppercase tracking-[0.2em] font-black">History Clears in 24 Hours</p>
      </div>
    </div>
  );
};

export default ClivaChat;