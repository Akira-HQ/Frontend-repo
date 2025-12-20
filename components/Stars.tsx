"use client";
import { BASE_BG } from "@/types";
import { useRef, useCallback, useState, useEffect } from "react";

type Velocity = { x: number; y: number };
class Particle {
  x: number;
  y: number;
  radius: number;
  velocity: Velocity;
  opacity: number;
  hue: number;
  saturation: number;
  lightness: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.radius = Math.random() * 0.8 + 0.5;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
    };
    this.opacity = Math.random() * 0.4 + 0.1;
    this.hue = 240 + Math.random() * 60;
    this.saturation = 50;
    this.lightness = 70;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;
    this.opacity = 0.2 + Math.sin(Date.now() * 0.0005 + this.x) * 0.1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.shadowColor = color;
    ctx.shadowBlur = this.radius * 3;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

type ClivaStarsBackgroundProps = { density?: number };

export const ClivaStarsBackground: React.FC<ClivaStarsBackgroundProps> = ({
  density = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const [isReady, setIsReady] = useState(false);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = [];
    for (let i = 0; i < density; i++) {
      particlesRef.current.push(new Particle(canvas.width, canvas.height));
    }
    setIsReady(true);
  }, [density]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D | null;

    if (canvas && ctx) {
      ctx.fillStyle = "rgba(5, 5, 5, 0.3)"; // Semi-transparent overlay for subtle trails on dark bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    initializeCanvas();
    const handleResize = () => initializeCanvas();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initializeCanvas]);

  useEffect(() => {
    if (isReady) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isReady, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none ${BASE_BG}`}
    />
  );
};
