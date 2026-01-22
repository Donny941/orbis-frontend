import { Link } from "react-router-dom";
import { Compass, Zap, Users, TrendingUp } from "lucide-react";

export const LandingPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "800px" }}>
          {/* Logo */}
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 2rem",
              background: "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Compass size={40} />
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>Learn Together, Grow Together</h1>

          {/* Subtitle */}
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "3rem" }}>
            Join themed communities, share knowledge, and level up with Orb Points
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login" className="btn btn-primary" style={{ fontSize: "1.125rem", padding: "0.75rem 2rem" }}>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: "1.125rem", padding: "0.75rem 2rem" }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "4rem 2rem", background: "var(--bg-surface)" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "3rem" }}>Why Orbis?</h2>

          <div className="grid grid-3">
            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 1.5rem",
                  background: "rgba(139, 92, 246, 0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Users size={32} />
              </div>
              <h3 style={{ marginBottom: "1rem" }}>Community Orbs</h3>
              <p style={{ color: "var(--text-secondary)" }}>Join themed communities and connect with learners worldwide</p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 1.5rem",
                  background: "rgba(139, 92, 246, 0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Zap size={32} />
              </div>
              <h3 style={{ marginBottom: "1rem" }}>Gamification</h3>
              <p style={{ color: "var(--text-secondary)" }}>Earn Orb Points, level up, and maintain your learning streak</p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 1.5rem",
                  background: "rgba(139, 92, 246, 0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <TrendingUp size={32} />
              </div>
              <h3 style={{ marginBottom: "1rem" }}>Rich Content</h3>
              <p style={{ color: "var(--text-secondary)" }}>Create and share resources in Markdown with full formatting</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
