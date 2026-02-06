"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

export type Capability = { icon: LucideIcon; title: string };

// --- Motion Variants (Self-Contained) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] },
  },
};

export const CapabilityGrid: React.FC<{ capabilities: Capability[] }> = ({
  capabilities,
}) => (
  <section id="capacity" className="container mx-auto px-4 py-20 max-w-7xl">
    {/* Animated Header Section */}
    <motion.div
      className="text-center mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={textVariants}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        Cliva's Core Capabilities
      </h2>
      <p className="text-lg text-gray-400 max-w-4xl mx-auto">
        Go beyond simple chat. Cliva is a comprehensive AI sales engine built on
        real-time data and predictive modeling.
      </p>
    </motion.div>

    {/* Animated Grid Container */}
    <motion.div
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {capabilities.map((cap, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{
            y: -5,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="
            group p-8 rounded-2xl h-full flex flex-col justify-center text-center
            bg-white/[0.03] backdrop-blur-sm border border-gray-800/50 
            transition-colors duration-500
            hover:border-[#A500FF]/50 hover:shadow-[0_20px_40px_-15px_rgba(165,0,255,0.2)]
            hover:bg-white/[0.05]
          "
        >
          <div className="mb-4 mx-auto p-3 rounded-xl bg-white/5 group-hover:bg-[#A500FF]/10 transition-colors duration-300">
            <cap.icon
              className="w-8 h-8 text-[#FFB300] transition-colors duration-300 group-hover:text-[#A500FF]"
            />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">
            {cap.title}
          </h3>
        </motion.div>
      ))}
    </motion.div>
  </section>
);