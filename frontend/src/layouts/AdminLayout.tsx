import { Link, NavLink, useNavigate, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCog, CalendarRange, PieChart, LogOut, Bell,
  Menu, Tractor, Settings, BarChart3, ShieldAlert, Loader2, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // Only block on loading if we don't have a user yet (initial session restore).
  // If user is already set (just logged in), skip the spinner to avoid infinite loading.
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Farmers", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Providers", path: "/admin/providers", icon: <Tractor size={20} /> },
    { name: "Bookings", path: "/admin/bookings", icon: <CalendarRange size={20} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={20} /> },
    { name: "Surveys", path: "/admin/surveys", icon: <PieChart size={20} /> },
    { name: "Complaints", path: "/admin/complaints", icon: <AlertTriangle size={20} /> },
  ];

  // Bottom nav items (simplified set for mobile — 5 max)
  const bottomNavItems = [
    { name: "Home", path: "/admin", icon: <LayoutDashboard size={22} /> },
    { name: "Farmers", path: "/admin/users", icon: <Users size={22} /> },
    { name: "Providers", path: "/admin/providers", icon: <Tractor size={22} /> },
    { name: "Bookings", path: "/admin/bookings", icon: <CalendarRange size={22} /> },
    { name: "Complaints", path: "/admin/complaints", icon: <AlertTriangle size={22} /> },
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

  const userInitials = user ? getInitials(user.name) : "AD";

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">

      {/* ── Mobile Drawer Backdrop ── */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ── Sidebar (Desktop + mobile drawer) ── */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between fixed h-full z-50 transition-all duration-300 ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-64"
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-950 shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight">KisanSeeva</span>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin Console</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 text-lg leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl w-full text-xs font-bold text-red-400 hover:bg-red-950/40 transition border-0 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Exit Admin App</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper ── */}
      <div className="flex flex-col flex-1 md:pl-64 overflow-hidden">

        {/* Top Navbar */}
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-5 py-2 flex items-center justify-between sticky top-0 z-30 shadow-md shrink-0">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer shrink-0 md:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
            {/* Admin logo icon on mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shrink-0">
                <ShieldAlert size={14} className="text-white" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-white">KisanSeeva</span>
                <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider leading-none">Admin</p>
              </div>
            </div>
            <div className="hidden md:block">
              <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                🛡️ Admin Console
                <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded-full border border-red-800/60 font-bold hidden sm:inline">
                  Superadmin Mode
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* App Switcher — desktop only */}
            <button
              onClick={() => navigate("/app-launcher")}
              className="text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer hidden sm:block"
            >
              🔄 App Switcher
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500/40 flex items-center justify-center font-black text-xs text-red-400">
                {userInitials}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-bold text-white">{user?.name || "System Admin"}</p>
                <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet — scrollable */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-950 text-slate-100 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation Bar (md:hidden) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 md:hidden flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 min-w-0 ${
                isActive
                  ? "text-red-400 bg-red-950/60 border border-red-800/50"
                  : "text-slate-500 hover:text-slate-300"
              }`
            }
          >
            {item.icon}
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
