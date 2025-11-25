"use client"

import React, { useContext, createContext } from 'react';
import { Linkedin, Twitter, Github, MessageCircle } from 'lucide-react';

// --- 1. Theme Context Placeholder (Replicated for component independence) ---
// In a production Next.js app, this should be imported from your ThemeContext file.
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.error('useTheme must be used within a ThemeProvider.');
    return { isDarkMode: true, toggleDarkMode: () => { } }; // Default fallback
  }
  return context;
};

// --- 2. Shimmer Title Component (Replicated from Header) ---
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
      .shimmer-text-footer {
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
        animation: shimmer 15s infinite linear;
      }
    `}</style>
    <div className="shimmer-text-footer text-2xl font-extrabold tracking-wider">
      Akira AI
    </div>
  </>
);

// --- 3. Footer Component ---

const Footer: React.FC = () => {
  // Use a strong purple-blue accent for links/icons
  const ACCENT_COLOR_BLUE = "#00A7FF";
  const ACCENT_COLOR_PURPLE = "#A500FF";

  // Link Column Definitions
  const links = {
    product: [
      { name: 'Overview', href: '/' },
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricings' },
      { name: 'Demo', href: '/demo' },
      { name: 'Dashboard', href: '/dashboard' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Guides', href: '/guides' },
      { name: 'Docs', href: '/docs' },
      { name: 'API', href: '/api' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  // Social icons data
  const socialIcons = [
    { icon: Linkedin, href: 'https://linkedin.com/company/akira-ai', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/akira-ai', label: 'X (Twitter)' },
    { icon: Github, href: 'https://github.com/akira-ai', label: 'GitHub' },
  ];

  // Helper Component for a Link Column
  const LinkColumn: React.FC<{ title: string, items: { name: string, href: string }[] }> = ({ title, items }) => (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white mb-2 tracking-wider uppercase">{title}</h4>
      <ul className="space-y-3">
        {items.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className={`text-sm font-medium text-gray-400 hover:text-[${ACCENT_COLOR_BLUE}] transition-colors duration-200`}
              aria-label={link.name}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="
      relative z-10 
      bg-gray-950/90 border-t border-gray-800 
      shadow-[0_-5px_20px_rgba(0,0,0,0.5)] 
      py-16 md:py-20
    ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-6 lg:gap-20">

          {/* 1. Brand Section (Left-most column) */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <ShimmerTitle />
            <p className="text-sm text-gray-400 max-w-xs">
              Autonomous sales management for e-commerce, powered by intelligent AI.
            </p>

            {/* Social Icons (Mobile: below mission, Desktop: in column) */}
            <div className="flex space-x-5 pt-2">
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-500 hover:text-[${ACCENT_COLOR_PURPLE}] transition-colors duration-200`}
                    aria-label={`Akira AI on ${social.label}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 2. Product Links */}
          <LinkColumn title="Product" items={links.product} />

          {/* 3. Company Links */}
          <LinkColumn title="Company" items={links.company} />

          {/* 4. Resources Links */}
          <LinkColumn title="Resources" items={links.resources} />

          {/* 5. Legal Links */}
          <LinkColumn title="Legal" items={links.legal} />

        </div>

        {/* --- BOTTOM ROW: COPYRIGHT --- */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 flex justify-center text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Akira AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;