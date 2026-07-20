import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  const trusted = [
    { label: "2,500+ Farmers", icon: "🧑‍🌾" },
    { label: "500+ Providers", icon: "🚜" },
    { label: "4.8★ Rated", icon: "⭐" },
    { label: "15K+ Bookings", icon: "✅" },
  ];

  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center grain-overlay">
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-emerald-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/30 rounded-full blur-[100px] animate-float-delay" />
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[80px]" />
        <div className="absolute top-[60%] left-[30%] w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[60px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6 py-36 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-full mb-8 uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              🌾 India's #1 Agri-Services Platform
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            {/* Heading */}
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-white mb-8">
              Book Farm{" "}
              <span className="relative inline-block">
                <span className="gradient-text text-glow">Services</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full origin-left"
                />
              </span>
              <br />
              In{" "}
              <span className="gradient-text-gold">Minutes.</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-10">
              Connect with verified tractor owners, harvesting machines, drone operators and
              transport services right in your village —{" "}
              <span className="text-emerald-400 font-semibold">fast, simple and trusted.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register?role=farmer")}
                className="relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all text-base overflow-hidden glow-emerald"
              >
                <span className="absolute inset-0 animate-shimmer" />
                🚜 Book a Service <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register?role=provider")}
                className="flex items-center gap-2.5 glass text-white font-semibold px-8 py-4 rounded-2xl border border-white/15 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-base"
              >
                <Zap size={16} className="text-amber-400" />
                Become a Provider
              </motion.button>
            </div>

            {/* Trust Pills */}
            <div className="flex flex-wrap gap-3">
              {trusted.map((t, i) => (
                <motion.span
                  key={t.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 px-4 py-2 rounded-full transition-all cursor-default"
                >
                  <span>{t.icon}</span>
                  {t.label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Premium Visual */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
            className="relative lg:block hidden"
          >
            {/* Main Image Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(5,150,105,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                alt="Farmer using KisanSeeva"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              {/* Glowing border overlay */}
              <div className="absolute inset-0 rounded-3xl border border-emerald-500/20 animate-border-glow" />

              {/* Overlay Card - Live Booking */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute bottom-6 left-6 right-6 glass-light border border-white/90 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Booking Confirmed</p>
                    </div>
                    <p className="text-slate-900 font-black text-base">Tractor Service — Warangal</p>
                    <p className="text-emerald-700 text-sm font-semibold mt-0.5">Balaji Agri Services · Arriving Tomorrow 6 AM</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg glow-emerald">
                    <CheckCircle size={22} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Rating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="absolute -top-5 -right-5 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 rounded-2xl px-5 py-3.5 shadow-2xl shadow-amber-500/40 flex items-center gap-2 font-black glow-gold"
            >
              <Star size={16} fill="currentColor" />
              4.8 / 5 Rating
            </motion.div>

            {/* Floating Stats Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="absolute -left-6 top-1/3 glass border border-white/10 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["🧑‍🌾", "👩‍🌾", "🧑‍🌾"].map((e, i) => (
                  <div key={i} className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center text-sm border-2 border-slate-900">
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-black text-base">2,500+</p>
                <p className="text-slate-400 text-xs font-medium">Active Farmers</p>
              </div>
            </motion.div>

            {/* Floating Growth Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.0, duration: 0.5 }}
              className="absolute -left-6 bottom-28 glass border border-emerald-500/20 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">+38% Efficiency</p>
                <p className="text-slate-400 text-xs">vs. manual booking</p>
              </div>
            </motion.div>

            {/* Decorative ring */}
            <div className="absolute -top-12 -right-12 w-40 h-40 border border-emerald-500/10 rounded-full animate-spin-slow" />
            <div className="absolute -top-8 -right-8 w-24 h-24 border border-emerald-500/20 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }} />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />

      {/* Shield badge bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500 text-xs font-medium z-20"
      >
        <Shield size={12} className="text-emerald-500" />
        Verified providers · Secure payments · Trusted by 2,500+ farmers
      </motion.div>
    </section>
  );
}

export default Hero;