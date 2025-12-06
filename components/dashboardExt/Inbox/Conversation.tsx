'use client'
import React, { useState } from 'react';
// FIX: Using Lucide imports
import { MessageCircle, X, Send, Zap, ChevronRight } from 'lucide-react';
// NOTE: Assuming alias resolution for common types and utilities
import { ReportData } from '@/types';

interface PanelProps {
  conversationId: string;
  onClose: () => void;
}

// Mock chat data for review (Simulating the full transcript pulled from PostgreSQL)
const mockChat = [
  { sender: 'customer', text: "Is the leather backpack available in blue?" },
  { sender: 'akira', text: "Yes! We have the Vintage Leather Backpack in Midnight Blue. It's currently in low stock (only 3 left). Would you like me to reserve one for you now? 🛍️" },
  { sender: 'customer', text: "3 left? Ah, I'll think about it. Too expensive right now." },
  { sender: 'akira', text: "I understand! We also have the **Portable Espresso Maker** on sale this week. It's a fantastic value at $25,000. Can I tell you more about it? ☕" },
  // AI INSIGHT injected by the system, not visible to the customer
  { sender: 'system_insight', text: "Insight: Customer hit **Price Objection**. Akira attempted cross-sell with the Espresso Maker but failed. Conversion likelihood: Medium." }
];

const ConversationReviewPanel: React.FC<PanelProps> = ({ conversationId, onClose }) => {
  const [correctionInput, setCorrectionInput] = useState('');
  const NEON_PURPLE = "#A500FF";

  // NOTE: Replace alert() with a proper Toast or Modal notification in the final application.
  const handleCorrection = () => {
    if (!correctionInput.trim()) return;

    // This is where the RL feedback loop sends the data to the backend
    console.log(`[RL FEEDBACK SUBMITTED] Conversation ID: ${conversationId}`);
    console.log(`Correction: ${correctionInput}`);

    // MOCK: Use alert for mock action feedback
    alert(`Correction Sent! Akira will use this to refine future sales scripts.`);

    setCorrectionInput('');
    onClose(); // Close the panel after feedback is submitted
  };

  return (
    <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-md z-50 p-6 flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800 flex-shrink-0">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-400" /> Conversation Review: <span className="text-[#FFB300] font-mono font-medium">#{conversationId}</span>
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Mock Chat Transcript */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2 custom-scrollbar">
        {mockChat.map((msg, index) => {
          const isSystem = msg.sender === 'system_insight';
          const isCustomer = msg.sender === 'customer';

          return (
            <div key={index} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl shadow-md ${isCustomer
                  ? 'bg-[#A500FF]/50 text-white rounded-br-none'
                  : isSystem
                    ? 'bg-yellow-900/40 text-yellow-100 border border-yellow-700/50 text-sm italic rounded-xl' // Insight style
                    : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700' // Akira style
                }`}>
                <p className="font-medium text-xs mb-1">
                  {isSystem
                    ? <span className="flex items-center text-yellow-300 gap-1"><Zap className="w-3 h-3" /> Akira Analysis:</span>
                    : isCustomer
                      ? 'Customer'
                      : 'Akira Response:'
                  }
                </p>
                <p className='text-sm' dangerouslySetInnerHTML={{ __html: msg.text }} />

                {/* Highlight the specific message Akira responded to */}
                {!isSystem && index > 0 && mockChat[index - 1].sender === 'customer' && (
                  <div className={`mt-2 pt-2 border-t ${isCustomer ? 'border-white/20' : 'border-gray-700'} text-[10px] text-gray-400 flex items-center gap-1`}>
                    <ChevronRight className='w-3 h-3' /> Responded to prior message.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Correction/Feedback Input (Reinforcement Learning) */}
      <div className="pt-4 border-t border-gray-800 mt-4 flex-shrink-0">
        <label className='text-sm text-gray-400 block mb-2'>Owner Feedback Loop (Direct RL Correction):</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., 'Next time, suggest a cheaper backpack alternative...'"
            value={correctionInput}
            onChange={(e) => setCorrectionInput(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-1 focus:ring-[#A500FF] focus:border-[#A500FF] transition"
          />
          <button
            onClick={handleCorrection}
            disabled={!correctionInput.trim()}
            className={`px-4 py-3 rounded-lg bg-[${NEON_PURPLE}] text-white font-semibold hover:bg-[#FFB300] transition disabled:opacity-50 flex items-center gap-1`}
          >
            <Zap className='w-5 h-5' />
            Send
          </button>
        </div>
      </div>

      {/* Custom Scrollbar CSS (Included locally for this modal) */}
      <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
            `}</style>
    </div>
  );
};

export default ConversationReviewPanel;