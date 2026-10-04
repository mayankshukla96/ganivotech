import Link from "next/link";
import { Breadcrumbs } from "@/components/seo";
import { PDF_GUIDES } from "@/lib/pdf-content";

const TITLE = "PDF Guides – Tips and How-To Articles | GanivoTech";
const DESC = "Practical guides on creating PDFs from images and text files, choosing page sizes, and printing tips.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/blog/pdf-maker" },
  openGraph: { title: TITLE, description: DESC, url: "/blog/pdf-maker", type: "website", images: ["/logo.jpg"] },
};

export default function Page() {
  const entries = Object.entries(PDF_GUIDES);
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={[["Home", "/"], ["Blog", "/blog"], ["PDF Guides", "/blog/pdf-maker"]]} />
        <h1 className="text-4xl font-bold mb-4">PDF Guides</h1>
        <p className="text-muted mb-8">
          Practical how-to articles for people who create PDFs from images and documents. Try our{" "}
          <Link href="/tools/pdf-maker" className="text-primary underline">free PDF maker</Link>.
        </p>
        {entries.length > 0 ? (
          <ul className="space-y-4">
            {entries.map(([slug, g]) => (
              <li key={slug}>
                <Link href={`/blog/pdf-maker/${slug}`} className="block rounded-2xl border border-border bg-surface p-5 hover:border-primary transition-colors">
                  <h2 className="text-lg font-semibold mb-1">{g.title}</h2>
                  <p className="text-sm text-muted">{g.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Guides coming soon. In the meantime, try the <Link href="/tools/pdf-maker" className="text-primary underline">PDF maker</Link>.</p>
        )}
      </div>
    </section>
  );
}
