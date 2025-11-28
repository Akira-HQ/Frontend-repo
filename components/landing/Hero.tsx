import React from 'react';
import { ShoppingCart, RefreshCw, Layers, Zap, MessageCircle, Heart, CheckCircle, TrendingUp } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../Button';

// Assuming you have a component that handles CTA clicks passed as a prop
// Renamed prop type to match your preferred format (onCta)
interface InspiredHeroSectionProps {
  onCta: (message: string) => void;
}

const TagPill: React.FC<{ text: string }> = ({ text }) => (
  <div className="inline-block py-1 px-3 mb-4 rounded-full text-xs font-medium uppercase tracking-widest text-[#9370DB] bg-[#9370DB]/20 border border-[#9370DB]/30 backdrop-blur-sm">
    {text}
  </div>
);

const IntegrationLogo: React.FC<{ name: string }> = ({ name }) => (
  <div className="text-sm font-semibold text-white/70 hover:text-white transition duration-200 cursor-default">
    <span className="text-[#A500FF] font-black mr-1">&lt;</span>{name}<span className="text-[#A500FF] font-black ml-1">&gt;</span>
  </div>
);

// Custom styles for the background glows and animations (using standard CSS within the component)
const customStyles = `
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s infinite alternate ease-in-out;
}

.animate-pulse-slow-reverse {
  animation: pulse-slow 8s infinite alternate-reverse ease-in-out;
}

/* Central Radial Gradient for background depth */
.bg-radial-gradient-purple {
  background: radial-gradient(circle at center, rgba(165, 0, 255, 0.1), transparent 50%);
}
`;

// Adapted to use the simplified content structure you prefer, but retaining the modern design elements
export const HeroSection: React.FC<InspiredHeroSectionProps> = ({ onCta }) => {
  return (
    // Note: The main wrapper needs to include the custom styles
    <section id='hero' className="relative pt-24 pb-40 px-4 text-center overflow-hidden min-h-[80vh]">
      <style>{customStyles}</style>

      {/* 1. Illustration and Neon Glow Handling (CSS/Tailwind Approach) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Glow (Orange) */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
        {/* Right Glow (Purple) */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow-reverse"></div>
        {/* Central Radial Gradient - for the depth */}
        <div className="absolute inset-0 bg-radial-gradient-purple opacity-20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Top Pill / Tag */}
        <TagPill text="✨ AI Sales Manager" />

        {/* Hero Title (Using your preferred text structure) */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          AKIRA: Your Personal
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A500FF] to-[#FFB300] ml-3">
            AI Sales Manager.
          </span>
        </h1>

        {/* Sub-text (Using your preferred text) */}
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          Akira is an intelligent, automated assistant that engages customers, proactively interacts with customers, and drives sales for your e-commerce business.
        </p>

        {/* CTA Button Group */}
        <div className="flex justify-center space-x-4 mb-20">
          <PrimaryButton onClick={() => onCta("Growth")}>
            Start Free Trial
          </PrimaryButton>
          <SecondaryButton onClick={() => onCta("See Plans")}>
            See Plans
          </SecondaryButton>
        </div>

        {/* Integrations Bar
        <div className="flex justify-center items-center space-x-4 md:space-x-8 mt-16 pt-8 border-t border-white/10 flex-wrap gap-y-4">
          <IntegrationLogo name="Shopify" />
          <IntegrationLogo name="Klaviyo" />
          <IntegrationLogo name="&lt;Trello&gt;" />
          <IntegrationLogo name="Slack" />
          <IntegrationLogo name="HubSpot" />
        </div> */}

      </div>

      {/* 2. Glassmorphism Panels (Dashboard Mockup) - Now illustrating the core concept */}
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-24">

        {/* Panel 1 — Simple Definition */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-orange-900/40">
          <h3 className="text-xl font-bold text-[#FFB300] mb-3">What Akira Really Does</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Akira works like a <span className="text-white font-semibold">24/7 sales manager</span>
            for your online store. It chats with customers, answers questions,
            recommends products, handles objections, and follows up — automatically.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
            <Zap className="w-5 h-5 text-[#FFB300] shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Always available</p>
              <p className="text-xs text-gray-400">Engages customers instantly, anytime.</p>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            *No scripts. No delays. Pure intelligence.
          </div>
        </div>

        {/* Panel 2 — Live Sales Scenario */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-purple-900/40">
          <h3 className="text-xl font-bold text-[#A500FF] mb-3">Akira in Real Action</h3>

          <div className="space-y-4">
            {/* Customer */}
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-[#A500FF]/50 text-white rounded-2xl rounded-br-none text-sm">
                Does this dress come in size XL?
              </span>
              <p className="text-xs text-gray-500 mt-1">Customer • 9:42 AM</p>
            </div>

            {/* Akira */}
            <div className="text-left">
              <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-2xl rounded-tl-none text-sm leading-relaxed">
                Yes, it does! 🎉
                <br />We have XL in red and midnight blue.
                <br />You’ll love the fit — it’s our highest-rated size for comfort.
                <br /><span className="underline">Click here</span> to see available colors.
              </span>
              <p className="text-xs text-gray-500 mt-1">Akira • 9:42 AM</p>
            </div>

            {/* Intent */}
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-3">
              <RefreshCw className="w-4 h-4" />
              <span>Intent identified: Size check → high interest → conversion path created.</span>
            </div>
          </div>
        </div>

        {/* Panel 3 — Business Growth */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-indigo-900/40">
          <h3 className="text-xl font-bold text-[#7F00FF] mb-3">How It Grows Your Business</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Every conversation is analyzed. Akira learns what customers like, when
            they buy, and what makes them hesitate — then improves itself automatically.
          </p>

          <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
            <Layers className="w-5 h-5 text-[#7F00FF] shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Smarter every day</p>
              <p className="text-xs text-gray-400">Learns from past sales and customer patterns.</p>
            </div>
          </div>

          <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-green-400 shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Higher conversions</p>
              <p className="text-xs text-gray-400">Users typically see a boost in sales & AOV.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};