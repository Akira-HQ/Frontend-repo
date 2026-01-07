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
  const [kpis, setKpis] = useState<Metric[]>([]); // ⚡️ Real KPI State
  const [commandInput, setCommandInput] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reportFeedRef = useRef<HTMLDivElement>(null);

  const { callApi } = UseAPI();
  const { user } = useAppContext();

  // ⚡️ REAL DATA FETCH
  useEffect(() => {
    const loadInboxData = async () => {
      const storeId = user?.store?.id;
      if (!storeId) return;

      setLoading(true);
      try {
        // Fetch sessions and stats in parallel to avoid multiple loaders
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

  return (
    <div className="py-0 px-2 w-full h-full text-white pt-5 ml-6 relative">
      <h1 className="text-3xl font-bold mb-4 italic tracking-tighter">Command Center</h1>

      {/* ⚡️ Now using live KPIs */}
      <InboxKPIs metrics={kpis.length > 0 ? kpis : []} />

      <div className="bg-[#0b0b0b] rounded-xl p-6 shadow-2xl relative h-[calc(100vh-300px)] flex flex-col">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-3 flex items-center gap-2 uppercase tracking-widest text-[10px]">
          <RefreshCw className={`w-4 h-4 text-[#FFB300] ${loading ? 'animate-spin' : ''}`} />
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

        {/* Command bar form */}
        <form
          className="mt-4 flex gap-2 pt-4 border-t border-gray-800"
          onSubmit={(e) => { e.preventDefault(); setCommandInput(""); }}
        >
          <input
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Ask Cliva for strategic insights or reports..."
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-1 focus:ring-[#A500FF] outline-none"
          />
          <button
            type="submit"
            disabled={!commandInput.trim()}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#00A7FF] to-[#A500FF] text-white disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
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