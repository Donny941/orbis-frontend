import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "../src/styles/main.scss";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { InitAuth } from "./components/auth/InitAuth.tsx";
// Importazione per il setup dell'API
import { setupAxios } from "../services/api";
import { logout, setTokens } from "./store/slices/authSlice";

// INJECTION: Colleghiamo Redux ad Axios
// Questo rompe la dipendenza circolare a runtime
setupAxios(store, { logout, setTokens });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <InitAuth>
        <App />
      </InitAuth>
    </Provider>
  </StrictMode>,
);
