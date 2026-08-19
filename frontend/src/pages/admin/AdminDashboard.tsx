import { useState, useEffect } from "react";
import {
  Users, Tractor, CalendarCheck, IndianRupee, Bell, AlertTriangle,
  ShieldCheck, BarChart3, PieChart, ArrowRight, UserCheck, ChevronRight
} from "lucide-react";
import { KSCard, KSBadge } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Stats {
  totalFarmers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
}

interface RecentBooking {
  id: number;
  farmer_name: string;
  service_name: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalFarmers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data.stats || {
          totalFarmers: 0,
          totalProviders: 0,
          totalBookings: 0,
          totalRevenue: 0,
        });
        setRecentBookings(res.data.recentBookings || []);
      } catch (err: any) {
        console.error("Error loading admin stats", err);
        setError("Failed to fetch system overview analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const statsCards = [
    { title: "Total Farmers Registered", value: stats.totalFarmers.toLocaleString("en-IN"), icon: <Users className="text-blue-400" size={24} />, bg: "bg-blue-950/40 border border-blue-500/20", path: "/admin/users" },
    { title: "Active Service Providers", value: stats.totalProviders.toLocaleString("en-IN"), icon: <Tractor className="text-amber-400" size={24} />, bg: "bg-amber-950/40 border border-amber-500/20", path: "/admin/providers" },
    { title: "Total Bookings Managed", value: stats.totalBookings.toLocaleString("en-IN"), icon: <CalendarCheck className="text-emerald-400" size={24} />, bg: "bg-emerald-950/40 border border-emerald-500/20", path: "/admin/bookings" },
    { title: "Platform Volume", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: <IndianRupee className="text-purple-400" size={24} />, bg: "bg-purple-950/40 border border-purple-500/20", path: "/admin/reports" },
  ];

  const formatTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(isoString).toLocaleDateString();
    } catch {
      return "Recent";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── 1. WELCOME & ADMIN ACTIONS BANNER ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 border border-red-900/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <ShieldCheck size={13} />
              <span>System Operations Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">KisanSeeva Admin App</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify platform registrations, oversee tractor/service bookings, publish Mandi rates & handle complaints.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/35 text-red-400 p-4 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* ── 2. ADMIN QUICK ACTION HUB ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Admin Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

          <button
            onClick={() => navigate("/admin/users")}
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 transition-all duration-250 cursor-pointer text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold">
                <UserCheck size={20} />
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-extrabold text-white">Approve Farmers</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Manage farmer registrations & status</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/providers")}
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-250 cursor-pointer text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
                <Tractor size={20} />
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-extrabold text-white">Verify Providers</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Audit machinery providers & rate cards</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/surveys")}
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 transition-all duration-250 cursor-pointer text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                <PieChart size={20} />
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-extrabold text-white">Mandi Pricing Surveys</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Publish crop survey rates & trends</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/complaints")}
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/40 rounded-2xl p-4 transition-all duration-250 cursor-pointer text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-950 text-red-400 flex items-center justify-center font-bold">
                <AlertTriangle size={20} />
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-extrabold text-white">Resolve Complaints</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Handle disputes & service issues</p>
            </div>
          </button>

        </div>
      </section>

      {/* ── 3. OVERVIEW METRICS GRID ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Platform Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {statsCards.map((stat) => (
            <div
              key={stat.title}
              onClick={() => navigate(stat.path)}
              className={`p-5 rounded-3xl ${stat.bg} flex flex-col justify-between cursor-pointer hover:scale-101 transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                  {stat.icon}
                </div>
                <ChevronRight size={14} className="text-slate-500" />
              </div>
              <div className="mt-3 min-w-0">
                <p className="text-[11px] font-bold text-slate-400 truncate uppercase">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight truncate">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. ANALYTICS CHART & LIVE LOGS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-extrabold text-white">Booking Volume (Monthly Trend)</h3>
            <button
              onClick={() => navigate("/admin/reports")}
              className="text-xs font-bold text-red-400 hover:underline cursor-pointer"
            >
              Full Reports →
            </button>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 pt-4 border-b border-l border-slate-800 px-2 sm:px-4">
            {[30, 45, 60, 40, 75, 90, 85, 95, 110, 100, 120, 135].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(h / 140) * 100}%` }}
                  className="w-full bg-red-600 rounded-t-sm hover:bg-red-500 transition-all cursor-pointer"
                />
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-md">
          <div>
            <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Bell className="text-red-500" size={18} />
              Recent Booking Logs
            </h3>
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No recent booking activity logs.
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((log) => (
                  <div key={log.id} className="flex justify-between items-start gap-3 text-xs border-b border-slate-800/80 pb-2.5 last:border-0">
                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-white">{log.farmer_name}</strong> requested <strong className="text-white">{log.service_name}</strong> (KS-{log.id})
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0">{formatTime(log.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-3.5 flex items-start gap-2.5 mt-4">
            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-red-300 leading-relaxed">
              Disputes and suspended users require swift resolution to ensure platform integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
