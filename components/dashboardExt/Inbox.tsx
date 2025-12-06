'use client'
import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react'
import { Send, Clock, DollarSign, ArrowUpRight, Zap, RefreshCw, MessageCircle, X, ChevronRight, AlertTriangle } from 'lucide-react';
import { Console } from 'console';
import ConfirmModal from '../notifications/CTAAlerts';
import { MOCK_KPIS, MOCK_REPORTS, ReportData } from '@/types';
import { InboxKPIs } from './Inbox/InboxKPI';
import ReportItem from './Inbox/ReportItem';
import ConversationReviewPanel from './Inbox/Conversation';

// --- MOCK DEPENDENCIES (Internalized for compilation) ---
// MOCK: Placeholder for useAppContext
const useAppContext = () => ({ isDarkMode: true });
// NOTE: Use the exact colors defined in the repo for gradient consistency
const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#00A7FF"; // Added blue accent for better gradient reference



// --- INBOX MAIN COMPONENT ---
const InboxContent = () => {
  const { isDarkMode } = useAppContext();
  const [reports, setReports] = useState<ReportData[]>(MOCK_REPORTS);
  const [commandInput, setCommandInput] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const reportFeedRef = useRef<HTMLDivElement>(null);

  // --- NEW STATE for Filters ---
  const [timeFilter, setTimeFilter] = useState('day');
  const [typeFilter, setTypeFilter] = useState('all');

  const TIME_FILTERS = [
    { label: 'Today', value: 'day' },
    { label: '7 Days', value: 'week' },
    { label: '30 Days', value: 'month' },
    { label: 'All Time', value: 'all' },
  ];

  const TYPE_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Alerts', value: 'ALERT' },
    { label: 'Escalations', value: 'ESCALATION' },
    { label: 'Digests', value: 'DIGEST' },
  ];
  // --- END NEW STATE ---


  // Auto-scroll to bottom of report feed
  useEffect(() => {
    reportFeedRef.current?.scrollTo(0, reportFeedRef.current.scrollHeight);
  }, [reports]);

  const handleAskAkira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const userQuery = commandInput.trim();

    const newReport: ReportData = {
      id: 'owner_' + Date.now(),
      type: 'DIGEST',
      title: `Query: ${userQuery}`,
      message: "Akira is processing your request for strategic insight. This usually takes 10-20 seconds...",
      time: 'Just now'
    };

    setReports(prev => [...prev, newReport]);
    setCommandInput('');

    // Simulate AI response delay (This is where the real API call and prediction logic lives)
    setTimeout(() => {
      const insight: ReportData = {
        id: 'akira_' + Date.now(),
        type: 'QUERY_RESPONSE', // Updated type for specific query response
        title: 'Akira Insight: Prediction Result',
        message: `Based on a deep dive into the ${userQuery.includes('product') ? 'product' : 'store'} data, I predict a 15% increase in conversion if you run a 'Low Stock Alert' campaign via WhatsApp tomorrow.`,
        time: 'Just now'
      };
      // Replace the 'processing' report with the actual insight
      setReports(prev => prev.map(r => r.id === newReport.id ? insight : r));
    }, 3000);
  };

  // Filter Logic (MOCK for now, but ready for real data filtering)
  const filteredReports = reports.filter(report => {
    if (typeFilter === 'all') return true;
    return report.type === typeFilter;
  });


  const FilterButton: React.FC<{ label: string; value: string; current: string; onClick: (v: string) => void }> = ({ label, value, current, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`
                px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200
                ${current === value
          // CHANGED: Filter button uses blue/purple gradient
          ? `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] text-white shadow-md shadow-purple-900/50`
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }
            `}
    >
      {label}
    </button>
  );


  return (
    <div className={`py-0 px-2 w-full h-full text-white pt-5 ml-6 relative`}>

      {/* KPI Overview Cards */}
      <h1 className='text-3xl font-bold mb-4'>Akira Command Center</h1>
      {/* RENDER INBOX KPIS */}
      <InboxKPIs metrics={MOCK_KPIS} />

      {/* --- NEW: FILTERS BAR --- */}
      <div className="flex justify-between items-center mb-6 p-4 bg-[#0b0b0b] rounded-xl border border-gray-800">

        {/* Time Range Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Timeframe:</span>
          {TIME_FILTERS.map(f => (
            <FilterButton key={f.value} label={f.label} value={f.value} current={timeFilter} onClick={setTimeFilter} />
          ))}
        </div>

        {/* Report Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Filter By:</span>
          {TYPE_FILTERS.map(f => (
            <FilterButton key={f.value} label={f.label} value={f.value} current={typeFilter} onClick={setTypeFilter} />
          ))}
        </div>
      </div>
      {/* --- END NEW: FILTERS BAR --- */}


      {/* Main Content: Reports Feed */}
      <div className='bg-[#0b0b0b] rounded-xl p-6 shadow-2xl relative h-[calc(100vh-300px)] flex flex-col'>
        <h2 className='text-xl font-bold mb-4 border-b border-gray-800 pb-3 flex items-center gap-2'>
          <RefreshCw className='w-5 h-5 text-[#FFB300]' /> Conversational Report Feed ({filteredReports.length})
        </h2>

        {/* Report Scroll Area */}
        <div ref={reportFeedRef} className='flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar'>
          {filteredReports.map((report) => (
            // RENDER REPORT ITEM
            <ReportItem key={report.id} report={report} onReviewClick={setSelectedConversationId} />
          ))}
          {filteredReports.length === 0 && (
            <p className="text-center text-gray-500 pt-10">No reports match the current filters. Akira is awaiting new insights!</p>
          )}
        </div>

        {/* Command Bar (Owner -> Akira) */}
        <form onSubmit={handleAskAkira} className="mt-4 pt-4 border-t border-gray-800 flex gap-3 flex-shrink-0">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Ask Akira for strategic insights, predictions, or business reports..."
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-1 focus:ring-[#A500FF] focus:border-[#A500FF]"
          />
          <button
            type="submit"
            disabled={!commandInput.trim()}
            // CHANGED: Command bar button uses blue/purple gradient
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] text-white font-semibold hover:from-[${NEON_PURPLE}] hover:to-[${NEON_ORANGE}] transition disabled:opacity-50"
          >
            <Send className='w-5 h-5' />
          </button>
        </form>
      </div>

      {/* Conversation Review Panel (Modal/Overlay) */}
      {selectedConversationId && (
        <ConversationReviewPanel
          conversationId={selectedConversationId}
          onClose={() => setSelectedConversationId(null)}
        />
      )}

      {/* Custom Scrollbar CSS for the feed (Injected locally) */}
      <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
            `}</style>
    </div>
  );
};

export default InboxContent;