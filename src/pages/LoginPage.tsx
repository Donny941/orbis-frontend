import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginThunk } from "../store/thunks/authThunks";
import { clearError } from "../store/slices/authSlice";
import type { LoginCredentials } from "../../types";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const successMessage = location.state?.message;

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginThunk(formData)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card">
        {/* Logo & Title */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your Orbis account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control input-with-icon"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group" style={{ position: "relative" }}>
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-control input-with-toggle"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="form-footer">
            <a href="#" className="link-secondary">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading">
                <Loader2 size={18} className="spinner" />
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>

        {/* Register Link */}
        <Link to="/register" className="btn btn-secondary btn-block">
          Create Account
        </Link>
      </div>
    </div>
  );
};
