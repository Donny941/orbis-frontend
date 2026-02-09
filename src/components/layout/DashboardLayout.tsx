import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useOnboardingTour } from "../../hooks/useOnboardingTour";

export const DashboardLayout = () => {
  const { restartTour } = useOnboardingTour();
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar variant="app" onTourStart={restartTour} />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
