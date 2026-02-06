"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { BarChart, Brain, LucideIcon, MessageCircle } from "lucide-react";

export type ProcessStepProps = {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

// --- Motion Variants ---
const stepVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" }
  }
};

export const ProcessStep: React.FC<ProcessStepProps> = ({
  step,
  title,
  description,
  icon: Icon,
}) => (
  <motion.div
    variants={stepVariants}
    className="flex flex-col items-center text-center relative z-10 w-full md:w-1/3 group px-4"
  >
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-[#A500FF]/30 flex items-center justify-center shadow-2xl shadow-purple-900/20 transition-all duration-500 group-hover:border-[#FFB300] group-hover:shadow-[#FFB300]/20">
        <Icon className="w-8 h-8 text-[#FFB300] transition-colors duration-500 group-hover:text-[#A500FF]" />
      </div>
      {/* Visual Step Indicator Bubble */}
      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#A500FF] to-[#7000FF] flex items-center justify-center border border-white/20 shadow-lg">
        <span className="text-[10px] font-black text-white">{step}</span>
      </div>
    </div>

    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFB300] mb-3">Phase 0{step}</p>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight italic">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-medium">{description}</p>
  </motion.div>
);

export const HowItWorksAnimation: React.FC = () => {
  const processData = [
    {
      title: "Customer Initiates",
      description: "Shopper sends a message via Web, WhatsApp, or Instagram DM.",
      icon: MessageCircle,
    },
    {
      title: "Intent Mapping",
      description: "Cliva identifies intent (Buy, Ask, Compare) using product memory.",
      icon: Brain,
    },
    {
      title: "Convert & Log",
      description: "Cliva executes the sales sequence and captures the conversion data.",
      icon: BarChart,
    },
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-32 max-w-7xl relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-24"
      >
        <motion.h2 variants={stepVariants} className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter italic">
          The Three-Step Loop.
        </motion.h2>
        <motion.p variants={stepVariants} className="text-gray-500 text-lg max-w-2xl mx-auto">
          Built for speed. Engineered for conversion. Cliva replaces generic chatter with strategic sales intent.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.4 }}
        className="relative flex flex-col md:flex-row justify-between items-start md:items-start gap-12 md:gap-0"
      >
        {/* ⚡️ Animated SVG Connector Line (Desktop) */}
        <div className="absolute top-[40px] left-0 right-0 hidden md:block z-0 pointer-events-none px-[10%]">
          <svg width="100%" height="2" fill="none" className="overflow-visible">
            <motion.path
              d="M 0 1 L 800 1" // Fallback path, ideally dynamically calculated or fixed width
              variants={lineVariants}
              stroke="url(#line-gradient)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A500FF" />
                <stop offset="100%" stopColor="#FFB300" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {processData.map((step, index) => (
          <ProcessStep
            key={index}
            step={index + 1}
            title={step.title}
            description={step.description}
            icon={step.icon}
          />
        ))}
      </motion.div>
    </section>
  );
};