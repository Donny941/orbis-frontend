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
import { HelpPage } from "./pages/HelpPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { CookieBanner } from "./components/ui/CookieBanner";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { UserProfilePage } from "./pages/UserProfilePage";

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

                <Route path="orbs/:id" element={<OrbDetailPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="resources/new" element={<ResourceEditorPage />} />
                <Route path="resources/:id" element={<ResourceDetailPage />} />
                <Route path="resources/:id/edit" element={<ResourceEditorPage />} />

                <Route path="favourites" element={<FavouritesPage />} />

                <Route path="leaderboard" element={<LeaderboardPage />} />

                <Route path="users/:id" element={<UserProfilePage />} />

                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="help" element={<HelpPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </InitAuth>
      </ErrorBoundary>
      <CookieBanner />
    </BrowserRouter>
  );
}

export default App;
