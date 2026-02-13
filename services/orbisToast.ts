import toast from "react-hot-toast";

// Centralized toast notifications for Orbis
export const orbisToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-primary)",
        borderLeft: "4px solid #22c55e",
        padding: "12px 16px",
        fontSize: "0.875rem",
        maxWidth: "400px",
      },
      iconTheme: {
        primary: "#22c55e",
        secondary: "white",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-primary)",
        borderLeft: "4px solid #ef4444",
        padding: "12px 16px",
        fontSize: "0.875rem",
        maxWidth: "400px",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "white",
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      duration: 3000,
      icon: "ℹ️",
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-primary)",
        borderLeft: "4px solid #3b82f6",
        padding: "12px 16px",
        fontSize: "0.875rem",
        maxWidth: "400px",
      },
    });
  },

  orb: (message: string) => {
    toast(message, {
      duration: 3000,
      icon: "🔮",
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-primary)",
        borderLeft: "4px solid #8b5cf6",
        padding: "12px 16px",
        fontSize: "0.875rem",
        maxWidth: "400px",
      },
    });
  },

  streak: (days: number) => {
    toast(`🔥 ${days} day streak! Keep it up!`, {
      duration: 4000,
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-primary)",
        borderLeft: "4px solid #f97316",
        padding: "12px 16px",
        fontSize: "0.875rem",
        maxWidth: "400px",
      },
    });
  },

  levelUp: (level: number, levelName: string) => {
    toast(`⬆️ Level Up! You're now Level ${level} — ${levelName}`, {
      duration: 5000,
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-primary)",
        borderLeft: "4px solid #eab308",
        padding: "12px 16px",
        fontSize: "0.875rem",
        fontWeight: "600",
        maxWidth: "400px",
      },
    });
  },
};
