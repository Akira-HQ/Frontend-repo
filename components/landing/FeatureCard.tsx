import { LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div
    className="
      group bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm
      flex flex-col items-start space-y-4
      transition duration-300 ease-in-out transform hover:scale-[1.02]
      hover:border-[#A500FF] hover:shadow-[0_0_15px_rgba(165,0,255,0.3)]
    "
  >
    <div className="p-3 rounded-full bg-gray-800/70">
      <Icon className="w-6 h-6 text-[#00A7FF] transition duration-300 group-hover:text-white" />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);