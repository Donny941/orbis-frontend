import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "../src/styles/main.scss";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { InitAuth } from "./components/auth/InitAuth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <InitAuth>
        <App />
      </InitAuth>
    </Provider>
  </StrictMode>,
);
