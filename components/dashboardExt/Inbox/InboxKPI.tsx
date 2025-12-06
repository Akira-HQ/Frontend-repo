'use client'
import React from 'react';
// FIX: Using Lucide imports
import { ArrowUpRight } from 'lucide-react';
// NOTE: Assuming alias resolution for shared types
import { Metric } from '../../../types';

interface KPIProps {
  metrics: Metric[];
}

const KPI_Card: React.FC<{ metric: Metric }> = ({ metric }) => {
  // 1: up (green), -1: down (red), 0: neutral (gray)
  const trendColor = metric.trend === 1 ? 'text-green-400' : metric.trend === -1 ? 'text-red-400' : 'text-gray-400';

  // Icon changes direction and color based on trend value
  const trendIcon = metric.trend === 1 ? (
    <ArrowUpRight className='w-4 h-4' /> // Normal Up Right
  ) : metric.trend === -1 ? (
    <ArrowUpRight className='w-4 h-4 rotate-[135deg]' /> // Rotated for Down Left (Red)
  ) : null;

  return (
    <div className='p-4 bg-gray-900 rounded-xl border border-gray-800 shadow-lg flex flex-col justify-between h-full'>
      <h4 className='text-sm text-gray-400 font-medium mb-2'>{metric.label}</h4>
      <div className='flex justify-between items-center'>
        <span className='text-2xl font-bold text-white'>{metric.value}</span>
        {trendIcon && <span className={`p-1 rounded-full bg-white/5 ${trendColor}`}>{trendIcon}</span>}
      </div>
    </div>
  );
};


export const InboxKPIs: React.FC<KPIProps> = ({ metrics }) => {
  return (
    <div className='grid grid-cols-4 gap-6 mb-8'>
      {metrics.map((metric, index) => (
        <KPI_Card key={index} metric={metric} />
      ))}
    </div>
  );
};