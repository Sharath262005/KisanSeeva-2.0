import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Landing Page
import LandingPage from "../pages/landing/LandingPage";

// Authentication Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import PendingApprovalPage from "../pages/auth/PendingApprovalPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Farmer Portal Pages
import FarmerLayout from "../layouts/FarmerLayout";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import BookService from "../pages/farmer/BookService";
import MyBookings from "../pages/farmer/MyBookings";
import FarmerProfile from "../pages/farmer/FarmerProfile";

// Provider Portal Pages
import ProviderLayout from "../layouts/ProviderLayout";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import MyServices from "../pages/provider/MyServices";
import ProviderBookings from "../pages/provider/ProviderBookings";
import Earnings from "../pages/provider/Earnings";
import ProviderProfile from "../pages/provider/ProviderProfile";

// Admin Console Pages
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersPage from "../pages/admin/UsersPage";
import ProvidersPage from "../pages/admin/ProvidersPage";
import BookingsPage from "../pages/admin/BookingsPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SurveyPage from "../pages/admin/SurveyPage";
import SurveyResponsePage from "../pages/shared/SurveyResponsePage";
import ComplaintPage from "../pages/shared/ComplaintPage";
import AdminComplaintsPage from "../pages/admin/AdminComplaintsPage";

// Mobile Launcher Page
import MobileRoleSelectorPage from "../pages/auth/MobileRoleSelectorPage";

function RootPage() {
  const { user, loading } = useAuth();
  const env = (import.meta as any).env || {};
  const appMode = env.VITE_APP_MODE || env.MODE;

  // ── STEP 1: Always wait for session restore from @capacitor/preferences ──
  // This MUST happen before any navigation decision. Without this wait, the app
  // renders before the token is loaded from storage and always redirects to login.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <Loader2 className="animate-spin text-green-700" size={40} />
      </div>
    );
  }

  // ── STEP 2: If user is already logged in, go straight to their dashboard ──
  // This applies to ALL modes (standalone farmer/provider/admin or unified).
  // User stays logged in until they explicitly press Logout.
  if (user) {
    if (user.role === "farmer") return <Navigate to="/farmer" replace />;
    if (user.role === "provider") return <Navigate to="/provider" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  // ── STEP 3: No active session — decide where to send the user ──

  // Standalone APK mode (farmer/provider/admin separate apps) → role-specific login
  if (appMode === "farmer") return <Navigate to="/login?role=farmer&standalone=true" replace />;
  if (appMode === "provider") return <Navigate to="/login?role=provider&standalone=true" replace />;
  if (appMode === "admin") return <Navigate to="/login?role=admin&standalone=true" replace />;

  // Unified APK — show role selector on mobile, landing page on desktop
  const isCapacitorNative = typeof window !== "undefined" && Boolean((window as any).Capacitor?.isNativePlatform?.());
  const isMobileScreen = typeof window !== "undefined" && window.innerWidth < 768;

  if (isCapacitorNative || isMobileScreen) {
    return <MobileRoleSelectorPage />;
  }

  return <LandingPage />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootPage />} />
      <Route path="/web" element={<LandingPage />} />
      <Route path="/app-launcher" element={<MobileRoleSelectorPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pending-approval" element={<PendingApprovalPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Farmer Dashboard Sub-routes */}
      <Route path="/farmer" element={<FarmerLayout />}>
        <Route index element={<FarmerDashboard />} />
        <Route path="book" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="surveys" element={<SurveyResponsePage />} />
        <Route path="complaints" element={<ComplaintPage />} />
        <Route path="profile" element={<FarmerProfile />} />
      </Route>

      {/* Provider Dashboard Sub-routes */}
      <Route path="/provider" element={<ProviderLayout />}>
        <Route index element={<ProviderDashboard />} />
        <Route path="services" element={<MyServices />} />
        <Route path="bookings" element={<ProviderBookings />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="surveys" element={<SurveyResponsePage />} />
        <Route path="complaints" element={<ComplaintPage />} />
        <Route path="profile" element={<ProviderProfile />} />
      </Route>

      {/* Admin Dashboard Sub-routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="providers" element={<ProvidersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="surveys" element={<SurveyPage />} />
        <Route path="complaints" element={<AdminComplaintsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
