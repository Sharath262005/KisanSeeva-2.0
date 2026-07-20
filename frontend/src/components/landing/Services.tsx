import { motion } from "framer-motion";
import { Tractor, Combine, Droplets, Sprout, Truck, Wheat, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Tractor,
    title: "Tractor Service",
    desc: "Book tractors for ploughing, sowing and field preparation. Available same day.",
    price: "₹800/hr",
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/25",
    border: "hover:border-blue-500/40",
    badge: "Most Booked",
    badgeColor: "bg-blue-500",
    bgGlow: "group-hover:bg-blue-500/5",
  },
  {
    icon: Combine,
    title: "Harvesting",
    desc: "Modern combine harvesters to cut your paddy, wheat and other crops efficiently.",
    price: "₹3,000/acre",
    gradient: "from-emerald-500 to-green-400",
    glow: "shadow-emerald-500/25",
    border: "hover:border-emerald-500/40",
    badge: "Seasonal",
    badgeColor: "bg-emerald-500",
    bgGlow: "group-hover:bg-emerald-500/5",
  },
  {
    icon: Droplets,
    title: "Drone Spraying",
    desc: "Precision pesticide and fertiliser spraying with GPS-guided agricultural drones.",
    price: "₹400/acre",
    gradient: "from-cyan-500 to-blue-400",
    glow: "shadow-cyan-500/25",
    border: "hover:border-cyan-500/40",
    badge: "New Tech",
    badgeColor: "bg-cyan-500",
    bgGlow: "group-hover:bg-cyan-500/5",
  },
  {
    icon: Sprout,
    title: "Rotavator",
    desc: "Deep soil preparation, mulching and soil aeration with rotavator attachments.",
    price: "₹600/hr",
    gradient: "from-green-500 to-teal-400",
    glow: "shadow-green-500/25",
    border: "hover:border-green-500/40",
    bgGlow: "group-hover:bg-green-500/5",
  },
  {
    icon: Truck,
    title: "Transport",
    desc: "Crop transportation from farm to mandi, warehouse or processing unit.",
    price: "₹1,500/trip",
    gradient: "from-orange-500 to-red-400",
    glow: "shadow-orange-500/25",
    border: "hover:border-orange-500/40",
    bgGlow: "group-hover:bg-orange-500/5",
  },
  {
    icon: Wheat,
    title: "Cultivation Support",
    desc: "Full cultivation packages including seeding, watering and crop management.",
    price: "Custom",
    gradient: "from-amber-500 to-yellow-400",
    glow: "shadow-amber-500/25",
    border: "hover:border-amber-500/40",
    bgGlow: "group-hover:bg-amber-500/5",
  },
];

function Services() {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-900/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-full mb-6 uppercase tracking-widest">
            <Sparkles size={12} />
            Our Services
          </span>
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            Everything Your{" "}
            <span className="gradient-text">Farm Needs</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From soil preparation to harvest — book trusted agricultural equipment and operators
            from verified providers in your district.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`group relative bg-slate-900/60 border border-white/5 ${service.border} rounded-3xl p-7 overflow-hidden transition-all duration-300 cursor-pointer ${service.bgGlow}`}
                onClick={() => navigate("/register?role=farmer")}
              >
                {/* Hover glow bg */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${service.gradient} opacity-0`} style={{ opacity: 0 }} />

                {/* Badge */}
                {service.badge && (
                  <span className={`absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${service.badgeColor} text-white shadow-lg`}>
                    {service.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-xl ${service.glow} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon size={26} className="text-white" />
                  {/* Icon glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10 scale-125`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.desc}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    From {service.price}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold group-hover:text-emerald-400 group-hover:gap-2.5 transition-all duration-200">
                    Book Now <ArrowRight size={14} />
                  </span>
                </div>

                {/* Bottom glow border */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register?role=farmer")}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all hover:gap-4 glow-emerald"
          >
            Browse All Services <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
