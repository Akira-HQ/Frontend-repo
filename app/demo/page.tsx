import React, { ReactNode } from 'react';
import { Play, Sparkles, LineChart, Target, Zap, Lock, ChevronRight } from 'lucide-react';
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
      <h2 className={`${isHero ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'} font-bold tracking-tight text-white mb-4`}>
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
      <span className="text-[10px] uppercase tracking-widest font-bold text-white">Live Demo</span>
    </div>
  </div>
);

const ComingSoon = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="relative w-full p-8 md:p-12 rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 flex flex-col items-center justify-center text-center overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A500FF]/5 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000" />

    <div className="relative mb-6 p-4 rounded-full bg-zinc-800/50 border border-white/5 text-zinc-500">
      <Icon size={32} />
      <div className="absolute inset-0 rounded-full border border-[#A500FF]/20 animate-ping" />
    </div>

    <h3 className="relative text-xl font-semibold text-zinc-300 mb-6">{title}</h3>

    <div className="relative w-full max-w-md space-y-4">
      {/* SKELETON UI */}
      <div className="h-4 w-3/4 bg-zinc-800/50 rounded-full mx-auto animate-pulse" />
      <div className="h-4 w-1/2 bg-zinc-800/50 rounded-full mx-auto animate-pulse delay-75" />
      <div className="pt-4 flex justify-center gap-4">
        <div className="h-8 w-24 bg-zinc-800/50 rounded-lg animate-pulse" />
        <div className="h-8 w-24 bg-zinc-800/50 rounded-lg animate-pulse delay-150" />
      </div>
    </div>

    <div className="mt-8 px-4 py-1.5 rounded-full bg-[#A500FF]/10 border border-[#A500FF]/20">
      <span className="text-xs font-bold text-[#A500FF] uppercase tracking-widest flex items-center gap-2">
        <Lock size={12} /> Neural Processing Soon
      </span>
    </div>
  </div>
);

/**
 * MAIN PAGE COMPONENT
 */

export default function ClivaDemoPage() {
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
          <a href='/waitlist' className="px-8 py-4 rounded-full bg-[#A500FF] hover:bg-[#B622FF] text-white font-bold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-[#A500FF]/20">
            Get Started <ChevronRight size={18} />
          </a>
          <a href='mailto:clivaaiofficial@gmail.com' className="px-8 py-4 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold transition-all">
            Contact Sales
          </a>
        </div>
      </Section>

      {/* MAIN DEMO SECTION */}
      <Section
        title="How Cliva Works in Your Store"
        subtitle="Cliva guides visitors in real-time, helps them find products faster, and improves buying decisions by understanding intent."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <VideoBlock src="https://github.com/Akira-HQ/Frontend-repo/raw/refs/heads/main/public/demo-video/storechat.mp4" />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
              <div className="mt-1 p-2 rounded-lg bg-[#A500FF]/20 text-[#A500FF]">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Instant Engagement</h4>
                <p className="text-sm text-zinc-400">Zero latency responses tailored to the specific product the user is viewing.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
              <div className="mt-1 p-2 rounded-lg bg-[#00A7FF]/20 text-[#00A7FF]">
                <Play size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Guided Checkout</h4>
                <p className="text-sm text-zinc-400">Proactively suggests next steps, sizes, and bundles based on cart data.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* COMING SOON GRID */}
      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 ml-2">
            <Sparkles size={20} className="text-[#A500FF]" /> Product Intelligence
          </h3>
          <ComingSoon
            icon={Sparkles}
            title="How Cliva Understands Your Products"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 ml-2">
            <LineChart size={20} className="text-[#A500FF]" /> Behavioral Data
          </h3>
          <ComingSoon
            icon={LineChart}
            title="How Cliva Gives You Insights"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 ml-2">
            <Target size={20} className="text-[#A500FF]" /> Revenue Optimization
          </h3>
          <ComingSoon
            icon={Target}
            title="Optimize for Conversions"
          />
        </div>

      </div>
          <LandingChat />

      {/* FOOTER CTA */}
      <footer className="border-t border-white/5 py-12 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A500FF] to-[#00A7FF]" />
            <span className="font-black text-xl tracking-tighter uppercase">Cliva</span>
          </div>
          <p className="text-zinc-500 text-sm">&copy; {new Date().getFullYear()} Cliva. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div> 
      </footer>
    </div>
  );
}