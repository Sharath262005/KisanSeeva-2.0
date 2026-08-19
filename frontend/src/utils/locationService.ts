export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  coords: LocationCoords;
  cityName?: string;
}

export type PermissionState = "granted" | "prompt" | "denied" | "unsupported";

/**
 * Check browser/device geolocation permission state
 */
export async function checkLocationPermission(): Promise<PermissionState> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return "unsupported";
  }

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const status = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      return status.state as PermissionState;
    }
  } catch {
    // navigator.permissions.query may fail in some environments
  }

  return "prompt";
}

/**
 * Request location coordinates using browser/Capacitor Geolocation API with explicit timeout and error handling.
 */
export function getCurrentLocation(): Promise<LocationCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser or device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        let msg = "Could not obtain location.";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access in your browser or app settings.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable. Please check GPS signal.";
        } else if (err.code === err.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5 mins cache
      }
    );
  });
}

/**
 * Reverse geocode latitude and longitude to get local city or district name
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return "Your Location";
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || "Your Location";
  } catch {
    return "Your Location";
  }
}

/**
 * Geocode city name to lat/lon using Open-Meteo search API
 */
export async function geocodeCityName(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`
    );
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;
    return { lat: result.latitude, lon: result.longitude, name: result.name };
  } catch {
    return null;
  }
}
