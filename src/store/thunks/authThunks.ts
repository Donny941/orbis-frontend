import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../../../services/api";
import type { LoginCredentials, RegisterData, AuthResponse, User } from "../../../types";

// LOGIN

export const loginThunk = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    const { token, refreshToken } = response.data;

    // Save tokens to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    // Update axios default header
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//  REGISTER

export const registerThunk = createAsyncThunk<AuthResponse, RegisterData, { rejectValue: string }>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", data);
    const { token, refreshToken } = response.data;

    // Save tokens to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    // Update axios default header
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//  FETCH USER

export const fetchUserThunk = createAsyncThunk<User, void, { rejectValue: string }>("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//REFRESH USER

export const refreshUserThunk = createAsyncThunk<User, void, { rejectValue: string }>("auth/refreshUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
