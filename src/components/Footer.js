import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Premium Products" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Services: [
    { href: "/services", label: "Web Development" },
    { href: "/services", label: "App Development" },
    { href: "/services", label: "Cloud Solutions" },
    { href: "/services", label: "IT Consulting" },
  ],
  "Free Tools": [
    { href: "/tools/qr-generator", label: "Free QR Code Generator" },
    { href: "/tools/qr-generator/wifi", label: "WiFi QR Code" },
    { href: "/tools/bulk-qr-code-generator", label: "Bulk QR from Excel" },
    { href: "/tools/vcf-maker", label: "VCF Maker" },
    { href: "/tools/pdf-maker", label: "PDF Maker" },
    { href: "/tools/photo-signature-resizer", label: "Photo & Signature Resizer" },
    { href: "/tools/compress-to-exact-size", label: "Compress to Exact Size" },
    { href: "/tools/ocr-to-excel-word", label: "OCR to Excel & Word" },
    { href: "/extensions", label: "Chrome Extensions" },
    { href: "/blog/qr-code", label: "QR Code Guides" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.jpg"
                alt="Ganivotech"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary-dark">Ganivo</span>
                <span className="text-secondary">tech</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Empowering businesses with innovative IT solutions. Your trusted
              technology partner for growth and digital transformation.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Ganivotech. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
