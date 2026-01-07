"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle, X, Zap, Loader2, Edit3, Target } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import ConfirmModal from "@/components/notifications/CTAAlerts";

const ConversationReviewPanel = ({ conversationId, onClose }: { conversationId: string; onClose: () => void }) => {
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [correctionInput, setCorrectionInput] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

  const { callApi } = UseAPI();

  // ⚡️ LOAD REAL TRANSCRIPT
  useEffect(() => {
    const loadTranscript = async () => {
      const res = await callApi(`/pulse/inbox/conversation/${conversationId}`, "GET");
      if (res) setChat(res);
      setLoading(false);
    };
    loadTranscript();
  }, [conversationId, callApi]);

  // ⚡️ MARKDOWN PARSER
  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-white">$1</span>')
      .replace(/__(.*?)__/g, '<span class="text-[#00A7FF] font-bold underline">$1</span>')
      .replace(/\n/g, "<br>");
  };

  const handleMessageCorrection = (msg: any, index: number) => {
    setSelectedMessageId(index);
    setCorrectionInput(`Cliva said: "${msg.text}"\nCorrection: `);
  };

  const handleConfirmSubmit = async () => {
    // ⚡️ RL FEEDBACK LOOP: Store the instruction in the intelligence table
    await callApi("/pulse/feedback", "POST", {
      visitor_id: conversationId,
      sentiment: "AI_TRAINING_CORRECTION",
      message: correctionInput
    });
    setCorrectionInput("");
    setSelectedMessageId(null);
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-xl z-50 p-6 flex flex-col animate-in slide-in-from-bottom duration-500">
      {/* 1. HEADER */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 italic tracking-tighter uppercase">
            <Target className="w-5 h-5 text-red-500 animate-pulse" /> Training Mode
          </h3>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Session: {conversationId.slice(-6)}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* 2. CHAT FEED WITH MARKDOWN & FEEDBACK ACTIONS */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-2 custom-scrollbar">
        {loading ? <div className="h-full flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-[#A500FF]" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Synchronizing Neural Logs</span>
        </div> :
          chat.map((msg, index) => {
            const isUser = msg.sender === "user";
            const isInsight = msg.sender === "system_insight";

            return (
              <div key={index} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div className={`group relative max-w-[85%] p-4 rounded-2xl shadow-2xl transition-all duration-300 ${isUser ? "bg-[#A500FF]/20 text-white border border-[#A500FF]/30" :
                    isInsight ? "bg-amber-500/10 text-amber-200 italic border border-amber-500/20" :
                      "bg-white/5 text-gray-200 border border-white/10 hover:border-white/20"
                  }`}>
                  <p className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />

                  {/* ⚡️ PER-MESSAGE TRAINING BUTTON */}
                  {!isUser && !isInsight && (
                    <button
                      onClick={() => handleMessageCorrection(msg, index)}
                      className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
                <span className="text-[8px] mt-1 font-black text-gray-600 uppercase tracking-tighter">{msg.sender}</span>
              </div>
            );
          })
        }
      </div>

      {/* 3. RL FEEDBACK INPUT */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-[#A500FF]/50 transition-all">
          <textarea
            value={correctionInput}
            onChange={(e) => setCorrectionInput(e.target.value)}
            placeholder={selectedMessageId !== null ? "Correct this specific response..." : "Provide overall feedback for Cliva..."}
            className="flex-1 bg-transparent border-none text-white text-sm p-3 outline-none resize-none h-12"
          />
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={!correctionInput.trim()}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-[#A500FF] text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-2 shadow-lg shadow-red-500/20"
          >
            <Zap size={14} fill="currentColor" /> Train Cliva
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Commit Intelligence Correction?"
          message="This correction will be permanently logged. Cliva will prioritize this instruction in future sessions with similar context."
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
          confirmText="Verify Correction"
        />
      )}
    </div>
  );
};

export default ConversationReviewPanel;