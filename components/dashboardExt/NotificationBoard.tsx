"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "@/components/AppContext";
import {
  IoMailOpenOutline,
  IoChevronForward,
  IoArrowBack,
  IoTrashOutline
} from "react-icons/io5";

export const NotificationBoard = () => {
  const {
    notifications,
    markNotificationRead,
    clearNotification,
    syncQuotas
  } = useAppContext();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ⚡️ SYNC DATA ON MOUNT
  useEffect(() => {
    syncQuotas();
  }, [syncQuotas]);

  // ⚡️ SCROLL TO TOP ON SELECTION
  // This prevents the "blank screen" feel if you were scrolled down in the list
  useEffect(() => {
    if (selectedId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedId]);

  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];
    return [...notifications].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [notifications]);

  const activeMsg = useMemo(() =>
    sortedNotifications.find(n => n.id === selectedId),
    [selectedId, sortedNotifications]);

  const handleAcknowledge = (id: string) => {
    markNotificationRead(id);
    setSelectedId(null);
  };

  // --- VIEW A: THE LIST ---
  if (!selectedId) {
    return (
      <div className="p-8 max-w-5xl mx-auto pb-20 relative z-20 text-white">
        <div className="mb-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Intelligence Log</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Latest Strategic Transmissions</p>
        </div>

        <div className="space-y-4">
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`group flex items-center justify-between p-6 rounded-[2rem] border cursor-pointer transition-all duration-300
                  ${n.read ? 'bg-[#0a0a0a] border-white/5 opacity-60' : 'bg-[#111111] border-white/10 hover:border-[#A500FF] shadow-2xl'}`}
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-black border border-white/10 text-[#A500FF]">
                    <IoMailOpenOutline size={22} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-white mb-1">
                      {n.data?.title || "Transmission"}
                      {n.count && n.count > 1 && <span className="ml-3 text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full">+{n.count}</span>}
                    </h4>
                    <p className="text-sm text-gray-400 truncate max-w-md"
                      dangerouslySetInnerHTML={{ __html: n.data?.message || "" }} />
                  </div>
                </div>
                <IoChevronForward className="text-white/50 group-hover:text-white" size={20} />
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Neural Log Empty</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW B: THE DETAIL ---
  if (!activeMsg) return null;

  return (
    // ⚡️ Added z-50 and bg-black/80 backdrop safety
    <div className="relative z-50 p-8 max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-right-4 duration-500 text-white">
      <button
        onClick={() => setSelectedId(null)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <IoArrowBack /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Log</span>
      </button>

      <div className="bg-[#0f0f0f] border border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="p-10 border-b border-white/10 bg-gradient-to-br from-[#A500FF]/5 to-transparent">
          <div className="flex justify-between items-start mb-6">
            <div className="p-5 w-fit rounded-3xl bg-[#A500FF]/10 border border-[#A500FF]/20 text-[#A500FF]">
              <IoMailOpenOutline size={28} />
            </div>
            <button
              onClick={() => { clearNotification(activeMsg.id); setSelectedId(null); }}
              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
            >
              <IoTrashOutline size={20} />
            </button>
          </div>

          <h1 className="text-4xl font-black text-white uppercase mb-2 tracking-tighter leading-tight">
            {activeMsg.data?.title}
          </h1>
          <p className="text-[10px] text-[#A500FF] font-black uppercase tracking-[0.3em]">
            Decrypted: {new Date(activeMsg.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="p-10 bg-black/40">
          <div
            className="text-xl text-gray-200 leading-relaxed mb-12 space-y-4 font-medium"
            dangerouslySetInnerHTML={{ __html: activeMsg.data?.message || "" }}
          />

          <div className="flex gap-4">
            <button
              onClick={() => handleAcknowledge(activeMsg.id)}
              className="flex-1 py-6 bg-white text-black rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-[#A500FF] hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              Acknowledge Briefing
            </button>
            <button
              onClick={() => setSelectedId(null)}
              className="px-10 py-6 bg-white/5 text-white rounded-2xl font-black uppercase text-[12px] tracking-widest border border-white/10 hover:bg-white/10 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};