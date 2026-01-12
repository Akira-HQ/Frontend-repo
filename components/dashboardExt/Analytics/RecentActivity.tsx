"use client";
import React from "react";
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  Zap,
  User,
  Terminal
} from "lucide-react";

interface ActivityProps {
  data?: any[];
}

const RecentActivityTable: React.FC<ActivityProps> = ({ data }) => {
  const activities = data || [];

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return { color: "text-green-400", bg: "bg-green-500/10", icon: ShieldCheck };
      case "warning":
        return { color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertCircle };
      case "error":
        return { color: "text-red-400", bg: "bg-red-500/10", icon: Zap };
      default:
        return { color: "text-blue-400", bg: "bg-blue-500/10", icon: Clock };
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Terminal size={18} className="text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
              Event <span className="text-[#A500FF]">Stream</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Live Neural Activity</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Real-time</span>
        </div>
      </div>

      <div className="overflow-y-auto custom-scrollbar max-h-[400px]">
        <table className="min-w-full">
          <tbody>
            {activities.map((activity, index) => {
              const config = getStatusConfig(activity.status);
              const Icon = config.icon;

              return (
                <tr
                  key={index}
                  className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#A500FF]/30 transition-colors">
                        <User size={14} className="text-gray-500 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white tracking-tight">{activity.user}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{activity.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-300 font-medium leading-tight max-w-[200px] md:max-w-xs">
                      {activity.action}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${config.bg} ${config.color} border border-current/10`}>
                      <Icon size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{activity.status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="w-full py-4 text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-[0.3em] bg-white/5 transition-colors border-t border-white/5">
        View Full System Logs
      </button>
    </div>
  );
};

export default RecentActivityTable;