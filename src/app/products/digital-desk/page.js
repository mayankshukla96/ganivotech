import Link from "next/link";
import DeskForm from "@/components/DeskForm";
import { Breadcrumbs, FaqList, JsonLd, faqSchema } from "@/components/seo";
import { SITE } from "@/lib/qr-content";

const TITLE = "Digital Desk – Managed IT for Small Businesses | GanivoTech";
const DESC =
  "Your IT and digital department for a fixed monthly fee. Ganivotech sets up and looks after your website, email, WhatsApp, security and software. Book a free review.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/products/digital-desk" },
  openGraph: { title: TITLE, description: DESC, url: "/products/digital-desk", type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

const AREAS = [
  ["Website care", ["Watch for the site going down, and for the SSL certificate and domain about to expire", "A monthly check of speed, SEO and broken links", "Small fixes and content updates, using a number of hours agreed up front"]],
  ["Business email and domain", ["Business email set up properly, with the records that stop your mail landing in spam (SPF, DKIM and DMARC)", "A register of your domains and renewals, so nothing expires by surprise"]],
  ["WhatsApp and customer contact", ["WhatsApp Business profile, catalogue and quick replies", "A click-to-chat link and QR code for your shop or counter", "Your Google Business Profile, kept correct"]],
  ["Security basics", ["A password manager and two-step login on your important accounts", "Backups checked, and a simple checklist for when a staff member leaves", "Safe habits for staff: scam messages, fake UPI requests, public WiFi"]],
  ["Choosing and setting up software", ["Help picking accounting, billing, inventory or CRM tools that fit your size and budget", "Set-up and a short walk-through, using tools you already own where possible"]],
  ["People and support", ["A short training session for your staff", "One contact for IT problems, instead of searching for someone each time", "A monthly review of what was done and what comes next"]],
];

const STEPS = [
  ["Free review", "We look at your website, email, tools and how your team works, and ask where it hurts."],
  ["A written plan", "You get a clear list of what we will do and a fixed monthly price. Nothing starts until you agree."],
  ["Set-up month", "We fix the most important things first, such as email, backups, key accounts and website basics."],
  ["Every month", "Support, small fixes, a check of everything, and a short review with you."],
];

const FITS = ["Shops and distributors", "Clinics and healthcare practices", "Coaching centres and schools", "Online and marketplace sellers", "Agencies and professional firms", "Local service businesses"];

const NOT = [
  "It does not replace your accountant, your lawyer or a full-time IT team. We work alongside them.",
  "Costs of third-party services, such as domains, hosting, software licences and WhatsApp messages, are paid by you at actual cost. We tell you before anything is bought.",
  "We do not promise search rankings or sales. We promise that the technical basics are set up, checked and looked after.",
  "Your accounts stay in your name. We ask only for the access we need.",
];

const FAQS = [
  ["How much does Digital Desk cost?", "It is a fixed monthly fee, agreed in writing after the free review, because it depends on the size of your business and what you need. There is no public price list yet."],
  ["How is this different from buying software?", "Software gives you tools. Digital Desk gives you someone to choose the right tools, set them up, and keep everything running, so you can focus on your business."],
  ["We already have someone for IT. Can you still help?", "Yes. We can support them with monitoring, set-up and staff training, or cover the areas they don't have time for."],
  ["Do you work remotely or on site?", "Most of the work is done remotely. Anything else is agreed with you in advance."],
  ["What do I need to prepare for the review?", "Your website address, the email and tools you use today, and a rough idea of what is giving you trouble. If you are not sure, that is fine, we will ask."],
  ["Who owns my website, domain and accounts?", "You do. We set things up in your name and ask only for the access we need, so you can change provider whenever you like."],
];

const h2 = "text-2xl sm:text-3xl font-bold mb-3";

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Digital Desk",
          serviceType: "Managed IT and digital support for small businesses",
          description: DESC,
          areaServed: { "@type": "Country", name: "India" },
          url: `${SITE}/products/digital-desk`,
          provider: { "@type": "Organization", name: "Ganivotech", url: SITE },
        }}
      />
      <JsonLd data={faqSchema(FAQS)} />

      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["Premium Products", "/products"], ["Digital Desk", "/products/digital-desk"]]} />
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-semibold">Taking first clients</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Digital <span className="gradient-text">Desk</span></h1>
            <p className="text-xl font-semibold mb-3">Your IT and digital department, for a fixed monthly fee.</p>
            <p className="text-muted leading-relaxed mb-6">Most small businesses don&apos;t lack software. They lack someone to choose it, set it up and keep it running. Ganivotech takes that job: your website, email, WhatsApp, security and tools, looked after every month.</p>
            <div className="flex flex-wrap gap-3">
              <a href="#review" className="px-7 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">Book a free review</a>
              <a href="#included" className="px-7 py-3.5 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">What is included</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>The problem is rarely the software</h2>
          <p className="text-muted max-w-3xl mb-4">
            An Indian industry report found that <a href="https://www.ciol.com/digital-transformation/msme-day-2026-india-small-businesses-ai-digital-adoption-12111317" target="_blank" rel="noopener noreferrer" className="text-primary underline">over half of small businesses find it difficult to choose the right digital tools</a>, and many lack in-house digital skills. The result is a website nobody updates, email that lands in spam, passwords shared on WhatsApp, and software that was bought but never set up.
          </p>
          <p className="text-muted max-w-3xl">Digital Desk replaces that with one team you can call, and one monthly fee.</p>
        </div>
      </section>

      <section id="included" className="py-14 sm:py-20 bg-surface scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>What we set up and look after</h2>
          <p className="text-muted mb-8">Your plan is built from these areas. The review decides which ones you need first.</p>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AREAS.map(([t, items]) => (
              <li key={t} className="rounded-2xl border border-border bg-background p-5">
                <h3 className="font-semibold mb-3">{t}</h3>
                <ul className="space-y-2 text-sm text-muted leading-relaxed">
                  {items.map((i) => <li key={i} className="flex gap-2"><span className="text-primary" aria-hidden="true">&#10003;</span><span>{i}</span></li>)}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">Where it helps, your plan also includes our <Link href="/tools" className="text-primary underline">free tools</Link>, and <Link href="/products/sellersync-os" className="text-primary underline">SellerSync OS</Link> for marketplace sellers.</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>How it works</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-border bg-surface p-5">
                <span className="w-9 h-9 rounded-full gradient-bg-orange text-white flex items-center justify-center font-bold mb-3">{i + 1}</span>
                <h3 className="font-semibold mb-1">{t}</h3>
                <p className="text-sm text-muted leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className={h2}>Who it is for</h2>
            <p className="text-muted mb-4">Businesses with a handful to a few dozen people and no dedicated IT person.</p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {FITS.map((f) => <li key={f} className="rounded-xl border border-border bg-background px-4 py-3">{f}</li>)}
            </ul>
          </div>
          <div>
            <h2 className={h2}>What it is not</h2>
            <ul className="space-y-3 text-sm text-muted leading-relaxed list-disc pl-5">
              {NOT.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="review" className="py-14 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div>
            <h2 className={h2}>Book a free review</h2>
            <p className="text-muted mb-5">Tell us about your business. We will contact you to look at your website, email and tools together, and tell you plainly what we would fix first.</p>
            <ul className="space-y-2 text-sm text-muted list-disc pl-5">
              <li>No payment and no commitment for the review</li>
              <li>You get a written plan and a fixed monthly price before anything starts</li>
              <li>Your details are used only to reply to you</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8"><DeskForm /></div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>Frequently asked questions</h2>
          <div className="mt-6"><FaqList faqs={FAQS} /></div>
          <p className="mt-8 text-sm text-muted">More from Ganivotech: <Link href="/products" className="text-primary underline">all premium products</Link>, <Link href="/services" className="text-primary underline">our services</Link>, <Link href="/contact" className="text-primary underline">contact us</Link>.</p>
        </div>
      </section>
    </>
  );
}
