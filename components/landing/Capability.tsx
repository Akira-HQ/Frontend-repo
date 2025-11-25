import { LucideIcon } from "lucide-react";

// Section 1: Akira Capabilities Grid
export type Capability = { icon: LucideIcon; title: string; };

export const CapabilityGrid: React.FC<{ capabilities: Capability[] }> = ({ capabilities }) => (
  <section className="container mx-auto px-4 py-20 max-w-7xl">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Akira's Core Capabilities
      </h2>
      <p className="text-lg text-gray-400 max-w-4xl mx-auto">
        Go beyond simple chat. Akira is a comprehensive AI sales engine built on real-time data and predictive modeling.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {capabilities.map((cap, index) => (
        <div
          key={index}
          className="
            group p-6 rounded-xl bg-gray-900/60 border border-gray-800 
            hover:border-[#00A7FF] hover:shadow-[0_0_15px_rgba(0,167,255,0.4)]
            transition duration-330
          "
        >
          <cap.icon className="w-8 h-8 text-[#A500FF] mb-3 group-hover:text-[#00A7FF]" />
          <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
        </div>
      ))}
    </div>
  </section>
);