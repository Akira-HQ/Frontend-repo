"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Target, X } from "lucide-react"; // ⚡️ Added Target/X icons
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
  const [taggedReport, setTaggedReport] = useState<ReportData | null>(null); // ⚡️ Tagging State
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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    loadInboxData();
  }, [user?.store?.id, callApi]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || isSendingCommand) return;

    const query = commandInput.trim();
    setIsSendingCommand(true);

    try {
      const res = await callApi("/pulse/command", "POST", {
        query: query,
        storeId: user?.store?.id,
        taggedSessionId: taggedReport?.conversationId // ⚡️ Pass the tag
      });

      if (res?.data) {
        const insightReport: ReportData = {
          id: `insight-${Date.now()}`,
          type: "insight",
          title: taggedReport ? `Analysis: ${taggedReport.title}` : "Neural Strategic Insight",
          message: res.data.message,
          time: "Just now",
          summary: res.data.message,
          created_at: new Date().toISOString(),
          status: "completed",
          metadata: { query: query, focusedSession: taggedReport?.id }
        };

        setReports(prev => [insightReport, ...prev]);
        setCommandInput("");
        setTaggedReport(null); // ⚡️ Clear tag after successful response
        reportFeedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      addToast("Failed to connect to Neural Brain.", "error");
    } finally {
      setIsSendingCommand(false);
    }
  };

  return (
    <div className="py-0 px-2 w-full h-full text-white pt-5 ml-6 relative">
      <h1 className="text-3xl font-bold mb-4 italic tracking-tighter">Command Center</h1>
      <InboxKPIs metrics={kpis} />

      <div className={`bg-[#0b0b0b] rounded-xl p-6 shadow-2xl relative h-[calc(100vh-300px)] flex flex-col border transition-all ${taggedReport ? 'border-[#A500FF] shadow-[0_0_20px_rgba(165,0,255,0.2)]' : 'border-gray-900'}`}>

        <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-3 flex items-center justify-between uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-[#FFB300] ${loading ? 'animate-spin' : ''}`} />
            Neural Report Feed ({reports.length})
          </div>
          {/* ⚡️ Tagged Indicator */}
          {taggedReport && (
            <div className="flex items-center gap-2 bg-[#A500FF]/20 text-[#A500FF] px-3 py-1 rounded-full animate-pulse border border-[#A500FF]/30">
              <Target size={12} />
              <span>Targeting: {taggedReport.title}</span>
              <X size={12} className="cursor-pointer hover:text-white" onClick={() => setTaggedReport(null)} />
            </div>
          )}
        </h2>

        <div ref={reportFeedRef} className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => setTaggedReport(report)} // ⚡️ Click to Tag
              className={`cursor-pointer transition-all ${taggedReport?.id === report.id ? 'ring-2 ring-[#A500FF] rounded-lg' : ''}`}
            >
              <ReportItem report={report} onReviewClick={setSelectedConversationId} />
            </div>
          ))}
        </div>

        <form className="mt-4 flex flex-col gap-2 pt-4 border-t border-gray-800" onSubmit={handleCommand}>
          <div className="flex gap-2">
            <input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              disabled={isSendingCommand}
              placeholder={taggedReport ? `Ask about ${taggedReport.title}...` : "Ask Cliva for strategic insights..."}
              className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-1 focus:ring-[#A500FF] outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!commandInput.trim() || isSendingCommand}
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#00A7FF] to-[#A500FF] text-white disabled:opacity-50 transition-all active:scale-95"
            >
              <Send className={`w-5 h-5 ${isSendingCommand ? 'animate-pulse' : ''}`} />
            </button>
          </div>
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