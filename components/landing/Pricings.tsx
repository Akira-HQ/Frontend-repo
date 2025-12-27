"use client";
import React from "react";
import { CheckCircle, Sparkles } from "lucide-react";

const NEON_GRADIENT = "bg-gradient-to-br from-[#A500FF] to-[#FFB300]";

type PricingCardProps = {
  title: string;
  price: string;
  description?: string;
  features: string[];
  isFeatured: boolean;
  onCTA: (planName: string) => void;
  monthly: boolean;
};

export const PricingToggle: React.FC<{
  monthly: boolean;
  setMonthly: (m: boolean) => void;
}> = ({ monthly, setMonthly }) => (
  <div className="flex justify-center items-center mb-16 select-none scale-90 sm:scale-100">
    <span className={`mr-4 font-bold text-lg transition-all ${!monthly ? "text-white" : "text-gray-600"}`}>
      Yearly <span className="text-[#FFB300] text-xs ml-1 bg-[#FFB300]/10 px-2 py-0.5 rounded-full">-20%</span>
    </span>
    <button
      onClick={() => setMonthly(!monthly)}
      className={`relative inline-flex items-center h-9 w-16 rounded-full transition-all duration-500 shadow-inner ${monthly ? "bg-gray-800" : "bg-[#A500FF]"
        }`}
    >
      <span
        className={`inline-block h-7 w-7 transform transition-all duration-500 ease-in-out bg-white rounded-full shadow-xl ${monthly ? "translate-x-1" : "translate-x-8 shadow-[0_0_15px_rgba(165,0,255,0.8)]"
          }`}
      />
    </button>
    <span className={`ml-4 font-bold text-lg transition-all ${monthly ? "text-white" : "text-gray-600"}`}>
      Monthly
    </span>
  </div>
);

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isFeatured,
  onCTA,
  monthly,
}) => {
  const glowColor = isFeatured ? "from-[#A500FF]/40" : "from-[#FFB300]/30";
  const borderColor = isFeatured ? "border-[#A500FF]" : "border-white/10";
  const hoverGlow = isFeatured
    ? "hover:shadow-[0_0_50px_rgba(165,0,255,0.3)]"
    : "hover:shadow-[0_0_50px_rgba(255,179,0,0.15)]";

  return (
    <div
      className={`relative flex flex-col h-full bg-[#0d0d0d]/80 backdrop-blur-xl rounded-[2.5rem] border ${borderColor} transition-all duration-500 group overflow-hidden ${hoverGlow} hover:scale-[1.02]`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 left-0 w-full h-64 bg-gradient-to-b ${glowColor} to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />

      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{title}</h3>
            {isFeatured && (
              <div className="flex items-center gap-1 bg-[#A500FF] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                <Sparkles size={10} /> RECOMMENDED
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">{description}</p>
        </div>

        {/* Price Section */}
        <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black text-white tracking-tighter">
              {title === "Free" ? "$0" : price}
            </span>
            {title !== "Free" && (
              <span className="text-gray-600 font-bold text-sm uppercase">/mo</span>
            )}
          </div>
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-2">
            {title === "Free" ? "No strings attached" : monthly ? "Billed Monthly" : "Billed Annually"}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onCTA(title)}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 mb-10 ${NEON_GRADIENT} text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 active:scale-95`}
        >
          {title === "Free" ? "Claim Free Access" : "Join the Waitlist"}
        </button>

        {/* Features - Logic for Sketch/Draft mode */}
        <div className="mt-auto">
          <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="h-px flex-grow bg-white/10" />
            Features
            <div className="h-px flex-grow bg-white/10" />
          </div>

          <ul className="space-y-4">
            {features && features.length > 0 ? (
              features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 group/item">
                  <CheckCircle className="w-4 h-4 text-[#A500FF] shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                  <span className="text-[13px] text-gray-400 font-medium group-hover/item:text-gray-200 transition-colors leading-snug">
                    {feature}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-[12px] text-gray-500 italic text-center py-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                Strategic <span className="text-gray-300 font-bold">{title}</span> features <br />
                announced at launch.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};