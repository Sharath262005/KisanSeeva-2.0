import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sprout, Tractor, ShieldAlert, ArrowRight, LogIn } from "lucide-react";

const portals = [
  {
    role: "farmer",
    label: "Farmer Login",
    emoji: "🌾",
    icon: Sprout,
    description: "Access your dashboard to book tractors, harvesters, drones and more farm services.",
    color: {
      bg: "from-emerald-600 to-green-700",
      glow: "shadow-emerald-600/40",
      hover: "hover:shadow-emerald-500/60",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      icon: "bg-white/20",
      ring: "ring-emerald-500/30",
      border: "border-emerald-500/20 hover:border-emerald-400/50",
      dot: "bg-emerald-400",
    },
    features: ["Book farm services", "Track bookings", "Pay securely"],
  },
  {
    role: "provider",
    label: "Provider Login",
    emoji: "🚜",
    icon: Tractor,
    description: "Manage your equipment listings, accept bookings and grow your agri-service business.",
    color: {
      bg: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/40",
      hover: "hover:shadow-amber-400/60",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      icon: "bg-white/20",
      ring: "ring-amber-500/30",
      border: "border-amber-500/20 hover:border-amber-400/50",
      dot: "bg-amber-400",
    },
    features: ["Manage services", "Accept bookings", "Track earnings"],
  },
  {
    role: "admin",
    label: "Admin Login",
    emoji: "🛡️",
    icon: ShieldAlert,
    description: "Administer the platform — manage users, providers, bookings and generate reports.",
    color: {
      bg: "from-slate-600 to-indigo-700",
      glow: "shadow-indigo-700/40",
      hover: "hover:shadow-indigo-600/60",
      badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      icon: "bg-white/20",
      ring: "ring-indigo-500/30",
      border: "border-indigo-500/20 hover:border-indigo-400/50",
      dot: "bg-indigo-400",
    },
    features: ["User management", "View reports", "Platform control"],
  },
] as const;

function LoginPortalSection() {
  const navigate = useNavigate();

  return (
    <section
      id="login-portal"
      className="py-28 bg-slate-950 relative overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-full mb-6 uppercase tracking-widest">
            <LogIn size={13} />
            Choose Your Portal
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
            Sign In to{" "}
            <span className="gradient-text">Your Account</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Select your role below to access your personalised KisanSeeva dashboard.
          </p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {portals.map((portal, i) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/login?role=${portal.role}`)}
                className={`group cursor-pointer relative bg-slate-900/80 border ${portal.color.border} rounded-3xl p-7 overflow-hidden transition-all duration-300 shadow-2xl ${portal.color.glow} ${portal.color.hover}`}
              >
                {/* Card glow overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.color.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`} />

                {/* Top badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${portal.color.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${portal.color.dot} animate-pulse`} />
                    {portal.emoji} {portal.label}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${portal.color.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" />
                </div>

                {/* Text */}
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-white transition">
                  {portal.label}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {portal.description}
                </p>

                {/* Feature pills */}
                <ul className="flex flex-col gap-1.5 mb-7">
                  {portal.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span className={`w-1.5 h-1.5 rounded-full ${portal.color.dot} shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${portal.color.bg} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-200`}>
                  Login as {portal.label.replace(" Login", "")}
                  <ArrowRight
                    size={16}
                    className={`bg-gradient-to-br ${portal.color.bg} text-white rounded-full p-0.5 group-hover:translate-x-1 transition-transform duration-200`}
                    style={{ minWidth: 16 }}
                  />
                </div>

                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${portal.color.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 text-sm mt-10"
        >
          New to KisanSeeva?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition underline underline-offset-4"
          >
            Create a free account
          </button>
        </motion.p>
      </div>
    </section>
  );
}

export default LoginPortalSection;
