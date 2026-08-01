import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Menu, X, Tractor, Sparkles, ChevronDown,
  Sprout, ShieldAlert, LogIn, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LanguageSelector from "../common/LanguageSelector";

const signInOptions = [
  {
    role: "farmer",
    label: "Farmer Login",
    emoji: "🌾",
    icon: Sprout,
    color: "text-emerald-400 hover:bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  {
    role: "provider",
    label: "Provider Login",
    emoji: "🚜",
    icon: Tractor,
    color: "text-amber-400 hover:bg-amber-500/10",
    dot: "bg-amber-400",
  },
  {
    role: "admin",
    label: "Admin Login",
    emoji: "🛡️",
    icon: ShieldAlert,
    color: "text-indigo-400 hover:bg-indigo-500/10",
    dot: "bg-indigo-400",
  },
] as const;

const registerOptions = [
  {
    role: "farmer",
    label: "Register as Farmer",
    emoji: "🌾",
    icon: Sprout,
    color: "text-emerald-400 hover:bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  {
    role: "provider",
    label: "Register as Provider",
    emoji: "🚜",
    icon: Tractor,
    color: "text-amber-400 hover:bg-amber-500/10",
    dot: "bg-amber-400",
  },
] as const;

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setSignInOpen(false);
      }
      if (registerRef.current && !registerRef.current.contains(e.target as Node)) {
        setRegisterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Register", href: "#register-portal" },
    { label: "Login", href: "#login-portal" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white p-1 rounded-2xl shadow-md border border-emerald-500/20 group-hover:scale-105 transition-all duration-300">
            <img
              src="/logo.png"
              alt="KisanSeeva Logo"
              className="h-10 w-auto object-contain rounded-xl"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Kisan<span className="gradient-text">Seeva</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-slate-300 hover:text-emerald-400 font-medium text-sm transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector variant="dark" />

          {/* Sign In Dropdown */}
          <div className="relative" ref={signInRef}>
            <button
              onClick={() => { setSignInOpen((p) => !p); setRegisterOpen(false); }}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/25 rounded-xl transition-all duration-200 hover:bg-white/5"
            >
              <LogIn size={14} />
              Sign In
              <ChevronDown size={14} className={`transition-transform duration-200 ${signInOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {signInOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="p-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-2">
                      Select your role
                    </p>
                    {signInOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.role}
                          onClick={() => { setSignInOpen(false); navigate(`/login?role=${opt.role}`); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${opt.color}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                            <Icon size={15} />
                          </div>
                          <span>{opt.emoji} {opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Get Started (Register) Dropdown */}
          <div className="relative" ref={registerRef}>
            <button
              onClick={() => { setRegisterOpen((p) => !p); setSignInOpen(false); }}
              className="relative flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all duration-200 overflow-hidden"
            >
              <span className="absolute inset-0 animate-shimmer" />
              <Sparkles size={14} />
              Get Started
              <ChevronDown size={14} className={`transition-transform duration-200 ${registerOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {registerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="p-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-2">
                      Register as
                    </p>
                    {registerOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.role}
                          onClick={() => { setRegisterOpen(false); navigate(`/register?role=${opt.role}`); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${opt.color}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                            <Icon size={15} />
                          </div>
                          <span>{opt.emoji} {opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/98 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-emerald-400 font-medium py-2 border-b border-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile Sign In Section */}
              <div className="mt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                  <LogIn size={11} /> Sign In as
                </p>
                <div className="flex flex-col gap-2">
                  {signInOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.role}
                        onClick={() => { setMenuOpen(false); navigate(`/login?role=${opt.role}`); }}
                        className={`flex items-center gap-3 px-4 py-3 border border-white/10 rounded-xl text-sm font-semibold transition-all ${opt.color}`}
                      >
                        <Icon size={16} />
                        {opt.emoji} {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Register Section */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                  <UserPlus size={11} /> Register as
                </p>
                <div className="flex flex-col gap-2">
                  {registerOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.role}
                        onClick={() => { setMenuOpen(false); navigate(`/register?role=${opt.role}`); }}
                        className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${
                          opt.role === "farmer"
                            ? "from-emerald-600/20 to-green-700/20 border-emerald-500/30"
                            : "from-amber-500/20 to-orange-600/20 border-amber-500/30"
                        } border rounded-xl text-sm font-bold text-white transition-all`}
                      >
                        <Icon size={16} />
                        {opt.emoji} {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
