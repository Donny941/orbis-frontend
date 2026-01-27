// src/components/layout/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar variant="app" />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
