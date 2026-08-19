import { ReactNode, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Home, Tractor, Calendar, User, Wrench, DollarSign, ArrowLeft,
  MoreHorizontal, MessageSquare, X, ChevronRight, PhoneCall
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface MobileAppShellProps {
  children: ReactNode;
  title?: string;
}

export default function MobileAppShell({ children, title }: MobileAppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const role = user?.role || "farmer";
  const path = location.pathname;

  const isFarmer = role === "farmer";
  const isProvider = role === "provider";

  const isRootTab =
    path === "/farmer" ||
    path === "/provider" ||
    path === "/admin";

  const getPageTitle = () => {
    if (title) return title;
    if (path.includes("/book")) return "Book Machinery";
    if (path.includes("/bookings")) return "My Bookings";
    if (path.includes("/services")) return "My Listed Services";
    if (path.includes("/earnings")) return "My Earnings";
    if (path.includes("/profile")) return "Account Profile";
    if (path.includes("/surveys")) return "Pricing Survey";
    if (path.includes("/complaints")) return "Help & Complaints";
    return isFarmer ? "Kisan Seeva Home" : "Provider Dashboard";
  };

  // ── Nav link helper ──────────────────────────────────────────────────────
  const navCls = (active: boolean, color: "emerald" | "amber") =>
    `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 min-w-[52px] ${
      active
        ? color === "emerald"
          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
          : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
    }`;

  // ── More drawer link helper ──────────────────────────────────────────────
  const MoreLink = ({
    to, icon: Icon, label, color = "slate",
  }: { to: string; icon: any; label: string; color?: string }) => (
    <Link
      to={to}
      onClick={() => setMoreOpen(false)}
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-[0.98] shadow-sm"
    >
      <div className={`p-2.5 rounded-xl bg-${color}-50 dark:bg-${color}-950/40`}>
        <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
      </div>
      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm flex-1">{label}</span>
      <ChevronRight size={16} className="text-slate-400" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-16 md:pb-0">

      {/* ══ MOBILE TOP APP BAR ══ */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {!isRootTab && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {isFarmer ? "🌾 Kisan App Portal" : isProvider ? "🚜 Provider App Portal" : "Admin Console"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* User Badge */}
          <Link
            to={isFarmer ? "/farmer/profile" : "/provider/profile"}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="max-w-[70px] truncate">{user?.name?.split(" ")[0] || "User"}</span>
          </Link>
        </div>
      </header>

      {/* ══ MAIN BODY CONTENT ══ */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* ══ MOBILE BOTTOM NAVIGATION BAR ══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-1 py-1 md:hidden flex items-center justify-around shadow-2xl safe-area-bottom">

        {/* ── FARMER NAV: Home | Book Service | Complaint | More ── */}
        {isFarmer && (
          <>
            <Link to="/farmer" className={navCls(path === "/farmer", "emerald")}>
              <Home size={20} />
              <span>Home</span>
            </Link>

            {/* QUICK BOOK — prominent CTA */}
            <Link
              to="/farmer/book"
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 min-w-[52px] ${
                path === "/farmer/book"
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <div className={`p-1 rounded-lg ${path === "/farmer/book" ? "" : "bg-emerald-600"}`}>
                <Tractor size={path === "/farmer/book" ? 20 : 18} className={path === "/farmer/book" ? "" : "text-white"} />
              </div>
              <span className={path !== "/farmer/book" ? "text-emerald-700 dark:text-emerald-400 font-extrabold" : ""}>Book</span>
            </Link>

            {/* QUICK COMPLAINT */}
            <Link
              to="/farmer/complaints"
              className={navCls(path.includes("/complaints"), "emerald")}
            >
              <MessageSquare size={20} />
              <span>Complaint</span>
            </Link>

            {/* MORE ≡ */}
            <button
              onClick={() => setMoreOpen(true)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 min-w-[52px] ${
                moreOpen ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <MoreHorizontal size={20} />
              <span>More</span>
            </button>
          </>
        )}

        {/* ── PROVIDER NAV: Home | Services | Requests | More ── */}
        {isProvider && (
          <>
            <Link to="/provider" className={navCls(path === "/provider", "amber")}>
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link to="/provider/services" className={navCls(path.includes("/services"), "amber")}>
              <Wrench size={20} />
              <span>Services</span>
            </Link>

            <Link to="/provider/bookings" className={navCls(path.includes("/bookings"), "amber")}>
              <Calendar size={20} />
              <span>Requests</span>
            </Link>

            {/* MORE ≡ */}
            <button
              onClick={() => setMoreOpen(true)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 min-w-[52px] ${
                moreOpen ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <MoreHorizontal size={20} />
              <span>More</span>
            </button>
          </>
        )}
      </nav>

      {/* ══ MORE DRAWER / BOTTOM SHEET ══ */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-900 rounded-t-3xl shadow-2xl md:hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-base">
                  {isFarmer ? "🌾 Farmer Menu" : "🚜 Provider Menu"}
                </p>
                <p className="text-xs text-slate-500">{user?.name || "User"}</p>
              </div>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <div className="px-4 py-4 space-y-2.5 max-h-[70vh] overflow-y-auto pb-8">

              {isFarmer && (
                <>
                  <MoreLink to="/farmer/bookings" icon={Calendar} label="My Bookings" color="blue" />
                  <MoreLink to="/farmer/profile" icon={User} label="My Profile & Settings" color="emerald" />
                  <MoreLink to="/farmer/complaints" icon={MessageSquare} label="Help & Raise Complaint" color="orange" />
                </>
              )}

              {isProvider && (
                <>
                  <MoreLink to="/provider/earnings" icon={DollarSign} label="My Earnings" color="green" />
                  <MoreLink to="/provider/profile" icon={User} label="My Profile & Settings" color="amber" />
                  <MoreLink to="/provider/complaints" icon={MessageSquare} label="Help & Raise Complaint" color="orange" />
                </>
              )}

              {/* Contact Support */}
              <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 mt-1">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60">
                  <PhoneCall size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Helpline: 1800-XXX-XXXX</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">Mon–Sat, 9 AM – 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
