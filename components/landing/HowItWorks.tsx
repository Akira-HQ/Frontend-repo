import { BarChart, Brain, LucideIcon, MessageCircle } from "lucide-react";
import React from "react";

export type ProcessStepProps = { step: number; title: string; description: string; icon: LucideIcon };

export const ProcessStep: React.FC<ProcessStepProps> = ({ step, title, description, icon: Icon }) => (
  <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/3">
    <div className="w-16 h-16 rounded-full bg-gray-900 border-4 border-[#00A7FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,167,255,0.5)] mb-4">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <p className="text-sm font-mono text-[#A500FF] mb-2">STEP {step}</p>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 max-w-xs">{description}</p>
  </div>
);

export const HowItWorksAnimation: React.FC = () => {
  const processData = [
    { title: "Customer Initiates", description: "Customer sends a message via Web, WhatsApp, or IG DM.", icon: MessageCircle },
    { title: "Intent & Context Mapping", description: "Akira identifies customer intent (Buy, Ask, Complain) using product memory and deep learning.", icon: Brain },
    { title: "Convert & Optimize", description: "Akira executes the sales sequence (answers, recommends, up-sells) and logs the conversion.", icon: BarChart },
  ];

  return (
    <section className="container mx-auto px-4 py-20 max-w-7xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        The Three-Step Conversion Loop
      </h2>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Horizontal Line Connector (visible on desktop) */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-700 hidden md:block z-0 mx-[5%]">
          {/* Glowing Markers for the line path */}
          <div className="absolute -left-1 w-2 h-2 rounded-full bg-[#00A7FF] shadow-[0_0_10px_rgba(0,167,255,1)]"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#00A7FF] shadow-[0_0_10px_rgba(0,167,255,1)]"></div>
          <div className="absolute -right-1 w-2 h-2 rounded-full bg-[#00A7FF] shadow-[0_0_10px_rgba(0,167,255,1)]"></div>
        </div>

        {processData.map((step, index) => (
          <React.Fragment key={index}>
            <ProcessStep
              step={index + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
            {/* Vertical Line Connector (visible on mobile/tablet) */}
            {index < processData.length - 1 && (
              <div className="w-0.5 h-12 bg-gray-700 block md:hidden self-center my-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};