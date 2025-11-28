import React from 'react';
import { LucideIcon, CheckCircle } from 'lucide-react'; // Added CheckCircle for the list icon

// Assuming these types/constants are available via context or separate files
// For a standalone file, we mock the dependency:
const NEON_GRADIENT_CLASS = "bg-gradient-to-br from-[#A500FF] to-[#FFB300]";
type PricingCardProps = {
  title: string;
  price: string;
  description?: string; // Added description field to match the image format
  features: string[];
  isFeatured: boolean;
  onCTA: (planName: string) => void;
  monthly: boolean;
};

// Assuming NEON_GRADIENT is defined elsewhere as a constant string
const NEON_GRADIENT = "bg-gradient-to-br from-[#A500FF] to-[#FFB300]";

export const PricingToggle: React.FC<{ monthly: boolean; setMonthly: (m: boolean) => void }> = ({ monthly, setMonthly }) => (
  <div className="flex justify-center items-center mb-10 select-none">
    {/* Removed drop-shadow-lg for a gentler appearance */}
    <span className={`mr-4 font-semibold text-xl transition-colors duration-300 ${!monthly ? 'text-white' : 'text-gray-500'}`}>
      Yearly (Save 20%)
    </span>
    <button
      onClick={() => setMonthly(!monthly)}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 shadow-inner ${monthly ? 'bg-gray-800' : NEON_GRADIENT
        }`}
    >
      <span
        aria-hidden="true"
        className={`
          inline-block h-6 w-6 transform transition-all duration-300 ease-in-out bg-white rounded-full shadow-lg border-2 border-transparent
          ${monthly ? 'translate-x-1' : 'translate-x-9 shadow-purple-500/80'}
        `}
      />
    </button>
    {/* Removed drop-shadow-lg for a gentler appearance */}
    <span className={`ml-4 font-semibold text-xl transition-colors duration-300 ${monthly ? 'text-white' : 'text-gray-500'}`}>
      Monthly
    </span>
  </div>
);

export const PricingCard: React.FC<PricingCardProps> = ({ title, price, description, features, isFeatured, onCTA, monthly }) => {
  const buttonStyle = NEON_GRADIENT_CLASS; // Always use neon gradient for button in this aesthetic

  // Determine the primary glow color based on feature status
  const glowColor = isFeatured ? 'from-[#A500FF]/50' : 'from-[#FFB300]/50';
  const baseShadow = isFeatured ? 'shadow-purple-900/40' : 'shadow-orange-900/40';
  // Define the bright shadow for hover (using a custom shadow utility)
  const hoverShadow = isFeatured ? 'hover:shadow-[0_0_40px_rgba(165,0,255,0.9)]' : 'hover:shadow-[0_0_40px_rgba(255,179,0,0.5)]';

  return (
    <div
      className={`
        bg-white/5 p-2 rounded-3xl border transition duration-500 backdrop-blur-sm group
        ${isFeatured
          ? `border-[#A500FF] shadow-3xl ${baseShadow} transform scale-[1.03]`
          : 'border-gray-800 hover:border-gray-600'}
        flex flex-col h-full overflow-hidden
        relative
        ${hoverShadow}
        hover:scale-[1.05]
      `}
    >

      {/* ABSOLUTE GLOWING DIV WITH FADE (FIXED) */}
      {/* Adjusted opacity on hover for a gentler glow */}
      <div className={`absolute w-full top-0 z-10 h-[300px] left-0 bg-gradient-to-b ${glowColor} to-transparent opacity-30 group-hover:opacity-40 transition duration-500`}></div>

      {/* Content Wrapper (to sit above the absolute glow) */}
      <div className='bg-gray-900/90 w-full rounded-[20px] p-6 mb-6 z-20'>
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <h3 className="text-3xl font-extrabold text-white">{title}</h3>
            {isFeatured && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/80 text-white shadow-md shadow-blue-900/50">
                Best Value
              </span>
            )}
          </div>
          {description && <p className="text-sm text-gray-300 mt-2">{description}</p>}
        </div>

        {/* Price Block */}
        <div className="bg-gray-800/70 rounded-2xl p-4 -mx-4 mb-8 ">
          <p className="text-5xl font-extrabold text-white">{price}</p>
          <p className="text-sm text-gray-400 mt-1">
            {title === 'Free' ? 'Forever Free' : (monthly ? 'per month, paid monthly' : 'per year, paid annually')}
          </p>
        </div>

        {/* CTA Button (always neon/gradient) */}
        <button
          onClick={() => onCTA(title)}
          className={`
          w-full py-3 rounded-xl transition duration-300 font-bold mb-8
          ${buttonStyle} text-white shadow-lg shadow-purple-500/60
          hover:opacity-90
        `}
        >
          {title === 'Free' ? 'Get Started Free' : 'Get Started'}
        </button>
      </div>

      {/* Features List (sits below the gradient fade) */}
      <ul className="space-y-4 p-6 pt-0 text-gray-300 flex-grow z-20">
        {features.map((f, i) => (
          <li key={i} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-[#FFB300] mr-3 flex-shrink-0 drop-shadow-md" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
};