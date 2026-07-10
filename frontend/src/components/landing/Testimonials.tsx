import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Ramesh Kumar",
    village: "Warangal, Telangana",
    review:
      "Booking a tractor became very easy. The provider arrived on time and the work was completed without any hassle. Highly recommended!",
  },
  {
    name: "Suresh Reddy",
    village: "Nizamabad, Telangana",
    review:
      "The weather recommendations helped me plan harvesting before rainfall. Really useful platform, saved my crops this season.",
  },
  {
    name: "Lakshmi Devi",
    village: "Karimnagar, Telangana",
    review:
      "Very simple interface. I booked a rotavator within minutes and received regular SMS and booking updates on my phone.",
  },
];

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-slate-800 mb-4">
          What Farmers Say
        </h2>
        <p className="text-gray-600 mb-16 text-lg">
          Trusted by thousands of farmers across India.
        </p>

        {/* Carousel Container */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-10 md:p-16 border border-slate-100 max-w-2xl mx-auto relative"
            >
              <Quote className="text-green-200 absolute top-6 left-6" size={80} />
              
              <div className="relative z-10">
                <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-8">
                  "{testimonials[activeIndex].review}"
                </p>

                <div>
                  <h3 className="font-bold text-xl text-slate-800">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="text-green-700 font-medium mt-1">
                    {testimonials[activeIndex].village}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:-left-12 p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-full shadow-md text-slate-600 hover:text-green-700 transition-all duration-300 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-12 p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-full shadow-md text-slate-600 hover:text-green-700 transition-all duration-300 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-green-700" : "w-3 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;