"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import ProductsAnalysisCom from "./tabs/productAnalysis/ProductsAnalysisCom";
import ProductOverview from "./tabs/productOverview/ProductOverview";
import { HiLightningBolt } from "react-icons/hi";
import { UseAPI } from "@/components/hooks/UseAPI";
import { User } from "@/types";

const AiTrainingContent = () => {
  const { isDarkMode, user, setUser } = useAppContext();
  const { callApi } = UseAPI();
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- QUOTA SYNC LOGIC ---
  const syncQuotas = async () => {
    try {
      const res = await callApi("/products/analyze", "GET");

      // Safety check: Ensure data exists and setUser is available
      if (res?.data?.quotas && setUser && user) {
        // FIX: If your Context Provider's setState doesn't support functional updates,
        // we construct the new object using the current 'user' from the hook scope.
        const updatedUser: User = {
          ...user,
          daily_audit_limit: res.data.quotas.audit,
          daily_enhance_limit: res.data.quotas.enhance
        };

        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Quota Sync Failed", err);
    }
  };

  // Run on mount and every 15 seconds
  useEffect(() => {
    syncQuotas();
    const interval = setInterval(syncQuotas, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Re-run if user identity changes

  // UI calculations
  const maxAudit = user?.plan?.toLowerCase() === "pro" ? 500 : user?.plan?.toLowerCase() === "basic" ? 50 : 2;
  const currentAudit = Math.max(0, user?.daily_audit_limit ?? 0); // Ensures min is 0
  const auditPercentage = Math.min(100, (currentAudit / maxAudit) * 100);

  return (
    <div className={`py-4 px-2 w-full h-full ${isDarkMode ? "text-white" : "relative"} relative shadow-2xl`}>
      {/* HEADER SECTION WITH TABS & ENERGY */}
      <div className="tabs fixed right-10 left-[300px] z-20 py-4 px-6 bg-[#0b0b0b]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex justify-between items-center ml-10 shadow-2xl">
        <div className="flex gap-4">
          <div
            className={`rounded-xl h-[44px] px-6 flex items-center cursor-pointer transition-all duration-300 font-bold text-sm tracking-tight ${activeTab === 1
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            onClick={() => setActiveTab(1)}
          >
            Products Analysis
          </div>

          <div
            className={`rounded-xl h-[44px] px-6 flex items-center cursor-pointer transition-all duration-300 font-bold text-sm tracking-tight ${activeTab === 2
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            onClick={() => setActiveTab(2)}
          >
            Overview
          </div>
        </div>

        {/* ENERGY BAR SECTION */}
        <div className="flex items-center gap-6 bg-white/5 py-2 px-5 rounded-2xl border border-white/5">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Cliva Energy</span>
              <HiLightningBolt className="text-amber-500 animate-pulse" size={14} />
            </div>
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                style={{ width: `${auditPercentage}%` }}
              />
            </div>
          </div>

          {/* <div className="text-right">
            <div className="text-[14px] font-black text-white leading-none">
              {currentAudit}<span className="text-gray-600 text-[10px] ml-1">/ {maxAudit}</span>
            </div>
            <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-tighter mt-1">Deep Audits Left</p>
          </div> */}
          <div className="text-right">
            <div className="text-[14px] font-black text-white leading-none">
              {currentAudit}<span className="text-gray-600 text-[10px] ml-1">/ {maxAudit}</span>
            </div>
            {currentAudit === 0 ? (
              <p className="text-[8px] font-bold text-red-500 uppercase tracking-tighter mt-1 animate-pulse">
                Recharging at Midnight
              </p>
            ) : (
              <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-tighter mt-1">
                Deep Audits Left
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="TabContents mt-24">
        {activeTab === 1 && <ProductsAnalysisCom />}
        {activeTab === 2 && (
          <div className="mt-26">
            <ProductOverview />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTrainingContent;