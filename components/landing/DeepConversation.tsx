import { FeatureCard, FeatureCardProps } from "./FeatureCard";

export const DeepConversionSection: React.FC<{ features: FeatureCardProps[] }> = ({ features }) => (
  <section className="container mx-auto px-4 py-20 max-w-7xl">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Designed for Conversion, Built for Revenue
      </h2>
      <p className="text-lg text-gray-400 max-w-4xl mx-auto">
        Akira uses sophisticated AI models specifically trained on e-commerce transaction data to optimize every single touchpoint.
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