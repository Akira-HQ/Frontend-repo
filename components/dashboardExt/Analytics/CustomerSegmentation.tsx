'use client'
import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Cell } from 'recharts';
import { Users, Target, Clock, MessageCircle, DollarSign, Zap } from 'lucide-react';

const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#00A7FF";
const CHART_GRID_COLOR = "#374151";
const TEXT_GRAY = "#9ca3af";

// Mock Data: Classified customer groups based on behavior
const SEGMENTS_DATA = [
  { name: 'Fast Deciders', count: 180, AOV_Factor: 1.2, color: NEON_ORANGE },
  { name: 'Loyalty Tier 1', count: 95, AOV_Factor: 1.5, color: NEON_PURPLE },
  { name: 'Price Sensitive', count: 320, AOV_Factor: 0.8, color: ACCENT_BLUE },
  { name: 'Feature Inquirer', count: 150, AOV_Factor: 1.0, color: '#f87171' },
];

// --- NEW COMPONENT: Segment Explanation Panel ---
const ExplanationPanel: React.FC = () => (
  <div className='p-4 bg-gray-900 rounded-xl border border-gray-700 h-full'>
    <h4 className='text-lg font-bold text-[#FFB300] mb-3 flex items-center gap-2'>
      <Zap className='w-4 h-4' /> Actionable Personas
    </h4>
    <p className='text-sm text-gray-400 mb-4'>
      Akira automatically classifies store visitors based on their chat history and purchase intent. Use these insights for targeted marketing.
    </p>

    <div className='space-y-3'>
      <div className='flex items-start gap-3'>
        <span className='w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-yellow-500'></span>
        <div>
          <h5 className='font-semibold text-white'>Fast Deciders</h5>
          <p className='text-xs text-gray-400'>**Strategy:** Use low-stock alerts or limited-time offers to convert them instantly.</p>
        </div>
      </div>
      <div className='flex items-start gap-3'>
        <span className='w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-[#A500FF]'></span>
        <div>
          <h5 className='font-semibold text-white'>Loyalty Tier 1</h5>
          <p className='text-xs text-gray-400'>**Strategy:** Target with exclusive sneak-previews or early access to new collections.</p>
        </div>
      </div>
      <div className='flex items-start gap-3'>
        <span className='w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-[#00A7FF]'></span>
        <div>
          <h5 className='font-semibold text-white'>Price Sensitive</h5>
          <p className='text-xs text-gray-400'>**Strategy:** Mention financing or package deals early in the conversation.</p>
        </div>
      </div>
      <div className='flex items-start gap-3'>
        <span className='w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-red-400'></span>
        <div>
          <h5 className='font-semibold text-white'>Feature Inquirer</h5>
          <p className='text-xs text-gray-400'>**Strategy:** Ensure product descriptions are comprehensive, linking them to deep specs/guides.</p>
        </div>
      </div>
    </div>
  </div>
);


const CustomerSegmentsChart: React.FC = () => {
  return (
    <div className='p-6 bg-[#0b0b0b] rounded-xl border border-gray-800 shadow-xl h-auto'>
      <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
        <Target className='w-5 h-5 text-[#A500FF]' />
        AI Customer Segmentation
      </h3>
      <p className='text-sm text-gray-400 mb-6'>
        Akira classifies customers by persona, optimizing sales strategies for each group.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96 lg:h-[400px]">
        {/* Left Column: Chart Visualization */}
        <div className='h-full'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SEGMENTS_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} />
              <XAxis dataKey="name" stroke={TEXT_GRAY} />
              <YAxis stroke={TEXT_GRAY} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name, props) => [`${value} customers`, 'Count']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', color: TEXT_GRAY }} />
              <Bar dataKey="count" name="Customer Count" radius={[4, 4, 0, 0]}>
                {SEGMENTS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Column: Explanation Panel (New Addition) */}
        <ExplanationPanel />
      </div>
    </div>
  );
};

export default CustomerSegmentsChart;