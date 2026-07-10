import { useState } from "react";
import { Search, Filter, Tractor, Star, CheckCircle2, XCircle, Clock } from "lucide-react";
import { KSCard, KSBadge, KSButton, KSModal } from "../../components/ui";

const allBookings = [
  { id: "KS-9082", service: "Paddy Harvesting", provider: "Balaji Agri Services", date: "July 12, 2026", price: "₹8,000", status: "pending" },
  { id: "KS-8971", service: "Tractor Tilling", provider: "Srinivas Equipment", date: "July 08, 2026", price: "₹4,500", status: "completed", rating: 5 },
  { id: "KS-8643", service: "Drone Spraying", provider: "Smart Farms", date: "June 25, 2026", price: "₹1,200", status: "completed", rating: 4 },
  { id: "KS-8531", service: "Transport Truck", provider: "Kalyan Transport", date: "June 18, 2026", price: "₹3,000", status: "cancelled" },
];

const MyBookings = () => {
  const [filter, setFilter] = useState("all");
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  const filteredBookings = allBookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="text-green-700" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-700" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const openRatingModal = (id: string) => {
    setSelectedBooking(id);
    setIsRateOpen(true);
  };

  const submitRating = () => {
    alert(`Thank you for rating ${selectedBooking} with ${rating} stars!`);
    setIsRateOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 mt-1">View history, status, and track your agricultural bookings.</p>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2 bg-white p-1.5 border border-slate-100 rounded-2xl shadow-sm">
          {["all", "pending", "completed", "cancelled"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                filter === item ? "bg-green-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6">
        {filteredBookings.map((b) => (
          <KSCard key={b.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-700 rounded-2xl">
                <Tractor size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-800 text-lg">{b.service}</h3>
                  <span className="text-sm font-semibold text-slate-400">({b.id})</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Provider: <span className="font-semibold text-slate-700">{b.provider}</span></p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>Scheduled: {b.date}</span>
                  <span>Price: {b.price}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
              <KSBadge variant={b.status === "completed" ? "success" : b.status === "cancelled" ? "danger" : "warning"}>
                {getStatusIcon(b.status)}
                <span className="capitalize">{b.status}</span>
              </KSBadge>

              {b.status === "completed" && !b.rating && (
                <KSButton variant="outline" className="px-4 py-2 text-xs" onClick={() => openRatingModal(b.id)}>
                  Rate Provider
                </KSButton>
              )}

              {b.status === "completed" && b.rating && (
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(b.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              )}
            </div>
          </KSCard>
        ))}
      </div>

      {/* Rating Modal */}
      <KSModal isOpen={isRateOpen} onClose={() => setIsRateOpen(false)} title="Rate Service Provider">
        <div className="space-y-6 text-center">
          <p className="text-slate-600">How was your experience with the booking?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 transition-transform active:scale-95 ${
                  rating >= star ? "text-yellow-500" : "text-slate-300"
                }`}
              >
                <Star size={36} fill={rating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <KSButton variant="outline" className="w-1/2 justify-center" onClick={() => setIsRateOpen(false)}>
              Cancel
            </KSButton>
            <KSButton className="w-1/2 justify-center" onClick={submitRating}>
              Submit Review
            </KSButton>
          </div>
        </div>
      </KSModal>
    </div>
  );
};

export default MyBookings;
