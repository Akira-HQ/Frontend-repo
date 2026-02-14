"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../AppContext";
import ProductsAnalysisCom from "./tabs/productAnalysis/ProductsAnalysisCom";
import ProductOverview from "./tabs/productOverview/ProductOverview";
// ⚡️ NEW: Import the Store Context component
import StoreContextForm from "./tabs/StoreIntelligence";
import { HiLightningBolt } from "react-icons/hi";
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

        const hasEnergy = quotas.audits_used < quotas.audits_limit;
        setIsAnalyzing(finished < total && hasEnergy);

        globalSync();
      }
    } catch (err) {
      console.error("Sync Failed", err);
    }
  }, [callApi, globalSync]);

  useEffect(() => {
    syncContentData();
  }, [syncContentData]);

  // --- 2. NEURAL LINK (Real-Time Updates) ---
  useEffect(() => {
    if (!wsEvent) return;

    if (wsEvent.type === "AUDIT_PROGRESS") {
      setIsAnalyzing(true);
      setProgress({ current: wsEvent.current, total: wsEvent.total });
      globalSync();

      if (wsEvent.current % 5 === 0) {
        syncContentData();
      }
    }

    if (wsEvent.type === "AUDIT_COMPLETE") {
      setIsAnalyzing(false);
      setProgress((prev) => ({ ...prev, current: prev.total }));
      syncContentData();
      globalSync();
      addToast(wsEvent.message || "Audit Complete", "success");
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

  // --- 4. UI CALCULATIONS ---
  const maxLimit = user?.quotas?.chats_limit || 1000;
  const used = user?.quotas?.chats_used || 0;
  const remainingEnergy = Math.max(0, maxLimit - used);
  const auditPerc = (remainingEnergy / maxLimit) * 100;

  return (
    <div className={`py-4 px-2 w-full h-full ${isDarkMode ? "text-white" : ""} relative`}>

      {/* 1. TABS & ENERGY HEADER */}
      <div className="tabs fixed top-16 right-10 left-[310px] z-50 py-4 px-6 bg-[#0b0b0b]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-between items-center shadow-2xl">
        <div className="flex gap-4">
          <div
            className={`rounded-xl h-[44px] px-6 flex items-center cursor-pointer transition-all font-bold text-sm ${activeTab === 1 ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            onClick={() => setActiveTab(1)}
          >
            Products Analysis
          </div>
          <div
            className={`rounded-xl h-[44px] px-6 flex items-center cursor-pointer transition-all font-bold text-sm ${activeTab === 2 ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            onClick={() => setActiveTab(2)}
          >
            Overview
          </div>
          {/* ⚡️ NEW: Store Context Tab */}
          <div
            className={`rounded-xl h-[44px] px-6 flex items-center gap-2 cursor-pointer transition-all font-bold text-sm ${activeTab === 3 ? "bg-[#A500FF] text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
            onClick={() => setActiveTab(3)}
          >
            <HiOutlineSparkles size={16} />
            Store Intelligence
          </div>
        </div>

        {/* <div className="flex items-center gap-6 bg-white/5 py-2 px-5 rounded-2xl border border-white/5">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Monthly Strategy</span>
              <HiLightningBolt className="text-amber-500 animate-pulse" size={14} />
            </div>
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
                style={{ width: `${auditPerc}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-black text-white leading-none">
              {remainingEnergy}<span className="text-gray-600 text-[10px] ml-1">LEFT</span>
            </div>
            <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-tighter mt-1">Monthly Quota</p>
          </div>
        </div> */}
      </div>

      {/* 2. REAL-TIME PROGRESS BANNER */}
      {isAnalyzing && (
        <div className="fixed top-40 left-[340px] right-10 z-40 animate-in slide-in-from-top-4 duration-500">
          <div className="backdrop-blur-md bg-[#A500FF]/10 border border-[#A500FF]/20 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-[#A500FF]">
                <IoSyncOutline className="text-white animate-spin" size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-white">Neural Audit Active</p>
                <p className="text-[10px] text-[#A500FF] font-bold">Progress: {progress.current} / {progress.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A500FF] transition-all duration-700"
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
        {activeTab === 2 && <ProductOverview />}
        {/* ⚡️ NEW: Store Intelligence View */}
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