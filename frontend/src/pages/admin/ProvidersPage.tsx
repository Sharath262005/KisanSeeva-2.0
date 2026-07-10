import { useState } from "react";
import { Check, X, ShieldAlert, ShieldCheck, Phone, MapPin } from "lucide-react";
import { KSBadge } from "../../components/ui";

const initialProviders = [
  { id: "P-301", business: "Balaji Agri Services", owner: "Balaji Rao", phone: "+91 98765 01234", location: "Warangal, Telangana", status: "verified" },
  { id: "P-302", business: "Jai Kissan Equipment", owner: "Karan Singh", phone: "+91 99887 76655", location: "Medak, Telangana", status: "pending" },
  { id: "P-303", business: "Smart Agri Drones", owner: "Varun Reddy", phone: "+91 95432 10987", location: "Hyderabad, Telangana", status: "verified" },
];

const ProvidersPage = () => {
  const [providers, setProviders] = useState(initialProviders);

  const handleVerify = (id: string) => {
    setProviders(
      providers.map((p) => {
        if (p.id === id) {
          return { ...p, status: "verified" };
        }
        return p;
      })
    );
  };

  const handleSuspend = (id: string) => {
    setProviders(
      providers.map((p) => {
        if (p.id === id) {
          return { ...p, status: p.status === "suspended" ? "verified" : "suspended" };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Service Providers</h1>
        <p className="text-slate-400 mt-1">Review onboarding verification requests, machine lists, and statuses.</p>
      </div>

      {/* Providers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-400 font-semibold text-sm border-b border-slate-800">
                <th className="px-6 py-4">Provider ID</th>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Base Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/30 transition">
                  <td className="px-6 py-4 font-bold text-white">{p.id}</td>
                  <td className="px-6 py-4 font-semibold text-white">{p.business}</td>
                  <td className="px-6 py-4">{p.owner}</td>
                  <td className="px-6 py-4 text-sm"><span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-500" /> {p.phone}</span></td>
                  <td className="px-6 py-4 text-sm"><span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {p.location}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      p.status === "verified"
                        ? "bg-green-950/40 text-green-500 border-green-500/20"
                        : p.status === "pending"
                        ? "bg-yellow-950/40 text-yellow-500 border-yellow-500/20"
                        : "bg-red-950/40 text-red-500 border-red-500/20"
                    }`}>
                      <span className="capitalize">{p.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {p.status === "pending" && (
                      <button
                        onClick={() => handleVerify(p.id)}
                        className="p-2 bg-green-950/30 hover:bg-green-950/60 text-green-500 border border-green-500/20 rounded-xl transition"
                        title="Verify Business"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleSuspend(p.id)}
                      className={`p-2 rounded-xl transition ${
                        p.status === "suspended"
                          ? "bg-green-950/30 hover:bg-green-950/60 text-green-500 border border-green-500/20"
                          : "bg-red-950/30 hover:bg-red-950/60 text-red-500 border border-red-500/20"
                      }`}
                      title={p.status === "suspended" ? "Re-verify" : "Suspend Provider"}
                    >
                      {p.status === "suspended" ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
