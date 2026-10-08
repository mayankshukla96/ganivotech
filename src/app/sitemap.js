import { GUIDES, SITE, TYPE_PAGES } from "@/lib/qr-content";
import { PDF_GUIDES } from "@/lib/pdf-content";
import { VCF_GUIDES } from "@/lib/vcf-content";
import { EXTENSIONS } from "@/lib/extensions";
import { BULK_TYPES, SIZES } from "@/lib/tools-content";
import { PDF_OPS } from "@/lib/pdf-toolkit-content";

const d = (s) => new Date(s);

export default function sitemap() {
  const pages = [
    ["/", "2026-10-04", 1],
    ["/tools/qr-generator", "2026-10-04", 1],
    ...Object.keys(TYPE_PAGES).map((t) => [`/tools/qr-generator/${t}`, "2026-10-04", 0.8]),
    ["/tools/vcf-maker", "2026-10-04", 0.8],
    ["/tools/pdf-maker", "2026-10-04", 0.8],
    ["/tools", "2026-10-04", 0.8],
    ["/tools/short-link-maker", "2026-10-05", 0.9],
    ["/tools/pdf-tools", "2026-10-05", 0.9],
    ...Object.values(PDF_OPS).map((t) => [t.path, "2026-10-05", 0.8]),
    ["/tools/passport-photo-maker", "2026-10-06", 0.9],
    ["/tools/image-converter", "2026-10-07", 0.9],
    ["/tools/visiting-card-maker", "2026-10-08", 0.9],
    ["/tools/photo-signature-resizer", "2026-10-04", 0.9],
    ["/tools/photo-signature-resizer/signature", "2026-10-04", 0.8],
    ["/tools/compress-to-exact-size", "2026-10-04", 0.9],
    ...Object.keys(SIZES).map((s) => [`/tools/compress-to-exact-size/${s}`, "2026-10-04", 0.8]),
    ["/tools/ocr-to-excel-word", "2026-10-04", 0.9],
    ["/tools/bulk-qr-code-generator", "2026-10-04", 0.9],
    ...Object.keys(BULK_TYPES).map((s) => [`/tools/bulk-qr-code-generator/${s}`, "2026-10-04", 0.8]),
    ["/products", "2026-10-04", 0.8],
    ["/products/sellersync-os", "2026-10-04", 0.9],
    ["/products/digital-desk", "2026-10-05", 0.9],
    ["/extensions", "2026-10-04", 0.8],
    ...Object.keys(EXTENSIONS).map((s) => [`/extensions/${s}`, "2026-10-04", 0.7]),
    ["/blog", "2026-10-04", 0.6],
    ["/blog/qr-code", "2026-10-04", 0.7],
    ...Object.entries(GUIDES).map(([s, g]) => [`/blog/qr-code/${s}`, g.date, 0.7]),
    ["/blog/pdf-maker", "2026-10-04", 0.7],
    ...Object.entries(PDF_GUIDES).map(([s, g]) => [`/blog/pdf-maker/${s}`, g.date, 0.7]),
    ["/blog/vcf-maker", "2026-10-04", 0.7],
    ...Object.entries(VCF_GUIDES).map(([s, g]) => [`/blog/vcf-maker/${s}`, g.date, 0.7]),
    ["/services", "2026-10-04", 0.6],
    ["/about", "2026-10-04", 0.5],
    ["/contact", "2026-10-04", 0.5],
    ["/privacy", "2026-10-04", 0.3],
    ["/terms", "2026-10-04", 0.3],
  ];
  return pages.map(([path, date, priority]) => ({ url: `${SITE}${path}`, lastModified: d(date), priority }));
}
