import { authConfigured, isAdmin } from "@/lib/admin-auth";
import { dbConfigured, q } from "@/lib/analytics-db";
import AdminLinkActions from "@/components/AdminLinkActions";
import { bucketKeys, countryName, flag, fmtIST, istDateString, resolveRange } from "@/lib/analytics-utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: { absolute: "Website Analytics" },
  robots: { index: false, follow: false },
};

const n = (v) => Number(v || 0).toLocaleString("en-IN");
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "0%");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function label(key, gran) {
  if (gran === "hour") return key.slice(11);
  if (gran === "month") return `${MONTHS[+key.slice(5, 7) - 1]} ${key.slice(2, 4)}`;
  return `${key.slice(8, 10)} ${MONTHS[+key.slice(5, 7) - 1]}`;
}

async function load(range) {
  const w = "ts >= $1 AND ts < $2";
  const p = [range.from, range.to];
  const fmt = { hour: "YYYY-MM-DD HH24:00", day: "YYYY-MM-DD", month: "YYYY-MM" }[range.gran];
  const [totals, bounce, series, pages, entries, exits, flows, sources, mediums, countries, cities, devices, browsers, systems, recent, ideas, leads, shorts] = await Promise.all([
    q(`SELECT count(*)::int views, count(DISTINCT vid)::int visitors FROM pageviews WHERE ${w}`, p),
    q(`SELECT count(*)::int n FROM (SELECT vid FROM pageviews WHERE ${w} GROUP BY vid HAVING count(*) = 1) t`, p),
    q(`SELECT to_char(date_trunc('${range.gran}', ts AT TIME ZONE 'Asia/Kolkata'), '${fmt}') k, count(*)::int views, count(DISTINCT vid)::int visitors FROM pageviews WHERE ${w} GROUP BY 1`, p),
    q(`SELECT path, count(*)::int views, count(DISTINCT vid)::int visitors FROM pageviews WHERE ${w} GROUP BY path ORDER BY views DESC LIMIT 15`, p),
    q(`SELECT path, count(*)::int n FROM (SELECT DISTINCT ON (vid) vid, path FROM pageviews WHERE ${w} ORDER BY vid, ts, id) t GROUP BY path ORDER BY n DESC LIMIT 10`, p),
    q(`SELECT path, count(*)::int n FROM (SELECT DISTINCT ON (vid) vid, path FROM pageviews WHERE ${w} ORDER BY vid, ts DESC, id DESC) t GROUP BY path ORDER BY n DESC LIMIT 10`, p),
    q(`WITH x AS (SELECT vid, path, lag(path) OVER (PARTITION BY vid ORDER BY ts, id) prev FROM pageviews WHERE ${w})
       SELECT prev, path, count(*)::int n FROM x WHERE prev IS NOT NULL AND prev <> path GROUP BY 1, 2 ORDER BY n DESC LIMIT 15`, p),
    q(`SELECT source, medium, count(*)::int n, count(DISTINCT vid)::int visitors FROM pageviews WHERE ${w} AND source <> 'internal' GROUP BY 1, 2 ORDER BY n DESC LIMIT 15`, p),
    q(`SELECT medium, count(*)::int n FROM pageviews WHERE ${w} AND medium <> 'internal' GROUP BY 1 ORDER BY n DESC`, p),
    q(`SELECT country, count(*)::int views, count(DISTINCT vid)::int visitors FROM pageviews WHERE ${w} GROUP BY 1 ORDER BY views DESC LIMIT 15`, p),
    q(`SELECT country, region, city, count(*)::int views, count(DISTINCT vid)::int visitors FROM pageviews WHERE ${w} AND city IS NOT NULL GROUP BY 1, 2, 3 ORDER BY views DESC LIMIT 20`, p),
    q(`SELECT device k, count(*)::int n FROM pageviews WHERE ${w} GROUP BY 1 ORDER BY n DESC`, p),
    q(`SELECT browser k, count(*)::int n FROM pageviews WHERE ${w} GROUP BY 1 ORDER BY n DESC`, p),
    q(`SELECT os k, count(*)::int n FROM pageviews WHERE ${w} GROUP BY 1 ORDER BY n DESC`, p),
    q(`SELECT ts, path, source, medium, country, region, city, device, browser FROM pageviews WHERE ${w} ORDER BY ts DESC, id DESC LIMIT 40`, p),
    q("SELECT ts, name, idea, source FROM suggestions ORDER BY ts DESC, id DESC LIMIT 20"),
    q("SELECT ts, product, name, phone, email, business, details, message, alert_error FROM leads ORDER BY ts DESC, id DESC LIMIT 50"),
    q("SELECT l.alias, l.url, l.title, l.created, l.clicks, l.disabled, (SELECT count(*)::int FROM short_reports r WHERE r.link_id = l.id) reports FROM short_links l ORDER BY l.created DESC LIMIT 30"),
  ]);
  return { totals: totals[0], bounce: bounce[0].n, series, pages, entries, exits, flows, sources, mediums, countries, cities, devices, browsers, systems, recent, ideas, leads, shorts };
}

function Card({ title, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

// rows: [{label, sub?, value, extra?}] rendered with a share bar
function BarList({ rows, total, empty = "No data in this range." }) {
  if (!rows.length) return <p className="text-sm text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2">
      {rows.map((r, i) => (
        <li key={i} className="text-sm">
          <div className="flex justify-between gap-3">
            <span className="truncate" title={r.label}>
              {r.label}
              {r.sub && <span className="ml-2 text-xs text-muted">{r.sub}</span>}
            </span>
            <span className="shrink-0 tabular-nums">
              {n(r.value)}
              {total ? <span className="ml-2 text-xs text-muted">{pct(r.value, total)}</span> : null}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-border/60">
            <div className="h-1.5 rounded-full gradient-bg-orange" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Chart({ keys, byKey, gran }) {
  const max = Math.max(...keys.map((k) => byKey[k]?.views || 0), 1);
  const W = 1000;
  const H = 200;
  const bw = W / keys.length;
  const step = Math.ceil(keys.length / 8);
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full h-auto" role="img" aria-label="Page views over time">
      {keys.map((k, i) => {
        const v = byKey[k]?.views || 0;
        const u = byKey[k]?.visitors || 0;
        const hv = (v / max) * H;
        const hu = (u / max) * H;
        return (
          <g key={k}>
            <title>{`${label(k, gran)}: ${v} views, ${u} visitors`}</title>
            <rect x={i * bw + bw * 0.15} y={H - hv} width={bw * 0.7} height={hv} rx="2" fill="#0f3d8c" opacity="0.85" />
            <rect x={i * bw + bw * 0.3} y={H - hu} width={bw * 0.4} height={hu} rx="2" fill="#f59e0b" />
            {i % step === 0 && (
              <text x={i * bw + bw / 2} y={H + 16} fontSize="12" textAnchor="middle" fill="currentColor" opacity="0.6">
                {label(k, gran)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Shell({ children }) {
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</section>;
}

export default async function Page({ searchParams }) {
  if (!authConfigured()) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold mb-2">Website Analytics</h1>
        <p className="text-muted">Not configured yet.</p>
        <p className="mt-2 text-xs text-muted">
          deployment: {process.env.VERCEL_ENV || "local"} / {(process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || "n/a"}
        </p>
      </Shell>
    );
  }

  const sp = await searchParams;

  if (!(await isAdmin())) {
    return (
      <Shell>
        <form method="POST" action="/api/admin/login" className="max-w-sm mx-auto rounded-2xl border border-border bg-surface p-6">
          <h1 className="text-xl font-bold mb-4">Website Analytics</h1>
          <label htmlFor="pw" className="block text-sm font-medium mb-1.5">Password</label>
          <input id="pw" name="password" type="password" required autoFocus autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary mb-4" />
          {sp.error && <p role="alert" className="text-sm text-red-600 mb-3">Wrong password.</p>}
          <button className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold">Sign in</button>
        </form>
      </Shell>
    );
  }

  if (!dbConfigured()) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold mb-2">Website Analytics</h1>
        <p className="text-muted max-w-xl">
          No database is connected. In Vercel, open the project, go to Storage, create a Postgres database (Neon), connect it to this project, then redeploy. The table is created automatically.
        </p>
      </Shell>
    );
  }

  let first = null;
  try {
    first = (await q("SELECT min(ts) t FROM pageviews"))[0]?.t;
  } catch (e) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold mb-2">Website Analytics</h1>
        <p className="text-red-600">Could not reach the database: {String(e.message).slice(0, 200)}</p>
      </Shell>
    );
  }

  const range = resolveRange(sp, first);
  const d = await load(range);
  const { views, visitors } = d.totals;
  const keys = bucketKeys(range.fromMs, range.toMs, range.gran);
  const byKey = Object.fromEntries(d.series.map((r) => [r.k, r]));
  const extTotal = d.sources.reduce((s, r) => s + r.n, 0);
  const topSource = d.sources[0];
  const topCountry = d.countries[0];

  const tab = (key, text) => (
    <a
      key={key}
      href={`/admin/analytics?range=${key}`}
      className={`px-4 py-2 rounded-lg text-sm font-semibold ${range.key === key ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`}
    >
      {text}
    </a>
  );

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Website Analytics</h1>
          <p className="text-sm text-muted">{range.label} &bull; times in IST &bull; your own visits are not counted while you are signed in</p>
        </div>
        <form method="POST" action="/api/admin/logout">
          <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary">Sign out</button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {tab("today", "Today")}
        {tab("7d", "Last 7 days")}
        {tab("30d", "Last 30 days")}
        {tab("all", "All time")}
        <form method="GET" className="flex flex-wrap items-center gap-2 ml-0 sm:ml-4">
          <input type="hidden" name="range" value="custom" />
          <label className="sr-only" htmlFor="from">From</label>
          <input id="from" type="date" name="from" required defaultValue={sp.from || istDateString(range.fromMs)} max={istDateString()} className="px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          <span className="text-muted text-sm">to</span>
          <label className="sr-only" htmlFor="to">To</label>
          <input id="to" type="date" name="to" required defaultValue={sp.to || istDateString(range.toMs - 1)} max={istDateString()} className="px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          <button className={`px-4 py-2 rounded-lg text-sm font-semibold ${range.key === "custom" ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary"}`}>Apply</button>
        </form>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {[
          ["Page views", n(views)],
          ["Visitors", n(visitors)],
          ["Pages / visit", visitors ? (views / visitors).toFixed(1) : "0"],
          ["Bounce rate", pct(d.bounce, visitors)],
          ["Top source", topSource ? topSource.source : "-"],
          ["Top country", topCountry?.country ? `${flag(topCountry.country)} ${countryName(topCountry.country)}` : "-"],
        ].map(([t, v]) => (
          <div key={t} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">{t}</p>
            <p className="text-xl font-bold mt-1 truncate">{v}</p>
          </div>
        ))}
      </div>

      <Card title={`Traffic over time (${range.gran === "hour" ? "hourly" : range.gran === "day" ? "daily" : "monthly"})`} className="mb-6">
        <Chart keys={keys} byKey={byKey} gran={range.gran} />
        <p className="mt-2 text-xs text-muted">
          <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1" style={{ background: "#0f3d8c" }} />Page views
          <span className="inline-block w-3 h-3 rounded-sm align-middle ml-4 mr-1" style={{ background: "#f59e0b" }} />Visitors
          &nbsp;(visitors are counted per day)
        </p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Where visitors come from (traffic sources)">
          <BarList
            total={extTotal}
            rows={d.sources.map((r) => ({ label: r.source, sub: r.medium, value: r.n }))}
          />
          <p className="mt-3 text-xs text-muted">&quot;Direct&quot; means typed address, bookmark, or an app that hides the source (e.g. many WhatsApp links). Search keywords are in Google Search Console, not here.</p>
        </Card>

        <Card title="Source type">
          <BarList total={extTotal} rows={d.mediums.map((r) => ({ label: r.medium, value: r.n }))} />
        </Card>

        <Card title="Countries">
          <BarList total={views} rows={d.countries.map((r) => ({ label: `${flag(r.country)} ${countryName(r.country)}`, sub: `${n(r.visitors)} visitors`, value: r.views }))} />
        </Card>

        <Card title="Areas (cities)">
          <BarList total={views} rows={d.cities.map((r) => ({ label: r.city, sub: [r.region, countryName(r.country)].filter(Boolean).join(", "), value: r.views }))}
            empty="No city data yet. City is available for visits served by Vercel." />
        </Card>

        <Card title="Top pages">
          <BarList total={views} rows={d.pages.map((r) => ({ label: r.path, sub: `${n(r.visitors)} visitors`, value: r.views }))} />
        </Card>

        <Card title="Movement: where visitors go next">
          <BarList rows={d.flows.map((r) => ({ label: `${r.prev}  →  ${r.path}`, value: r.n }))} empty="No multi-page visits in this range yet." />
        </Card>

        <Card title="Landing pages (where visits start)">
          <BarList total={visitors} rows={d.entries.map((r) => ({ label: r.path, value: r.n }))} />
        </Card>

        <Card title="Exit pages (where visits end)">
          <BarList total={visitors} rows={d.exits.map((r) => ({ label: r.path, value: r.n }))} />
        </Card>

        <Card title="Devices">
          <BarList total={views} rows={d.devices.map((r) => ({ label: r.k, value: r.n }))} />
        </Card>

        <Card title="Browsers and systems">
          <BarList total={views} rows={d.browsers.map((r) => ({ label: r.k, value: r.n }))} />
          <div className="my-4 border-t border-border" />
          <BarList total={views} rows={d.systems.map((r) => ({ label: r.k, value: r.n }))} />
        </Card>
      </div>

      <Card title={`Leads and messages (latest 50, all time): ${d.leads.length} shown`} className="mt-6">
        {d.leads.length ? (
          <ul className="space-y-4">
            {d.leads.map((l, i) => (
              <li key={i} className="text-sm border-b border-border/60 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${l.product === "contact" ? "bg-border text-muted" : "bg-primary/10 text-primary"}`}>{{ "sellersync-os": "SellerSync pilot", "digital-desk": "Digital Desk", contact: "Contact form" }[l.product] || l.product}</span>
                  <strong>{l.name}</strong>
                  {l.business && <span className="text-muted">&bull; {l.business}</span>}
                  <span className="text-xs text-muted">{fmtIST(l.ts)}</span>
                </div>
                <p className="text-xs">
                  {l.phone && <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="text-primary underline mr-3">{l.phone}</a>}
                  {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-primary underline mr-3">WhatsApp</a>}
                  {l.email && <a href={`mailto:${l.email}`} className="text-primary underline">{l.email}</a>}
                </p>
                {l.details && <p className="text-xs text-muted mt-1">{l.details}</p>}
                {l.message && <p className="mt-1 whitespace-pre-wrap">{l.message}</p>}
                {l.alert_error && <p className="mt-1 text-xs text-red-600">Email alert failed: {l.alert_error}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No leads yet. SellerSync pilot applications and Contact page messages arrive here.</p>
        )}
      </Card>

      <Card title="Short links (latest 30, newest first)" className="mt-6">
        {d.shorts.length ? (
          <ul className="space-y-3">
            {d.shorts.map((l) => (
              <li key={l.alias} className="text-sm border-b border-border/60 pb-3 last:border-0 last:pb-0 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold break-all">/go/{l.alias} {l.disabled && <span className="text-xs text-red-600">switched off</span>} {l.reports > 0 && <span className="text-xs text-red-600">{l.reports} report{l.reports > 1 ? "s" : ""}</span>}</p>
                  <p className="text-xs text-muted break-all">{l.title ? `${l.title} → ` : ""}{l.url}</p>
                  <p className="text-xs text-muted">{n(l.clicks)} clicks &bull; {fmtIST(l.created)}</p>
                </div>
                <AdminLinkActions alias={l.alias} disabled={l.disabled} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No short links yet. Links made with the Short Link Maker appear here, so you can switch off anything unsafe.</p>
        )}
      </Card>

      <Card title="Ideas suggested by users (latest 20, all time)" className="mt-6">
        {d.ideas.length ? (
          <ul className="space-y-3">
            {d.ideas.map((s, i) => (
              <li key={i} className="text-sm border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <p className="whitespace-pre-wrap">{s.idea}</p>
                <p className="mt-1 text-xs text-muted">{s.name} &bull; {s.source} &bull; {fmtIST(s.ts)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No suggestions yet. They arrive from the Chrome extension&apos;s Suggest tab.</p>
        )}
      </Card>

      <Card title="Recent activity (latest 40 page views)" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="py-2 pr-4 font-medium">Time</th>
                <th className="py-2 pr-4 font-medium">Page</th>
                <th className="py-2 pr-4 font-medium">From</th>
                <th className="py-2 pr-4 font-medium">Area</th>
                <th className="py-2 font-medium">Device</th>
              </tr>
            </thead>
            <tbody>
              {d.recent.map((r, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="py-2 pr-4 whitespace-nowrap text-muted">{fmtIST(r.ts)}</td>
                  <td className="py-2 pr-4">{r.path}</td>
                  <td className="py-2 pr-4">{r.source === "internal" ? <span className="text-muted">site navigation</span> : r.source}</td>
                  <td className="py-2 pr-4">{[r.city, r.country && countryName(r.country)].filter(Boolean).join(", ") || "Unknown"}</td>
                  <td className="py-2 whitespace-nowrap">{r.device} &middot; {r.browser}</td>
                </tr>
              ))}
              {!d.recent.length && (
                <tr><td colSpan={5} className="py-6 text-center text-muted">No visits in this range yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
