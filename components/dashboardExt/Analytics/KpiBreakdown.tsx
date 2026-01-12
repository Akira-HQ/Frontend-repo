"use client";
import React from "react";
import { Zap, Brain, Smile, Activity } from "lucide-react";
import { NEON_PURPLE, ACCENT_BLUE } from "@/types";

// 1. Define the interface to accept the 'data' prop from Analytics.tsx
interface KpiBreakdownProps {
  data?: any;
}

// 2. Accept the props in the component definition
const KpiBreakdown: React.FC<KpiBreakdownProps> = ({ data }) => {

  // NOTE: If 'data' is provided by the parent, you could map it here.
  // For now, we use our stunningly styled constants.
  const INTELLIGENCE_KPIS = [
    {
      label: "Neural Response Latency",
      value: data?.latency || "450ms",
      progress: 0.92,
      color: ACCENT_BLUE,
      description: "Average time for Cliva to process and respond.",
      icon: Activity
    },
    {
      label: "Sentiment Equilibrium",
      value: data?.sentiment || "88%",
      progress: 0.88,
      color: NEON_PURPLE,
      description: "Customer positivity score across all live sessions.",
      icon: Smile
    },
    {
      label: "Autonomous Resolution",
      value: data?.resolution || "74%",
      progress: 0.74,
      color: "#10b981",
      description: "Inquiries solved without human handoff.",
      icon: Brain
    },
  ];

  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl h-96 flex flex-col relative overflow-hidden">
      {/* Decorative Neural Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#A500FF]/20 rounded-lg">
          <Zap size={18} className="text-[#A500FF]" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
            Intelligence <span className="text-[#A500FF]">Diagnostics</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Live System Health</p>
        </div>
      </div>

      <div className="space-y-7 flex-1">
        {INTELLIGENCE_KPIS.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="group cursor-default">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{kpi.label}</span>
                </div>
                <span className="text-lg font-black text-white tabular-nums tracking-tighter">{kpi.value}</span>
              </div>

              {/* Custom Styled Progress Bar */}
              <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${kpi.progress * 100}%`,
                    backgroundColor: kpi.color,
                    boxShadow: `0 0 12px ${kpi.color}40`
                  }}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>

              <p className="text-[9px] text-gray-600 mt-1.5 font-medium leading-tight">
                {kpi.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KpiBreakdown;