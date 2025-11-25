import { NEON_GRADIENT } from "@/types";

export const PricingToggle: React.FC<{ monthly: boolean; setMonthly: (m: boolean) => void }> = ({ monthly, setMonthly }) => (
  <div className="flex justify-center items-center mb-10">
    <span className={`mr-4 font-semibold ${monthly ? 'text-gray-400' : 'text-white'}`}>
      Yearly (Save 20%)
    </span>
    <button
      onClick={() => setMonthly(!monthly)}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors ${monthly ? 'bg-gray-700' : NEON_GRADIENT
        }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-6 w-6 transform translate-x-1 transition duration-200 ease-in-out bg-white rounded-full shadow-lg ${monthly ? 'translate-x-1' : 'translate-x-9'
          }`}
      />
    </button>
    <span className={`ml-4 font-semibold ${monthly ? 'text-white' : 'text-gray-400'}`}>
      Monthly
    </span>
  </div>
);

export type PricingCardProps = {
  title: string;
  price: string;
  features: string[];
  isFeatured: boolean;
  onCTA: (planName: string) => void;
  monthly: boolean;
};

export const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isFeatured, onCTA, monthly }) => {
  const buttonStyle = isFeatured
    ? `
      ${NEON_GRADIENT} text-white font-bold
      shadow-[0_0_15px_rgba(165,0,255,0.6)]
      hover:shadow-[0_0_20px_rgba(0,167,255,0.8)]
    `
    : 'bg-gray-700 text-gray-200 hover:bg-gray-600';

  return (
    <div
      className={`
        bg-gray-900/50 p-8 rounded-3xl border transition duration-300 backdrop-blur-sm
        ${isFeatured
          ? 'border-[#A500FF] shadow-2xl shadow-purple-500/20'
          : 'border-gray-800 hover:border-gray-700'}
        flex flex-col h-full
      `}
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {isFeatured && <p className="text-sm font-semibold text-[#00A7FF]">Most Popular</p>}
        {title !== 'Free' && !monthly && (
          <p className="text-xs mt-1 text-green-400 font-medium">Save 20% annually</p>
        )}
        <p className="mt-4 text-4xl font-extrabold text-white">{price}</p>
        <p className="text-gray-500 mt-1">
          {title === 'Free' ? '' : monthly ? 'per month' : 'per year (paid annually)'}
        </p>
      </div>
      <ul className="space-y-3 text-gray-300 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-start">
            <svg className="w-5 h-5 text-[#00A7FF] mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onCTA(title)}
        className={`w-full mt-8 py-3 rounded-xl transition duration-300 transform hover:scale-[1.02] ${buttonStyle}`}
      >
        {title === 'Free' ? 'Sign up for Free' : isFeatured ? 'Get Started' : 'Select Plan'}
      </button>
    </div>
  );
};