import React, { useState, useEffect, useCallback } from "react";
import {
  Cloud, CloudRain, Sun, Wind, MapPin, Loader2, AlertCircle,
  RefreshCw, Droplets, Eye, Thermometer, CloudSnow, Zap,
  CloudDrizzle, CloudFog, Search, X
} from "lucide-react";
import { getCurrentLocation, reverseGeocodeCoords, geocodeCityName } from "../../utils/locationService";

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  apparent_temperature?: number;
  relative_humidity?: number;
  uv_index?: number;
  precipitation_probability?: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  weathercode: number;
}

type BackendStatus = "idle" | "loading" | "success" | "denied" | "error";

const weatherCodeMap: Record<number, {
  text: string;
  icon: (sz: number) => React.ReactNode;
  bg: string;
  gradient: string;
}> = {
  0:  { text: "Clear Sky",       icon: (sz) => <Sun className="text-amber-400" size={sz} />,        bg: "from-sky-400 to-blue-500",      gradient: "from-sky-50 to-amber-50" },
  1:  { text: "Mainly Clear",    icon: (sz) => <Sun className="text-amber-400" size={sz} />,        bg: "from-sky-400 to-blue-500",      gradient: "from-sky-50 to-amber-50" },
  2:  { text: "Partly Cloudy",   icon: (sz) => <Cloud className="text-slate-400" size={sz} />,      bg: "from-slate-400 to-sky-400",     gradient: "from-slate-50 to-sky-50" },
  3:  { text: "Overcast",        icon: (sz) => <Cloud className="text-slate-500" size={sz} />,      bg: "from-slate-500 to-slate-400",   gradient: "from-slate-100 to-slate-50" },
  45: { text: "Foggy",           icon: (sz) => <CloudFog className="text-slate-400" size={sz} />,   bg: "from-slate-400 to-slate-500",   gradient: "from-slate-100 to-slate-50" },
  48: { text: "Rime Fog",        icon: (sz) => <CloudFog className="text-slate-300" size={sz} />,   bg: "from-slate-300 to-slate-400",   gradient: "from-slate-50 to-slate-100" },
  51: { text: "Light Drizzle",   icon: (sz) => <CloudDrizzle className="text-blue-400" size={sz} />, bg: "from-blue-400 to-cyan-500",   gradient: "from-blue-50 to-cyan-50" },
  53: { text: "Drizzle",         icon: (sz) => <CloudDrizzle className="text-blue-500" size={sz} />, bg: "from-blue-500 to-cyan-600",   gradient: "from-blue-50 to-cyan-50" },
  55: { text: "Heavy Drizzle",   icon: (sz) => <CloudDrizzle className="text-blue-600" size={sz} />, bg: "from-blue-600 to-blue-700",   gradient: "from-blue-100 to-blue-50" },
  61: { text: "Slight Rain",     icon: (sz) => <CloudRain className="text-blue-400" size={sz} />,   bg: "from-blue-400 to-blue-600",     gradient: "from-blue-50 to-indigo-50" },
  63: { text: "Moderate Rain",   icon: (sz) => <CloudRain className="text-blue-500" size={sz} />,   bg: "from-blue-500 to-blue-700",     gradient: "from-blue-100 to-indigo-50" },
  65: { text: "Heavy Rain",      icon: (sz) => <CloudRain className="text-blue-700" size={sz} />,   bg: "from-blue-700 to-indigo-800",   gradient: "from-blue-100 to-indigo-100" },
  71: { text: "Slight Snow",     icon: (sz) => <CloudSnow className="text-slate-300" size={sz} />,  bg: "from-slate-300 to-blue-300",    gradient: "from-slate-50 to-blue-50" },
  73: { text: "Moderate Snow",   icon: (sz) => <CloudSnow className="text-slate-400" size={sz} />,  bg: "from-slate-400 to-blue-400",    gradient: "from-slate-100 to-blue-50" },
  75: { text: "Heavy Snow",      icon: (sz) => <CloudSnow className="text-slate-500" size={sz} />,  bg: "from-slate-500 to-blue-500",    gradient: "from-slate-100 to-blue-100" },
  95: { text: "Thunderstorm",    icon: (sz) => <Zap className="text-yellow-400" size={sz} />,       bg: "from-indigo-700 to-slate-800",  gradient: "from-indigo-100 to-slate-100" },
  96: { text: "Thunderstorm",    icon: (sz) => <Zap className="text-yellow-400" size={sz} />,       bg: "from-indigo-700 to-slate-800",  gradient: "from-indigo-100 to-slate-100" },
  99: { text: "Severe Storm",    icon: (sz) => <Zap className="text-orange-400" size={sz} />,       bg: "from-slate-800 to-indigo-900",  gradient: "from-slate-200 to-indigo-100" },
};

const DEFAULT_MAP = {
  text: "Unknown",
  icon: (sz: number) => <Sun size={sz} className="text-amber-400" />,
  bg: "from-sky-400 to-blue-500",
  gradient: "from-sky-50 to-blue-50",
};

function getHourLabel(isoTime: string) {
  const d = new Date(isoTime);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getUVLabel(uv: number) {
  if (uv <= 2) return { label: "Low", color: "text-green-600" };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-600" };
  if (uv <= 7) return { label: "High", color: "text-orange-500" };
  return { label: "Very High", color: "text-red-600" };
}

async function fetchWeatherForCoords(lat: number, lon: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability,uv_index` +
    `&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1&forecast_hours=8`
  );
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const r = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!r.ok) return "Your Location";
    const d = await r.json();
    return d.city || d.locality || d.principalSubdivision || "Your Location";
  } catch {
    return "Your Location";
  }
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`
    );
    const d = await r.json();
    const result = d.results?.[0];
    if (!result) return null;
    return { lat: result.latitude, lon: result.longitude, name: result.name };
  } catch {
    return null;
  }
}

function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [locationName, setLocationName] = useState("Your Location");
  const [status, setStatus] = useState<BackendStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // City search fallback
  const [showSearch, setShowSearch] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [searching, setSearching] = useState(false);

  const loadFromCoords = useCallback(async (lat: number, lon: number, nameOverride?: string) => {
    setStatus("loading");
    setError(null);
    try {
      const [data, name] = await Promise.all([
        fetchWeatherForCoords(lat, lon),
        nameOverride ? Promise.resolve(nameOverride) : reverseGeocodeCoords(lat, lon),
      ]);

      const cur = data.current;
      setWeather({
        temperature: cur.temperature_2m,
        windspeed: cur.wind_speed_10m,
        weathercode: cur.weather_code,
        apparent_temperature: cur.apparent_temperature,
        relative_humidity: cur.relative_humidity_2m,
        uv_index: cur.uv_index,
        precipitation_probability: cur.precipitation_probability,
      });

      // Next 8 hours forecast
      const times: string[] = data.hourly?.time ?? [];
      const temps: number[] = data.hourly?.temperature_2m ?? [];
      const codes: number[] = data.hourly?.weather_code ?? [];
      const now = new Date();
      const upcoming: HourlyForecast[] = [];
      for (let i = 0; i < times.length && upcoming.length < 5; i++) {
        if (new Date(times[i]) > now) {
          upcoming.push({ time: times[i], temperature: temps[i], weathercode: codes[i] });
        }
      }
      setHourly(upcoming);
      setLocationName(name);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "Could not load weather");
      setStatus("error");
    }
  }, []);

  const requestLocation = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const coords = await getCurrentLocation();
      await loadFromCoords(coords.latitude, coords.longitude);
    } catch (err: any) {
      const msg = err.message || "Unable to get location";
      setError(msg);
      if (msg.toLowerCase().includes("denied")) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, [loadFromCoords]);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  const handleCitySearch = async () => {
    if (!cityInput.trim()) return;
    setSearching(true);
    const result = await geocodeCity(cityInput.trim());
    setSearching(false);
    if (!result) {
      setError(`City "${cityInput}" not found. Try another name.`);
      return;
    }
    setShowSearch(false);
    setCityInput("");
    loadFromCoords(result.lat, result.lon, result.name);
  };

  // ── Loading State ──
  if (status === "idle" || status === "loading") {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl border border-sky-100 shadow-sm p-6 flex items-center justify-center min-h-[140px]">
        <div className="flex flex-col items-center gap-2.5 text-sky-600">
          <Loader2 className="animate-spin" size={28} />
          <span className="text-sm font-semibold">Fetching weather...</span>
          <span className="text-xs text-sky-400">Allow location access if prompted</span>
        </div>
      </div>
    );
  }

  // ── Error / Permission Denied State ──
  if (status !== "success" || !weather) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-100 shadow-sm p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <AlertCircle className="text-orange-500" size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">
              {status === "denied" ? "Location Access Denied" : "Weather Unavailable"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {error || "Could not fetch weather. Try searching for your city manually."}
            </p>
          </div>
        </div>

        {/* City Search Fallback */}
        {showSearch ? (
          <div className="flex gap-2 mt-2">
            <input
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCitySearch()}
              placeholder="Enter city name (e.g. Hyderabad)"
              className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              autoFocus
            />
            <button
              onClick={handleCitySearch}
              disabled={searching}
              className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 cursor-pointer"
            >
              {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </button>
            <button
              onClick={() => { setShowSearch(false); setCityInput(""); }}
              className="px-2 py-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={requestLocation}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <RefreshCw size={13} /> Retry Location
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <Search size={13} /> Search City
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Success State ──
  const wMap = weatherCodeMap[weather.weathercode] ?? DEFAULT_MAP;
  const uvInfo = weather.uv_index != null ? getUVLabel(weather.uv_index) : null;
  const feelsLike = weather.apparent_temperature != null
    ? Math.round(weather.apparent_temperature)
    : null;

  return (
    <div className={`w-full max-w-full mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-white/60 bg-gradient-to-br ${wMap.gradient}`}>

      {/* ── Top Card: Main weather ── */}
      <div className={`bg-gradient-to-br ${wMap.bg} px-4 py-4 sm:px-5 sm:py-5`}>
        <div className="flex items-start justify-between">
          {/* Left: Location + Temp */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={13} className="text-white/80" />
              <span className="text-white/90 text-xs font-semibold tracking-wide truncate max-w-[160px]">
                {locationName}
              </span>
              <button
                onClick={() => setShowSearch(s => !s)}
                className="text-white/60 hover:text-white transition cursor-pointer ml-1"
                title="Search another city"
              >
                <Search size={12} />
              </button>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-white tracking-tighter leading-none">
                {Math.round(weather.temperature)}°
              </span>
              <span className="text-white/70 text-lg font-bold mb-1">C</span>
            </div>
            <p className="text-white/90 text-sm font-bold mt-1">{wMap.text}</p>
            {feelsLike != null && (
              <p className="text-white/60 text-xs mt-0.5">
                Feels like {feelsLike}°C
              </p>
            )}
          </div>

          {/* Right: Icon + Refresh */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={requestLocation}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
              title="Refresh weather"
            >
              <RefreshCw size={14} />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              {wMap.icon(40)}
            </div>
          </div>
        </div>

        {/* City search bar (inline, shown when toggled) */}
        {showSearch && (
          <div className="flex gap-2 mt-3">
            <input
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCitySearch()}
              placeholder="Search city..."
              className="flex-1 text-sm bg-white/90 text-slate-800 border-0 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/60"
              autoFocus
            />
            <button
              onClick={handleCitySearch}
              disabled={searching}
              className="px-3 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-bold transition cursor-pointer border border-white/30"
            >
              {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </button>
            <button
              onClick={() => { setShowSearch(false); setCityInput(""); }}
              className="px-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Detail Stats Row ── */}
      <div className="grid grid-cols-4 divide-x divide-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center py-3 px-2 gap-1">
          <Wind size={15} className="text-sky-500" />
          <span className="text-xs font-black text-slate-800">{Math.round(weather.windspeed)}</span>
          <span className="text-[10px] text-slate-400 font-medium">km/h Wind</span>
        </div>
        <div className="flex flex-col items-center py-3 px-2 gap-1">
          <Droplets size={15} className="text-blue-500" />
          <span className="text-xs font-black text-slate-800">
            {weather.relative_humidity != null ? `${weather.relative_humidity}%` : "—"}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Humidity</span>
        </div>
        <div className="flex flex-col items-center py-3 px-2 gap-1">
          <CloudRain size={15} className="text-indigo-500" />
          <span className="text-xs font-black text-slate-800">
            {weather.precipitation_probability != null ? `${weather.precipitation_probability}%` : "—"}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Rain</span>
        </div>
        <div className="flex flex-col items-center py-3 px-2 gap-1">
          <Sun size={15} className="text-amber-500" />
          <span className={`text-xs font-black ${uvInfo?.color ?? "text-slate-800"}`}>
            {uvInfo ? uvInfo.label : "—"}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">UV Index</span>
        </div>
      </div>

      {/* ── Hourly Forecast ── */}
      {hourly.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm px-4 py-3 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hourly Forecast</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {hourly.map((h, i) => {
              const hMap = weatherCodeMap[h.weathercode] ?? DEFAULT_MAP;
              return (
                <div
                  key={i}
                  className="shrink-0 flex flex-col items-center gap-1 bg-white/80 rounded-2xl px-3 py-2 border border-slate-100 shadow-sm min-w-[56px]"
                >
                  <span className="text-[10px] font-semibold text-slate-500">{getHourLabel(h.time)}</span>
                  {hMap.icon(16)}
                  <span className="text-xs font-bold text-slate-800">{Math.round(h.temperature)}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Farming Advisory ── */}
      <div className="bg-emerald-50/80 border-t border-emerald-100 px-4 py-3">
        <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">🌾 Farming Advisory</p>
        <p className="text-xs text-emerald-900 font-medium leading-relaxed">
          {weather.weathercode <= 1
            ? "Good conditions for field work. Avoid overwatering — soil evaporation will be high."
            : weather.weathercode <= 3
            ? "Mild conditions. Suitable for spraying pesticides and harvesting operations."
            : weather.weathercode <= 55
            ? "Drizzle expected. Delay pesticide application. Good for transplanting."
            : weather.weathercode <= 65
            ? "Rain expected. Avoid waterlogging. Check drainage channels on the field."
            : weather.weathercode >= 95
            ? "Storm conditions. Stay indoors. Secure farm equipment and check crop shelters."
            : "Monitor conditions closely before field operations today."}
        </p>
      </div>
    </div>
  );
}

export default WeatherWidget;
