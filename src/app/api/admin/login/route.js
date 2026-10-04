import { COOKIE, passwordOk, token } from "@/lib/admin-auth";

// best-effort brute-force guard (per server instance)
const fails = new Map();

export async function POST(req) {
  const ip = (req.headers.get("x-vercel-forwarded-for") || req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const rec = fails.get(ip);
  const now = Date.now();
  if (rec && rec.n >= 5 && now - rec.t < 15 * 60 * 1000) {
    return new Response("Too many attempts. Try again in 15 minutes.", { status: 429 });
  }

  const form = await req.formData();
  const back = new URL("/admin/analytics", req.url);

  if (!passwordOk(form.get("password"))) {
    fails.set(ip, { n: (rec && now - rec.t < 15 * 60 * 1000 ? rec.n : 0) + 1, t: now });
    await new Promise((r) => setTimeout(r, 800));
    back.searchParams.set("error", "1");
    return Response.redirect(back, 303);
  }

  fails.delete(ip);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return new Response(null, {
    status: 303,
    headers: {
      Location: back.toString(),
      "Set-Cookie": `${COOKIE}=${token()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure}`,
    },
  });
}
