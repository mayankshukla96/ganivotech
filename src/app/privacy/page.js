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
          The QR Code Maker, VCF Maker and PDF Maker work inside your browser. The details you type, the files you choose and the codes or files you create are not uploaded to or stored on our servers.
        </p>
        <p className={p}>
          The one exception is Location place search: the text you type in that box is sent to the Photon geocoding service (photon.komoot.io, based on OpenStreetMap data) to fetch suggestions. The QR code for a UPI, WiFi or contact code is never sent anywhere.
        </p>

        <h2 className={h2}>Information we receive</h2>
        <p className={p}>
          Our hosting provider (Vercel) keeps standard server logs, such as IP address, browser and pages requested, to deliver and secure the site. If you contact us through the contact page or email, we receive the details you send and use them only to reply.
        </p>

        <h2 className={h2}>Cookies and analytics</h2>
        <p className={p}>We do not currently use advertising cookies or analytics scripts. If that changes, we will update this page.</p>

        <h2 className={h2}>Your choices</h2>
        <p className={p}>You can ask us to delete any message you sent us by contacting us through the <a href="/contact" className="text-primary underline">contact page</a>.</p>
      </div>
    </section>
  );
}
