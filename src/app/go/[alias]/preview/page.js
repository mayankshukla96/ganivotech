import { notFound } from "next/navigation";
import ReportLink from "@/components/ReportLink";
import { dbConfigured, q } from "@/lib/analytics-db";

export const dynamic = "force-dynamic";
export const metadata = { title: { absolute: "Check this link before you open it | GanivoTech" }, robots: { index: false, follow: false } };

export default async function Page({ params }) {
  const { alias } = await params;
  if (!dbConfigured() || !/^[a-z0-9-]{3,32}$/i.test(alias)) notFound();
  const [link] = await q("SELECT url, title, disabled, expires FROM short_links WHERE alias = $1", [alias.toLowerCase()]);
  if (!link) notFound();
  const off = link.disabled || (link.expires && new Date(link.expires) < new Date());
  const host = new URL(link.url).hostname.replace(/^www\./, "");

  return (
    <section className="py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Check before you open</h1>
        <p className="text-muted mb-6">This short link, <strong>ganivotech.com/go/{alias.toLowerCase()}</strong>, goes to:</p>
        <div className="rounded-2xl border border-border bg-surface p-5 text-left">
          {link.title && <p className="text-sm text-muted mb-1">{link.title}</p>}
          <p className="text-2xl font-bold break-all">{host}</p>
          <p className="text-xs text-muted break-all mt-2">{link.url}</p>
        </div>
        {off ? (
          <p className="mt-6 text-sm text-muted">This link is switched off or has expired, so it will not open.</p>
        ) : (
          <a href={link.url} rel="noopener noreferrer nofollow" className="inline-block mt-6 px-6 py-3 rounded-lg gradient-bg-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Continue to {host}
          </a>
        )}
        <p className="mt-6 text-xs text-muted">Only open links from people you trust, and never enter bank or OTP details after clicking a link you did not expect.</p>
        <ReportLink alias={alias.toLowerCase()} />
      </div>
    </section>
  );
}
