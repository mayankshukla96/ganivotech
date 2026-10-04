import Link from "next/link";
import ExactSizeTool from "@/components/ExactSizeTool";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { EXACT, SIZES } from "@/lib/tools-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SIZES).map((size) => ({ size }));
}

const page = (size) => {
  const s = SIZES[size];
  if (!s) return null;
  return {
    path: `${EXACT.path}/${size}`,
    title: `Reduce Image or PDF to ${s.label} – Free Online | GanivoTech`,
    description: `Make a photo, scan or PDF smaller than ${s.label}, or exactly ${s.label}. Free, no signup, and your file stays in your browser.`,
    h1: `Reduce an Image or PDF to ${s.label}`,
    intro: `${s.about} Choose your file and get it under ${s.label}, or padded to exactly ${s.label}.`,
    steps: [`Choose your JPG, PNG, WebP or PDF.`, `The target is already set to ${s.label}. Choose Under this size or Exactly this size.`, `Click Make it this size and download the result.`],
    tips: EXACT.tips,
    faqs: [
      [`How do I reduce a file to ${s.label}?`, `Choose the file, keep the target at ${s.label}, and click Make it this size. The tool lowers the picture quality, and reduces the dimensions only if it must, until the file fits.`],
      [`Can I make it exactly ${s.label}?`, `Yes. Choose Exactly this size. The file is first compressed to fit, then padded invisibly to exactly ${s.label}.`],
      ...EXACT.faqs.slice(0, 3),
    ],
  };
};

export async function generateMetadata({ params }) {
  const { size } = await params;
  const t = page(size);
  return t ? toolMetadata(t) : {};
}

export default async function Page({ params }) {
  const { size } = await params;
  const t = page(size);
  if (!t) return null;
  return (
    <ToolShell t={t} crumbs={[["Compress to Exact Size", EXACT.path], [SIZES[size].label, t.path]]}
      extra={
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Other sizes</h2>
          <ul className="flex flex-wrap gap-2">
            {Object.entries(SIZES).filter(([k]) => k !== size).map(([k, s]) => (
              <li key={k}><Link href={`${EXACT.path}/${k}`} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">Reduce to {s.label}</Link></li>
            ))}
            <li><Link href={EXACT.path} className="inline-block px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors">Any size</Link></li>
          </ul>
        </section>
      }
    >
      <ExactSizeTool initialTarget={SIZES[size].kb * 1024} />
    </ToolShell>
  );
}
