export const metadata = {
  title: { absolute: "Privacy Policy | GanivoTech" },
  description: "How Ganivotech handles your data: our QR, VCF and PDF tools run in your browser and do not upload what you enter.",
  alternates: { canonical: "/privacy" },
};

const h2 = "text-xl font-bold mt-8 mb-2";
const p = "text-muted leading-relaxed mb-3";

export default function Page() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted mb-8">Last updated: 4 October 2026</p>

        <p className={p}>Ganivotech (&quot;we&quot;) runs ganivotech.com. This page explains what happens to information when you use the site.</p>

        <h2 className={h2}>Our free tools</h2>
        <p className={p}>
          The QR Code Maker, Bulk QR from Excel, VCF Maker, PDF Maker, Photo &amp; Signature Resizer, Compress to Exact Size and OCR to Excel &amp; Word work inside your browser. The details you type, the photos, documents, spreadsheets and PDFs you choose, and the files you create are not uploaded to or stored on our servers.
        </p>
        <p className={p}>
          There are two small exceptions. In the QR Code Maker&apos;s Location option, the text you type in the place search box is sent to the Photon geocoding service (photon.komoot.io, based on OpenStreetMap data) to fetch suggestions. And the first time you use OCR to Excel &amp; Word, your browser downloads the open-source text-recognition engine and language data from a public content delivery network (cdn.jsdelivr.net), which can see that your browser requested those files. Your pictures and documents are never sent there.
        </p>

        <h2 className={h2}>Information we receive</h2>
        <p className={p}>
          Our hosting provider (Vercel) keeps standard server logs, such as IP address, browser and pages requested, to deliver and secure the site. If you contact us through the contact page or email, we receive the details you send and use them only to reply.
        </p>

        <h2 className={h2}>Cookies and analytics</h2>
        <p className={p}>
          We do not use advertising cookies or third-party analytics. We run our own simple, privacy-friendly page-view counter to understand how many people visit and which pages are useful. For each page view it records the page, the site you came from (for example Google or direct), your approximate area (country, region and city, derived by our host from your IP address), and your device type, browser and operating system.
        </p>
        <p className={p}>
          It does not set cookies and does not store your IP address. To count unique visitors it creates a one-way hash from your IP address and browser details that changes every day, so a visitor cannot be recognised across days or identified personally. Visits by known crawlers are ignored.
        </p>

        <h2 className={h2}>Ganivotech QR Studio browser extension</h2>
        <p className={p}>
          The extension creates and scans QR codes entirely on your device. It does not collect browsing history and sends nothing to us while you use it. The only data it sends is what you choose to type into the Suggest tab (your idea and an optional name), which we store so we can read your idea. It reads the address and title of the current tab only when you open the extension, to make a QR code of it. The extension&apos;s own links to ganivotech.com carry a tag so we can count visits that come from it.
        </p>

        <h2 className={h2}>Your choices</h2>
        <p className={p}>You can ask us to delete any message you sent us by contacting us through the <a href="/contact" className="text-primary underline">contact page</a>.</p>
      </div>
    </section>
  );
}
