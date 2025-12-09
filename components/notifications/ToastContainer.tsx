"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";

const IconCheckCircle: React.FC<{ className?: string }> = ({
  className = "text-green-500",
}) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconXCircle: React.FC<{ className?: string }> = ({
  className = "text-red-500",
}) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconInfoCircle: React.FC<{ className?: string }> = ({
  className = "text-[#00A7FF]",
}) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconClose: React.FC<{ size?: number; className?: string }> = ({
  className = "text-gray-500",
}) => (
  <svg
    className={`w-6 h-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// --- Tailwind CSS Animation Definition ---

const TAILWIND_ANIMATIONS_STYLE = `
/* Keyframes for sliding up from the bottom (In) and sliding down (Out) */
.animate-slide-in {
  animation: slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
.animate-slide-out {
  animation: slide-out 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slide-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
`;

const NotificationContainer = () => {
  // This hook reads your toasts and removeToast function from AppProvider
  const { toasts, removeToast } = useAppContext();

  // State to manage the transition (exit animation) of individual toasts
  // This replaces your original isFading array logic
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    if (dismissedIds.includes(id)) return;

    // 1. Trigger the slide-out animation by adding ID to dismissedIds
    setDismissedIds((prev) => [...prev, id]);

    // 2. Remove the toast from context after the animation completes (0.5s)
    setTimeout(() => {
      removeToast(id);
      // Clean up dismissedIds state
      setDismissedIds((prev) => prev.filter((mid) => mid !== id));
    }, 500);
  };

  // Auto-dismiss logic (Based on your original 5000ms timer)
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    toasts.forEach((toast) => {
      // Only set a timer if the toast is newly added and not currently fading out
      if (!dismissedIds.includes(toast.id)) {
        const timeoutId = setTimeout(() => {
          handleDismiss(toast.id);
        }, 5000); // 5 seconds duration
        timers.push(timeoutId);
      }
    });

    // Cleanup function to clear timeouts when toasts change or component unmounts
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismissedIds]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <IconCheckCircle />;
      case "error":
        return <IconXCircle />;
      case "info":
        return <IconInfoCircle />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Inject global animations (required for slide-in/out effects) */}
      <style dangerouslySetInnerHTML={{ __html: TAILWIND_ANIMATIONS_STYLE }} />

      {/* Container for stacking toasts from the bottom right */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end space-y-3">
        {toasts.map((toast) => {
          const isDismissing = dismissedIds.includes(toast.id);
          return (
            <div
              key={toast.id}
              // Apply dark theme UI and slide animations
              className={`
                                w-80 p-4 bg-gray-900 text-gray-200 text-base rounded-xl 
                                shadow-2xl border border-gray-700 backdrop-blur-sm
                                flex items-center space-x-3 
                                transition-transform duration-500
                                ${isDismissing ? "animate-slide-out" : "animate-slide-in"}
                            `}
            >
              {getIcon(toast.type)}
              <div className="flex-1 font-medium">{toast.message}</div>

              <button
                onClick={() => handleDismiss(toast.id)}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
              >
                <IconClose className="text-gray-500 hover:text-white w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationContainer;
