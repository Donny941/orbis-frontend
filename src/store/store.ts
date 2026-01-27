import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orbsReducer from "./slices/orbsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orbs: orbsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
