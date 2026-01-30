"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle, ShoppingCart, Globe, MessageSquare,
  RefreshCw, Copy, Terminal, Monitor, Layout, ArrowRight
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
  const { user, addToast } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [syncStatus, setSyncStatus] = useState<"waiting" | "verified">(
    user?.store?.is_authorized ? "verified" : "waiting"
  );

  const userPlatform = user?.store?.platform?.toUpperCase();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`ws://localhost:8000?type=dashboard&token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEURAL_LINK_ESTABLISHED") {
        setSyncStatus("verified");
        addToast("Neural Link established with Shopify!", "success");
      }
    };

    ws.onerror = () => {
      console.warn("WebSocket Connection failed. Ensure backend is live.");
    };

    return () => ws.close();
  }, [addToast, user?.store?.is_authorized]);

  const snippetCode = `
    <script>
      (function(c,l,i,v,a){
        a=l.createElement(i);a.async=1;a.src=v;
        a.setAttribute('data-cliva-id', '${user?.store?.snippetToken || "cliva_test_store_001"}');
        l.head.appendChild(a);
      })(window, document, 'script', 'https://akira-backend-vklc.onrender.com/pulse.mjs');
    </script>
  `;

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
          const isActuallyConnected = !isLocked && (app.status === "connected" || syncStatus === "verified");

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
                {isActuallyConnected && <CheckCircle className="text-emerald-500 animate-in zoom-in" size={18} />}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">{app.details}</p>
              <div className={`text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-lg text-center
                ${isLocked ? 'bg-white/5 text-gray-500' : 'bg-[#A500FF]/10 text-[#A500FF] border border-[#A500FF]/20'}`}>
                {isLocked ? "Bridge Locked" : (syncStatus === "verified" ? "Connected" : "System Active")}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. PERMANENT SETUP GUIDE */}
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
            </section>
          </div>

          {/* Right Column: Visual Previews */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Implementation Map</h4>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A500FF]" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
              </div>
            </div>

            {/* STEP-BY-STEP IMAGE MAP */}
            <div className="grid grid-cols-1 gap-4">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black group">
                <img
                  src="https://cliva.ai/assets/help/step1.png"
                  alt="Navigate to Theme Settings"
                  className="w-full aspect-[16/7] object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <span className="bg-[#A500FF] text-white text-[10px] font-black px-2 py-1 rounded">STEP 1</span>
                  <p className="text-xs font-bold text-white shadow-sm">Navigate to Theme Settings</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="text-gray-800 rotate-90 lg:rotate-0" size={20} />
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black group">
                <img
                  src="https://cliva.ai/assets/help/step2.png"
                  alt="Locate Head Tag"
                  className="w-full aspect-[16/7] object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <span className="bg-[#00A7FF] text-white text-[10px] font-black px-2 py-1 rounded">STEP 2</span>
                  <p className="text-xs font-bold text-white shadow-sm">Locate the &lt;head&gt; Tag</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="text-gray-800 rotate-90 lg:rotate-0" size={20} />
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-[#A500FF]/30 bg-black group ring-1 ring-[#A500FF]/20">
                <img
                  src="https://cliva.ai/assets/help/step3.png"
                  alt="Paste Snippet"
                  className="w-full aspect-[16/7] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded">FINAL</span>
                  <p className="text-xs font-bold text-white shadow-sm">Paste Pulse Snippet</p>
                </div>
              </div>
            </div>

            {/* LIVE STATUS TRACKER */}
            <div className="p-8 rounded-3xl bg-black border border-white/5 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${syncStatus === 'verified' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                {syncStatus === 'verified' ? (
                  <CheckCircle className="text-emerald-500 animate-in zoom-in" size={24} />
                ) : (
                  <RefreshCw className="text-amber-500 animate-spin-slow" size={24} />
                )}
              </div>

              <h5 className="text-white font-bold text-sm">
                {syncStatus === 'verified' ? "Neural Link Active" : "Neural Sync Status"}
              </h5>

              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">
                {syncStatus === 'verified' ? "Synchronization Complete" : "Waiting for Pulse Heartbeat..."}
              </p>

              <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ease-out ${syncStatus === 'verified' ? 'w-full bg-emerald-500' : 'w-1/3 bg-amber-500 animate-pulse'}`} />
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