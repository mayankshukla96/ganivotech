import Link from "next/link";
import QRGenerator from "@/components/QRGenerator";
import { Breadcrumbs, FaqList, JsonLd, appSchema, faqSchema } from "@/components/seo";
import { QR_TYPES, typeHref } from "@/lib/qr-builders";
import { GUIDES, MAIN_FAQS } from "@/lib/qr-content";

const TITLE = "Free QR Code Generator – Create Custom QR Codes Online | GanivoTech";
const DESC =
  "Create free QR codes online with GanivoTech. Generate QR codes for URLs, WiFi, WhatsApp, text, vCards and more. Customize and download instantly — no signup required.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/tools/qr-generator" },
  openGraph: { title: TITLE, description: DESC, url: "/tools/qr-generator", type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

const TYPE_BLURB = {
  text: "Show a message, code or note when scanned",
  wifi: "Let guests join your WiFi without typing",
  whatsapp: "Open a WhatsApp chat with a ready message",
  vcard: "Save your contact details in one scan",
  email: "Open an email with subject and message filled in",
  phone: "Dial a number straight from the code",
  sms: "Open a text message that is already written",
  location: "Open a place in Google Maps for directions",
  event: "Add an event to the phone calendar",
  upi: "Open a UPI payment screen with your details",
};

const SCAN_TABLE = [
  ["URL", "Opens the website", "No"],
  ["Text", "Shows the text", "Yes"],
  ["WiFi", "Offers to join the network", "Yes"],
  ["WhatsApp", "Opens a chat with a pre-filled message", "No"],
  ["vCard", "Offers to save the contact", "Yes"],
  ["Email / SMS / Phone", "Opens the mail, message or dial app", "Yes (sending needs network)"],
  ["Location", "Opens Google Maps", "No"],
  ["Event", "Offers to add to calendar", "Yes"],
  ["UPI", "Opens the payment screen in a UPI app", "No"],
];

const h2 = "text-2xl font-bold mb-4";
const p = "text-muted leading-relaxed mb-4";

export default function Page() {
  return (
    <>
      <JsonLd data={appSchema("GanivoTech Free QR Code Generator", "/tools/qr-generator", DESC)} />
      <JsonLd data={faqSchema(MAIN_FAQS)} />

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["QR Code Generator", "/tools/qr-generator"]]} />
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Free QR Code <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto">
              Create custom QR codes for URLs, WiFi, WhatsApp, text, contacts and more. Generate and download your QR code instantly.
            </p>
            <p className="mt-3 text-sm font-medium text-primary">
              Free &bull; No signup &bull; No watermark &bull; Never expires
            </p>
          </header>
          <QRGenerator type="url" />
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="mb-12">
          <h2 className={h2}>Create a QR Code in Seconds</h2>
          <p className={p}>
            Paste a link, pick a style and download. This free QR code generator makes the code right in your browser, so it appears as you type and there is nothing to install or sign up for.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={h2}>What Can You Create With Our QR Code Generator?</h2>
          <p className={p}>Start with a website link above, or choose a dedicated generator:</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {Object.keys(TYPE_BLURB).map((id) => (
              <li key={id}>
                <Link href={typeHref(id)} className="block h-full rounded-xl border border-border bg-surface p-4 hover:border-primary transition-colors">
                  <span className="font-semibold text-sm">{QR_TYPES[id].label} QR code generator</span>
                  <span className="block text-xs text-muted mt-1">{TYPE_BLURB[id]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={h2}>Why Use GanivoTech QR Generator?</h2>
          <ul className="space-y-2 text-muted leading-relaxed list-disc pl-5">
            <li><strong>Free:</strong> every QR type, style option and download costs nothing.</li>
            <li><strong>No signup:</strong> no account, no email, no login.</li>
            <li><strong>No watermark:</strong> your QR code is clean and ready to print.</li>
            <li><strong>Never expires:</strong> codes are static, so they do not depend on our servers or a subscription.</li>
            <li><strong>Private:</strong> codes are generated in your browser and what you enter is not uploaded.</li>
            <li><strong>Print-ready:</strong> SVG for any size, PNG up to 2000 px, logo support and adjustable error correction.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={h2}>How to Create a QR Code</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted leading-relaxed mb-4">
            <li>Choose the type of QR code you need and enter the details.</li>
            <li>Pick a colour, pattern, corner style and optionally add your logo.</li>
            <li>Download the QR code as PNG or SVG.</li>
            <li>Test it with your phone, then print or share it.</li>
          </ol>
          <p className={p}>
            For reliable scanning, use a dark code on a light background, keep a clear margin around it, and print it at least 2 to 3 cm wide. Always scan the final printed version before you order a large print run.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={h2}>QR Code Types</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left">
                <tr>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">What happens on scan</th>
                  <th className="p-3 font-semibold">Works offline?</th>
                </tr>
              </thead>
              <tbody>
                {SCAN_TABLE.map(([a, b, c]) => (
                  <tr key={a} className="border-t border-border">
                    <td className="p-3 font-medium">{a}</td>
                    <td className="p-3 text-muted">{b}</td>
                    <td className="p-3 text-muted">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className={h2}>Static vs Dynamic QR Codes</h2>
          <p className={p}>
            A static QR code stores the information inside the pattern, so it never expires but cannot be edited after printing. A dynamic QR code points to a redirect run by a service, which allows edits and scan counts but stops working if that service or subscription ends. Every code made here is static. Read the full comparison in <Link className="text-primary underline" href={`/blog/qr-code/static-vs-dynamic-qr-codes`}>{GUIDES["static-vs-dynamic-qr-codes"].title}</Link>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={h2}>How QR Codes Work</h2>
          <p className={p}>
            A QR code is a grid of black and white squares called modules. The three large squares in the corners tell a scanner where the code is and which way is up. The rest of the grid stores your data along with error-correction information, which lets a scanner rebuild the data even if part of the code is dirty, damaged or covered by a logo. Higher error-correction levels (up to 30%) survive more damage but make the code denser. A blank margin around the code, called the quiet zone, helps scanners separate it from its surroundings.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={h2}>QR Code Use Cases</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted">
            {[
              ["Restaurants and cafes", "link menus, share WiFi and collect UPI payments"],
              ["Schools", "share event details, locations and staff contacts"],
              ["Shops", "open a WhatsApp chat or a payment screen from the counter"],
              ["Events", "add the date to calendars and guide guests to the venue"],
              ["Business cards", "let people save your contact with a single scan"],
              ["Real estate", "put the location and agent contact on site boards"],
            ].map(([a, b]) => (
              <li key={a} className="rounded-xl border border-border bg-surface p-4">
                <strong className="text-foreground">{a}:</strong> {b}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={h2}>Frequently Asked Questions</h2>
          <FaqList faqs={MAIN_FAQS} />
        </section>

        <section>
          <h2 className={h2}>More Free Tools and Guides</h2>
          <ul className="space-y-2 text-primary underline">
            <li><Link href="/tools/bulk-qr-code-generator">Bulk QR code generator: make hundreds of QR codes from an Excel list</Link></li>
            <li><Link href="/tools/vcf-maker">VCF Maker: turn a spreadsheet of contacts into one file</Link></li>
            <li><Link href="/tools/pdf-maker">PDF Maker: convert images and text files to PDF</Link></li>
            <li><Link href="/extensions/qr-studio">Ganivotech QR Studio: free Chrome extension to make and scan QR codes</Link></li>
            <li><Link href="/blog/qr-code">QR code guides</Link></li>
          </ul>
        </section>
      </article>
    </>
  );
}
