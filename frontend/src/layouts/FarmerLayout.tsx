import { Link, NavLink, useNavigate, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, User, LogOut, Menu, Tractor, Sprout, BarChart3, Loader2, AlertTriangle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "../components/ui/NotificationDropdown";
import MoreSheet from "../components/layout/MoreSheet";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/common/LanguageSelector";
import ThemeSelector from "../components/common/ThemeSelector";

const FarmerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();

  // Only block on loading if we don't have a user yet (initial session restore).
  // If user is already set (just logged in), skip the spinner to avoid infinite loading.
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "farmer") {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: t("dashboard"), path: "/farmer", icon: <LayoutDashboard size={20} /> },
    { name: t("bookService"), path: "/farmer/book", icon: <Sprout size={20} /> },
    { name: t("myBookings"), path: "/farmer/bookings", icon: <CalendarRange size={20} /> },
    { name: t("priceSurveys"), path: "/farmer/surveys", icon: <BarChart3 size={20} /> },
    { name: t("complaints"), path: "/farmer/complaints", icon: <AlertTriangle size={20} /> },
    { name: t("myProfile"), path: "/farmer/profile", icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const userInitials = user ? getInitials(user.name) : "F";

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Sidebar (Desktop view) */}
      <aside
        className={`hidden md:flex bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex-col justify-between fixed h-full z-40 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800 group">
            <img
              src="/farmer-logo.png"
              alt="Farmer Logo"
              className={`object-contain transition-all duration-300 ${isSidebarOpen ? 'w-32 h-auto' : 'w-10 h-10'}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) {
                  fallback.classList.remove('hidden');
                  fallback.classList.add('flex');
                }
              }}
            />
            <div className="hidden items-center gap-3">
              <Tractor className="text-emerald-600 shrink-0" size={28} />
              {isSidebarOpen && (
                <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">KisanSeeva</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/farmer"}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 border-l-4 border-emerald-400 pl-3 pr-4"
                      : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 px-4"
                  }`
                }
              >
                {item.icon}
                {isSidebarOpen && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-semibold">{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-0 ${isSidebarOpen ? "md:pl-64" : "md:pl-20"}`}>
        {/* Top Navbar */}
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-5 py-2.5 flex items-center justify-between sticky top-0 z-30 max-w-full shadow-xs">
          {/* Left: Logo + Greeting */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hidden md:block cursor-pointer shrink-0"
            >
              <Menu size={18} />
            </button>
            {/* App Logo — mobile only */}
            <img
              src="/farmer-logo.png"
              alt="KisanSeeva Farmer"
              className="h-9 w-auto max-w-[110px] object-contain shrink-0 md:hidden"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="min-w-0 hidden md:block">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white tracking-tight truncate max-w-[140px] sm:max-w-xs">
                Namaste, {user?.name ? user.name.split(" ")[0] : "Farmer"} 👋
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Dropdown Selector */}
            <LanguageSelector variant="compact" />

            {/* Brightness / Theme Dropdown Selector */}
            <ThemeSelector variant="compact" />

            {/* Notification Bell Icon */}
            <NotificationDropdown />

            {/* Profile Avatar Icon */}
            <Link
              to="/farmer/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700 hover:ring-2 hover:ring-emerald-400 transition cursor-pointer shrink-0 overflow-hidden shadow-xs"
              title="My Account"
            >
              {user?.documents?.selfie ? (
                <img
                  src={user.documents.selfie}
                  alt={user?.name || "Profile"}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : null}
              <span style={{ display: user?.documents?.selfie ? 'none' : 'inline' }} className="text-[11px] font-black">{userInitials}</span>
            </Link>
          </div>
        </header>

        {/* Content Outlet — scrollable */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 pb-28 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Streamlined Mobile Bottom Navigation Bar (< 768px) with Equal Sizing & Alignment */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 md:hidden flex items-center justify-between shadow-2xl safe-area-bottom">
        <NavLink
          to="/farmer"
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl text-[11px] transition-all active:scale-95 min-w-0 ${
              isActive
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold"
            }`
          }
        >
          <LayoutDashboard size={20} className="shrink-0 mb-0.5" />
          <span className="truncate w-full text-center">Home</span>
        </NavLink>

        <NavLink
          to="/farmer/book"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl text-[11px] transition-all active:scale-95 min-w-0 ${
              isActive
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold"
            }`
          }
        >
          <Sprout size={20} className="shrink-0 mb-0.5" />
          <span className="truncate w-full text-center">Book</span>
        </NavLink>

        <NavLink
          to="/farmer/bookings"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl text-[11px] transition-all active:scale-95 min-w-0 ${
              isActive
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold"
            }`
          }
        >
          <CalendarRange size={20} className="shrink-0 mb-0.5" />
          <span className="truncate w-full text-center">Bookings</span>
        </NavLink>

        <NavLink
          to="/farmer/profile"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl text-[11px] transition-all active:scale-95 min-w-0 ${
              isActive
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold"
            }`
          }
        >
          <User size={20} className="shrink-0 mb-0.5" />
          <span className="truncate w-full text-center">Account</span>
        </NavLink>

        {/* More Tab */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl text-[11px] font-semibold transition-all active:scale-95 cursor-pointer min-w-0 ${
            isMoreOpen
              ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
          }`}
        >
          <MoreHorizontal size={20} className="shrink-0 mb-0.5" />
          <span className="truncate w-full text-center">More</span>
        </button>
      </nav>

      <MoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        accentColor="text-emerald-700"
        items={[
          { label: "Price Surveys", path: "/farmer/surveys", icon: <BarChart3 size={24} /> },
          { label: "Complaints",   path: "/farmer/complaints", icon: <AlertTriangle size={24} /> },
          { label: "My Profile",   path: "/farmer/profile",   icon: <User size={24} /> },
        ]}
      />
    </div>
  );
};

export default FarmerLayout;

