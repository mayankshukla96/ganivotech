import Link from "next/link";
import BulkQR from "@/components/BulkQR";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { BULK, BULK_TYPES } from "@/lib/tools-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BULK_TYPES).map((type) => ({ type }));
}

const page = (type) => (BULK_TYPES[type] ? { ...BULK_TYPES[type], path: `${BULK.path}/${type}` } : null);

export async function generateMetadata({ params }) {
  const { type } = await params;
  const t = page(type);
  return t ? toolMetadata(t) : {};
}

export default async function Page({ params }) {
  const { type } = await params;
  const t = page(type);
  if (!t) return null;
  return (
    <ToolShell
      t={t}
      crumbs={[["Bulk QR from Excel", BULK.path], [t.h1.replace("Bulk ", "").replace(" Generator", ""), t.path]]}
      extra={
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Other bulk QR codes</h2>
          <ul className="flex flex-wrap gap-2">
            <li><Link href={BULK.path} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">Bulk QR from any list</Link></li>
            {Object.entries(BULK_TYPES).filter(([k]) => k !== type).map(([k, x]) => (
              <li key={k}><Link href={`${BULK.path}/${k}`} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">{x.h1}</Link></li>
            ))}
          </ul>
        </section>
      }
    >
      <BulkQR preset={type} />
    </ToolShell>
  );
}
