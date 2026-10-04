import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { VCF_GUIDES } from "@/lib/vcf-content";
import { SITE } from "@/lib/qr-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VCF_GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = VCF_GUIDES[slug];
  if (!g) return {};
  const url = `/blog/vcf-maker/${slug}`;
  return {
    title: { absolute: `${g.title} | GanivoTech` },
    description: g.description,
    alternates: { canonical: url },
    openGraph: { title: g.title, description: g.description, url, type: "article", publishedTime: g.date, images: ["/logo.jpg"] },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const g = VCF_GUIDES[slug];
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
          mainEntityOfPage: `${SITE}/blog/vcf-maker/${slug}`,
          author: { "@type": "Organization", name: "Ganivotech", url: SITE },
          publisher: { "@type": "Organization", name: "Ganivotech", url: SITE },
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          crumbs={[["Home", "/"], ["VCF Guides", "/blog/vcf-maker"], [g.h1, `/blog/vcf-maker/${slug}`]]}
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
          <Link href="/tools/vcf-maker" className="text-primary underline font-medium">free VCF maker</Link>
          {" "}&bull;{" "}
          <Link href="/blog/vcf-maker" className="text-primary underline">more VCF guides</Link>
        </p>
      </div>
    </article>
  );
}
