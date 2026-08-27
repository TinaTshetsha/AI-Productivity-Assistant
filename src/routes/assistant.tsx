import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer, Markdown } from "@/components/AiPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseIntent, resolveIntentLocation, searchBusinesses } from "@/lib/search";
import { useLocationContext } from "@/lib/use-location";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "BusinessConnect AI Assistant | Find South African businesses" },
      {
        name: "description",
        content:
          "Ask BusinessConnect AI to find plumbers, salons, photographers and more across all nine South African provinces, using only listings on the platform.",
      },
      { property: "og:title", content: "BusinessConnect AI Assistant" },
      { property: "og:description", content: "Conversational business discovery across South Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What businesses can help me with plumbing?",
  "Find beauty businesses near me.",
  "Who can repair my car?",
  "Show me photographers in Johannesburg.",
];

function Assistant() {
  const { location } = useLocationContext();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Array<{ slug: string; name: string; city: string }>>([]);

  const locationLabel = useMemo(() => location?.label ?? "South Africa", [location]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setDraft("");
    setLoading(true);
    setError(null);
    try {
      const intent = parseIntent(question, "near");
      const searchLocation = resolveIntentLocation(intent, location);
      const results = searchBusinesses({
        intent,
        location: searchLocation,
        scope: "near",
        radiusKm: 50,
        filters: { sort: "recommended", categoryId: intent.categoryId ?? null },
      });
      const top = results.slice(0, 8);
      setMatches(top.map((r) => ({ slug: r.business.slug, name: r.business.name, city: r.business.city })));
      const businessContext = top
        .map(
          (r) =>
            `${r.business.name} — ${r.business.services.join(", ")}, ${r.business.suburb}, ${r.business.city}, ${r.business.province}` +
            `${r.distanceKm !== null ? `, ${r.distanceKm.toFixed(1)} km away` : ""}` +
            `${r.business.rating ? `, rated ${r.business.rating}` : ""}`,
        )
        .join("\n");
      const res = await chatWithAssistant({
        data: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          businessContext,
          locationLabel: searchLocation?.label ?? locationLabel,
        },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      setError((err as Error)?.message ?? "The AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell kicker="Ask" title="BusinessConnect AI Assistant">
      <p className="text-sm text-muted-foreground">
        Ask for a business, product or service. The assistant answers using only listings on BusinessConnect, from {locationLabel}.
      </p>

      <div className="board mt-4 space-y-4 p-5">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-sm" : "text-sm"}>
            <p className="label-mono text-xs text-muted-foreground">{m.role === "user" ? "You" : "BusinessConnect AI"}</p>
            {m.role === "user" ? <p className="mt-1">{m.content}</p> : <Markdown>{m.content}</Markdown>}
          </div>
        ))}

        {loading && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="size-4" /> Thinking…
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && matches.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            {matches.map((m) => (
              <Link
                key={m.slug}
                to="/business/$slug"
                params={{ slug: m.slug }}
                className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs hover:border-primary"
              >
                {m.name} — {m.city}
              </Link>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(draft);
          }}
          className="flex items-center gap-2 border-t border-border pt-3"
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask BusinessConnect AI…"
            aria-label="Ask the assistant"
          />
          <Button type="submit" disabled={loading} className="gap-1.5">
            <Send className="size-4" /> Send
          </Button>
        </form>

        <AiDisclaimer>
          AI recommendations are based on information available on BusinessConnect. Business details may change. Confirm important
          information directly with the business. All listings in this demonstration build are fictional sample data.
        </AiDisclaimer>
      </div>
    </AppShell>
  );
}
