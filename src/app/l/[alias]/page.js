import { notFound } from "next/navigation";
import ReportLink from "@/components/ReportLink";
import { dbConfigured, q } from "@/lib/analytics-db";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Links | GanivoTech" }, robots: { index: false, follow: false } };

const btn = "flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-sm transition-opacity hover:opacity-90";

// A digital visiting card: the page a smart card's QR code opens.
function SmartCard({ alias, c }) {
  const actions = [
    ["Save contact", `/l/${alias}/contact.vcf`, true],
    c.phone && ["Call", `tel:+${c.phone}`],
    c.whatsapp && ["WhatsApp", `https://wa.me/${c.whatsapp}`],
    c.email && ["Email", `mailto:${c.email}`],
    c.website && ["Website", c.website],
    c.address && ["Directions", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`],
  ].filter(Boolean);
  return (
    <section className="py-10">
      <div className="max-w-sm mx-auto px-4">
        <div className="rounded-3xl overflow-hidden border border-border bg-surface shadow-sm">
          <div className="px-6 pt-8 pb-6 text-center text-white" style={{ background: c.color }}>
            {c.logo && <img src={c.logo} alt="" className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white object-contain p-1" />}
            <h1 className="text-2xl font-bold break-words">{c.name}</h1>
            {c.title && <p className="text-sm opacity-90 mt-1 break-words">{c.title}</p>}
            {c.company && <p className="text-sm font-semibold mt-1 break-words">{c.company}</p>}
          </div>
          <div className="p-5">
            {c.tagline && <p className="text-sm text-muted text-center mb-4 break-words">{c.tagline}</p>}
            <div className="grid grid-cols-2 gap-2">
              {actions.map(([label, href, primary]) => (
                <a key={label} href={href} rel="noopener noreferrer nofollow" className={`${btn} ${primary ? "col-span-2 gradient-bg-orange text-white" : "border border-border hover:border-primary"}`}>{label}</a>
              ))}
            </div>
            {c.address && <p className="mt-4 text-xs text-muted text-center break-words">{c.address}</p>}
          </div>
        </div>
        <p className="mt-6 text-xs text-muted text-center">Made with the free <a href="/tools/visiting-card-maker" className="underline">Visiting Card Maker</a> at Ganivotech.</p>
        <div className="text-center"><ReportLink alias={alias} /></div>
      </div>
    </section>
  );
}

export default async function Page({ params }) {
  const { alias } = await params;
  if (!dbConfigured() || !/^[a-z0-9-]{3,32}$/i.test(alias)) notFound();
  const [row] = await q("SELECT page, disabled, expires FROM short_links WHERE alias = $1 AND page IS NOT NULL", [alias.toLowerCase()]);
  if (!row) notFound();
  if (row.disabled || (row.expires && new Date(row.expires) < new Date())) {
    return <section className="py-20 text-center px-4"><h1 className="text-2xl font-bold mb-2">This page is switched off</h1><p className="text-muted">Its owner turned it off, or it expired, or it was reported as unsafe.</p></section>;
  }
  if (row.page.kind === "card") return <SmartCard alias={alias.toLowerCase()} c={row.page} />;
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
