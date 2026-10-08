import { dbConfigured, q } from "@/lib/analytics-db";
import { vcardText } from "@/lib/visiting-card";

export const dynamic = "force-dynamic";

// The "Save contact" button of a smart visiting card: the card's details as a .vcf file.
export async function GET(_req, { params }) {
  const { alias } = await params;
  if (!dbConfigured() || !/^[a-z0-9-]{3,32}$/i.test(alias)) return new Response("Not found", { status: 404 });
  const [row] = await q("SELECT page, disabled, expires FROM short_links WHERE alias = $1 AND page IS NOT NULL", [alias.toLowerCase()]);
  const c = row?.page;
  if (!c || c.kind !== "card" || row.disabled || (row.expires && new Date(row.expires) < new Date())) return new Response("Not found", { status: 404 });
  const name = c.name.replace(/[^\w .-]+/g, " ").trim() || "contact";
  return new Response(vcardText(c), {
    headers: { "content-type": "text/vcard; charset=utf-8", "content-disposition": `attachment; filename="${name}.vcf"`, "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}
