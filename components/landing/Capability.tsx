import { LucideIcon } from "lucide-react";

// Section 1: Akira Capabilities Grid
export type Capability = { icon: LucideIcon; title: string };

export const CapabilityGrid: React.FC<{ capabilities: Capability[] }> = ({
  capabilities,
}) => (
  <section id="capacity" className="container mx-auto px-4 py-20 max-w-7xl">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Akira's Core Capabilities
      </h2>
      <p className="text-lg text-gray-400 max-w-4xl mx-auto">
        Go beyond simple chat. Akira is a comprehensive AI sales engine built on
        real-time data and predictive modeling.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {capabilities.map((cap, index) => (
        <div
          key={index}
          className="
            group p-6 rounded-2xl h-full flex flex-col justify-center text-center
            bg-white/5 backdrop-blur-sm border border-gray-800 
            transition duration-500 transform hover:scale-[1.05]
            hover:border-[#A500FF] hover:shadow-xl hover:shadow-purple-900/50 
          "
        >
          <cap.icon className="w-8 h-8 text-[#FFB300] mb-3 mx-auto transition duration-300 group-hover:text-[#A500FF]" />
          <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
        </div>
      ))}
    </div>
  </section>
);
