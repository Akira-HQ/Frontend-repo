"use client";
import React, { useState } from "react";
import { IoClose, IoCopyOutline, IoCodeSlash, IoShieldCheckmarkOutline, IoPulseOutline } from "react-icons/io5";

interface SetupProps {
  onClose: () => void;
  snippetToken?: string;
}

const SetupGuidePanel: React.FC<SetupProps> = ({ onClose, snippetToken }) => {
  const [copied, setCopied] = useState(false);

  // ⚡️ THE REAL TRACKER SNIPPET
  // This script will handle the Chat UI + Behavioral Tracking
  const snippet = `<script>
  (function(c,l,i,v,a){
    a=l.createElement(i);a.async=1;a.src=v;
    a.setAttribute('data-cliva-id', '${snippetToken || "YOUR_TOKEN"}');
    l.head.appendChild(a);
  })(window, document, 'script', 'https://cdn.cliva.ai/pulse.js');
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-[#050505] border-l border-white/10 h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto cliva-scrollbar">
        <div className="p-10">
          <button onClick={onClose} className="mb-10 p-3 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <IoClose size={24} />
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <IoPulseOutline size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Injection</h2>
          </div>
          <p className="text-gray-500 text-sm mb-10">Follow these steps to activate the tracker and communication layer.</p>

          {/* STEP 1 */}
          <div className="space-y-8">
            <section>
              <div className="flex gap-4 mb-4">
                <span className="text-amber-500 font-black italic">01.</span>
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mt-1">Copy the Pulse Snippet</h4>
              </div>
              <div className="relative group">
                <pre className="bg-black p-6 rounded-2xl border border-white/5 font-mono text-[11px] text-amber-500/80 leading-relaxed overflow-x-auto">
                  {snippet}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-4 top-4 p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                  {copied ? <span className="text-[10px] font-black uppercase text-emerald-500">Copied</span> : <IoCopyOutline size={16} />}
                </button>
              </div>
            </section>

            {/* STEP 2 */}
            <section>
              <div className="flex gap-4 mb-4">
                <span className="text-amber-500 font-black italic">02.</span>
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mt-1">Paste into Header</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-10">
                Log in to your store dashboard (Shopify, Wix, or Custom) and find your **Global Header** file (usually <code className="text-amber-500">theme.liquid</code> or <code className="text-amber-500">index.html</code>). Paste the code just before the <code className="text-gray-300">{"</head>"}</code> tag.
              </p>
            </section>

            {/* STEP 3 */}
            <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex gap-4 mb-4">
                <IoShieldCheckmarkOutline className="text-emerald-500" size={24} />
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mt-1">Verification Status</h4>
              </div>
              <p className="text-xs text-gray-500 mb-6">Once installed, Cliva will automatically send a "Heartbeat" signal to the dashboard to confirm synchronization.</p>
              <div className="flex items-center gap-3 px-4 py-3 bg-black rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Waiting for first heartbeat...</span>
              </div>
            </section>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl"
          >
            I've Installed the Pulse
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupGuidePanel;