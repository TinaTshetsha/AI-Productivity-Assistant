import {
  ALL_AREAS,
  ALL_CITIES,
  BUSINESSES,
  CATEGORIES,
  PROVINCES,
  categoryById,
  type Business,
} from "@/data/sa";

export type SearchScope = "near" | "city" | "province" | "national";

export type ResolvedLocation = {
  label: string;
  lat: number;
  lng: number;
  province?: string;
  city?: string;
  suburb?: string;
  source: "gps" | "typed" | "selected" | "default";
};

export type SearchIntent = {
  rawQuery: string;
  categoryId: string | null;
  service: string | null;
  keywords: string[];
  locationText: string | null;
  explicitLocation: boolean;
  priceBand: "affordable" | "premium" | null;
  openNow: boolean;
  scope: SearchScope;
  radiusKm: number;
};

export type ScoredBusiness = {
  business: Business;
  distanceKm: number | null;
  score: number;
  reason: string;
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const SERVICE_SYNONYMS: Record<string, { categoryId: string; service: string }> = {
  plumber: { categoryId: "home", service: "Plumbing" },
  plumbing: { categoryId: "home", service: "Plumbing" },
  leak: { categoryId: "home", service: "Plumbing" },
  geyser: { categoryId: "home", service: "Plumbing" },
  drain: { categoryId: "home", service: "Plumbing" },
  electrician: { categoryId: "home", service: "Electrical" },
  electrical: { categoryId: "home", service: "Electrical" },
  roof: { categoryId: "home", service: "Roofing" },
  roofing: { categoryId: "home", service: "Roofing" },
  builder: { categoryId: "home", service: "Building" },
  painter: { categoryId: "home", service: "Painting" },
  cleaner: { categoryId: "home", service: "Cleaning" },
  cleaning: { categoryId: "home", service: "Cleaning" },
  garden: { categoryId: "home", service: "Garden Services" },
  hairdresser: { categoryId: "beauty", service: "Hair Salon" },
  hairdressers: { categoryId: "beauty", service: "Hair Salon" },
  salon: { categoryId: "beauty", service: "Hair Salon" },
  salons: { categoryId: "beauty", service: "Hair Salon" },
  hair: { categoryId: "beauty", service: "Hair Salon" },
  braid: { categoryId: "beauty", service: "Braiding" },
  braids: { categoryId: "beauty", service: "Braiding" },
  braiding: { categoryId: "beauty", service: "Braiding" },
  barber: { categoryId: "beauty", service: "Barber" },
  nails: { categoryId: "beauty", service: "Nail Technician" },
  makeup: { categoryId: "beauty", service: "Makeup Artist" },
  restaurant: { categoryId: "food", service: "Restaurant" },
  restaurants: { categoryId: "food", service: "Restaurant" },
  food: { categoryId: "food", service: "Restaurant" },
  takeaway: { categoryId: "food", service: "Takeaway" },
  bakery: { categoryId: "food", service: "Bakery" },
  cake: { categoryId: "food", service: "Bakery" },
  catering: { categoryId: "food", service: "Catering" },
  coffee: { categoryId: "food", service: "Coffee Shop" },
  mechanic: { categoryId: "auto", service: "Mechanic" },
  mechanics: { categoryId: "auto", service: "Mechanic" },
  car: { categoryId: "auto", service: "Mechanic" },
  tyres: { categoryId: "auto", service: "Tyres" },
  tyre: { categoryId: "auto", service: "Tyres" },
  panel: { categoryId: "auto", service: "Panel Beating" },
  accountant: { categoryId: "professional", service: "Accounting" },
  accountants: { categoryId: "professional", service: "Accounting" },
  accounting: { categoryId: "professional", service: "Accounting" },
  tax: { categoryId: "professional", service: "Accounting" },
  lawyer: { categoryId: "professional", service: "Legal" },
  attorney: { categoryId: "professional", service: "Legal" },
  legal: { categoryId: "professional", service: "Legal" },
  consultant: { categoryId: "professional", service: "Consulting" },
  photographer: { categoryId: "events", service: "Photography" },
  photographers: { categoryId: "events", service: "Photography" },
  photography: { categoryId: "events", service: "Photography" },
  wedding: { categoryId: "events", service: "Wedding Photography" },
  decorator: { categoryId: "events", service: "Decor" },
  decor: { categoryId: "events", service: "Decor" },
  dj: { categoryId: "events", service: "DJ" },
  venue: { categoryId: "events", service: "Venue" },
  gym: { categoryId: "health", service: "Gym" },
  fitness: { categoryId: "health", service: "Fitness" },
  pharmacy: { categoryId: "health", service: "Pharmacy" },
  tutor: { categoryId: "education", service: "Tutoring" },
  tutors: { categoryId: "education", service: "Tutoring" },
  tutoring: { categoryId: "education", service: "Tutoring" },
  courier: { categoryId: "transport", service: "Courier" },
  moving: { categoryId: "transport", service: "Moving" },
  movers: { categoryId: "transport", service: "Moving" },
  delivery: { categoryId: "transport", service: "Delivery" },
  farm: { categoryId: "agriculture", service: "Farming Services" },
  farming: { categoryId: "agriculture", service: "Farming Services" },
  solar: { categoryId: "energy", service: "Solar Installation" },
  inverter: { categoryId: "energy", service: "Inverters" },
  battery: { categoryId: "energy", service: "Battery Backup" },
  clothing: { categoryId: "retail", service: "Clothing" },
  clothes: { categoryId: "retail", service: "Clothing" },
  uniform: { categoryId: "retail", service: "School Uniforms" },
  uniforms: { categoryId: "retail", service: "School Uniforms" },
  furniture: { categoryId: "retail", service: "Furniture" },
  electronics: { categoryId: "retail", service: "Electronics" },
  website: { categoryId: "tech", service: "Web Development" },
  web: { categoryId: "tech", service: "Web Development" },
  it: { categoryId: "tech", service: "IT Support" },
  software: { categoryId: "tech", service: "Software" },
  marketing: { categoryId: "tech", service: "Digital Marketing" },
};

const STOP_WORDS = new Set([
  "find","a","an","the","near","me","i","need","for","in","at","looking","some","my","open","is","and","that","does","who","can","with","best","good","show","please","want","to","around","of","us",
]);

/**
 * Deterministic intent parser: no fabrication, works offline, and is used to
 * pre-filter the database that the AI assistant is allowed to talk about.
 */
export function parseIntent(query: string, fallbackScope: SearchScope = "near"): SearchIntent {
  const q = query.toLowerCase();
  const tokens = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

  let categoryId: string | null = null;
  let service: string | null = null;
  for (const token of tokens) {
    const hit = SERVICE_SYNONYMS[token];
    if (hit) {
      categoryId = hit.categoryId;
      if (!service || hit.service === "Wedding Photography") service = hit.service;
    }
  }
  if (!categoryId) {
    const cat = CATEGORIES.find((c) => q.includes(c.name.toLowerCase()));
    if (cat) categoryId = cat.id;
  }

  // Location extraction: explicit place names anywhere in the query.
  let locationText: string | null = null;
  let explicitLocation = false;

  const areaHit = ALL_AREAS.find((a) => q.includes(a.name.toLowerCase()));
  const cityHit = ALL_CITIES.find((c) => q.includes(c.name.toLowerCase()));
  const provinceHit = PROVINCES.find((p) => q.includes(p.name.toLowerCase()));

  let scope: SearchScope = fallbackScope;
  if (/(anywhere in south africa|across south africa|nationally|nationwide|south africa)/.test(q)) {
    scope = "national";
  }
  if (areaHit) {
    locationText = `${areaHit.name}, ${areaHit.city}`;
    explicitLocation = true;
    if (scope !== "national") scope = "near";
  } else if (cityHit) {
    locationText = `${cityHit.name}, ${cityHit.province}`;
    explicitLocation = true;
    if (scope !== "national") scope = "city";
  } else if (provinceHit) {
    locationText = provinceHit.name;
    explicitLocation = true;
    if (scope !== "national") scope = "province";
  }
  if (/near me|close to me|nearby|around me/.test(q) && !explicitLocation) scope = "near";

  const priceBand = /(affordable|cheap|budget|low cost|inexpensive)/.test(q)
    ? ("affordable" as const)
    : /(premium|luxury|high end|upmarket)/.test(q)
      ? ("premium" as const)
      : null;

  const openNow = /(open now|open today|open tonight|open saturday|open sunday|open late)/.test(q);

  const radiusKm = categoryId ? (categoryById(categoryId)?.defaultRadiusKm ?? 25) : 25;

  return {
    rawQuery: query,
    categoryId,
    service,
    keywords: tokens.filter((t) => !STOP_WORDS.has(t)),
    locationText,
    explicitLocation,
    priceBand,
    openNow,
    scope,
    radiusKm,
  };
}

export function resolveIntentLocation(intent: SearchIntent, current: ResolvedLocation | null): ResolvedLocation | null {
  if (!intent.explicitLocation || !intent.locationText) return current;
  const q = intent.rawQuery.toLowerCase();

  const area = ALL_AREAS.find((a) => q.includes(a.name.toLowerCase()));
  if (area) {
    return {
      label: `${area.name}, ${area.city}`,
      lat: area.lat,
      lng: area.lng,
      province: area.province,
      city: area.city,
      suburb: area.name,
      source: "typed",
    };
  }
  const city = ALL_CITIES.find((c) => q.includes(c.name.toLowerCase()));
  if (city) {
    return { label: `${city.name}, ${city.province}`, lat: city.lat, lng: city.lng, province: city.province, city: city.name, source: "typed" };
  }
  const province = PROVINCES.find((p) => q.includes(p.name.toLowerCase()));
  if (province) {
    const first = province.cities[0];
    return { label: province.name, lat: first.lat, lng: first.lng, province: province.name, source: "typed" };
  }
  return current;
}

export function isOpenNow(business: Business, now = new Date()) {
  const hours = business.openingHours[DAYS[now.getDay()]];
  if (!hours || hours.toLowerCase() === "closed") return false;
  const match = hours.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
  if (!match) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const open = Number(match[1]) * 60 + Number(match[2]);
  const close = Number(match[3]) * 60 + Number(match[4]);
  return minutes >= open && minutes <= close;
}

export type SearchFilters = {
  categoryId?: string | null;
  verifiedOnly?: boolean;
  openNow?: boolean;
  minRating?: number;
  priceBand?: "affordable" | "moderate" | "premium" | null;
  sort?: "recommended" | "distance" | "rating" | "newest";
};

export type SearchArgs = {
  intent: SearchIntent;
  location: ResolvedLocation | null;
  scope: SearchScope;
  radiusKm: number;
  filters?: SearchFilters;
};

export function searchBusinesses({ intent, location, scope, radiusKm, filters = {} }: SearchArgs): ScoredBusiness[] {
  const categoryId = filters.categoryId ?? intent.categoryId;
  const results: ScoredBusiness[] = [];

  for (const business of BUSINESSES) {
    const distanceKm = location ? haversineKm(location.lat, location.lng, business.lat, business.lng) : null;

    // Scope gate
    if (scope === "near" && (distanceKm === null || distanceKm > radiusKm)) continue;
    if (scope === "city" && location?.city && business.city !== location.city) continue;
    if (scope === "province" && location?.province && business.province !== location.province) continue;

    if (categoryId && business.categoryId !== categoryId) continue;
    if (filters.verifiedOnly && business.verification === "unverified") continue;
    if (filters.openNow && !isOpenNow(business)) continue;
    if (filters.minRating && (business.rating ?? 0) < filters.minRating) continue;
    if (filters.priceBand && business.priceBand !== filters.priceBand) continue;

    const haystack = [business.name, business.description, ...business.services, business.suburb, business.city]
      .join(" ")
      .toLowerCase();

    let score = 0;
    const reasons: string[] = [];

    if (intent.service && business.services.some((s) => s.toLowerCase() === intent.service!.toLowerCase())) {
      score += 40;
      reasons.push(`offers ${intent.service.toLowerCase()}`);
    } else if (categoryId && business.categoryId === categoryId) {
      score += 25;
      reasons.push(`listed under ${categoryById(categoryId)?.name.toLowerCase()}`);
    }

    const matchedKeywords = intent.keywords.filter((k) => k.length > 2 && haystack.includes(k));
    score += Math.min(matchedKeywords.length * 6, 24);

    if (distanceKm !== null) {
      score += Math.max(0, 30 - distanceKm);
      reasons.push(`${distanceKm.toFixed(1)} km from your selected location`);
    }
    if (business.rating) score += business.rating * 3;
    if (business.verification === "verified") score += 4;
    if (business.verification === "trusted") score += 7;

    if (intent.priceBand && business.priceBand === intent.priceBand) {
      score += 12;
      reasons.push(`priced in the ${intent.priceBand} range`);
    }
    if (intent.openNow && isOpenNow(business)) {
      score += 10;
      reasons.push("open right now");
    }

    if (score <= 0 && matchedKeywords.length === 0 && !categoryId) continue;

    results.push({
      business,
      distanceKm,
      score,
      reason: reasons.length ? `Recommended because this business ${reasons.join(", and is ")}.` : "Matches your search terms.",
    });
  }

  const sort = filters.sort ?? "recommended";
  results.sort((a, z) => {
    if (sort === "distance") return (a.distanceKm ?? 9e9) - (z.distanceKm ?? 9e9);
    if (sort === "rating") return (z.business.rating ?? 0) - (a.business.rating ?? 0);
    if (sort === "newest") return a.business.name.localeCompare(z.business.name);
    return z.score - a.score;
  });

  return results;
}

export type Fallback = { kind: "radius" | "city" | "province" | "national" | "category"; label: string; count: number; radiusKm?: number; scope?: SearchScope };

/** Smart no-result system: never a dead end. */
export function buildFallbacks(args: SearchArgs): Fallback[] {
  const out: Fallback[] = [];
  const radii = [10, 25, 50, 100].filter((r) => r > args.radiusKm);
  for (const r of radii) {
    const count = searchBusinesses({ ...args, scope: "near", radiusKm: r }).length;
    if (count > 0) {
      out.push({ kind: "radius", label: `${count} within ${r} km`, count, radiusKm: r, scope: "near" });
      break;
    }
  }
  if (args.location?.city) {
    const count = searchBusinesses({ ...args, scope: "city" }).length;
    if (count > 0) out.push({ kind: "city", label: `${count} in ${args.location.city}`, count, scope: "city" });
  }
  if (args.location?.province) {
    const count = searchBusinesses({ ...args, scope: "province" }).length;
    if (count > 0) out.push({ kind: "province", label: `${count} across ${args.location.province}`, count, scope: "province" });
  }
  const national = searchBusinesses({ ...args, scope: "national" }).length;
  if (national > 0) out.push({ kind: "national", label: `${national} across South Africa`, count: national, scope: "national" });
  return out;
}

export const EXAMPLE_SEARCHES = [
  "Find a plumber near me",
  "Hair salons in Johannesburg",
  "Affordable restaurants in Durban",
  "Find a mechanic in Pretoria",
  "Photographers in Cape Town",
  "Find an electrician in Soweto",
  "Accountants in Polokwane",
  "Event decorators in Gqeberha",
  "Find a bakery near me",
  "Solar installers anywhere in South Africa",
];

export const DEFAULT_LOCATION: ResolvedLocation = {
  label: "Johannesburg, Gauteng",
  lat: -26.2041,
  lng: 28.0473,
  province: "Gauteng",
  city: "Johannesburg",
  source: "default",
};

export function nearestArea(lat: number, lng: number) {
  let best = ALL_AREAS[0];
  let bestD = Number.POSITIVE_INFINITY;
  for (const a of ALL_AREAS) {
    const d = haversineKm(lat, lng, a.lat, a.lng);
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return { area: best, distanceKm: bestD };
}
