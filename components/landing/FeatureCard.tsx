import React from "react";
import { LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div
    className="
      group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 
      flex flex-col items-start space-y-4 h-full
      transition duration-500 ease-in-out transform hover:scale-[1.02]
      hover:border-[#A500FF] 
      hover:shadow-2xl hover:shadow-purple-900/50 
    "
  >
    <div className="p-3 rounded-full bg-white/10 border border-white/20 transition duration-300 group-hover:bg-[#A500FF]/30">
      {/* Icon color is the vibrant purple, softening slightly on hover */}
      <Icon className="w-6 h-6 text-[#FFB300] transition duration-300 group-hover:text-[#A500FF]" />
    </div>
    <h3 className="text-xl font-bold text-white transition duration-300 group-hover:text-gray-50">
      {title}
    </h3>
    <p className="text-gray-400">{description}</p>
  </div>
);
