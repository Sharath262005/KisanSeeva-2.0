import { motion } from "framer-motion";
import { ShieldCheck, CloudSun, MapPinned, Bell, Zap, IndianRupee } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Providers Only",
    desc: "Every service provider undergoes KYC verification including Aadhaar, equipment documents and field background checks before getting listed.",
    gradient: "from-emerald-500 to-teal-400",
    glow: "shadow-emerald-500/30",
    number: "01",
  },
  {
    icon: CloudSun,
    title: "Weather-Aware Farming",
    desc: "Integrated weather forecasting gives you crop-specific recommendations before you schedule any farm activity.",
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/30",
    number: "02",
  },
  {
    icon: MapPinned,
    title: "Hyperlocal Discovery",
    desc: "Our village-level location system helps you find equipment available within 5–20 km of your farm — not in another district.",
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-violet-500/30",
    number: "03",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    desc: "Stay updated with instant booking confirmations, provider arrival alerts, and payment receipts directly on your phone.",
    gradient: "from-orange-500 to-red-400",
    glow: "shadow-orange-500/30",
    number: "04",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "No phone calls, no waiting. Book your equipment slot in under 60 seconds from any smartphone or feature phone.",
    gradient: "from-amber-400 to-yellow-400",
    glow: "shadow-amber-400/30",
    number: "05",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "No hidden charges. See exact pricing upfront before confirming. Pay securely after service completion.",
    gradient: "from-emerald-400 to-green-400",
    glow: "shadow-emerald-400/30",
    number: "06",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-900/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-900/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold px-5 py-2.5 rounded-full mb-6 uppercase tracking-widest">
            Why KisanSeeva?
          </span>
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            Built for <span className="gradient-text">Indian Farmers</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature is designed around the real challenges faced by smallholder farmers
            across Telangana, Andhra Pradesh and beyond.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative bg-slate-900/80 border border-white/5 hover:border-white/15 rounded-3xl p-8 overflow-hidden transition-all duration-300 cursor-default"
              >
                {/* Watermark Number */}
                <span className={`absolute top-4 right-6 text-7xl font-black bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent opacity-10 leading-none select-none`}>
                  {feature.number}
                </span>

                {/* Hover background glow */}
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`} />

                {/* Icon */}
                <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-xl ${feature.glow} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon size={26} className="text-white" />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-md -z-10 scale-125 opacity-0 group-hover:opacity-50 transition-opacity`} />
                </div>

                <h3 className="text-xl font-black text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;