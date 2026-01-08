"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { InboxKPIs } from "./Inbox/InboxKPI";
import ReportItem from "./Inbox/ReportItem";
import ConversationReviewPanel from "./Inbox/Conversation";
import { ReportData, Metric } from "@/types";

const InboxContent = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [kpis, setKpis] = useState<Metric[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  const reportFeedRef = useRef<HTMLDivElement>(null);

  const { callApi } = UseAPI();
  const { user, addToast } = useAppContext();

  useEffect(() => {
    const loadInboxData = async () => {
      const storeId = user?.store?.id;
      if (!storeId) return;

      setLoading(true);
      try {
        const [sessions, stats] = await Promise.all([
          callApi(`/pulse/inbox/sessions?storeId=${storeId}`, "GET"),
          callApi(`/pulse/inbox/stats?storeId=${storeId}`, "GET")
        ]);

        if (sessions) setReports(sessions);
        if (stats) setKpis(stats);
      } catch (err) {
        console.error("Inbox Data Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInboxData();
  }, [user?.store?.id, callApi]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || isSendingCommand) return;

    const query = commandInput.trim();
    setCommandInput("");
    setIsSendingCommand(true);

    try {
      const res = await callApi("/pulse/command", "POST", {
        query: query,
        storeId: user?.store?.id
      });

      if (res?.data) {
        // ✅ FIXED: Added missing properties to match ReportData interface
        const insightReport: ReportData = {
          id: `insight-${Date.now()}`,
          type: "insight",
          title: "Neural Strategic Insight", // Required
          message: res.data.message,        // Required (mapped from response)
          time: "Just now",                 // Required
          summary: res.data.message,        // Optional
          created_at: new Date().toISOString(),
          status: "completed",
          metadata: { query: query }
        };

        setReports(prev => [insightReport, ...prev]);

        reportFeedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      addToast("Failed to connect to Neural Brain.", "error");
      setCommandInput(query);
    } finally {
      setIsSendingCommand(false);
    }
  };

  return (
    <div className="py-0 px-2 w-full h-full text-white pt-5 ml-6 relative">
      <h1 className="text-3xl font-bold mb-4 italic tracking-tighter">Command Center</h1>

      <InboxKPIs metrics={kpis.length > 0 ? kpis : []} />

      <div className="bg-[#0b0b0b] rounded-xl p-6 shadow-2xl relative h-[calc(100vh-300px)] flex flex-col">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-3 flex items-center gap-2 uppercase tracking-widest text-[10px]">
          <RefreshCw className={`w-4 h-4 text-[#FFB300] ${(loading || isSendingCommand) ? 'animate-spin' : ''}`} />
          Neural Report Feed ({reports.length})
        </h2>

        <div ref={reportFeedRef} className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} onReviewClick={setSelectedConversationId} />
          ))}
          {!loading && reports.length === 0 && (
            <p className="text-center text-gray-500 pt-10 uppercase tracking-widest text-[10px] italic">
              No active customer intelligence detected in neural link.
            </p>
          )}
        </div>

        <form
          className="mt-4 flex gap-2 pt-4 border-t border-gray-800"
          onSubmit={handleCommand}
        >
          <input
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isSendingCommand}
            placeholder={isSendingCommand ? "Cliva is thinking..." : "Ask Cliva for strategic insights or reports..."}
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-1 focus:ring-[#A500FF] outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!commandInput.trim() || isSendingCommand}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#00A7FF] to-[#A500FF] text-white disabled:opacity-50 transition-all active:scale-95"
          >
            <Send className={`w-5 h-5 ${isSendingCommand ? 'animate-pulse' : ''}`} />
          </button>
        </form>
      </div>

      {selectedConversationId && (
        <ConversationReviewPanel
          conversationId={selectedConversationId}
          onClose={() => setSelectedConversationId(null)}
        />
      )}
    </div>
  );
};

export default InboxContent;