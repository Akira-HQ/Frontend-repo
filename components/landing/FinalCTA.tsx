import { NEON_GRADIENT } from "@/types";
import { SecondaryButton } from "../Button";

export const FinalCTA: React.FC<{
  onStart: () => void;
  onSeePlans: () => void;
}> = ({ onStart, onSeePlans }) => (
  <section className="container mx-auto px-4 py-20 max-w-7xl">
    <div
      className={`
        bg-gradient-to-r from-[#00A7FF] to-[#A500FF] p-12 rounded-3xl text-center
        shadow-[0_0_35px_rgba(165,0,255,0.7)]
        transform transition duration-500 hover:scale-[1.01]
      `}
    >
      <h2 className="text-4xl font-extrabold text-white mb-4">
        Ready to automate your entire sales workflow?
      </h2>
      <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-10">
        Cliva works 24/7. No salary. No break. Instant response.
      </p>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onStart}
          className={`
            bg-white text-gray-900 font-bold py-3 px-10 rounded-xl
            transition duration-300 transform hover:scale-[1.05]
            shadow-lg
          `}
        >
          Start Free
        </button>
        <SecondaryButton onClick={onSeePlans}>See Plans</SecondaryButton>
      </div>
    </div>
  </section>
);
