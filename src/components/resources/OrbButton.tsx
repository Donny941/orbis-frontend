import { useState } from "react";

interface OrbButtonProps {
  count: number;
  hasOrbed: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const OrbButton = ({ count, hasOrbed, onToggle, disabled = false, size = "md" }: OrbButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    onToggle();

    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      type="button"
      className={`orb-btn orb-btn-${size} ${hasOrbed ? "orbed" : ""} ${isAnimating ? "animating" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      title={hasOrbed ? "Remove Orb" : "Give Orb"}
    >
      {/* Icona Orb custom SVG */}
      <span className="orb-icon">
        <svg width={size === "sm" ? 14 : size === "lg" ? 20 : 16} height={size === "sm" ? 14 : size === "lg" ? 20 : 16} viewBox="0 0 24 24">
          <defs>
            <radialGradient id="orbGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor={hasOrbed ? "#a78bfa" : "#666"} />
              <stop offset="100%" stopColor={hasOrbed ? "#7c3aed" : "#333"} />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill={hasOrbed ? "url(#orbGradient)" : "none"} stroke="currentColor" strokeWidth="2" />
          {/* Highlight */}
          <ellipse cx="8" cy="8" rx="3" ry="2" fill="rgba(255,255,255,0.4)" transform="rotate(-30 8 8)" />
        </svg>
      </span>
      <span className="orb-count">{count}</span>

      {/* Particles animation */}
      {isAnimating && hasOrbed && (
        <span className="orb-particles">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="particle" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </span>
      )}
    </button>
  );
};
