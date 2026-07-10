import { BarChart3, TrendingUp, IndianRupee, Download, Calendar } from "lucide-react";
import { KSCard } from "../../components/ui";

const ReportsPage = () => {
  const reports = [
    { title: "Monthly Platform Revenue", desc: "Total commission processed from services.", value: "₹2,48,500" },
    { title: "Active Farm Jobs", desc: "Ploughing, sowing and drone spraying completed.", value: "1,248 Jobs" },
    { title: "Average Booking Rating", desc: "Farmer feedback rating scores overall.", value: "4.8 / 5.0" },
  ];

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-400 mt-1">Review KisanSeeva platform revenue logs and operation metrics.</p>
        </div>

        <button
          onClick={() => alert("Downloading PDF summary report...")}
          className="bg-red-650 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition shadow-lg shadow-red-650/15"
        >
          <Download size={18} /> Export PDF Report
        </button>
      </div>

      {/* Report Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {reports.map((r, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between h-48">
            <div>
              <h3 className="font-bold text-white text-lg">{r.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{r.desc}</p>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-extrabold text-white">{r.value}</span>
              <span className="text-xs font-semibold text-green-500 bg-green-950/30 border border-green-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp size={12} /> +8%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <KSCard className="bg-slate-900 border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-6">Service Category Revenue Share</h3>
        <div className="space-y-4">
          {[
            { category: "Tractor Service", percentage: 55, amount: "₹1,36,675" },
            { category: "Harvesting", percentage: 25, amount: "₹62,125" },
            { category: "Drone Spraying", percentage: 12, amount: "₹29,820" },
            { category: "Transport & Others", percentage: 8, amount: "₹19,880" },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-300">{item.category}</span>
                <span className="font-bold text-white">{item.amount} ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className="bg-red-650 h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </KSCard>
    </div>
  );
};

export default ReportsPage;
