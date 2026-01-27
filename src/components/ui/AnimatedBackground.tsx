// components/ui/AnimatedBackground.tsx
import { useEffect, useState, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityDirection: number;
}

export const AnimatedBackground = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Scroll handler per gli orbs
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 20000);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      opacityDirection: Math.random() > 0.5 ? 1 : -1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Twinkle effect
        particle.opacity += particle.opacityDirection * 0.003;
        if (particle.opacity >= 0.5) particle.opacityDirection = -1;
        if (particle.opacity <= 0.1) particle.opacityDirection = 1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Parametri orbita
  const centerX = 50;
  const centerY = 50;
  const radius = 35;

  const getOrbitalPosition = (angle: number, radiusMultiplier = 1) => {
    const rad = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(rad) * radius * radiusMultiplier;
    const y = centerY + Math.sin(rad) * radius * radiusMultiplier;
    return { x, y };
  };

  const angle1 = scrollProgress * 720;
  const angle2 = scrollProgress * 720 + 120;
  const angle3 = scrollProgress * 720 + 240;

  const orb1 = getOrbitalPosition(angle1, 1);
  const orb2 = getOrbitalPosition(angle2, 0.8);
  const orb3 = getOrbitalPosition(angle3, 1.2);

  const lateralProgress = -10 + scrollProgress * 120;

  return (
    <div className="animated-background">
      {/* Particles Canvas */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* Orbs */}
      <div
        className="orb orb-purple"
        style={{
          transform: `translate(calc(${orb1.x}vw - 50%), calc(${orb1.y}vh - 50%))`,
        }}
      />
      <div
        className="orb orb-pink"
        style={{
          transform: `translate(calc(${orb2.x}vw - 50%), calc(${orb2.y}vh - 50%))`,
        }}
      />
      <div
        className="orb orb-green"
        style={{
          transform: `translate(calc(${orb3.x}vw - 50%), calc(${orb3.y}vh - 50%))`,
        }}
      />
      <div
        className="orb orb-blue"
        style={{
          transform: `translateX(${lateralProgress}vw)`,
        }}
      />
      <div
        className="orb orb-orange"
        style={{
          transform: `translateX(${-lateralProgress}vw)`,
        }}
      />
    </div>
  );
};
