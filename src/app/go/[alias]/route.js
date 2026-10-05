import { after } from "next/server";
import { dbConfigured, q } from "@/lib/analytics-db";
import { classifySource, isBot, parseUA } from "@/lib/analytics-utils";
import { notice } from "@/lib/short-server";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { alias } = await params;
  if (!dbConfigured() || !/^[a-z0-9-]{3,32}$/i.test(alias)) return notice("Link not found", "This short link does not exist. Check the spelling, or ask the person who sent it.", 404);

  const [link] = await q("SELECT id, url, disabled, expires FROM short_links WHERE alias = $1", [alias.toLowerCase()]);
  if (!link) return notice("Link not found", "This short link does not exist. Check the spelling, or ask the person who sent it.", 404);
  if (link.disabled) return notice("Link switched off", "This short link was switched off by its owner, or removed after reports that it may be unsafe.", 410);
  if (link.expires && new Date(link.expires) < new Date()) return notice("Link expired", "This short link has expired. Ask the person who sent it for a new one.", 410);

  const ua = req.headers.get("user-agent") || "";
  if (!isBot(ua)) {
    after(async () => {
      const { source } = classifySource({ referrer: req.headers.get("referer") || "", ownHost: "ganivotech.com" });
      const country = req.headers.get("x-vercel-ip-country") || null;
      await q("INSERT INTO short_clicks (link_id, source, device, country) VALUES ($1,$2,$3,$4)", [link.id, source, parseUA(ua).device, country]).catch(() => {});
      await q("UPDATE short_links SET clicks = clicks + 1 WHERE id = $1", [link.id]).catch(() => {});
    });
  }
  // 302 (not 301): the owner can switch the link off or it can expire, so browsers must not remember the destination
  return new Response(null, { status: 302, headers: { Location: link.url, "cache-control": "no-store", "x-robots-tag": "noindex", "referrer-policy": "no-referrer" } });
}
