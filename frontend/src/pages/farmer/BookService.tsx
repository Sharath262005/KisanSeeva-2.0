import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tractor, Droplets, Combine, Sprout, Truck, Sparkles, MapPin,
  CreditCard, User, CheckCircle, AlertCircle, Search, X, Filter
} from "lucide-react";
import { KSCard, KSButton, KSModal } from "../../components/ui";
import API from "../../services/api";
import { getCurrentLocation, reverseGeocodeCoords } from "../../utils/locationService";

interface Service {
  id: number;
  provider_id: number;
  name: string;
  type: string;
  price_per_hour: string;
  pricing_model?: "hourly" | "fixed";
  description: string;
  status: string;
  provider_name: string;
  provider_phone: string;
}

// ── Service type meta ────────────────────────────────────────────────────────
const SERVICE_TYPES = [
  { label: "All",      value: "all",      icon: Filter,  color: "slate" },
  { label: "Tractor",  value: "tractor",  icon: Tractor, color: "green" },
  { label: "Harvester",value: "harvester",icon: Combine, color: "amber" },
  { label: "Seeder",   value: "seeder",   icon: Sprout,  color: "emerald"},
  { label: "Sprayer",  value: "sprayer",  icon: Droplets,color: "blue"  },
  { label: "Other",    value: "other",    icon: Truck,   color: "purple"},
];

const getTypeIcon = (type: string, size = 20, cls = "") => {
  switch (type.toLowerCase()) {
    case "tractor":   return <Tractor  size={size} className={cls} />;
    case "harvester": return <Combine  size={size} className={cls} />;
    case "seeder":    return <Sprout   size={size} className={cls} />;
    case "sprayer":   return <Droplets size={size} className={cls} />;
    default:          return <Tractor  size={size} className={cls} />;
  }
};

const getTypeMeta = (type: string) => {
  const map: Record<string, { color: string; bg: string; text: string }> = {
    tractor:   { color: "text-green-700",  bg: "bg-green-100",  text: "Tractor"   },
    harvester: { color: "text-amber-700",  bg: "bg-amber-100",  text: "Harvester" },
    seeder:    { color: "text-emerald-700",bg: "bg-emerald-100",text: "Seeder"    },
    sprayer:   { color: "text-blue-700",   bg: "bg-blue-100",   text: "Sprayer"   },
  };
  return map[type.toLowerCase()] || { color: "text-purple-700", bg: "bg-purple-100", text: type };
};

const BookService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [farmLat, setFarmLat] = useState<number | null>(null);
  const [farmLng, setFarmLng] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  // Default to "0" as requested
  const [hours, setHours] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data.services);
        if (res.data.services.length > 0) {
          setSelectedService(res.data.services[0]);
        }
      } catch (err: any) {
        console.error("Error fetching services", err);
        setError("Unable to load services list. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ── Filtered list ────────────────────────────────────────────────────────
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return services.filter((s) => {
      const matchesType = typeFilter === "all" || s.type.toLowerCase() === typeFilter;
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.provider_name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [services, searchQuery, typeFilter]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !date || !address || !hours) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedService) return;
    setSubmitting(true);
    try {
      await API.post("/bookings", {
        serviceId: selectedService.id,
        bookingDate: date,
        hoursRequired: parseFloat(hours),
        location: address,
        farmLat,
        farmLng,
      });
      setIsModalOpen(false);
      navigate("/farmer/bookings");
    } catch (err: any) {
      console.error("Booking error", err);
      if (err.response?.status === 403) {
        alert("Access denied: Your session may have the wrong role.\n\nPlease logout and log back in as a Farmer.");
      } else {
        alert(err.response?.data?.message || "Booking request failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getEstimatedCost = () => {
    if (!selectedService) return 0;
    if (selectedService.pricing_model === "fixed") {
      return parseFloat(selectedService.price_per_hour);
    }
    return parseFloat(selectedService.price_per_hour) * parseFloat(hours || "0");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Book Service</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Select the agricultural service you need and enter farm details.</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleBooking} className="grid md:grid-cols-3 gap-8">
        {/* Service Selection */}
        <div className="md:col-span-2 space-y-6">
          <KSCard>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-green-700 dark:text-green-400" size={20} />
              1. Choose Available Service
            </h3>

            {/* ── Search Bar ─────────────────────────────────────── */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, type, or provider…"
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* ── Type Filter Chips ───────────────────────────────── */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {SERVICE_TYPES.map(({ label, value, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                    typeFilter === value
                      ? `bg-${color}-600 text-white border-${color}-600 shadow-sm`
                      : `bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700`
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* ── Service Cards ───────────────────────────────────── */}
            {filteredServices.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                {services.length === 0
                  ? "No services are currently listed on the platform."
                  : "No services match your search. Try different keywords."}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredServices.map((service) => {
                  const meta = getTypeMeta(service.type);
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-0 ${
                        isSelected
                          ? "border-green-700 bg-green-50/50 dark:bg-green-950/30"
                          : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        {/* Service type icon + badge */}
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${isSelected ? "bg-green-700 text-white" : `${meta.bg} ${meta.color}`}`}>
                            {getTypeIcon(service.type, 18)}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-green-100 text-green-800" : `${meta.bg} ${meta.color}`}`}>
                            {meta.text}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          ₹{parseFloat(service.price_per_hour).toLocaleString("en-IN")}{service.pricing_model === "fixed" ? " (Fixed)" : "/hr"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-bold text-slate-800 dark:text-white mt-1 line-clamp-1">{service.name}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                          <User size={12} /> Provider: {service.provider_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </KSCard>

          {/* Details Form */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <MapPin className="text-green-700 dark:text-green-400" size={20} />
              2. Service Location & Schedule
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {selectedService?.pricing_model === "fixed" ? "Estimated Work Duration (hrs)" : "Hours Required"}
                </label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0"
                  step="0.5"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                  required
                />
                {selectedService?.pricing_model === "fixed" && (
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
                    🔧 Fixed Price Service — Final bill will be fixed at ₹{parseFloat(selectedService.price_per_hour).toLocaleString("en-IN")} regardless of hours.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Farm Address</label>
                <button
                  type="button"
                  onClick={async () => {
                    setLocating(true);
                    try {
                      const coords = await getCurrentLocation();
                      setFarmLat(coords.latitude);
                      setFarmLng(coords.longitude);
                      const name = await reverseGeocodeCoords(coords.latitude, coords.longitude);
                      if (!address && name !== "Your Location") {
                        setAddress(name);
                      }
                    } catch (err: any) {
                      alert(err.message || "Could not get location. Please ensure location services are enabled.");
                    } finally {
                      setLocating(false);
                    }
                  }}
                  disabled={locating}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <MapPin size={12} /> {locating ? "Locating..." : farmLat ? "Re-pinpoint Location" : "📍 Pinpoint My Location"}
                </button>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Village name, Mandi road, Landmark description..."
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition"
                required
              />

              {farmLat && farmLng && (
                <div className="mt-3 rounded-2xl overflow-hidden border-2 border-green-200 dark:border-green-800 shadow-md">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/40 border-b border-green-100 dark:border-green-800">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">
                      Farm Location Pinned: {farmLat.toFixed(5)}, {farmLng.toFixed(5)}
                    </span>
                  </div>
                  <iframe
                    title="Farm Location"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${(farmLng - 0.006).toFixed(6)}%2C${(farmLat - 0.006).toFixed(6)}%2C${(farmLng + 0.006).toFixed(6)}%2C${(farmLat + 0.006).toFixed(6)}&layer=mapnik&marker=${farmLat.toFixed(6)}%2C${farmLng.toFixed(6)}`}
                    style={{ border: 0, width: "100%", height: "180px" }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </KSCard>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <KSCard className="sticky top-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/80">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="text-green-700 dark:text-green-400" size={20} />
              Booking Summary
            </h3>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex justify-between">
                <span>Service Selected:</span>
                <span className="font-bold text-slate-800 dark:text-white">{selectedService?.name || "None"}</span>
              </div>
              {selectedService && (
                <div className="flex justify-between">
                  <span>Type:</span>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(selectedService.type, 14, getTypeMeta(selectedService.type).color)}
                    <span className="font-semibold text-slate-800 dark:text-white">{getTypeMeta(selectedService.type).text}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{selectedService?.provider_name || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Date:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{date || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{hours || "0"} Hours</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center mb-6">
              <span className="font-bold text-slate-800 dark:text-white">Estimated Cost:</span>
              <span className="text-2xl font-extrabold text-green-700 dark:text-green-400">
                ₹{getEstimatedCost().toLocaleString("en-IN")}
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
          <p className="text-slate-600 dark:text-slate-400">
            Your booking request for <span className="font-bold text-slate-800 dark:text-white">{selectedService?.name}</span> will be submitted to provider <span className="font-bold text-slate-800 dark:text-white">{selectedService?.provider_name}</span>.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm space-y-2 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{hours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Cost:</span>
              <span className="font-bold text-green-700 dark:text-green-400">₹{getEstimatedCost().toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{address}</span>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <KSButton variant="outline" className="w-1/2 justify-center" disabled={submitting} onClick={() => setIsModalOpen(false)}>
              Cancel
            </KSButton>
            <KSButton className="w-1/2 justify-center" disabled={submitting} onClick={confirmBooking}>
              {submitting ? "Booking..." : "Confirm"}
            </KSButton>
          </div>
        </div>
      </KSModal>
    </div>
  );
};

export default BookService;
