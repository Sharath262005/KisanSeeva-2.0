import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { KSButton } from "../../components/ui";
import { Sprout, Tractor } from "lucide-react";

type Role = "farmer" | "provider";

const RegisterPage = () => {
  const [role, setRole] = useState<Role>("farmer");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1) {
      if (!name || !phone || !email || !password) {
        setError("Please fill in all basic fields");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2 && !extraInfo) {
      setError(
        role === "farmer"
          ? "Please enter your farm land details (acres / crop type)"
          : "Please enter your machinery details (vehicle number / name)"
      );
      return;
    }

    setError("");
    // Redirect to respective dashboard after mock register
    navigate(role === "farmer" ? "/farmer" : "/provider");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the KisanSeeva network to grow your farming operations"
    >
      <form onSubmit={handleRegister} className="space-y-6">
        {step === 1 ? (
          <>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("farmer")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    role === "farmer"
                      ? "border-green-700 bg-green-50 text-green-700 font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-500"
                  }`}
                >
                  <Sprout className="mb-2" size={28} />
                  <span className="text-sm">Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("provider")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    role === "provider"
                      ? "border-green-700 bg-green-50 text-green-700 font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-500"
                  }`}
                >
                  <Tractor className="mb-2" size={28} />
                  <span className="text-sm">Provider</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Basic Info Inputs */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@kisan.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            <KSButton type="button" onClick={handleNext} className="w-full py-4 text-center justify-center">
              Continue
            </KSButton>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {role === "farmer" ? "Farm Details" : "Machinery Details"}
              </label>
              <textarea
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                rows={4}
                placeholder={
                  role === "farmer"
                    ? "Enter land size (e.g. 5 acres), crop types (e.g. Paddy, Cotton), and location details."
                    : "Enter tractor/harvester models, plate numbers, and typical daily availability."
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <KSButton
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/2 py-4 text-center justify-center"
              >
                Back
              </KSButton>
              <KSButton type="submit" className="w-1/2 py-4 text-center justify-center">
                Submit
              </KSButton>
            </div>
          </>
        )}

        <div className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-bold text-green-700 hover:underline cursor-pointer"
          >
            Login Here
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
