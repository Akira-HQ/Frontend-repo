"use client";

const SECONDARY_KPIS = [
  { label: "Bounce Rate", value: "32%", progress: 0.32 },
  { label: "Avg Session Duration", value: "2m 15s", progress: 0.5 },
  { label: "Pages per Session", value: "3.5", progress: 0.75 },
];

const KpiBreakdown: React.FC = () => (
  <div className="p-6 bg-[#0b0b0b] rounded-xl border border-gray-800 shadow-xl h-96">
    <h3 className="text-lg font-bold text-white mb-6">
      AI Performance Metrics
    </h3>
    <div className="space-y-6">
      {SECONDARY_KPIS.map((kpi, index) => (
        <div key={index} className="border-b border-gray-800 pb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-300">{kpi.label}</span>
            <span className="text-xl font-bold text-white">{kpi.value}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-green-400 to-green-600"
              style={{ width: `${kpi.progress * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Target 100% efficiency.</p>
        </div>
      ))}
    </div>
  </div>
);

export default KpiBreakdown;
