import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { typeHref } from "@/lib/qr-builders";
import { GUIDES, SITE } from "@/lib/qr-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = GUIDES[slug];
  if (!g) return {};
  const url = `/blog/qr-code/${slug}`;
  return {
    title: { absolute: `${g.title} | GanivoTech` },
    description: g.description,
    alternates: { canonical: url },
    openGraph: { title: g.title, description: g.description, url, type: "article", publishedTime: g.date, images: ["/logo.jpg"] },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const g = GUIDES[slug];
  if (!g) notFound();

  return (
    <article className="py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          datePublished: g.date,
          dateModified: g.date,
          mainEntityOfPage: `${SITE}/blog/qr-code/${slug}`,
          author: { "@type": "Organization", name: "Ganivotech", url: SITE },
          publisher: { "@type": "Organization", name: "Ganivotech", url: SITE },
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          crumbs={[["Home", "/"], ["QR Code Guides", "/blog/qr-code"], [g.h1, `/blog/qr-code/${slug}`]]}
        />
        <h1 className="text-4xl font-bold mb-3">{g.h1}</h1>
        <p className="text-xs text-muted mb-8">By Ganivotech &bull; Published <time dateTime={g.date}>{new Date(g.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time></p>
        {g.sections.map((s) => (
          <section key={s.h} className="mb-8">
            <h2 className="text-2xl font-bold mb-3">{s.h}</h2>
            {s.p.map((t) => (
              <p key={t} className="text-muted leading-relaxed mb-3">{t}</p>
            ))}
          </section>
        ))}
        <p className="rounded-2xl border border-border bg-surface p-5 text-sm">
          Try it now:{" "}
          <Link href={g.related ? typeHref(g.related) : "/tools/qr-generator"} className="text-primary underline font-medium">
            {g.related ? "WiFi QR code generator" : "free QR code generator"}
          </Link>
          {" "}&bull;{" "}
          <Link href="/blog/qr-code" className="text-primary underline">more QR code guides</Link>
        </p>
      </div>
    </article>
  );
}
