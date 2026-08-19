import { useState, useEffect } from "react";
import {
  Sprout, Tractor, CheckCircle2, IndianRupee, AlertCircle,
  TrendingUp, Leaf, ArrowRight, ShieldCheck, Search, ChevronRight
} from "lucide-react";
import { KSCard, KSBadge } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import API from "../../services/api";
import WeatherWidget from "../../components/dashboard/WeatherWidget";

interface Booking {
  id: number;
  service_name: string;
  provider_name: string;
  booking_date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  total_price: string;
}

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states for Quick Actions
  const [showMandiModal, setShowMandiModal] = useState(false);
  const [showCropHealthModal, setShowCropHealthModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/bookings/farmer");
        setBookings(res.data.bookings || []);
      } catch (err: any) {
        console.error("Error fetching farmer dashboard data", err);
        setError("Could not load your dashboard stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate statistics
  const activeBookingsCount = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const totalSpent = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  // Recent 5 bookings
  const recentBookings = bookings.slice(0, 5);

  // Pending alert booking
  const pendingBooking = bookings.find(b => b.status === "pending");

  const formatSQLDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] w-full max-w-full mx-auto px-0">
      {/* ── 1. STICKY WEATHER & LOCATION BANNER ── */}
      <section className="w-full max-w-full mx-auto flex justify-center">
        <WeatherWidget />
      </section>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 2. PRIMARY QUICK ACTION HUB ── */}
      <section className="space-y-2.5 max-w-full overflow-hidden">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-0.5">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">

          {/* Primary CTA Card — Book Machinery */}
          <button
            onClick={() => navigate("/farmer/book")}
            className="md:col-span-1 group relative bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between overflow-hidden text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shrink-0">
                <Tractor size={22} />
              </div>
              <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs shrink-0">
                Primary CTA
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-base sm:text-lg font-black tracking-tight leading-tight">Book Machinery & Services</h4>
              <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5 leading-relaxed line-clamp-2">
                Tractors, Harvesters, Seeders & Sprayers from local verified providers.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-bold text-emerald-200 group-hover:text-white transition">
              <span>Book Now</span>
              <ArrowRight size={13} className="ml-1 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Action 2 — Crop Health Check */}
          <button
            onClick={() => setShowCropHealthModal(true)}
            className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <Sprout size={20} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                AI Powered
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
                🌾 Crop Health Check
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                Scan pest damage, disease symptoms, or soil nutrition guidance.
              </p>
            </div>
          </button>

          {/* Action 3 — Market Rates / Mandi Prices */}
          <button
            onClick={() => setShowMandiModal(true)}
            className="group bg-white border border-slate-200 hover:border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <TrendingUp size={20} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                Live Prices
              </span>
            </div>
            <div className="mt-2.5">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-amber-600 transition">
                📊 Market Rates / Mandi
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                Check current local Mandi prices for Paddy, Wheat, Cotton & Pulses.
              </p>
            </div>
          </button>

        </div>
      </section>

      {/* ── 3. ORGANIZED DASHBOARD GRID (2x2 METRICS) ── */}
      <section className="space-y-2.5 max-w-full overflow-hidden">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-0.5">Overview Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">

          {/* Card 1: Active Bookings */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Tractor size={18} />
              </div>
              <button
                onClick={() => navigate("/farmer/bookings")}
                className="text-[10px] font-extrabold text-amber-700 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
              >
                View <ChevronRight size={11} />
              </button>
            </div>
            <div className="mt-2 min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 truncate uppercase tracking-tight">Active Bookings</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight truncate">
                {activeBookingsCount}
              </h4>
            </div>
          </div>

          {/* Card 2: Completed Services */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="mt-2 min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 truncate uppercase tracking-tight">Completed</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight truncate">
                {completedCount}
              </h4>
            </div>
          </div>

          {/* Card 3: Total Spent */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IndianRupee size={18} />
            </div>
            <div className="mt-2 min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 truncate uppercase tracking-tight">Total Spent</p>
              <h4 className="text-base sm:text-xl font-black text-slate-900 mt-0.5 tracking-tight truncate">
                ₹{totalSpent.toLocaleString("en-IN")}
              </h4>
            </div>
          </div>

          {/* Card 4: Saved Services / Care */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Leaf size={18} />
              </div>
              <button
                onClick={() => navigate("/farmer/book")}
                className="text-[10px] font-extrabold text-teal-700 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
              >
                Browse <ChevronRight size={11} />
              </button>
            </div>
            <div className="mt-2 min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 truncate uppercase tracking-tight">Saved Providers</p>
              <h4 className="text-base sm:text-xl font-black text-slate-900 mt-0.5 tracking-tight truncate">
                4 Saved
              </h4>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. BOOKING ALERTS & RECENT ACTIVITY ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Pending Booking Alert */}
        <KSCard className="flex flex-col justify-between lg:col-span-1 border-amber-200/60 bg-amber-50/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{t("bookingAlert")}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {pendingBooking ? (
                  `Booking #KS-${pendingBooking.id} (${pendingBooking.service_name}) is awaiting confirmation.`
                ) : (
                  "All your bookings are processed. No pending requests."
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/farmer/bookings")}
            className="text-xs font-extrabold text-emerald-800 hover:text-emerald-900 mt-4 text-left cursor-pointer flex items-center gap-1"
          >
            {t("checkBookingStatus")} <ChevronRight size={14} />
          </button>
        </KSCard>

        {/* Recent Bookings Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-900">{t("recentBookings")}</h3>
            <button
              onClick={() => navigate("/farmer/bookings")}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {t("viewAll")}
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent bookings found. Click <strong>Book Machinery</strong> to start!
            </div>
          ) : (
            <div>
              {/* Mobile Card View (< 640px) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <div key={b.id} className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">KS-{b.id}</span>
                      <KSBadge
                        variant={
                          b.status === "completed"
                            ? "success"
                            : b.status === "pending"
                            ? "warning"
                            : b.status === "confirmed"
                            ? "info"
                            : "danger"
                        }
                      >
                        {t(b.status)}
                      </KSBadge>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-extrabold text-slate-800 text-sm">{b.service_name}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{b.provider_name}</p>
                      </div>
                      <span className="font-black text-slate-900 text-sm">₹{parseFloat(b.total_price).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= 640px) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">Provider</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900">KS-{b.id}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">{b.service_name}</td>
                        <td className="px-5 py-3.5">{b.provider_name}</td>
                        <td className="px-5 py-3.5 text-slate-500">{formatSQLDate(b.booking_date)}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">₹{parseFloat(b.total_price).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3.5">
                          <KSBadge
                            variant={
                              b.status === "completed"
                                ? "success"
                                : b.status === "pending"
                                ? "warning"
                                : b.status === "confirmed"
                                ? "info"
                                : "danger"
                            }
                          >
                            {t(b.status)}
                          </KSBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* ── MODAL: MANDI PRICES ── */}
      {showMandiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <TrendingUp size={18} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">📊 Today's Mandi Prices</h4>
              </div>
              <button onClick={() => setShowMandiModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>
            <p className="text-xs text-slate-500">Live commodity prices per Quintal in your nearest Mandi:</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800">🌾 Paddy (Sona Masoori)</span>
                <span className="font-extrabold text-emerald-700">₹2,350 / quintal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800">🌽 Maize (Corn)</span>
                <span className="font-extrabold text-emerald-700">₹2,090 / quintal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800">⚪ Cotton (Medium Staple)</span>
                <span className="font-extrabold text-emerald-700">₹7,120 / quintal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800">🌱 Red Gram (Tur/Arhar)</span>
                <span className="font-extrabold text-emerald-700">₹7,550 / quintal</span>
              </div>
            </div>
            <button
              onClick={() => { setShowMandiModal(false); navigate("/farmer/surveys"); }}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              View Full Price Analytics & Surveys →
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: CROP HEALTH SCAN ── */}
      {showCropHealthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Sprout size={18} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">🌾 AI Crop Health Diagnosis</h4>
              </div>
              <button onClick={() => setShowCropHealthModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-slate-700 space-y-2">
              <p className="font-semibold text-emerald-950">Ask Seed AI for instant crop advisory:</p>
              <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                <li>Pesticide dosage for stem borer in paddy</li>
                <li>Best fertilizer schedule for summer cotton</li>
                <li>Yellow spot identification on crop leaves</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setShowCropHealthModal(false);
                // Dispatch event or open Chatbot
                const seedBtn = document.querySelector('button[aria-label="Open Seed AI assistant"]') as HTMLButtonElement;
                if (seedBtn) seedBtn.click();
              }}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sprout size={15} /> Ask Seed AI Assistant Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;
