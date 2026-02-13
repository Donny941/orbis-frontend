import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orbsReducer from "./slices/orbsSlice";
import resourcesReducer from "./slices/resourcesSlice";
import commentsReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orbs: orbsReducer,
    resources: resourcesReducer,
    comments: commentsReducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
