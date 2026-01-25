import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerThunk } from "../store/thunks/authThunks";
import { clearError } from "../store/slices/authSlice";
import type { RegisterData } from "../../types";

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

  const [confirmPassword, setConfirmPassword] = useState("");
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

    // Validation
    if (formData.password !== confirmPassword) {
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
          confirmPassword,
        }),
      ).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1rem",
              background: "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join the Orbis community</p>
        </div>

        {/* Error Alert */}
        {(error || validationError) && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: "1.5rem" }}>
            {error || validationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
                className="form-control"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                style={{ paddingLeft: "2.5rem" }}
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
                className="form-control"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={handleChange}
                required
                style={{ paddingLeft: "2.5rem" }}
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
                className="form-control"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={{ paddingLeft: "2.5rem" }}
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
                className="form-control"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
                className="form-control"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationError) setValidationError("");
                }}
                required
                autoComplete="new-password"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ marginLeft: "0.5rem" }}>Creating account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-text" style={{ margin: "1.5rem 0" }}>
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
