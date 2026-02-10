import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useOnboardingTour } from "../../hooks/useOnboardingTour";
import { useTheme } from "../../hooks/useTheme";

export const DashboardLayout = () => {
  const { restartTour } = useOnboardingTour();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar variant="app" onTourStart={restartTour} theme={theme} onThemeToggle={toggleTheme} />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
