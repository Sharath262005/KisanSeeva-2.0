import axios from "axios";

export const getBaseURL = () => {
  // 1. User custom override if saved in localStorage
  const savedUrl = localStorage.getItem("custom_api_url");
  if (savedUrl) return savedUrl;

  // 2. Environment variable
  const envUrl = import.meta.env.VITE_API_URL;

  // 3. Detect Capacitor Native Mobile Platform (Android/iOS)
  const isCapacitorNative = typeof window !== "undefined" && Boolean((window as any).Capacitor?.isNativePlatform?.());

  if (isCapacitorNative) {
    // If envUrl is localhost inside Capacitor APK, swap to live backend URL
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }
    return "https://kisanseeva-backend.onrender.com/api";
  }

  // 4. Web Browser environment
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://kisanseeva-backend.onrender.com/api";
  }

  return "http://localhost:5000/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Token Mirror ─────────────────────────────────────────────────────────────
// The axios request interceptor is synchronous, but @capacitor/preferences is async.
// Solution: AuthContext writes the token to BOTH Capacitor Preferences (primary,
// survives app kills on Android) AND to localStorage as a sync mirror (so the
// interceptor below can read it without await).
//
// Key used for the localStorage mirror — must match what AuthContext writes.
export const TOKEN_MIRROR_KEY = "ks_auth_token";

// ─── Request Interceptor: Attach JWT to every request ────────────────────────
API.interceptors.request.use(
  (config) => {
    // Read from the localStorage mirror (always sync-accessible)
    const token = localStorage.getItem(TOKEN_MIRROR_KEY);
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor: Handle 401 gracefully ─────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Never auto-redirect for auth endpoints — let the component handle errors
    const isAuthEndpoint =
      url.includes("/auth/send-otp") ||
      url.includes("/auth/verify-otp") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/profile"); // ← profile refresh should NOT trigger redirect

    if (status === 401 && !isAuthEndpoint) {
      // Token truly expired or invalid — clear the mirror and redirect
      localStorage.removeItem(TOKEN_MIRROR_KEY);
      window.location.href = "/login?reason=session_expired";
    }
    // 403 is handled inline by components (pending account, wrong role, etc.)
    return Promise.reject(error);
  }
);

export default API;
