"use client";
import React, { useState, useEffect } from "react";
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineArrowPath } from "react-icons/hi2";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

const StoreIntelligence = () => {
  const { callApi } = UseAPI();
  const { addToast, user, syncQuotas } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    return_policy: "",
    shipping_policy: "",
    warranty_info: ""
  });

  // ⚡️ Load existing context from the user object
  useEffect(() => {
    if (user?.store) {
      setFormData({
        description: user.store.description || "",
        return_policy: user.store.return_policy || "",
        shipping_policy: user.store.shipping_policy || "",
        warranty_info: user.store.warranty_info || ""
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await callApi("/store/update-context", "PATCH", formData);
      if (res) {
        addToast("Neural context updated successfully.", "success");
        syncQuotas(); // Refresh state
      }
    } catch (err) {
      addToast("Failed to sync intelligence.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleUpdate} className="space-y-6">

        {/* --- SECTION 1: BRAND NARRATIVE --- */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <HiOutlineSparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Brand Narrative</h3>
              <p className="text-xs text-gray-500 italic">This defines Cliva's voice and product understanding.</p>
            </div>
          </div>

          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your store, your target audience, and your unique value proposition..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-gray-200 text-sm min-h-[180px] focus:border-amber-500/40 outline-none transition-all resize-none leading-relaxed"
          />
          <p className="mt-3 text-[11px] text-gray-600 flex items-center gap-1.5">
            <HiOutlineSparkles className="text-amber-500" />
            Cliva uses this to tailor descriptions and chat responses to your brand tone.
          </p>
        </div>

        {/* --- SECTION 2: POLICIES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Returns */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              <HiOutlineArrowPath className="text-purple-500" /> Return & Refund
            </label>
            <textarea
              value={formData.return_policy}
              onChange={(e) => setFormData({ ...formData, return_policy: e.target.value })}
              placeholder="e.g., 30-day money-back guarantee..."
              className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-xs text-gray-300 min-h-[100px] outline-none focus:border-purple-500/40"
            />
          </div>

          {/* Shipping */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              <HiOutlineTruck className="text-blue-500" /> Shipping Policy
            </label>
            <textarea
              value={formData.shipping_policy}
              onChange={(e) => setFormData({ ...formData, shipping_policy: e.target.value })}
              placeholder="e.g., Free shipping over $50. 3-5 business days..."
              className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-xs text-gray-300 min-h-[100px] outline-none focus:border-blue-500/40"
            />
          </div>

        </div>

        {/* --- ACTION BAR --- */}
        <div className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
            <HiOutlineShieldCheck size={16} className="text-green-500" />
            Context is persistent and encrypted
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isSaving ? "bg-gray-800 text-gray-500" : "bg-white text-black hover:bg-amber-500 hover:text-white"
              }`}
          >
            {isSaving ? "Syncing Logic..." : "Train Cliva"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreIntelligence;