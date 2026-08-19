import React, { useState, useEffect, useCallback } from "react";
import { Check, X, Calendar, MapPin, Tractor, Clock, Navigation, Star, Timer, PlayCircle, StopCircle, AlertCircle } from "lucide-react";
import { KSCard, KSBadge, KSButton } from "../../components/ui";
import LiveTrackingModal from "../../components/dashboard/LiveTrackingModal";
import PublicProfileModal from "../../components/dashboard/PublicProfileModal";
import RateFarmerModal from "../../components/dashboard/RateFarmerModal";
import { useLanguage } from "../../context/LanguageContext";
import API from "../../services/api";

interface Booking {
  id: number;
  service_name: string;
  service_type: string;
  pricing_model?: "hourly" | "fixed";
  farmer_id: number;
  farmer_name: string;
  farmer_phone: string;
  booking_date: string;
  hours_required: string;
  total_price: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  location: string;
  timer_status?: "idle" | "running" | "stopped";
  start_time?: string;
  actual_hours?: string;
  rating: number | null;
  feedback: string | null;
  provider_rating?: number | null;
  provider_feedback?: string | null;
}

const ProviderBookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [viewProfileId, setViewProfileId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const [timerActionLoading, setTimerActionLoading] = useState<number | null>(null);
  const [rateBookingId, setRateBookingId] = useState<{ id: number; farmerName: string } | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/provider");
      setBookings(res.data.bookings);
    } catch (err: any) {
      console.error("Error loading provider bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimer = async (bookingId: number) => {
    setTimerActionLoading(bookingId);
    try {
      await API.put(`/bookings/${bookingId}/start-timer`);
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to start timer.");
    } finally {
      setTimerActionLoading(null);
    }
  };

  const handleStopTimer = async (bookingId: number) => {
    if (!window.confirm("Are you sure the work is completed? This will stop the timer and calculate the final bill.")) return;
    setTimerActionLoading(bookingId);
    try {
      const res = await API.put(`/bookings/${bookingId}/stop-timer`);
      alert(`Work completed! Final bill: ₹${parseFloat(res.data.finalPrice).toLocaleString("en-IN")} (${res.data.actualHours} hrs actual time).`);
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to stop timer.");
    } finally {
      setTimerActionLoading(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: number, newStatus: "confirmed" | "rejected" | "completed") => {
    setActionLoading(bookingId);
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      console.error("Status update error", err);
      alert(err.response?.data?.message || "Failed to update booking status.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t("myBookings")}</h1>
          <p className="text-slate-500 mt-1">{t("hereIsOverview")}</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white p-1.5 border border-slate-100 rounded-2xl shadow-sm overflow-x-auto max-w-full">
          {["all", "pending", "confirmed", "completed", "cancelled", "rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition whitespace-nowrap ${
                filter === item ? "bg-yellow-500 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t(item)}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 sm:p-12 text-center text-slate-400">
          {t("noRequestsFound")}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredBookings.map((b) => (
            <KSCard key={b.id} className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-700 rounded-2xl shrink-0">
                  <Tractor size={24} className="sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate max-w-[200px] sm:max-w-xs">{b.service_name}</h3>
                    <span className="text-xs font-bold text-slate-400">#KS-{b.id}</span>
                    <KSBadge
                      variant={
                        b.status === "completed" || b.status === "confirmed"
                          ? "success"
                          : b.status === "cancelled" || b.status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                    >
                      <span>{t(b.status)}</span>
                    </KSBadge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">
                    {t("farmer")}: <span className="font-bold text-slate-800">{b.farmer_name}</span> ({b.farmer_phone})
                    {(b.status === 'confirmed' || b.status === 'completed') && (
                      <button
                        onClick={() => setViewProfileId(b.farmer_id)}
                        className="text-xs text-blue-600 underline hover:text-blue-800 font-semibold ml-2 cursor-pointer"
                      >
                        {t("viewProfile")} →
                      </button>
                    )}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium">📅 {formatSQLDate(b.booking_date)}</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium">📍 {b.location}</span>
                    <span className={`px-2.5 py-1 rounded-lg font-bold ${b.pricing_model === "fixed" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                      {b.pricing_model === "fixed" ? "🔧 Fixed Rate" : "⏱️ Hourly Timer"}
                    </span>
                    {b.actual_hours ? (
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">Actual: {b.actual_hours} hrs</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">Est: {b.hours_required} hrs</span>
                    )}
                    <span className="bg-amber-100/80 text-amber-900 font-black px-2.5 py-1 rounded-lg text-xs">
                      Payout: ₹{parseFloat(b.total_price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Provider Live Timer Controls — clear messaging about who does what */}
                  {b.status === "confirmed" && (
                    <div className="mt-2.5 space-y-2">
                      {b.timer_status === "running" ? (
                        <div className="space-y-2">
                          {/* Running indicator with elapsed time */}
                          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 px-3 py-2 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <Timer size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Work timer is running</span>
                              {b.start_time && (
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
                                  Started: {new Date(b.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Stop button */}
                          <button
                            onClick={() => handleStopTimer(b.id)}
                            disabled={timerActionLoading === b.id}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-60"
                          >
                            <StopCircle size={14} />
                            <span>Mark Work Done (Leave Farm)</span>
                          </button>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                            Tap when you leave the farm. This calculates the final bill.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <button
                            onClick={() => handleStartTimer(b.id)}
                            disabled={timerActionLoading === b.id}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-60"
                          >
                            <PlayCircle size={14} />
                            <span>Start Work (Arrive at Farm)</span>
                          </button>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                            Tap when you reach the farmer's field.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                {b.status === "pending" && (
                  <>
                    <KSButton
                      onClick={() => handleStatusChange(b.id, "rejected")}
                      variant="outline"
                      disabled={actionLoading === b.id}
                      className="flex-1 lg:flex-none border-red-600 text-red-600 hover:bg-red-50 flex items-center justify-center gap-1 px-3.5 py-2 text-xs cursor-pointer"
                    >
                      <X size={14} /> Reject
                    </KSButton>
                    <KSButton
                      onClick={() => handleStatusChange(b.id, "confirmed")}
                      disabled={actionLoading === b.id}
                      className="flex-1 lg:flex-none bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-1 px-3.5 py-2 text-xs border-0 cursor-pointer font-bold"
                    >
                      <Check size={14} /> Accept Job
                    </KSButton>
                  </>
                )}

                {b.status === "confirmed" && (
                  <>
                    <KSButton
                      onClick={() => setTrackingId(b.id)}
                      className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 px-4 py-2 text-xs border-0 font-bold cursor-pointer"
                    >
                      <Navigation size={14} /> Share Live GPS
                    </KSButton>
                    <KSButton
                      onClick={() => handleStatusChange(b.id, "completed")}
                      disabled={actionLoading === b.id}
                      className="flex-1 lg:flex-none bg-yellow-500 hover:bg-yellow-600 text-slate-900 flex items-center justify-center gap-1.5 px-4 py-2 text-xs border-0 font-bold cursor-pointer"
                    >
                      <Check size={14} /> Complete Job
                    </KSButton>
                  </>
                )}

                {/* Rate Farmer button for completed unrated bookings */}
                {b.status === "completed" && !b.provider_rating && (
                  <KSButton
                    onClick={() => setRateBookingId({ id: b.id, farmerName: b.farmer_name })}
                    className="flex-1 lg:flex-none bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-1.5 px-4 py-2 text-xs border-0 font-bold cursor-pointer"
                  >
                    <Star size={14} /> Rate Farmer
                  </KSButton>
                )}
                {b.status === "completed" && Boolean(b.provider_rating) && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} className={s <= (b.provider_rating || 0) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                    ))}
                    <span>Rated</span>
                  </div>
                )}
              </div>
            </KSCard>
          ))}
        </div>
      )}

      {/* Live Tracking Modal */}
      {trackingId && (
        <LiveTrackingModal
          isOpen={!!trackingId}
          onClose={() => setTrackingId(null)}
          bookingId={trackingId}
          role="provider"
        />
      )}

      {/* Public Profile Modal */}
      {viewProfileId && (
        <PublicProfileModal userId={viewProfileId} onClose={() => setViewProfileId(null)} />
      )}

      {/* Rate Farmer Modal */}
      {rateBookingId && (
        <RateFarmerModal
          bookingId={rateBookingId.id}
          farmerName={rateBookingId.farmerName}
          onClose={() => setRateBookingId(null)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
};

export default ProviderBookings;
