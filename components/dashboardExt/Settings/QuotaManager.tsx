"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Zap, Search, BarChart3, ChevronDown, Database, ShieldCheck, Loader2, MessageSquare, TrendingUp } from "lucide-react";
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
  }, [user?.id, timeFilter, platform]);

  const maxVal = useMemo(() => {
    if (!history.length) return 1;
    const allValues = history.flatMap(d => [Number(d.audit || 0), Number(d.enhance || 0), Number(d.chat || 0)]);
    const highestUsage = Math.max(...allValues, 0);
    // Dynamic Scaling: If max usage is 7, 7 becomes the 100% height mark.
    return highestUsage > 0 ? highestUsage : 10;
  }, [history]);

  const calculatePrice = (amt: number) => (1.99 + (amt - 100) * 0.02).toFixed(2);

  const handlePurchase = () => {
    addToast(`Processing Strategy Boost: ${topUpAmount} Units...`, "info");
  };

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-700">

      {/* 1. TOP BAR & FILTERS */}
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

          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            <button className="px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl bg-[#A500FF] text-white shadow-lg shadow-purple-500/20">
              Monthly Analysis
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right mr-2">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Active Plan</span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">{user?.plan || 'Free'} Plan</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* 2. QUOTA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? [1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-600" />
          </div>
        )) :
          quotas.map((item) => {
            const totalLimit = (item.limit || 0) + (item.bought || 0);
            const percent = Math.min(100, ((item.used || 0) / (totalLimit || 1)) * 100);
            return (
              <div key={item.id} className="p-8 bg-[#0d0d0d] rounded-[2.5rem] border border-white/5 group hover:border-[#A500FF]/40 transition-all duration-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${item.id === 'deep_audits' ? 'bg-[#FFB300]/10 text-[#FFB300]' : item.id === 'customer_chats' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#A500FF]/10 text-[#A500FF]'}`}>
                    {item.id === 'deep_audits' ? <Search size={20} /> : <MessageSquare size={20} />}
                  </div>
                  <p className={`text-xl font-black ${percent > 90 ? 'text-red-500' : 'text-white'}`}>{percent.toFixed(0)}%</p>
                </div>
                <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-widest">{item.label}</h4>
                <p className="text-[10px] text-gray-500 mb-6 font-bold uppercase">{item.used} / {totalLimit} {item.unit}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${percent > 90 ? "bg-red-500" : (item.id === 'deep_audits' ? "bg-[#FFB300]" : item.id === 'customer_chats' ? "bg-blue-500" : "bg-[#A500FF]")}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        }
      </div>

      {/* 3. SYNCED HISTORICAL GRAPH (Grouped Bars with Labels) */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
              <TrendingUp className="text-[#A500FF]" /> 30-Day Strategy Scale
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Grouped daily usage for Audits, Fixes, and Chats
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-[#FFB300]" /> Audits</div>
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-[#A500FF]" /> Fixes</div>
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Chats</div>
          </div>
        </div>

        <div className="flex items-end justify-between h-64 gap-1 px-2 overflow-x-auto cliva-scrollbar">
          {history.length > 0 ? history.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative min-w-[45px]">

              {/* Individual Numbers above bars */}
              <div className="flex justify-center gap-1 mb-1">
                {Number(day.audit) > 0 && <span className="text-[7px] font-black text-[#FFB300]">{day.audit}</span>}
                {Number(day.enhance) > 0 && <span className="text-[7px] font-black text-[#A500FF]">{day.enhance}</span>}
                {Number(day.chat) > 0 && <span className="text-[7px] font-black text-blue-500">{day.chat}</span>}
              </div>

              {/* Cluster of 3 bars per day */}
              <div className="flex items-end gap-[3px] h-32 w-full justify-center">
                {/* Audit Bar - Amber */}
                <div
                  className="w-2.5 bg-[#FFB300] rounded-t-md transition-all duration-700 shadow-[0_0_15px_rgba(255,179,0,0.15)] hover:brightness-125"
                  style={{
                    height: `${(Number(day.audit) / maxVal) * 100}%`,
                    minHeight: Number(day.audit) > 0 ? '6px' : '0px',
                    opacity: Number(day.audit) > 0 ? 1 : 0.08
                  }}
                />
                {/* Enhance Bar - Purple */}
                <div
                  className="w-2.5 bg-[#A500FF] rounded-t-md transition-all duration-700 shadow-[0_0_15px_rgba(165,0,255,0.15)] hover:brightness-125"
                  style={{
                    height: `${(Number(day.enhance) / maxVal) * 100}%`,
                    minHeight: Number(day.enhance) > 0 ? '6px' : '0px',
                    opacity: Number(day.enhance) > 0 ? 1 : 0.08
                  }}
                />
                {/* Chat Bar - Blue */}
                <div
                  className="w-2.5 bg-blue-500 rounded-t-md transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:brightness-125"
                  style={{
                    height: `${(Number(day.chat) / maxVal) * 100}%`,
                    minHeight: Number(day.chat) > 0 ? '6px' : '0px',
                    opacity: Number(day.chat) > 0 ? 1 : 0.08
                  }}
                />
              </div>

              <span className={`text-[9px] font-black uppercase tracking-tighter text-center whitespace-nowrap mt-1 ${day.label.includes(new Date().getDate().toString()) ? 'text-white underline decoration-[#A500FF] underline-offset-4' : 'text-gray-600'}`}>
                {day.label}
              </span>
            </div>
          )) : (
            <div className="w-full flex flex-col items-center justify-center py-10 text-gray-700">
              <Database size={24} className="mb-2 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Initialising strategy scale...</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. FUEL SECTION */}
      <div className="p-10 bg-gradient-to-r from-black via-[#A500FF]/5 to-black rounded-[3rem] border border-white/5 mt-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 text-center lg:text-left">
          <div className="max-w-md">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#FFB300] mb-4">
              <Zap size={18} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Strategy Injection</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
              Need More <span className="text-[#A500FF]">Tokens?</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Immediate injection of logic units to bypass daily recharge limits. Keep Cliva auditing through peak traffic.
            </p>
          </div>

          <div className="w-full lg:w-[400px] bg-[#0d0d0d] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Amount</p>
                <p className="text-2xl font-black text-white tracking-tighter">{topUpAmount} <span className="text-[10px] text-gray-500 uppercase">Units</span></p>
              </div>
              <p className="text-2xl font-black text-[#FFB300] tracking-tighter">${calculatePrice(topUpAmount)}</p>
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