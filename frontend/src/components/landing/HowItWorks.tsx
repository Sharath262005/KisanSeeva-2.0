import { MapPin, PhoneCall, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <MapPin size={32} className="text-white" />,
    title: "1. Select Location",
    desc: "Choose your village or farm location to find nearby active service providers.",
    color: "bg-green-600",
  },
  {
    icon: <PhoneCall size={32} className="text-white" />,
    title: "2. Choose & Book",
    desc: "Pick from verified tractors, harvesters, or drones and schedule your slot.",
    color: "bg-yellow-500",
  },
  {
    icon: <CheckCircle size={32} className="text-white" />,
    title: "3. Service Delivery",
    desc: "The provider arrives at your farm and completes the service. Pay after completion.",
    color: "bg-emerald-600",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-slate-800 mb-5">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-20 text-lg">
          Get agricultural services in three simple steps.
        </p>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-slate-100 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${step.color} shadow-lg mb-8`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
