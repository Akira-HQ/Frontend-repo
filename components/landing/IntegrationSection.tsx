import { MessageCircle, Tag, ShoppingCart, Link, Zap, TrendingUp, Handshake, LucideIcon, Target, Brain, Smile, DollarSign, Globe, Smartphone, Mail, Code, BarChart, Clock, RefreshCw, Layers, Trello } from 'lucide-react';

export const IntegrationGrid: React.FC = () => {
  const integrations = [
    { name: "Shopify", icon: ShoppingCart, color: "text-green-500", desc: "Native App Integration", live: true },
    { name: "WooCommerce", icon: DollarSign, color: "text-purple-400", desc: "Official Plugin", live: false },
    { name: "Instagram DM", icon: Smartphone, color: "text-pink-500", desc: "24/7 DMs Automation", live: false },
    { name: "WhatsApp API", icon: MessageCircle, color: "text-green-600", desc: "Official Business API", live: false },
    { name: "Telegram", icon: Globe, color: "text-blue-400", desc: "Customer Service Bot", live: false },
    { name: "Custom Sites", icon: Code, color: "text-yellow-400", desc: "Single JS Snippet", live: false },
  ];

  return (
    <section className="container mx-auto px-4 py-20 max-w-7xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
              group p-6 rounded-xl bg-gray-900/60 border border-gray-800 
              flex items-center space-x-4
              hover:border-[#A500FF] hover:shadow-[0_0_15px_rgba(165,0,255,0.4)]
              transition duration-330 relative
            "
          >
            <span className={`absolute top-2 text-sm  right-0 text-white px-2 bg-gray-700 rounded`}>{integration.live ? "Available": "coming soon..."}</span>
            <integration.icon className={`w-8 h-8 ${integration.color}`} />
            <div>
              <h3 className="text-xl font-bold text-white">{integration.name}</h3>
              <p className="text-sm text-gray-500">{integration.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};