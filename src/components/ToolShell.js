import Link from "next/link";
import WorkWithUs from "@/components/WorkWithUs";
import { Breadcrumbs, FaqList, JsonLd, appSchema, faqSchema } from "@/components/seo";
import { TOOLS } from "@/lib/tools-content";

export const toolMetadata = (t) => ({
  title: { absolute: t.title },
  description: t.description,
  alternates: { canonical: t.path },
  openGraph: { title: t.title, description: t.description, url: t.path, type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: t.title, description: t.description, images: ["/logo.jpg"] },
});

const h2 = "text-2xl font-bold mb-4";

export default function ToolShell({ t, crumbs, children, extra }) {
  return (
    <>
      <JsonLd data={appSchema(t.h1, t.path, t.description)} />
      <JsonLd data={faqSchema(t.faqs)} />
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ...crumbs]} />
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t.h1}</h1>
            <p className="text-muted max-w-2xl mx-auto">{t.intro}</p>
            <p className="mt-3 text-sm font-medium text-primary">Free &bull; No signup &bull; Your files never leave your device</p>
          </header>
          {children}
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="mb-12">
          <h2 className={h2}>How to use it</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted leading-relaxed">
            {t.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>
        <section className="mb-12">
          <h2 className={h2}>Tips for the best result</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed">
            {t.tips.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
        {extra}
        <section className="mb-12">
          <h2 className={h2}>Frequently asked questions</h2>
          <FaqList faqs={t.faqs} />
        </section>
        <section>
          <h2 className={h2}>More free tools</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {TOOLS.filter((x) => x.href !== t.path).map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="block h-full rounded-xl border border-border bg-surface p-4 hover:border-primary transition-colors">
                  <span className="font-semibold text-sm">{x.name}</span>
                  <span className="block text-xs text-muted mt-1">{x.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <WorkWithUs />
    </>
  );
}
