"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { CHART_GRID_COLOR, NEON_PURPLE, TEXT_GRAY, ACCENT_BLUE } from "@/types";

interface UsersLineChartProps {
  data?: any[];
}

const UsersLineChart: React.FC<UsersLineChartProps> = ({ data }) => {
  // Use real data if available, otherwise empty array to prevent crashing
  const chartData = data || [];

  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl h-96 relative overflow-hidden group">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#A500FF]/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
            Neural Traffic <span className="text-[#A500FF]">Flow</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
            User Growth & Store Visitors
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#A500FF]" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Active Visitors</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A500FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#A500FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_GRID_COLOR}
            vertical={false}
            opacity={0.1}
          />
          <XAxis
            dataKey="name"
            stroke={TEXT_GRAY}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280', fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis
            stroke={TEXT_GRAY}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280', fontWeight: 'bold' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 10, 10, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)"
            }}
            itemStyle={{ color: "#A500FF", fontWeight: "bold" }}
            cursor={{ stroke: '#A500FF', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#A500FF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorUsers)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersLineChart;