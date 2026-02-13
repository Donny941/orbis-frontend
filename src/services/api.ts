/// <reference types="vite/client" />

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { ApiError, PaginatedResponse, Resource } from "../../types";

import type { logout, setTokens } from "../store/slices/authSlice";

interface AuthActions {
  logout: typeof logout;
  setTokens: typeof setTokens;
}

export interface PublicUserProfile {
  id: string;
  displayName: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  totalOrbPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

let store: Store<RootState> | null = null;
let authActions: AuthActions | null = null;

export const setupAxios = (storeInstance: Store<RootState>, actions: AuthActions) => {
  store = storeInstance;
  authActions = actions;
};

const BASE_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  if (store && authActions) {
    store.dispatch(authActions.logout());
  }

  window.location.href = "/login";
};

// RETRY INTERCEPTOR
api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;

  if (!config || (config._retryCount ?? 0) >= 3) {
    return Promise.reject(error);
  }

  const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status < 600);

  if (!shouldRetry) {
    return Promise.reject(error);
  }

  config._retryCount = (config._retryCount ?? 0) + 1;

  const delay = Math.pow(2, config._retryCount - 1) * 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return api(config);
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        if (store && authActions) {
          store.dispatch(
            authActions.setTokens({
              accessToken: newToken,
              refreshToken: newRefreshToken,
            }),
          );
        }

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) return axiosError.response.data.message;
    if (axiosError.message === "Network Error") return "Unable to connect to server.";
    if (axiosError.code === "ECONNABORTED") return "Request timeout.";
    return axiosError.message || "An unexpected error occurred";
  }
  return "An unexpected error occurred";
};

export const getValidationErrors = (error: unknown): Record<string, string> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.errors) {
      const errors: Record<string, string> = {};
      Object.entries(axiosError.response.data.errors).forEach(([key, messages]) => {
        errors[key] = Array.isArray(messages) ? messages[0] : messages;
      });
      return errors;
    }
  }
  return {};
};

export const userService = {
  getUserProfile: async (userId: string): Promise<PublicUserProfile> => {
    const response = await api.get(`/auth/users/${userId}`);
    return response.data;
  },

  getUserResources: async (userId: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get(`/resources/by-user/${userId}`, {
      params: { page, size },
    });
    return {
      data: response.data.data,
      page: response.data.pagination.currentPage,
      pageSize: response.data.pagination.pageSize,
      totalCount: response.data.pagination.totalCount,
      totalPages: response.data.pagination.totalPages,
    };
  },
};

export default api;
