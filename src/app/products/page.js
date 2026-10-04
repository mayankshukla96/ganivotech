import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { PRODUCT_LIST } from "@/lib/products";
import { SITE } from "@/lib/qr-content";

const TITLE = "Premium Products | GanivoTech";
const DESC = "Products and managed plans from Ganivotech: SellerSync OS for marketplace sellers and Digital Desk, a managed IT and digital plan for small businesses.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/products" },
  openGraph: { title: TITLE, description: DESC, url: "/products", type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ganivotech premium products",
          itemListElement: PRODUCT_LIST.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: `${SITE}${p.href}` })),
        }}
      />
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["Premium Products", "/products"]]} />
          <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Premium <span className="gradient-text">Products</span></h1>
            <p className="text-muted max-w-2xl mx-auto">Software and managed plans from Ganivotech, for businesses that have outgrown spreadsheets and ad-hoc IT help. Our free tools and Chrome extensions stay free.</p>
          </header>

          <ul className="grid sm:grid-cols-2 gap-5 mb-10">
            {PRODUCT_LIST.map((p) => (
              <li key={p.slug}>
                <Link href={p.href} className="flex flex-col h-full rounded-2xl border border-border bg-surface p-6 hover:border-primary transition-colors">
                  <span className="self-start px-2.5 py-1 mb-3 rounded-md bg-primary/10 text-primary text-xs font-semibold">{p.status}</span>
                  <h2 className="text-2xl font-bold mb-1">{p.name}</h2>
                  <p className="font-semibold text-sm mb-2">{p.tagline}</p>
                  <p className="text-sm text-muted leading-relaxed mb-4">{p.blurb}</p>
                  <span className="mt-auto text-sm font-semibold text-primary">Learn more &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-sm text-muted">
            More premium products will be added here. Want to talk about a custom solution for your business? <Link href="/contact" className="text-primary underline">Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
