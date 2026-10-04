import Link from "next/link";
import { Breadcrumbs } from "@/components/seo";
import { GUIDES } from "@/lib/qr-content";

const TITLE = "QR Code Guides – How-To Articles and Tips | GanivoTech";
const DESC = "Practical guides on creating and using QR codes: WiFi QR codes, static vs dynamic codes and more.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/blog/qr-code" },
  openGraph: { title: TITLE, description: DESC, url: "/blog/qr-code", type: "website", images: ["/logo.jpg"] },
};

export default function Page() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={[["Home", "/"], ["Blog", "/blog"], ["QR Code Guides", "/blog/qr-code"]]} />
        <h1 className="text-4xl font-bold mb-4">QR Code Guides</h1>
        <p className="text-muted mb-8">
          Practical how-to articles for people who make and print QR codes. Ready to make one? Use our{" "}
          <Link href="/tools/qr-generator" className="text-primary underline">free QR code generator</Link>.
        </p>
        <ul className="space-y-4">
          {Object.entries(GUIDES).map(([slug, g]) => (
            <li key={slug}>
              <Link href={`/blog/qr-code/${slug}`} className="block rounded-2xl border border-border bg-surface p-5 hover:border-primary transition-colors">
                <h2 className="text-lg font-semibold mb-1">{g.title}</h2>
                <p className="text-sm text-muted">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
