import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <Compass size={64} />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Lost in Space</h2>
        <p className="not-found-text">The page you're looking for doesn't exist or has been moved to another orbit.</p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="btn btn-primary">
            <Home size={18} />
            Go to Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
