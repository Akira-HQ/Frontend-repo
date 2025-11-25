"use client"
import React, { createContext, useContext, useState } from 'react';
import { Zap, X, AlertTriangle, CheckCircle } from 'lucide-react';

// --- PLACEHOLDER FOR CONTEXT/HOOKS (To enable standalone compilation) ---

// Define the shape of the context data required by this component
interface AlertContextProps {
  alertMessage: string;
  alertType: 'success' | 'error' | 'loading' | null;
  setAlertMessage: (message: string, type?: 'success' | 'error' | 'loading' | null) => void;
}

// Minimal Context Definition Placeholder (MUST BE REPLACED by actual useAppContext in your project)
const PlaceholderContext = createContext<AlertContextProps | undefined>(undefined);

// Placeholder Hook implementation
const useAppContext = (): AlertContextProps => {
  // This hook is a mock implementation for demonstration and compilation purposes only.
  // Replace the return value with the actual call to your application's context hook.
  // Mock State for demonstration:
  const [mockAlert, setMockAlert] = useState<{ message: string, type: 'success' | 'error' | 'loading' | null }>({
    message: 'Example critical fetch error or form summary.',
    type: 'error'
  });

  const setMockAlertMessage = (message: string, type: 'success' | 'error' | 'loading' | null = null) => {
    setMockAlert({ message, type });
    if (message && type !== 'loading') {
      setTimeout(() => setMockAlert({ message: '', type: null }), 4000);
    }
  };

  // NOTE: If you remove this placeholder, ensure you import your REAL useAppContext hook.
  return {
    alertMessage: mockAlert.message,
    alertType: mockAlert.type,
    setAlertMessage: setMockAlertMessage as unknown as AlertContextProps['setAlertMessage'], // Cast for type compatibility
  };
};

// --- END PLACEHOLDER ---


// Neon Gradient Class (Must be consistent with other components)
const NEON_GRADIENT = "bg-gradient-to-r from-[#00A7FF] to-[#A500FF]";

export default function BannerAlert() {
  // We use the (real or mocked) useAppContext hook here
  const {
    alertMessage,
    alertType,
    setAlertMessage, // Used to clear the message on manual dismissal
  } = useAppContext();

  if (!alertMessage) {
    return null;
  }

  // Determine styling based on alertType
  let icon = null;
  let baseClasses = "bg-gray-800 border-l-4";
  let messageClasses = "text-white";

  switch (alertType) {
    case 'success':
      icon = <CheckCircle className="w-5 h-5 text-green-400" />;
      baseClasses += " border-green-500 shadow-lg shadow-green-500/10";
      break;
    case 'error':
      icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
      baseClasses += " border-red-500 shadow-lg shadow-red-500/10";
      break;
    case 'loading':
      icon = <Zap className="w-5 h-5 text-[#00A7FF] animate-pulse" />;
      baseClasses += " border-[#00A7FF] shadow-lg shadow-blue-500/10";
      messageClasses = "text-[#00A7FF]";
      break;
    default:
      // Default style if type is null/undefined
      icon = <CheckCircle className="w-5 h-5 text-gray-400" />;
      baseClasses += " border-gray-600";
      break;
  }

  // If the message is 'loading', we prevent manual dismissal as it's typically tied to an ongoing process
  const isLoading = alertType === 'loading';

  return (
    // Fixed positioning at the top, ensuring it doesn't block clicks below it (pointer-events-none)
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pt-16 md:pt-4 pointer-events-none">
      <div
        className={`
                    w-full max-w-4xl mx-auto p-4 rounded-xl flex items-center justify-between 
                    transition-opacity duration-300 transform 
                    ${baseClasses}
                    pointer-events-auto /* Re-enable pointer events on the banner itself */
                `}
        role="alert"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <p className={`font-medium ${messageClasses}`}>
            {alertMessage}
          </p>
        </div>

        {!isLoading && (
          <button
            // Manually clear the alertMessage state
            onClick={() => setAlertMessage('')}
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}