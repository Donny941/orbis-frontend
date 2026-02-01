// ==================== AXIOS API CLIENT ====================
/// <reference types="vite/client" />

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "../types";
import { store } from "../src/store/store";
import { setTokens, logout } from "../src/store/slices/authSlice";

// Base URL - cambierà in produzione
const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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

api.interceptors.response.use(
  (response) => {
    // Success response - return data directly
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Token refresh già in corso, metti in coda
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token - logout user
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        // ✅ Il backend restituisce "accessToken" invece di "token"
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update Redux store
        store.dispatch(
          setTokens({
            accessToken: newToken,
            refreshToken: newRefreshToken,
          }),
        );

        // Update authorization header
        if (api.defaults.headers.common) {
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        }
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process queued requests
        processQueue(null, newToken);

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    return Promise.reject(error);
  },
);

// HELPER FUNCTIONS
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  store.dispatch(logout());
  window.location.href = "/login";
};

// ERROR FORMATTER

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    // Server responded with error
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    // Network error
    if (axiosError.message === "Network Error") {
      return "Unable to connect to server. Please check your internet connection.";
    }

    // Timeout error
    if (axiosError.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    // Generic axios error
    return axiosError.message || "An unexpected error occurred";
  }

  // Generic error
  return "An unexpected error occurred";
};

// VALIDATION ERROR FORMATTER
export const getValidationErrors = (error: unknown): Record<string, string> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response?.data?.errors) {
      // Convert array errors to first message
      const errors: Record<string, string> = {};
      Object.entries(axiosError.response.data.errors).forEach(([key, messages]) => {
        errors[key] = Array.isArray(messages) ? messages[0] : messages;
      });
      return errors;
    }
  }

  return {};
};

export default api;
