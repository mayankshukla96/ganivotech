import Link from "next/link";
import BulkQR from "@/components/BulkQR";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { BULK, BULK_TYPES } from "@/lib/tools-content";

export const metadata = toolMetadata(BULK);

const extra = (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-4">Ready-made bulk QR codes</h2>
    <ul className="grid sm:grid-cols-2 gap-3">
      {Object.entries(BULK_TYPES).map(([k, t]) => (
        <li key={k}>
          <Link href={`${BULK.path}/${k}`} className="block rounded-xl border border-border bg-surface p-4 hover:border-primary transition-colors">
            <span className="font-semibold text-sm">{t.h1}</span>
            <span className="block text-xs text-muted mt-1">{t.intro.slice(0, 90)}...</span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default function Page() {
  return (
    <ToolShell t={BULK} crumbs={[["Bulk QR from Excel", BULK.path]]} extra={extra}>
      <BulkQR preset="urls" />
    </ToolShell>
  );
}
