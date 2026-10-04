import { COOKIE } from "@/lib/admin-auth";

export async function POST(req) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/admin/analytics", req.url).toString(),
      "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}
