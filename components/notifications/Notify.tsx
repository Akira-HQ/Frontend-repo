import { Notification } from "@/types";
import { useState } from "react";
import {
  IoMegaphoneOutline,
  IoShieldCheckmarkOutline,
  IoWarningOutline,
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoAlertCircleOutline,
  IoCalendarOutline,
  IoSparklesOutline // Replacing HiSparkles with Io equivalent for consistency
} from "react-icons/io5";

interface NotifyProps {
  notification: Notification;
  onDismiss: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalUnread: number;
  liveQuotas?: any[];
}

export default function Notify({
  notification,
  onDismiss,
  onNext,
  onPrev,
  currentIndex,
  totalUnread,
  liveQuotas = []
}: NotifyProps) {
  const [isExisting, setIsExisting] = useState<boolean>(false);

  // --- 1. DYNAMIC QUOTA EXTRACTION ---
  const quotaData = liveQuotas.find(q =>
    (notification.id.includes('audit') && (q.id === 'daily_audits' || q.id === 'monthly_audits')) ||
    (notification.id.includes('enhance') && q.id === 'daily_enhance') ||
    (notification.id.includes('general') && q.id === 'monthly_total')
  );

  const getQuotaStatus = () => {
    // ⚡️ FIX: Use string comparison to bypass strict NotificationType check for new alerts
    if ((notification.type as string) === "EXPIRATION_ALERT") {
      return {
        color: "text-purple-500",
        bg: "bg-purple-500",
        val: (notification.data as any).daysLeft || 0
      };
    }

    if (!quotaData) return { color: "text-blue-500", bg: "bg-blue-500", val: 0 };

    const used = Number(quotaData.used) || 0;
    const limit = Number(quotaData.limit) || 1;
    const remaining = Math.max(0, limit - used);
    const percentUsed = (used / limit) * 100;

    if (remaining === 0) {
      return {
        color: "text-red-500",
        bg: "bg-red-500",
        val: 0,
        icon: <IoAlertCircleOutline className="text-red-500 h-6 w-6 animate-pulse" />
      };
    }

    if (percentUsed > 85 || remaining < 5) {
      return { color: "text-amber-500", bg: "bg-amber-500", val: remaining };
    }

    return { color: "text-[#A500FF]", bg: "bg-[#A500FF]", val: remaining };
  };

  const status = getQuotaStatus();

  const getNotificationIcon = (type: string) => {
    if (status.icon && type === "USAGE_ALERT") return status.icon;

    switch (type) {
      case "USAGE_ALERT":
        return <IoWarningOutline className={`${status.color} h-6 w-6`} />;
      case "EXPIRATION_ALERT":
        return <IoCalendarOutline className="text-purple-400 h-6 w-6" />;
      case "ANNOUNCEMENT":
        return <IoMegaphoneOutline className="text-blue-400 h-6 w-6" />;
      case "SECURITY_TIP":
        return <IoShieldCheckmarkOutline className="text-green-500 h-6 w-6" />;
      default:
        return <IoSparklesOutline className="text-amber-500 h-6 w-6" />;
    }
  };

  const handleLocalDismiss = () => {
    setIsExisting(true);
    setTimeout(() => onDismiss(), 500);
  };

  return (
    <div className={`transition-all duration-500 flex flex-col border border-white/10 bg-[#020509] rounded-xl shadow-2xl p-3 -ml-2 ${isExisting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
      <div className="w-full flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification?.type as string)}
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-white text-sm tracking-tight">
            {notification?.data.title}
          </h3>
          <p
            className="text-[11px] text-gray-400 mt-1 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: notification?.data.message.replace(
                "{value}",
                `<span class="${status.color} font-black">${status.val}</span>`,
              ),
            }}
          />

          {notification?.type === "USAGE_ALERT" && quotaData && (
            <div className="mt-3">
              <div className="flex justify-between text-[8px] uppercase font-black tracking-widest text-gray-600 mb-1">
                <span>{quotaData.label || 'Utilization'}</span>
                <span>{((quotaData.used / quotaData.limit) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <div
                  className={`${status.bg} h-1 rounded-full transition-all duration-1000 shadow-[0_0_8px] shadow-current`}
                  style={{ width: `${(quotaData.used / quotaData.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleLocalDismiss} className="text-gray-600 hover:text-white transition-colors">
          <IoClose size={18} />
        </button>
      </div>

      {totalUnread > 1 && (
        <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <button onClick={onPrev} disabled={currentIndex === 0} className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-20 text-white transition-all">
              <IoChevronBack size={14} />
            </button>
            <button onClick={onNext} disabled={currentIndex === totalUnread - 1} className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-20 text-white transition-all">
              <IoChevronForward size={14} />
            </button>
          </div>
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
            {currentIndex + 1} of {totalUnread}
          </span>
        </div>
      )}
    </div>
  );
}