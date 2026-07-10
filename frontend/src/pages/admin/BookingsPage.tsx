import { useState } from "react";
import { Search, Calendar, Tractor, User, MapPin } from "lucide-react";

const allSystemBookings = [
  { id: "KS-9082", service: "Paddy Harvesting", farmer: "Ramesh Kumar", provider: "Balaji Agri Services", date: "July 12, 2026", price: "₹8,000", status: "pending", location: "Warangal" },
  { id: "KS-8971", service: "Tractor Tilling", farmer: "Rajesh Patil", provider: "Srinivas Equipment", date: "July 08, 2026", price: "₹4,500", status: "completed", location: "Nizamabad" },
  { id: "KS-8643", service: "Drone Spraying", farmer: "Venkat Reddy", provider: "Smart Farms", date: "June 25, 2026", price: "₹1,200", status: "completed", location: "Karimnagar" },
  { id: "KS-8531", service: "Transport Truck", farmer: "Ram Lal", provider: "Kalyan Transport", date: "June 18, 2026", price: "₹3,000", status: "cancelled", location: "Medak" },
];

const BookingsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = allSystemBookings.filter((b) => {
    const matchesFilter = filter === "all" ? true : b.status === filter;
    const matchesSearch = b.id.toLowerCase().includes(search.toLowerCase()) ||
                          b.farmer.toLowerCase().includes(search.toLowerCase()) ||
                          b.provider.toLowerCase().includes(search.toLowerCase()) ||
                          b.service.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Bookings</h1>
          <p className="text-slate-400 mt-1">Global log of all scheduling, transactions, and status states on KisanSeeva.</p>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2 bg-slate-900 p-1 border border-slate-800 rounded-2xl">
          {["all", "pending", "completed", "cancelled"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                filter === item ? "bg-red-650 text-white shadow-md" : "text-slate-450 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, Farmer, Provider or Service..."
          className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
        />
      </div>

      {/* Bookings List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-850 text-slate-400 font-semibold text-sm border-b border-slate-800">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Farmer</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-850/30 transition">
                  <td className="px-6 py-4 font-bold text-white">{b.id}</td>
                  <td className="px-6 py-4 font-semibold text-white flex items-center gap-1.5"><Tractor size={14} className="text-slate-500" /> {b.service}</td>
                  <td className="px-6 py-4"><span className="flex items-center gap-1.5"><User size={14} className="text-slate-500" /> {b.farmer}</span></td>
                  <td className="px-6 py-4 font-semibold">{b.provider}</td>
                  <td className="px-6 py-4 text-sm"><span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-500" /> {b.date}</span></td>
                  <td className="px-6 py-4 text-sm"><span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {b.location}</span></td>
                  <td className="px-6 py-4 font-bold text-white">{b.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      b.status === "completed" 
                        ? "bg-green-950/40 text-green-500 border-green-500/20" 
                        : b.status === "cancelled"
                        ? "bg-red-950/40 text-red-500 border-red-500/20"
                        : "bg-yellow-950/40 text-yellow-500 border-yellow-500/20"
                    }`}>
                      <span className="capitalize">{b.status}</span>
                    </span>
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

export default BookingsPage;
