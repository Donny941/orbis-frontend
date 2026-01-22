import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Mostra loading mentre controlla l'auth
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  // Se non autenticato, redirect al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se autenticato, mostra le rotte figlie
  return <Outlet />;
};
