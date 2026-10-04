import Link from "next/link";
import { SITE } from "@/lib/qr-content";

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const appSchema = (name, path, description) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  url: `${SITE}${path}`,
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  publisher: { "@type": "Organization", name: "Ganivotech", url: SITE },
});

// crumbs: [[label, path], ...] (last one is the current page)
export function Breadcrumbs({ crumbs }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="text-xs text-muted mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map(([name, path], i) => (
            <li key={path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < crumbs.length - 1 ? (
                <Link href={path} className="hover:text-primary">{name}</Link>
              ) : (
                <span aria-current="page">{name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="space-y-3">
      {faqs.map(([q, a]) => (
        <details key={q} className="group rounded-xl border border-border bg-surface p-4">
          <summary className="cursor-pointer font-semibold text-sm list-none flex justify-between gap-4">
            {q}
            <span aria-hidden="true" className="text-primary group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-3 text-sm text-muted leading-relaxed">{a}</p>
        </details>
      ))}
    </div>
  );
}
