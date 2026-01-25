import { Navbar } from "../components/layout/Navbar";
import { useAppSelector } from "../store/hooks";

export const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <Navbar variant="app" />
      <div className="page-header">
        <h1>Welcome back, {user?.displayName}! 👋</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Level {user?.level} • {user?.totalOrbPoints} Orb Points
        </p>
      </div>
      <div className="grid grid-3" style={{ marginTop: "2rem" }}>
        <div className="card">
          <h3>Total Points</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--accent)" }}>{user?.totalOrbPoints}</p>
        </div>

        <div className="card">
          <h3>Current Streak</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--success)" }}>{user?.currentStreak} 🔥</p>
        </div>

        <div className="card">
          <h3>Level</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--warning)" }}>{user?.level}</p>
        </div>
      </div>
    </div>
  );
};
