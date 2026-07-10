import React, { useState } from "react";
import { User, Phone, MapPin, Sprout, Landmark, ShieldCheck } from "lucide-react";
import { KSCard, KSButton } from "../../components/ui";

const FarmerProfile = () => {
  const [name, setName] = useState("Ramesh Kumar");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [village, setVillage] = useState("Warangal District");
  const [state, setState] = useState("Telangana");
  const [landSize, setLandSize] = useState("5");
  const [crops, setCrops] = useState("Paddy, Cotton, Maize");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your farm profile, land details and credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-2">
            <ShieldCheck size={20} />
            <span className="font-semibold">Profile details updated successfully!</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* General Details */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <User className="text-green-700" size={20} />
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>
          </KSCard>

          {/* Farm Land Details */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sprout className="text-green-700" size={20} />
              Farm Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Village / Dist</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Land Size (Acres)</label>
              <input
                type="number"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Crops Cultivated</label>
              <input
                type="text"
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>
          </KSCard>
        </div>

        <div className="flex justify-end">
          <KSButton type="submit" className="px-8">
            Save Changes
          </KSButton>
        </div>
      </form>
    </div>
  );
};

export default FarmerProfile;
