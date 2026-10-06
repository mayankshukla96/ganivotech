import { notFound } from "next/navigation";
import ReportLink from "@/components/ReportLink";
import { dbConfigured, q } from "@/lib/analytics-db";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Links | GanivoTech" }, robots: { index: false, follow: false } };

export default async function Page({ params }) {
  const { alias } = await params;
  if (!dbConfigured() || !/^[a-z0-9-]{3,32}$/i.test(alias)) notFound();
  const [row] = await q("SELECT page, disabled, expires FROM short_links WHERE alias = $1 AND page IS NOT NULL", [alias.toLowerCase()]);
  if (!row) notFound();
  if (row.disabled || (row.expires && new Date(row.expires) < new Date())) {
    return <section className="py-20 text-center px-4"><h1 className="text-2xl font-bold mb-2">This page is switched off</h1><p className="text-muted">Its owner turned it off, or it expired, or it was reported as unsafe.</p></section>;
  }
  const { title, desc, links } = row.page;
  return (
    <section className="py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-2 break-words">{title}</h1>
        {desc && <p className="text-muted mb-6 break-words">{desc}</p>}
        <ul className="space-y-3 mt-6">
          {links.map((l, i) => (
            <li key={i}>
              <a href={l.url} rel="noopener noreferrer nofollow" className="block rounded-xl border border-border bg-surface px-4 py-3.5 hover:border-primary transition-colors">
                <span className="block font-semibold break-words">{l.label}</span>
                <span className="block text-xs text-muted break-all">{new URL(l.url).hostname.replace(/^www\./, "")}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-muted">Made with <a href="/tools/qr-generator/multiple-links" className="underline">Ganivotech</a>. Only open links from people you trust.</p>
        <ReportLink alias={alias.toLowerCase()} />
      </div>
    </section>
  );
}
