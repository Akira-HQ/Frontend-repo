"use client";
import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ACCENT_BLUE, NEON_ORANGE, NEON_PURPLE, TEXT_GRAY } from "@/types";
import { Globe } from "lucide-react";

interface TrafficDonutProps {
  data?: any[];
}

const TrafficDonutChart: React.FC<TrafficDonutProps> = ({ data }) => {
  // Use real data or fallback to an empty set
  const chartData = data || [];

  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl h-96 flex flex-col relative overflow-hidden group">
      {/* Background Decorative Element */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#00A7FF]/5 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="p-2 bg-[#00A7FF]/20 rounded-lg">
          <Globe size={18} className="text-[#00A7FF]" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
            Acquisition <span className="text-[#00A7FF]">Origin</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Traffic Source Distribution</p>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Total</span>
          <span className="text-2xl font-black text-white tracking-tighter">
            {chartData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                  style={{
                    filter: `drop-shadow(0 0 8px ${entry.color}40)`
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-950/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: data.color }}>
                        {data.name}
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {data.value.toLocaleString()} <span className="text-gray-500 font-medium">Sessions</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Clean Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
        {chartData.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2 group/item">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-gray-500 group-hover/item:text-gray-300 transition-colors uppercase tracking-tight">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficDonutChart;