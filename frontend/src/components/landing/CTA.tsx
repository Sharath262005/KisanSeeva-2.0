import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Tractor, Users, Sparkles } from "lucide-react";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Animated mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[80px] animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-full mb-8 uppercase tracking-widest"
          >
            <Sparkles size={12} />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Start Today — It's Free
          </motion.span>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Transform Your Farm{" "}
            <span className="gradient-text">This Season</span>
          </h2>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
            Join <span className="text-emerald-400 font-semibold">2,500+ farmers</span> and{" "}
            <span className="text-emerald-400 font-semibold">500+ service providers</span> already using
            KisanSeeva to save time, reduce costs, and grow smarter.
          </p>

          {/* Two Cards */}
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-12">
            {/* Farmer Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate("/register?role=farmer")}
              className="group cursor-pointer relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 text-left shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50 overflow-hidden transition-all glow-emerald"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500 to-emerald-600" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users size={26} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">I'm a Farmer</h3>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                  Book tractors, harvesters, and more. Get the best services at your farm.
                </p>
                <span className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                  Register as Farmer <ArrowRight size={16} />
                </span>
              </div>
            </motion.div>

            {/* Provider Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate("/register?role=provider")}
              className="group cursor-pointer relative bg-slate-800/80 border border-white/10 hover:border-emerald-500/30 rounded-3xl p-8 text-left shadow-2xl overflow-hidden transition-all"
            >
              <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-900/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/8 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                  <Tractor size={26} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">I'm a Provider</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  List your equipment, accept bookings, and grow your agricultural service business.
                </p>
                <span className="flex items-center gap-2 text-emerald-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Register as Provider <ArrowRight size={16} />
                </span>
              </div>
            </motion.div>
          </div>

          {/* Already have account */}
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition underline underline-offset-4"
            >
              Sign in here
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
