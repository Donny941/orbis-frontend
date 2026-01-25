// components/ui/AnimatedBackground.tsx
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
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

  const angle1 = scrollProgress * 720; // 2 giri completi
  const angle2 = scrollProgress * 720 + 120;
  const angle3 = scrollProgress * 720 + 240;

  const orb1 = getOrbitalPosition(angle1, 1);
  const orb2 = getOrbitalPosition(angle2, 0.8);
  const orb3 = getOrbitalPosition(angle3, 1.2);

  const lateralProgress = -10 + scrollProgress * 120;

  return (
    <div className="animated-background">
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
