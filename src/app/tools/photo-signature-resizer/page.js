import Link from "next/link";
import PhotoResizer from "@/components/PhotoResizer";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { RESIZER } from "@/lib/tools-content";

const t = RESIZER.photo;
export const metadata = toolMetadata(t);

export default function Page() {
  return (
    <ToolShell t={t} crumbs={[["Photo & Signature Resizer", t.path]]}>
      <div className="flex justify-center gap-2 mb-8" aria-label="Choose what to resize">
        <span className="px-5 py-2 rounded-xl gradient-bg-orange text-white text-sm font-semibold">Photo</span>
        <Link href={RESIZER.signature.path} className="px-5 py-2 rounded-xl border border-border text-sm font-semibold text-muted hover:border-primary hover:text-primary">Signature</Link>
      </div>
      <PhotoResizer kind="photo" initialKB={t.kb} initialW={t.w} initialH={t.h} />
    </ToolShell>
  );
}
