import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCATION, nearestArea, type ResolvedLocation } from "./search";

type LocationState = {
  location: ResolvedLocation;
  status: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  setLocation: (loc: ResolvedLocation) => void;
  requestGps: () => void;
};

const LocationContext = createContext<LocationState | null>(null);
const STORAGE_KEY = "bcsa.location";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<ResolvedLocation>(DEFAULT_LOCATION);
  const [status, setStatus] = useState<LocationState["status"]>("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLocationState(JSON.parse(raw) as ResolvedLocation);
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  const setLocation = useCallback((loc: ResolvedLocation) => {
    setLocationState(loc);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const requestGps = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const { area } = nearestArea(latitude, longitude);
        setStatus("granted");
        setLocation({
          label: `${area.name}, ${area.city}`,
          lat: latitude,
          lng: longitude,
          province: area.province,
          city: area.city,
          suburb: area.name,
          source: "gps",
        });
      },
      () => setStatus("denied"),
      { timeout: 10000, maximumAge: 300000 },
    );
  }, [setLocation]);

  const value = useMemo(() => ({ location, status, setLocation, requestGps }), [location, status, setLocation, requestGps]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used inside LocationProvider");
  return ctx;
}
