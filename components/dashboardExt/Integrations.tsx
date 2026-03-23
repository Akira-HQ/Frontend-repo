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
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shopify Implementation Map</h4>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'verified' ? 'bg-emerald-500' : 'bg-[#A500FF] animate-pulse'}`} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
              </div>
            </div>

            {/* STEP-BY-STEP VISUAL GUIDE */}
            <div className="space-y-6">
              {/* STEP 1 */}
              <div className="group relative rounded-3xl overflow-hidden border border-white/5 bg-[#050505] transition-all hover:border-white/20">
                <div className="p-4 flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">01</span>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-tight text-white">Enter Theme Editor</h5>
                    <p className="text-[10px] text-gray-500 mt-1">Go to <span className="text-zinc-300">Online Store &gt; Themes</span>. Click the <span className="text-zinc-300">"..."</span> button and select <span className="text-[#00A7FF]">Edit Code</span>.</p>
                  </div>
                </div>
                <div className="relative aspect-[16/8] bg-zinc-900/50">
                  <img
                    src="/theme_setting_shop_4.png"
                    alt="Shopify Edit Code"
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
              </div>

              {/* STEP 2 */}
              <div className="group relative rounded-3xl overflow-hidden border border-white/5 bg-[#050505] transition-all hover:border-white/20">
                <div className="p-4 flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">02</span>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-tight text-white">Locate Layout File</h5>
                    <p className="text-[10px] text-gray-500 mt-1">Under the <span className="text-zinc-300">Layout</span> folder, click on <span className="text-[#A500FF]">theme.liquid</span>. This is your site's master template.</p>
                  </div>
                </div>
                <div className="relative aspect-[16/6] bg-zinc-900/50">
                  <img
                    src="/theme_setting_Shop_5.png"
                    alt="Theme Liquid File"
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
              </div>

              {/* STEP 3 */}
              <div className="group relative rounded-3xl overflow-hidden border border-[#A500FF]/30 bg-[#050505] shadow-[0_0_30px_-10px_rgba(165,0,255,0.2)]">
                <div className="p-4 flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#A500FF] flex items-center justify-center text-[10px] font-black text-white">03</span>
                  <div>
                    <h5 className="text-xs uppercase tracking-tight text-white font-bold">Injection & Save</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Scroll to the bottom, find the <span className="text-amber-500">{"</head>"}</span> tag, and paste the snippet above it. Click <span className="text-emerald-500">Save</span>.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE STATUS TRACKER (Modified to be more compact) */}
            <div className="p-6 rounded-[2rem] bg-black border border-white/5 flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${syncStatus === 'verified' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                {syncStatus === 'verified' ? (
                  <CheckCircle className="text-emerald-500 animate-in zoom-in" size={20} />
                ) : (
                  <RefreshCw className="text-amber-500 animate-spin-slow" size={20} />
                )}
              </div>
              <div className="flex-1">
                <h5 className="text-white font-bold text-xs">
                  {syncStatus === 'verified' ? "Neural Link Established" : "Listening for Pulse..."}
                </h5>
                <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ease-out ${syncStatus === 'verified' ? 'w-full bg-emerald-500' : 'w-1/3 bg-amber-500 animate-pulse'}`} />
                </div>
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