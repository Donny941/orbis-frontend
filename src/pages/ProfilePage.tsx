// src/pages/ProfilePage.tsx
import { useAppSelector } from "../store/hooks";
import { User, Star, Flame, Trophy, Calendar, FileText, TrendingUp, Award } from "lucide-react";

export const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { myResources } = useAppSelector((state) => state.resources);

  if (!user) {
    return (
      <div className="card-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return "?";
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
    const thresholds = [0, 101, 501, 1001, 2500];
    const currentLevel = user.level;

    if (currentLevel >= 5) return 100;

    const currentThreshold = thresholds[currentLevel - 1];
    const nextThreshold = thresholds[currentLevel];
    const progress = ((user.totalOrbPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return Math.min(Math.max(progress, 0), 100);
  };

  const getPointsToNextLevel = () => {
    const thresholds = [101, 501, 1001, 2500];
    if (user.level >= 5) return 0;
    return thresholds[user.level - 1] - user.totalOrbPoints;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const publishedCount = myResources.filter((r) => r.status === "Published").length;
  const draftCount = myResources.filter((r) => r.status === "Draft").length;

  return (
    <div className="profile-page">
      <div className="profile-layout">
        {/* Left Column - Profile Info */}
        <div className="profile-main">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {user.profilePicture ? <img src={user.profilePicture} alt={user.displayName} /> : getInitials(user.displayName || user.username)}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.displayName || user.username}</h1>
              <p className="profile-username">@{user.username || user.userName}</p>
              {user.bio && <p className="profile-bio">{user.bio}</p>}
              <div className="profile-joined">
                <Calendar size={14} />
                Joined {formatDate(user.createdAt)}
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="profile-card level-card">
            <div className="level-header">
              <div className="level-badge">
                <Award size={24} />
                <span>Level {user.level}</span>
              </div>
              <span className="level-name">{getLevelName(user.level)}</span>
            </div>
            <div className="level-progress-container">
              <div className="level-progress-bar">
                <div className="level-progress-fill" style={{ width: `${getLevelProgress()}%` }} />
              </div>
              <div className="level-progress-info">
                <span>{user.totalOrbPoints} Orb Points</span>
                {user.level < 5 && (
                  <span>
                    {getPointsToNextLevel()} points to Level {user.level + 1}
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
                <span className="stat-value">{user.totalOrbPoints}</span>
                <span className="stat-label">Total Orb Points</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon orange">
                <Flame size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{user.currentStreak}</span>
                <span className="stat-label">Current Streak</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon green">
                <Trophy size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{user.longestStreak}</span>
                <span className="stat-label">Longest Streak</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon blue">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{publishedCount}</span>
                <span className="stat-label">Published</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon yellow">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{draftCount}</span>
                <span className="stat-label">Drafts</span>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-icon teal">
                <User size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{user.level}</span>
                <span className="stat-label">Level</span>
              </div>
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
