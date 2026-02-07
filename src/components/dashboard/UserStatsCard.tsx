import { TrendingUp, Award, Flame, Target } from "lucide-react";
import { useAppSelector } from "../../store/hooks";

export const UserStatsCard = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const getLevelName = (level: number) => {
    const levels = ["Novice", "Student", "Scholar", "Expert", "Master"];
    return levels[level - 1] || "Novice";
  };

  const getNextLevelPoints = (level: number) => {
    const thresholds = [101, 501, 1001, 2501];
    return level < 5 ? thresholds[level - 1] : null;
  };

  const nextLevelPoints = getNextLevelPoints(user.level);
  const progressPercent = nextLevelPoints ? Math.min((user.totalOrbPoints / nextLevelPoints) * 100, 100) : 100;

  return (
    <div className="card user-stats-card">
      {/* Header con Avatar e Nome */}
      <div className="user-stats-header">
        <div className="user-avatar">
          {user.displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div className="user-info">
          <h3 className="user-name">{user.displayName}</h3>
          <p className="user-username">@{user.username}</p>
        </div>
      </div>

      {/* Level Badge e Progress */}
      <div className="user-level-section">
        <div className="level-info">
          <span className={`level-badge ${getLevelName(user.level).toLowerCase()}`}>
            {getLevelName(user.level)} · Lv.{user.level}
          </span>
          {nextLevelPoints && (
            <span className="level-progress-text">
              {user.totalOrbPoints} / {nextLevelPoints} pts
            </span>
          )}
        </div>
        {nextLevelPoints && (
          <div className="level-progress-bar">
            <div className="level-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        )}
      </div>

      {/* Stats Grid - 2x2 con dimensioni uniformi */}
      <div className="user-stats-grid">
        <div className="user-stat">
          <div className="user-stat-icon purple">
            <Target size={18} />
          </div>
          <div className="user-stat-value">{user.totalOrbPoints}</div>
          <div className="user-stat-label">POINTS</div>
        </div>

        <div className="user-stat">
          <div className="user-stat-icon orange">
            <Flame size={18} />
          </div>
          <div className="user-stat-value">{user.currentStreak}</div>
          <div className="user-stat-label">DAY STREAK</div>
        </div>

        <div className="user-stat">
          <div className="user-stat-icon blue">
            <TrendingUp size={18} />
          </div>
          <div className="user-stat-value">{user.level}</div>
          <div className="user-stat-label">LEVEL</div>
        </div>

        <div className="user-stat coming-soon">
          <div className="user-stat-icon green">
            <Award size={18} />
          </div>
          <div className="user-stat-value">COMING SOON</div>
          <div className="user-stat-label">ACHIEVEMENTS</div>
        </div>
      </div>
    </div>
  );
};
