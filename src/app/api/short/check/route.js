import { dbConfigured, q } from "@/lib/analytics-db";
import { aliasProblem } from "@/lib/short-links";
import { json } from "@/lib/short-server";

// ?names=a,b,c  ->  { a: "free" | "taken" | "<reason it is not allowed>" }
export async function GET(req) {
  try {
    const names = [...new Set((new URL(req.url).searchParams.get("names") || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean))].slice(0, 10);
    const out = {};
    const ok = [];
    for (const n of names) {
      const p = aliasProblem(n);
      if (p) out[n] = p; else ok.push(n);
    }
    if (ok.length) {
      if (!dbConfigured()) return json({ ok: false }, 503);
      const taken = new Set((await q("SELECT alias FROM short_links WHERE alias = ANY($1)", [ok])).map((r) => r.alias));
      for (const n of ok) out[n] = taken.has(n) ? "taken" : "free";
    }
    return json({ ok: true, names: out });
  } catch {
    return json({ ok: false }, 500);
  }
}
