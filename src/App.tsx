// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InitAuth } from "./components/auth/InitAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

import { RegisterPage } from "./pages/RegisterPage";
import { OrbsPage } from "./pages/OrbsPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { OrbDetailPage } from "./pages/OrbDetailPage";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ResourceEditorPage } from "./pages/ResourceEditorPage";
import { ResourceDetailPage } from "./pages/ResourceDetailPage";
import { MyResourcesPage } from "./pages/MyResourcesPage";
import { FavouritesPage } from "./pages/FavouritesPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <InitAuth>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="orbs" element={<OrbsPage />} />

                <Route path="my-resources" element={<MyResourcesPage />} />
                {/* Future routes */}
                <Route path="orbs/:id" element={<OrbDetailPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="resources/new" element={<ResourceEditorPage />} />
                <Route path="resources/:id" element={<ResourceDetailPage />} />
                <Route path="resources/:id/edit" element={<ResourceEditorPage />} />

                <Route path="favourites" element={<FavouritesPage />} />

                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </InitAuth>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
