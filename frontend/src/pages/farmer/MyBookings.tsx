import { useState, useEffect } from "react";
import { Tractor, Star, CheckCircle2, XCircle, Clock, MessageSquare, CreditCard, Timer, Play, Square } from "lucide-react";
import { KSCard, KSBadge, KSButton, KSModal } from "../../components/ui";
import LiveTrackingModal from "../../components/dashboard/LiveTrackingModal";
import PaymentModal from "../../components/dashboard/PaymentModal";
import PublicProfileModal from "../../components/dashboard/PublicProfileModal";
import { useLanguage } from "../../context/LanguageContext";
import API from "../../services/api";

interface Booking {
  id: number;
  farmer_id: number;
  service_id: number;
  booking_date: string;
  hours_required: string;
  total_price: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  location: string;
  rating: number | null;
  feedback: string | null;
  service_name: string;
  service_type: string;
  price_per_hour: string;
  pricing_model?: "hourly" | "fixed";
  provider_name: string;
  provider_phone: string;
  provider_user_id: number;
  payment_status?: string;
  payment_method?: string;
  payment_transaction_id?: string;
  timer_status?: "idle" | "running" | "stopped";
  start_time?: string;
  stop_time?: string;
  actual_hours?: string;
}

const MyBookings = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [viewProfileId, setViewProfileId] = useState<number | null>(null);
  
  // Payment states
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payBookingId, setPayBookingId] = useState<number | null>(null);
  const [payBookingPrice, setPayBookingPrice] = useState(0);

  // Timer action loading (kept for type safety but not used for farmer controls)
  const [_timerActionLoading, _setTimerActionLoading] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/farmer");
      setBookings(res.data.bookings);
    } catch (err: any) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    
    setActionLoading(bookingId);
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: "cancelled" });
      // Update state local
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err: any) {
      console.error("Cancel booking error", err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionLoading(null);
    }
  };



  const openRatingModal = (id: number) => {
    setSelectedBookingId(id);
    setRating(5);
    setFeedback("");
    setIsRateOpen(true);
  };

  const submitRating = async () => {
    if (!selectedBookingId) return;
    setRatingSubmitting(true);
    try {
      await API.put(`/bookings/${selectedBookingId}/rate`, {
        rating,
        feedback,
      });
      setIsRateOpen(false);
      // Refresh list
      fetchBookings();
    } catch (err: any) {
      console.error("Submit rating error", err);
      alert(err.response?.data?.message || "Failed to submit rating.");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="text-green-700" />;
      case "cancelled":
      case "rejected":
        return <XCircle size={16} className="text-red-700" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

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

        {/* Filter Badges */}
        <div className="flex gap-2 bg-white p-1.5 border border-slate-100 rounded-2xl shadow-sm overflow-x-auto max-w-full">
          {["all", "pending", "confirmed", "completed", "cancelled", "rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition whitespace-nowrap ${
                filter === item ? "bg-green-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t(item)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 sm:p-12 text-center text-slate-400">
          {t("noBookingsFound")}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredBookings.map((b) => (
            <KSCard key={b.id} className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 max-w-full overflow-hidden">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                <div className="p-2.5 sm:p-3 bg-green-50 text-green-700 rounded-2xl shrink-0">
                  <Tractor size={24} className="sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg truncate max-w-[200px] sm:max-w-xs">{b.service_name}</h3>
                    <span className="text-xs font-bold text-slate-400">#KS-{b.id}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">
                    {t("provider")}: <span className="font-bold text-slate-800">{b.provider_name}</span> ({b.provider_phone})
                  </p>
                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <button
                      onClick={() => setViewProfileId(b.provider_user_id)}
                      className="text-xs text-blue-600 underline hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {t("viewProfile")} →
                    </button>
                  )}
                  <p className="text-xs text-slate-400 truncate">
                    📍 Location: <span className="text-slate-600">{b.location}</span>
                  </p>
                  
                  {/* Detail pills wrap cleanly on mobile */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-medium">📅 {formatSQLDate(b.booking_date)}</span>
                    <span className={`px-2.5 py-1 rounded-lg font-bold ${b.pricing_model === "fixed" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                      {b.pricing_model === "fixed" ? "🔧 Fixed Rate" : "⏱️ Hourly Timer"}
                    </span>
                    {b.actual_hours ? (
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">Actual: {b.actual_hours} hrs</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">Est: {b.hours_required} hrs</span>
                    )}
                    <span className="bg-emerald-100/80 text-emerald-900 font-black px-2.5 py-1 rounded-lg text-xs">
                      Total: ₹{parseFloat(b.total_price).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <div className="flex items-center gap-2 justify-between sm:justify-start">
                  <KSBadge
                    variant={
                      b.status === "completed"
                        ? "success"
                        : b.status === "cancelled" || b.status === "rejected"
                        ? "danger"
                        : b.status === "confirmed"
                        ? "info"
                        : "warning"
                    }
                  >
                    {getStatusIcon(b.status)}
                    <span className="ml-1">{t(b.status)}</span>
                  </KSBadge>

                  {/* Payment Badge */}
                  {(b.status === "completed" || b.status === "confirmed") && (
                    <KSBadge variant={b.payment_status === "paid" ? "success" : "danger"}>
                      <CreditCard size={12} className="mr-1" />
                      <span>{b.payment_status === "paid" ? "Paid" : "Unpaid"}</span>
                    </KSBadge>
                  )}
                </div>

                {/* Mobile Button Row / Stack */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {/* Cancel Action */}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <KSButton
                      variant="outline"
                      className="flex-1 sm:flex-none px-3 py-2 text-xs text-red-600 border-red-200 hover:bg-red-50 justify-center"
                      disabled={actionLoading === b.id}
                      onClick={() => handleCancel(b.id)}
                    >
                      {actionLoading === b.id ? "Cancelling..." : t("cancelled") + " ✕"}
                    </KSButton>
                  )}

                  {/* Track Action */}
                  {b.status === "confirmed" && (
                    <KSButton
                      className="flex-1 sm:flex-none px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 border-none font-bold justify-center cursor-pointer"
                      onClick={() => setTrackingId(b.id)}
                    >
                      📍 Track Driver / GPS
                    </KSButton>
                  )}

                  {/* READ-ONLY Timer Status (farmers cannot control the timer — provider does) */}
                  {b.status === "confirmed" && b.pricing_model !== "fixed" && (
                    <div className="flex-1 sm:flex-none">
                      {b.timer_status === "running" ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 px-3 py-2 rounded-xl">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <Timer size={12} className="text-emerald-600 shrink-0" />
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Provider is working...</span>
                        </div>
                      ) : b.timer_status === "stopped" ? (
                        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700 px-3 py-2 rounded-xl">
                          <Square size={12} className="text-blue-600 fill-blue-600 shrink-0" />
                          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">Work finished by provider</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-xl">
                          <Play size={12} className="text-slate-400 shrink-0" />
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Awaiting provider to start work</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rate Action */}
                  {b.status === "completed" && b.rating === null && (
                    <KSButton variant="outline" className="flex-1 sm:flex-none px-3 py-2 text-xs justify-center" onClick={() => openRatingModal(b.id)}>
                      ⭐ Rate Provider
                    </KSButton>
                  )}

                  {/* Pay Action */}
                  {(b.status === "completed" || b.status === "confirmed") && b.payment_status !== "paid" && (
                    <KSButton 
                      className="flex-1 sm:flex-none px-4 py-2 text-xs bg-green-600 hover:bg-green-700 border-none flex items-center justify-center gap-1 font-bold" 
                      onClick={() => {
                        setPayBookingId(b.id);
                        setPayBookingPrice(parseFloat(b.total_price));
                        setIsPayOpen(true);
                      }}
                    >
                      <CreditCard size={12} />
                      Pay Now
                    </KSButton>
                  )}
                </div>

                {/* Rating View */}
                {b.status === "completed" && b.rating !== null && (
                  <div className="flex flex-col items-start sm:items-end gap-1 mt-1 sm:mt-0">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {[...Array(b.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                      {[...Array(5 - (b.rating || 0))].map((_, i) => (
                        <Star key={i} size={14} className="text-slate-200" />
                      ))}
                    </div>
                    {b.feedback && (
                      <span className="text-xs text-slate-400 italic flex items-center gap-1">
                        <MessageSquare size={12} /> "{b.feedback}"
                      </span>
                    )}
                  </div>
                )}
              </div>
            </KSCard>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <KSModal isOpen={isRateOpen} onClose={() => setIsRateOpen(false)} title="Rate Service Provider">
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-slate-600">How was your experience with the booking?</p>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  type="button"
                  className={`p-1 transition-transform active:scale-95 ${
                    rating >= star ? "text-yellow-500" : "text-slate-300"
                  }`}
                >
                  <Star size={36} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Feedback / Comments (Optional)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about the quality of service, punctuality, and equipment behavior..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition text-sm"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <KSButton variant="outline" className="w-1/2 justify-center" disabled={ratingSubmitting} onClick={() => setIsRateOpen(false)}>
              {t("cancel")}
            </KSButton>
            <KSButton className="w-1/2 justify-center" disabled={ratingSubmitting} onClick={submitRating}>
              {ratingSubmitting ? "Submitting..." : t("save")}
            </KSButton>
          </div>
        </div>
      </KSModal>

      {/* Payment Modal */}
      {payBookingId !== null && (
        <PaymentModal
          isOpen={isPayOpen}
          onClose={() => {
            setIsPayOpen(false);
            setPayBookingId(null);
          }}
          bookingId={payBookingId}
          totalPrice={payBookingPrice}
          onSuccess={fetchBookings}
        />
      )}

      {/* Live Tracking Modal */}
      {trackingId && (
        <LiveTrackingModal
          isOpen={!!trackingId}
          onClose={() => setTrackingId(null)}
          bookingId={trackingId}
          role="farmer"
        />
      )}

      {/* Public Profile Modal */}
      {viewProfileId && (
        <PublicProfileModal userId={viewProfileId} onClose={() => setViewProfileId(null)} />
      )}
    </div>
  );
};

export default MyBookings;
