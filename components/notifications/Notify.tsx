'use client'
import { Notification } from "@/types"
import { useState } from "react";
import { IoMegaphoneOutline, IoShieldCheckmarkOutline, IoWarningOutline, IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5"

interface NotifyProps {
  notification: Notification;
  onDismiss: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalUnread: number;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'USAGE_ALERT':
      return <IoWarningOutline className="text-yellow-500 h-6 w-6" />;
    case 'ANNOUNCEMENT':
      return <IoMegaphoneOutline className="text-blue-500 h-6 w-6" />;
    case 'SECURITY_TIP':
      return <IoShieldCheckmarkOutline className="text-green-500 h-6 w-6" />;
    default:
      return null;
  }
}

export default function Notify({ notification, onDismiss, onNext, onPrev, currentIndex, totalUnread, ...props }: NotifyProps) {
  const showControls = totalUnread > 1;
  const [isExisting, setIsExisting] = useState<boolean>(false);

  const handleLocalDismiss = () => {
    setIsExisting(true)

    setTimeout(() => {
      onDismiss()
    }, 500)
  }

  return (
    <div className={`transition-opacity mr-[6px] flex flex-col border border-gray-200 bg-[#020509] rounded-lg shadow-xl p-2 -ml-2 duration-500 ease-out ${isExisting ? "animate-fade-out" : "animate-fade-in"}`}>
      <div className={`${isExisting ? "animate-fade-out" : "animate-fade-in"} duration-300 transition-all`}>
        <div className="w-full pb-2 flex items-start gap-4 ">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification?.type)}
          </div>

          <div className="flex-grow">
            <h3 className="font-semibold text-white">{notification?.data.title}</h3>
            <p className="text-sm text-gray-400 mt-1"
              dangerouslySetInnerHTML={{
                __html: notification?.data.message.replace('{value}', `<b>${(notification.data as any).progress?.value || ''}</b>`)
              }}
            />

            {notification?.type === 'USAGE_ALERT' && (
              <div className="mt-2">
                <div className="w-full bg-white rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${notification?.data.progress.value}` }}></div>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLocalDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
        {showControls && (
          <div className="bg-[#101215] border-t border-gray-700 rounded-md px-3 py-0.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button onClick={onPrev}
                disabled={currentIndex === 0}
                className="disabled:opacity-40 disabled:cursor-not-allowed p-1 rounded-full hover:bg-gray-700"
              >
                <IoChevronBack />
              </button>

              <button onClick={onNext}
                disabled={currentIndex === totalUnread - 1}
                className="disabled:opacity-40 disabled:cursor-not-allowed p-1 rounded-full hover:bg-gray-700"
              >
                <IoChevronForward />
              </button>
            </div>

            <span className="text-xs font-medium text-gray-400">
              {currentIndex + 1} of {totalUnread}
            </span>
          </div>
        )}
      </div>


    </div>
  )
}