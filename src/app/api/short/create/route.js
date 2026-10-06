import { dbConfigured, q } from "@/lib/analytics-db";
import { BASE, EXPIRY, absolute, aliasProblem, checkDestination, checkPage, randomAlias } from "@/lib/short-links";
import { hashKey, json, newKey, sameSite, visitorId } from "@/lib/short-server";

export async function POST(req) {
  try {
    if (!sameSite(req.headers.get("origin"))) return json({ ok: false, error: "Not allowed." }, 403);
    if (!dbConfigured()) return json({ ok: false, error: "Short links are not available right now. Please try again later." }, 503);

    const raw = await req.text();
    if (raw.length > 4000) return json({ ok: false, error: "That request is too large." }, 413);
    let b;
    try { b = JSON.parse(raw); } catch { return json({ ok: false, error: "Invalid request." }, 400); }
    if (!b || typeof b !== "object") return json({ ok: false, error: "Invalid request." }, 400);
    if (String(b.website ?? "").trim()) return json({ ok: true, alias: "x", short: "", key: "" }); // honeypot

    // a link page (one QR code, many links) has no destination of its own: the short link opens the page
    const pg = b.page ? checkPage(b.page) : null;
    if (pg && !pg.ok) return json({ ok: false, error: pg.error, field: "page" }, 400);
    const dest = pg ? { ok: true } : checkDestination(b.url);
    if (!dest.ok) return json({ ok: false, error: dest.error, field: "url" }, 400);
    const title = String(b.title ?? "").trim().slice(0, 80);
    if (!(b.expires in EXPIRY)) return json({ ok: false, error: "Invalid request." }, 400);
    const days = EXPIRY[b.expires];

    let alias = String(b.alias ?? "").trim().toLowerCase();
    if (alias) {
      const problem = aliasProblem(alias);
      if (problem) return json({ ok: false, error: problem, field: "alias" }, 400);
    }

    const vid = visitorId(req);
    const [{ mine, all }] = await q(
      "SELECT count(*) FILTER (WHERE vid = $1 AND created > now() - interval '1 day')::int mine, count(*) FILTER (WHERE created > now() - interval '1 hour')::int all FROM short_links",
      [vid]
    );
    if (mine >= 10) return json({ ok: false, error: "You have made 10 short links today. Please come back tomorrow." }, 429);
    if (all >= 300) return json({ ok: false, error: "Many links are being made right now. Please try again in a little while." }, 429);

    const key = newKey();
    for (let i = 0; i < 6; i++) {
      const tryAlias = alias || randomAlias();
      const rows = await q(
        `INSERT INTO short_links (alias, url, title, key_hash, expires, vid, page)
         VALUES ($1,$2,$3,$4, CASE WHEN $5::int IS NULL THEN NULL ELSE now() + make_interval(days => $5::int) END, $6, $7)
         ON CONFLICT (alias) DO NOTHING RETURNING alias, expires`,
        [tryAlias, pg ? `${BASE}/l/${tryAlias}` : dest.url, pg ? pg.page.title : title || null, hashKey(key), days, vid, pg ? JSON.stringify(pg.page) : null]
      );
      if (rows.length) return json({ ok: true, alias: rows[0].alias, short: absolute(rows[0].alias), key, url: pg ? `${BASE}/l/${rows[0].alias}` : dest.url, expires: rows[0].expires });
      if (alias) return json({ ok: false, error: "That name is already taken. Pick another, or choose one of the ideas.", field: "alias" }, 409);
    }
    return json({ ok: false, error: "Could not make a link. Please try again." }, 500);
  } catch {
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
}
