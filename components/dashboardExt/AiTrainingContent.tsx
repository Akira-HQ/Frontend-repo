"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import ProductsAnalysisCom from "./tabs/productAnalysis/ProductsAnalysisCom";
import ProductOverview from "./tabs/productOverview/ProductOverview";
import { HiLightningBolt } from "react-icons/hi";
import { IoChatbubblesOutline } from "react-icons/io5"; // Added for the bubble icon

const AiTrainingContent = () => {
  const { isDarkMode, user, isChatOpen, chatContextProduct, setIsChatOpen, openChat } = useAppContext();

  const [activeTab, setActiveTab] = useState<number>(1);

  const maxAudit = user?.plan === "Pro" ? 500 : user?.plan === "Basic" ? 50 : 5;
  const auditPercentage = ((user?.daily_audit_limit || 0) / maxAudit) * 100;

  return (
    <div
      className={`py-4 px-2 w-full h-full ${isDarkMode ? " text-white" : "relative"} relative shadow-2xl`}
    >
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

          <div className="text-right">
            <div className="text-[14px] font-black text-white leading-none">
              {user?.daily_audit_limit || 0}<span className="text-gray-600 text-[10px] ml-1">/ {maxAudit}</span>
            </div>
            <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-tighter mt-1">Deep Audits Left</p>
          </div>
        </div>
      </div>

      

      <div className="TabContents mt-24">
        {activeTab === 1 && <ProductsAnalysisCom />}
      </div>

      <div className="TabContents">
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