import React, { useEffect, useState, useRef } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { X, Navigation, LocateFixed, MapPin } from "lucide-react";
import API from "../../services/api";
import { KSButton } from "../ui";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  role: "farmer" | "provider";
}

const LiveTrackingModal: React.FC<Props> = ({ isOpen, onClose, bookingId, role }) => {
  const [farmLocation, setFarmLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [providerLocation, setProviderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [openInfo, setOpenInfo] = useState<"farm" | "provider" | null>(null);

  const fetchLocations = async () => {
    try {
      const res = await API.get(`/bookings/${bookingId}/location`);
      const data = res.data.locationData;
      if (data.farm_lat && data.farm_lng) {
        setFarmLocation({ lat: parseFloat(data.farm_lat), lng: parseFloat(data.farm_lng) });
      }
      if (data.provider_lat && data.provider_lng) {
        setProviderLocation({ lat: parseFloat(data.provider_lat), lng: parseFloat(data.provider_lng) });
      }
    } catch (err) {
      console.error("Failed to fetch location", err);
      setError("Could not load tracking data.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
        setIsBroadcasting(false);
      }
    }
  }, [isOpen, bookingId]);

  // Farmer polls every 10 seconds
  useEffect(() => {
    let interval: any;
    if (isOpen && role === "farmer") {
      interval = setInterval(fetchLocations, 10000);
    }
    return () => clearInterval(interval);
  }, [isOpen, role]);

  const toggleBroadcast = () => {
    if (isBroadcasting && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsBroadcasting(false);
    } else {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
      }
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setProviderLocation({ lat, lng });
          try {
            await API.put(`/bookings/${bookingId}/location`, { lat, lng });
          } catch (err) {
            console.error("Failed to broadcast location", err);
          }
        },
        () => {
          setError("Failed to access GPS. Please allow location permissions.");
          setIsBroadcasting(false);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      setWatchId(id);
      setIsBroadcasting(true);
      setError("");
    }
  };

  if (!isOpen) return null;

  const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
  const mapCenter = providerLocation || farmLocation || defaultCenter;
  const mapZoom = farmLocation || providerLocation ? 14 : 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "85vh" }}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${role === "provider" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-700"}`}>
              <Navigation size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {role === "provider" ? "Share Your Location" : "Track Service Provider"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">Booking ID: KS-{bookingId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status bar */}
        <div className={`px-6 py-2 text-xs font-semibold flex items-center gap-2 ${
          isBroadcasting 
            ? "bg-blue-50 text-blue-700 border-b border-blue-100" 
            : providerLocation && role === "farmer"
            ? "bg-green-50 text-green-700 border-b border-green-100"
            : "bg-slate-50 text-slate-500 border-b border-slate-100"
        }`}>
          {role === "provider" ? (
            isBroadcasting ? (
              <><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" /> Broadcasting your location to the farmer in real-time</>
            ) : (
              <><MapPin size={14} /> Click "Start Journey" below to begin sharing your GPS location with the farmer</>
            )
          ) : (
            providerLocation ? (
              <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" /> Provider is en route — map refreshes every 10 seconds</>
            ) : (
              <><MapPin size={14} /> Waiting for provider to start sharing their location...</>
            )
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-2 text-sm font-semibold border-b border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <APIProvider apiKey={GOOGLE_MAPS_KEY}>
            <Map
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
              mapId="kisanseeva-tracking-map"
              gestureHandling="greedy"
              disableDefaultUI={false}
              style={{ width: "100%", height: "100%" }}
            >
              {/* Farm Marker */}
              {farmLocation && (
                <>
                  <AdvancedMarker
                    position={farmLocation}
                    onClick={() => setOpenInfo(openInfo === "farm" ? null : "farm")}
                    title="Farm Location"
                  >
                    <Pin
                      background="#16a34a"
                      borderColor="#15803d"
                      glyphColor="#ffffff"
                      glyph="🌾"
                      scale={1.3}
                    />
                  </AdvancedMarker>
                  {openInfo === "farm" && (
                    <InfoWindow position={farmLocation} onCloseClick={() => setOpenInfo(null)}>
                      <div className="p-1 text-sm">
                        <p className="font-bold text-green-700">🌾 Farm Destination</p>
                        <p className="text-slate-500 text-xs mt-1">Service location for this booking</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {farmLocation.lat.toFixed(5)}, {farmLocation.lng.toFixed(5)}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}

              {/* Provider / Tractor Marker */}
              {providerLocation && (
                <>
                  <AdvancedMarker
                    position={providerLocation}
                    onClick={() => setOpenInfo(openInfo === "provider" ? null : "provider")}
                    title="Service Provider"
                  >
                    <Pin
                      background="#2563eb"
                      borderColor="#1d4ed8"
                      glyphColor="#ffffff"
                      glyph="🚜"
                      scale={1.3}
                    />
                  </AdvancedMarker>
                  {openInfo === "provider" && (
                    <InfoWindow position={providerLocation} onCloseClick={() => setOpenInfo(null)}>
                      <div className="p-1 text-sm">
                        <p className="font-bold text-blue-700">🚜 Service Provider</p>
                        <p className="text-slate-500 text-xs mt-1">
                          {role === "provider" ? "Your current position" : "Live position (refreshes every 10s)"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {providerLocation.lat.toFixed(5)}, {providerLocation.lng.toFixed(5)}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}

              {/* If no locations yet, show user's current location */}
              {!farmLocation && !providerLocation && (
                <AdvancedMarker position={defaultCenter}>
                  <Pin background="#94a3b8" borderColor="#64748b" glyphColor="#fff" glyph="📍" scale={1.2} />
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-4">
          <div className="flex gap-4 text-xs text-slate-500">
            {farmLocation && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-600 inline-block" /> Farm Location
              </span>
            )}
            {providerLocation && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Provider Location
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <KSButton variant="outline" onClick={onClose} className="px-5 py-2 text-sm">
              Close
            </KSButton>
            {role === "provider" && (
              <KSButton
                onClick={toggleBroadcast}
                className={`gap-2 px-5 py-2 text-sm border-0 ${
                  isBroadcasting
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isBroadcasting ? (
                  <><X size={14} /> Stop Broadcasting</>
                ) : (
                  <><LocateFixed size={14} /> Start Journey</>
                )}
              </KSButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingModal;
