"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoSend, IoClose, IoTimeOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

// ... TypewriterText remains the same ...

const ClivaChat = ({ isOpen, onClose, activeProduct }: any) => {
  const { callApi } = UseAPI();
  const { user, addToast, syncQuotas } = useAppContext();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "general";
  const contextKey = activeProduct ? `product-${activeProduct.id}` : `view-${currentView}`;

  const [allThreads, setAllThreads] = useState<Record<string, any[]>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFinishingType, setIsFinishingType] = useState(false);

  // ⚡️ UPDATED STATE: Handling nextRechargeAt
  const [quotaInfo, setQuotaInfo] = useState({
    used: 0,
    limit: 10,
    nextRechargeAt: null as string | null
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // ⚡️ DYNAMIC RECHARGE CALCULATOR
  const rechargeDisplay = useMemo(() => {
    if (!quotaInfo.nextRechargeAt) return "midnight";
    const date = new Date(quotaInfo.nextRechargeAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [quotaInfo.nextRechargeAt]);

  const isLimitHit = quotaInfo.used >= quotaInfo.limit;

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
            setQuotaInfo({
              used: res.data.usedToday || 0,
              limit: res.data.limit || 10,
              nextRechargeAt: res.data.nextRechargeAt || null
            });
          }
        } catch (err) { console.error("History retrieval failed"); }
      };
      initChat();
    }
  }, [isOpen, activeProduct, currentView, contextKey, callApi]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || isTyping || isLimitHit) return;

    const userMsg = { role: "user", content: messageToSend };
    const threadWithUserMsg = [...(allThreads[contextKey] || []), userMsg];

    setAllThreads(prev => ({ ...prev, [contextKey]: threadWithUserMsg }));
    setInput("");
    setIsTyping(true);

    try {
      const res = await callApi("/chat", "POST", {
        message: messageToSend,
        context: currentView,
        productId: activeProduct?.id || null,
        productData: activeProduct || null,
      });

      if (res?.reply) {
        const clivaMsg = { role: "cliva", content: res.reply };
        setAllThreads(prev => ({ ...prev, [contextKey]: [...threadWithUserMsg, clivaMsg] }));
        setQuotaInfo({
          used: res.usedInWindow,
          limit: res.windowLimit,
          nextRechargeAt: res.nextRechargeAt || null
        });
      }
    } catch (error) { addToast("Neural link unstable.", "error"); } finally { setIsTyping(false); }
  };

  // ... Rest of the component (UI, Suggested Actions) remains the same ...

  return (
    <>
      {/* ... styles ... */}
      <div className="fixed inset-y-0 right-0 w-[450px] bg-[#08090a]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-[100] flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isLimitHit ? 'bg-red-500/10' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isLimitHit ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
              {isLimitHit ? <IoTimeOutline size={20} className="animate-pulse" /> : <HiSparkles size={20} className="animate-pulse" />}
            </div>
            <div>
              <h3 className="font-bold text-white leading-none mb-1">
                {isLimitHit ? "Battery Depleted" : "Product Strategist"}
              </h3>
              <p className={`text-[9px] font-black uppercase ${isLimitHit ? 'text-red-500' : 'text-gray-500'}`}>
                {isLimitHit ? `Next Window: ${rechargeDisplay}` : "Assistant Active"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end mr-4">
            <span className={`text-[11px] font-black ${isLimitHit ? 'text-red-500' : 'text-amber-500'}`}>
              {Math.max(0, quotaInfo.limit - quotaInfo.used)} / {quotaInfo.limit}
            </span>
            <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">Logic Left</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500"><IoClose size={24} /></button>
        </div>

        {/* ... Chat Scroll Area ... */}

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-[#08090a]">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || isLimitHit}
              placeholder={isLimitHit ? `Recharging... available at ${rechargeDisplay}` : `Ask Cliva...`}
              className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-6 pr-14 text-white outline-none ${isLimitHit ? 'border-red-500/20 cursor-not-allowed italic' : 'border-white/10 focus:border-amber-500/40'}`}
            />
            {/* ... Button ... */}
          </form>
        </div>
      </div>
    </>
  );
};