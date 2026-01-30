"use client";
import React, { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi2";
import { HiOutlineSave } from "react-icons/hi";
import {
  IoClose,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoLockClosed,
  IoFlash,
  IoSyncOutline
} from "react-icons/io5";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

interface ProductAuditProps {
  product: any;
  allProducts?: any[]; // For Cliva's "God-mode" context
  onSelect: (product: any) => void;
  onProductUpdated: (product: any) => void;
  isBgAnalyzing?: boolean;
  analyzingCount?: number;
  enhanceQuota?: number;
  setEnhanceQuota?: (val: number) => void;
}

const ProductAudit = ({
  product,
  allProducts = [],
  onSelect,
  onProductUpdated,
  isBgAnalyzing,
  analyzingCount,
  enhanceQuota,
  setEnhanceQuota
}: ProductAuditProps) => {
  const { callApi } = UseAPI();
  const { user, addToast, openChat } = useAppContext();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const maxLimit = user?.quotas?.audits_limit ?? 5;
  const used = user?.quotas?.audits_used ?? 0;
  const limitFromUser = user?.quotas?.enhance_limit ?? 0;
  const usedFromUser = user?.quotas?.enhance_used ?? 0;
  const liveEnhanceQuota = enhanceQuota !== undefined ? enhanceQuota : Math.max(0, limitFromUser - usedFromUser);

  const analysis = product?.analysis || {};
  const health = product?.health_score || analysis?.health || 0;
  const status = health > 65 ? 'Strong' : 'Weak';

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDesc(product.description || "");
      setStock(product.stock || 0);
    }
  }, [product]);

  // ⚡️ ENHANCED CHAT OPENER: Gives Cliva the data to summarize the whole store
  const handleOpenClivaWithContext = () => {
    const storeSnapshot = {
      totalItems: allProducts.length,
      itemsInStock: allProducts.filter(p => p.stock > 0).length,
      averageHealth: allProducts.length > 0
        ? (allProducts.reduce((acc, p) => acc + Number(p.health_score || 0), 0) / allProducts.length).toFixed(0)
        : 0,
      weakProducts: allProducts.filter(p => Number(p.health_score) < 60).map(p => p.name),
      unauditedProducts: allProducts.filter(p => !p.is_ai_audited).map(p => p.name)
    };

    // Open chat with the current product and the wider store stats
    openChat(product);
  };

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      const res = await callApi("/products/update-manual", "POST", {
        productId: product.id,
        name,
        description: desc,
        stock: parseInt(stock.toString())
      });
      if (res?.data) {
        onProductUpdated(res.data);
        addToast("Optimizations saved!", "success");
      }
    } catch (error) {
      addToast("Failed to save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTargetedEnhance = async (weakness: string, index: number) => {
    if (liveEnhanceQuota <= 0) {
      addToast("Energy exhausted! Wait for midnight recharge.", "warning");
      return;
    }
    setEnhancingIndex(index);
    try {
      const res = await callApi("/products/enhance-targeted", "POST", {
        productId: product.id,
        targetWeakness: weakness
      });
      if (res?.data) {
        setDesc(res.data.description);
        onProductUpdated(res.data);
        if (setEnhanceQuota) setEnhanceQuota(liveEnhanceQuota - 1);
        addToast("Fixed that specific friction point!", "success");
        // handleSave();
      }
    } catch (error: any) {
      console.error("Enhance failed", error);
    } finally {
      setEnhancingIndex(null);
    }
  };

  if (!product) return (
    <div className="h-[500px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-500 p-10 text-center animate-in fade-in zoom-in-95 duration-500">
      {isBgAnalyzing && used < maxLimit ? (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <IoSyncOutline size={64} className="animate-spin text-[#A500FF] opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center font-black text-[12px] text-white">{analyzingCount}</div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-bold tracking-tight">AI Analysis in Progress</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Deep Auditing your store...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 opacity-20"><HiSparkles size={56} /></div>
          <p className="text-lg font-medium tracking-tight whitespace-pre-line text-white/40">
            Select a product to let{"\n"}Cliva run a diagnostic.
          </p>
        </>
      )}
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        .audit-entrance { animation: slideInAudit 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideInAudit { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="bg-[#0b0b0b] border border-white/10 rounded-[2.5rem] p-10 sticky top-24 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar audit-entrance">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Cliva's Audit</h3>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${status === 'Strong' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {status} — Score: {health}%
            </span>
          </div>
          <button onClick={() => onSelect(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><IoClose size={24} className="text-gray-400" /></button>
        </div>

        <img src={product.image_url || product.imageUrls?.[0]} className="w-full h-64 object-cover rounded-3xl mb-8 border border-white/5 shadow-inner" alt="" />

        <div className={`mb-8 p-6 rounded-3xl border transition-all duration-500 ${product.is_ai_audited ? 'bg-purple-500/5 border-purple-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
          <div className={`flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] ${product.is_ai_audited ? 'text-purple-400' : 'text-amber-500'}`}>
            <HiSparkles className={product.is_ai_audited ? "animate-pulse" : ""} />
            {product.is_ai_audited ? "Deep AI Intelligence" : "Standard Logic Audit"}
          </div>
          {/* ⚡️ TYPING EFFECT REMOVED: Now displays standard text instantly */}
          <p className="text-[17px] text-gray-200 leading-relaxed italic font-medium mb-4">
            "{analysis.thinking_process || "Initial heuristic scan complete. Deep AI audit pending."}"
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-10">
          <div>
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">The Highlights</h4>
            <div className="space-y-3">
              {(analysis.strengths || []).map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-green-500/5 border border-green-500/10 rounded-2xl">
                  <IoCheckmarkCircle className="shrink-0 text-green-500 size-6" />
                  <span className="text-[16px] text-green-200/80">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Friction Points</h4>
            <div className="space-y-4">
              {(analysis.reasons || []).map((r: string, i: number) => (
                <div key={i} className="group p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col justify-between gap-4 items-center md:items-end">
                  <div className="flex items-start gap-4 flex-1">
                    <IoCloseCircle className="shrink-0 text-red-500 size-6" />
                    <span className="text-[16px] text-red-200/80">{r}</span>
                  </div>

                  <div className="flex flex-col shrink-0">
                    <button
                      onClick={() => handleTargetedEnhance(r, i)}
                      disabled={enhancingIndex !== null || liveEnhanceQuota <= 0}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all
                        ${liveEnhanceQuota <= 0 ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 active:scale-95'}`}
                    >
                      <IoFlash size={14} className={enhancingIndex === i ? 'animate-pulse' : ''} />
                      {enhancingIndex === i ? "Fixing..." : "Fix Point"}
                    </button>
                    <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1 text-right">{liveEnhanceQuota} charges left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8 border-t border-white/5">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-2">Manual Optimization</label>
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] text-gray-600 font-bold uppercase mb-2 ml-2 ">Product Title</p>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#A500FF]/30 transition-all font-medium" />
              </div>
              <div className="w-[100px]">
                <p className="text-[10px] text-gray-600 font-bold uppercase mb-2 ml-2 ">Stock</p>
                <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#A500FF]/30 transition-all font-bold text-center" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-600 font-bold uppercase mb-2 ml-2 ">Product Copy</p>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-base text-gray-200 min-h-[250px] outline-none focus:border-[#A500FF]/30 transition-all custom-scrollbar leading-relaxed" />
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="w-full py-5 bg-white text-black text-lg font-black uppercase tracking-tighter rounded-3xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-xl shadow-white/5">
            {isSaving ? "Finalizing Sync..." : <><HiOutlineSave size={22} /> Save Optimizations</>}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductAudit;