import { Link, NavLink, useNavigate, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, User, LogOut, Menu, Tractor, DollarSign, BarChart3, Loader2, AlertTriangle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "../components/ui/NotificationDropdown";
import MoreSheet from "../components/layout/MoreSheet";
import { useLanguage } from "../context/LanguageContext";

const ProviderLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
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

  if (user?.role !== "provider") {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: t("dashboard"), path: "/provider", icon: <LayoutDashboard size={20} /> },
    { name: t("myMachinery"), path: "/provider/services", icon: <Tractor size={20} /> },
    { name: t("myBookings"), path: "/provider/bookings", icon: <CalendarRange size={20} /> },
    { name: t("earnings"), path: "/provider/earnings", icon: <DollarSign size={20} /> },
    { name: t("priceSurveys"), path: "/provider/surveys", icon: <BarChart3 size={20} /> },
    { name: t("complaints"), path: "/provider/complaints", icon: <AlertTriangle size={20} /> },
    { name: t("myProfile"), path: "/provider/profile", icon: <User size={20} /> },
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

  const userInitials = user ? getInitials(user.name) : "P";

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
              src="/provider-logo.png"
              alt="Provider Logo"
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
                end={item.path === "/provider"}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-250 ${
                    isActive
                      ? "bg-yellow-500 text-slate-900 font-semibold shadow-md"
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
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-0 ${isSidebarOpen ? "md:pl-64" : "md:pl-20"}`}>
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 px-3 sm:px-5 py-2 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Left: Logo + App Name */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hidden md:block cursor-pointer shrink-0"
            >
              <Menu size={18} />
            </button>
            {/* Provider App Logo — mobile */}
            <img
              src="/provider-logo.png"
              alt="KisanSeeva Partner"
              className="h-8 w-auto max-w-[90px] object-contain shrink-0 md:hidden"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 hidden md:block truncate max-w-[150px]">{t("providerPortal")}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Availability Toggle — hidden on mobile to save space */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {isOnline ? t("acceptingJobs") : t("offline")}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                  isOnline ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isOnline ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Profile Brief */}
            <Link to="/provider/profile" className="flex items-center gap-2 border-l border-slate-100 pl-3 hover:opacity-80 transition">
              {user?.documents?.selfie ? (
                <img
                  src={user.documents.selfie}
                  alt="Profile"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-amber-300 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-xs md:text-sm shadow-xs">
                  {userInitials}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800">{user?.name || "Provider"}</p>
                <p className="text-xs text-slate-400">Owner (Verified)</p>
              </div>
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

      {/* Mobile Bottom Navigation Bar (Visible on phones < 768px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 md:hidden flex items-center justify-around shadow-2xl">
        <NavLink
          to="/provider"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
              isActive ? "text-amber-600 font-extrabold bg-amber-50" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/provider/services"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
              isActive ? "text-amber-600 font-extrabold bg-amber-50" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <Tractor size={20} />
          <span>Services</span>
        </NavLink>

        <NavLink
          to="/provider/bookings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
              isActive ? "text-amber-600 font-extrabold bg-amber-50" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <CalendarRange size={20} />
          <span>Requests</span>
        </NavLink>

        <NavLink
          to="/provider/earnings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
              isActive ? "text-amber-600 font-extrabold bg-amber-50" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <DollarSign size={20} />
          <span>Earnings</span>
        </NavLink>

        <NavLink
          to="/provider/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition active:scale-95 ${
              isActive ? "text-amber-600 font-extrabold bg-amber-50" : "text-slate-500 hover:text-slate-800"
            }`
          }
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>

        {/* More tab */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      <MoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        accentColor="text-amber-600"
        items={[
          { label: "Price Surveys", path: "/provider/surveys",    icon: <BarChart3 size={24} /> },
          { label: "Complaints",   path: "/provider/complaints",  icon: <AlertTriangle size={24} /> },
          { label: "My Profile",   path: "/provider/profile",     icon: <User size={24} /> },
        ]}
      />
    </div>
  );
};

export default ProviderLayout;
