import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, BookOpen, Settings, PlusCircle, Heart } from "lucide-react";
import logoImg from "../../assets/logo.png";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchMyOrbs } from "../../store/slices/orbsSlice";

export const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { myOrbs, isLoading } = useAppSelector((state) => state.orbs);

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  useEffect(() => {
    if (myOrbs.length === 0) {
      dispatch(fetchMyOrbs());
    }
  }, [dispatch, myOrbs.length]);

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
          <Link to="/dashboard" className={`nav-item ${isActive("/dashboard", true) ? "active" : ""}`}>
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/orbs" className={`nav-item ${isActive("/dashboard/orbs") ? "active" : ""}`}>
            <Compass size={18} />
            <span>Explore Orbs</span>
          </Link>
          <Link to="/dashboard/my-resources" className={`nav-item ${isActive("/dashboard/my-resources") ? "active" : ""}`}>
            <BookOpen size={18} />
            <span>My Resources</span>
          </Link>
          <Link to="/dashboard/favourites" className={`nav-item ${isActive("/dashboard/favourites") ? "active" : ""}`}>
            <Heart size={18} />
            <span>Favourite Orbs</span>
          </Link>
        </div>
      </nav>

      {/* My Orbs */}
      <nav className="nav-section">
        <div className="nav-label">My Orbs</div>
        <div className="nav-list">
          {isLoading ? (
            <div className="nav-item">
              <span>Loading...</span>
            </div>
          ) : myOrbs.length === 0 ? (
            <div className="nav-item">
              <span>No orbs joined yet</span>
            </div>
          ) : (
            myOrbs.map((orb) => (
              <Link key={orb.id} to={`/dashboard/orbs/${orb.id}`} className={`nav-item ${location.pathname === `/dashboard/orbs/${orb.id}` ? "active" : ""}`}>
                <div className="orb-indicator" style={{ "--orb-color": orb.color } as React.CSSProperties}></div>
                <span>{orb.name}</span>
                <span className="nav-badge">{orb.resourceCount}</span>
              </Link>
            ))
          )}
        </div>
        <Link to="/dashboard/orbs" className="nav-item nav-item-action">
          <PlusCircle size={18} />
          <span>Join New Orb</span>
        </Link>
      </nav>

      {/* Settings */}
      <nav className="nav-section nav-section-bottom">
        <div className="nav-list">
          <Link to="/dashboard/settings" className={`nav-item ${isActive("/dashboard/settings") ? "active" : ""}`}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};
