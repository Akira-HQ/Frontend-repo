"use client";
import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Cpu,
  MessageSquare,
  ShieldCheck,
  Zap,
  LifeBuoy,
  ArrowRight,
  ArrowLeft,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useAppContext } from "@/components/AppContext";

// --- SUB-PAGE COMPONENTS ---

const NeuralSetupView = ({ token }: { token: string }) => {
  const [copied, setCopied] = useState(false);
  const snippet = `<script src="https://cliva.ai/neural-link.js" data-token="${token}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-3xl font-black uppercase italic mb-4">Neural <span className="text-[#A500FF]">Link</span> Integration</h2>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
          Inject the Cliva Neural Link into your store's architecture to enable autonomous behavioral tracking and real-time negotiation.
        </p>
      </section>

      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Universal Snippet</h3>
          {copied && <span className="text-[10px] text-green-500 font-bold flex items-center gap-1 animate-pulse"><CheckCircle2 size={12} /> Copied to clipboard</span>}
        </div>
        <div className="relative">
          <code className="block bg-black/60 p-5 rounded-xl text-[#00A7FF] text-xs font-mono break-all border border-white/5 leading-loose">
            {snippet}
          </code>
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
          >
            <Copy size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-[#A500FF]/20 flex items-center justify-center text-[#A500FF] font-black text-xs mb-4">01</div>
          <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Shopify Setup</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Navigate to Online Store {`>`} Themes {`>`} Edit Code. Locate theme.liquid and paste the snippet immediately before the closing {`</head>`} tag.</p>
        </div>
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-[#00A7FF]/20 flex items-center justify-center text-[#00A7FF] font-black text-xs mb-4">02</div>
          <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">Heartbeat Verification</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Refresh your storefront and check the Cliva Analytics Dashboard. The "Live Link" status will pulse green upon successful handshake.</p>
        </div>
      </div>
    </div>
  );
};

const BrandPersonaView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="p-8 bg-gradient-to-br from-[#A500FF]/10 to-transparent border border-[#A500FF]/20 rounded-3xl">
      <h2 className="text-3xl font-black uppercase italic mb-2">Persona <span className="text-[#A500FF]">Engineering</span></h2>
      <p className="text-sm text-gray-400">Refine Cliva's neural weightings to match your brand's unique linguistic fingerprint.</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {[
        { label: "Sales Aggression", detail: "Determines how frequently Cliva offers discounts or scarcity prompts.", icon: Zap },
        { label: "Linguistic Tone", detail: "Switch between Professional, Casual, or High-Energy enthusiasm.", icon: MessageSquare },
        { label: "Knowledge Depth", detail: "How deep into technical specs Cliva should go before a handoff.", icon: Cpu }
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-6 p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
          <div className="p-3 bg-white/5 rounded-xl text-gray-400"><item.icon size={20} /></div>
          <div>
            <span className="text-sm font-bold block mb-1 uppercase tracking-tighter">{item.label}</span>
            <span className="text-xs text-gray-500 leading-relaxed">{item.detail}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SalesActionsView = () => (
  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
    <header>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Conversion <span className="text-[#FFB300]">Logic</span></h2>
      <p className="text-sm text-gray-500 mt-2">The underlying event-action mapping that drives your store's revenue.</p>
    </header>

    <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-white/[0.01]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Active Trigger Map</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
            <tr>
              <th className="px-8 py-5">Customer Input</th>
              <th className="px-8 py-5">Neural Interpretation</th>
              <th className="px-8 py-5">Cliva Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="px-8 py-6 font-bold italic text-white">"Is this available?"</td>
              <td className="px-8 py-6 text-gray-500">Inventory Status Check</td>
              <td className="px-8 py-6 text-[#00A7FF] font-medium">Product RAG Query</td>
            </tr>
            <tr>
              <td className="px-8 py-6 font-bold italic text-white">"I'll take it"</td>
              <td className="px-8 py-6 text-gray-500">Purchase Intent (High)</td>
              <td className="px-8 py-6 text-[#FFB300] font-medium">Trigger ADD_TO_CART</td>
            </tr>
            <tr>
              <td className="px-8 py-6 font-bold italic text-white">"Too expensive"</td>
              <td className="px-8 py-6 text-gray-500">Price Friction Detected</td>
              <td className="px-8 py-6 text-[#A500FF] font-medium">Dynamic Discount Offer</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

const HelpCenter = () => {
  const { user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);

  const modules = [
    { title: "Neural Setup", desc: "Integrate Cliva into Shopify/Wix using the snippet token.", icon: Cpu, color: "#A500FF" },
    { title: "Brand Persona", desc: "Train Cliva's voice and personality for your store.", icon: MessageSquare, color: "#00A7FF" },
    { title: "Sales Actions", desc: "Configuring ADD_TO_CART and checkout triggers.", icon: Zap, color: "#FFB300" },
    { title: "Quota Logic", desc: "Understanding audits, enhancements, and insights.", icon: ShieldCheck, color: "#10b981" },
    { title: "API Reference", desc: "Deep dive into the Neural Link technical documentation.", icon: BookOpen, color: "#6b7280" },
    { title: "Direct Support", desc: "Open a priority ticket with our engineering team.", icon: LifeBuoy, color: "#FF4D4D" },
  ];

  return (
    <div className="help-center-container py-8 px-6 w-full h-full text-white relative overflow-y-auto bg-[#0b0b0b]">
      <style jsx global>{`
        .help-center-container::-webkit-scrollbar { width: 4px; }
        .help-center-container::-webkit-scrollbar-track { background: #050505; }
        .help-center-container::-webkit-scrollbar-thumb { background: #A500FF; border-radius: 10px; }
      `}</style>

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#A500FF]/5 blur-[120px] -z-10 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {activeSubPage ? (
          <div className="w-full flex items-center justify-between mb-12 animate-in fade-in slide-in-from-left-4">
            <button
              onClick={() => setActiveSubPage(null)}
              className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
            >
              <ArrowLeft size={14} /> Back to Intel Hub
            </button>
            <div className="text-right">
              <span className="text-[10px] font-black text-[#A500FF] uppercase tracking-[0.3em]">Documentation</span>
              <p className="text-lg font-black italic uppercase tracking-tighter">{activeSubPage}</p>
            </div>
          </div>
        ) : (
          <header className="max-w-4xl text-center mt-10 mb-16 animate-in fade-in slide-in-from-top-4">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-6">
              How can we <span className="text-[#A500FF]">Optimize</span> Cliva?
            </h1>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#A500FF] to-[#00A7FF] rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#0b0b0b] border border-white/10 rounded-2xl p-2 overflow-hidden shadow-2xl">
                <Search className="ml-4 text-gray-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Ask the Knowledge Base..."
                  className="w-full bg-transparent py-4 px-4 outline-none text-lg placeholder:text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-[#A500FF] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#8e00db] transition-all">
                  Analyze
                </button>
              </div>
            </div>
          </header>
        )}

        {/* CONTENT SWITCHER */}
        <main className="w-full max-w-6xl">
          {!activeSubPage ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-in fade-in zoom-in-95">
                {modules.map((mod, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveSubPage(mod.title)}
                    className="group p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-[#A500FF]/50 transition-all hover:bg-white/[0.04] cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 group-hover:scale-110"
                      style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                    >
                      <mod.icon size={24} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-widest italic mb-2">{mod.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">{mod.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#A500FF]">
                      Open Module <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* NEWS & HEALTH (Only visible on main page) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20 animate-in fade-in slide-in-from-bottom-8">
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-xl font-black italic uppercase tracking-widest mb-8 text-gray-400">System Logs</h3>
                  <div className="space-y-8">
                    {[
                      { v: "2.4.1", t: "Intent Engine Update", d: "RAG processing now handles 25% higher concurrency without latency spikes." },
                      { v: "2.3.9", t: "Shopify Oauth Security", d: "Hardened HMAC validation for store sync endpoints." }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-6 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="text-[10px] font-black text-[#A500FF] px-2 py-1 h-fit bg-[#A500FF]/10 rounded border border-[#A500FF]/20 tracking-widest">v{log.v}</div>
                        <div>
                          <h4 className="text-md font-bold text-white mb-2">{log.t}</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">{log.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="p-8 bg-gradient-to-br from-[#00A7FF]/20 to-transparent border border-[#00A7FF]/20 rounded-3xl">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-[#00A7FF]">Strategic Insight</h4>
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                      "Integrating checkout triggers directly into conversational threads increases impulse conversion by up to 18.5%."
                    </p>
                  </div>

                  <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Neural Health</span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Nominal</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">API Latency</span>
                        <span className="font-mono text-[#00A7FF]">42ms</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Token Quota</span>
                        <span className="font-mono text-green-500">Stable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="pb-20">
              {activeSubPage === "Neural Setup" && <NeuralSetupView token={user?.store?.snippetToken || "AUTH_TOKEN_PENDING"} />}
              {activeSubPage === "Brand Persona" && <BrandPersonaView />}
              {activeSubPage === "Sales Actions" && <SalesActionsView />}
              {/* Fallback for sections not yet fully built */}
              {!["Neural Setup", "Brand Persona", "Sales Actions"].includes(activeSubPage) && (
                <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                  <p className="text-gray-500 text-sm italic font-medium uppercase tracking-widest">Detailed blueprints for "{activeSubPage}" are being compiled by the Neural Brain.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HelpCenter;