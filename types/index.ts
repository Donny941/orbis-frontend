// ==================== ORBIS TYPES ====================

// User
export interface User {
  id: string;
  username: string;
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
  iconUrl: string;
  color: string;
  memberCount: number;
  resourceCount: number;
  createdAt: string;
  isJoined?: boolean; // Client-side flag
}

// Resource
export interface Resource {
  id: string;
  title: string;
  content: string;
  type: ResourceType;
  status: ResourceStatus;
  author: User;
  orb: Orb;
  difficulty?: Difficulty;
  tags: string[];
  viewCount: number;
  totalOrbsReceived: number;
  hasUserOrbed: boolean;
  createdAt: string;
  updatedAt: string;
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
  hasUserOrbed: boolean;
  createdAt: string;
}

// User Stats
export interface UserStats {
  totalOrbPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  resourcesCreated: number;
  orbsJoined: number;
  orbsGiven: number;
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

// Level System
export interface LevelInfo {
  level: number;
  name: LevelName;
  minPoints: number;
  maxPoints: number;
  orbWeight: number;
  color: string;
}

export type LevelName = "Novice" | "Student" | "Scholar" | "Expert" | "Master";

// Filter & Sort
export interface ResourceFilters {
  orbId?: string;
  type?: ResourceType;
  difficulty?: Difficulty;
  sort?: "recent" | "popular" | "trending";
  search?: string;
}

// Form States
export interface FormErrors {
  [key: string]: string;
}
