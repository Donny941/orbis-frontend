import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Flame, TrendingUp, Medal, Crown, Award, Loader2 } from "lucide-react";
import { leaderboardService, type LeaderboardUser } from "../services/leaderboardService";
import { useAppSelector } from "../store/hooks";

export const LeaderboardPage = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await leaderboardService.getLeaderboard(20);
        setUsers(data);
      } catch {
        setError("Failed to load leaderboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown size={20} className="rank-icon gold" />;
      case 1:
        return <Medal size={20} className="rank-icon silver" />;
      case 2:
        return <Medal size={20} className="rank-icon bronze" />;
      default:
        return <span className="rank-number">{index + 1}</span>;
    }
  };

  const getLevelClass = (levelName: string) => {
    return levelName.toLowerCase();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileLink = (userId: string) => {
    if (currentUser?.id === userId) return "/dashboard/profile";
    return `/dashboard/users/${userId}`;
  };

  if (isLoading) {
    return (
      <div className="page-loading">
        <Loader2 size={32} className="spinner" />
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-loading">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <Trophy size={28} />
            Leaderboard
          </h1>
          <p className="page-subtitle">Top learners ranked by Orb Points</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      {users.length >= 3 && (
        <div className="podium">
          {/* 2nd Place */}
          <Link to={getProfileLink(users[1].id)} className="podium-card silver">
            <div className="podium-rank">
              <Medal size={24} />
              <span>2nd</span>
            </div>
            <div className="podium-avatar">
              {users[1].profilePicture ? <img src={users[1].profilePicture} alt={users[1].displayName} /> : getInitials(users[1].displayName)}
            </div>
            <h3 className="podium-name">{users[1].displayName}</h3>
            <span className="podium-username">@{users[1].userName}</span>
            <div className="podium-points">
              <TrendingUp size={14} />
              {users[1].totalOrbPoints} pts
            </div>
            <span className={`level-badge ${getLevelClass(users[1].levelName)}`}>{users[1].levelName}</span>
          </Link>

          {/* 1st Place */}
          <Link to={getProfileLink(users[0].id)} className="podium-card gold">
            <div className="podium-rank">
              <Crown size={28} />
              <span>1st</span>
            </div>
            <div className="podium-avatar large">
              {users[0].profilePicture ? <img src={users[0].profilePicture} alt={users[0].displayName} /> : getInitials(users[0].displayName)}
            </div>
            <h3 className="podium-name">{users[0].displayName}</h3>
            <span className="podium-username">@{users[0].userName}</span>
            <div className="podium-points">
              <TrendingUp size={14} />
              {users[0].totalOrbPoints} pts
            </div>
            <span className={`level-badge ${getLevelClass(users[0].levelName)}`}>{users[0].levelName}</span>
          </Link>

          {/* 3rd Place */}
          <Link to={getProfileLink(users[2].id)} className="podium-card bronze">
            <div className="podium-rank">
              <Award size={24} />
              <span>3rd</span>
            </div>
            <div className="podium-avatar">
              {users[2].profilePicture ? <img src={users[2].profilePicture} alt={users[2].displayName} /> : getInitials(users[2].displayName)}
            </div>
            <h3 className="podium-name">{users[2].displayName}</h3>
            <span className="podium-username">@{users[2].userName}</span>
            <div className="podium-points">
              <TrendingUp size={14} />
              {users[2].totalOrbPoints} pts
            </div>
            <span className={`level-badge ${getLevelClass(users[2].levelName)}`}>{users[2].levelName}</span>
          </Link>
        </div>
      )}

      {/* Full List */}
      <div className="leaderboard-list">
        <div className="leaderboard-header-row">
          <span className="col-rank">Rank</span>
          <span className="col-user">User</span>
          <span className="col-level">Level</span>
          <span className="col-streak">Streak</span>
          <span className="col-points">Points</span>
        </div>

        {users.map((user, index) => (
          <Link
            to={getProfileLink(user.id)}
            key={user.id}
            className={`leaderboard-row ${currentUser?.id === user.id ? "is-me" : ""} ${index < 3 ? "top-three" : ""}`}
          >
            <div className="col-rank">{getRankIcon(index)}</div>

            <div className="col-user">
              <div className="leaderboard-avatar">
                {user.profilePicture ? <img src={user.profilePicture} alt={user.displayName} /> : getInitials(user.displayName)}
              </div>
              <div className="leaderboard-user-info">
                <span className="leaderboard-name">
                  {user.displayName}
                  {currentUser?.id === user.id && <span className="you-badge">You</span>}
                </span>
                <span className="leaderboard-username">@{user.userName}</span>
              </div>
            </div>

            <div className="col-level">
              <span className={`level-badge sm ${getLevelClass(user.levelName)}`}>{user.levelName}</span>
            </div>

            <div className="col-streak">
              <Flame size={14} className="streak-icon" />
              <span>{user.currentStreak}d</span>
            </div>

            <div className="col-points">
              <span className="points-value">{user.totalOrbPoints}</span>
              <span className="points-label">pts</span>
            </div>
          </Link>
        ))}

        {users.length === 0 && (
          <div className="leaderboard-empty">
            <Trophy size={48} />
            <h3>No rankings yet</h3>
            <p>Start earning Orb Points to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};
