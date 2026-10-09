import { createHash } from "crypto";
import { COOKIE, tokenOk } from "@/lib/admin-auth";
import { dbConfigured, q } from "@/lib/analytics-db";
import { classifySource, isBot, istDateString, parseUA } from "@/lib/analytics-utils";

const ok = () => new Response(null, { status: 204 });
const OWN_HOST = "ganivotech.com";

export async function POST(req) {
  try {
    if (!dbConfigured()) return ok();

    // the owner's own visits (logged in to the dashboard) are not counted
    if (tokenOk(req.cookies.get(COOKIE)?.value)) return ok();

    const ua = req.headers.get("user-agent") || "";
    if (isBot(ua)) return ok();

    const origin = req.headers.get("origin");
    if (origin) {
      const h = new URL(origin).hostname;
      if (h !== OWN_HOST && !h.endsWith(`.${OWN_HOST}`) && h !== "localhost" && !h.endsWith(".vercel.app")) return ok();
    }

    const raw = await req.text();
    if (raw.length > 2000) return ok();
    const b = JSON.parse(raw);

    const path = typeof b.path === "string" ? b.path.split("?")[0].split("#")[0].slice(0, 200) : "";
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return ok();

    const { source, medium, refHost } = classifySource({
      referrer: typeof b.ref === "string" ? b.ref.slice(0, 300) : "",
      utmSource: typeof b.utmSource === "string" ? b.utmSource : "",
      utmMedium: typeof b.utmMedium === "string" ? b.utmMedium : "",
      nav: !!b.nav,
      ownHost: OWN_HOST,
    });

    // anonymous visitor id: a daily-rotating hash, so nobody can be followed across days and no IP is stored
    const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "ganivotech";
    const vid = createHash("sha256").update(`${ip}|${ua}|${istDateString()}|${salt}`).digest("hex").slice(0, 16);

    let city = req.headers.get("x-vercel-ip-city");
    try {
      city = city ? decodeURIComponent(city) : null;
    } catch {}
    const { device, browser, os } = parseUA(ua);

    await q(
      `INSERT INTO pageviews (path, source, medium, ref_host, country, region, city, device, browser, os, vid, is_new)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [path, source, medium, refHost, req.headers.get("x-vercel-ip-country"), req.headers.get("x-vercel-ip-country-region"), city, device, browser, os, vid, b.nv === true && !b.nav]
    );
  } catch {
    // analytics must never break the site
  }
  return ok();
}
