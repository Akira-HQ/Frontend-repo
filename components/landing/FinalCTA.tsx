"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { SecondaryButton } from "../Button";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

interface FinalCTAProps {
  onStartAction: () => void;
  onSeePlansAction: () => void;
}

// --- ⚡️ Premium Motion Variants ---
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.8 }
  }
};

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartAction, onSeePlansAction }) => {
  return (
    <section className="container mx-auto px-4 py-32 max-w-7xl relative overflow-hidden">

      {/* Background Decorative Element (Subtle Neural Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#A500FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        whileHover={{ scale: 1.005 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#00A7FF] via-[#A500FF] to-[#7000FF] p-16 md:p-24 rounded-[3rem] text-center shadow-[0_20px_60px_-15px_rgba(165,0,255,0.5)] border border-white/10"
      >
        {/* Shimmer Effect Layer */}
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        />

        <motion.div variants={contentVariants} className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em]">
            <HiOutlineRocketLaunch className="animate-bounce" /> Deployment Ready
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight italic">
            Automate your entire <br className="hidden md:block" /> sales workflow.
          </h2>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Cliva works 24/7. No salary. No breaks. Just pure <br className="hidden md:block" />
            intelligence driving your store's conversion.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.button
              onClick={onStartAction}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white text-[#08090a] font-black text-xs uppercase tracking-[0.2em] py-5 px-12 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-white/20 flex items-center gap-3"
            >
              Start Free Trial
            </motion.button>

            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
              <SecondaryButton
                onClick={onSeePlansAction}
                className="bg-transparent border-white/30 text-white hover:bg-white/10 px-10 py-5 text-xs font-black uppercase tracking-[0.2em]"
              >
                See All Plans
              </SecondaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Mesh Background Detail */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/20 rounded-full blur-3xl" />
      </motion.div>
    </section>
  );
};