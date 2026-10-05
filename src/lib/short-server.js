// Server-only helpers shared by the short link routes.
import { createHash, randomBytes } from "crypto";
import { istDateString } from "@/lib/analytics-utils";

export const sameSite = (o) => !!o && (/^https:\/\/(www\.)?ganivotech\.com$/.test(o) || /^http:\/\/localhost(:\d+)?$/.test(o) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(o));

// the same daily-rotating anonymous id the page counter uses: no IP is stored
export function visitorId(req) {
  const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "ganivotech";
  return createHash("sha256").update(`${ip}|${req.headers.get("user-agent") || ""}|${istDateString()}|${salt}`).digest("hex").slice(0, 16);
}

export const newKey = () => randomBytes(9).toString("base64url");
export const hashKey = (k) => createHash("sha256").update(String(k)).digest("hex");

export const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A small branded page for links that are missing, expired or switched off. */
export function notice(title, message, status) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(title)} | GanivoTech</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#0f172a;font-family:Segoe UI,Arial,sans-serif;padding:24px}
main{max-width:440px;text-align:center}h1{font-size:26px;margin:0 0 8px}p{color:#475569;line-height:1.6}
a{display:inline-block;margin-top:12px;padding:10px 20px;border-radius:10px;background:#0f3d8c;color:#fff;text-decoration:none;font-weight:600}</style></head>
<body><main><h1>${esc(title)}</h1><p>${esc(message)}</p><a href="/tools/short-link-maker">Make your own short link</a></main></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
