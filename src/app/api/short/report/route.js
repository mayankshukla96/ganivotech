import { dbConfigured, q } from "@/lib/analytics-db";
import { json, sameSite, visitorId } from "@/lib/short-server";

const LIMIT = 3; // distinct reporters that switch a link off until the owner has looked at it

export async function POST(req) {
  try {
    if (!sameSite(req.headers.get("origin"))) return json({ ok: false, error: "Not allowed." }, 403);
    if (!dbConfigured()) return json({ ok: false, error: "Not available right now." }, 503);
    const b = await req.json().catch(() => null);
    const alias = String(b?.alias ?? "").trim().toLowerCase();
    const [link] = await q("SELECT id FROM short_links WHERE alias = $1", [alias]);
    if (!link) return json({ ok: false, error: "Link not found." }, 404);
    await q("INSERT INTO short_reports (link_id, vid) VALUES ($1,$2) ON CONFLICT DO NOTHING", [link.id, visitorId(req)]);
    const [{ n }] = await q("SELECT count(*)::int n FROM short_reports WHERE link_id = $1 AND ts > now() - interval '2 days'", [link.id]);
    if (n >= LIMIT) await q("UPDATE short_links SET disabled = true WHERE id = $1", [link.id]);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Something went wrong." }, 500);
  }
}
