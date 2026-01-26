import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Compass, LogOut, User, Settings, FileText, Award, HelpCircle, ChevronDown, Menu, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useState } from "react";

interface NavbarProps {
  variant?: "landing" | "app";
}

export const Navbar = ({ variant = "app" }: NavbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowProfileMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLevelName = (level: number) => {
    const levels = ["Novice", "Student", "Scholar", "Expert", "Master"];
    return levels[level - 1] || "Novice";
  };

  // Landing Navbar
  if (variant === "landing") {
    return (
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <div className="logo-icon">
              <Compass size={24} />
            </div>
            <span className="logo-text">Orbis</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav desktop-only">
            <a href="#features" onClick={() => setShowMobileMenu(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setShowMobileMenu(false)}>
              How it works
            </a>
            <a href="#orbs" onClick={() => setShowMobileMenu(false)}>
              Orbs
            </a>
          </div>

          <div className="btn-group desktop-only">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle mobile-only" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mobile-menu">
            <div className="mobile-nav">
              <a href="#features" onClick={() => setShowMobileMenu(false)}>
                Features
              </a>
              <a href="#how-it-works" onClick={() => setShowMobileMenu(false)}>
                How it works
              </a>
              <a href="#orbs" onClick={() => setShowMobileMenu(false)}>
                Orbs
              </a>
            </div>
            <div className="mobile-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-block" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-block" onClick={() => setShowMobileMenu(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-block" onClick={() => setShowMobileMenu(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }

  // App Navbar
  return (
    <nav className="top-navbar">
      {/* Search - Hide on mobile */}
      <div className="navbar-left desktop-only">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input type="text" className="search-input" placeholder="Search..." />
          <div className="search-kbd">⌘K</div>
        </div>
      </div>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Search icon for mobile */}
        <button className="icon-btn mobile-only">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button className="icon-btn">
          <Bell size={18} />
          <span className="badge">3</span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <button className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="avatar">{user && getInitials(user.displayName)}</div>
            <div className="profile-info-nav desktop-only">
              <span className="profile-name-nav">{user?.username}</span>
              <span className="profile-level-nav">
                {user && getLevelName(user.level)} · Lv.{user?.level}
              </span>
            </div>
            <ChevronDown size={16} className={`dropdown-chevron desktop-only ${showProfileMenu ? "rotated" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="profile-menu">
              {/* Header */}
              <div className="profile-header">
                <div className="avatar lg">{user && getInitials(user.displayName)}</div>
                <div className="profile-header-info">
                  <div className="profile-header-name">{user?.displayName}</div>
                  <div className="profile-header-email">{user?.email}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-value">{user?.totalOrbPoints}</span>
                  <span className="profile-stat-label">Points</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">Lv.{user?.level}</span>
                  <span className="profile-stat-label">{user && getLevelName(user.level)}</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">{user?.currentStreak}</span>
                  <span className="profile-stat-label">Streak</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="menu-group">
                <Link to="/profile" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <User size={16} />
                  My Profile
                </Link>
                <Link to="/settings" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <Settings size={16} />
                  Settings
                </Link>
              </div>

              <div className="menu-divider" />

              <div className="menu-group">
                <Link to="/my-resources" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FileText size={16} />
                  My Resources
                </Link>
                <Link to="/achievements" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <Award size={16} />
                  Achievements
                </Link>
              </div>

              <div className="menu-divider" />

              <div className="menu-group">
                <Link to="/help" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                  <HelpCircle size={16} />
                  Help & FAQ
                </Link>
                <button onClick={handleLogout} className="menu-item danger">
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
