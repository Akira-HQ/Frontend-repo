"use client"
import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react'; // Using Lucide for icon consistency

// --- 1. Dark Mode Context Setup ---

// Define the shape of the context data
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to consume the theme context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component - wraps the application
type ThemeProviderProps = { children: React.ReactNode };

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Default to dark mode for the Akira aesthetic
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode]);

  // Effect to apply the 'dark' class to the root element for Tailwind
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


// --- 2. Shimmer Title Component ---
// Encapsulates the custom animation CSS for the shimmering text effect
const ShimmerTitle: React.FC = () => (
  <>
    {/* Injecting CSS for the custom animation */}
    <style jsx global>{`
      @keyframes shimmer {
        0% {
          background-position: -400% 0;
        }
        100% {
          background-position: 400% 0;
        }
      }
      .shimmer-text {
        /* Gradient defined using the neon colors */
        background: linear-gradient(
          90deg,
          #ffffff 0%,
          #a500ff 25%,
          #00a7ff 50%,
          #a500ff 75%,
          #ffffff 100%
        );
        background-size: 400% 100%; /* Wider than container for animation */
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 20s infinite linear;
      }
    `}</style>
    <div className="shimmer-text text-xl md:text-2xl font-extrabold tracking-wider cursor-pointer">
      Akira AI
    </div>
  </>
);

// --- 3. Header Component ---

type HeaderProps = {
  // Determines if the CTA button should link to #pricings (for homepage)
  isHomepage?: boolean;
};

const Header: React.FC<HeaderProps> = ({ isHomepage = true }) => {
  // Use the custom hook to access theme state
  const { isDarkMode, toggleDarkMode } = useTheme();

  // CTA Button Gradient style from previous design
  const NEON_GRADIENT = "bg-gradient-to-r from-[#00A7FF] to-[#A500FF]";

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50 transition-colors duration-300
        bg-black/5 backdrop-blur-md shadow-lg shadow-black/30
      "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left: Site Title with Shimmer Effect */}
        <ShimmerTitle />

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">

          {/* Optional Search Input (Commented out) */}
          {
            /* {!isHomepage && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00A7FF] transition-all hidden sm:block"
              />
            )}
            */
          }

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={`Toggle ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-full text-gray-300 hover:bg-white/10 transition duration-200"
          >
            {isDarkMode
              ? <Sun className="w-5 h-5 text-amber-300 hover:text-white" />
              : <Moon className="w-5 h-5 text-gray-700 hover:text-black" />
            }
          </button>

          {/* CTA Button (Only on Homepage) */}
          {isHomepage && (
            <a
              href="#pricings"
              className={`
                hidden sm:block text-white font-semibold py-2 px-4 rounded-xl text-sm
                transition duration-300 ease-in-out transform hover:scale-[1.05]
                ${NEON_GRADIENT} shadow-[0_0_15px_rgba(165,0,255,0.4)]
              `}
            >
              Get Started
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

// Export both the main component and the provider for application-wide usage
export { Header, ThemeProvider, useTheme };