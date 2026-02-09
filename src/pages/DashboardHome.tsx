import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserStatsCard } from "../components/dashboard/UserStatsCard";
import { MyOrbsCard } from "../components/dashboard/MyOrbsCard";
import { RecentResourcesCard } from "../components/dashboard/RecentResourcesCard";

export const DashboardHome = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening in your learning journey.</p>
        </div>
        <Link to="/dashboard/resources/new" className="btn btn-primary">
          <Plus size={20} />
          New Resource
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <RecentResourcesCard />
        </div>
        <div className="dashboard-sidebar">
          <UserStatsCard />
          <MyOrbsCard />
        </div>
      </div>
    </>
  );
};
