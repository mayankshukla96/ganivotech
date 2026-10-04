import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { EXTENSION_LIST } from "@/lib/extensions";
import { SITE } from "@/lib/qr-content";

const TITLE = "Free Chrome Extensions by GanivoTech – QR Scanner, WhatsApp Tools & More";
const DESC =
  "Free, private Chrome extensions from Ganivotech: make and scan QR codes, export WhatsApp Web group numbers to CSV and more. No account, runs in your browser.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/extensions" },
  openGraph: { title: TITLE, description: DESC, url: "/extensions", type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ganivotech Chrome extensions",
          itemListElement: EXTENSION_LIST.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: e.name,
            url: `${SITE}/extensions/${e.slug}`,
          })),
        }}
      />
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["Chrome Extensions", "/extensions"]]} />
          <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Free Chrome <span className="gradient-text">Extensions</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto">
              Small, focused tools that do one job well. They run in your browser, ask for as few permissions as possible, and never need an account.
            </p>
          </header>

          <ul className="grid sm:grid-cols-2 gap-5 mb-14">
            {EXTENSION_LIST.map((e) => (
              <li key={e.slug}>
                <Link href={`/extensions/${e.slug}`} className="flex flex-col h-full rounded-2xl border border-border bg-surface p-6 hover:border-primary transition-colors">
                  <span className="self-start px-2.5 py-1 mb-3 rounded-md bg-primary/10 text-primary text-xs font-semibold">{e.badge}</span>
                  <h2 className="text-xl font-bold mb-2">{e.name}</h2>
                  <p className="text-sm text-muted leading-relaxed mb-4">{e.tagline}</p>
                  <p className="mt-auto text-xs text-muted">
                    Free &bull; v{e.version} &bull; {e.storeUrl ? "Chrome Web Store" : `Zip download (${e.sizeKB} KB)`}
                  </p>
                  <span className="mt-3 text-sm font-semibold text-primary">View details &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>

          <section className="rounded-2xl border border-border bg-surface p-6 mb-6">
            <h2 className="text-lg font-bold mb-2">How installing works</h2>
            <p className="text-sm text-muted leading-relaxed">
              Download the zip, extract it, open <code className="px-1 rounded bg-background">chrome://extensions</code>, turn on Developer mode and choose Load unpacked. Each extension page has the full steps, the exact permissions it asks for and why, and how your data is handled. Edge and Brave work the same way. Extensions will move to the Chrome Web Store as they are published.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 text-sm">
            <p className="mb-2">
              <strong>Have an idea for an extension?</strong> Tell us from the Suggest tab inside Ganivotech QR Studio, or use the <Link href="/contact" className="text-primary underline">contact page</Link>.
            </p>
            <p className="text-muted">
              Looking for something on the web instead? Try the <Link href="/tools/qr-generator" className="text-primary underline">free QR code generator</Link>, <Link href="/tools/vcf-maker" className="text-primary underline">VCF Maker</Link> and <Link href="/tools/pdf-maker" className="text-primary underline">PDF Maker</Link>.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
