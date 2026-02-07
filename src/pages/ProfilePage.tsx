import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfileThunk } from "../store/slices/authThunks";
import { User, Star, Flame, Trophy, Calendar, FileText, TrendingUp, Award, Pencil, Check, X, Loader2 } from "lucide-react";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isUpdating } = useAppSelector((state) => state.auth);
  const { myResources } = useAppSelector((state) => state.resources);

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

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

  // Edit handlers
  const handleEditName = () => {
    setEditName(user.displayName || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (editName.trim() && editName !== user.displayName) {
      await dispatch(updateProfileThunk({ displayName: editName.trim() }));
    }
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setIsEditingName(false);
    setEditName("");
  };

  const handleEditBio = () => {
    setEditBio(user.bio || "");
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    if (editBio !== user.bio) {
      await dispatch(updateProfileThunk({ bio: editBio }));
    }
    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setIsEditingBio(false);
    setEditBio("");
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
              {/* Editable Name */}
              {isEditingName ? (
                <div className="edit-field">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="edit-input edit-input-name"
                    autoFocus
                    maxLength={100}
                  />
                  <div className="edit-actions">
                    <button className="edit-btn save" onClick={handleSaveName} disabled={isUpdating}>
                      {isUpdating ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                    </button>
                    <button className="edit-btn cancel" onClick={handleCancelName} disabled={isUpdating}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="editable-row">
                  <h1 className="profile-name">{user.displayName || user.username}</h1>
                  <button className="edit-icon-btn" onClick={handleEditName}>
                    <Pencil size={14} />
                  </button>
                </div>
              )}

              <p className="profile-username">@{user.username || user.userName}</p>

              {/* Editable Bio */}
              {isEditingBio ? (
                <div className="edit-field">
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="edit-input edit-input-bio"
                    autoFocus
                    maxLength={500}
                    rows={3}
                    placeholder="Write something about yourself..."
                  />
                  <div className="edit-actions">
                    <button className="edit-btn save" onClick={handleSaveBio} disabled={isUpdating}>
                      {isUpdating ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
                    </button>
                    <button className="edit-btn cancel" onClick={handleCancelBio} disabled={isUpdating}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="editable-row bio-row">
                  <p className="profile-bio">{user.bio || <span className="placeholder-text">Add a bio...</span>}</p>
                  <button className="edit-icon-btn" onClick={handleEditBio}>
                    <Pencil size={14} />
                  </button>
                </div>
              )}

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
