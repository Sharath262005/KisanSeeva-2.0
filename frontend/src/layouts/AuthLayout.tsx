import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tractor } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const slides = [
  {
    gradient: "from-emerald-800 via-green-900 to-teal-950",
    accentColor: "#10b981",
    icon: "🌾",
    tag: "Smart Farming",
    title: "Empowering Farmers, Enriching Communities.",
    description: "KisanSeeva bridges the gap between local farming requirements and reliable service providers, maximizing efficiency and crop yields."
  },
  {
    gradient: "from-amber-800 via-yellow-900 to-orange-950",
    accentColor: "#f59e0b",
    icon: "🚜",
    tag: "Modern Machinery",
    title: "Access the Best Equipment on Demand.",
    description: "Connect with verified service providers in your area to rent tractors, harvesters, and modern agricultural tools easily."
  },
  {
    gradient: "from-blue-800 via-indigo-900 to-slate-950",
    accentColor: "#6366f1",
    icon: "💰",
    tag: "Fair Pricing",
    title: "Transparent & Community Driven.",
    description: "Enjoy transparent hourly pricing and help build a stronger local farming community through shared resources."
  }
];

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left side: Form */}
      <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="KisanSeeva Logo" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) {
                  fallback.classList.remove('hidden');
                  fallback.classList.add('flex');
                }
              }}
            />
            <div className="hidden items-center gap-2 text-2xl font-bold text-green-700">
              <Tractor size={28} />
              <span>KisanSeeva</span>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="w-full max-w-md mx-auto my-auto py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">{title}</h1>
            <p className="text-slate-600 text-lg">{subtitle}</p>
          </div>
          {children}
        </div>

        {/* Footer */}
        <div className="text-slate-500 text-sm text-center lg:text-left mt-8">
          © 2026 KisanSeeva. Connecting rural India.
        </div>
      </div>

      {/* Right side: Branding Carousel — CSS gradients (no external images) */}
      <div className="hidden lg:block relative overflow-hidden">
        {/* Sliding panels */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`w-full h-full flex-shrink-0 relative bg-gradient-to-br ${slide.gradient}`}
            >
              {/* Decorative grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Glowing orbs */}
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-30"
                style={{ background: slide.accentColor }}
              />
              <div
                className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full blur-2xl opacity-20"
                style={{ background: slide.accentColor }}
              />
              {/* Large icon watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] opacity-10 select-none pointer-events-none">
                {slide.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        <div className="absolute bottom-16 left-16 right-16 z-20 text-white">
          <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 inline-block">
            {slides[currentSlide].tag}
          </span>
          <div className="min-h-[160px] flex flex-col justify-end">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-lg">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Carousel Indicators */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === index ? "w-8 bg-yellow-400" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

