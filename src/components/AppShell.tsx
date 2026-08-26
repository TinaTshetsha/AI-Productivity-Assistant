import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  Briefcase,
  CalendarClock,
  Compass,
  Home,
  Inbox,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";
import { Brand } from "./Brand";
import { LocationPicker } from "./LocationPicker";

const NAV: Array<{ group: string; items: Array<{ to: string; label: string; icon: typeof Home }> }> = [
  {
    group: "Discover",
    items: [
      { to: "/", label: "Home", icon: Home },
      { to: "/explore", label: "Explore businesses", icon: Compass },
    ],
  },
];

export function AppShell({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Brand tone="paper" />
        <nav className="mt-7 flex-1 space-y-6 overflow-y-auto">
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="label-mono px-2 text-ink-foreground/40">{group.group}</p>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      activeOptions={{ exact: item.to === "/" || item.to === "/workplace" }}
                      activeProps={{ className: "bg-primary text-primary-foreground" }}
                      inactiveProps={{ className: "text-ink-foreground/70 hover:bg-sidebar-accent hover:text-ink-foreground" }}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors"
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="mt-4 text-[11px] leading-relaxed text-ink-foreground/40">
          Demonstration build. All business listings are fictional sample data.
        </p>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setOpen(true)} className="rounded-md border border-border p-2 lg:hidden" aria-label="Open menu">
              <Menu className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              {kicker && <p className="label-mono text-primary">{kicker}</p>}
              <h1 className="truncate font-display text-lg font-semibold sm:text-xl">{title}</h1>
            </div>
            <div className="hidden w-64 sm:block">
              <LocationPicker />
            </div>
          </div>
        </header>

        <div className="sm:hidden px-4 pt-3">
          <LocationPicker />
        </div>

        <main className="px-4 py-5 sm:px-6 sm:py-7">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-sidebar px-4 py-5">
            <div className="flex items-center justify-between">
              <Brand tone="paper" />
              <button onClick={() => setOpen(false)} className="rounded-md p-2 text-ink-foreground/70" aria-label="Close menu">
                <X className="size-4" />
              </button>
            </div>
            <nav className="mt-6 space-y-6">
              {NAV.map((group) => (
                <div key={group.group}>
                  <p className="label-mono px-2 text-ink-foreground/40">{group.group}</p>
                  <ul className="mt-2 space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setOpen(false)}
                          activeOptions={{ exact: item.to === "/" || item.to === "/workplace" }}
                          activeProps={{ className: "bg-primary text-primary-foreground" }}
                          inactiveProps={{ className: "text-ink-foreground/70" }}
                          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium"
                        >
                          <item.icon className="size-4" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
