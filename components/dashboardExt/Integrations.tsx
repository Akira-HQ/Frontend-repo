"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle, Zap, MessageSquare, ShoppingCart, Lock,
  Globe, RefreshCw, XCircle, Copy, Terminal, Monitor, Layout
} from "lucide-react";
import { useAppContext } from "../AppContext";
import ConfirmModal from "../notifications/CTAAlerts";

const NEON_PURPLE = "#A500FF";
const ACCENT_BLUE = "#00A7FF";

type IntegrationStatus = "connected" | "error" | "pending" | "planned";

interface Integration {
  id: string;
  name: string;
  icon: React.FC<any>;
  status: IntegrationStatus;
  details: string;
  actionLabel: string;
  actionColor: string;
}

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "shopify",
    name: "Shopify Store",
    icon: ShoppingCart,
    status: "connected",
    details: "Neural link established. Monitoring live sales data.",
    actionLabel: "Disconnect",
    actionColor: "bg-green-600",
  },
  {
    id: "generic_web",
    name: "Custom Website",
    icon: Globe,
    status: "pending",
    details: "Manual injection required for tracker activation.",
    actionLabel: "Snippet Active",
    actionColor: `bg-[${ACCENT_BLUE}]`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: MessageSquare,
    status: "planned",
    details: "Enable AI-driven sales conversations. Coming Soon.",
    actionLabel: "Planned",
    actionColor: "bg-gray-800",
  },
];

const IntegrationsHub: React.FC = () => {
  const { user, addToast, syncQuotas } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const userPlatform = user?.store?.platform?.toUpperCase();
  const snippetToken = user?.store?.snippetToken || "CLIVA_NEURAL_TOKEN_001";

  const snippetCode = `<script>
  (function(c,l,i,v,a){
    a=l.createElement(i);a.async=1;a.src=v;
    a.setAttribute('data-id', '${snippetToken}');
    l.head.appendChild(a);
  })(window, document, 'script', 'https://cdn.cliva.ai/pulse.js');
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    addToast("Snippet copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-6 w-full h-full text-white min-h-screen relative z-10">
      {/* 1. HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Neural Bridges</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-2xl font-medium">
          Connect Cliva's Pulse to your storefront to enable real-time behavioral tracking and AI communication.
        </p>
      </div>

      {/* 2. INTEGRATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {MOCK_INTEGRATIONS.map((app) => {
          const Icon = app.icon;
          const isLocked = app.id !== "ai_core" && userPlatform !== app.id.toUpperCase();

          return (
            <div
              key={app.id}
              className={`p-6 rounded-3xl bg-[#0b0b0b] border transition-all duration-500 
                ${isLocked ? 'border-white/5 opacity-40' : 'border-white/10 hover:border-[#A500FF]/50 shadow-2xl'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-black border border-white/5 ${isLocked ? 'text-gray-600' : 'text-[#00A7FF]'}`}>
                  <Icon size={24} />
                </div>
                {!isLocked && app.status === "connected" && <CheckCircle className="text-emerald-500" size={18} />}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">{app.details}</p>
              <div className={`text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-lg text-center
                ${isLocked ? 'bg-white/5 text-gray-500' : 'bg-[#A500FF]/10 text-[#A500FF] border border-[#A500FF]/20'}`}>
                {isLocked ? "Bridge Locked" : "System Active"}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. PERMANENT SETUP GUIDE (STATIC) */}
      <div className="bg-[#080808] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-3xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent flex items-center gap-4">
          <Terminal className="text-amber-500" size={24} />
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Manual Injection Guide</h2>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Global Deployment Script</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-10">

          {/* Left Column: Code & Steps */}
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">01</span>
                <h4 className="text-sm font-black uppercase tracking-widest text-white">Copy Pulse Snippet</h4>
              </div>
              <div className="relative group">
                <pre className="bg-black p-6 rounded-2xl border border-white/10 font-mono text-xs text-amber-500/80 leading-relaxed overflow-x-auto">
                  {snippetCode}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute right-4 top-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">02</span>
                <h4 className="text-sm font-black uppercase tracking-widest text-white">Injection Point</h4>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Open your platform's theme editor (e.g., <code className="text-white">theme.liquid</code> in Shopify).
                Paste the snippet directly before the <code className="text-amber-500">{"</head>"}</code> closing tag.
              </p>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Monitor className="text-blue-500 mt-1" size={20} />
                <p className="text-[11px] text-gray-400">
                  <strong className="text-white">Behavioral Monitoring:</strong> Once injected, Cliva will begin tracking customer clicks, hovers, and exit intent in real-time.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Visual Previews / Screenshots */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Implementation Preview</h4>

            {/* Screenshot Placeholder 1 */}
            <div className="aspect-video bg-black rounded-3xl border border-white/10 flex flex-col items-center justify-center group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A500FF]/10 to-transparent opacity-50" />
              <Layout className="text-gray-800 mb-2 group-hover:scale-110 transition-transform" size={48} />
              <p className="text-[10px] text-gray-600 font-bold uppercase">Shopify theme.liquid Preview</p>
              {/*  */}
            </div>

            {/* Live Status Tracker */}
            <div className="p-8 rounded-3xl bg-black border border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/5 border border-amber-500/20 flex items-center justify-center mb-4">
                <RefreshCw className="text-amber-500 animate-spin-slow" size={24} />
              </div>
              <h5 className="text-white font-bold text-sm">Neural Sync Status</h5>
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">Waiting for Pulse Heartbeat...</p>

              <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-amber-500 animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {modalOpen && (
        <ConfirmModal
          title="Disconnect Intelligence?"
          message="Stopping the pulse will immediately cease all behavioral tracking and deactivate the chat interface on your storefront."
          onConfirm={() => { }}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default IntegrationsHub;