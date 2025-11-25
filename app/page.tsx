"use client"
import React, { useState } from 'react';
import { MessageCircle, Tag, ShoppingCart, Link, Zap, TrendingUp, Handshake,  Target,  Smile,  Globe, Smartphone, Mail, Clock, RefreshCw, Layers, Trello } from 'lucide-react';
import { AkiraStarsBackground } from '@/components/Stars';
import { HeroSection } from '@/components/landing/Hero';
import { handleCtaClick } from '@/components/functions/helpers';
import { TestimonialPlaceholder } from '@/components/landing/TestimonialSection';
import { IntegrationGrid } from '@/components/landing/IntegrationSection';
import { FeatureCard, FeatureCardProps } from '@/components/landing/FeatureCard';
import { HowItWorksAnimation } from '@/components/landing/HowItWorks';
import { Capability, CapabilityGrid } from '@/components/landing/Capability';
import { DeepConversionSection } from '@/components/landing/DeepConversation';
import { PricingCard, PricingToggle } from '@/components/landing/Pricings';
import { FinalCTA } from '@/components/landing/FinalCTA';

const Home: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  // Explicitly type the parameter as string
  

  const featureData = [
    {
      icon: MessageCircle,
      title: "Intelligent Q&A",
      description: "Akira instantly handles complex customer questions and objections, ensuring zero friction in the pre-sale process."
    },
    {
      icon: Tag,
      title: "Proactive Recommendation",
      description: "Utilizes real-time behavior data to recommend products, boosting average order value (AOV) without upselling manually."
    },
    {
      icon: ShoppingCart,
      title: "Cart Recovery",
      description: "Automatically engages customers who abandon carts via their preferred channel (email, chat) to complete the purchase."
    },
    {
      icon: Link,
      title: "Seamless Integration",
      description: "Connect Akira to your e-commerce platform and all major messaging channels in minutes, not hours."
    },
  ];

  // Section 1: New Capabilities Data
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

  // Section 4: Deep Conversion Data
  const deepConversionFeatures: FeatureCardProps[] = [
    {
      icon: Trello,
      title: "Dynamic Conversation Flows",
      description: "Flows adapt in real-time based on customer mood, product stock, and current site promotions."
    },
    {
      icon: Clock,
      title: "AI-Driven Offer Timing",
      description: "Akira predicts the optimal micro-moment to deploy discounts or limited-time offers for maximum conversion likelihood."
    },
    {
      icon: Handshake,
      title: "Adaptive Recommendation Engine",
      description: "Recommendations learn from every interaction, ensuring suggested products are always highly relevant to the individual shopper."
    },
    {
      icon: ShoppingCart,
      title: "Abandoned Cart Recovery",
      description: "Personalized, non-intrusive reminders sent directly via the customer's preferred chat channel."
    },
    {
      icon: Mail,
      title: "Post-Purchase Messaging",
      description: "Drive repeat business and loyalty by automatically following up with relevant accessory suggestions and reviews."
    }
  ];

  // Section 5: Pricing Data (Adjusted for Annual)
  const calculatePrice = (basePrice: number) => {
    // 79 * 12 = 948 (monthly) vs (79 * 0.8) * 12 = 758.4 (annual)
    // 199 * 12 = 2388 (monthly) vs (199 * 0.8) * 12 = 1910.4 (annual)
    const annualPrice = Math.round(basePrice * 12 * 0.8);
    const monthlyPrice = basePrice;
    return isMonthly ? monthlyPrice : annualPrice;
  };

  const getPriceLabel = (basePrice: number, planTitle: string) => {
    if (planTitle === 'Free') return '€0 / mo';
    if (isMonthly) return `€${basePrice} / mo`;
    // For annual, display the total yearly price
    return `€${calculatePrice(basePrice)} / yr`;
  };


  const pricingData = [
    {
      title: "Free",
      price: getPriceLabel(0, 'Free'),
      features: ["Up to 100 sessions/mo", "Web Chat Widget", "Standard Q&A", "Email Support"],
      isFeatured: false,
      basePrice: 0
    },
    {
      title: "Growth",
      price: getPriceLabel(79, 'Growth'),
      features: ["Up to 10,000 sessions/mo", "Multi-Platform Integration", "Advanced Recommendations", "Automated Follow-ups", "Sales Analytics"],
      isFeatured: true,
      basePrice: 79
    },
    {
      title: "Pro",
      price: getPriceLabel(199, 'Pro'),
      features: ["Unlimited Sessions", "Voice Conversation Support", "Dedicated Account Manager", "Advanced A/B Testing", "Custom API Access", "Priority VIP Support"],
      isFeatured: false,
      basePrice: 199
    },
  ];

  return (
    <div className="relative min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden">

      {/* 1. Nebula Background Effect */}
      <AkiraStarsBackground density={200} />

      {/* 2. Main Content Wrapper */}
      <main className="relative z-10 pt-16 pb-24 text-white">

        <HeroSection />

        {/* === FEATURES SECTION: How Akira Works (Existing) === */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureData.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        {/* === WHY AKIRA SECTION (Existing) === */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Future of Sales is Here. Why Choose Akira
            </h2>
            <p className="text-lg text-gray-400 max-w-4xl mx-auto">
              Akira moves beyond reactive customer service. It is a proactive, learning system designed to empower store owners, giving them a scalable sales team that never sleeps and only focuses on the bottom line.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#A500FF] transition duration-300">
              <Zap className="w-8 h-8 text-[#A500FF] mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">A Partner, Not a Tool</h3>
              <p className="text-gray-400">Akira acts as a true sales manager, making autonomous decisions to maximize revenue rather than just following fixed, static scripts.</p>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#A500FF] transition duration-300">
              <TrendingUp className="w-8 h-8 text-[#A500FF] mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Designed for Growth</h3>
              <p className="text-gray-400">Every feature is tuned for one goal: boosting your conversion rate and increasing your average transaction value, driving sustainable business growth.</p>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-[#A500FF] transition duration-300">
              <Handshake className="w-8 h-8 text-[#A500FF] mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Effortless Integration</h3>
              <p className="text-gray-400">Go live in minutes. No complex APIs or coding needed—just a simple, single-script install for your e-commerce site and messaging apps.</p>
            </div>
          </div>
        </section>

        {/* === NEW SECTION 1: AKIRA CAPABILITIES === */}
        <CapabilityGrid capabilities={capabilityData} />

        {/* === NEW SECTION 2: HOW AKIRA WORKS ANIMATION === */}
        <HowItWorksAnimation />

        {/* === NEW SECTION 4: DEEP CONVERSION SECTION === */}
        <DeepConversionSection features={deepConversionFeatures} />

        {/* === NEW SECTION 3: AKIRA FOR YOUR STACK INTEGRATIONS === */}
        <IntegrationGrid />

        {/* === NEW SECTION 5: EXTENDED PLANS SECTION === */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Start Driving Sales Today
          </h2>
          <PricingToggle monthly={isMonthly} setMonthly={setIsMonthly} />

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {pricingData.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                features={plan.features}
                isFeatured={plan.isFeatured}
                onCTA={handleCtaClick}
                monthly={isMonthly}
              />
            ))}
          </div>
        </section>

        {/* === NEW SECTION 6: TESTIMONIALS PLACEHOLDER === */}
        <TestimonialPlaceholder />

        {/* === NEW SECTION 7: FINAL CTA SECTION === */}
        <FinalCTA
          onStart={() => handleCtaClick("Start Free Trial (Final CTA)")}
          onSeePlans={() => handleCtaClick("See Plans (Final CTA)")}
        />


        {/* Placeholder Chat Widget (Existing) */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="w-16 h-16 rounded-full bg-[#FFB300] flex items-center justify-center text-white text-3xl shadow-xl cursor-pointer">
            <MessageCircle className="w-8 h-8" />
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;