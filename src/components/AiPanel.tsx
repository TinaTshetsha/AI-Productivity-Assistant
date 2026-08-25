import { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Eraser, Pencil, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AiDisclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-3 flex gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>
        {children ??
          "AI-generated content should be reviewed before use. BusinessConnect AI may make mistakes. Verify important information before making business, financial, legal or other consequential decisions."}
      </span>
    </p>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-bc text-sm leading-relaxed">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

export type AiPanelProps = {
  title: string;
  loading: boolean;
  error: string | null;
  output: string;
  onOutputChange: (next: string) => void;
  onRegenerate?: () => void;
  onClear?: () => void;
  emptyHint: string;
  disclaimer?: ReactNode;
  extraActions?: ReactNode;
};

export function AiPanel({
  title,
  loading,
  error,
  output,
  onOutputChange,
  onRegenerate,
  onClear,
  emptyHint,
  disclaimer,
  extraActions,
}: AiPanelProps) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="board flex min-h-[420px] flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="label-mono text-primary">{title}</h2>
        {output && !loading && (
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditing((v) => !v)}>
              <Pencil className="size-3.5" /> {editing ? "Preview" : "Edit"}
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy"}
            </Button>
            {onRegenerate && (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={onRegenerate}>
                <RefreshCw className="size-3.5" /> Regenerate
              </Button>
            )}
            {onClear && (
              <Button size="sm" variant="ghost" className="gap-1.5" onClick={onClear}>
                <Eraser className="size-3.5" /> Clear
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex-1">
        {loading && (
          <div className="space-y-2" aria-live="polite">
            <p className="label-mono text-muted-foreground">BusinessConnect AI is working…</p>
            {[92, 80, 86, 60].map((w) => (
              <div key={w} className="h-3 animate-pulse rounded bg-secondary" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-3 text-sm text-destructive" role="alert">
            <p className="label-mono">Something went wrong</p>
            <p className="mt-1.5 leading-relaxed">{error}</p>
          </div>
        )}

        {!loading && !error && !output && <p className="text-sm text-muted-foreground">{emptyHint}</p>}

        {!loading && !error && output && (
          <>
            {editing ? (
              <Textarea value={output} onChange={(e) => onOutputChange(e.target.value)} className="min-h-[320px] font-mono text-xs" />
            ) : (
              <Markdown>{output}</Markdown>
            )}
            {extraActions && <div className="mt-4 flex flex-wrap gap-2">{extraActions}</div>}
          </>
        )}
      </div>

      <AiDisclaimer>{disclaimer}</AiDisclaimer>
    </section>
  );
}
