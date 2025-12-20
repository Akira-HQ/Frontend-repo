"use client";
import React, { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi2";
import { HiOutlineSave } from "react-icons/hi";
import { IoClose, IoCheckmarkCircle, IoCloseCircle, IoLockClosed, IoFlash, IoChatbubblesOutline } from "react-icons/io5";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

interface ProductAuditProps {
  product: any;
  onSelect: (product: any) => void;
  onProductUpdated: (product: any) => void;
}

const ProductAudit = ({ product, onSelect, onProductUpdated }: ProductAuditProps) => {
  const { callApi } = UseAPI();
  // Destructured openChat from your context
  const { user, addToast, openChat } = useAppContext();

  const [desc, setDesc] = useState(product?.description || "");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const isLocked = user?.plan?.toLowerCase() === "free";

  useEffect(() => {
    setDesc(product?.description || "");
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      const res = await callApi("/products/update-description", "POST", {
        productId: product.id,
        description: desc
      });
      if (res?.data) {
        onProductUpdated(res.data);
        addToast("Cleaned up and saved! Your store looks better already.", "success");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIEnhance = async () => {
    if (isLocked) {
      addToast("Upgrade your plan to unlock my full creative brain!", "warning");
      return;
    }
    setIsEnhancing(true);
    try {
      const res = await callApi("/products/enhance", "POST", { productId: product.id });
      if (res?.data) {
        setDesc(res.data.enhancedDescription);
        addToast("I've reimagined this copy. Much more professional, right?", "success");
      }
    } catch (error: any) {
      const message = error.response?.status === 429
        ? "I've run out of breath for today! Let's pick this up tomorrow."
        : "My connection to the mainframe is a bit fuzzy. One sec!";
      addToast(message, "warning");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleTargetedEnhance = async (weakness: string, index: number) => {
    if (isLocked) {
      addToast("My targeted audits are reserved for the inner circle (Pro/Basic).", "warning");
      return;
    }

    setEnhancingIndex(index);
    try {
      const res = await callApi("/products/enhance-targeted", "POST", {
        productId: product.id,
        targetWeakness: weakness
      });

      if (res?.data) {
        setDesc(res.data.enhancedDescription);
        onProductUpdated(res.data);
        addToast("Fixed that specific headache for you!", "success");
      }
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 429 || status === 403) {
        addToast("I'm tapped out! You've used your fixes for today. Drink some water, I'll be back tomorrow.", "warning");
      } else {
        addToast("Something went wrong. Even I have bad days.", "error");
      }
    } finally {
      setEnhancingIndex(null);
    }
  };

  if (!product) return (
    <div className="h-[500px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-500 p-10 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-4 opacity-20"><HiSparkles size={56} /></div>
      <p className="text-lg font-medium tracking-tight">Select a product to let <br /> Cliva run a diagnostic.</p>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        
        @keyframes slideInAudit {
          from { opacity: 0; transform: translateX(30px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }

        .audit-entrance {
          animation: slideInAudit 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="bg-[#0b0b0b] border border-white/10 rounded-[2.5rem] p-10 sticky top-24 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar audit-entrance">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Cliva's Audit</h3>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${product.status === 'Strong' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {product.status || 'Weak'}
            </span>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:rotate-90 active:scale-90"
          >
            <IoClose size={24} className="text-gray-400" />
          </button>
        </div>

        <img src={product.imageUrls?.[0]} className="w-full h-64 object-cover rounded-3xl mb-8 border border-white/5 shadow-lg transition-transform duration-700 hover:scale-[1.02]" alt="" />

        {/* Intelligence Card with Discussion Button */}
        <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl transition-all duration-500 hover:border-amber-500/20">
          <div className="flex items-center gap-2 mb-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <HiSparkles className="animate-pulse" /> Cliva's Intelligence
          </div>
          <p className="text-[17px] text-gray-200 leading-relaxed italic font-medium mb-4">
            "{product.thinking_process || "Let me take a look at the fine print here..."}"
          </p>

          <button
            onClick={() => openChat(product)} // Triggers the chat interface
            className="text-[10px] font-black uppercase text-amber-500/60 hover:text-amber-500 flex items-center gap-2 tracking-widest transition-all group/btn"
          >
            <IoChatbubblesOutline className="group-hover/btn:scale-125 transition-transform" />
            Discuss this product
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-10">
          <div>
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1 mb-4">The Highlights</h4>
            <div className="space-y-3">
              {product.strengths?.length > 0 ? (
                product.strengths.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-green-500/5 border border-green-500/10 rounded-2xl transition-all duration-300 hover:translate-x-1">
                    <IoCheckmarkCircle className="mt-0.5 shrink-0 text-green-500 size-6" />
                    <span className="text-[16px] text-green-200/80 leading-snug">{s}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 px-1 italic">I'm still looking for the silver lining...</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1 mb-4">Friction Points</h4>
            <div className="space-y-4">
              {product.reasons?.map((r: string, i: number) => (
                <div key={i} className="group flex flex-col gap-3 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl transition-all duration-300 hover:translate-x-1">
                  <div className="flex items-start gap-4">
                    <IoCloseCircle className="mt-0.5 shrink-0 text-red-500 size-6" />
                    <span className="text-[16px] text-red-200/80 leading-snug">{r}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1 border-t border-red-500/10 pt-3 mt-1">
                    <button
                      onClick={() => handleTargetedEnhance(r, i)}
                      disabled={isLocked || enhancingIndex !== null || product.daily_enhance_limit === 0}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all active:scale-95
                        ${isLocked || product.daily_enhance_limit === 0
                          ? 'bg-white/5 text-gray-600'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 shadow-lg shadow-amber-500/5'}`}
                    >
                      {isLocked ? <IoLockClosed size={14} /> : <IoFlash size={14} className={enhancingIndex === i ? 'animate-pulse' : ''} />}
                      {enhancingIndex === i ? "Working my magic..." : "Fix This Point"}
                    </button>
                    {!isLocked && (
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mr-2 opacity-60">
                        {product.daily_enhance_limit || 0} energy charges left
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">The Editor</label>
            <button
              onClick={handleAIEnhance}
              disabled={isLocked || isEnhancing}
              className={`flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-xl active:scale-95
                ${isLocked ? 'bg-white/5 text-gray-600' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/5'}`}
            >
              {isLocked ? <IoLockClosed /> : <HiSparkles className={isEnhancing ? 'animate-spin' : ''} />}
              {isEnhancing ? "Cliva is drafting..." : "Enhance Full Copy"}
            </button>
          </div>

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-base text-gray-200 min-h-[220px] outline-none focus:border-amber-500/30 transition-all placeholder:text-gray-700 leading-relaxed shadow-inner custom-scrollbar"
            placeholder="Product description goes here..."
          />

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-5 bg-white text-black text-lg font-bold rounded-3xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5 disabled:opacity-50 active:scale-[0.98]"
          >
            {isSaving ? "Finalizing..." : <><HiOutlineSave size={22} /> Save Changes</>}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductAudit;