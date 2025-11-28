import React from 'react';
import { Zap, Home, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Removed problematic import

// FIX: Mock useRouter to prevent compilation errors in isolated environments
// const useRouter = () => ({
//   push: (path: string) => console.log(`[Mock Router] Navigating to: ${path}`),
// });


// Define the core neon colors for consistency
const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";

// Custom styles for the background glows and animations
const customStyles = `
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 10s infinite alternate ease-in-out;
}
.bg-radial-gradient-purple {
  background: radial-gradient(circle at center, rgba(165, 0, 255, 0.15), transparent 50%);
}
`;


export default function NotFound() {

  // FIX: Calling useRouter hook INSIDE the functional component
  const router = useRouter();

  // Now handleNavigate uses the proper router instance
  const handleNavigate = (path: string) => {
    // router.push(path); // Use the mock push function which logs the action
    router.push(path);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-inter overflow-hidden flex items-center justify-center text-center">
      <style>{customStyles}</style>

      {/* Background Glows (Matching Hero Section) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-radial-gradient-purple opacity-20"></div>
      </div>

      {/* Content Card (Glassmorphism Effect) */}
      <div
        className="relative z-10 p-10 md:p-16 rounded-3xl bg-white/5 backdrop-blur-md 
                   border border-[#A500FF]/50 max-w-lg w-full
                   shadow-2xl shadow-purple-900/60 transition duration-500"
      >

        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-extrabold mb-4 
                       bg-clip-text text-transparent bg-gradient-to-r from-[#A500FF] to-[#FFB300]">
          404
        </h1>

        {/* Main Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          <Zap className="w-8 h-8 inline text-[#FFB300] mr-2 drop-shadow-md" />
          Connection Lost
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
          The autonomous sales agent could not locate the requested endpoint. The path may have been decommissioned or moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">

          {/* Primary CTA: Go Home */}
          <button
            onClick={() => handleNavigate('/')}
            className={`
              relative inline-flex items-center justify-center px-8 py-3 overflow-hidden text-lg font-medium text-white rounded-full group 
              bg-gradient-to-br from-[${NEON_PURPLE}] to-[${NEON_ORANGE}] transition duration-300 
              shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-900/70
            `}
          >
            <span className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Return to Base</span>
            </span>
          </button>

          {/* Secondary CTA: Login/Dashboard */}
          <button
            onClick={() => handleNavigate('/login')}
            className={`
              relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full 
              border border-white/20 text-gray-300 transition duration-300 hover:border-[${NEON_ORANGE}] hover:text-white
            `}
          >
            <span className="flex items-center space-x-2">
              <LogIn className="w-5 h-5" />
              <span>Access Dashboard</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}