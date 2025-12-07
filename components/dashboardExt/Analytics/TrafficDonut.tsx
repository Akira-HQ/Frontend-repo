'use client'
import { ACCENT_BLUE, NEON_ORANGE, NEON_PURPLE, TEXT_GRAY } from "@/types";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const TRAFFIC_DATA = [
  { name: 'Direct', value: 400, color: NEON_PURPLE },
  { name: 'Organic', value: 300, color: NEON_ORANGE },
  { name: 'Social', value: 300, color: ACCENT_BLUE },
  { name: 'Referral', value: 200, color: '#f87171' },
];

const TrafficDonutChart: React.FC = () => (
  <div className='p-6 bg-[#0b0b0b] rounded-xl border border-gray-800 shadow-xl h-96 flex flex-col'>
    <h3 className='text-lg font-bold text-white mb-4'>Traffic Source Distribution</h3>
    <div className="flex-1 flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={TRAFFIC_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {TRAFFIC_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px', color: TEXT_GRAY }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TrafficDonutChart