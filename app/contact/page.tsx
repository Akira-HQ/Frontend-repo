"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHashtag,
  HiOutlineSparkles
} from "react-icons/hi2";
import {
  SiTiktok,
  SiInstagram,
  SiFacebook,
  SiX
} from "react-icons/si";

// --- Configuration ---
const CONTACT_EMAIL = "clivaaiofficial@gmail.com"; // Your verified Brevo/Cliva sender

// --- Animation Variants ---
// --- Updated Animation Variants ---
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      // Using 'easeOut' as a literal string or a cubic-bezier array
      ease: [0.19, 1, 0.22, 1]
    }
  },
} as const; // ⚡️ ADD THIS: 'as const' fixes the TypeScript string mismatch

// --- Reusable Components ---
const ContactMethod = ({ icon: Icon, label, value, href }: any) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    variants={itemVariants}
    className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
  >
    <div className="flex items-center gap-5">
      <div className="p-3.5 rounded-2xl bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-[#A500FF]/10 transition-all duration-500">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-200">{value}</p>
      </div>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-600">
      <HiOutlineChatBubbleLeftRight size={18} />
    </div>
  </motion.a>
);

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#08090a] text-gray-200 selection:bg-[#A500FF]/30 pb-20">

      {/* 1. Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#A500FF] mb-8">
            <HiOutlineSparkles className="animate-pulse" /> Direct Neural Link
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Let’s talk.
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Whether you have a technical question, feedback on Cliva’s logic,
            or just want to discuss your store’s strategy—we’re here to listen.
          </p>
        </motion.div>
      </section>

      {/* 2. Contact Grid */}
      <motion.section
        className="max-w-2xl mx-auto px-6 space-y-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Main Email */}
        <ContactMethod
          icon={HiOutlineEnvelope}
          label="Direct Correspondence"
          value={CONTACT_EMAIL}
          href={`mailto:${CONTACT_EMAIL}`}
        />

        {/* Social Framework */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ContactMethod
            icon={SiTiktok}
            label="TikTok"
            value="@ClivaAI"
            href="https://tiktok.com/@clivaai"
          />
          <ContactMethod
            icon={SiInstagram}
            label="Instagram"
            value="@cliva.ai"
            href="https://instagram.com/cliva.ai"
          />
          <ContactMethod
            icon={SiX}
            label="X (Twitter)"
            value="@ClivaHQ"
            href="https://x.com/clivahq"
          />
          <ContactMethod
            icon={SiFacebook}
            label="Facebook"
            value="Cliva Intelligence"
            href="https://facebook.com/clivaai"
          />
        </div>

        {/* 3. Reassurance Note */}
        <motion.div
          variants={itemVariants}
          className="pt-12 text-center"
        >
          <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10 max-w-lg mx-auto">
            <h4 className="text-sm font-bold text-white mb-3">A note on our process.</h4>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              Cliva is built by a small, intentional team. We read every message personally.
              As an early adopter, your feedback directly shapes the neural architecture we are building.
              We typically respond within one business day.
            </p>
          </div>
        </motion.div>

        {/* Future-Ready Placeholder (Subtle) */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center pt-8"
        >
          <div className="flex items-center gap-2 text-[9px] font-bold text-gray-700 uppercase tracking-widest border-t border-white/5 pt-8 w-full justify-center">
            <HiOutlineHashtag /> More communication channels coming as we scale
          </div>
        </motion.div>
      </motion.section>

      {/* Subtle Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A500FF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#f59e0b]/5 blur-[100px] rounded-full" />
      </div>

    </div>
  );
};

export default ContactPage;