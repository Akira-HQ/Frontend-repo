"use client";
import { CHART_GRID_COLOR, NEON_ORANGE, TEXT_GRAY } from "@/types";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export const MONTHLY_DATA = [
  { name: "Jan", users: 400, revenue: 2400 },
  { name: "Feb", users: 300, revenue: 1398 },
  { name: "Mar", users: 200, revenue: 9800 },
  { name: "Apr", users: 278, revenue: 3908 },
  { name: "May", users: 189, revenue: 4800 },
  { name: "Jun", users: 239, revenue: 3800 },
  { name: "Jul", users: 349, revenue: 4300 },
  { name: "Aug", users: 450, revenue: 5100 },
  { name: "Sep", users: 600, revenue: 6200 },
];

const RevenueBarChart: React.FC = () => (
  <div className="p-6 bg-[#0b0b0b] rounded-xl border border-gray-800 shadow-xl h-96">
    <h3 className="text-lg font-bold text-white mb-4">Revenue by Month</h3>
    <ResponsiveContainer width="100%" height="85%">
      <BarChart
        data={MONTHLY_DATA}
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_GRID_COLOR}
          vertical={false}
        />
        <XAxis dataKey="name" stroke={TEXT_GRAY} />
        <YAxis
          stroke={TEXT_GRAY}
          tickFormatter={(value) => `$${value / 1000}K`}
        />
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar dataKey="revenue" fill={NEON_ORANGE} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueBarChart;
