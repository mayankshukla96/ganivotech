// Tells Bing (and other IndexNow search engines) which pages exist, right after a deploy. Google does not use IndexNow.
// The key file public/<key>.txt proves we own the site. Usage: INDEXNOW_KEY=... node scripts/indexnow.mjs
const SITE = "https://ganivotech.com";
const key = process.env.INDEXNOW_KEY;
if (!key) { console.error("INDEXNOW_KEY is not set"); process.exit(1); }

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "ganivotech.com", key, keyLocation: `${SITE}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} pages`);
if (res.status >= 400) process.exit(1);
