import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerThunk } from "../store/slices/authThunks";
import { clearError, logout } from "../store/slices/authSlice";
import type { RegisterData } from "../../types";
import logoImg from "../assets/logo.png";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    displayName: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) dispatch(clearError());
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    try {
      await dispatch(
        registerThunk({
          ...formData,
        }),
      ).unwrap();

      // Logout automatico dopo registrazione per sicurezza
      dispatch(logout());

      // Redirect al login con messaggio di successo
      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in with your credentials.",
        },
      });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card">
        {/* Logo & Title */}
        <div className="auth-header">
          <div className="auth-logo">
            <img src={logoImg} alt="Orbis Logo" className="logo-image" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the Orbis community</p>
        </div>

        {/* Error Alert */}
        {(error || validationError) && (
          <div className="alert alert-danger" role="alert">
            {error || validationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <span className="input-icon">
                <User size={18} />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control input-with-icon"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <div className="input-group">
              <span className="input-icon">
                <User size={18} />
              </span>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className="form-control input-with-icon"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-group" style={{ position: "relative" }}>
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="form-control input-with-toggle"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleChange(e);
                  if (validationError) setValidationError("");
                }}
                required
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading">
                <Loader2 size={18} className="spinner" />
                <span>Creating account...</span>
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        {/* Login Link */}
        <Link to="/login" className="btn btn-secondary btn-block">
          Sign In
        </Link>
      </div>
    </div>
  );
};
