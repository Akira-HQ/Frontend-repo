"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Zap, Loader2, Edit3, Target, MessageSquareQuote } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import ConfirmModal from "@/components/notifications/CTAAlerts";

const ConversationReviewPanel = ({ conversationId, onClose }: { conversationId: string; onClose: () => void }) => {
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [correctionInput, setCorrectionInput] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const { callApi } = UseAPI();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [correctionInput]);

  useEffect(() => {
    const loadTranscript = async () => {
      const res = await callApi(`/pulse/inbox/conversation/${conversationId}`, "GET");
      if (res) setChat(res);
      setLoading(false);
    };
    loadTranscript();
  }, [conversationId, callApi]);

  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-white">$1</span>')
      .replace(/__(.*?)__/g, '<span class="text-[#00A7FF] font-bold underline">$1</span>')
      .replace(/\n/g, "<br>");
  };

  const handleMessageCorrection = (msg: any) => {
    setSelectedMessage(msg);
    setCorrectionInput("");
    textareaRef.current?.focus();
  };

  const handleConfirmSubmit = async () => {
    const finalPayload = selectedMessage
      ? `ORIGINAL: ${selectedMessage.text}\nCORRECTION: ${correctionInput}`
      : correctionInput;

    await callApi("/pulse/feedback", "POST", {
      visitor_id: conversationId,
      sentiment: "AI_TRAINING_CORRECTION",
      message: finalPayload
    });

    setCorrectionInput("");
    setSelectedMessage(null);
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-gray-950/98 backdrop-blur-2xl z-50 p-6 flex flex-col animate-in fade-in zoom-in duration-300">
      {/* ⚡️ CUSTOM SCROLLBAR CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(165, 0, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(165, 0, 255, 0.6);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(165, 0, 255, 0.3) rgba(255, 255, 255, 0.02);
        }
      `}</style>

      {/* 1. HEADER */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 italic tracking-tighter uppercase">
            <Target className="w-5 h-5 text-red-500 animate-pulse" /> Neural Training Lab
          </h3>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Target Session: {conversationId.slice(-8)}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
          <X size={22} />
        </button>
      </div>

      {/* 2. CHAT FEED */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-2 custom-scrollbar pb-32">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
            <Loader2 className="animate-spin text-[#A500FF]" size={32} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Downloading Neural Memory</span>
          </div>
        ) : (
          chat.map((msg, index) => {
            const isUser = msg.sender === "user";
            const isInsight = msg.sender === "system_insight";
            const isTargeted = selectedMessage?.text === msg.text;

            return (
              <div key={index} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div className={`group relative max-w-[80%] p-4 rounded-2xl shadow-2xl transition-all duration-300 
                  ${isUser ? "bg-[#A500FF]/10 text-white border border-[#A500FF]/20" :
                    isInsight ? "bg-amber-500/5 text-amber-200/80 italic border border-amber-500/10" :
                      isTargeted ? "bg-red-500/10 border-red-500/50 scale-[1.02]" :
                        "bg-white/5 text-gray-300 border border-white/10"
                  }`}>

                  <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />

                  {!isUser && !isInsight && (
                    <button
                      onClick={() => handleMessageCorrection(msg)}
                      className={`absolute -right-12 top-0 p-2 rounded-lg transition-all ${isTargeted ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100'}`}
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
                <span className="text-[9px] mt-2 font-black text-gray-600 uppercase tracking-widest">{msg.sender}</span>
              </div>
            );
          })
        )}
      </div>

      {/* 3. ENHANCED TRAINING INPUT AREA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent">
        <div className="max-w-4xl mx-auto border border-white/10 bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          {selectedMessage && (
            <div className="bg-red-500/10 p-3 border-b border-red-500/20 flex items-start gap-3 animate-in slide-in-from-bottom-2">
              <MessageSquareQuote className="text-red-500 shrink-0" size={18} />
              <p className="text-xs text-red-200 line-clamp-2 italic">"{selectedMessage.text}"</p>
              <button onClick={() => setSelectedMessage(null)} className="ml-auto text-red-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3 p-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={correctionInput}
              onChange={(e) => setCorrectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleConfirmSubmit();
                }
              }}
              placeholder={selectedMessage ? "Type the correct response here..." : "Select a message to correct or type general feedback..."}
              className="flex-1 bg-transparent border-none text-white text-base py-2 px-1 outline-none resize-none max-h-48 custom-scrollbar"
            />

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!correctionInput.trim()}
              className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-br from-red-600 via-[#A500FF] to-blue-600 text-white font-bold text-xs uppercase tracking-tighter hover:brightness-125 transition-all disabled:opacity-20 flex items-center gap-2"
            >
              <Zap size={16} fill="currentColor" /> Train Brain
            </button>
          </div>
        </div>
        <p className="text-center text-[9px] text-gray-600 mt-3 uppercase tracking-widest font-bold">Press CMD+ENTER to commit training</p>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Optimize Neural Logic?"
          message="This will update Cliva's understanding of this specific scenario. The correction will be applied to future strategic generations."
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
          confirmText="Verify & Commit"
        />
      )}
    </div>
  );
};

export default ConversationReviewPanel;