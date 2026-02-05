"use client";
import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
} from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Theme Context (same as before)
type ThemeContextType = { isDarkMode: boolean; toggleDarkMode: () => void };
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ShimmerTitle (same as before)
const ShimmerTitle: React.FC = () => (
  <>
    <style jsx global>{`
      @keyframes shimmer {
        0% { background-position: -400% 0; }
        100% { background-position: 400% 0; }
      }
      .shimmer-text {
        background: linear-gradient(90deg, #ffffff 0%, #a500ff 25%, #00a7ff 50%, #a500ff 75%, #ffffff 100%);
        background-size: 400% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 20s infinite linear;
      }
    `}</style>
    <div className="shimmer-text text-xl md:text-2xl font-extrabold tracking-wider cursor-pointer">
      Cliva
    </div>
  </>
);

// Header with scroll spy
export const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();

  // Determine if the header should be minimal (logo only)
  const isMinimalHeader =
    pathname.startsWith("/dashboard") ||
    pathname === "/register/sign-in" ||
    pathname.startsWith("/register") ||
    pathname === "/waitlist" ||
    pathname.startsWith("/early-access");

  const navLinks = [
    { id: "hero", label: "Hero" },
    { id: "features", label: "Features" },
    { id: "why-cliva", label: "Why Cliva" },
    { id: "capacity", label: "Capacity" },
    { id: "how-it-works", label: "How It Works" },
    { id: "conversation", label: "Conversation" },
    { id: "integration", label: "Integrations" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonial", label: "Testimonials" },
  ];

  const [active, setActive] = useState("hero");
  const [mobileMenu, setMobileMenu] = useState(false);

  // Scroll spy
  useEffect(() => {
    // Only run scroll spy if the header is not minimal
    if (isMinimalHeader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }, // triggers when section is in middle of screen
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navLinks, isMinimalHeader]);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/10 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        <ShimmerTitle />

        {/* Desktop Nav (Hidden in minimal mode) */}
        {!isMinimalHeader && (
          <nav className="hidden md:flex space-x-2 bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-lg">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScroll(link.id)}
                className="relative px-4 py-1.5 text-sm font-medium text-gray-300"
              >
                {active === link.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#A500FF] to-[#FFB300] opacity-40"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Mobile Menu Button (Hidden in minimal mode) */}
        {!isMinimalHeader && (
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              {mobileMenu ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        )}

        {/* Theme & CTA (Hidden in minimal mode) */}
        {!isMinimalHeader && (
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>

            <a
              // href="#pricing"
              href="/waitlist"
              className="hidden sm:block px-4 py-2 rounded-xl text-white text-sm font-semibold
                bg-gradient-to-r from-[#00A7FF] to-[#A500FF]
                shadow-[0_0_12px_rgba(165,0,255,0.4)]
                hover:scale-[1.05] transition-transform"
            >
              Get Started
            </a>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown (Only shown if mobileMenu is true AND not minimal) */}
      <AnimatePresence>
        {mobileMenu && !isMinimalHeader && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/95 backdrop-blur-lg rounded-xl mx-4 mt-2 p-4 absolute w-[calc(100%-2rem)] left-0 right-0 shadow-xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScroll(link.id)}
                className={`block w-full text-left px-4 py-2 mb-2 rounded-lg ${active === link.id
                    ? "bg-gradient-to-r from-[#A500FF] to-[#FFB300] text-white"
                    : "text-gray-300 hover:bg-white/10"
                  } transition`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
