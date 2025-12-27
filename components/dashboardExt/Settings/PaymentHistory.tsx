"use client";
import React, { useState, useEffect } from "react";
import { CreditCard, Download, ExternalLink, Calendar, CheckCircle2, History, ArrowUpRight, Loader2 } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";

export const PaymentHistory = () => {
  const { user, addToast } = useAppContext();
  const { callApi } = UseAPI();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await callApi(`/payment-history?userId=${user?.id}`, "GET");
        setHistory(res.data || []);
      } catch (err) {
        console.error("History Error:", err);
      } finally { setLoading(false); }
    };
    if (user?.id) fetchPayments();
  }, [user?.id]);

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. CURRENT SUBSCRIPTION SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={120} className="text-[#A500FF]" />
          </div>

          <div className="relative z-10">
            <span className="text-[10px] font-black text-[#A500FF] uppercase tracking-[0.3em] mb-4 block">Current Protocol</span>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">
              {user?.plan || 'Free'} <span className="text-gray-600">Active</span>
            </h3>

            <div className="flex flex-wrap gap-8 items-center mt-auto">
              <div>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Next Recharge</p>
                <p className="text-sm text-white font-bold tracking-tight flex items-center gap-2">
                  <Calendar size={14} className="text-[#A500FF]" /> Jan 22, 2026
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#A500FF] hover:text-white transition-all active:scale-95">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD CARD */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between hover:border-white/10 transition-all">
          <div>
            <CreditCard className="text-blue-500 mb-6" size={24} />
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Payment Method</h4>
            <p className="text-xs text-gray-500 font-medium">•••• •••• •••• 4242</p>
          </div>
          <button className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-white flex items-center gap-2 transition-colors">
            Update Card <ArrowUpRight size={12} />
          </button>
        </div>
      </div>

      {/* 2. TRANSACTION LOGS */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10">
        <div className="flex items-center gap-3 mb-10">
          <History className="text-gray-500" size={20} />
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Strategic Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                <th className="pb-6 pl-4">Invoice ID</th>
                <th className="pb-6">Date</th>
                <th className="pb-6">Amount</th>
                <th className="pb-6">Status</th>
                <th className="pb-6 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-300">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center"><Loader2 className="animate-spin inline text-gray-700" /></td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-600 italic uppercase text-[10px] font-bold">No transactions logged yet</td></tr>
              ) : history.map((item, idx) => (
                <tr key={idx} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group">
                  <td className="py-6 pl-4 font-mono text-xs text-gray-500">#{item.id.slice(0, 8)}</td>
                  <td className="py-6">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-6 text-white font-bold">${item.amount}</td>
                  <td className="py-6">
                    <span className="bg-green-500/10 text-green-500 text-[9px] font-black px-2 py-1 rounded-md uppercase">Successful</span>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <button className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-[#A500FF]/20 hover:text-[#A500FF] transition-all">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};