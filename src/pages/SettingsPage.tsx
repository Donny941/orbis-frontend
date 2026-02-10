import { Bell, Shield } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { useState } from "react";

export const SettingsPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orbNotifications, setOrbNotifications] = useState(true);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Notifications */}
        <div className="card">
          <div className="card-header-custom">
            <Bell size={20} />
            <h3>Notifications</h3>
          </div>
          <div className="settings-item">
            <div className="settings-info">
              <span className="settings-label">Email Notifications</span>
              <span className="settings-description">Receive updates about your resources via email</span>
            </div>
            <button className={`toggle-btn ${emailNotifications ? "active" : ""}`} onClick={() => setEmailNotifications(!emailNotifications)}>
              {emailNotifications ? "On" : "Off"}
            </button>
          </div>
          <div className="settings-item">
            <div className="settings-info">
              <span className="settings-label">Orb Notifications</span>
              <span className="settings-description">Get notified when someone gives an orb to your resource</span>
            </div>
            <button className={`toggle-btn ${orbNotifications ? "active" : ""}`} onClick={() => setOrbNotifications(!orbNotifications)}>
              {orbNotifications ? "On" : "Off"}
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="card">
          <div className="card-header-custom">
            <Shield size={20} />
            <h3>Account</h3>
          </div>
          <div className="settings-item">
            <div className="settings-info">
              <span className="settings-label">Email</span>
              <span className="settings-description">{user?.email}</span>
            </div>
          </div>
          <div className="settings-item">
            <div className="settings-info">
              <span className="settings-label">Username</span>
              <span className="settings-description">@{user?.username}</span>
            </div>
          </div>
          <div className="settings-item">
            <div className="settings-info">
              <span className="settings-label">Delete Account</span>
              <span className="settings-description">Permanently delete your account and all data</span>
            </div>
            <button className="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};
