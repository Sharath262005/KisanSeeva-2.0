import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import {
  createNotificationChannel,
  requestNotificationPermissions,
} from "./services/notificationService";
import "./index.css";

// ── Router Selection ─────────────────────────────────────────────────────────
const isCapacitorNative: boolean =
  typeof window !== "undefined" &&
  Boolean((window as any).Capacitor?.isNativePlatform?.());

const Router = isCapacitorNative ? HashRouter : BrowserRouter;

// ── Native Notification Bootstrap ────────────────────────────────────────────
if (isCapacitorNative) {
  // Run safely without blocking or throwing
  try {
    createNotificationChannel().catch(() => {});
    requestNotificationPermissions().catch(() => {});
  } catch { /* ignore */ }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
