import { useMemo, useState } from "react";
import { Crosshair, MapPin } from "lucide-react";
import { PROVINCES, ALL_AREAS, ALL_CITIES } from "@/data/sa";
import { useLocationContext } from "@/lib/use-location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function LocationPicker({ trigger }: { trigger?: React.ReactNode }) {
  const { location, status, setLocation, requestGps } = useLocationContext();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"gps" | "enter" | "select">("enter");
  const [query, setQuery] = useState("");
  const [provinceId, setProvinceId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return [
      ...ALL_AREAS.filter((a) => a.name.toLowerCase().includes(q) || a.postalCode.startsWith(q)).map((a) => ({
        key: `a-${a.id}`,
        label: `${a.name}, ${a.city}`,
        sub: `${a.province} · ${a.postalCode}`,
        loc: { label: `${a.name}, ${a.city}`, lat: a.lat, lng: a.lng, province: a.province, city: a.city, suburb: a.name, source: "typed" as const },
      })),
      ...ALL_CITIES.filter((c) => c.name.toLowerCase().includes(q)).map((c) => ({
        key: `c-${c.id}`,
        label: `${c.name}`,
        sub: `${c.province} · ${c.municipality}`,
        loc: { label: `${c.name}, ${c.province}`, lat: c.lat, lng: c.lng, province: c.province, city: c.name, source: "typed" as const },
      })),
    ].slice(0, 8);
  }, [query]);

  const province = PROVINCES.find((p) => p.id === provinceId);
  const city = province?.cities.find((c) => c.id === cityId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="flex w-full items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-left text-sm">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{location.label}</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Where should we search?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-secondary p-1">
          {(
            [
              ["gps", "Use my location"],
              ["enter", "Enter location"],
              ["select", "Select"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`rounded-sm px-2 py-2 text-xs font-medium transition-colors ${
                mode === key ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "gps" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We use your device location only to sort businesses by distance for this search. It is stored on your device and never shared
              with businesses. You can deny access and enter a location instead.
            </p>
            <Button onClick={requestGps} className="w-full gap-2">
              <Crosshair className="size-4" />
              {status === "requesting" ? "Requesting permission…" : "Use my current location"}
            </Button>
            {status === "granted" && <p className="text-sm text-open">Location set to {location.label}.</p>}
            {status === "denied" && (
              <p className="text-sm text-destructive">Location permission was denied. Use “Enter location” or “Select” instead.</p>
            )}
            {status === "unsupported" && <p className="text-sm text-destructive">This device does not support location sharing.</p>}
          </div>
        )}

        {mode === "enter" && (
          <div className="space-y-3">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City, town, suburb, township or postal code"
            />
            <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
              {matches.length === 0 && <p className="px-3 py-3 text-sm text-muted-foreground">Start typing, e.g. Soweto, Mthatha, 7784.</p>}
              {matches.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setLocation(m.loc);
                    setOpen(false);
                  }}
                  className="flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left hover:bg-secondary"
                >
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="label-mono text-muted-foreground">{m.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "select" && (
          <div className="space-y-3">
            <div>
              <p className="label-mono mb-1.5 text-muted-foreground">Province</p>
              <div className="flex flex-wrap gap-1.5">
                {PROVINCES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setProvinceId(p.id);
                      setCityId("");
                    }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      provinceId === p.id ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            {province && (
              <div>
                <p className="label-mono mb-1.5 text-muted-foreground">City / Town</p>
                <div className="flex flex-wrap gap-1.5">
                  {province.cities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCityId(c.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        cityId === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {city && province && (
              <div>
                <p className="label-mono mb-1.5 text-muted-foreground">Suburb / Area</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setLocation({
                        label: `${city.name}, ${province.name}`,
                        lat: city.lat,
                        lng: city.lng,
                        province: province.name,
                        city: city.name,
                        source: "selected",
                      });
                      setOpen(false);
                    }}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
                  >
                    Whole of {city.name}
                  </button>
                  {city.areas.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setLocation({
                          label: `${a.name}, ${city.name}`,
                          lat: a.lat,
                          lng: a.lng,
                          province: province.name,
                          city: city.name,
                          suburb: a.name,
                          source: "selected",
                        });
                        setOpen(false);
                      }}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
