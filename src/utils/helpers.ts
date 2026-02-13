// ==================== FORMAT HELPERS ====================

/**
 * Relative time ago (e.g. "Just now", "5m ago", "3d ago")
 */
export const timeAgo = (dateString?: string): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Friendly date (e.g. "Today", "Yesterday", "3 days ago", or locale date)
 */
export const formatDateFriendly = (dateString?: string): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

/**
 * Full formatted date (e.g. "January 15, 2026")
 */
export const formatDateFull = (dateString?: string): string => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Short formatted date (e.g. "Jan 15, 2026")
 */
export const formatDateShort = (dateString?: string): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ==================== USER HELPERS ====================

/**
 * Get initials from a name (e.g. "Alan Donati" → "AD")
 */
export const getInitials = (name?: string): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get level name from level number
 */
export const getLevelName = (level: number): string => {
  const levels = ["Novice", "Student", "Scholar", "Expert", "Master"];
  return levels[level - 1] || "Novice";
};

/**
 * Get level progress percentage
 */
export const getLevelProgress = (level: number, totalOrbPoints: number): number => {
  const thresholds = [0, 101, 501, 1001, 2500];
  if (level >= 5) return 100;

  const currentThreshold = thresholds[level - 1];
  const nextThreshold = thresholds[level];
  const progress = ((totalOrbPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return Math.min(Math.max(progress, 0), 100);
};

/**
 * Get points needed to reach next level
 */
export const getPointsToNextLevel = (level: number, totalOrbPoints: number): number => {
  const thresholds = [101, 501, 1001, 2500];
  if (level >= 5) return 0;
  return thresholds[level - 1] - totalOrbPoints;
};

// ==================== RESOURCE HELPERS ====================

/**
 * Parse tags from string or array
 */
export const parseTags = (tags: string | string[] | undefined | null): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string" && tags.trim()) {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * Get CSS class for difficulty badge
 */
export const getDifficultyClass = (difficulty?: string): string => {
  switch (difficulty) {
    case "Beginner":
      return "difficulty-beginner";
    case "Intermediate":
      return "difficulty-intermediate";
    case "Advanced":
      return "difficulty-advanced";
    default:
      return "";
  }
};

/**
 * Get author display name safely
 */
export const getAuthorName = (author?: { displayName?: string; userName?: string }): string => {
  if (!author) return "Unknown";
  return author.displayName || author.userName || "Unknown";
};

/**
 * Get author initial letter
 */
export const getAuthorInitial = (author?: { displayName?: string; userName?: string }): string => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
};
