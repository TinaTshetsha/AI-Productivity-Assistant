import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/sa";
import {
  buildFallbacks,
  parseIntent,
  resolveIntentLocation,
  searchBusinesses,
  type SearchFilters,
  type SearchScope,
} from "@/lib/search";
import { useLocationContext } from "@/lib/use-location";
import { chatWithAssistant } from "@/lib/ai.functions";
import { AiDisclaimer, Markdown } from "@/components/AiPanel";

const SearchSchema = z.object({
  q: z.string().optional().default(""),
  scope: z.enum(["near", "city", "province", "national"]).optional().default("near"),
  category: z.string().optional(),
});

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>) => SearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Explore businesses across South Africa | BusinessConnect SA" },
      {
        name: "description",
        content:
          "Search verified and new South African businesses near you, by city, by province or nationally. Filter by category, rating, price and opening status.",
      },
      { property: "og:title", content: "Explore businesses across South Africa" },
      { property: "og:description", content: "AI-powered business discovery in all nine provinces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

const SCOPES: Array<{ id: SearchScope; label: string }> = [
  { id: "near", label: "Near me" },
  { id: "city", label: "City" },
  { id: "province", label: "Province" },
  { id: "national", label: "South Africa" },
];

function Explore() {
  const { q, scope, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const { location } = useLocationContext();

  const [draft, setDraft] = useState(q);
  const [radiusKm, setRadiusKm] = useState(25);
  const [filters, setFilters] = useState<SearchFilters>({ sort: "recommended" });
  const [showFilters, setShowFilters] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const intent = useMemo(() => parseIntent(q, scope), [q, scope]);
  const searchLocation = useMemo(() => resolveIntentLocation(intent, location), [intent, location]);

  const args = useMemo(
    () => ({
      intent,
      location: searchLocation,
      scope,
      radiusKm,
      filters: { ...filters, categoryId: category ?? filters.categoryId ?? null },
    }),
    [intent, searchLocation, scope, radiusKm, filters, category],
  );

  const results = useMemo(() => searchBusinesses(args), [args]);
  const fallbacks = useMemo(() => (results.length ? [] : buildFallbacks(args)), [results.length, args]);

  const askAi = async () => {
    if (!q.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const businessContext = results
        .slice(0, 8)
        .map(
          (r) =>
            `${r.business.name} — ${r.business.services.join(", ")}, ${r.business.suburb}, ${r.business.city}, ${r.business.province}` +
            `${r.distanceKm !== null ? `, ${r.distanceKm.toFixed(1)} km away` : ""}` +
            `${r.business.rating ? `, rated ${r.business.rating}` : ""}`,
        )
        .join("\n");
      const res = await chatWithAssistant({
        data: {
          messages: [{ role: "user" as const, content: q }],
          businessContext,
          locationLabel: searchLocation?.label ?? "South Africa",
        },
      });
      setAiText(res.text);
    } catch (error) {
      setAiError((error as Error)?.message ?? "The AI request failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const update = (patch: { q?: string; scope?: SearchScope; category?: string | undefined }) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <AppShell kicker="Discover" title="Explore businesses">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: draft });
        }}
        className="board flex flex-wrap items-center gap-2 p-2"
      >
        <label className="flex min-w-0 flex-1 items-center gap-2 px-2">
          <Sparkles className="size-4 shrink-0 text-primary" />
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='Try "affordable hair salon near me that does braids"'
            aria-label="Search businesses"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </label>
        <Button type="submit" className="gap-1.5">
          <Search className="size-4" /> Search
        </Button>
        <Button type="button" variant="outline" className="gap-1.5" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="size-4" /> Filters
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-secondary p-1">
          {SCOPES.map((option) => (
            <button
              key={option.id}
              onClick={() => update({ scope: option.id })}
              className={`rounded px-3 py-1.5 text-xs font-medium ${
                scope === option.id ? "bg-primary text-primary-foreground" : "text-foreground/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {scope === "near" && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Radius
            {[5, 10, 25, 50].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusKm(r)}
                className={`rounded border px-2 py-1 font-medium ${
                  radiusKm === r ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        )}
        <p className="label-mono text-muted-foreground">Searching from {searchLocation?.label ?? "South Africa"}</p>
      </div>

      {q.trim() !== "" && (
        <div className="board mt-3 p-4">
          <h2 className="label-mono text-xs text-primary">AI understood your request</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {(
              [
                ["Category", intent.categoryId ? (CATEGORIES.find((c) => c.id === intent.categoryId)?.name ?? null) : null],
                ["Service", intent.service],
                ["Location", intent.locationText ?? searchLocation?.label ?? null],
                ["Price", intent.priceBand],
                ["Availability", intent.openNow ? "Open now" : null],
              ] as Array<[string, string | null]>
            ).map(([label, value]) => (
              <span key={label} className="rounded-md border border-border bg-secondary px-2.5 py-1">
                <span className="label-mono text-muted-foreground">{label}:</span> {value ?? "not specified"}
              </span>
            ))}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="board mt-3 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            <span className="label-mono text-muted-foreground">Category</span>
            <select
              value={category ?? ""}
              onChange={(e) => update({ category: e.target.value || undefined })}
              className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="label-mono text-muted-foreground">Minimum rating</span>
            <select
              value={filters.minRating ?? 0}
              onChange={(e) => setFilters((f) => ({ ...f, minRating: Number(e.target.value) || 0 }))}
              className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <option key={r} value={r}>
                  {r ? `${r}+ stars` : "Any rating"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="label-mono text-muted-foreground">Price</span>
            <select
              value={filters.priceBand ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, priceBand: (e.target.value || null) as Exclude<SearchFilters["priceBand"], undefined> }))
              }
              className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="">Any price</option>
              <option value="affordable">Affordable</option>
              <option value="moderate">Moderate</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="label-mono text-muted-foreground">Sort</span>
            <select
              value={filters.sort ?? "recommended"}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as Exclude<SearchFilters["sort"], undefined> }))}
              className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
            <Button
              size="sm"
              variant={filters.verifiedOnly ? "default" : "outline"}
              onClick={() => setFilters((f) => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
            >
              Verified only
            </Button>
            <Button
              size="sm"
              variant={filters.openNow ? "default" : "outline"}
              onClick={() => setFilters((f) => ({ ...f, openNow: !f.openNow }))}
            >
              Open now
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFilters({ sort: "recommended" })}>
              Reset filters
            </Button>
          </div>
        </div>
      )}

      {q.trim() !== "" && (
        <div className="board mt-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="label-mono text-xs text-primary">AI answer</h2>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void askAi()} disabled={aiLoading}>
              <Sparkles className="size-3.5" /> {aiLoading ? "Thinking…" : aiText ? "Ask again" : "Explain these results"}
            </Button>
          </div>
          {aiError && <p className="mt-3 text-sm text-destructive">{aiError}</p>}
          {aiText ? (
            <div className="mt-3">
              <Markdown>{aiText}</Markdown>
            </div>
          ) : (
            !aiError && (
              <p className="mt-3 text-sm text-muted-foreground">
                Ask BusinessConnect AI to summarise the {results.length} matching {results.length === 1 ? "listing" : "listings"} for
                "{q}".
              </p>
            )
          )}
          <AiDisclaimer>
            AI answers use only the businesses listed on this platform — never outside sources — and may still be wrong. Confirm
            details directly with the business before deciding.
          </AiDisclaimer>
        </div>
      )}

      <p className="mt-5 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "business" : "businesses"} found
        {intent.service ? ` for ${intent.service.toLowerCase()}` : ""}.
      </p>

      {results.length === 0 && (
        <div className="board mt-3 p-5">
          <h2 className="font-display text-lg font-semibold">We couldn't find an exact match.</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Try one of these instead — we checked wider areas for you.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {fallbacks.map((fallback) => (
              <Button
                key={`${fallback.kind}-${fallback.label}`}
                size="sm"
                variant="outline"
                onClick={() => {
                  if (fallback.radiusKm) setRadiusKm(fallback.radiusKm);
                  if (fallback.scope) update({ scope: fallback.scope });
                }}
              >
                {fallback.label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => update({ category: undefined, q: "" })}>
              Clear search and browse everything
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {CATEGORIES.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => update({ category: c.id, q: c.name })}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        {results.map((result) => (
          <BusinessCard key={result.business.id} result={result} />
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Business information is provided by businesses and may change. Confirm important details directly with the business. All
        listings in this demonstration build are fictional.
      </p>
    </AppShell>
  );
}
