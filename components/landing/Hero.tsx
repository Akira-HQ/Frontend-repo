"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  RefreshCw,
  Layers,
  Zap,
  TrendingUp,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../Button";
import Link from "next/link";

interface InspiredHeroSectionProps {
  onCtaAction: (message: string) => void;
}

// --- ⚡️ Premium Motion Variants (Self-Contained) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] },
  },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const TagPill: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    variants={itemVariants}
    className="inline-block py-1 px-3 mb-4 rounded-full text-xs font-medium uppercase tracking-widest text-[#9370DB] bg-[#9370DB]/20 border border-[#9370DB]/30 backdrop-blur-sm"
  >
    {text}
  </motion.div>
);

const customStyles = `
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.4; }
}
.animate-pulse-slow { animation: pulse-slow 8s infinite alternate ease-in-out; }
.animate-pulse-slow-reverse { animation: pulse-slow 8s infinite alternate-reverse ease-in-out; }
.bg-radial-gradient-purple { background: radial-gradient(circle at center, rgba(165, 0, 255, 0.1), transparent 50%); }
`;

export const HeroSection: React.FC<InspiredHeroSectionProps> = ({ onCtaAction }) => {
  return (
    <section
      id="hero"
      className="relative pt-24 pb-40 px-4 text-center overflow-hidden min-h-[80vh] bg-[#08090a]"
    >
      <style>{customStyles}</style>

      {/* 1. Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow-reverse"></div>
        <div className="absolute inset-0 bg-radial-gradient-purple opacity-20"></div>
      </div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        <TagPill text="✨ AI Sales Manager" />

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white"
        >
          CLIVA: Your Personal
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A500FF] to-[#FFB300] ml-3">
            AI Sales Manager.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
        >
          Cliva is an intelligent, automated assistant that engages customers,
          proactively interacts with customers, and drives sales for your
          e-commerce business.
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-center space-x-4 mb-20">
          <PrimaryButton onClick={() => onCtaAction("Free")}>
            Start Free Trial
          </PrimaryButton>
          <SecondaryButton>
            <Link href={'#pricing'}>See Plans</Link>
          </SecondaryButton>
        </motion.div>
      </motion.div>

      {/* 2. Dashboard Mockup Panels */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Panel 1 */}
        <motion.div
          variants={panelVariants}
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-orange-900/40 text-left"
        >
          <h3 className="text-xl font-bold text-[#FFB300] mb-3">What Cliva Really Does</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Cliva works like a <span className="text-white font-semibold">24/7 sales manager</span> for your online store.
            It recommendations products, handles objections, and follows up — automatically.
          </p>
          <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
            <Zap className="w-5 h-5 text-[#FFB300] shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Always available</p>
              <p className="text-xs text-gray-400">Engages customers instantly, anytime.</p>
            </div>
          </div>
        </motion.div>

        {/* Panel 2 */}
        <motion.div
          variants={panelVariants}
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-purple-900/40 text-left"
        >
          <h3 className="text-xl font-bold text-[#A500FF] mb-3">Cliva in Real Action</h3>
          <div className="space-y-4">
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-[#A500FF]/50 text-white rounded-2xl rounded-br-none text-sm">
                Does this dress come in size XL?
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-2xl rounded-tl-none text-sm leading-relaxed">
                Yes, it does! 🎉 <br />
                We have XL in red and midnight blue.
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-3">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>Intent identified: Conversion path created.</span>
            </div>
          </div>
        </motion.div>

        {/* Panel 3 — WITH CONVERSION ANIMATION */}
        <motion.div
          variants={panelVariants}
          whileHover={{ y: -5 }}
          className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-indigo-900/40 text-left"
        >
          <h3 className="text-xl font-bold text-[#7F00FF] mb-3">How It Grows Your Business</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            Cliva learns what customers like and what makes them hesitate — then improves automatically.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
              <Layers className="w-5 h-5 text-[#7F00FF] shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold text-xs">Smarter every day</p>
                <div className="mt-2 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-[#7F00FF]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-green-400 shrink-0 mt-1" />
              <div>
                <p className="text-white font-semibold text-xs">Higher conversions</p>
                <div className="mt-2 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-green-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};