import { Link, useLocation } from "react-router-dom";
import { Home, Compass, BookOpen, TrendingUp, Calendar, Settings, PlusCircle } from "lucide-react";
import logoImg from "../../assets/logo.png";

// Code, Globe, PieChart, Palette, Mic, Beaker icons could be used for future orbs

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/dashboard" className="logo">
        <div className="logo-icon">
          <img src={logoImg} alt="Orbis" />
        </div>
        <span className="logo-text">Orbis</span>
      </Link>

      {/* Main Navigation */}
      <nav className="nav-section">
        <div className="nav-label">Menu</div>
        <div className="nav-list">
          <Link to="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/explore" className={`nav-item ${isActive("/explore") ? "active" : ""}`}>
            <Compass size={18} />
            <span>Explore Orbs</span>
          </Link>
          <Link to="/my-learning" className={`nav-item ${isActive("/my-learning") ? "active" : ""}`}>
            <BookOpen size={18} />
            <span>My Learning</span>
          </Link>
          <Link to="/progress" className={`nav-item ${isActive("/progress") ? "active" : ""}`}>
            <TrendingUp size={18} />
            <span>Progress</span>
          </Link>
          <Link to="/calendar" className={`nav-item ${isActive("/calendar") ? "active" : ""}`}>
            <Calendar size={18} />
            <span>Calendar</span>
          </Link>
        </div>
      </nav>

      {/* My Orbs */}
      <nav className="nav-section">
        <div className="nav-label">My Orbs</div>
        <div className="nav-list">
          <Link to="/orbs/programming" className={`nav-item ${isActive("/orbs/programming") ? "active" : ""}`}>
            <div className="orb-indicator" style={{ "--orb-color": "#6366f1" } as React.CSSProperties}></div>
            <span>Programming</span>
            <span className="nav-badge">12</span>
          </Link>
          <Link to="/orbs/web-dev" className={`nav-item ${isActive("/orbs/web-dev") ? "active" : ""}`}>
            <div className="orb-indicator" style={{ "--orb-color": "#8b5cf6" } as React.CSSProperties}></div>
            <span>Web Development</span>
            <span className="nav-badge">8</span>
          </Link>
          <Link to="/orbs/data-science" className={`nav-item ${isActive("/orbs/data-science") ? "active" : ""}`}>
            <div className="orb-indicator" style={{ "--orb-color": "#ec4899" } as React.CSSProperties}></div>
            <span>Data Science</span>
            <span className="nav-badge">5</span>
          </Link>
          <Link to="/orbs/design" className={`nav-item ${isActive("/orbs/design") ? "active" : ""}`}>
            <div className="orb-indicator" style={{ "--orb-color": "#f59e0b" } as React.CSSProperties}></div>
            <span>Design</span>
            <span className="nav-badge">3</span>
          </Link>
        </div>
        <button className="nav-item nav-item-action">
          <PlusCircle size={18} />
          <span>Join New Orb</span>
        </button>
      </nav>

      {/* Settings */}
      <nav className="nav-section nav-section-bottom">
        <div className="nav-list">
          <Link to="/settings" className={`nav-item ${isActive("/settings") ? "active" : ""}`}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};
