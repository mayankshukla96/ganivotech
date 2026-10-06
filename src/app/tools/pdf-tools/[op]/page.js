import Link from "next/link";
import PdfToolkit from "@/components/PdfToolkit";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { PDF_HUB, PDF_OPS } from "@/lib/pdf-toolkit-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PDF_OPS).map((op) => ({ op }));
}

export async function generateMetadata({ params }) {
  const t = PDF_OPS[(await params).op];
  return t ? toolMetadata(t) : {};
}

export default async function Page({ params }) {
  const { op } = await params;
  const t = PDF_OPS[op];
  const extra = (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Other PDF tools</h2>
      <ul className="flex flex-wrap gap-2">
        {Object.entries(PDF_OPS).filter(([slug]) => slug !== op).map(([slug, x]) => (
          <li key={slug}>
            <Link href={x.path} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">{x.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
  return (
    <ToolShell t={t} crumbs={[["PDF Tools", PDF_HUB.path], [t.name, t.path]]} extra={extra}>
      {/* the key gives each tool a clean start when a file is sent from one tool to the next */}
      <PdfToolkit key={op} op={op} />
    </ToolShell>
  );
}
