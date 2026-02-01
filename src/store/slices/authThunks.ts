import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "../../../types";
import api, { getErrorMessage } from "../../../services/api";

// LOGIN
export const loginThunk = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { accessToken, refreshToken, user } = response.data;

    // Persistenza e setup header immediato
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return { token: accessToken, refreshToken, user };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// REGISTER
export const registerThunk = createAsyncThunk<AuthResponse, RegisterData, { rejectValue: string }>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/register", data);
    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return { token: accessToken, refreshToken, user };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// FETCH USER
export const fetchUserThunk = createAsyncThunk<User, void, { rejectValue: string }>("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
