import React, { ReactNode } from 'react';
import { Play, Sparkles, LineChart, Target, Zap, ChevronRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { LandingChat } from '@/components/chatTools/ChatWindow';

/**
 * REUSABLE COMPONENTS
 */

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  isHero?: boolean;
}

const Section = ({ title, subtitle, children, className = "", isHero = false }: SectionProps) => (
  <section className={`w-full max-w-6xl mx-auto px-6 py-16 md:py-24 ${className}`}>
    <div className={`flex flex-col ${isHero ? 'items-center text-center mb-12' : 'items-start mb-10'}`}>
      <h2 className={`${isHero ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'} font-bold tracking-tight text-white mb-4 uppercase italic tracking-tighter`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-zinc-400 max-w-2xl leading-relaxed ${isHero ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
);

const VideoBlock = ({ src, poster }: { src: string; poster?: string }) => (
  <div className="relative group w-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900/50 shadow-2xl transition-all duration-500 hover:border-[#A500FF]/50">
    <div className="absolute inset-0 bg-gradient-to-tr from-[#A500FF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <video
      src={src}
      poster={poster}
      className="w-full h-auto aspect-video object-cover"
      controls
      muted
      playsInline
    />
    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] uppercase tracking-widest font-bold text-white">Neural Link Active</span>
    </div>
  </div>
);

/**
 * MAIN PAGE COMPONENT
 */

export default function ClivaDemoPage() {
  const GITHUB_BASE = "https://raw.githubusercontent.com/Akira-HQ/Frontend-repo/main/public/demo-video";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 font-sans selection:bg-[#A500FF]/30">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-[#A500FF]/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-[#00A7FF]/5 blur-[100px] rounded-full" />
      </div>

      {/* HERO */}
      <Section
        isHero
        title="See Cliva in Action"
        subtitle="The autonomous sales concierge that turns store visitors into loyal customers through real-time neural intelligence."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <a href='/waitlist' className="px-8 py-4 rounded-full bg-[#A500FF] hover:bg-[#B622FF] text-white font-bold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-[#A500FF]/20 uppercase italic tracking-tighter">
            Get Started <ChevronRight size={18} />
          </a>
          <a href='mailto:clivaaiofficial@gmail.com' className="px-8 py-4 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold transition-all uppercase italic tracking-tighter">
            Contact Sales
          </a>
        </div>
      </Section>

      {/* 1. STORE CHATBOT GUIDANCE (RETAINED) */}
      <Section
        title="How Cliva Works in Your Store"
        subtitle="Cliva guides visitors in real-time, helps them find products faster, and improves buying decisions by understanding customer intent."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <VideoBlock src={`${GITHUB_BASE}/storechat.mp4`} />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#A500FF]/30 transition-all">
              <div className="mt-1 p-2 rounded-lg bg-[#A500FF]/20 text-[#A500FF]">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic">Instant Engagement</h4>
                <p className="text-sm text-zinc-400">Zero latency responses tailored to the specific product or section the user is currently viewing.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#00A7FF]/30 transition-all">
              <div className="mt-1 p-2 rounded-lg bg-[#00A7FF]/20 text-[#00A7FF]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic">Section-Aware Guidance</h4>
                <p className="text-sm text-zinc-400">Visitors can ask about store strength or specific needs based on their current location in the shop.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. PRODUCT INTELLIGENCE (NEW) */}
      <Section
        title="Autonomous Product Auditing"
        subtitle="Cliva analyzes your product data to provide deep intelligence, identifying strict health scores, unique strengths, and critical weaknesses."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:order-2 lg:col-span-7">
            <VideoBlock src={`${GITHUB_BASE}/product-intelligence.mp4`} />
          </div>
          <div className="lg:order-1 lg:col-span-5 space-y-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#A500FF]/30 transition-all">
              <div className="mt-1 p-2 rounded-lg bg-[#A500FF]/20 text-[#A500FF]">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic">Deep AI Analysis</h4>
                <p className="text-sm text-zinc-400">See exactly why a high-end customer would or wouldn't buy based on psychological triggers and CRO standards.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. FIX POINT TECHNOLOGY (NEW) */}
      <Section
        title="Revenue Optimization"
        subtitle="Leverage the 'Fix Point' feature to let Cliva rewrite descriptions and optimize metadata, instantly improving your product's health and sales potential."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <VideoBlock src={`${GITHUB_BASE}/product-enhance.mp4`} />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="mt-1 p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                <Target size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic">Automated Enhancement</h4>
                <p className="text-sm text-zinc-400">Watch your health scores and strengths increase as Cliva removes conversion friction automatically with one click.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. DASHBOARD INBOX (NEW) */}
      <Section
        title="Neural Dashboard Insights"
        subtitle="Monitor every customer interaction through the Cliva Inbox. Track session alerts, high-intent behaviors, and live chat transcripts."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:order-2 lg:col-span-7">
            <VideoBlock src={`${GITHUB_BASE}/dashboard-insight.mp4`} />
          </div>
          <div className="lg:order-1 lg:col-span-5 space-y-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#00A7FF]/30 transition-all">
              <div className="mt-1 p-2 rounded-lg bg-[#00A7FF]/20 text-[#00A7FF]">
                <LineChart size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic">Live Behavior Tracking</h4>
                <p className="text-sm text-zinc-400">Stay connected to your store's pulse with real-time updates on active chats and AI sales influence.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#A500FF]/30 transition-all">
              <div className="mt-1 p-2 rounded-lg bg-[#A500FF]/20 text-[#A500FF]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-tight italic">Sales Intent Alerts</h4>
                <p className="text-sm text-zinc-400">Get notified immediately when Cliva identifies a visitor with high purchasing intent or an abandoned cart risk.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <LandingChat />

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A500FF] to-[#00A7FF]" />
            <span className="font-black text-xl tracking-tighter uppercase italic tracking-tighter">Cliva</span>
          </div>
          <p className="text-zinc-500 text-sm italic tracking-tighter">&copy; {new Date().getFullYear()} CLIVA AI NEURAL SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}