import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "../src/styles/main.scss";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";

import { setupAxios } from "./services/api";
import { logout, setTokens } from "./store/slices/authSlice";

setupAxios(store, { logout, setTokens });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
