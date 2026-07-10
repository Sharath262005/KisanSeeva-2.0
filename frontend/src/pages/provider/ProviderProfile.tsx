import React, { useState } from "react";
import { User, Phone, MapPin, ShieldCheck, Tractor, Briefcase } from "lucide-react";
import { KSCard, KSButton, KSBadge } from "../../components/ui";

const ProviderProfile = () => {
  const [businessName, setBusinessName] = useState("Balaji Agri Services");
  const [owner, setOwner] = useState("Balaji Rao");
  const [phone, setPhone] = useState("+91 98765 01234");
  const [location, setLocation] = useState("Warangal Main Road, Warangal");
  const [range, setRange] = useState("30");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Business Profile</h1>
        <p className="text-slate-500 mt-1">Configure your agency details, service radius, and verify identity.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-2">
            <ShieldCheck size={20} />
            <span className="font-semibold">Business profile details updated successfully!</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Business Info */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Briefcase className="text-yellow-600" size={20} />
              Agency Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Owner / Contact Person</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              />
            </div>
          </KSCard>

          {/* Logistics / Operations */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Tractor className="text-yellow-600" size={20} />
              Service Logistics
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Base Hub Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Range (Radius in KMs)</label>
              <input
                type="number"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              />
            </div>

            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-700 mb-2">Verification Status</p>
              <KSBadge variant="success">
                <ShieldCheck size={14} /> Verified Provider
              </KSBadge>
            </div>
          </KSCard>
        </div>

        <div className="flex justify-end">
          <KSButton type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold border-0 px-8">
            Save Business Profile
          </KSButton>
        </div>
      </form>
    </div>
  );
};

export default ProviderProfile;
