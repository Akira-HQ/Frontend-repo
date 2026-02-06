"use client";

import React, { useLayoutEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div
    className="
      feature-card
      group bg-white/[0.03] backdrop-blur-sm p-8 rounded-[2rem] border border-gray-800/50 
      flex flex-col items-start space-y-5 h-full
      transition-colors duration-500
      hover:border-[#A500FF]/40 
      hover:shadow-[0_20px_50px_-20px_rgba(165,0,255,0.3)]
    "
  >
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 group-hover:bg-[#A500FF]/10 group-hover:scale-110">
      <Icon className="w-6 h-6 text-[#FFB300] transition-colors duration-300 group-hover:text-[#A500FF]" />
    </div>
    <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export const DeepConversionSection: React.FC<{
  features: FeatureCardProps[];
}> = ({ features }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Animation
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // 2. Cards Stagger Animation
      gsap.from(".feature-card", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // Clean up on unmount
  }, []);

  return (
    <section
      id="conversation"
      ref={sectionRef}
      className="container mx-auto px-4 py-24 max-w-7xl overflow-hidden"
    >
      <div ref={headerRef} className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Designed for Conversion, <br className="hidden md:block" /> Built for Revenue
        </h2>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Cliva uses sophisticated AI models specifically trained on e-commerce
          transaction data to optimize every single touchpoint.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};