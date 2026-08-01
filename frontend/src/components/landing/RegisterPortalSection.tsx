import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sprout, Tractor, ArrowRight, UserPlus, CheckCircle } from "lucide-react";

const portals = [
  {
    role: "farmer",
    label: "Register as Farmer",
    emoji: "🌾",
    icon: Sprout,
    tagline: "Book farm services in minutes",
    description:
      "Sign up as a farmer to book tractors, harvesters, drone sprayers and more — right from your village.",
    perks: [
      "Book verified farm services near you",
      "OTP-based secure login",
      "Track & manage all your bookings",
      "Raise complaints & give feedback",
    ],
    color: {
      gradient: "from-emerald-600 to-green-700",
      glow: "shadow-emerald-600/30",
      hover: "hover:shadow-emerald-500/50",
      border: "border-emerald-500/20 hover:border-emerald-400/50",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
      dot: "bg-emerald-400",
      tick: "text-emerald-400",
    },
  },
  {
    role: "provider",
    label: "Register as Provider",
    emoji: "🚜",
    icon: Tractor,
    tagline: "List your machines & earn more",
    description:
      "Sign up as a service provider to list your equipment, accept bookings from farmers and grow your business.",
    perks: [
      "List tractors, harvesters, drones & more",
      "Receive booking requests instantly",
      "Track earnings & payments",
      "Expand reach across districts",
    ],
    color: {
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30",
      hover: "hover:shadow-amber-400/50",
      border: "border-amber-500/20 hover:border-amber-400/50",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
      dot: "bg-amber-400",
      tick: "text-amber-400",
    },
  },
] as const;

function RegisterPortalSection() {
  const navigate = useNavigate();

  return (
    <section
      id="register-portal"
      className="py-28 bg-slate-900 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-emerald-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-full mb-6 uppercase tracking-widest">
            <UserPlus size={13} />
            Create Your Account
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
            Join as a{" "}
            <span className="gradient-text">Farmer</span>
            {" "}or{" "}
            <span className="gradient-text-gold">Provider</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Choose your role and get started for free. The registration takes less than 5 minutes.
          </p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-7">
          {portals.map((portal, i) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.01 }}
                onClick={() => navigate(`/register?role=${portal.role}`)}
                className={`group cursor-pointer relative bg-slate-950/60 border ${portal.color.border} rounded-3xl p-8 overflow-hidden transition-all duration-300 shadow-2xl ${portal.color.glow} ${portal.color.hover}`}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.color.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 rounded-3xl`} />

                {/* Bottom glow bar on hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${portal.color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Badge */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${portal.color.badge} mb-6`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${portal.color.dot} animate-pulse`} />
                  {portal.emoji} Free Registration
                </span>

                {/* Icon + title */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-16 h-16 bg-gradient-to-br ${portal.color.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    <Icon size={30} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{portal.label}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${portal.color.gradient} bg-clip-text text-transparent`}>
                      {portal.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-7">
                  {portal.description}
                </p>

                {/* Perks list */}
                <ul className="space-y-2.5 mb-8">
                  {portal.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={15} className={`${portal.color.tick} shrink-0 mt-0.5`} />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r ${portal.color.gradient} text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  Get Started — {portal.emoji} {portal.label.replace("Register as ", "")}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Already have account note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 text-sm mt-10"
        >
          Already have an account?{" "}
          <a
            href="#login-portal"
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition underline underline-offset-4"
          >
            Sign in here
          </a>
        </motion.p>
      </div>
    </section>
  );
}

export default RegisterPortalSection;
