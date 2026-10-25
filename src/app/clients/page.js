import Image from "next/image";
import Link from "next/link";
import HappyClients from "@/components/HappyClients";
import { Breadcrumbs } from "@/components/seo";
import { PORTAL, SOLUTIONS } from "@/lib/it-solutions";

const TITLE = "Our Work and Clients: School Transport ERP and More | GanivoTech";
const DESC = "See what Ganivotech has built, including the GoConnect school transport platform, and sign in to your client portal or start a project with us.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/clients" },
  openGraph: { title: TITLE, description: DESC, url: "/clients", type: "website", images: ["/logo.jpg"] },
};

export default function Page() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={[["Home", "/"], ["Clients and work", "/clients"]]} />
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our work and our clients</h1>
          <p className="text-muted max-w-2xl mx-auto">Your business is yours. The IT is ours. Here is what we have built, and where our clients sign in.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-14">
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Existing clients</p>
            <h2 className="text-2xl font-bold mb-2">Client login</h2>
            <p className="text-muted mb-5">Schools, parents, drivers and teachers using the GoConnect transport platform sign in here.</p>
            <a href={PORTAL} rel="noopener" className="inline-block px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity">Open the client portal</a>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">New clients</p>
            <h2 className="text-2xl font-bold mb-2">Become our client</h2>
            <p className="text-muted mb-5">Tell us the problem. We reply with a plan and a fixed price, and look after the system after launch.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">Start a project</Link>
              <a href="https://wa.me/919252107911?text=Hi%2C%20I%20want%20to%20discuss%20a%20software%20project." className="px-6 py-3 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">WhatsApp us</a>
            </div>
          </div>
        </div>

        <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-6"><HappyClients /></div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Featured: GoConnect School Transport</h2>
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center rounded-3xl border border-border bg-surface p-6 sm:p-8 mb-14">
          <div className="mx-auto w-full max-w-xs rounded-2xl overflow-hidden border border-border bg-white">
            <Image src="/solutions/school-transport-erp.jpg" alt="GoConnect School Transport ERP features" width={1024} height={1536} className="w-full h-auto" />
          </div>
          <div>
            <p className="text-muted leading-relaxed mb-4">We built GoConnect, a school transport platform that replaces phone calls between teachers, drivers and the transport office with one system: live bus tracking, route planning, fee management, parent and driver apps, an admin dashboard and alerts by WhatsApp, SMS, email and app.</p>
            <ul className="list-disc pl-5 space-y-1 text-muted mb-6">
              <li>Parents follow the bus live</li>
              <li>Drivers get their route and mark attendance</li>
              <li>Administrators manage routes, fees and reports</li>
            </ul>
            <Link href="/solutions/school-transport-erp" className="inline-block px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">See the School Transport ERP</Link>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6">IT solutions we provide</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUTIONS.map((s) => (
            <li key={s.title}>
              <Link href={s.href} className="block h-full rounded-2xl border border-border bg-surface p-5 hover:border-primary transition-colors">
                <span className="block font-bold mb-1">{s.title}</span>
                <span className="block text-sm text-muted leading-relaxed">{s.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
