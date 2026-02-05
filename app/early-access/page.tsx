"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, ArrowRight, Zap, Target, Loader2 } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

// Reusable Button Component
const PrimaryButton = ({ children, onClick, className = "", disabled = false, loading = false }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : children}
  </button>
);

// Reusable Section Component
const Section = ({ children, className = "" }: any) => (
  <section className={`max-w-4xl mx-auto px-6 py-16 ${className}`}>
    {children}
  </section>
);

const EarlyOnboarding = () => {
  const router = useRouter();
  const { callApi } = UseAPI();
  const { addToast } = useAppContext();

  const [accessCode, setAccessCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!accessCode.trim()) {
      addToast("Please enter your invitation code.", "error");
      return;
    }

    setIsVerifying(true);
    try {
      // ⚡️ Calling the endpoint we brainstormed
      const res = await callApi("/verify-code", "POST", {
        code: accessCode.trim()
      });

      if (res.valid) {
        addToast("Identity verified. Welcome Founder.", "success");

        // ⚡️ Persist for the next steps in onboarding
        sessionStorage.setItem("cliva_access_code", accessCode.trim());
        sessionStorage.setItem("cliva_assigned_plan", res.plan);

        // Redirect to the founding member registration flow
        router.push(`/early-access/onboarding/connect-store?code=${accessCode.trim()}&plan=${res.plan}`);
      } else {
        addToast(res.message || "Invalid access code.", "error");
      }
    } catch (err: any) {
      addToast(err.message || "Connection to neural network failed.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-neutral-200 selection:bg-[#A500FF]/30 font-sans">

      {/* 1. Hero Section */}
      <Section className="text-center pt-24 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
          <Sparkles size={14} className="text-[#A500FF]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Founding Tester Program
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 italic uppercase">
          Welcome to <span className="text-[#A500FF]">Cliva</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          This is an intentional space for a small group of store owners.
          Access is limited, private, and focused on thoughtful growth.
        </p>
      </Section>

      {/* 2. What Cliva Does */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Target size={20} />, text: "Helps customers decide faster" },
            { icon: <ShieldCheck size={20} />, text: "Reduces hesitation during shopping" },
            { icon: <Zap size={20} />, text: "Turns conversations into conversions" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="mb-4 p-3 rounded-2xl bg-white/5 text-[#00A7FF]">{item.icon}</div>
              <p className="font-medium text-neutral-300">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Early User Benefits */}
      <Section className="bg-white/[0.01] rounded-[3rem] border border-white/5 my-12 py-12">
        <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500 mb-10 text-center">
          Founding Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-8">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A500FF]" />
              Priority Influence
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Founding testers have a direct line to our engineers. Your feedback shapes the product direction and feature roadmap.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A7FF]" />
              Legacy Advantage
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Unlock exclusive "Founding Member" pricing that remains locked in even as Cliva grows and expands globally.
            </p>
          </div>
        </div>
      </Section>

      {/* 4. Access Code Section */}
      <Section className="text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Enter your access code
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-xl font-mono text-white outline-none focus:border-[#A500FF]/50 transition-all placeholder:text-neutral-700"
            />
          </div>

          <PrimaryButton
            className="w-full"
            onClick={handleVerify}
            loading={isVerifying}
          >
            Unlock Early Access <ArrowRight size={18} />
          </PrimaryButton>

          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tighter">
            Access codes are invite-only and non-transferable
          </p>
        </div>
      </Section>

      {/* 5. What Happens Next */}
      <Section className="border-t border-white/5 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {[
            { step: "01", title: "Setup", desc: "Define your store parameters and brand voice." },
            { step: "02", title: "Deploy", desc: "Inject Cliva's pulse into your storefront seamlessly." },
            { step: "03", title: "Scale", desc: "Cliva begins sales assistance within safe limits." },
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <span className="text-[10px] font-black text-[#A500FF] bg-[#A500FF]/10 px-2 py-1 rounded">
                STEP {item.step}
              </span>
              <h4 className="text-white font-bold">{item.title}</h4>
              <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center border-t border-white/5 gap-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-xs text-neutral-600 font-medium">
            Cliva — built for thoughtful growth
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EarlyOnboarding;