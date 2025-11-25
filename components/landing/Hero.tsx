'use client'
import { useRef, useEffect } from "react";
import { PrimaryButton, SecondaryButton } from "../Button";
import { handleCtaClick } from "../functions/helpers";
import { useRouter } from "next/navigation";

const NEON_GRADIENT = "bg-gradient-to-r from-[#00A7FF] to-[#A500FF]";


export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null); // Type the ref
  // const handleCtaClick = () => console.log("Hero CTA Clicked");

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    if (!heroRef.current) return; // Null check added

    // Hero content fade-in and slide-up animation on load
    const children = Array.from(heroRef.current.children);
    if (children.length === 0) return;
    gsap.from(children, {
      duration: 1.5,
      y: 30,
      opacity: 0,
      stagger: 0.3,
      ease: "power3.out",
      delay: 0.5,
    });
  }, []);
  const router = useRouter()

  return (
    <section className="container mx-auto px-4 text-center max-w-7xl pt-16 pb-20 md:pt-32 md:pb-36" >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
        AKIRA: Your Personal <span className={`${NEON_GRADIENT} bg-clip-text text-transparent`}>AI Sales Manager.</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
        Akira is an intelligent, automated assistant that engages customers, proactively interacts with customers, and drives sales for your e-commerce business.
      </p>

      <div className="flex justify-center space-x-4 mb-20">
        <PrimaryButton onClick={() => {handleCtaClick("Free Trial"); router.push("/register")}}>
          Start Free Trial
        </PrimaryButton>
        <SecondaryButton onClick={() => handleCtaClick("See Plans")}>
          See Plans
        </SecondaryButton>
      </div>

      {/* Demo Image Placeholder */}
      <div className="max-w-4xl mx-auto h-64 md:h-96 rounded-2xl bg-gray-900 border border-[#00A7FF]/30 flex items-center justify-center shadow-2xl shadow-[#A500FF]/20 overflow-hidden">
        {/* Using a standard <img> tag for the placeholder */}
        <img src={'/Akira25.png'} alt='AI Dashboard Demo Screenshot' className='w-full h-full object-cover' />
      </div>
    </section >
  );
};