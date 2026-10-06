import Link from "next/link";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { PDF_HUB, PDF_OPS } from "@/lib/pdf-toolkit-content";

export const metadata = toolMetadata(PDF_HUB);

const MORE = [
  ["/tools/compress-to-exact-size", "Compress to Exact Size", "Make a PDF fit an upload limit."],
  ["/tools/pdf-maker", "PDF Maker", "Turn pictures and text into a PDF."],
  ["/tools/ocr-to-excel-word", "OCR to Excel & Word", "Read the text out of a scanned PDF."],
];

const tile = "flex flex-col h-full rounded-2xl border border-border bg-surface p-5 hover:border-primary transition-colors";

export default function Page() {
  return (
    <ToolShell t={PDF_HUB} crumbs={[["PDF Tools", PDF_HUB.path]]}>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Object.values(PDF_OPS).map((t) => [t.path, t.name, t.blurb]), ...MORE].map(([href, name, blurb]) => (
          <li key={href}>
            <Link href={href} className={tile}>
              <h2 className="text-lg font-bold mb-1">{name}</h2>
              <p className="text-sm text-muted">{blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ToolShell>
  );
}
