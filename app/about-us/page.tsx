"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineLightBulb,
  HiOutlineCubeTransparent,
  HiOutlineUserGroup,
  HiOutlineArrowRight
} from "react-icons/hi2";

// --- Framer Motion Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const AboutCliva = () => {
  return (
    <div className="bg-[#08090a] text-gray-200 selection:bg-[#A500FF]/30 selection:text-white">

      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-3xl z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-8">
            <HiOutlineSparkles className="animate-pulse" /> The Evolution of Ecommerce Support
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            Cliva exists to help <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
              customers decide.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            We are building a conversion-focused AI sales assistant for Shopify stores that
            prioritizes intent over chatter and intelligence over automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5 flex items-center gap-2 justify-center">
              Join Early Access <HiOutlineArrowRight />
            </button>
            <button className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all duration-300">
              Follow the Journey
            </button>
          </div>
        </motion.div>

        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A500FF]/10 blur-[120px] rounded-full -z-0" />
      </section>

      {/* 2. The Problem */}
      <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            whileInView="animate"
            initial="initial"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Why customers hesitate.</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Shopping online is a series of unanswered questions. "Will this fit?" "Is the return policy fair?" "Can I trust this quality?"
            </p>
            <p className="text-gray-400 leading-relaxed">
              Traditional chatbots fail because they are built for support, not sales. They offer generic loops when customers need specific reassurances to hit the "Buy" button.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-amber-500 font-bold block mb-2">01. Cognitive Load</span>
              <p className="text-sm text-gray-500">Too much information leads to choice paralysis.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 ml-8">
              <span className="text-[#A500FF] font-bold block mb-2">02. Lack of Trust</span>
              <p className="text-sm text-gray-500">Generic answers create distance, not connection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Difference Cards */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Built different.</h2>
          <p className="text-gray-500">Engineering a sales partner, not a support ticket tool.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              title: "Context First",
              desc: "Cliva learns your products, brand description, and policies before it ever speaks to a customer.",
              icon: <HiOutlineCubeTransparent size={24} />
            },
            {
              title: "Merchant Correction",
              desc: "Don't like an answer? Correct it once, and Cliva learns forever. You remain the architect.",
              icon: <HiOutlineLightBulb size={24} />
            },
            {
              title: "Conversion Focus",
              desc: "Designed to reduce friction, answer technical questions, and suggest 'Add to Cart' actions at the right moment.",
              icon: <HiOutlineShieldCheck size={24} />
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#A500FF]/30 transition-all group"
            >
              <div className="mb-6 text-gray-400 group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. How Cliva Thinks (Conceptual) */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-16">The Intelligence Stack</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative">
            <div className="flex-1 p-8 rounded-3xl bg-black border border-white/5">
              <span className="text-[10px] font-bold text-gray-600 block mb-2 uppercase tracking-widest">Input</span>
              <p className="text-sm text-white">Store Inventory + Persona</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center text-gray-700">
              <HiOutlineArrowRight className="rotate-90 md:rotate-0" />
            </div>
            <div className="flex-1 p-8 rounded-3xl bg-[#A500FF]/10 border border-[#A500FF]/20 shadow-[0_0_30px_rgba(165,0,255,0.1)]">
              <span className="text-[10px] font-bold text-[#A500FF] block mb-2 uppercase tracking-widest">Processing</span>
              <p className="text-sm text-white font-bold">Neural Grounding</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center text-gray-700">
              <HiOutlineArrowRight className="rotate-90 md:rotate-0" />
            </div>
            <div className="flex-1 p-8 rounded-3xl bg-black border border-white/5">
              <span className="text-[10px] font-bold text-gray-600 block mb-2 uppercase tracking-widest">Output</span>
              <p className="text-sm text-white">Intent-Aware Sales Strategy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Built for Real Stores */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <HiOutlineUserGroup size={40} className="mx-auto text-gray-700 mb-8" />
        <h2 className="text-3xl font-bold text-white mb-6">Designed for Merchants, not Metrics.</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          We understand that your store is your livelihood. Cliva is Shopify-first,
          merchant-controlled, and privacy-respecting by design. We don't hide your data,
          and we don't automate your brand voice without your permission.
        </p>
      </section>

      {/* 6. Build in Public */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-xl mx-auto px-6 p-10 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl text-center">
          <h3 className="text-white font-bold mb-4 italic">Built in Public.</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Cliva is currently in early-stage testing with a small circle of Shopify founders.
            We share our wins, our failures, and our roadmap because we believe the best software
            is shaped by the people who actually use it.
          </p>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-32 px-6 text-center">
        <motion.div
          whileInView={{ scale: [0.95, 1] }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tighter">Start your neural link.</h2>
          <button className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-amber-500 hover:text-white transition-all">
            Join the Waitlist
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">© 2026 Cliva AI • Intelligent Sales Architecture</p>
      </footer>

    </div>
  );
};

export default AboutCliva;