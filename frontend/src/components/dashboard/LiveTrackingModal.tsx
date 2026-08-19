import React, { useEffect, useState, useCallback } from "react";
import { X, Navigation, LocateFixed, MapPin, Loader } from "lucide-react";
import API from "../../services/api";
import { KSButton } from "../ui";

interface LatLng { lat: number; lng: number; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  role: "farmer" | "provider";
}

const LiveTrackingModal: React.FC<Props> = ({ isOpen, onClose, bookingId, role }) => {
  const [farmLocation, setFarmLocation] = useState<LatLng | null>(null);
  const [providerLocation, setProviderLocation] = useState<LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  // Get user's current location on open
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsLoading(false);
        },
        () => setGpsLoading(false),
        { enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await API.get(`/bookings/${bookingId}/location`);
      const data = res.data.locationData;
      if (data.farm_lat && data.farm_lng) {
        setFarmLocation({ lat: parseFloat(data.farm_lat), lng: parseFloat(data.farm_lng) });
      }
      if (data.provider_lat && data.provider_lng) {
        setProviderLocation({ lat: parseFloat(data.provider_lat), lng: parseFloat(data.provider_lng) });
      }
    } catch {
      setError("Could not load tracking data.");
    }
  }, [bookingId]);

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
        setIsBroadcasting(false);
      }
      setFarmLocation(null);
      setProviderLocation(null);
      setUserLocation(null);
      setError("");
    }
  }, [isOpen]);

  // Farmer polls provider location every 10 seconds
  useEffect(() => {
    if (!isOpen || role !== "farmer") return;
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, [isOpen, role, fetchLocations]);

  const toggleBroadcast = () => {
    if (isBroadcasting && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsBroadcasting(false);
      return;
    }
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setProviderLocation({ lat, lng });
        setUserLocation({ lat, lng });
        try {
          await API.put(`/bookings/${bookingId}/location`, { lat, lng });
        } catch {
          console.error("Failed to push location to server");
        }
      },
      () => {
        setError("GPS access denied. Please allow location permissions.");
        setIsBroadcasting(false);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    setWatchId(id);
    setIsBroadcasting(true);
    setError("");
  };

  if (!isOpen) return null;

  // Choose which location to center the map on — fallback to India center if null
  const defaultCenter = { lat: 17.3850, lng: 78.4867 }; // Default India location
  const activeCenter = providerLocation || farmLocation || userLocation || defaultCenter;

  // Build OpenStreetMap embed URL with markers
  const buildMapUrl = () => {
    const { lat, lng } = activeCenter;
    const delta = 0.015;
    const bbox = `${(lng - delta).toFixed(6)}%2C${(lat - delta).toFixed(6)}%2C${(lng + delta).toFixed(6)}%2C${(lat + delta).toFixed(6)}`;
    const markerLoc = providerLocation || farmLocation || activeCenter;
    const markerParam = `&marker=${markerLoc.lat.toFixed(6)}%2C${markerLoc.lng.toFixed(6)}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markerParam}`;
  };

  const mapUrl = buildMapUrl();
  const googleMapsUrl = activeCenter ? `https://www.google.com/maps/search/?api=1&query=${activeCenter.lat},${activeCenter.lng}` : "#";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "88vh" }}>

        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${role === "provider" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-800"}`}>
              <Navigation size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-slate-800">
                {role === "provider" ? "Share Live GPS Location" : "Track Driver & Live GPS"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">Booking ID: #KS-{bookingId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Status Bar */}
        <div className={`px-4 sm:px-6 py-2.5 text-xs font-semibold flex items-center justify-between gap-2 border-b ${
          isBroadcasting
            ? "bg-blue-50 text-blue-700 border-blue-100"
            : providerLocation && role === "farmer"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-amber-50 text-amber-700 border-amber-100"
        }`}>
          <div className="flex items-center gap-2 min-w-0 truncate">
            {role === "provider" ? (
              isBroadcasting
                ? <><span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block shrink-0" /> <span className="truncate">Live GPS broadcasting to farmer</span></>
                : <><MapPin size={13} className="shrink-0" /> <span className="truncate">Tap "Start Journey" to share GPS location</span></>
            ) : (
              providerLocation
                ? <><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block shrink-0" /> <span className="truncate">Driver en route — auto refreshing map</span></>
                : <><MapPin size={13} className="shrink-0" /> <span className="truncate">Provider ready — active tracking mode</span></>
            )}
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 transition shrink-0 cursor-pointer"
          >
            🗺️ Google Maps Navigation ↗
          </a>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-2 text-xs font-semibold border-b border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-100">
          {gpsLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <Loader className="animate-spin" size={32} />
                <p className="text-sm font-semibold">Getting current GPS location…</p>
              </div>
            </div>
          )}

          <iframe
            key={`${activeCenter.lat}-${activeCenter.lng}`}
            title="Live Location Map"
            src={mapUrl}
            style={{ border: 0, width: "100%", height: "100%" }}
            loading="lazy"
          />
        </div>

        {/* Legend & Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            {userLocation && !providerLocation && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow inline-block" />
                Your Location
              </span>
            )}
            {farmLocation && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-600 inline-block" /> 🌾 Farm Destination
              </span>
            )}
            {providerLocation && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> 🚜 Provider Location
              </span>
            )}
            <span className="text-slate-400 italic">Powered by OpenStreetMap</span>
          </div>

          <div className="flex gap-3">
            <KSButton variant="outline" onClick={onClose} className="px-5 py-2 text-sm">
              Close
            </KSButton>
            {role === "provider" && (
              <KSButton
                onClick={toggleBroadcast}
                className={`gap-2 px-5 py-2 text-sm border-0 font-bold ${
                  isBroadcasting
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isBroadcasting
                  ? <><X size={14} /> Stop Sharing</>
                  : <><LocateFixed size={14} /> Start Journey</>
                }
              </KSButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingModal;
