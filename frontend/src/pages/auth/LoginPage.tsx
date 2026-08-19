import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { KSButton } from "../../components/ui";
import {
  Sprout, Tractor, ShieldAlert, Phone, Mail, ArrowRight, RefreshCw,
  AlertTriangle, CheckCircle2, ChevronLeft, Timer, ArrowLeft, Eye, EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type Role = "farmer" | "provider" | "admin";
type Step = "phone" | "otp";
type LoginMethod = "mobile" | "email";

// ─── Role config ─────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  farmer: {
    label: "Farmer",
    icon: Sprout,
    emoji: "🌾",
    theme: {
      tab: "text-emerald-600 border-emerald-600 bg-emerald-50",
      tabInactive: "text-slate-500 border-transparent hover:text-emerald-600",
      button: "bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800",
      ring: "focus:ring-emerald-500/30 focus:border-emerald-600",
      accent: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      otp: "focus:ring-2 focus:ring-emerald-500 border-emerald-300 bg-emerald-50/40",
      headerBg: "bg-gradient-to-br from-emerald-600 to-green-700",
      rolePill: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      methodTab: "border-emerald-600 text-emerald-700 bg-emerald-50",
    },
    placeholder: "Enter your registered mobile number",
    description: "Login with your registered mobile number",
  },
  provider: {
    label: "Provider",
    icon: Tractor,
    emoji: "🚜",
    theme: {
      tab: "text-amber-600 border-amber-600 bg-amber-50",
      tabInactive: "text-slate-500 border-transparent hover:text-amber-600",
      button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      ring: "focus:ring-amber-500/30 focus:border-amber-500",
      accent: "text-amber-700",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      otp: "focus:ring-2 focus:ring-amber-500 border-amber-300 bg-amber-50/40",
      headerBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      rolePill: "bg-amber-100 text-amber-800 border border-amber-200",
      methodTab: "border-amber-500 text-amber-700 bg-amber-50",
    },
    placeholder: "Enter your registered mobile number",
    description: "Login with your registered mobile number",
  },
  admin: {
    label: "Admin",
    icon: ShieldAlert,
    emoji: "🛡️",
    theme: {
      tab: "text-indigo-600 border-indigo-600 bg-indigo-50",
      tabInactive: "text-slate-500 border-transparent hover:text-indigo-600",
      button: "bg-gradient-to-r from-slate-700 to-indigo-800 hover:from-slate-800 hover:to-indigo-900",
      ring: "focus:ring-indigo-500/30 focus:border-indigo-600",
      accent: "text-indigo-700",
      badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
      otp: "",
      headerBg: "bg-gradient-to-br from-slate-700 to-indigo-800",
      rolePill: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      methodTab: "border-indigo-600 text-indigo-700 bg-indigo-50",
    },
    placeholder: "admin@kisanseeva.com",
    description: "Secure admin portal — email & password",
  },
} as const;

// ─── OTP Input ───────────────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  ringClass,
}: {
  value: string;
  onChange: (v: string) => void;
  ringClass: string;
}) {
  const digits = 6;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = value.padEnd(digits, " ").split("").slice(0, digits);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (chars[i].trim()) {
        const next = chars.map((c, idx) => (idx === i ? " " : c)).join("").trimEnd();
        onChange(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
        const next = chars.map((c, idx) => (idx === i - 1 ? " " : c)).join("").trimEnd();
        onChange(next);
      }
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;
    if (raw.length > 1) {
      const pasted = raw.slice(0, digits);
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, digits - 1)]?.focus();
      return;
    }
    const next = chars.map((c, idx) => (idx === i ? raw[0] : c)).join("").trimEnd();
    onChange(next);
    if (i < digits - 1) inputRefs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: digits }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={chars[i].trim() || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-12 text-center text-xl font-black border-2 rounded-xl outline-none transition-all duration-200 ${ringClass} ${chars[i].trim() ? "bg-white shadow-sm" : "bg-slate-50"}`}
        />
      ))}
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function Countdown({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return; }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
      <Timer size={13} />
      <span>
        OTP expires in <span className={remaining < 60 ? "text-red-500 font-black" : "text-slate-700"}>{m}:{s}</span>
      </span>
      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-1000"
          style={{ width: `${100 - pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main LoginPage ───────────────────────────────────────────────────────────
const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, sendOtp, verifyOtp, serverWaking } = useAuth();

  const roleParam = searchParams.get("role") as Role | null;
  const isStandalone = searchParams.get("standalone") === "true";
  const validRoles: Role[] = ["farmer", "provider", "admin"];
  const initialRole: Role = roleParam && validRoles.includes(roleParam) ? roleParam : "farmer";

  const [role] = useState<Role>(initialRole);

  // Auto-navigate when user logs in (driven by AuthContext state, not manual navigate)
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else if (user.role === "farmer") navigate("/farmer", { replace: true });
      else if (user.role === "provider") navigate("/provider", { replace: true });
    }
  }, [user, navigate]);

  // Logo map per role
  const ROLE_LOGO: Record<Role, string> = {
    farmer: "/farmer-logo.png",
    provider: "/provider-logo.png",
    admin: "/admin-logo.png",
  };
  const appLogo = ROLE_LOGO[role];

  // Title/subtitle per role
  const ROLE_TITLE: Record<Role, { title: string; subtitle: string }> = {
    farmer: { title: "Farmer Login", subtitle: "Book machinery, check crop health & manage your farm" },
    provider: { title: "Partner Login", subtitle: "Accept bookings, manage your equipment & grow earnings" },
    admin: { title: "Admin Login", subtitle: "Manage users, providers, bookings & platform operations" },
  };
  const [step, setStep] = useState<Step>("phone");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");

  // OTP flow state (Farmer / Provider)
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);
  const [otpExpired, setOtpExpired] = useState(false);

  // Email login state (Farmer / Provider / Admin)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cfg = ROLE_CONFIG[role];
  const Icon = cfg.icon;

  // Reset errors on method switch
  const switchMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    setError("");
    setNotRegistered(false);
    setStep("phone");
    setOtp("");
    setDevOtp(null);
  };

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setNotRegistered(false);
    setLoading(true);
    try {
      const result = await sendOtp(phone.trim(), role);
      setDevOtp(result.otp ?? null);
      setOtpSentAt(Date.now());
      setOtpExpired(false);
      setStep("otp");
    } catch (err: any) {
      if (err.notRegistered) {
        setNotRegistered(true);
      } else {
        setError(err.message || "Failed to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyOtp(phone.trim(), otp, role);
      // Navigation handled by useEffect above (user state change)
    } catch (err: any) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email Login (Farmer / Provider / Admin) ───────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password, role);
      // Navigation is handled by useEffect above (user state change → navigate)
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setOtp("");
    setError("");
    setLoading(true);
    try {
      const result = await sendOtp(phone.trim(), role);
      setDevOtp(result.otp ?? null);
      setOtpSentAt(Date.now());
      setOtpExpired(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AuthLayout
      title={ROLE_TITLE[role].title}
      subtitle={ROLE_TITLE[role].subtitle}
      appLogo={isStandalone ? appLogo : undefined}
      role={role}
    >
      {/* Role Identity Banner */}
      <div className="mb-6">
        {/* Back to Home — only shown in combined web mode */}
        {!isStandalone && (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition mb-4"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        )}

        {/* Role Banner */}
        <div className={`flex items-center gap-3 rounded-2xl p-4 ${cfg.theme.headerBg} text-white shadow-lg overflow-hidden relative`}>
          {/* Background watermark logo */}
          {isStandalone && (
            <img
              src={appLogo}
              alt=""
              className="absolute right-0 top-0 h-full w-auto opacity-10 object-contain pointer-events-none"
            />
          )}
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Signing in as</p>
            <p className="text-base font-black truncate">{cfg.emoji} {cfg.label} Portal</p>
          </div>
          {/* Change role only shown in web combined mode */}
          {!isStandalone && (
            <div className="ml-auto shrink-0">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-xs font-semibold text-white/70 hover:text-white underline transition"
              >
                Change role
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── FARMER / PROVIDER — Mobile OTP or Email ──────────────────────────────── */}
      {role !== "admin" && (
        <>
          {/* Login Method Toggle */}
          <div className="flex rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => switchMethod("mobile")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all ${loginMethod === "mobile"
                  ? cfg.theme.methodTab + " border-b-2"
                  : "text-slate-400 hover:text-slate-600 bg-white"
                }`}
            >
              <Phone size={15} />
              Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => switchMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all ${loginMethod === "email"
                  ? cfg.theme.methodTab + " border-b-2"
                  : "text-slate-400 hover:text-slate-600 bg-white"
                }`}
            >
              <Mail size={15} />
              Email Login
            </button>
          </div>

          {/* ── Mobile OTP Flow ── */}
          {loginMethod === "mobile" && (
            <>
              {/* Step 1: Phone input */}
              {step === "phone" && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  {/* Not-registered alert */}
                  {notRegistered && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
                      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-800">Number not registered</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          This mobile number isn't linked to a {cfg.label.toLowerCase()} account.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate(`/register?role=${role}`)}
                          className="mt-2 text-xs font-bold text-amber-700 underline hover:text-amber-900 transition"
                        >
                          Register now →
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} className={cfg.theme.accent} />
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setNotRegistered(false); setError(""); }}
                        placeholder={cfg.placeholder}
                        maxLength={15}
                        className={`w-full pl-14 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none ${cfg.theme.ring} transition text-slate-800 font-medium placeholder:text-slate-400`}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{cfg.description}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 text-center justify-center text-sm font-bold ${cfg.theme.button} text-white rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? "Sending OTP..." : (
                      <>Send OTP <ArrowRight size={16} /></>
                    )}
                  </button>

                  <div className="text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <span
                      onClick={() => navigate(`/register?role=${role}`)}
                      className={`font-bold ${cfg.theme.accent} hover:underline cursor-pointer`}
                    >
                      Register Here
                    </span>
                  </div>
                </form>
              )}

              {/* Step 2: OTP input */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <button
                    type="button"
                    onClick={() => { setStep("phone"); setOtp(""); setError(""); setDevOtp(null); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                  >
                    <ChevronLeft size={15} /> Change number
                  </button>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <Phone size={16} className={cfg.theme.accent} />
                    <div>
                      <p className="text-xs text-slate-500">OTP sent to</p>
                      <p className="text-sm font-black text-slate-800">+91 {phone}</p>
                    </div>
                    <CheckCircle2 size={16} className="ml-auto text-emerald-500" />
                  </div>

                  {/* Dev-mode OTP hint */}
                  {devOtp && (
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl px-4 py-3 text-center hover:bg-amber-100 transition cursor-pointer group"
                      title="Click to auto-fill OTP"
                    >
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                        🔧 Dev Mode — Click to Auto-Fill OTP
                      </p>
                      <p className="text-2xl font-black text-amber-800 tracking-[0.35em]">{devOtp}</p>
                      <p className="text-[10px] text-amber-500 mt-1 group-hover:text-amber-700">👆 Tap to fill automatically</p>
                    </button>
                  )}

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">
                      Enter 6-digit OTP
                    </label>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      ringClass={cfg.theme.otp}
                    />
                  </div>

                  {otpSentAt && !otpExpired && (
                    <Countdown
                      seconds={600}
                      onExpire={() => setOtpExpired(true)}
                    />
                  )}
                  {otpExpired && (
                    <p className="text-xs text-red-500 text-center font-semibold">OTP expired. Please request a new one.</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6 || otpExpired}
                    className={`w-full py-3.5 text-center justify-center text-sm font-bold ${cfg.theme.button} text-white rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className={`text-xs font-semibold ${cfg.theme.accent} hover:underline flex items-center gap-1 mx-auto transition`}
                    >
                      <RefreshCw size={12} /> Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ── Email Login Flow (Farmer / Provider) ── */}
          {loginMethod === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className={cfg.theme.accent} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder={`your@email.com`}
                  className={`w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none ${cfg.theme.ring} transition text-slate-800 font-medium placeholder:text-slate-400`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}
                    className={`text-xs font-semibold ${cfg.theme.accent} hover:underline`}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 border border-slate-200 rounded-2xl focus:outline-none ${cfg.theme.ring} transition text-slate-800 font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-center justify-center text-sm font-bold ${cfg.theme.button} text-white rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading
                  ? (serverWaking ? "⏳ Server waking up..." : "Signing In...")
                  : <><span>Sign In</span> <ArrowRight size={16} /></>}
              </button>

              <div className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate(`/register?role=${role}`)}
                  className={`font-bold ${cfg.theme.accent} hover:underline cursor-pointer`}
                >
                  Register Here
                </span>
              </div>
            </form>
          )}
        </>
      )}

      {/* ── ADMIN — Email + Password ──────────────────────────────────────── */}
      {role === "admin" && (
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 flex items-start gap-3">
            <ShieldAlert size={16} className="text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 font-medium">
              Admin access is restricted. Use your assigned credentials.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kisanseeva.com"
              className={`w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none ${ROLE_CONFIG.admin.theme.ring} transition`}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}
                className="text-xs font-semibold text-indigo-700 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 border border-slate-200 rounded-2xl focus:outline-none ${ROLE_CONFIG.admin.theme.ring} transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <KSButton
            type="submit"
            disabled={loading}
            className="w-full py-4 text-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                {serverWaking ? "⏳ Server waking up... please wait" : "Signing In..."}
              </span>
            ) : "Sign In as Admin"}
          </KSButton>
        </form>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
