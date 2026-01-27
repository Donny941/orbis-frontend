// ==================== ORBIS TYPES ====================

// User
export interface User {
  id: string;
  username: string;
  userName?: string; // Backend usa userName
  email: string;
  displayName: string;
  bio?: string;
  profilePicture?: string;
  totalOrbPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastPostDate?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Orb
export interface Orb {
  id: string;
  name: string;
  description: string;
  iconName: string; // Backend usa iconName invece di iconUrl
  color: string;
  memberCount: number;
  resourceCount: number;
  createdAt: string;
  joinedAt?: string; // Presente quando chiamiamo my-orbs
  isJoined?: boolean;
}

// Resource
export interface Resource {
  id: string;
  title: string;
  content?: string;
  type: ResourceType;
  status?: ResourceStatus;
  author: User;
  orb: Orb;
  difficulty?: Difficulty;
  tags: string[];
  viewCount: number;
  totalOrbsReceived: number;
  hasUserOrbed?: boolean;
  isAuthor?: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export type ResourceType = "Note" | "Article" | "Code" | "Link";
export type ResourceStatus = "Draft" | "Published";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

// Comment
export interface Comment {
  id: string;
  resourceId: string;
  content: string;
  author: User;
  orbsReceived: number;
  hasUserOrbed?: boolean;
  isAuthor?: boolean;
  createdAt: string;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// API Responses
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
