import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, FaqList, JsonLd, faqSchema } from "@/components/seo";
import { SITE } from "@/lib/qr-content";
import { PORTAL, TRANSPORT_FEATURES } from "@/lib/it-solutions";

const PATH = "/solutions/school-transport-erp";
const TITLE = "School Transport ERP: Bus Tracking, Fees, Parent App | GanivoTech";
const DESC = "One platform for school transport: live bus tracking, route planning, fee collection, parent and driver apps and an admin dashboard. Built by Ganivotech, Jaipur.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESC, url: PATH, type: "website", images: ["/solutions/school-transport-erp.jpg"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/solutions/school-transport-erp.jpg"] },
};

const FAQS = [
  ["What is a school transport ERP?", "It is one system that runs everything about getting students to school: bus routes, live tracking, driver and parent apps, fee collection, attendance and alerts, so staff do not have to phone drivers and parents."],
  ["Who uses it?", "Schools and their transport teams, plus the parents, drivers and teachers connected to them. Each group has its own login and its own screens."],
  ["Can it be customised for our school?", "Yes. It is built to be fitted to your institution's routes, fees and rules. Tell us how your transport works today and we will propose what to set up."],
  ["How do parents and staff reach each other?", "Through the platform: live tracking for parents, and alerts by WhatsApp, SMS, email and the app, so transport communication stays in one place."],
  ["Which devices does it work on?", "There is a web version for administrators, and mobile apps for drivers and parents. The iOS app is on the way."],
];

const h2 = "text-2xl sm:text-3xl font-bold mb-4";

export default function Page() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: "School Transport ERP", serviceType: "School transport management software", description: DESC, provider: { "@type": "Organization", name: "Ganivotech", url: SITE }, areaServed: "IN", url: `${SITE}${PATH}` }} />
      <JsonLd data={faqSchema(FAQS)} />
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["Clients and work", "/clients"], ["School Transport ERP", PATH]]} />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Built by Ganivotech</p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">School Transport ERP: one platform for every bus</h1>
              <p className="text-lg text-muted leading-relaxed mb-4">Teachers, drivers and the transport in-charge no longer need to phone each other. Parents see where the bus is. Fees, routes, attendance and alerts all live in one system that you control.</p>
              <p className="text-muted leading-relaxed mb-8">It is the platform behind GoConnect, our school transport service, and it can be fitted to your institution.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">Get a demo or a quote</Link>
                <a href={PORTAL} rel="noopener" className="px-6 py-3 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">Client login</a>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md rounded-3xl overflow-hidden border border-border shadow-sm bg-white">
              <Image src="/solutions/school-transport-erp.jpg" alt="School Transport ERP: live bus tracking on a parent's phone, with features including AI route planning, fee management, parent and driver apps and an admin dashboard" width={1024} height={1536} priority className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>What is included</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRANSPORT_FEATURES.map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border bg-background p-5">
                <p className="font-bold mb-1">{t}</p>
                <p className="text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>One place for all transport communication</h2>
          <p className="text-muted leading-relaxed mb-3">In many schools the transport office is run by phone calls: where is the bus, which stop, who has not paid. Here, each person has their own screen and the system sends the alerts.</p>
          <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed mb-10">
            <li><strong className="text-foreground">Parents</strong> follow the bus live and get updates.</li>
            <li><strong className="text-foreground">Drivers</strong> see their route and mark attendance in the driver app.</li>
            <li><strong className="text-foreground">Administrators</strong> control routes, fees and reports from one dashboard.</li>
            <li><strong className="text-foreground">Everyone</strong> is reached by WhatsApp, SMS, email or the app, depending on the message.</li>
          </ul>
          <h2 className={h2}>Web, Android and iOS</h2>
          <p className="text-muted leading-relaxed mb-10">A web solution for the office, an Android app for drivers and parents, and an iOS app on the way. It is fully customisable, tailored to your institution&apos;s needs.</p>
          <h2 className={h2}>Frequently asked questions</h2>
          <FaqList faqs={FAQS} />
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Run your school transport on one platform</h2>
          <p className="text-muted mb-5">Tell us about your buses and routes. We reply with a plan and a price.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">Talk to us</Link>
            <a href="https://wa.me/919252107911?text=Hi%2C%20I%20want%20to%20know%20about%20the%20School%20Transport%20ERP." className="px-6 py-3 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
