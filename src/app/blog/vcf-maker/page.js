import Link from "next/link";
import { Breadcrumbs } from "@/components/seo";
import { VCF_GUIDES } from "@/lib/vcf-content";

const TITLE = "VCF & Contact Guides – Tips and How-To Articles | GanivoTech";
const DESC = "Practical guides on creating VCF files, importing contacts on Android and iPhone, and managing contact lists.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/blog/vcf-maker" },
  openGraph: { title: TITLE, description: DESC, url: "/blog/vcf-maker", type: "website", images: ["/logo.jpg"] },
};

export default function Page() {
  const entries = Object.entries(VCF_GUIDES);
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={[["Home", "/"], ["Blog", "/blog"], ["VCF Guides", "/blog/vcf-maker"]]} />
        <h1 className="text-4xl font-bold mb-4">VCF & Contact Guides</h1>
        <p className="text-muted mb-8">
          Practical how-to articles for importing, exporting and managing contacts. Try our{" "}
          <Link href="/tools/vcf-maker" className="text-primary underline">free VCF maker</Link>.
        </p>
        {entries.length > 0 ? (
          <ul className="space-y-4">
            {entries.map(([slug, g]) => (
              <li key={slug}>
                <Link href={`/blog/vcf-maker/${slug}`} className="block rounded-2xl border border-border bg-surface p-5 hover:border-primary transition-colors">
                  <h2 className="text-lg font-semibold mb-1">{g.title}</h2>
                  <p className="text-sm text-muted">{g.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Guides coming soon. In the meantime, try the <Link href="/tools/vcf-maker" className="text-primary underline">VCF maker</Link>.</p>
        )}
      </div>
    </section>
  );
}
