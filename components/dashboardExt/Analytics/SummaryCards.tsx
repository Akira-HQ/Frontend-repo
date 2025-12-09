"use client";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  MessageCircle,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";

// Mock Data for Summary Cards (Section 1)
const SUMMARY_DATA = [
  { title: "Total Users", value: "1.2K", change: 18.5, trend: 1, icon: Users },
  {
    title: "Revenue (30 Days)",
    value: "$15,400",
    change: -3.2,
    trend: -1,
    icon: DollarSign,
  },
  {
    title: "Conversion Rate",
    value: "4.7%",
    change: 0.8,
    trend: 1,
    icon: TrendingUp,
  },
  {
    title: "Active Sessions",
    value: "142",
    change: 0.0,
    trend: 0,
    icon: MessageCircle,
  },
];

const SummaryCards: React.FC = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {SUMMARY_DATA.map((card, index) => {
      const Icon = card.icon;
      const isPositive = card.trend === 1;
      const changeColor =
        card.trend === 1
          ? "text-green-400"
          : card.trend === -1
            ? "text-red-400"
            : "text-gray-400";

      return (
        <div
          key={index}
          className="p-5 bg-gray-900 rounded-xl border border-gray-800 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-400 font-medium">{card.title}</h3>
            <Icon className="w-5 h-5 text-[#FFB300]" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
          <p
            className={`text-xs font-semibold ${changeColor} mt-1 flex items-center gap-1`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : card.trend === -1 ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            {card.change !== 0
              ? `${Math.abs(card.change)}% vs last month`
              : "No change"}
          </p>
        </div>
      );
    })}
  </div>
);

export default SummaryCards;
