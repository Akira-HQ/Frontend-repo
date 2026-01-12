"use client";
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  DollarSign,
  Users,
  Minus,
  LucideIcon,
} from "lucide-react";

interface SummaryCardProps {
  data?: {
    totalUsers: { value: string; change: number; trend: number };
    revenue: { value: string; change: number; trend: number };
    conversion: { value: string; change: number; trend: number };
    activeSessions: { value: string; change: number; trend: number };
  };
}

const SummaryCards: React.FC<SummaryCardProps> = ({ data }) => {
  // Mapping the incoming data to our display format
  const cards = [
    {
      title: "Neural Reach",
      subtitle: "Total Unique Users",
      value: data?.totalUsers?.value || "0",
      change: data?.totalUsers?.change || 0,
      trend: data?.totalUsers?.trend || 0,
      icon: Users,
      color: "#A500FF", // Purple
    },
    {
      title: "Generated Revenue",
      subtitle: "Last 30 Days",
      value: data?.revenue?.value || "$0",
      change: data?.revenue?.change || 0,
      trend: data?.revenue?.trend || 0,
      icon: DollarSign,
      color: "#00A7FF", // Blue
    },
    {
      title: "Conversion IQ",
      subtitle: "AI Success Rate",
      value: data?.conversion?.value || "0%",
      change: data?.conversion?.change || 0,
      trend: data?.conversion?.trend || 0,
      icon: TrendingUp,
      color: "#FFB300", // Orange/Gold
    },
    {
      title: "Live Pulses",
      subtitle: "Active Training Sessions",
      value: data?.activeSessions?.value || "0",
      change: data?.activeSessions?.change || 0,
      trend: data?.activeSessions?.trend || 0,
      icon: MessageCircle,
      color: "#FF4D4D", // Red
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.trend === 1;
        const isNegative = card.trend === -1;

        return (
          <div
            key={index}
            className="group relative p-6 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
          >
            {/* Visual Flare: A subtle colored glow in the corner of each card */}
            <div
              className="absolute -top-10 -right-10 w-24 h-24 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: card.color }}
            />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">
                  {card.title}
                </h3>
                <p className="text-[9px] text-gray-600 font-medium mb-4 italic">
                  {card.subtitle}
                </p>
              </div>
              <div
                className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500"
                style={{ color: card.color }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-3xl font-black tracking-tighter text-white">
                {card.value}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold 
                  ${isPositive ? "bg-green-500/10 text-green-400" :
                    isNegative ? "bg-red-500/10 text-red-400" :
                      "bg-gray-500/10 text-gray-400"}`}
                >
                  {isPositive && <TrendingUp size={12} />}
                  {isNegative && <TrendingDown size={12} />}
                  {!isPositive && !isNegative && <Minus size={12} />}
                  {Math.abs(card.change)}%
                </div>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  vs Period
                </span>
              </div>
            </div>

            {/* Bottom Progress Spark (Visual Polish) */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full" />
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;