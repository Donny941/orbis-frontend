// App.tsx
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InitAuth } from "./components/auth/InitAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { CookieBanner } from "./components/ui/CookieBanner";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { lazyPage } from "./utils/lazyImport";

// Public
const LandingPage = lazyPage(() => import("./pages/LandingPage"), "LandingPage");
const LoginPage = lazyPage(() => import("./pages/LoginPage"), "LoginPage");
const RegisterPage = lazyPage(() => import("./pages/RegisterPage"), "RegisterPage");
const PrivacyPolicyPage = lazyPage(() => import("./pages/PrivacyPolicyPage"), "PrivacyPolicyPage");
const TermsPage = lazyPage(() => import("./pages/TermsPage"), "TermsPage");
const NotFoundPage = lazyPage(() => import("./pages/NotFoundPage"), "NotFoundPage");

// Dashboard
const DashboardHome = lazyPage(() => import("./pages/DashboardHome"), "DashboardHome");
const OrbsPage = lazyPage(() => import("./pages/OrbsPage"), "OrbsPage");
const OrbDetailPage = lazyPage(() => import("./pages/OrbDetailPage"), "OrbDetailPage");
const ResourcesPage = lazyPage(() => import("./pages/ResourcesPage"), "ResourcesPage");
const ResourceEditorPage = lazyPage(() => import("./pages/ResourceEditorPage"), "ResourceEditorPage");
const ResourceDetailPage = lazyPage(() => import("./pages/ResourceDetailPage"), "ResourceDetailPage");
const MyResourcesPage = lazyPage(() => import("./pages/MyResourcesPage"), "MyResourcesPage");
const FavouritesPage = lazyPage(() => import("./pages/FavouritesPage"), "FavouritesPage");
const LeaderboardPage = lazyPage(() => import("./pages/LeaderboardPage"), "LeaderboardPage");
const ProfilePage = lazyPage(() => import("./pages/ProfilePage"), "ProfilePage");
const UserProfilePage = lazyPage(() => import("./pages/UserProfilePage"), "UserProfilePage");
const SettingsPage = lazyPage(() => import("./pages/SettingsPage"), "SettingsPage");
const HelpPage = lazyPage(() => import("./pages/HelpPage"), "HelpPage");

const PageLoader = () => (
  <div className="page-loader">
    <Loader2 className="spinner" size={32} />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <ErrorBoundary>
        <InitAuth>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="orbs" element={<OrbsPage />} />
                  <Route path="orbs/:id" element={<OrbDetailPage />} />

                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="resources/new" element={<ResourceEditorPage />} />
                  <Route path="resources/:id" element={<ResourceDetailPage />} />
                  <Route path="resources/:id/edit" element={<ResourceEditorPage />} />

                  <Route path="my-resources" element={<MyResourcesPage />} />
                  <Route path="favourites" element={<FavouritesPage />} />
                  <Route path="leaderboard" element={<LeaderboardPage />} />

                  <Route path="users/:id" element={<UserProfilePage />} />

                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="help" element={<HelpPage />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </InitAuth>
      </ErrorBoundary>
      <CookieBanner />
    </BrowserRouter>
  );
}

export default App;
