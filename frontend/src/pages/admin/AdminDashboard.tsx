import { Users, Tractor, CalendarCheck, IndianRupee, Bell, AlertTriangle } from "lucide-react";
import { KSCard, KSBadge } from "../../components/ui";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Farmers Registered", value: "2,548", icon: <Users className="text-blue-500" size={24} />, bg: "bg-blue-950/40 border border-blue-500/20" },
    { title: "Active Service Providers", value: "512", icon: <Tractor className="text-yellow-500" size={24} />, bg: "bg-yellow-950/40 border border-yellow-500/20" },
    { title: "Total Bookings Managed", value: "15,842", icon: <CalendarCheck className="text-green-500" size={24} />, bg: "bg-green-950/40 border border-green-500/20" },
    { title: "Platform Commission Revenue", value: "₹2,48,500", icon: <IndianRupee className="text-purple-500" size={24} />, bg: "bg-purple-950/40 border border-purple-500/20" },
  ];

  const recentLogs = [
    { type: "user_reg", text: "New farmer 'Srinivas Rao' registered from Karimnagar", time: "5 mins ago" },
    { type: "booking", text: "Booking KS-9082 accepted by Balaji Agri Services", time: "12 mins ago" },
    { type: "provider_verify", text: "Provider 'Jai Kissan Services' submitted document proof", time: "45 mins ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform analytics, registration flows and critical queues.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`p-6 rounded-3xl ${stat.bg} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">{stat.value}</h3>
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics chart and logs */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Simple Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Booking Volume (Monthly Trend)</h3>
          <div className="h-56 flex items-end justify-between gap-3 pt-4 border-b border-l border-slate-800 px-4">
            {[30, 45, 60, 40, 75, 90, 85, 95, 110, 100, 120, 135].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(h / 140) * 100}%` }}
                  className="w-full bg-red-600 rounded-t-sm hover:bg-red-500 transition-all"
                />
                <span className="text-[10px] font-semibold text-slate-500">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="text-red-500" size={20} />
              System Alerts & Activity
            </h3>
            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex justify-between items-start gap-4 text-sm border-b border-slate-850 pb-3 last:border-0">
                  <p className="text-slate-350">{log.text}</p>
                  <span className="text-xs font-medium text-slate-500 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-950/20 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3 mt-4">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-yellow-500/80 leading-relaxed">
              3 new provider registration applications require business license verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
