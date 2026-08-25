import { Link } from "@tanstack/react-router";

export function Brand({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const isPaper = tone === "paper";
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span
        className={`grid size-9 place-items-center rounded-md font-mono text-[11px] font-bold tracking-tight ${
          isPaper ? "bg-gold text-gold-foreground" : "bg-ink text-ink-foreground"
        }`}
      >
        BC
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[15px] font-semibold ${isPaper ? "text-ink-foreground" : "text-foreground"}`}>
          BusinessConnect
        </span>
        <span className={`label-mono mt-1 block ${isPaper ? "text-ink-foreground/60" : "text-muted-foreground"}`}>South Africa</span>
      </span>
    </Link>
  );
}
