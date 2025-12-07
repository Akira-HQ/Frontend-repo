'use client'

import { ACCENT_BLUE, NEON_PURPLE } from "@/types";
import { useState } from "react";

const AnalyticsFilters: React.FC = () => {
  const [timeframe, setTimeframe] = useState('30days');
  return (
    <div className='bg-[#0b0b0b] rounded-xl p-4 border border-gray-800 flex justify-between items-center'>
      <div className='flex space-x-3'>
        {['7 days', '30 days', '90 days', 'Year'].map(label => (
          <button
            key={label}
            onClick={() => setTimeframe(label)}
            className={`text-xs font-medium px-4 py-2 rounded-full transition duration-200 
                            ${timeframe === label.replace(' ', '').toLowerCase()
                ? `bg-gradient-to-r from-[${ACCENT_BLUE}] to-[${NEON_PURPLE}] text-white shadow-md shadow-purple-900/50`
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/80'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search metrics or users..."
        className='w-64 p-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500'
      />
    </div>
  );
};


export default AnalyticsFilters