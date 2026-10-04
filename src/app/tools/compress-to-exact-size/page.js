import Link from "next/link";
import ExactSizeTool from "@/components/ExactSizeTool";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { EXACT, SIZES } from "@/lib/tools-content";

export const metadata = toolMetadata(EXACT);

const extra = (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-4">Pick a common size</h2>
    <ul className="flex flex-wrap gap-2">
      {Object.entries(SIZES).map(([slug, s]) => (
        <li key={slug}>
          <Link href={`${EXACT.path}/${slug}`} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">
            Reduce to {s.label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default function Page() {
  return (
    <ToolShell t={EXACT} crumbs={[["Compress to Exact Size", EXACT.path]]} extra={extra}>
      <ExactSizeTool />
    </ToolShell>
  );
}
