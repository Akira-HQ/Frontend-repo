"use client";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Search,
  BrainCircuit,
} from "lucide-react";
import { CHART_GRID_COLOR, TEXT_GRAY } from "@/types";

interface SegmentProps {
  data?: any[];
}

const SegmentProfile: React.FC<{ segment: any }> = ({ segment }) => {
  const icons: any = {
    "Fast Deciders": TrendingUp,
    "Loyalty Tier 1": ShieldCheck,
    "Price Sensitive": Zap,
    "Feature Inquirer": Search,
  };
  const Icon = icons[segment.name] || BrainCircuit;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group shrink-0">
      <div
        className="p-2 rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${segment.color}15`, color: segment.color }}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-center mb-0.5">
          <h5 className="text-[10px] font-black text-white uppercase tracking-widest truncate mr-2">
            {segment.name}
          </h5>
          <span className="text-[9px] font-bold text-[#A500FF] bg-[#A500FF]/10 px-1.5 rounded uppercase">
            x{segment.AOV_Factor || '1.2'} AOV
          </span>
        </div>
        <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">
          {segment.strategy || "Optimizing engagement based on neural behavioral patterns."}
        </p>
      </div>
    </div>
  );
};

const CustomerSegmentsChart: React.FC<SegmentProps> = ({ data }) => {
  const segments = data || [];

  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden h-full min-h-[500px] flex flex-col">
      {/* Internal Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(165, 0, 255, 0.3); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #A500FF; }
      `}</style>

      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A500FF]/40 to-transparent" />

      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#A500FF]/20 rounded-lg">
            <BrainCircuit size={18} className="text-[#A500FF]" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
            Neural <span className="text-[#A500FF]">Personas</span>
          </h3>
        </div>
        <p className="text-[10px] text-gray-500 uppercase tracking-tight font-bold">
          Behavioral classification engine mapping customer intent.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 flex-1 overflow-hidden">
        {/* Visualization Hub */}
        <div className="xl:col-span-3 h-[250px] xl:h-full min-h-[250px] relative bg-black/20 rounded-2xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} opacity={0.05} />
              <XAxis
                dataKey="name"
                stroke={TEXT_GRAY}
                fontSize={9}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#4b5563', fontWeight: 'bold' }}
              />
              <YAxis
                stroke={TEXT_GRAY}
                fontSize={9}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#4b5563' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-gray-950 border border-white/10 p-2 rounded-lg shadow-2xl">
                        <p className="text-[9px] font-black uppercase tracking-tighter" style={{ color: d.color }}>
                          {d.name}
                        </p>
                        <p className="text-xs font-bold text-white">{d.count} Users</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={30}>
                {segments.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} opacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Intelligence Side-Panel (Scrollable) */}
        <div className="xl:col-span-2 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 max-h-[350px] xl:max-h-full">
          {segments.length > 0 ? (
            segments.map((segment: any, index: number) => (
              <SegmentProfile key={index} segment={segment} />
            ))
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] text-gray-600 uppercase font-black">No Segments Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentsChart;