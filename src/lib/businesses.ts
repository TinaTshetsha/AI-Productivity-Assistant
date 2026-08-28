import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESSES, type Business } from "@/data/sa";

export type BusinessRow = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  business_type: string | null;
  category_id: string | null;
  description: string | null;
  short_description: string | null;
  services: string[];
  products: string[];
  keywords: string[];
  province: string | null;
  municipality: string | null;
  city: string | null;
  suburb: string | null;
  address: string | null;
  postal_code: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  social: string | null;
  opening_hours: Record<string, string> | null;
  availability: string | null;
  logo_url: string | null;
  images: string[];
  price_band: string | null;
  status: "draft" | "pending" | "verified" | "rejected" | "suspended";
  rejection_reason: string | null;
  profile_views: number;
  search_appearances: number;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABEL: Record<BusinessRow["status"], string> = {
  draft: "Draft",
  pending: "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
  suspended: "Suspended",
};

export function rowToBusiness(row: BusinessRow): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    businessType: row.business_type ?? "",
    categoryId: row.category_id ?? "",
    description: row.description ?? "",
    services: row.services ?? [],
    products: row.products ?? [],
    province: row.province ?? "",
    municipality: row.municipality ?? "",
    city: row.city ?? "",
    suburb: row.suburb ?? "",
    postalCode: row.postal_code ?? "",
    address: row.address ?? "",
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
    phone: row.phone ?? "",
    email: row.email ?? "",
    ...(row.whatsapp ? { whatsapp: row.whatsapp } : {}),
    ...(row.website ? { website: row.website } : {}),
    openingHours: (row.opening_hours as Record<string, string>) ?? {},
    verification: row.status === "verified" ? "verified" : "unverified",
    rating: null,
    reviewCount: 0,
    priceBand: (row.price_band as Business["priceBand"]) ?? null,
    demo: false,
    live: true,
    status: row.status,
  };
}

async function fetchVerified(): Promise<Business[]> {
  const { data, error } = await supabase.from("businesses").select("*").eq("status", "verified");
  if (error) throw error;
  return ((data ?? []) as unknown as BusinessRow[]).map(rowToBusiness);
}

/** Verified businesses stored in the database (registered by real owners). */
export function useVerifiedBusinesses() {
  return useQuery({ queryKey: ["verified-businesses"], queryFn: fetchVerified, staleTime: 30_000 });
}

/** Demo dataset + live verified businesses, for search and the AI assistant. */
export function useBusinessPool(): Business[] {
  const { data } = useVerifiedBusinesses();
  return [...(data ?? []), ...BUSINESSES];
}
