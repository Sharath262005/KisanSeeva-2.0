import { useNavigate } from "react-router-dom";
import {
  Tractor, Wrench, ArrowRight, ShieldCheck, Sparkles,
  Bot, LogIn, UserPlus, Leaf, Settings2, Star, ChevronRight, ShieldAlert
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function MobileRoleSelectorPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentLanguage } = useLanguage();

  const handleFarmerClick = () => {
    if (user?.role === "farmer") navigate("/farmer");
    else navigate("/login?portal=farmer");
  };

  const handleProviderClick = () => {
    if (user?.role === "provider") navigate("/provider");
    else navigate("/login?portal=provider");
  };

  const handleAdminClick = () => {
    if (user?.role === "admin") navigate("/admin");
    else navigate("/login?portal=admin");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden select-none"
      style={{
        background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 25%, #f9fafb 60%, #fff7ed 100%)"
      }}
    >
      {/* Decorative background blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle top green bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shrink-0" />

      {/* ── Header ── */}
      <header className="px-5 pt-6 pb-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-300/30">
            <Leaf size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              KisanSeeva
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">Agriculture & Equipment Network</p>
          </div>
        </div>

        {/* Language badge */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-base leading-none">🌐</span>
          <span>{currentLanguage.nativeName}</span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 px-5 pt-4 pb-8 flex flex-col z-10 max-w-md mx-auto w-full gap-5">

        {/* ── Welcome Back Banner (if logged in) ── */}
        {user && (
          <div className="bg-white border border-emerald-200 rounded-2xl px-4 py-3.5 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-base shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium">Welcome back 👋</p>
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-emerald-600 font-semibold capitalize">{user.role} account</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => navigate(user.role === "farmer" ? "/farmer" : "/provider")}
                className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Continue →
              </button>
              <button
                onClick={handleLogout}
                className="text-[11px] font-bold text-slate-500 hover:text-red-500 px-3 py-1 rounded-lg transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* ── Title ── */}
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Sparkles size={13} />
            <span>Choose Your App</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Which portal would<br />you like to open?
          </h2>
          <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
            Dedicated interfaces tailored for Farmers and Machinery Service Providers.
          </p>
        </div>

        {/* ── Role Cards ── */}
        <div className="space-y-4">

          {/* FARMER CARD */}
          <button
            onClick={handleFarmerClick}
            className="w-full group bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-3xl p-5 shadow-md hover:shadow-emerald-200/60 hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 text-white shrink-0">
                <Tractor size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    🌾 Kisan App
                  </span>
                  <ChevronRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  Farmer App Mode
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Book tractors, harvesters & threshers. Get AI crop guidance and real-time tracking.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <Bot size={12} />
                <span>Seed AI Assistant</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span>4.8 Rating</span>
              </div>
            </div>
          </button>

          {/* PROVIDER CARD */}
          <button
            onClick={handleProviderClick}
            className="w-full group bg-white border-2 border-amber-200 hover:border-amber-400 rounded-3xl p-5 shadow-md hover:shadow-amber-200/60 hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200 text-white shrink-0">
                <Wrench size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    🚜 Provider App
                  </span>
                  <ChevronRight size={18} className="text-amber-500 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Provider App Mode
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  List equipment & services. Accept farmer bookings, track earnings, manage jobs.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                <ShieldCheck size={12} />
                <span>Aadhaar Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Settings2 size={11} />
                <span>Job Dashboard</span>
              </div>
            </div>
          </button>

          {/* ADMIN CARD */}
          <button
            onClick={handleAdminClick}
            className="w-full group bg-slate-900 border-2 border-red-900/60 hover:border-red-500 rounded-3xl p-5 shadow-md hover:shadow-red-950/60 hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-950 text-white shrink-0">
                <ShieldAlert size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-extrabold text-red-300 bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 rounded-full">
                    🛡️ Admin Console
                  </span>
                  <ChevronRight size={18} className="text-red-400 group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                  Admin App Mode
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Verify users & providers, oversee platform bookings, publish mandi rates & resolve complaints.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-900/40">
                <ShieldCheck size={12} />
                <span>System Console</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Settings2 size={11} />
                <span>Full Access</span>
              </div>
            </div>
          </button>
        </div>

        {/* ── Footer Auth Links ── */}
        {!user && (
          <div className="mt-2 pt-4 border-t border-slate-200 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl hover:bg-emerald-100 active:scale-95 transition cursor-pointer shadow-sm"
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 active:scale-95 transition cursor-pointer shadow-sm"
            >
              <UserPlus size={15} />
              Register
            </button>
          </div>
        )}

        {/* Desktop switch */}
        <p className="text-center text-[11px] text-slate-400 mt-1">
          <button
            onClick={() => navigate("/web")}
            className="underline hover:text-slate-600 transition cursor-pointer"
          >
            View Desktop Overview
          </button>
        </p>

      </main>
    </div>
  );
}
