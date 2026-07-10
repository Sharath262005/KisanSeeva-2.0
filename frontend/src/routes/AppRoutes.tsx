import { Routes, Route } from "react-router-dom";

// Landing Page
import LandingPage from "../pages/landing/LandingPage";

// Authentication Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

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

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Farmer Dashboard Sub-routes */}
      <Route path="/farmer" element={<FarmerLayout />}>
        <Route index element={<FarmerDashboard />} />
        <Route path="book" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="profile" element={<FarmerProfile />} />
      </Route>

      {/* Provider Dashboard Sub-routes */}
      <Route path="/provider" element={<ProviderLayout />}>
        <Route index element={<ProviderDashboard />} />
        <Route path="services" element={<MyServices />} />
        <Route path="bookings" element={<ProviderBookings />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<ProviderProfile />} />
      </Route>

      {/* Admin Dashboard Sub-routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="providers" element={<ProvidersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;