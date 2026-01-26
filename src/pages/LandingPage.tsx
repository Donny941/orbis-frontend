import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Compass, Zap, Users, TrendingUp, Sparkles, Target, Award } from "lucide-react";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";
import logoImg from "../assets/logo.png";

export const LandingPage = () => {
  return (
    <div>
      <AnimatedBackground />
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            {/* Logo Icon */}
            <div className="hero-logo">
              <img src={logoImg} alt="Orbis Logo" />
            </div>

            {/* Title */}
            <h1 className="hero-title">Learn Together, Grow Together</h1>

            {/* Subtitle */}
            <p className="hero-subtitle">Join themed communities, share knowledge, and level up with Orb Points</p>

            {/* CTA Buttons */}
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                <Sparkles size={20} />
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">10K+</span>
                <span className="hero-stat-label">Active Learners</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">50+</span>
                <span className="hero-stat-label">Learning Orbs</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">100K+</span>
                <span className="hero-stat-label">Resources Shared</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title">Why Orbis?</h2>
            <p className="section-subtitle">Everything you need to accelerate your learning journey</p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-12 col-md-6">
              <div className="card feature-card">
                <div className="feature-icon purple">
                  <Users size={28} />
                </div>
                <h3 className="feature-title">Community Orbs</h3>
                <p className="feature-description">Join themed communities and connect with learners worldwide. From programming to design, find your tribe.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-12 col-md-6">
              <div className="card feature-card">
                <div className="feature-icon green">
                  <Zap size={28} />
                </div>
                <h3 className="feature-title">Gamification</h3>
                <p className="feature-description">
                  Earn Orb Points, level up from Novice to Master, and maintain your learning streak. Make progress visible.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-12 col-md-6">
              <div className="card feature-card">
                <div className="feature-icon yellow">
                  <TrendingUp size={28} />
                </div>
                <h3 className="feature-title">Rich Content</h3>
                <p className="feature-description">Create and share resources in Markdown with full formatting. Notes, articles, code snippets, and more.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-12 col-md-6">
              <div className="card feature-card">
                <div className="feature-icon pink">
                  <Target size={28} />
                </div>
                <h3 className="feature-title">Track Progress</h3>
                <p className="feature-description">Monitor your learning journey with detailed stats, achievements, and personalized recommendations.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-12 col-md-6">
              <div className="card feature-card">
                <div className="feature-icon blue">
                  <Award size={28} />
                </div>
                <h3 className="feature-title">Recognition</h3>
                <p className="feature-description">Get recognized for your contributions. Earn badges, climb leaderboards, and showcase your expertise.</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-12 col-md-6">
              <div className="card feature-card">
                <div className="feature-icon purple">
                  <Sparkles size={28} />
                </div>
                <h3 className="feature-title">Smart Learning</h3>
                <p className="feature-description">Personalized recommendations based on your interests and progress. Discover content that matters to you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Join an Orb</h3>
              <p className="step-description">Choose from dozens of themed communities. Programming, Design, Data Science, and more.</p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Share & Learn</h3>
              <p className="step-description">Create resources, engage with content, and learn from the community. Every action earns points.</p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Level Up</h3>
              <p className="step-description">Progress from Novice to Master. Unlock achievements, badges, and recognition as you grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Orbs Preview */}
      <section id="orbs" className="orbs-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title">Popular Orbs</h2>
            <p className="section-subtitle">Explore our most active learning communities</p>
          </div>

          <div className="orbs-preview-grid">
            {/* Orb 1 */}
            <div className="orb-preview-card" style={{ "--orb-color": "#6366f1" } as React.CSSProperties}>
              <div className="orb-preview-header">
                <div className="orb-preview-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <span className="orb-preview-badge">1.2K members</span>
              </div>
              <h3 className="orb-preview-title">Programming</h3>
              <p className="orb-preview-description">Master algorithms, data structures, and software engineering fundamentals</p>
            </div>

            {/* Orb 2 */}
            <div className="orb-preview-card" style={{ "--orb-color": "#8b5cf6" } as React.CSSProperties}>
              <div className="orb-preview-header">
                <div className="orb-preview-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                </div>
                <span className="orb-preview-badge">890 members</span>
              </div>
              <h3 className="orb-preview-title">Web Development</h3>
              <p className="orb-preview-description">Learn modern web technologies, frameworks, and best practices</p>
            </div>

            {/* Orb 3 */}
            <div className="orb-preview-card" style={{ "--orb-color": "#ec4899" } as React.CSSProperties}>
              <div className="orb-preview-header">
                <div className="orb-preview-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </div>
                <span className="orb-preview-badge">654 members</span>
              </div>
              <h3 className="orb-preview-title">Data Science</h3>
              <p className="orb-preview-description">Dive into ML, statistics, and data analysis with Python and R</p>
            </div>

            {/* Orb 4 */}
            <div className="orb-preview-card" style={{ "--orb-color": "#f59e0b" } as React.CSSProperties}>
              <div className="orb-preview-header">
                <div className="orb-preview-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <span className="orb-preview-badge">432 members</span>
              </div>
              <h3 className="orb-preview-title">Design</h3>
              <p className="orb-preview-description">UI/UX design principles, tools, and creative workflows</p>
            </div>
          </div>

          <div className="text-center mt-large">
            <Link to="/register" className="btn btn-primary btn-lg">
              Explore All Orbs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Learning?</h2>
            <p className="cta-subtitle">Join thousands of learners already growing their skills on Orbis</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              <Sparkles size={20} />
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-icon">
                <Compass size={20} />
              </div>
              <span className="logo-text">Orbis</span>
            </div>
            <p className="footer-text">© 2026 Orbis. Built with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
