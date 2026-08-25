import { Link } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, Navigation, Phone, ShieldCheck, Star } from "lucide-react";
import { categoryById } from "@/data/sa";
import { isOpenNow, type ScoredBusiness } from "@/lib/search";
import { Button } from "@/components/ui/button";

export function VerificationBadge({ status }: { status: "unverified" | "verified" | "trusted" }) {
  if (status === "unverified")
    return <span className="label-mono rounded-full border border-border px-2 py-1 text-muted-foreground">Unverified</span>;
  const trusted = status === "trusted";
  return (
    <span
      className={`label-mono inline-flex items-center gap-1 rounded-full px-2 py-1 ${
        trusted ? "bg-gold text-gold-foreground" : "bg-veld/12 text-veld"
      }`}
    >
      {trusted ? <ShieldCheck className="size-3" /> : <BadgeCheck className="size-3" />}
      {trusted ? "Trusted" : "Verified"}
    </span>
  );
}

export function BusinessCard({ result, showReason = true }: { result: ScoredBusiness; showReason?: boolean }) {
  const { business, distanceKm } = result;
  const open = isOpenNow(business);
  const category = categoryById(business.categoryId);

  return (
    <article className="board p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight">{business.name}</h3>
            <VerificationBadge status={business.verification} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {category?.name} · {business.suburb}, {business.city}
            <span className="text-muted-foreground/70"> · {business.province}</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          {business.rating ? (
            <p className="flex items-center justify-end gap-1 font-display text-base font-semibold">
              <Star className="size-3.5 fill-gold text-gold" />
              {business.rating.toFixed(1)}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No rating yet</p>
          )}
          <p className="label-mono mt-1 text-muted-foreground">
            {business.reviewCount ? `${business.reviewCount} reviews` : "No reviews"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{business.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {business.services.slice(0, 4).map((s) => (
          <span key={s} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-foreground/70">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className={`label-mono ${open ? "text-open" : "text-muted-foreground"}`}>{open ? "● Open now" : "○ Closed now"}</span>
        {distanceKm !== null && <span className="label-mono text-muted-foreground">{distanceKm.toFixed(1)} km away</span>}
        {business.priceBand && <span className="label-mono text-muted-foreground">{business.priceBand}</span>}
      </div>

      {showReason && (
        <p className="mt-3 rounded-md border border-border bg-secondary px-3 py-2 text-xs leading-relaxed text-foreground/75">
          <span className="label-mono mr-1.5 text-primary">Why this business?</span>
          {result.reason}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link to="/business/$slug" params={{ slug: business.slug }}>
            View profile
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <a href={`tel:${business.phone.replace(/\s/g, "")}`}>
            <Phone className="size-3.5" /> Call
          </a>
        </Button>
        {business.whatsapp && (
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          </Button>
        )}
        <Button asChild size="sm" variant="ghost" className="gap-1.5">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`} target="_blank" rel="noreferrer">
            <Navigation className="size-3.5" /> Directions
          </a>
        </Button>
      </div>
    </article>
  );
}
