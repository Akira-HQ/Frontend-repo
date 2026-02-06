"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  MessageCircle,
  ShoppingCart,
  DollarSign,
  Globe,
  Smartphone,
  Code,
} from "lucide-react";

// --- Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }
  },
};

export const IntegrationGrid: React.FC = () => {
  const integrations = [
    {
      name: "Shopify",
      icon: ShoppingCart,
      color: "text-green-400",
      glow: "group-hover:shadow-green-500/20",
      desc: "Native App Integration",
      live: true,
    },
    {
      name: "WooCommerce",
      icon: DollarSign,
      color: "text-[#A500FF]",
      glow: "group-hover:shadow-purple-500/20",
      desc: "Official Plugin",
      live: false,
    },
    {
      name: "Instagram DM",
      icon: Smartphone,
      color: "text-pink-500",
      glow: "group-hover:shadow-pink-500/20",
      desc: "24/7 DMs Automation",
      live: false,
    },
    {
      name: "WhatsApp API",
      icon: MessageCircle,
      color: "text-green-500",
      glow: "group-hover:shadow-green-500/20",
      desc: "Official Business API",
      live: false,
    },
    {
      name: "Telegram",
      icon: Globe,
      color: "text-blue-400",
      glow: "group-hover:shadow-blue-500/20",
      desc: "Customer Service Bot",
      live: false,
    },
    {
      name: "Custom Sites",
      icon: Code,
      color: "text-[#FFB300]",
      glow: "group-hover:shadow-orange-500/20",
      desc: "Single JS Snippet",
      live: false,
    },
  ];

  return (
    <section id="integration" className="container mx-auto px-4 py-32 max-w-7xl relative">

      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#A500FF]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-24"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter italic">
          Cliva For Your Stack.
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Deploy Cliva wherever your customers are. Built for seamless synchronization with
          the e-commerce platforms you already use.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {integrations.map((integration, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className={`
              group p-8 rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-gray-800/50 
              flex items-center space-x-5 cursor-default relative overflow-hidden
              transition-all duration-500
              hover:border-[#A500FF]/30 hover:bg-white/[0.04]
              hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${integration.glow}
            `}
          >
            {/* Status Indicator */}
            <div className={`
              absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest
              ${integration.live
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-gray-800/50 text-gray-600 border-white/5"}
            `}>
              {integration.live && <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />}
              {integration.live ? "Live" : "Queue"}
            </div>

            {/* Icon Box */}
            <div className={`
              w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500
              ${integration.live ? "bg-white/5 group-hover:bg-[#A500FF]/10 group-hover:scale-110" : "bg-gray-900/50 grayscale"}
            `}>
              <integration.icon className={`w-7 h-7 ${integration.live ? integration.color : "text-gray-700"} transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(165,0,255,0.5)]`} />
            </div>

            <div className={integration.live ? "" : "opacity-40"}>
              <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-2">
                {integration.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium tracking-tight">
                {integration.desc}
              </p>
            </div>

            {/* Subtle Gradient Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A500FF]/0 via-transparent to-[#A500FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};