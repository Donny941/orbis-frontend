import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("orbis-cookie-consent");
    if (!consent) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("orbis-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("orbis-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-icon">
          <Cookie size={24} />
        </div>
        <div className="cookie-banner-text">
          <p>
            We use essential cookies to make Orbis work. We'd also like to use analytics cookies to improve your experience.{" "}
            <Link to="/privacy" className="cookie-link">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link to="/terms" className="cookie-link">
              Terms of Service
            </Link>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleDecline}>
            Decline
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleAccept}>
            Accept
          </button>
        </div>
        <button className="cookie-banner-close" onClick={handleDecline} aria-label="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
