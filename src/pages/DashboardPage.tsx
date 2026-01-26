import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { UserStatsCard } from "../components/dashboard/UserStatsCard";
import { MyOrbsCard } from "../components/dashboard/MyOrbsCard";
import { RecentResourcesCard } from "../components/dashboard/RecentResourcesCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar variant="app" />
        <main className="main">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back! Here's what's happening in your learning journey.</p>
            </div>
            <Link to="/resources/new" className="btn btn-primary">
              <Plus size={20} />
              New Resource
            </Link>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left Column */}
            <div className="dashboard-main">
              <RecentResourcesCard />
            </div>

            {/* Right Sidebar */}
            <div className="dashboard-sidebar">
              <UserStatsCard />
              <MyOrbsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
