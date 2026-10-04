import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, FaqList, JsonLd, faqSchema } from "@/components/seo";
import { EXTENSIONS, EXTENSION_LIST, INSTALL_NOTE, INSTALL_STEPS } from "@/lib/extensions";
import { SITE } from "@/lib/qr-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(EXTENSIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const e = EXTENSIONS[slug];
  if (!e) return {};
  const url = `/extensions/${slug}`;
  return {
    title: { absolute: e.title },
    description: e.description,
    alternates: { canonical: url },
    openGraph: { title: e.title, description: e.description, url, type: "website", images: ["/logo.jpg"] },
    twitter: { card: "summary", title: e.title, description: e.description, images: ["/logo.jpg"] },
  };
}

const h2 = "text-2xl font-bold mb-4";

function Section({ title, children, id }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className={h2}>{title}</h2>
      {children}
    </section>
  );
}

export default async function Page({ params }) {
  const { slug } = await params;
  const e = EXTENSIONS[slug];
  if (!e) notFound();
  const others = EXTENSION_LIST.filter((x) => x.slug !== slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: e.name,
          applicationCategory: "BrowserApplication",
          operatingSystem: "Chrome, Chromium-based browsers",
          softwareVersion: e.version,
          description: e.description,
          url: `${SITE}/extensions/${slug}`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          publisher: { "@type": "Organization", name: "Ganivotech", url: SITE },
        }}
      />
      <JsonLd data={faqSchema(e.faqs)} />

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["Chrome Extensions", "/extensions"], [e.name, `/extensions/${slug}`]]} />

          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{e.name}</h1>
            <p className="text-muted max-w-2xl mx-auto mb-6">{e.tagline}</p>
            {e.storeUrl ? (
              <a href={e.storeUrl} target="_blank" rel="noopener" className="inline-block px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">
                Add to Chrome - it&apos;s free
              </a>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                <a href={e.zip} download className="inline-block px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">
                  Download for Chrome (v{e.version})
                </a>
                <a href="#install" className="inline-block px-6 py-3.5 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">
                  How to install
                </a>
              </div>
            )}
            <p className="mt-3 text-xs text-muted">
              Free &bull; {e.works}
              {!e.storeUrl && " • Chrome Web Store listing coming soon"}
            </p>
          </header>

          <Section title="What it does">
            <ul className="grid sm:grid-cols-2 gap-4">
              {e.features.map(([t, d]) => (
                <li key={t} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="font-semibold mb-1.5">{t}</h3>
                  <p className="text-sm text-muted leading-relaxed">{d}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="How to use it">
            <ol className="list-decimal pl-5 space-y-2 text-muted leading-relaxed">
              {e.howToUse.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </Section>

          {!e.storeUrl && (
            <Section title="How to install it" id="install">
              <ol className="space-y-3 mb-4">
                {INSTALL_STEPS.map(([t, d], i) => (
                  <li key={t} className="flex gap-4 rounded-2xl border border-border bg-surface p-4">
                    <span className="shrink-0 w-8 h-8 rounded-full gradient-bg-orange text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <p className="text-sm text-muted leading-relaxed"><strong className="text-foreground">{t}.</strong> {d}</p>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-muted mb-3">{INSTALL_NOTE}</p>
              <a href={e.zip} download className="text-sm text-primary underline font-medium">
                Download {e.zip.split("/").pop()}
              </a>{" "}
              <span className="text-sm text-muted">(about {e.sizeKB} KB)</span>
            </Section>
          )}

          <Section title="Permissions it asks for, and why">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left">
                  <tr><th className="p-3 font-semibold">Permission</th><th className="p-3 font-semibold">Why</th></tr>
                </thead>
                <tbody>
                  {e.permissions.map(([p, why]) => (
                    <tr key={p} className="border-t border-border align-top">
                      <td className="p-3 font-mono text-xs whitespace-nowrap">{p}</td>
                      <td className="p-3 text-muted">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Privacy and responsible use">
            <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed">
              {e.privacy.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <p className="mt-3 text-sm text-muted">
              More in our <Link href="/privacy" className="text-primary underline">privacy policy</Link>.
            </p>
          </Section>

          <Section title="Known limitations">
            <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed">
              {e.limitations.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Section>

          <Section title="Troubleshooting">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left">
                  <tr><th className="p-3 font-semibold">If you see</th><th className="p-3 font-semibold">Try this</th></tr>
                </thead>
                <tbody>
                  {e.troubleshooting.map(([m, f]) => (
                    <tr key={m} className="border-t border-border align-top">
                      <td className="p-3 font-medium">{m}</td>
                      <td className="p-3 text-muted">{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Frequently asked questions">
            <FaqList faqs={e.faqs} />
          </Section>

          {e.notice && <p className="mb-10 text-xs text-muted">{e.notice}</p>}

          <section className="rounded-2xl border border-border bg-surface p-6 text-sm">
            <h2 className="font-bold mb-3">More free extensions</h2>
            <ul className="space-y-1.5 mb-3">
              {others.map((x) => (
                <li key={x.slug}>
                  <Link href={`/extensions/${x.slug}`} className="text-primary underline">{x.name}</Link>{" "}
                  <span className="text-muted">- {x.tagline}</span>
                </li>
              ))}
            </ul>
            <Link href="/extensions" className="text-primary underline font-medium">See all Chrome extensions</Link>
          </section>
        </div>
      </section>
    </>
  );
}
