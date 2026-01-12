"use client";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { CHART_GRID_COLOR, NEON_ORANGE, TEXT_GRAY } from "@/types";
import { DollarSign, BarChart3 } from "lucide-react";

interface RevenueBarChartProps {
  data?: any[];
}

const RevenueBarChart: React.FC<RevenueBarChartProps> = ({ data }) => {
  const chartData = data || [];

  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl h-96 flex flex-col relative overflow-hidden group">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFB300]/5 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFB300]/20 rounded-lg">
            <DollarSign size={18} className="text-[#FFB300]" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
              Revenue <span className="text-[#FFB300]">Velocity</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Monthly Financial Yield</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <BarChart3 size={12} className="text-gray-500" />
          <span className=" font-black text-gray-400 uppercase tracking-widest text-[8px]">Real-time Attribution</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={32}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFB300" stopOpacity={1} />
                <stop offset="100%" stopColor="#FFB300" stopOpacity={0.3} />
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
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-950/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                      <p className="text-[10px] font-black text-[#FFB300] uppercase tracking-widest mb-1">
                        Revenue Pulse
                      </p>
                      <p className="text-sm font-bold text-white">
                        ${payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="revenue"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueBarChart;