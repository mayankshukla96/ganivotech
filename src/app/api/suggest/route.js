import { createHash } from "crypto";
import { dbConfigured, q } from "@/lib/analytics-db";
import { istDateString } from "@/lib/analytics-utils";

// Receives tool ideas from the Chrome extension (and the site) and stores them for the owner dashboard.
const allowed = (origin) =>
  !!origin && (origin.startsWith("chrome-extension://") || /^https:\/\/(www\.)?ganivotech\.com$/.test(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin));

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  return new Response(null, { status: 204, headers: allowed(origin) ? cors(origin) : {} });
}

export async function POST(req) {
  const origin = req.headers.get("origin");
  if (!allowed(origin)) return Response.json({ ok: false }, { status: 403 });
  const headers = cors(origin);
  const fail = (msg, status) => Response.json({ ok: false, error: msg }, { status, headers });

  try {
    if (!dbConfigured()) return fail("Not available right now.", 503);
    const raw = await req.text();
    if (raw.length > 4000) return fail("Too long.", 413);
    let b;
    try {
      b = JSON.parse(raw);
    } catch {
      return fail("Invalid request.", 400);
    }
    if (!b || typeof b !== "object") return fail("Invalid request.", 400);

    const idea = String(b.idea || "").trim().slice(0, 1000);
    const name = String(b.name || "").trim().slice(0, 60) || "Anonymous";
    const source = String(b.source || "web").trim().slice(0, 30);
    if (idea.length < 5) return fail("Please describe your idea in a few words.", 400);

    const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "ganivotech";
    const vid = createHash("sha256").update(`${ip}|${req.headers.get("user-agent") || ""}|${istDateString()}|${salt}`).digest("hex").slice(0, 16);

    const [{ n }] = await q("SELECT count(*)::int n FROM suggestions WHERE vid = $1 AND ts > now() - interval '1 day'", [vid]);
    if (n >= 5) return fail("Thanks! You have sent a lot of ideas today. Please try again tomorrow.", 429);

    await q("INSERT INTO suggestions (name, idea, source, vid) VALUES ($1,$2,$3,$4)", [name, idea, source, vid]);
    return Response.json({ ok: true }, { headers });
  } catch {
    return fail("Could not send. Please try again.", 500);
  }
}
