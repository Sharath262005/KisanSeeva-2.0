import { motion } from "framer-motion";
import { UserCircle, Search, CalendarCheck, Star, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserCircle,
    title: "Create Your Account",
    desc: "Register as a farmer in under 2 minutes. Just your name, phone number and village location.",
    gradient: "from-emerald-500 to-teal-400",
    glow: "shadow-emerald-500/40",
    number: "01",
  },
  {
    step: "02",
    icon: Search,
    title: "Browse & Select a Service",
    desc: "Choose from tractors, harvesters, drones and more. Filter by your location and preferred date.",
    gradient: "from-amber-400 to-orange-400",
    glow: "shadow-amber-400/40",
    number: "02",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Confirm Your Booking",
    desc: "Pick a date and time slot. Your booking is instantly sent to the provider for confirmation.",
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/40",
    number: "03",
  },
  {
    step: "04",
    icon: Star,
    title: "Service Delivered & Rate",
    desc: "Provider arrives at your farm, completes the work. Pay and leave a rating for the community.",
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-violet-500/40",
    number: "04",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(5,150,105,0.05)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold px-5 py-2.5 rounded-full mb-6 uppercase tracking-widest">
            Simple Process
          </span>
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Get agricultural equipment delivered to your farm in four effortless steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-4 gap-6">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-emerald-500/50 via-amber-400/50 via-blue-500/50 to-violet-500/50" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-violet-400 origin-left opacity-60"
            />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group relative z-10 flex flex-col items-center text-center"
              >
                {/* Step Icon */}
                <div className="relative mb-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-2xl ${step.glow} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon size={34} className="text-white" />
                    {/* Glow behind */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} blur-xl opacity-0 group-hover:opacity-50 -z-10 scale-150 transition-opacity`} />
                  </div>
                  {/* Step number badge */}
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-slate-950`}>
                    {i + 1}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-slate-900/60 border border-white/5 group-hover:border-white/15 rounded-3xl p-6 transition-all duration-300 w-full">
                  {/* Watermark number */}
                  <span className={`block text-8xl font-black bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-10 -mb-4 leading-none`}>
                    {step.number}
                  </span>
                  <h3 className="text-lg font-black text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 rounded-3xl relative overflow-hidden"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 animate-gradient-x" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative z-10 p-12 text-center">
            <h3 className="text-4xl font-black text-white mb-4">
              Ready to Book Your First Service?
            </h3>
            <p className="text-emerald-100 text-base mb-8 max-w-lg mx-auto">
              Join thousands of farmers who save time and money with KisanSeeva every season.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/register?role=farmer"
                className="flex items-center gap-2 bg-white text-emerald-700 font-black px-8 py-3.5 rounded-2xl hover:bg-emerald-50 transition shadow-2xl hover:gap-3"
              >
                🌾 Register as Farmer <ArrowRight size={16} />
              </a>
              <a
                href="/register?role=provider"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-2xl border border-white/25 transition hover:gap-3"
              >
                🚜 Register as Provider <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
