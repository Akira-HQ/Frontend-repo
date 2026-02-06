"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// ⚡️ Premium Motion Variants
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1] // Custom Expo-Out for a "snappy" feel
    }
  }
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <motion.div
  id="features"
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{
      y: -8,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
    }}
    className="
      group relative bg-white/[0.03] backdrop-blur-md p-8 rounded-[2rem] border border-gray-800 
      flex flex-col items-start space-y-5 h-full
      transition-colors duration-500
      hover:border-[#A500FF]/50 
      hover:shadow-[0_20px_50px_-15px_rgba(165,0,255,0.2)]
    "
  >
    {/* Icon Container */}
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 group-hover:bg-[#A500FF]/10 group-hover:scale-110 group-hover:rotate-3">
      <Icon className="w-6 h-6 text-[#FFB300] transition-colors duration-500 group-hover:text-[#A500FF]" />
    </div>

    {/* Content */}
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-white tracking-tight transition-colors duration-300 group-hover:text-white">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>

    {/* Subtle Glow Overlay (Appears on Hover) */}
    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#A500FF]/0 via-[#A500FF]/0 to-[#A500FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  </motion.div>
);