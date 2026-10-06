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
        <p className="text-xs text-muted mb-8">Last updated: 5 October 2026</p>

        <p className={p}>Ganivotech (&quot;we&quot;) runs ganivotech.com. This page explains what happens to information when you use the site.</p>

        <h2 className={h2}>Our free tools</h2>
        <p className={p}>
          The QR Code Maker, Bulk QR from Excel, VCF Maker, PDF Maker, PDF Toolkit, Photo &amp; Signature Resizer, Compress to Exact Size and OCR to Excel &amp; Word work inside your browser. The details you type, the photos, documents, spreadsheets and PDFs you choose, and the files you create are not uploaded to or stored on our servers. In the PDF Toolkit this includes any password you type to open or lock a PDF: it is used only inside your browser and is not sent or saved.
        </p>
        <p className={p}>
          There are two small exceptions. In the QR Code Maker&apos;s Location option, the text you type in the place search box is sent to the Photon geocoding service (photon.komoot.io, based on OpenStreetMap data) to fetch suggestions. And the first time you use OCR to Excel &amp; Word, your browser downloads the open-source text-recognition engine and language data from a public content delivery network (cdn.jsdelivr.net), which can see that your browser requested those files. Your pictures and documents are never sent there.
        </p>

        <h2 className={h2}>Short Link Maker and link pages</h2>
        <p className={p}>
          Unlike our other tools, the Short Link Maker has to keep what you give it, because a short link only works if we remember where it goes. The QR Code Maker's Multiple Links option works the same way: the page title and the links you add are saved so the page can open when scanned. We store the destination address (or the link page), the name you chose, the optional title, an expiry date, a one-way hash of your manage key (we cannot see the key itself) and a daily-changing anonymous visitor hash that limits how many links one person can make. Each click on a short link records only the time, the site it came from, the device type and the country. Visits by search and preview bots are ignored and no IP address is stored. Anyone can report a link, and reported or abusive links can be switched off or removed. You can delete your link at any time with its manage key, which also deletes its click records.
        </p>

        <h2 className={h2}>Information we receive</h2>
        <p className={p}>
          Our hosting provider (Vercel) keeps standard server logs, such as IP address, browser and pages requested, to deliver and secure the site. If you send a message through the contact page, apply for SellerSync OS or Digital Desk, or email us, we store the details you give (such as your name, phone number, email address, business name and message) and use them only to reply to you about that enquiry. We also receive an email copy of each enquiry, sent through our email provider, Brevo.
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
