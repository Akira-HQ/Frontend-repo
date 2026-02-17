"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../AppContext";
import ProductsAnalysisCom from "./tabs/productAnalysis/ProductsAnalysisCom";
import ProductOverview from "./tabs/productOverview/ProductOverview";
import StoreContextForm from "./tabs/StoreIntelligence";
import { UseAPI } from "@/components/hooks/UseAPI";
import { IoSyncOutline, IoCloseCircleOutline } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";

const AiTrainingContent = () => {
  const { isDarkMode, user, addToast, syncQuotas: globalSync, wsEvent } = useAppContext();
  const { callApi } = UseAPI();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isCancelling, setIsCancelling] = useState(false);

  // --- 1. SYNC INITIAL DATA ---
  const syncContentData = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      const res = await callApi("/products/analyze", "GET");
      if (res?.data) {
        const { analyzedProducts, quotas } = res.data;
        const total = analyzedProducts.length;
        const finished = analyzedProducts.filter((p: any) => p.is_ai_audited).length;

        setProgress({ current: finished, total });

        // Logic check: Only show analysis banner if there's un-audited products and we have energy
        const hasUnfinished = finished < total;
        const hasEnergy = quotas.audits_used < quotas.audits_limit;

        // Don't auto-flip isAnalyzing to true here; let WebSockets handle real-time state
        if (finished === total) setIsAnalyzing(false);

        globalSync();
      }
    } catch (err) {
      console.error("Sync Failed", err);
    }
  }, [callApi, globalSync]);

  useEffect(() => {
    syncContentData();
  }, [syncContentData]);

  // --- 2. NEURAL LINK (Hardened Real-Time Updates) ---
  useEffect(() => {
    if (!wsEvent) return;

    // ⚡️ Fix: Listen for specific statuses from the backend notifyDashboard call
    if (wsEvent.type === "AUDIT_PROGRESS") {
      const { message } = wsEvent; // Backend sends data inside 'message' object

      setIsAnalyzing(true);

      setProgress((prev) => ({
        current: message.current || prev.current,
        total: message.total || prev.total || 1, // Keep the total from sync if message lacks it
      }));

      // Refresh the progress bars in the Sidebar/QuotaMonitor
      globalSync();

      // Trigger a soft refresh of the product list to show the new health scores
      if (message.status === "processing") {
        syncContentData();
      }
    }

    if (wsEvent.type === "AUDIT_COMPLETE") {
      setIsAnalyzing(false);
      setProgress((prev) => ({ ...prev, current: prev.total }));
      syncContentData(); // Final data pull
      globalSync();
      addToast("Neural Audit Complete: All products mapped.", "success");
    }
  }, [wsEvent, syncContentData, globalSync, addToast]);

  // --- 3. CANCEL LOGIC ---
  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await callApi("/products/cancel-audit", "POST");
      addToast("Disconnecting Neural Link...", "info");
      setIsAnalyzing(false);
    } catch (err) {
      addToast("Failed to stop sync.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className={`py-4 px-2 w-full h-full ${isDarkMode ? "text-white" : ""} relative`}>

      {/* 1. TABS HEADER */}
      <div className="tabs fixed top-16 right-10 left-[310px] z-50 py-4 px-6 bg-[#0b0b0b]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-between items-center shadow-2xl">
        <div className="flex gap-4">
          <button
            className={`rounded-xl h-[44px] px-6 transition-all font-bold text-sm ${activeTab === 1 ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            onClick={() => setActiveTab(1)}
          >
            Products Analysis
          </button>
          {/* <button
            className={`rounded-xl h-[44px] px-6 transition-all font-bold text-sm ${activeTab === 2 ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            onClick={() => setActiveTab(2)}
          >
            Overview
          </button> */}
          <button
            className={`rounded-xl h-[44px] px-6 flex items-center gap-2 transition-all font-bold text-sm ${activeTab === 3 ? "bg-[#A500FF] text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            onClick={() => setActiveTab(3)}
          >
            <HiOutlineSparkles size={16} />
            Store Intelligence
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME PROGRESS BANNER (Fixes visibility) */}
      {isAnalyzing && (
        <div className="fixed top-40 left-[340px] right-10 z-40 animate-in slide-in-from-top-4 duration-500">
          <div className="backdrop-blur-md bg-[#A500FF]/10 border border-[#A500FF]/20 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-[#A500FF]">
                <IoSyncOutline className="text-white animate-spin" size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-white tracking-widest">Neural Audit Active</p>
                <p className="text-[10px] text-[#A500FF] font-bold">
                  Mapped: {progress.current} / {progress.total} products
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A500FF] transition-all duration-700 ease-out"
                  style={{ width: `${(progress.current / (progress.total || 1)) * 100}%` }}
                />
              </div>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-all disabled:opacity-50"
              >
                <IoCloseCircleOutline size={16} /> {isCancelling ? "Stopping..." : "Stop Neural Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTENT AREA */}
      <div className={`TabContents ${isAnalyzing ? 'mt-48' : 'mt-28'} transition-all duration-500`}>
        {activeTab === 1 && <ProductsAnalysisCom />}
        {/* {activeTab === 2 && <ProductOverview />} */}
        {activeTab === 3 && (
          <div className="px-10 max-w-5xl">
            <StoreContextForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTrainingContent;