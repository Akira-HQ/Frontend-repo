import { Target, Zap, TrendingUp, ShieldCheck } from "lucide-react";

const data = [
  { icon: Target, title: "Intent Analysis", desc: "Identify high-value browsers before they bounce." },
  { icon: Zap, title: "Instant Response", desc: "24/7 sales conversations that feel human, not robotic." },
  { icon: TrendingUp, title: "Revenue Growth", desc: "Predictive upselling based on real-time behavior." },
  { icon: ShieldCheck, title: "Built-in Trust", desc: "Securely bridges with your Shopify or custom store." }
];

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {data.map((item, idx) => (
        <div key={idx} className="group flex flex-col items-start">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:border-amber-500/40 transition-colors">
            <item.icon className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}