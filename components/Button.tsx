import React from "react";
import { ButtonProps } from "@/types";
import { useRef, useEffect } from "react";
import gsap from "gsap";

type ButtonProp = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
};
const NEON_GRADIENT = "bg-gradient-to-r from-[#00A7FF] to-[#A500FF]";

export const PrimaryButton: React.FC<ButtonProp> = ({
  children,
  onClick,
  className = "",
  href,
  type,
  disabled,
}) => {
  const Comp = href ? "a" : "button";
  const buttonRef = useRef(null);

  useEffect(() => {
    if (typeof gsap === "undefined") return;
    // GSAP Hover Animation
    gsap.to(buttonRef.current, {
      duration: 0.2,
      ease: "power1.inOut",
      boxShadow: `0 0 20px rgba(165,0,255,0.6)`,
      scale: 1, // Reset initial scale
      paused: true,
    });
  }, []);

  const handleMouseEnter = () => {
    if (typeof gsap !== "undefined") {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        boxShadow: `0 0 35px rgba(0,167,255,0.9)`,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    if (typeof gsap !== "undefined") {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: `0 0 20px rgba(165,0,255,0.6)`,
        duration: 0.3,
      });
    }
  };

  return (
    <Comp
      disabled={disabled}
      type={type}
      ref={buttonRef}
      onClick={onClick}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        ${NEON_GRADIENT} text-white font-semibold py-3 px-8 rounded-xl shadow-lg whitespace-nowrap
        transition duration-300 ease-in-out
        ${className}
      `}
    >
      {children}
    </Comp>
  );
};

const Button = ({
  children,
  className,
  onClick,
  isDarkMode,
  type,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} ${isDarkMode ? "" : "bg-btn"} py-1 px-3 rounded shadow tracking-wide`}
    >
      {children}
    </button>
  );
};

export default Button;

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      text-white font-semibold py-3 px-8 rounded-xl border border-gray-600
      transition duration-300 ease-in-out transform hover:scale-[1.03]
      hover:border-[#00A7FF] hover:text-[#00A7FF] bg-transparent
    `}
  >
    {children}
  </button>
);
