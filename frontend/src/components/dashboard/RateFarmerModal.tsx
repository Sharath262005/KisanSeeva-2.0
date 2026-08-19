import React, { useState } from "react";
import { Star, X, Send, Loader2 } from "lucide-react";
import { KSButton } from "../ui";
import API from "../../services/api";

interface RateFarmerModalProps {
  bookingId: number;
  farmerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RateFarmerModal: React.FC<RateFarmerModalProps> = ({
  bookingId,
  farmerName,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await API.put(`/bookings/${bookingId}/rate-farmer`, { rating, feedback });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hovered || rating;

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Below Average",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800">Rate this Farmer</h3>
            <p className="text-sm text-slate-500 mt-0.5">{farmerName} · Booking KS-{bookingId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition active:scale-90 cursor-pointer"
              >
                <Star
                  size={36}
                  className={`transition-colors duration-150 ${
                    star <= displayRating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <span className="text-sm font-bold text-amber-600">{ratingLabels[displayRating]}</span>
          )}
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Feedback <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="How was your experience working with this farmer?"
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer text-sm"
          >
            Cancel
          </button>
          <KSButton
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white border-0 py-3 text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            ) : (
              <><Send size={16} /> Submit Rating</>
            )}
          </KSButton>
        </div>
      </div>
    </div>
  );
};

export default RateFarmerModal;
