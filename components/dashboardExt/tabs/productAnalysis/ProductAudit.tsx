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
  IoChatbubblesOutline
} from "react-icons/io5";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

interface ProductAuditProps {
  product: any;
  onSelect: (product: any) => void;
  onProductUpdated: (product: any) => void;
}

const ProductAudit = ({ product, onSelect, onProductUpdated }: ProductAuditProps) => {
  const { callApi } = UseAPI();
  const { user, addToast, openChat } = useAppContext();

  // States for Manual Editing
  const [name, setName] = useState(product?.name || "");
  const [desc, setDesc] = useState(product?.description || "");

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const [stock, setStock] = useState(product?.stock || 0);

  useEffect(() => {
    setName(product?.name || "");
    setDesc(product?.description || "");
    setStock(product?.stock || 0); // Sync stock state
  }, [product]);

  const isLocked = user?.plan?.toLowerCase() === "free";

  // Sync internal state when product changes
  useEffect(() => {
    setName(product?.name || "");
    setDesc(product?.description || "");
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      // Logic: Save both Name and Description manually
      const res = await callApi("/products/update-manual", "POST", {
        productId: product.id,
        name: name,
        description: desc, 
        stock: parseInt(stock.toString())
      });
      if (res?.data) {
        onProductUpdated(res.data);
        addToast("Optimizations saved! Health score updated locally.", "success");
      }
    } catch (error) {
      addToast("Failed to save changes. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIEnhance = async () => {
    if (isLocked) {
      addToast("Upgrade your plan to unlock full AI creative drafting!", "warning");
      return;
    }
    setIsEnhancing(true);
    try {
      const res = await callApi("/products/enhance", "POST", { productId: product.id });
      if (res?.data) {
        setDesc(res.data.enhancedDescription);
        addToast("Cliva has reimagined the full copy.", "success");
      }
    } catch (error: any) {
      const message = error.response?.status === 429
        ? "I'm out of creative energy for today!"
        : "Mainframe link fuzzy. Trying again...";
      addToast(message, "warning");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleTargetedEnhance = async (weakness: string, index: number) => {
    if (isLocked) {
      addToast("Targeted AI fixes are reserved for Pro/Basic members.", "warning");
      return;
    }
    setEnhancingIndex(index);
    try {
      const res = await callApi("/products/enhance-targeted", "POST", {
        productId: product.id,
        targetWeakness: weakness
      });

      if (res?.data) {
        setDesc(res.data.description); // Update local text
        onProductUpdated(res.data); // Refresh the audit list
        addToast("Fixed that specific headache!", "success");
      }
    } catch (error: any) {
      addToast("I'm tapped out for today! I'll be back at midnight.", "warning");
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
        @keyframes slideInAudit { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .audit-entrance { animation: slideInAudit 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="bg-[#0b0b0b] border border-white/10 rounded-[2.5rem] p-10 sticky top-24 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar audit-entrance">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Cliva's Audit</h3>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${product.status === 'Strong' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {product.status || 'Weak'}
            </span>
          </div>
          <button onClick={() => onSelect(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><IoClose size={24} className="text-gray-400" /></button>
        </div>

        <img src={product.imageUrls?.[0]} className="w-full h-64 object-cover rounded-3xl mb-8 border border-white/5" alt="" />

        {/* Intelligence Card */}
        <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
          <div className="flex items-center gap-2 mb-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <HiSparkles className="animate-pulse" />
            {product.is_ai_audit ? "Cliva's Deep AI Intelligence" : "Cliva's Standard Logic Audit"}
          </div>
          <p className="text-[17px] text-gray-200 leading-relaxed italic font-medium mb-4">
            "{product.thinking_process || "I've run standard heuristics. Request a Deep Audit for better insight."}"
          </p>
          <button onClick={() => openChat(product)} className="text-[10px] font-black uppercase text-amber-500/60 hover:text-amber-500 flex items-center gap-2 tracking-widest transition-all">
            <IoChatbubblesOutline /> Discuss this product
          </button>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          <div>
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">The Highlights</h4>
            <div className="space-y-3">
              {product.strengths?.map((s: string, i: number) => (
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
              {product.reasons?.map((r: string, i: number) => (
                <div key={i} className="group p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <div className="flex items-start gap-4 mb-4">
                    <IoCloseCircle className="shrink-0 text-red-500 size-6" />
                    <span className="text-[16px] text-red-200/80">{r}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => handleTargetedEnhance(r, i)}
                      disabled={isLocked || enhancingIndex !== null || (user?.daily_enhance_limit || 0) <= 0}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all
                        ${isLocked || (user?.daily_enhance_limit || 0) <= 0 ? 'bg-white/5 text-gray-600' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}
                    >
                      {isLocked ? <IoLockClosed size={14} /> : <IoFlash size={14} className={enhancingIndex === i ? 'animate-pulse' : ''} />}
                      {enhancingIndex === i ? "Magic..." : "Fix This Point"}
                    </button>
                    {!isLocked && (
                      <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mr-2">
                        {user?.daily_enhance_limit || 0} energy charges left
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Editor */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Manual Correction</label>
            <button
              onClick={handleAIEnhance}
              disabled={isLocked || isEnhancing}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl ${isLocked ? 'bg-white/5 text-gray-600' : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'}`}
            >
              {isLocked ? <IoLockClosed /> : <HiSparkles className={isEnhancing ? 'animate-spin' : ''} />}
              AI Enhancement
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center gap-2">
              <div className="w-[200px]">
                <p className="text-[10px] text-gray-600 font-bold uppercase mb-2">Title</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white outline-none"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-600 font-bold uppercase mb-2">Stock</p>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value))}
                  className="w-[80px] bg-white/5 border border-white/5 rounded-2xl p-4 text-white outline-none"
                />
              </div>
            </div>
            
            <div>
              <p className="text-[10px] text-gray-600 font-bold uppercase mb-2">Description</p>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-base text-gray-200 min-h-[220px] outline-none custom-scrollbar"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-5 bg-white text-black text-lg font-bold rounded-3xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? "Finalizing..." : <><HiOutlineSave size={22} /> Save Manual Changes</>}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductAudit;