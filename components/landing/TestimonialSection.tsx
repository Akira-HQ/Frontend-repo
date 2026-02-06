"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { HiOutlineChatBubbleBottomCenterText, HiOutlineSparkles } from "react-icons/hi2";

const placeholderVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

export const TestimonialPlaceholder: React.FC = () => (
  <section id="testimonial" className="container mx-auto px-4 py-32 max-w-5xl relative">

    <motion.div
      variants={placeholderVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative p-12 md:p-20 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01] text-center overflow-hidden group"
    >
      {/* ⚡️ Animated Background Shimmer */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-[#A500FF]/10 via-transparent to-[#FFB300]/10 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon Container */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-8 group-hover:text-[#A500FF] group-hover:border-[#A500FF]/30 transition-colors duration-500"
        >
          <HiOutlineChatBubbleBottomCenterText size={28} />
        </motion.div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-[#A500FF] mb-6">
          <HiOutlineSparkles className="animate-pulse" /> Social Proof Pipeline
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter italic">
          Listening to the first <br className="hidden md:block" /> wave of merchants.
        </h2>

        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed font-medium">
          Cliva is currently in private testing with selected Shopify stores.
          Real-world conversion data and founder feedback will be revealed here soon.
        </p>

        {/* Neural Loading Indicator */}
        <div className="mt-12 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#A500FF]"
            />
          ))}
        </div>
      </div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#A500FF]/20 rounded-tl-[3rem] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#FFB300]/20 rounded-br-[3rem] pointer-events-none" />
    </motion.div>
  </section>
);