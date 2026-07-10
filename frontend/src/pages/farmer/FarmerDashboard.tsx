import { Sprout, Tractor, CloudSun, CheckCircle2, IndianRupee, AlertCircle } from "lucide-react";
import { KSCard, KSBadge } from "../../components/ui";
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
  const navigate = useNavigate();

  // Mock weather recommendation
  const weather = {
    temp: "32°C",
    condition: "Sunny / Clear",
    recommendation: "Perfect conditions for land preparation and sowing.",
  };

  const stats = [
    { title: "Active Bookings", value: "2", icon: <Tractor className="text-yellow-600" size={24} />, bg: "bg-yellow-50" },
    { title: "Completed Services", value: "12", icon: <CheckCircle2 className="text-green-700" size={24} />, bg: "bg-green-50" },
    { title: "Total Spent", value: "₹18,500", icon: <IndianRupee className="text-blue-600" size={24} />, bg: "bg-blue-50" },
  ];

  const recentBookings = [
    {
      id: "KS-9082",
      service: "Paddy Harvesting",
      provider: "Balaji Agri Services",
      date: "July 12, 2026",
      status: "pending",
      price: "₹8,000",
    },
    {
      id: "KS-8971",
      service: "Tractor Tilling",
      provider: "Srinivas Equipment",
      date: "July 08, 2026",
      status: "completed",
      price: "₹4,500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Namaste Ramesh ji!</h1>
          <p className="text-slate-500 mt-1">Here is an overview of your farm services and suggestions.</p>
        </div>
        <button
          onClick={() => navigate("/farmer/book")}
          className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition"
        >
          🚜 Book New Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <KSCard key={stat.title} className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-semibold text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </KSCard>
        ))}
      </div>

      {/* Weather & Recommendations Widget */}
      <div className="grid lg:grid-cols-3 gap-6">
        <KSCard className="lg:col-span-2 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-green-500 to-emerald-700 text-white border-0">
          <div className="flex items-center gap-4 shrink-0">
            <CloudSun size={60} className="text-yellow-300" />
            <div>
              <h4 className="text-4xl font-extrabold">{weather.temp}</h4>
              <p className="text-green-100 font-semibold">{weather.condition}</p>
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6">
            <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase mb-2 inline-block">
              Farming Advisory
            </span>
            <p className="text-lg leading-relaxed font-medium">{weather.recommendation}</p>
          </div>
        </KSCard>

        <KSCard className="flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="font-bold text-slate-800">Booking Alert</h4>
              <p className="text-sm text-slate-500 mt-1">
                Your booking request KS-9082 is pending approval from the provider.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/farmer/bookings")}
            className="text-sm font-bold text-green-700 hover:text-green-800 mt-4 text-left"
          >
            Check booking status →
          </button>
        </KSCard>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Bookings</h3>
          <button
            onClick={() => navigate("/farmer/bookings")}
            className="text-sm font-bold text-green-700 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-semibold text-sm">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{b.id}</td>
                  <td className="px-6 py-4 font-semibold">{b.service}</td>
                  <td className="px-6 py-4">{b.provider}</td>
                  <td className="px-6 py-4 text-sm">{b.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{b.price}</td>
                  <td className="px-6 py-4">
                    <KSBadge variant={b.status === "completed" ? "success" : "warning"}>
                      {b.status}
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

export default FarmerDashboard;
