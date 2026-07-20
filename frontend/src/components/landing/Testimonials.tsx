import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ramesh Kumar",
    village: "Warangal, Telangana",
    role: "Paddy Farmer · 5 Acres",
    rating: 5,
    review:
      "Booking a tractor was very simple. The provider Balaji arrived on time and completed ploughing in just one day. Earlier I used to wait 3–4 days searching manually. KisanSeeva saved my season!",
    initials: "RK",
    gradient: "from-blue-500 to-cyan-400",
    ringColor: "ring-blue-500/30",
  },
  {
    name: "Suresh Reddy",
    village: "Nizamabad, Telangana",
    role: "Cotton Farmer · 8 Acres",
    rating: 5,
    review:
      "The weather recommendations helped me plan harvesting before heavy rainfall. I saved almost 40% of my crop compared to last year. Really useful platform, would recommend to every farmer.",
    initials: "SR",
    gradient: "from-emerald-500 to-teal-400",
    ringColor: "ring-emerald-500/30",
  },
  {
    name: "Lakshmi Devi",
    village: "Karimnagar, Telangana",
    role: "Vegetable Farmer · 3 Acres",
    rating: 5,
    review:
      "Very simple interface. Even I could book a rotavator within minutes on my phone. I received regular updates and the provider was professional. The pricing was also fair and transparent.",
    initials: "LD",
    gradient: "from-violet-500 to-purple-400",
    ringColor: "ring-violet-500/30",
  },
  {
    name: "Venkat Naidu",
    village: "Medak, Telangana",
    role: "Sugarcane Farmer · 12 Acres",
    rating: 5,
    review:
      "Drone spraying saved me 3 full days of manual labour and used 30% less pesticide. The results were much better than traditional spraying. This is truly the future of farming.",
    initials: "VN",
    gradient: "from-orange-500 to-red-400",
    ringColor: "ring-orange-500/30",
  },
];

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-900/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-full mb-6 uppercase tracking-widest">
            Farmer Stories
          </span>
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            Trusted by <span className="gradient-text-gold">Real Farmers</span>
          </h2>
          <div className="section-divider mb-5" />
          <p className="text-slate-400 text-lg">
            Thousands of farmers across Telangana share their experience.
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative min-h-[320px] flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-slate-900/80 border border-white/8 rounded-3xl p-10 md:p-14 relative overflow-hidden"
            >
              {/* Large decorative quote */}
              <Quote size={120} className="absolute top-2 left-2 text-emerald-500/8" fill="currentColor" />
              {/* Background gradient accent */}
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-8 bg-gradient-to-br ${active.gradient}`} />

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1.5 mb-8">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} size={20} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-10 max-w-3xl font-medium">
                  "{active.review}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-5">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white font-black text-xl shadow-2xl ring-4 ${active.ringColor}`}>
                    {active.initials}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${active.gradient} blur-md -z-10 opacity-50 scale-125`} />
                  </div>
                  <div>
                    <p className="font-black text-white text-xl">{active.name}</p>
                    <p className="text-emerald-400 font-semibold text-sm">{active.village}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{active.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === activeIndex
                    ? "w-8 h-3 bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : "w-3 h-3 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;