export const metadata = {
  title: { absolute: "Terms of Service | GanivoTech" },
  description: "Terms for using ganivotech.com and its free QR code, VCF and PDF tools.",
  alternates: { canonical: "/terms" },
};

const h2 = "text-xl font-bold mt-8 mb-2";
const p = "text-muted leading-relaxed mb-3";

export default function Page() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-xs text-muted mb-8">Last updated: 4 October 2026</p>

        <h2 className={h2}>Using the site</h2>
        <p className={p}>By using ganivotech.com you agree to these terms. The free tools are provided for lawful use only.</p>

        <h2 className={h2}>Your content</h2>
        <p className={p}>
          You are responsible for what you put into a QR code, contact file or PDF, and for having the right to share it. Do not use the tools for illegal content, scams, phishing or to impersonate others.
        </p>

        <h2 className={h2}>No warranty</h2>
        <p className={p}>
          The tools are provided &quot;as is&quot;. Always test a QR code with a phone before printing or relying on it. In particular, check UPI, WiFi and contact codes before sharing them. We are not liable for loss caused by an incorrect code, a changed destination link or misuse.
        </p>

        <h2 className={h2}>Payments</h2>
        <p className={p}>
          Ganivotech does not process payments. The UPI QR generator only creates a code from details you enter. We are not affiliated with NPCI or any payment app.
        </p>

        <h2 className={h2}>Changes</h2>
        <p className={p}>We may update these terms and the tools from time to time. Continued use means you accept the updated terms. Questions? Visit the <a href="/contact" className="text-primary underline">contact page</a>.</p>
      </div>
    </section>
  );
}
