import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { BUSINESSES, CATEGORIES } from "@/data/sa";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Phone, Mail, MapPin, Globe, MessageCircle, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/business/$slug")({
  loader: ({ params }) => {
    const business = BUSINESSES.find((b) => b.slug === params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Business not found — BusinessConnect SA" }, { name: "robots", content: "noindex" }] };
    }
    const b = loaderData.business;
    const title = `${b.name} — ${b.city}, ${b.province} | BusinessConnect SA`;
    const description = `${b.name} in ${b.suburb}, ${b.city}. ${b.description}`.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BusinessProfile,
});

function BusinessProfile() {
  const { business: b } = Route.useLoaderData();
  const category = CATEGORIES.find((c) => c.id === b.categoryId);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link to="/" className="label-mono inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to search
      </Link>

      <header className="mt-6">
        <p className="label-mono text-xs text-primary">{category?.name ?? b.businessType}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{b.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <MapPin className="mr-1 inline size-3.5" />
          {b.address}, {b.suburb}, {b.city}, {b.province} {b.postalCode}
        </p>
      </header>

      <p className="mt-6 leading-relaxed text-foreground/85">{b.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild size="sm" className="gap-1.5">
          <a href={`tel:${b.phone.replace(/\s/g, "")}`}>
            <Phone className="size-3.5" /> {b.phone}
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <a href={`mailto:${b.email}`}>
            <Mail className="size-3.5" /> Email
          </a>
        </Button>
        {b.whatsapp && (
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          </Button>
        )}
        {b.website && (
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <a href={b.website} target="_blank" rel="noreferrer">
              <Globe className="size-3.5" /> Website
            </a>
          </Button>
        )}
      </div>

      <section className="board mt-8 p-5">
        <h2 className="label-mono text-xs text-primary">Services</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {b.services.map((s) => (
            <li key={s} className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="board mt-4 p-5">
        <h2 className="label-mono text-xs text-primary">Opening hours</h2>
        <dl className="mt-3 space-y-1 text-sm">
          {Object.entries(b.openingHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between gap-4">
              <dt className="capitalize text-muted-foreground">{day}</dt>
              <dd>{hours}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EnquiryForm business={b} />

      <p className="mt-6 text-xs text-muted-foreground">
        Demo listing — details are illustrative sample data.
      </p>
    </div>
  );
}
