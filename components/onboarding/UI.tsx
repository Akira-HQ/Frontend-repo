// components/onboarding/UI.tsx
import React from "react";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-[2rem] p-8 shadow-2xl ${className}`}>
    {children}
  </div>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#A500FF]/50 transition-all placeholder:text-neutral-700"
  />
);

export const PrimaryButton = ({ children, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all active:scale-95 flex items-center justify-center gap-2 ${className}`}
  >
    {children}
  </button>
);

export const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex gap-2 mb-8">
    {[1, 2, 3].map((s) => (
      <div
        key={s}
        className={`h-1 rounded-full transition-all duration-500 ${s <= current ? "w-8 bg-[#A500FF]" : "w-4 bg-white/10"
          }`}
      />
    ))}
  </div>
);