import React from "react";
import { LucideIcon, CheckCircle } from "lucide-react"; // Import necessary icons for the mock

// --- MOCK DEFINITIONS for FeatureCard to resolve import errors ---
export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
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
// --- END MOCK DEFINITIONS ---

export const DeepConversionSection: React.FC<{
  features: FeatureCardProps[];
}> = ({ features }) => (
  <section id="conversation" className="container mx-auto px-4 py-20 max-w-7xl">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        Designed for Conversion, Built for Revenue
      </h2>
      <p className="text-lg text-gray-400 max-w-4xl mx-auto">
        Cliva uses sophisticated AI models specifically trained on e-commerce
        transaction data to optimize every single touchpoint.
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  </section>
);
