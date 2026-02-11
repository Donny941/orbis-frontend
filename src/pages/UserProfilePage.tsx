import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, Star, Flame, Trophy, Calendar, Award, ArrowLeft, Loader2, BookOpen, Eye, Heart } from "lucide-react";
import { userService, type PublicUserProfile } from "../../services/api";
import { useAppSelector } from "../store/hooks";
import type { Resource } from "../../types";

export const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resourceCount, setResourceCount] = useState(0);

  // If viewing own profile, redirect
  useEffect(() => {
    if (id && currentUser?.id === id) {
      navigate("/dashboard/profile", { replace: true });
    }
  }, [id, currentUser, navigate]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await userService.getUserProfile(id);
        setProfile(data);
      } catch {
        setError("User not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      if (!id) return;
      try {
        setIsLoadingResources(true);
        const data = await userService.getUserResources(id, 1, 10);
        setResources(data.data);
        setResourceCount(data.totalCount);
      } catch {
        // Silently fail - resources section just won't show
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, [id]);

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

  const getLevelProgress = () => {
    if (!profile) return 0;
    const thresholds = [0, 101, 501, 1001, 2500];
    if (profile.level >= 5) return 100;
    const current = thresholds[profile.level - 1];
    const next = thresholds[profile.level];
    return Math.min(Math.max(((profile.totalOrbPoints - current) / (next - current)) * 100, 0), 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const parseTags = (tags: string | string[] | null | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="page-loading">
        <Loader2 size={32} className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-loading">
        <User size={48} />
        <h3>User not found</h3>
        <p>This profile doesn't exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Back button */}
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="profile-layout">
        {/* Left Column - Profile Info */}
        <div className="profile-main">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.profilePicture ? <img src={profile.profilePicture} alt={profile.displayName} /> : getInitials(profile.displayName)}
            </div>
            <div className="profile-info">
              <h1 className="profile-display-name">{profile.displayName}</h1>
              <p className="profile-username">@{profile.username}</p>

              {profile.bio && <p className="profile-bio">{profile.bio}</p>}

              <div className="profile-meta">
                <span className="meta-item">
                  <Calendar size={14} />
                  Joined {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Level Section */}
          <div className="profile-card">
            <div className="level-header">
              <div className="level-info-row">
                <Award size={20} />
                <span className="level-value">Level {profile.level}</span>
                <span className={`level-name ${getLevelName(profile.level).toLowerCase()}`}>{getLevelName(profile.level)}</span>
              </div>
            </div>

            <div className="level-progress-container">
              <div className="level-progress-bar">
                <div className="level-progress-fill" style={{ width: `${getLevelProgress()}%` }} />
              </div>
              <div className="level-progress-info">
                <span>{profile.totalOrbPoints} Orb Points</span>
                {profile.level < 5 && (
                  <span>
                    Level {profile.level + 1}: {getLevelName(profile.level + 1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="stat-icon purple">
                <Star size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{profile.totalOrbPoints}</span>
                <span className="stat-label">Orb Points</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon orange">
                <Flame size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{profile.currentStreak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon green">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{resourceCount}</span>
                <span className="stat-label">Published</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon teal">
                <Trophy size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{profile.longestStreak}</span>
                <span className="stat-label">Best Streak</span>
              </div>
            </div>
          </div>

          {/* Published Resources */}
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div className="card-header">
              <h2 className="card-title">
                <BookOpen size={20} />
                Published Resources
              </h2>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{resourceCount} total</span>
            </div>

            <div style={{ padding: "1rem" }}>
              {isLoadingResources ? (
                <div className="page-loading" style={{ minHeight: "100px" }}>
                  <Loader2 size={24} className="spinner" />
                </div>
              ) : resources.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  <BookOpen size={32} style={{ marginBottom: "0.5rem", opacity: 0.4 }} />
                  <p>No published resources yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {resources.map((resource) => (
                    <Link
                      key={resource.id}
                      to={`/dashboard/resources/${resource.id}`}
                      className="card"
                      style={{
                        padding: "1rem 1.25rem",
                        textDecoration: "none",
                        color: "inherit",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.35rem" }}>{resource.title}</h3>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                            <span className="resource-type">{resource.type}</span>
                            {resource.difficulty && (
                              <span className={`resource-difficulty difficulty-${resource.difficulty.toLowerCase()}`}>{resource.difficulty}</span>
                            )}
                            {resource.orb && (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  backgroundColor: `${resource.orb.color}20`,
                                  color: resource.orb.color,
                                }}
                              >
                                {resource.orb.name}
                              </span>
                            )}
                            {parseTags(resource.tags)
                              .slice(0, 3)
                              .map((tag) => (
                                <span key={tag} style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                  #{tag}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "1rem", flexShrink: 0, alignItems: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Eye size={14} /> {resource.viewCount}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Heart size={14} /> {resource.totalOrbsReceived}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Achievements */}
        <aside className="profile-sidebar">
          <div className="achievements-card">
            <div className="achievements-header">
              <h2>
                <Trophy size={20} />
                Achievements
              </h2>
              <span className="achievements-count coming-soon-badge">Coming Soon</span>
            </div>

            <div className="achievements-coming-soon">
              <div className="coming-soon-icon">
                <Trophy size={48} />
              </div>
              <h3>Achievements Coming Soon</h3>
              <p>Unlock achievements and earn bonus Orb Points for your accomplishments!</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
