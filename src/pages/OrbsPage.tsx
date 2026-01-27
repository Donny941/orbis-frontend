import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
  Code,
  Palette,
  Brain,
  Database,
  Globe,
  Smartphone,
  Shield,
  Cpu,
  TrendingUp,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  FlaskConical,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchAllOrbs, joinOrb, leaveOrb } from "../store/slices/orbsSlice";
import type { Orb } from "../../types";

// Mappa icone Lucide
const iconMap: Record<string, React.ElementType> = {
  Code,
  Palette,
  Brain,
  Database,
  Globe,
  Smartphone,
  Shield,
  Cpu,
  TrendingUp,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  FlaskConical,
  Sparkles,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Sparkles;
};

export const OrbsPage = () => {
  const dispatch = useAppDispatch();
  const { allOrbs, isLoading, error } = useAppSelector((state) => state.orbs);
  const [filteredOrbs, setFilteredOrbs] = useState<Orb[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningOrbId, setJoiningOrbId] = useState<string | null>(null);

  // Fetch on mount
  useEffect(() => {
    if (allOrbs.length === 0) {
      dispatch(fetchAllOrbs());
    }
  }, [dispatch, allOrbs.length]);

  // Filter effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrbs(allOrbs);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredOrbs(allOrbs.filter((orb) => orb.name.toLowerCase().includes(query) || orb.description.toLowerCase().includes(query)));
    }
  }, [searchQuery, allOrbs]);

  // Handle join/leave
  const handleJoinOrb = async (orbId: string, isJoined: boolean) => {
    try {
      setJoiningOrbId(orbId);
      if (isJoined) {
        await dispatch(leaveOrb(orbId)).unwrap();
      } else {
        await dispatch(joinOrb(orbId)).unwrap();
      }
    } catch (err) {
      console.error("Failed to join/leave orb:", err);
    } finally {
      setJoiningOrbId(null);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="orbs-page">
        <div className="orbs-loading">
          <Loader2 className="spinner" size={48} />
          <p>Loading orbs...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="orbs-page">
        <div className="orbs-error">
          <AlertCircle size={48} />
          <p>{error}</p>
          <button onClick={() => dispatch(fetchAllOrbs())} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orbs-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Orbs</h1>
          <p className="page-subtitle">Join learning communities and connect with others</p>
        </div>

        <div className="orbs-search">
          <Search className="search-icon" />
          <input type="text" placeholder="Search orbs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div className="orbs-stats">
        <span>{filteredOrbs.length} orbs available</span>
        <span>•</span>
        <span>{allOrbs.filter((o) => o.isJoined).length} joined</span>
      </div>

      {/* Empty state */}
      {filteredOrbs.length === 0 ? (
        <div className="orbs-empty">
          <Sparkles size={48} />
          <p>No orbs found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="orbs-grid">
          {filteredOrbs.map((orb) => {
            const IconComponent = getIcon(orb.iconName);

            return (
              <div key={orb.id} className={`orb-card ${orb.isJoined ? "joined" : ""}`} style={{ "--orb-color": orb.color } as React.CSSProperties}>
                {/* Badge */}
                {orb.isJoined && <div className="orb-card-badge">Joined</div>}

                {/* Icon */}
                <div className="orb-card-icon" style={{ backgroundColor: orb.color }}>
                  <IconComponent size={24} />
                </div>

                {/* Content */}
                <div className="orb-card-content">
                  <h3>{orb.name}</h3>
                  <p className="orb-card-description">{orb.description}</p>

                  <div className="orb-card-stats">
                    <span>
                      <Users size={14} />
                      {orb.memberCount}
                    </span>
                    <span>
                      <FileText size={14} />
                      {orb.resourceCount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="orb-card-actions">
                  <Link to={`/dashboard/orbs/${orb.id}`} className="btn btn-secondary">
                    View
                  </Link>
                  <button
                    className={`btn ${orb.isJoined ? "btn-outline" : "btn-primary"}`}
                    onClick={() => handleJoinOrb(orb.id, orb.isJoined || false)}
                    disabled={joiningOrbId === orb.id}
                  >
                    {joiningOrbId === orb.id ? <Loader2 className="spinner" size={14} /> : orb.isJoined ? "Leave" : "Join"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
