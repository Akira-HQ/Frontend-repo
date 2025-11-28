import React from 'react';
import { MessageCircle, Tag, ShoppingCart, Link, Zap, TrendingUp, Handshake, LucideIcon, Target, Brain, Smile, DollarSign, Globe, Smartphone, Mail, Code, BarChart, Clock, RefreshCw, Layers, Trello } from 'lucide-react';

export const IntegrationGrid: React.FC = () => {
  const integrations = [
    { name: "Shopify", icon: ShoppingCart, color: "text-green-400", desc: "Native App Integration", live: true },
    { name: "WooCommerce", icon: DollarSign, color: "text-[#A500FF]", desc: "Official Plugin", live: false },
    { name: "Instagram DM", icon: Smartphone, color: "text-pink-500", desc: "24/7 DMs Automation", live: false },
    { name: "WhatsApp API", icon: MessageCircle, color: "text-green-500", desc: "Official Business API", live: false },
    { name: "Telegram", icon: Globe, color: "text-blue-400", desc: "Customer Service Bot", live: false },
    { name: "Custom Sites", icon: Code, color: "text-[#FFB300]", desc: "Single JS Snippet", live: false },
  ];

  return (
    <section id='integration' className="container mx-auto px-4 py-20 max-w-7xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Akira For Your Stack
        </h2>
        <p className="text-lg text-gray-400 max-w-4xl mx-auto">
          Deploy Akira wherever your customers are. Seamless integration with all major e-commerce platforms and messaging channels.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <div
            key={index}
            className="
              group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-700 
              flex items-center space-x-4 cursor-default
              transition duration-500 transform hover:scale-[1.03]
              hover:border-[#A500FF] hover:shadow-2xl hover:shadow-purple-900/40 relative
            "
          >
            {/* Neon Status Badge */}
            <span className={`
                absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap
                ${integration.live
                ? 'bg-green-500/20 text-green-300 shadow-md shadow-green-900/50 border border-green-500/50'
                : 'bg-[#FFB300]/20 text-[#FFB300] shadow-md shadow-orange-900/50 border border-[#FFB300]/50'}
                `}>
              {integration.live ? "Available" : "Coming Soon"}
            </span>

            {/* Icon Container with Background */}
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${integration.live ? 'bg-white/10' : 'bg-gray-800/50'}`}>
              <integration.icon
                className={`w-6 h-6 ${integration.color} transition duration-300 drop-shadow-lg`}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{integration.name}</h3>
              <p className="text-sm text-gray-400">{integration.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};