import Link from "next/link";
import { GUIDES } from "@/lib/qr-content";
import { PDF_GUIDES } from "@/lib/pdf-content";
import { VCF_GUIDES } from "@/lib/vcf-content";

const date = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// Every card on this page is a real article. New guides appear here automatically.
const GROUPS = [
  { name: "Software and apps", href: null, items: [{ href: "/blog/app-development-cost-in-jaipur", title: "App Development Cost in Jaipur (2026)", description: "What a website, app or custom software costs, what changes the price, and how to compare quotes.", date: "2026-10-22" }] },
  { name: "QR codes", href: "/blog/qr-code", items: Object.entries(GUIDES).map(([s, g]) => ({ href: `/blog/qr-code/${s}`, ...g })) },
  { name: "PDF", href: "/blog/pdf-maker", items: Object.entries(PDF_GUIDES).map(([s, g]) => ({ href: `/blog/pdf-maker/${s}`, ...g })) },
  { name: "Contacts and VCF files", href: "/blog/vcf-maker", items: Object.entries(VCF_GUIDES).map(([s, g]) => ({ href: `/blog/vcf-maker/${s}`, ...g })) },
];

export default function Blog() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Guides</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Guides and <span className="gradient-text">how-tos</span></h1>
          <p className="text-lg text-muted leading-relaxed">Plain-language guides from the Ganivotech team: how to use our free tools, and what software and apps cost.</p>
        </header>
        {GROUPS.map((g) => (
          <div key={g.name} className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl font-bold">{g.name}</h2>
              {g.href && <Link href={g.href} className="text-sm font-semibold text-primary hover:underline">All {g.name} guides &rarr;</Link>}
            </div>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {g.items.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="flex flex-col h-full rounded-2xl border border-border bg-surface p-6 hover:border-primary transition-colors">
                    <span className="font-bold mb-2 leading-snug">{a.title}</span>
                    <span className="text-sm text-muted leading-relaxed mb-4">{a.description}</span>
                    <span className="mt-auto text-xs text-muted">{date(a.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
