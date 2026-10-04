import Link from "next/link";
import { notFound } from "next/navigation";
import QRGenerator from "@/components/QRGenerator";
import { Breadcrumbs, FaqList, JsonLd, appSchema, faqSchema } from "@/components/seo";
import { QR_TYPES, typeHref } from "@/lib/qr-builders";
import { GUIDES, TYPE_PAGES } from "@/lib/qr-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(TYPE_PAGES).map((type) => ({ type }));
}

export async function generateMetadata({ params }) {
  const { type } = await params;
  const t = TYPE_PAGES[type];
  if (!t) return {};
  const url = typeHref(type);
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: url },
    openGraph: { title: t.title, description: t.description, url, type: "website", images: ["/logo.jpg"] },
    twitter: { card: "summary", title: t.title, description: t.description, images: ["/logo.jpg"] },
  };
}

const h2 = "text-2xl font-bold mb-4";

export default async function Page({ params }) {
  const { type } = await params;
  const t = TYPE_PAGES[type];
  if (!t) notFound();
  const label = QR_TYPES[type].label;
  const guide = Object.entries(GUIDES).find(([, g]) => g.related === type);

  return (
    <>
      <JsonLd data={appSchema(t.h1.replace("Free ", ""), typeHref(type), t.description)} />
      <JsonLd data={faqSchema(t.faqs)} />

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            crumbs={[["Home", "/"], ["QR Code Generator", "/tools/qr-generator"], [`${label} QR Code`, typeHref(type)]]}
          />
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t.h1}</h1>
            <p className="text-muted max-w-2xl mx-auto">{t.intro}</p>
          </header>
          <QRGenerator type={type} />
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="mb-12">
          <h2 className={h2}>How to Create a {label} QR Code</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted leading-relaxed">
            {t.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className={h2}>Where to Use a {label} QR Code</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed">
            {t.uses.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={h2}>{label} QR Code FAQs</h2>
          <FaqList faqs={t.faqs} />
        </section>

        <section>
          <h2 className={h2}>Related QR Code Generators</h2>
          <p className="text-muted leading-relaxed mb-4">
            Need something else? Try our{" "}
            <Link href="/tools/qr-generator" className="text-primary underline">free QR code generator</Link>{" "}
            for website links, or choose another type:
          </p>
          <ul className="flex flex-wrap gap-2 mb-6">
            {Object.keys(TYPE_PAGES).filter((k) => k !== type).map((k) => (
              <li key={k}>
                <Link href={typeHref(k)} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">
                  {QR_TYPES[k].label} QR code
                </Link>
              </li>
            ))}
          </ul>
          {guide && (
            <p className="text-sm">
              Guide: <Link href={`/blog/qr-code/${guide[0]}`} className="text-primary underline">{guide[1].title}</Link>
            </p>
          )}
        </section>
      </article>
    </>
  );
}
