import React from "react";

interface LoaderProps {
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className }) => {
  const animationId = `pulse-draw-${React.useId()}`;

  const pathLength = 1050;

  const animationStyle = `
    @keyframes ${animationId} {
      0%{
        stroke-dashoffset: 0;
        stroke-opacity: 0;
      } 
      10% {
        stroke-opacity: 1;
      }
      40% {
        stroke-dashoffset: ${pathLength};
        stroke-opacity: 1;
      }
      60% {
        stroke-dashoffset: ${pathLength};
        stroke-opacity: 0;
      }
      100% {
        stroke-dashoffset: 0;
        stroke-opacity: 0;
      }
    }
  `;

  return (
    <div className="loader w-screen h-screen flex justify-center items-center">
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  );
};
