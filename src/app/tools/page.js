import Link from "next/link";
import { Breadcrumbs } from "@/components/seo";
import { TOOLS } from "@/lib/tools-content";

const TITLE = "Free Online Tools – QR, Photo Resizer, OCR, PDF | GanivoTech";
const DESC = "Free tools that run in your browser: QR codes, photo and signature resizer, compress to exact KB, OCR to Excel and Word, VCF and PDF makers. No signup.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/tools" },
  openGraph: { title: TITLE, description: DESC, url: "/tools", type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

export default function Page() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={[["Home", "/"], ["Free Tools", "/tools"]]} />
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Free Online <span className="gradient-text">Tools</span></h1>
          <p className="text-muted max-w-2xl mx-auto">Simple tools for everyday jobs. They run in your browser, so your files and details are never uploaded. No account needed.</p>
        </header>
        <ul className="grid sm:grid-cols-2 gap-5 mb-12">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="flex flex-col h-full rounded-2xl border border-border bg-surface p-6 hover:border-primary transition-colors">
                <h2 className="text-xl font-bold mb-2">{t.name}</h2>
                <p className="text-sm text-muted leading-relaxed mb-3">{t.blurb}</p>
                <span className="mt-auto text-sm font-semibold text-primary">Open tool &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          Prefer to work inside your browser? See our <Link href="/extensions" className="text-primary underline">free Chrome extensions</Link>.
        </p>
      </div>
    </section>
  );
}
