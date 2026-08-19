import { Link, NavLink, useNavigate, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, User, LogOut, Menu, Tractor, Sprout, BarChart3, Loader2, AlertTriangle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "../components/ui/NotificationDropdown";
import MoreSheet from "../components/layout/MoreSheet";
import { useLanguage } from "../context/LanguageContext";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-green-700" size={40} />
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
  const userLocation = user ? user.extraInfo.split(",").pop()?.trim() || "India" : "India";

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Sidebar (Desktop view) */}
      <aside
        className={`hidden md:flex bg-white border-r border-slate-100 flex-col justify-between fixed h-full z-40 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 group">
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
              <Tractor className="text-green-700 shrink-0" size={28} />
              {isSidebarOpen && (
                <span className="text-xl font-bold text-slate-800 tracking-tight">KisanSeeva</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/farmer"}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-250 ${
                    isActive
                      ? "bg-green-700 text-white font-semibold shadow-md"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
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
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl w-full text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-semibold">{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-0 ${isSidebarOpen ? "md:pl-64" : "md:pl-20"}`}>
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 px-3 sm:px-5 py-2 flex items-center justify-between sticky top-0 z-30 shadow-sm max-w-full overflow-hidden">
          {/* Left: Logo + Greeting */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hidden md:block cursor-pointer shrink-0"
            >
              <Menu size={18} />
            </button>
            {/* App Logo — mobile only */}
            <img
              src="/farmer-logo.png"
              alt="KisanSeeva Farmer"
              className="h-8 w-auto max-w-[90px] object-contain shrink-0 md:hidden"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="min-w-0 hidden md:block">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight truncate max-w-[140px] sm:max-w-xs">
                Namaste, {user?.name ? user.name.split(" ")[0] : "Sharath"} 👋
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Notification Bell Icon */}
            <NotificationDropdown />

            {/* Profile Avatar Icon */}
            <Link
              to="/farmer/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 hover:ring-2 hover:ring-emerald-400 transition cursor-pointer shrink-0 overflow-hidden shadow-xs"
              title="My Account"
            >
              {user?.documents?.selfie ? (
                <img
                  src={user.documents.selfie}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-[11px] font-black">{userInitials}</span>
              )}
            </Link>
          </div>
        </header>

        {/* Content Outlet — scrollable */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 pb-28 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Streamlined Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 md:hidden flex items-center justify-around shadow-2xl">
        <NavLink
          to="/farmer"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all active:scale-95 ${
              isActive
                ? "text-emerald-800 bg-emerald-100/90 shadow-xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <LayoutDashboard size={20} className="shrink-0" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/farmer/book"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all active:scale-95 ${
              isActive
                ? "text-emerald-800 bg-emerald-100/90 shadow-xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <Sprout size={20} className="shrink-0" />
          <span>Book Services</span>
        </NavLink>

        <NavLink
          to="/farmer/bookings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all active:scale-95 ${
              isActive
                ? "text-emerald-800 bg-emerald-100/90 shadow-xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <CalendarRange size={20} className="shrink-0" />
          <span>My Bookings</span>
        </NavLink>

        <NavLink
          to="/farmer/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold transition-all active:scale-95 ${
              isActive
                ? "text-emerald-800 bg-emerald-100/90 shadow-xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <User size={20} className="shrink-0" />
          <span>Account</span>
        </NavLink>

        {/* More Tab */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold text-slate-500 hover:text-slate-800 transition-all active:scale-95 cursor-pointer"
        >
          <MoreHorizontal size={20} className="shrink-0" />
          <span>More</span>
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
