"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Zap, Search, BarChart3, ChevronDown, Database, ShieldCheck, Loader2, MessageSquare, TrendingUp, Info, Activity } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

export const QuotaMonitor = () => {
  const [quotas, setQuotas] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [platform, setPlatform] = useState("shopify");
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState(100);
  const [timeFilter, setTimeFilter] = useState("Last Month");

  const { callApi } = UseAPI();
  const { user, addToast } = useAppContext();

  useEffect(() => {
    const fetchUsage = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await callApi(`/user-quotas?userId=${user.id}&filter=${timeFilter.toLowerCase()}`, "GET");
        if (res && res.quotas) {
          setQuotas(res.quotas);
          setHistory(res.history || []);
        }
      } catch (err) {
        console.error("Quota Sync Error:", err);
        addToast("Failed to sync quotas.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, [user?.id, timeFilter, platform, callApi, addToast]);

  const maxVal = useMemo(() => {
    if (!history.length) return 10;
    // We only care about audit and enhance for the strategy bars
    const allValues = history.flatMap(d => [Number(d.audit || 0), Number(d.enhance || 0)]);
    const highest = Math.max(...allValues, 0);
    return highest > 0 ? highest : 10;
  }, [history]);

  const calculatePrice = (amt: number) => (1.99 + (amt - 100) * 0.02).toFixed(2);

  const handlePurchase = () => {
    addToast(`Processing Strategy Boost: ${topUpAmount} Units...`, "info");
  };

  return (
    <div className="space-y-10 max-w-6xl animate-in fade-in duration-700 pb-20">

      {/* 1. TOP BAR */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/10 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="appearance-none bg-black border border-white/10 px-5 py-2.5 pr-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-[#A500FF] cursor-pointer transition-all"
            >
              <option value="shopify">Shopify Store</option>
              <option value="wix" disabled>Wix (Soon)</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-[#A500FF]/10 text-[#A500FF] border border-[#A500FF]/20">
            Resource Command
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right mr-2">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Current Plan</span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">{user?.plan || 'Free'} Plan</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* 2. DUAL SECTIONS FOR QUOTAS */}
      {['Daily Energy', 'Plan Capacity'].map((category) => (
        <div key={category} className="space-y-5">
          <div className="flex items-center gap-3 ml-6">
            <Activity size={14} className={category.includes('Daily') ? "text-amber-500" : "text-[#A500FF]"} />
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">{category}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? [1, 2].map(i => (
              <div key={i} className="h-44 bg-white/5 rounded-[2.5rem] animate-pulse flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-700" />
              </div>
            )) :
              quotas.filter(q => q.category === category).map((item) => {
                // ⚡️ FIX: Ensure we use Number() to avoid "empty" display due to string types
                const used = Number(item.used) || 0;
                const limit = Number(item.limit) || 1;
                const percent = Math.min(100, (used / limit) * 100);
                const isDaily = category.includes('Daily');

                return (
                  <div key={item.id} className="p-8 bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 group hover:border-white/10 transition-all duration-500 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className={`p-3 rounded-2xl ${isDaily ? 'bg-amber-500/10 text-amber-500' : 'bg-[#A500FF]/10 text-[#A500FF]'}`}>
                        {item.id.includes('audit') ? <Search size={20} /> : <Database size={20} />}
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-black tracking-tighter ${percent > 90 ? 'text-red-500' : 'text-white'}`}>
                          {percent.toFixed(0)}%
                        </p>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Used Status</p>
                      </div>
                    </div>

                    <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-widest">{item.label}</h4>
                    <p className="text-[10px] text-gray-500 mb-6 font-bold uppercase">
                      {used} / {limit} <span className="opacity-50">{item.unit}</span>
                    </p>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-1000 ${percent > 90 ? "bg-red-500" : isDaily ? "bg-amber-500" : "bg-[#A500FF]"}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {item.desc && <p className="mt-4 text-[9px] text-gray-500 font-medium leading-relaxed italic opacity-70">{item.desc}</p>}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* 3. NEW & SIMPLE: ACTIVITY FLOW GRAPH */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
              <BarChart3 className="text-[#A500FF]" /> Activity Pulse
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your daily progress at a glance</p>
          </div>
          <div className="flex gap-4 px-4 py-2 bg-black/50 rounded-xl border border-white/5">
            {[{ c: 'bg-amber-500', l: 'Scans' }, { c: 'bg-[#A500FF]', l: 'Fixes' }].map(leg => (
              <div key={leg.l} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${leg.c}`} />
                <span className="text-[8px] font-black uppercase text-gray-400">{leg.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 w-full flex items-end justify-start gap-4 px-2 overflow-x-auto cliva-scrollbar">
          {history.length > 0 ? history.map((day, i) => {
            // Check if day is today for highlighting
            const isToday = day.label === new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short" });

            return (
              <div key={i} className="flex flex-col items-center group min-w-[50px]">
                <div className="flex items-end gap-1.5 w-full h-40 justify-center relative">
                  {/* Audit Bar - Amber */}
                  <div
                    className="w-3.5 bg-amber-500/20 rounded-t-sm group-hover:bg-amber-500 transition-all duration-300 relative"
                    style={{ height: `${(day.audit / maxVal) * 100}%`, minHeight: day.audit > 0 ? '4px' : '0px' }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[9px] font-bold text-amber-500">{day.audit}</div>
                  </div>
                  {/* Enhance Bar - Purple */}
                  <div
                    className="w-3.5 bg-[#A500FF]/20 rounded-t-sm group-hover:bg-[#A500FF] transition-all duration-300 relative"
                    style={{ height: `${(day.enhance / maxVal) * 100}%`, minHeight: day.enhance > 0 ? '4px' : '0px' }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[9px] font-bold text-[#A500FF]">{day.enhance}</div>
                  </div>
                </div>
                {/* Horizontal simple date label */}
                <span className={`text-[9px] mt-4 font-black uppercase tracking-tighter whitespace-nowrap ${isToday ? 'text-white' : 'text-gray-600'}`}>
                  {day.label}
                </span>
                {isToday && <div className="w-1 h-1 bg-[#A500FF] rounded-full mt-1 animate-pulse" />}
              </div>
            );
          }) : (
            <div className="w-full flex items-center justify-center h-full text-gray-700 font-bold uppercase text-[10px] tracking-widest opacity-30">
              Syncing Activity Data...
            </div>
          )}
        </div>
      </div>

      {/* 4. FUEL SECTION */}
      <div className="p-10 bg-gradient-to-br from-[#0d0d0d] via-[#A500FF]/5 to-[#0d0d0d] rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="max-w-md text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-500 mb-4">
              <Zap size={18} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Injection</span>
            </div>
            <h3 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
              Need More <span className="text-[#A500FF]">Energy?</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Add extra units immediately to keep your AI working. Perfect for when you've hit your daily limit but want to keep optimizing.
            </p>
          </div>

          <div className="w-full lg:w-[400px] bg-black/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Boost Amount</p>
                <p className="text-2xl font-black text-white tracking-tighter">{topUpAmount} <span className="text-[10px] text-gray-400 uppercase">Units</span></p>
              </div>
              <p className="text-2xl font-black text-amber-500 tracking-tighter">${calculatePrice(topUpAmount)}</p>
            </div>

            <input
              type="range" min="100" max="1000" step="10"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A500FF] mb-8"
            />

            <button
              onClick={handlePurchase}
              className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#A500FF] hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap size={14} fill="currentColor" /> Confirm Strategy Boost
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};