"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

const NEON_GRADIENT = "bg-gradient-to-br from-[#A500FF] to-[#FFB300]";

type PricingCardProps = {
  title: string;
  price: string;
  description?: string;
  features: string[];
  isFeatured: boolean;
  onCTAAction: (planName: string) => void;
  monthly: boolean;
};

// --- ⚡️ Premium Toggle with Layout Animations ---
export const PricingToggle: React.FC<{
  monthly: boolean;
  setMonthly: (m: boolean) => void;
}> = ({ monthly, setMonthly }) => (
  <div className="flex justify-center items-center mb-16 select-none scale-90 sm:scale-100">
    <span className={`mr-4 font-bold text-lg transition-all duration-300 ${!monthly ? "text-white" : "text-gray-600"}`}>
      Yearly <span className="text-[#FFB300] text-xs ml-1 bg-[#FFB300]/10 px-2 py-0.5 rounded-full border border-[#FFB300]/20">-20%</span>
    </span>
    <button
      onClick={() => setMonthly(!monthly)}
      className="relative flex items-center h-10 w-20 p-1.5 rounded-full bg-white/5 border border-white/10 transition-all duration-500 hover:border-white/20"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`h-full aspect-square rounded-full shadow-lg ${monthly ? "bg-gray-400" : "bg-[#A500FF] shadow-[0_0_20px_rgba(165,0,255,0.6)]"}`}
        style={{ x: monthly ? 0 : 40 }}
      />
    </button>
    <span className={`ml-4 font-bold text-lg transition-all duration-300 ${monthly ? "text-white" : "text-gray-600"}`}>
      Monthly
    </span>
  </div>
);

// --- ⚡️ Viewport-Aware Pricing Card ---
export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isFeatured,
  onCTAAction,
  monthly,
}) => {
  const glowColor = isFeatured ? "from-[#A500FF]/40" : "from-[#FFB300]/20";
  const borderColor = isFeatured ? "border-[#A500FF]" : "border-white/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -8 }}
      className={`relative flex flex-col h-full bg-[#0d0d0d]/60 backdrop-blur-3xl rounded-[2.5rem] border ${borderColor} transition-all duration-500 group overflow-hidden shadow-2xl hover:bg-[#0d0d0d]/80`}
    >
      {/* Neural Glow Background */}
      <div className={`absolute top-0 left-0 w-full h-80 bg-gradient-to-b ${glowColor} to-transparent opacity-10 group-hover:opacity-30 transition-opacity duration-1000`} />

      <div className="relative z-10 p-10 flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{title}</h3>
            {isFeatured && (
              <div className="flex items-center gap-1.5 bg-[#A500FF] text-white text-[9px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(165,0,255,0.4)] animate-pulse tracking-widest">
                <Sparkles size={10} /> RECOMMENDED
              </div>
            )}
          </div>
          <p className="text-gray-500 text-[13px] font-medium leading-relaxed min-h-[40px]">{description}</p>
        </div>

        {/* Price Section with AnimatePresence for smooth value switching */}
        <div className="mb-10 p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 text-center relative overflow-hidden group-hover:border-white/10 transition-colors">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black text-white tracking-tighter">
              <AnimatePresence mode="wait">
                <motion.span
                  key={price}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {title === "Free" ? "$0" : price}
                </motion.span>
              </AnimatePresence>
            </span>
            {title !== "Free" && (
              <span className="text-gray-600 font-bold text-sm uppercase tracking-widest">/mo</span>
            )}
          </div>
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-3">
            {title === "Free" ? "No strings attached" : monthly ? "Standard Rate" : "Annual Discount Applied"}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onCTAAction(title)}
          className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 mb-12 ${NEON_GRADIENT} text-white shadow-[0_10px_30px_rgba(165,0,255,0.2)] hover:shadow-[0_10px_40px_rgba(165,0,255,0.4)] hover:scale-[1.02] active:scale-95`}
        >
          {title === "Free" ? "Start Free Trial" : "Join the Waitlist"}
        </button>

        {/* Features Grid */}
        <div className="mt-auto">
          <div className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
            <div className="h-px flex-grow bg-white/5" />
            Capabilities
            <div className="h-px flex-grow bg-white/5" />
          </div>

          <ul className="space-y-5">
            {features && features.length > 0 ? (
              features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 1, x: 4 }}
                  className="flex items-start gap-4 group/item transition-all"
                >
                  <CheckCircle className="w-4 h-4 text-[#A500FF] shrink-0 mt-0.5 group-hover/item:shadow-[0_0_10px_#A500FF] rounded-full transition-all" />
                  <span className="text-[13px] text-gray-500 font-medium group-hover/item:text-gray-200 transition-colors leading-snug">
                    {feature}
                  </span>
                </motion.li>
              ))
            ) : (
              <li className="text-[11px] text-gray-600 italic text-center py-6 bg-white/[0.02] rounded-2xl border border-dashed border-white/5">
                Strategic <span className="text-gray-400 font-bold">{title}</span> features <br />
                unlocked at launch.
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};