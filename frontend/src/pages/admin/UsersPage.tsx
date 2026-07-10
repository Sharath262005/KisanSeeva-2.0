import { useState } from "react";
import { Search, UserCheck, UserX, MapPin, Phone } from "lucide-react";
import { KSBadge } from "../../components/ui";

const initialFarmers = [
  { id: "F-102", name: "Ramesh Kumar", phone: "+91 98765 43210", village: "Warangal, Telangana", land: "5 Acres", status: "active" },
  { id: "F-103", name: "Venkat Reddy", phone: "+91 91234 56789", village: "Nizamabad, Telangana", land: "8 Acres", status: "active" },
  { id: "F-104", name: "Srinivas Rao", phone: "+91 93456 78901", village: "Karimnagar, Telangana", land: "3 Acres", status: "suspended" },
];

const UsersPage = () => {
  const [farmers, setFarmers] = useState(initialFarmers);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleStatus = (id: string) => {
    setFarmers(
      farmers.map((f) => {
        if (f.id === id) {
          return { ...f, status: f.status === "active" ? "suspended" : "active" };
        }
        return f;
      })
    );
  };

  const filteredFarmers = farmers.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Farmers</h1>
          <p className="text-slate-400 mt-1">Review registered farmer directory, land sizes, and ban/suspend accounts.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or district..."
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
          />
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-400 font-semibold text-sm border-b border-slate-800">
                <th className="px-6 py-4">Farmer ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Land Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredFarmers.map((f) => (
                <tr key={f.id} className="hover:bg-slate-850/30 transition">
                  <td className="px-6 py-4 font-bold text-white">{f.id}</td>
                  <td className="px-6 py-4 font-semibold text-white">{f.name}</td>
                  <td className="px-6 py-4 text-sm flex items-center gap-1.5"><Phone size={14} className="text-slate-500" /> {f.phone}</td>
                  <td className="px-6 py-4 text-sm"><span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {f.village}</span></td>
                  <td className="px-6 py-4 text-sm font-semibold">{f.land}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      f.status === "active" 
                        ? "bg-green-950/40 text-green-500 border-green-500/20" 
                        : "bg-red-950/40 text-red-500 border-red-500/20"
                    }`}>
                      <span className="capitalize">{f.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(f.id)}
                      className={`p-2 rounded-xl transition ${
                        f.status === "active"
                          ? "bg-red-950/30 hover:bg-red-950/60 text-red-500 border border-red-500/20"
                          : "bg-green-950/30 hover:bg-green-950/60 text-green-500 border border-green-500/20"
                      }`}
                    >
                      {f.status === "active" ? <UserX size={16} /> : <UserCheck size={16} />}
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

export default UsersPage;
