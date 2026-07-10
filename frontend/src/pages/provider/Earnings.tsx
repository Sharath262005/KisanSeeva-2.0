import { IndianRupee, ArrowUpRight, TrendingUp, Calendar, CreditCard } from "lucide-react";
import { KSCard, KSBadge } from "../../components/ui";

const earningsHistory = [
  { id: "TXN-8271", date: "July 08, 2026", job: "Tractor Tilling", customer: "Suresh Reddy", amount: "₹4,500", status: "paid" },
  { id: "TXN-7982", date: "July 02, 2026", job: "Paddy Harvesting", customer: "Lakshmi Devi", amount: "₹12,000", status: "paid" },
  { id: "TXN-7654", date: "June 25, 2026", job: "Drone Spraying", customer: "Ramesh Kumar", amount: "₹1,200", status: "paid" },
  { id: "TXN-7123", date: "June 18, 2026", job: "Transport Truck", customer: "Venkat Rao", amount: "₹3,000", status: "processing" },
];

const Earnings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Earnings & Payouts</h1>
        <p className="text-slate-500 mt-1">Track your completed jobs, payout statuses, and financial analytics.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KSCard className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Earnings</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">₹92,400</h3>
            <span className="text-xs font-semibold text-green-700 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12.4% from last month
            </span>
          </div>
          <div className="p-4 bg-green-50 text-green-700 rounded-2xl">
            <IndianRupee size={28} />
          </div>
        </KSCard>

        <KSCard className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Paid to Account</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">₹89,400</h3>
            <span className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
              <Calendar size={14} /> Last payout: July 08
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <ArrowUpRight size={28} />
          </div>
        </KSCard>

        <KSCard className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400">Processing / Pending</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">₹3,000</h3>
            <span className="text-xs font-semibold text-yellow-600 mt-2 flex items-center gap-1">
              <CreditCard size={14} /> Depositing soon
            </span>
          </div>
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-2xl">
            <IndianRupee size={28} />
          </div>
        </KSCard>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-semibold text-sm">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Job Type</th>
                <th className="px-6 py-4">Farmer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {earningsHistory.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{t.id}</td>
                  <td className="px-6 py-4 text-sm">{t.date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{t.job}</td>
                  <td className="px-6 py-4">{t.customer}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t.amount}</td>
                  <td className="px-6 py-4">
                    <KSBadge variant={t.status === "paid" ? "success" : "warning"}>
                      <span className="capitalize">{t.status}</span>
                    </KSBadge>
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

export default Earnings;
