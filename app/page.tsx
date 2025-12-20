"use client";
import React, { useState, useMemo } from "react";
import {
  MessageCircle, Tag, ShoppingCart, Link, Zap, TrendingUp, Handshake,
  Target, Smile, Globe, Smartphone, Mail, Clock, RefreshCw, Layers, Trello
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Capability, CapabilityGrid } from "@/components/landing/Capability";
import { ClivaStarsBackground } from "@/components/Stars";
import { HeroSection } from "@/components/landing/Hero";
import { FeatureCard, FeatureCardProps } from "@/components/landing/FeatureCard";
import { HowItWorksAnimation } from "@/components/landing/HowItWorks";
import { DeepConversionSection } from "@/components/landing/DeepConversation";
import { IntegrationGrid } from "@/components/landing/IntegrationSection";
import { PricingCard, PricingToggle } from "@/components/landing/Pricings";
import { TestimonialPlaceholder } from "@/components/landing/TestimonialSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import Footer from "@/components/Footer";

// Import the source of truth
import { PLAN_CONFIG } from "@/utils/checkPlan";
import { LandingChat } from "@/components/chatTools/ChatWindow";

const Home: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const router = useRouter();

  const handleCtaClick = (planTitle: string) => {
    const title = planTitle.toLowerCase();
    let planParam = "free";

    if (title.includes("basic")) {
      planParam = "basic";
    } else if (title.includes("pro") || title.includes("premium")) {
      planParam = "premium"; // Matches the key in PLAN_CONFIG
    }

    // router.push(`/register?plan=${planParam}`);
    // development route for now
    router.push("/waitlist");
  };

  const pricingData = useMemo(() => {
    return [
      {
        title: "Free",
        configKey: "FREE",
        isFeatured: false,
      },
      {
        title: "Basic",
        configKey: "BASIC",
        isFeatured: true,
      },
      {
        title: "Pro",
        configKey: "PREMIUM",
        isFeatured: false,
      },
    ].map((item) => {
      const config = PLAN_CONFIG[item.configKey as keyof typeof PLAN_CONFIG];
      const basePrice = config.price;

      // Calculate annual (20% discount)
      const displayPrice = isMonthly
        ? `$${basePrice} / mo`
        : `$${Math.round(basePrice * 12 * 0.8)} / yr`;

      return {
        title: item.title,
        price: basePrice === 0 ? "$0 / mo" : displayPrice,
        features: config.features,
        isFeatured: item.isFeatured,
      };
    });
  }, [isMonthly]);

  // Static Data remains same as your design
  const featureData = [
    { icon: MessageCircle, title: "Intelligent Q&A", description: "Cliva instantly handles complex customer questions and objections." },
    { icon: Tag, title: "Proactive Recommendation", description: "Utilizes real-time behavior data to recommend products." },
    { icon: ShoppingCart, title: "Cart Recovery", description: "Automatically engages customers who abandon carts." },
    { icon: Link, title: "Seamless Integration", description: "Connect Cliva to your e-commerce platform in minutes." },
  ];

  const capabilityData: Capability[] = [
    { icon: Zap, title: "Autonomous Sales Engine" },
    { icon: Target, title: "Customer Intent Prediction" },
    { icon: Smile, title: "Emotion-Aware Conversation Layer" },
    { icon: RefreshCw, title: "Real-time Product Intelligence" },
    { icon: Globe, title: "Multilingual Selling Agent" },
    { icon: Smartphone, title: "Omnichannel (WhatsApp + IG + Email)" },
    { icon: TrendingUp, title: "Smart Upsell / Cross-Sell" },
    { icon: Layers, title: "Campaign-Driven Conversations" },
  ];

  return (
    <div className="relative min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden">
      <ClivaStarsBackground density={200} />

      <main className="relative z-10 pt-16 pb-24 text-white">
        <HeroSection onCta={handleCtaClick} />

        <section className="container mx-auto px-4 py-20 max-w-7xl" id="features">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureData.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </section>

        <section id="why-cliva" className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Future of Sales is Here. Why Choose Cliva</h2>
            <p className="text-lg text-gray-400 max-w-4xl mx-auto">Cliva acts as a proactive sales manager designed to empower store owners.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-[#A500FF] transition"><Zap className="text-[#A500FF] mb-3" /><h3 className="font-bold mb-2">A Partner, Not a Tool</h3><p className="text-gray-400">Cliva makes autonomous decisions to maximize revenue.</p></div>
            <div className="p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-[#FFB300] transition"><TrendingUp className="text-[#A500FF] mb-3" /><h3 className="font-bold mb-2">Designed for Growth</h3><p className="text-gray-400">Every feature is tuned to boost your conversion rate.</p></div>
            <div className="p-6 rounded-2xl bg-white/5 border border-gray-800 hover:border-[#A500FF] transition"><Handshake className="text-[#A500FF] mb-3" /><h3 className="font-bold mb-2">Effortless Integration</h3><p className="text-gray-400">Go live in minutes with a single-script install.</p></div>
          </div>
        </section>

        <CapabilityGrid capabilities={capabilityData} />
        <HowItWorksAnimation />
        <IntegrationGrid />

        <section id="pricing" className="container mx-auto px-4 py-20 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Start Driving Sales Today</h2>
          <PricingToggle monthly={isMonthly} setMonthly={setIsMonthly} />
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {pricingData.map((plan, index) => (
              <PricingCard key={index} {...plan} onCTA={handleCtaClick} monthly={isMonthly} />
            ))}
          </div>
        </section>

        <TestimonialPlaceholder />
        <FinalCTA onStart={() => handleCtaClick("premium")} onSeePlans={() => handleCtaClick("basic")} />
      </main>

      <LandingChat />
      <Footer />
    </div>
  );
};

export default Home;