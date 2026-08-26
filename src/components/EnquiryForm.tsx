import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addEnquiry } from "@/lib/store";
import type { Business } from "@/data/sa";

export function EnquiryForm({ business }: { business: Business }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState(business.services[0] ?? "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <section className="board mt-4 p-5">
        <h2 className="label-mono text-xs text-primary">Enquiry sent</h2>
        <p className="mt-3 text-sm text-foreground/85">
          Thanks {name || "there"} — your enquiry has been sent to {business.name}. They typically reply on the contact
          details you provided.
        </p>
        <Button size="sm" variant="outline" className="mt-4" onClick={() => setSent(false)}>
          Send another enquiry
        </Button>
      </section>
    );
  }

  return (
    <section className="board mt-4 p-5">
      <h2 className="label-mono text-xs text-primary">Send an enquiry</h2>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !contact.trim() || !message.trim()) {
            toast.error("Please add your name, contact details and a message.");
            return;
          }
          addEnquiry({
            businessId: business.id,
            businessName: business.name,
            type: "message",
            name: name.trim(),
            contact: contact.trim(),
            service,
            message: message.trim(),
            preferredDate: "",
            preferredTime: "",
            budget: "",
          });
          toast.success(`Enquiry sent to ${business.name}`);
          setSent(true);
          setMessage("");
        }}
      >
        <label className="text-sm">
          <span className="label-mono text-muted-foreground">Your name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="Thandi Mokoena" />
        </label>
        <label className="text-sm">
          <span className="label-mono text-muted-foreground">Phone or email</span>
          <Input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1.5"
            placeholder="082 000 0000"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="label-mono text-muted-foreground">Service needed</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            {business.services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="label-mono text-muted-foreground">Message</span>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 min-h-24"
            placeholder="Describe what you need, where you are and when you need it."
          />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" className="gap-1.5">
            <Send className="size-4" /> Send enquiry
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Demonstration build — enquiries are stored on this device only and no real business is contacted.
          </p>
        </div>
      </form>
    </section>
  );
}
