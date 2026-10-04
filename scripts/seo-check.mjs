// Daily SEO health check. Exits 1 (so GitHub emails you) if anything is broken.
// Usage: BASE=https://ganivotech.com node scripts/seo-check.mjs   (PSI_API_KEY optional)
const SITE = "https://ganivotech.com";
const BASE = (process.env.BASE || SITE).replace(/\/$/, "");
const local = (u) => u.replace(SITE, BASE);

const problems = [];
const bad = (url, msg) => problems.push(`${url.replace(BASE, "")}  ${msg}`);
// retry transient network errors; if still failing return a fake 599 so it is reported, not thrown
async function get(u) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch(u, { headers: { "user-agent": "ganivotech-seo-check" }, redirect: "manual" });
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return { status: 599, text: async () => "" };
}

const robots = await (await get(`${BASE}/robots.txt`)).text();
if (!robots.includes("Sitemap:")) bad(`${BASE}/robots.txt`, "robots.txt has no Sitemap line");

const sitemap = await (await get(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => local(m[1]));
if (urls.length < 10) bad(`${BASE}/sitemap.xml`, `only ${urls.length} URLs in sitemap`);

const links = new Set();
for (const url of urls) {
  const res = await get(url);
  if (res.status !== 200) {
    bad(url, `status ${res.status}`);
    continue;
  }
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "";
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (!title || title.length > 70) bad(url, `title missing or too long (${title.length})`);
  if (desc.length < 70 || desc.length > 170) bad(url, `description length ${desc.length}`);
  const strip = (s) => s?.replace(/\/$/, "");
  if (strip(canon) !== strip(url.replace(BASE, SITE))) bad(url, `canonical is ${canon}`);
  if (h1s !== 1) bad(url, `${h1s} H1 tags`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) bad(url, "noindex set");
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      JSON.parse(m[1]);
    } catch {
      bad(url, "invalid JSON-LD");
    }
  }
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) if (!m[1].startsWith("/_next")) links.add(m[1]);
}

for (const path of links) {
  const s = (await get(`${BASE}${path}`)).status;
  if (s >= 400) bad(`${BASE}${path}`, `broken internal link (${s})`);
}

// Core Web Vitals (lab data) for the main page via the free PageSpeed Insights API
if (BASE === SITE) {
  const key = process.env.PSI_API_KEY ? `&key=${process.env.PSI_API_KEY}` : "";
  const page = `${SITE}/tools/qr-generator`;
  const r = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(page)}&strategy=mobile&category=performance&category=seo${key}`
  );
  if (r.ok) {
    const j = (await r.json()).lighthouseResult;
    const a = j.audits;
    const lcp = a["largest-contentful-paint"].numericValue / 1000;
    const cls = a["cumulative-layout-shift"].numericValue;
    const tbt = a["total-blocking-time"].numericValue;
    console.log(`PSI mobile: performance ${Math.round(j.categories.performance.score * 100)}, SEO ${Math.round(j.categories.seo.score * 100)}, LCP ${lcp.toFixed(2)}s, CLS ${cls.toFixed(3)}, TBT ${Math.round(tbt)}ms`);
    if (lcp > 2.5) bad(page, `LCP ${lcp.toFixed(2)}s (target < 2.5s)`);
    if (cls > 0.1) bad(page, `CLS ${cls.toFixed(3)} (target < 0.1)`);
    if (tbt > 300) bad(page, `TBT ${Math.round(tbt)}ms (INP proxy, target < 200ms)`);
    if (j.categories.seo.score < 0.9) bad(page, `Lighthouse SEO score ${j.categories.seo.score * 100}`);
  } else {
    console.log(`PSI skipped (HTTP ${r.status}); add a PSI_API_KEY secret for reliable runs`);
  }
}

console.log(`Checked ${urls.length} pages, ${links.size} internal links.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("All SEO checks passed.");
