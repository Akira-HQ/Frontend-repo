"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";

// --- Icons ---
const IconCheckCircle = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconXCircle = () => (
  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconInfoCircle = () => (
  <svg className="w-6 h-6 text-[#00A7FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconClose = () => (
  <svg className="w-5 h-5 text-gray-500 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TAILWIND_ANIMATIONS_STYLE = `
.animate-slide-in { animation: slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
.animate-slide-out { animation: slide-out 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
@keyframes slide-in { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
@keyframes slide-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(100%); } }
`;

const NotificationContainer = () => {
  const { toasts, removeToast } = useAppContext();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    if (dismissedIds.includes(id)) return;
    setDismissedIds((prev) => [...prev, id]);
    setTimeout(() => {
      removeToast(id);
      setDismissedIds((prev) => prev.filter((mid) => mid !== id));
    }, 500);
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    toasts.forEach((toast) => {
      if (!dismissedIds.includes(toast.id)) {
        const timeoutId = setTimeout(() => handleDismiss(toast.id), 5000);
        timers.push(timeoutId);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismissedIds]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <IconCheckCircle />;
      case "error": return <IconXCircle />;
      case "warning": return <IconWarning />;
      case "info": return <IconInfoCircle />;
      default: return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TAILWIND_ANIMATIONS_STYLE }} />
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-85 p-4 bg-gray-900/90 text-gray-200 text-base rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-md flex items-center space-x-3 transition-all ${dismissedIds.includes(toast.id) ? "animate-slide-out" : "animate-slide-in"}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 font-medium leading-tight">{toast.message}</div>
            <button onClick={() => handleDismiss(toast.id)} className="flex-shrink-0"><IconClose /></button>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationContainer;