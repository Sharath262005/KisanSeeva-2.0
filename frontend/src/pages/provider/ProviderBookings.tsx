import { useState } from "react";
import { Check, X, Calendar, MapPin, Tractor } from "lucide-react";
import { KSCard, KSBadge, KSButton } from "../../components/ui";

const initialRequests = [
  { id: "KS-9082", farmer: "Ramesh Kumar", phone: "+91 98765 43210", service: "Paddy Harvesting", acres: "3 Acres", date: "July 12, 2026", price: "₹8,000", status: "pending", location: "Maddur Village, Warangal" },
  { id: "KS-8971", farmer: "Rajesh Patil", phone: "+91 91234 56789", service: "Tractor Tilling", acres: "2 Acres", date: "July 10, 2026", price: "₹3,500", status: "accepted", location: "Gopalpur Road, Warangal" },
];

const ProviderBookings = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleStatusChange = (id: string, newStatus: "accepted" | "rejected" | "completed") => {
    setRequests(
      requests.map((r) => {
        if (r.id === id) {
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Bookings</h1>
        <p className="text-slate-500 mt-1">Accept incoming booking requests, manage active jobs, and complete them.</p>
      </div>

      <div className="grid gap-6">
        {requests.map((r) => (
          <KSCard key={r.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl shrink-0">
                <Tractor size={32} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-bold text-slate-800 text-lg leading-none">{r.service}</h3>
                  <span className="text-sm font-semibold text-slate-400">({r.id})</span>
                  <KSBadge variant={r.status === "accepted" || r.status === "completed" ? "success" : r.status === "rejected" ? "danger" : "warning"}>
                    <span className="capitalize">{r.status}</span>
                  </KSBadge>
                </div>
                <p className="text-sm text-slate-600">Farmer: <span className="font-bold text-slate-800">{r.farmer}</span> ({r.phone})</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {r.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {r.location}</span>
                  <span>Area: {r.acres}</span>
                  <span>Estimated Payout: <span className="font-bold text-slate-700">{r.price}</span></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
              {r.status === "pending" && (
                <>
                  <KSButton
                    onClick={() => handleStatusChange(r.id, "rejected")}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-1.5 px-4 py-2 text-sm"
                  >
                    <X size={16} /> Reject
                  </KSButton>
                  <KSButton
                    onClick={() => handleStatusChange(r.id, "accepted")}
                    className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-1.5 px-4 py-2 text-sm border-0"
                  >
                    <Check size={16} /> Accept Job
                  </KSButton>
                </>
              )}

              {r.status === "accepted" && (
                <KSButton
                  onClick={() => handleStatusChange(r.id, "completed")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 flex items-center gap-1.5 px-5 py-2 text-sm border-0 font-bold"
                >
                  <Check size={16} /> Mark Completed
                </KSButton>
              )}
            </div>
          </KSCard>
        ))}
      </div>
    </div>
  );
};

export default ProviderBookings;
