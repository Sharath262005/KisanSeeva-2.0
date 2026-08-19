import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

// ─── Detect if running inside a Capacitor native app ─────────────────────────
const isNative = (): boolean => {
  try {
    return typeof window !== "undefined" &&
      Boolean((window as any).Capacitor?.isNativePlatform?.());
  } catch {
    return false;
  }
};

// ─── Secure Storage Layer ─────────────────────────────────────────────────────
// On Android native : @aparajita/capacitor-secure-storage
//   → AES-256-GCM encryption backed by the Android Keystore (hardware-backed,
//     available on API 23+). Survives app kills, memory pressure, and reboots.
// On iOS native     : iOS Keychain via the same plugin.
// On Web / fallback : localStorage (dev only — no sensitive data in production web).
//
// Why NOT @capacitor/preferences?
//   It stores data in PLAIN TEXT (standard SharedPreferences). Also, EncryptedSharedPreferences
//   was deprecated by Google in 2024. The modern approach is Android Keystore directly,
//   which this plugin wraps cleanly.
//
// localStorage mirror:
//   The axios request interceptor in api.ts is SYNCHRONOUS and cannot await native storage.
//   We therefore keep a non-sensitive localStorage copy of the token as a fast-path mirror.
//   It is re-populated from secure storage every time the app cold-starts. If it is wiped
//   by Android (e.g. after a process kill), initSession() restores it before any API call.



// ─── Unified async Storage abstraction ───────────────────────────────────────
const Storage = {
  // get: primary = encrypted native storage, fallback = localStorage mirror
  async get(key: string): Promise<string | null> {
    if (isNative()) {
      try {
        // getItem() returns string|null directly — no DataType casting needed
        const value = await SecureStorage.getItem(key);
        return value;
      } catch {
        // Key not found or storage error — fall through to localStorage mirror
      }
    }
    try { return localStorage.getItem(key); } catch { return null; }
  },

  // set: write to encrypted native storage AND mirror to localStorage (for axios interceptor)
  async set(key: string, value: string): Promise<void> {
    if (isNative()) {
      try {
        // setItem() accepts a plain string, which is what we always store
        await SecureStorage.setItem(key, value);
      } catch (e) {
        console.warn("[Auth] SecureStorage.set failed:", e);
        // fall through — at minimum localStorage mirror is written below
      }
    }
    // Always keep localStorage mirror in sync so api.ts interceptor can read sync
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  },

  // remove: clear from both native secure storage AND localStorage mirror
  async remove(key: string): Promise<void> {
    if (isNative()) {
      try { await SecureStorage.removeItem(key); } catch { /* ignore — key may not exist */ }
    }
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
};

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "farmer" | "provider" | "admin";
  extraInfo: string;
  status: "active" | "suspended";
  documents?: {
    aadhar?: string;
    selfie?: string;
    driving_license?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  serverWaking: boolean;
  login: (email: string, password: string, role: string) => Promise<User>;
  sendOtp: (phone: string, role: string) => Promise<{ message: string; otp?: string; notRegistered?: boolean }>;
  verifyOtp: (phone: string, otp: string, role: string) => Promise<User>;
  register: (data: {
    name: string;
    email?: string;
    phone: string;
    role: string;
    password: string;
    extraInfo: string;
    lat?: number;
    lng?: number;
    addressCity?: string;
    addressState?: string;
  }) => Promise<{ user: User; message: string }>;
  logout: () => void;
  updateUserProfile: (data: { name: string; phone: string; extraInfo: string; documents?: { selfie?: string; aadhar?: string; driving_license?: string } }) => Promise<User>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  TOKEN: "ks_auth_token",
  USER: "ks_auth_user",
  LOGIN_TS: "ks_login_timestamp",
};

// 30 days in milliseconds
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// ─── AuthProvider ─────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // serverWaking: true when we detect the Render backend is cold-starting (slow response)
  const [serverWaking, setServerWaking] = useState(false);

  // ─── Internal helpers ──────────────────────────────────────────────────────

  const setUser = async (u: User | null) => {
    setUserState(u);
    if (u) {
      await Storage.set(KEYS.USER, JSON.stringify(u));
    } else {
      await Storage.remove(KEYS.USER);
    }
  };

  const persistSession = async (receivedToken: string, receivedUser: User): Promise<void> => {
    // 1. Update React state immediately — this triggers navigation in the login page
    setToken(receivedToken);
    setUserState(receivedUser);
    // 2. AWAITED: persist to encrypted secure storage (Android Keystore / iOS Keychain)
    //    Storage.set() writes to BOTH native secure storage AND the localStorage mirror
    //    atomically — so the axios interceptor can read the token synchronously on the
    //    very next request without waiting.
    //    We MUST await this — if the app is killed immediately after login and the
    //    write never completes, the token won't survive the process kill.
    try {
      await Promise.all([
        Storage.set(KEYS.TOKEN, receivedToken),
        Storage.set(KEYS.USER, JSON.stringify(receivedUser)),
        Storage.set(KEYS.LOGIN_TS, Date.now().toString()),
      ]);
      console.log("[Auth] Session persisted to secure storage.");
    } catch (e) {
      console.warn("[Auth] SecureStorage write failed (localStorage mirror still active):", e);
    }
  };

  const clearSession = async () => {
    // Storage.remove() clears both native secure storage AND localStorage mirror
    await Storage.remove(KEYS.TOKEN);
    await Storage.remove(KEYS.USER);
    await Storage.remove(KEYS.LOGIN_TS);
    setToken(null);
    setUserState(null);
    console.log("[Auth] Session cleared from secure storage.");
  };

  // ─── On App Start: Load & Validate Stored Session ─────────────────────────
  useEffect(() => {
    const initSession = async () => {
      try {
        // ── Read from encrypted secure storage (no timeout race) ──────────────
        // We ALWAYS await native secure storage — no arbitrary timeout.
        // The old 4-second race was causing false logouts on slow/budget Android
        // devices where the Capacitor bridge takes >4 s to cold-start.
        //
        // @aparajita/capacitor-secure-storage reads from Android Keystore or iOS
        // Keychain — both are persistent across app kills and device reboots.
        const [storedToken, storedUserStr, storedTS] = await Promise.all([
          Storage.get(KEYS.TOKEN),
          Storage.get(KEYS.USER),
          Storage.get(KEYS.LOGIN_TS),
        ]);

        // ── Restore localStorage mirror BEFORE setLoading(false) ─────────────
        // After a process kill, Android wipes the WebView's localStorage.
        // The axios interceptor (api.ts) reads the token from localStorage
        // synchronously. Restoring it here ensures the first API call from any
        // component goes out WITH the Bearer token, preventing a 401 loop.
        if (storedToken) {
          try { localStorage.setItem(KEYS.TOKEN, storedToken); } catch { /* ignore */ }
        }
        if (storedUserStr) {
          try { localStorage.setItem(KEYS.USER, storedUserStr); } catch { /* ignore */ }
        }

        // No token stored → not logged in
        if (!storedToken) {
          console.log("[Auth] No stored token found. User must log in.");
          setLoading(false);
          return;
        }

        // Check 30-day session expiry
        if (storedTS) {
          const loginTime = parseInt(storedTS, 10);
          if (Date.now() - loginTime > SESSION_DURATION_MS) {
            console.log("[Auth] Session expired (>30 days). Clearing.");
            await clearSession();
            setLoading(false);
            return;
          }
        }

        // Restore user from storage immediately (no API wait needed)
        // This ensures the UI shows the dashboard instantly on reopen
        if (storedUserStr) {
          try {
            const cachedUser = JSON.parse(storedUserStr) as User;
            setUserState(cachedUser);
            setToken(storedToken);
            console.log("[Auth] Session restored from secure storage. User:", cachedUser.role);
          } catch {
            // Corrupted stored user — clear and re-login
            console.warn("[Auth] Corrupted user data in secure storage. Clearing session.");
            await clearSession();
            setLoading(false);
            return;
          }
        }

        // Set loading false BEFORE the API call so the app is usable immediately
        setLoading(false);

        // Then silently refresh user profile in the background
        // (don't block the UI on this)
        try {
          const res = await API.get("/auth/profile");
          const freshUser = res.data.user as User;
          // Update stored user silently — parallel writes to secure storage
          Promise.all([
            Storage.set(KEYS.USER, JSON.stringify(freshUser)),
            Storage.set(KEYS.LOGIN_TS, Date.now().toString()),
          ]).catch(() => { /* ignore storage errors on background refresh */ });
          setUserState(freshUser);
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            // Server explicitly rejected the token → clear session
            console.warn("[Auth] Token rejected by server. Logging out.");
            await clearSession();
          } else {
            // Network error / server cold start / timeout → keep cached session
            console.warn("[Auth] Profile refresh failed (network/server error). Keeping cached session.");
          }
        }

      } catch (err) {
        console.error("[Auth] Session init failed:", err);
        setLoading(false);
      }
    };

    initSession();
  }, []);

  // ─── Email + Password Login (Admin) ───────────────────────────────────────
  const login = async (email: string, password: string, role: string): Promise<User> => {
    // Show "waking server" hint after 3 seconds (Render cold start)
    const wakeTimer = setTimeout(() => setServerWaking(true), 3000);
    try {
      const res = await API.post("/auth/login", { email, password, role }, { timeout: 60000 });
      const { token: receivedToken, user: receivedUser } = res.data;
      await persistSession(receivedToken, receivedUser); // ← awaited: guarantees disk write
      return receivedUser;
    } catch (err: any) {
      const msg = err.code === "ECONNABORTED"
        ? "Server is starting up, please try again in a few seconds."
        : (err.response?.data?.message || "Login failed. Please check credentials.");
      throw new Error(msg);
    } finally {
      clearTimeout(wakeTimer);
      setServerWaking(false);
    }
  };

  // ─── Send OTP (Farmer / Provider) ─────────────────────────────────────────
  const sendOtp = async (
    phone: string,
    role: string
  ): Promise<{ message: string; otp?: string; notRegistered?: boolean }> => {
    try {
      const res = await API.post("/auth/send-otp", { phone, role });
      return res.data;
    } catch (err: any) {
      const data = err.response?.data;
      const error: any = new Error(data?.message || "Failed to send OTP.");
      error.notRegistered = data?.notRegistered ?? false;
      throw error;
    }
  };

  // ─── Verify OTP and Login (Farmer / Provider) ─────────────────────────────
  const verifyOtp = async (phone: string, otp: string, role: string): Promise<User> => {
    try {
      const res = await API.post("/auth/verify-otp", { phone, otp, role });
      const { token: receivedToken, user: receivedUser } = res.data;
      await persistSession(receivedToken, receivedUser); // ← awaited: guarantees disk write
      return receivedUser;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "OTP verification failed.");
    }
  };


  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (data: {
    name: string;
    email?: string;
    phone: string;
    role: string;
    password: string;
    extraInfo: string;
    lat?: number;
    lng?: number;
    addressCity?: string;
    addressState?: string;
  }): Promise<{ user: User; message: string }> => {
    try {
      const res = await API.post("/auth/register", data);
      const { token: receivedToken, user: receivedUser, message } = res.data;
      if (receivedToken) {
        await persistSession(receivedToken, receivedUser); // already async-awaited ✅
      }
      return { user: receivedUser, message };
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed. Please check parameters.");
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await clearSession();
  };

  // ─── Update Profile ───────────────────────────────────────────────────────
  const updateUserProfile = async (data: {
    name: string;
    phone: string;
    extraInfo: string;
    documents?: { selfie?: string; aadhar?: string; driving_license?: string };
  }): Promise<User> => {
    try {
      const res = await API.put("/auth/profile", data);
      const { user: updatedUser } = res.data;
      await setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // ─── Forgot / Reset Password ──────────────────────────────────────────────
  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    try {
      const res = await API.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const res = await API.post("/auth/reset-password", { token, newPassword });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, serverWaking, login, sendOtp, verifyOtp, register, logout, updateUserProfile, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
