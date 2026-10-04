import { createHash } from "crypto";
import { dbConfigured, q } from "@/lib/analytics-db";
import { istDateString } from "@/lib/analytics-utils";

// Stores enquiries (SellerSync pilot applications, contact form) for the owner dashboard.
const PRODUCTS = new Set(["sellersync-os", "contact"]);
const sameSite = (o) => !!o && (/^https:\/\/(www\.)?ganivotech\.com$/.test(o) || /^http:\/\/localhost(:\d+)?$/.test(o) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(o));

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export async function POST(req) {
  const fail = (error, status) => Response.json({ ok: false, error }, { status });
  try {
    if (!sameSite(req.headers.get("origin"))) return fail("Not allowed.", 403);
    if (!dbConfigured()) return fail("This form is not available right now. Please email hello@ganivotech.com.", 503);

    const raw = await req.text();
    if (raw.length > 6000) return fail("That message is too long.", 413);
    let b;
    try { b = JSON.parse(raw); } catch { return fail("Invalid request.", 400); }
    if (!b || typeof b !== "object") return fail("Invalid request.", 400);

    // hidden field that real people never fill in: pretend success so bots learn nothing
    if (clip(b.website, 100)) return Response.json({ ok: true });

    const product = clip(b.product, 40);
    const name = clip(b.name, 80);
    const phone = clip(b.phone, 30);
    const email = clip(b.email, 120);
    if (!PRODUCTS.has(product)) return fail("Invalid request.", 400);
    if (name.length < 2) return fail("Please enter your name.", 400);
    const digits = phone.replace(/\D/g, "");
    if (!email && !phone) return fail("Please enter a phone number or an email so we can reach you.", 400);
    if (phone && (digits.length < 8 || digits.length > 15)) return fail("Please check the phone number.", 400);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("Please check the email address.", 400);

    const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "ganivotech";
    const vid = createHash("sha256").update(`${ip}|${req.headers.get("user-agent") || ""}|${istDateString()}|${salt}`).digest("hex").slice(0, 16);

    const [{ n }] = await q("SELECT count(*)::int n FROM leads WHERE vid = $1 AND ts > now() - interval '1 day'", [vid]);
    if (n >= 5) return fail("You have sent several messages today. We will reply soon, or please try again tomorrow.", 429);

    await q(
      "INSERT INTO leads (product, name, phone, email, business, details, message, vid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [product, name, phone || null, email || null, clip(b.business, 120) || null, clip(b.details, 300) || null, clip(b.message, 2000) || null, vid]
    );
    return Response.json({ ok: true });
  } catch {
    return fail("Could not send. Please try again, or email hello@ganivotech.com.", 500);
  }
}
