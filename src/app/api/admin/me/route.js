import { COOKIE, tokenOk } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// lets the navbar show the Analytics link to the signed-in owner only
export async function GET(req) {
  return Response.json(
    { admin: tokenOk(req.cookies.get(COOKIE)?.value) },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
