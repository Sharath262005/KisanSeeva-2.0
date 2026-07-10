import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tractor, Droplets, Combine, Sprout, Truck, Sparkles, MapPin, Calendar, CreditCard } from "lucide-react";
import { KSCard, KSButton, KSModal } from "../../components/ui";

const serviceTypes = [
  { id: "tractor", name: "Tractor Service", desc: "Tilling, ploughing and land preparation.", icon: <Tractor size={32} />, baseRate: "₹800/hour" },
  { id: "harvester", name: "Harvesting", desc: "Efficient crop cutting and threshing.", icon: <Combine size={32} />, baseRate: "₹2,500/acre" },
  { id: "drone", name: "Drone Spraying", desc: "Precision fertilizer & pesticide spray.", icon: <Droplets size={32} />, baseRate: "₹400/acre" },
  { id: "rotavator", name: "Rotavator", desc: "Soil mixing and fine seedbed prep.", icon: <Sprout size={32} />, baseRate: "₹900/hour" },
  { id: "transport", name: "Transport Truck", desc: "Carry harvested crops to market mandi.", icon: <Truck size={32} />, baseRate: "₹1,500/trip" },
];

const BookService = () => {
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [acres, setAcres] = useState("1");
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !date || !address) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmBooking = () => {
    setIsModalOpen(false);
    navigate("/farmer/bookings");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Book Service</h1>
        <p className="text-slate-500 mt-1">Select the agricultural service you need and enter farm details.</p>
      </div>

      <form onSubmit={handleBooking} className="grid md:grid-cols-3 gap-8">
        {/* Service Type Selection */}
        <div className="md:col-span-2 space-y-6">
          <KSCard>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-green-700" size={20} />
              1. Choose Service Type
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {serviceTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedService(type.name)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between h-40 ${
                    selectedService === type.name
                      ? "border-green-700 bg-green-50/50"
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${
                      selectedService === type.name ? "bg-green-700 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{type.baseRate}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mt-3">{type.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </KSCard>

          {/* Details Form */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <MapPin className="text-green-700" size={20} />
              2. Service Location & Schedule
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Land Size (Acres)</label>
                <input
                  type="number"
                  value={acres}
                  onChange={(e) => setAcres(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Farm Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Village name, Mandi road, Landmark description..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Instructions (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special notes e.g. soil type, narrow entrance gate..."
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
            </div>
          </KSCard>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <KSCard className="sticky top-24 bg-gradient-to-b from-slate-50 to-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-green-700" size={20} />
              Booking Summary
            </h3>
            
            <div className="space-y-3 text-sm text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Service Selected:</span>
                <span className="font-bold text-slate-800">{selectedService || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Date:</span>
                <span className="font-semibold text-slate-800">{date || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Land Area:</span>
                <span className="font-semibold text-slate-800">{acres} Acres</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center mb-6">
              <span className="font-bold text-slate-800">Estimated Cost:</span>
              <span className="text-2xl font-extrabold text-green-700">
                {selectedService === "Harvesting" 
                  ? `₹${2500 * parseInt(acres || "1")}` 
                  : selectedService === "Drone Spraying" 
                  ? `₹${400 * parseInt(acres || "1")}`
                  : "₹1,500 (Base)"}
              </span>
            </div>

            <KSButton type="submit" className="w-full justify-center" disabled={!selectedService}>
              Proceed to Book
            </KSButton>
          </KSCard>
        </div>
      </form>

      {/* Confirmation Modal */}
      <KSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Booking Request">
        <div className="space-y-4">
          <p className="text-slate-600">
            Your booking request for <span className="font-bold text-slate-800">{selectedService}</span> will be submitted to the nearest verified service providers.
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl text-sm space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-slate-800">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{address}</span>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <KSButton variant="outline" className="w-1/2 justify-center" onClick={() => setIsModalOpen(false)}>
              Cancel
            </KSButton>
            <KSButton className="w-1/2 justify-center" onClick={confirmBooking}>
              Confirm
            </KSButton>
          </div>
        </div>
      </KSModal>
    </div>
  );
};

export default BookService;
