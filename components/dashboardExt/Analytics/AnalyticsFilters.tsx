"use client";
import React from "react";
import { Search, Filter } from "lucide-react";
import { ACCENT_BLUE, NEON_PURPLE } from "@/types";

interface AnalyticsFiltersProps {
  current: string;
  onChange: (timeframe: string) => void;
  onSearch: (term: string) => void; // ⚡️ Added this property
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  current,
  onChange,
  onSearch
}) => {
  const options = [
    { label: "7 Days", value: "7days" },
    { label: "30 Days", value: "30days" },
    { label: "90 Days", value: "90days" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02] border border-white/10 p-2 rounded-2xl backdrop-blur-md w-full">
      {/* Timeframe Toggles */}
      <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 w-full md:w-auto">
        {options.map((opt) => {
          const isActive = current === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                ? `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] text-white shadow-lg shadow-purple-500/20`
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Search & Global Filter */}
      <div className="flex items-center gap-3 w-full md:w-auto pr-2">
        <div className="relative flex-1 md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#A500FF] transition-colors" />
          <input
            type="text"
            placeholder="Search Intelligence Logs..."
            onChange={(e) => onSearch(e.target.value)} // ⚡️ Linked to parent state
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:border-[#A500FF]/50 focus:ring-1 focus:ring-[#A500FF]/20 transition-all"
          />
        </div>

        <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-colors">
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
};

export default AnalyticsFilters;