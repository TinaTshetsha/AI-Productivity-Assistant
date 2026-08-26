import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CalendarClock,
  Crosshair,
  Mail,
  MapPin,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { BusinessCard } from "@/components/BusinessCard";
import { LocationPicker } from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESSES, CATEGORIES, PROVINCES, businessCountByProvince } from "@/data/sa";
import { EXAMPLE_SEARCHES, parseIntent, searchBusinesses } from "@/lib/search";
import { useLocationContext } from "@/lib/use-location";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BusinessConnect South Africa — Every Business. One Place." },
      {
        name: "description",
        content:
          "Find businesses, services and products anywhere in South Africa with AI search — and use AI workplace tools to work smarter.",
      },
      { property: "og:title", content: "BusinessConnect South Africa — Every Business. One Place." },
      {
        property: "og:description",
        content: "Discover South African businesses near you and automate your workday with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const AI_TOOLS = [
  { to: "/workplace/email", label: "Smart Email Generator", copy: "Professional customer emails in any tone.", icon: Mail },
  { to: "/workplace/notes", label: "Meeting Notes Summarizer", copy: "Summary, decisions and action items.", icon: NotebookPen },
  { to: "/workplace/planner", label: "AI Task Planner", copy: "A prioritised schedule for your day.", icon: CalendarClock },
  { to: "/workplace/research", label: "AI Research Assistant", copy: "Structured business research briefings.", icon: Search },
  { to: "/workplace/chat", label: "BusinessConnect AI", copy: "Ask anything, find any business.", icon: Bot },
] as const;

function Landing() {
  const navigate = useNavigate();
  const { location, requestGps } = useLocationContext();
  const [query, setQuery] = useState("");

  const nearby = useMemo(() => {
    const intent = parseIntent("", "near");
    return searchBusinesses({ intent, location, scope: "near", radiusKm: 40, filters: { sort: "distance" } }).slice(0, 3);
  }, [location]);

  const go = (q: string) => navigate({ to: "/explore", search: { q, scope: "near" } });

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Brand />
          <nav className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/explore" search={{ q: "", scope: "near" }}>
                Explore
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="label-mono text-gold">National · all nine provinces</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Every Business. One Place.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-foreground/75 sm:text-lg">
            Discover businesses, services and products anywhere in South Africa — and use AI to work smarter.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(query);
            }}
            className="mt-8 grid gap-2 rounded-xl border border-white/10 bg-ink-soft p-3 sm:grid-cols-[1fr_auto] sm:p-4"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-md bg-background px-3">
                <Sparkles className="size-4 shrink-0 text-primary" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  aria-label="What are you looking for?"
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </label>
              <div className="[&_button]:h-10">
                <LocationPicker
                  trigger={
                    <button
                      type="button"
                      className="flex h-full w-full items-center gap-2 rounded-md bg-background px-3 text-left text-sm text-foreground"
                    >
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{location.label}</span>
                    </button>
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 gap-1.5 sm:flex-none">
                <Search className="size-4" /> Search
              </Button>
              <Button type="button" variant="secondary" className="gap-1.5" onClick={requestGps}>
                <Crosshair className="size-4" /> <span className="hidden sm:inline">Use my location</span>
              </Button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {EXAMPLE_SEARCHES.slice(0, 5).map((example) => (
              <button
                key={example}
                onClick={() => go(example)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-ink-foreground/80 hover:bg-white/10"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6">
        <section>
          <h2 className="font-display text-2xl font-semibold">Popular categories</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to="/explore"
                search={{ q: category.name, scope: "near", category: category.id }}
                className="board px-4 py-3 transition-colors hover:border-primary"
              >
                <p className="font-medium">{category.name}</p>
                <p className="label-mono mt-1.5 text-muted-foreground">
                  {BUSINESSES.filter((b) => b.categoryId === category.id).length} listings
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-semibold">Businesses near me</h2>
              <p className="mt-1 text-sm text-muted-foreground">Within 40 km of {location.label}.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to="/explore" search={{ q: "", scope: "near" }}>
                Explore all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {nearby.length ? (
              nearby.map((result) => <BusinessCard key={result.business.id} result={result} showReason={false} />)
            ) : (
              <p className="text-sm text-muted-foreground">
                No listings within 40 km yet — try a city, province or national search on Explore.
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold">Explore South Africa</h2>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {PROVINCES.map((province) => (
              <Link
                key={province.id}
                to="/explore"
                search={{ q: province.name, scope: "province" }}
                className="board flex items-center justify-between px-4 py-3 transition-colors hover:border-primary"
              >
                <span className="font-medium">{province.name}</span>
                <span className="label-mono text-muted-foreground">{businessCountByProvince(province.name)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">AI workplace tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Built for business owners: write, summarise, plan and research in one place.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AI_TOOLS.map((tool) => (
              <div key={tool.to} className="board p-4">
                <tool.icon className="size-5 text-primary" />
                <p className="mt-3 font-medium">{tool.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{tool.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">How it works</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["Search", "Ask in plain language — “an affordable hair salon near me that does braids”."],
              ["Discover", "We rank real listings by service match, distance, rating and status."],
              ["Compare", "See distance, opening status, services and why each business matched."],
              ["Connect", "Call, WhatsApp or send an enquiry straight to the business owner."],
            ].map(([title, copy], index) => (
              <li key={title} className="board p-4">
                <p className="label-mono text-primary">Step {index + 1}</p>
                <p className="mt-2 font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="board flex flex-wrap items-center justify-between gap-4 bg-ink p-6 text-ink-foreground">
          <div>
            <h2 className="font-display text-2xl font-semibold">Run a business? Get discovered.</h2>
            <p className="mt-1.5 text-sm text-ink-foreground/75">
              Sole traders, informal traders, home businesses and enterprises are all welcome.
            </p>
          </div>
          <Button asChild size="lg" className="gap-1.5">
            <Link to="/explore" search={{ q: "", scope: "national" }}>
              <Briefcase className="size-4" /> Browse listings
            </Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
          <p className="text-xs text-muted-foreground">
            Demonstration build — all business listings are fictional sample data.
          </p>
          <span className="label-mono text-muted-foreground">
            AI answers are generated from platform listings only and can be wrong — always confirm with the business.
          </span>
        </div>
      </footer>
    </div>
  );
}
