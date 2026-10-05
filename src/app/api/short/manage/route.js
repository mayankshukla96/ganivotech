import { timingSafeEqual } from "crypto";
import { COOKIE, tokenOk } from "@/lib/admin-auth";
import { dbConfigured, q } from "@/lib/analytics-db";
import { countryName, istDateString } from "@/lib/analytics-utils";
import { absolute } from "@/lib/short-links";
import { hashKey, json, sameSite } from "@/lib/short-server";

const same = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Owner actions for one link, proved with the manage key shown when it was made (or the site owner's admin login).
export async function POST(req) {
  try {
    if (!sameSite(req.headers.get("origin"))) return json({ ok: false, error: "Not allowed." }, 403);
    if (!dbConfigured()) return json({ ok: false, error: "Not available right now." }, 503);
    const b = await req.json().catch(() => null);
    const alias = String(b?.alias ?? "").trim().toLowerCase();
    const key = String(b?.key ?? "").trim();
    const action = b?.action;
    if (!alias || !["stats", "disable", "enable", "delete"].includes(action)) return json({ ok: false, error: "Invalid request." }, 400);

    const [link] = await q("SELECT id, alias, url, title, key_hash, created, expires, clicks, disabled FROM short_links WHERE alias = $1", [alias]);
    const admin = tokenOk(req.cookies.get(COOKIE)?.value);
    if (!link || !(admin || (key && same(hashKey(key), link.key_hash)))) return json({ ok: false, error: "Wrong name or manage key." }, 403);

    if (action === "delete") {
      await q("DELETE FROM short_clicks WHERE link_id = $1", [link.id]);
      await q("DELETE FROM short_reports WHERE link_id = $1", [link.id]);
      await q("DELETE FROM short_links WHERE id = $1", [link.id]);
      return json({ ok: true, deleted: true });
    }
    if (action !== "stats") {
      await q("UPDATE short_links SET disabled = $1 WHERE id = $2", [action === "disable", link.id]);
      link.disabled = action === "disable";
    }

    const p = [link.id];
    const [perDay, sources, devices, countries, [rep]] = await Promise.all([
      q("SELECT to_char(ts AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD') k, count(*)::int n FROM short_clicks WHERE link_id = $1 AND ts > now() - interval '16 days' GROUP BY 1", p),
      q("SELECT coalesce(source,'Direct') k, count(*)::int n FROM short_clicks WHERE link_id = $1 GROUP BY 1 ORDER BY n DESC LIMIT 5", p),
      q("SELECT coalesce(device,'Other') k, count(*)::int n FROM short_clicks WHERE link_id = $1 GROUP BY 1 ORDER BY n DESC", p),
      q("SELECT country k, count(*)::int n FROM short_clicks WHERE link_id = $1 GROUP BY 1 ORDER BY n DESC LIMIT 5", p),
      q("SELECT count(*)::int n FROM short_reports WHERE link_id = $1", p),
    ]);
    const byDay = Object.fromEntries(perDay.map((r) => [r.k, r.n]));
    const days = Array.from({ length: 14 }, (_, i) => {
      const k = istDateString(Date.now() - (13 - i) * 86400000);
      return { day: k, n: byDay[k] || 0 };
    });
    return json({
      ok: true,
      link: { alias: link.alias, short: absolute(link.alias), url: link.url, title: link.title, created: link.created, expires: link.expires, clicks: link.clicks, disabled: link.disabled, reports: rep.n },
      days,
      sources,
      devices,
      countries: countries.map((c) => ({ k: c.k ? countryName(c.k) : "Unknown", n: c.n })),
    });
  } catch {
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
}
