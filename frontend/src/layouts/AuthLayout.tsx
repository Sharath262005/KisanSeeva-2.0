import React from "react";
import { Link } from "react-router-dom";
import { Tractor } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left side: Form */}
      <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
            <Tractor size={28} />
            <span>KisanSeeva</span>
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

      {/* Right side: Image/Branding */}
      <div className="hidden lg:block relative overflow-hidden bg-green-800">
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/60 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=1000"
          alt="Indian Agriculture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-16 left-16 right-16 z-20 text-white">
          <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
            Smart Farming
          </span>
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Empowering Farmers, Enriching Communities.
          </h2>
          <p className="text-green-100 text-lg leading-relaxed max-w-lg">
            KisanSeeva bridges the gap between local farming requirements and reliable service providers, maximizing efficiency and crop yields.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
