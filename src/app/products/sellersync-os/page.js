import Link from "next/link";
import PilotForm from "@/components/PilotForm";
import { Breadcrumbs, FaqList, JsonLd, faqSchema } from "@/components/seo";
import { SITE } from "@/lib/qr-content";

const TITLE = "SellerSync OS – Multichannel Inventory for Amazon, Flipkart, Meesho";
const DESC =
  "One central stock figure shared with every marketplace you sell on. SellerSync OS manages products, warehouses, stock and orders in one place. Pilot sellers welcome.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/products/sellersync-os" },
  openGraph: { title: TITLE, description: DESC, url: "/products/sellersync-os", type: "website", images: ["/logo.jpg"] },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/logo.jpg"] },
};

const PROBLEMS = [
  ["The same shirt, listed three times", "A seller on Amazon, Flipkart and Meesho has 12 shirts listed on each. When one sells, the other two still show 12 until someone updates them by hand."],
  ["Overselling", "Two marketplaces sell the last unit. One order is cancelled and the seller rating drops."],
  ["Hours of typing", "Stock is entered into each seller panel separately, every single day."],
  ["No single answer", "Nobody can say how much stock there really is, or why a number changed."],
  ["Errors found late", "Shelf and system disagree, and it surfaces only when an order fails."],
];

const FEATURES = [
  ["Stock", "One central stock figure", "Per SKU across all warehouses, split into physical, reserved, damaged and sellable."],
  ["History", "Every change explained", "Each movement is recorded for good. Click \"Why?\" to see what changed, when, and who caused it."],
  ["Catalogue", "Products, SKUs and barcodes", "Sizes and colours, one master SKU per variant, printable EAN-13, Code 128 and QR codes."],
  ["Warehouse", "Bins, transfers and counts", "Zones, racks and bins with scannable codes. Transfers in transit are never double-sold. Count differences wait for approval."],
  ["Orders", "All channels in one list", "Stock is reserved the moment an order arrives. The same order notice arriving twice is counted once."],
  ["Phone", "Scan with your phone", "Photograph a barcode, then receive stock or record a count on the warehouse floor."],
  ["Alerts", "It tells you first", "Low stock, what to buy, unsold stock, stock mismatches and a daily summary."],
  ["Team", "Right access for each person", "Twelve ready roles. A picker can count stock but cannot change a price."],
  ["Trust", "Audit log and data separation", "Who changed what, with before and after. It cannot be edited. Each business sees only its own data."],
];

const STEPS = [
  ["Set up once", "Add products, warehouses and opening stock."],
  ["Connect a marketplace", "Listings are imported and matched to your SKUs. You confirm each match."],
  ["Choose what each channel may sell", "All sellable stock, a fixed quantity, or a percentage."],
  ["Switch stock sync on", "Nothing is published until you do."],
  ["An order arrives", "Stock is reserved at once and every other channel gets the new figure."],
  ["Ship or cancel", "Shipping removes the stock. Cancelling releases it."],
];

const MARKETS = [
  ["Amazon", "Works", "In development", "The seller authorises SellerSync through Amazon's official Selling Partner programme."],
  ["Flipkart", "Works", "In development", "API access details from the seller's Flipkart dashboard."],
  ["Meesho", "Works", "Depends on Meesho", "Meesho gives API access to approved partners only. It must approve SellerSync first."],
];

const NEXT = [
  "Live Flipkart connection, then live Amazon",
  "Automatic order fetching from live marketplaces",
  "Pick, pack and dispatch on the phone, with wrong-item checks",
  "Returns and RTO with a quality check",
  "Purchase orders and supplier records",
  "Settlement matching and true profit per order",
  "Alerts by email and WhatsApp",
  "Android app for warehouse staff",
];

const FAQS = [
  ["Is SellerSync OS connected to Amazon and Flipkart today?", "Not yet. The full flow works today against a built-in demonstration marketplace. Live connections to the real marketplaces are being built with pilot sellers, starting with Flipkart and then Amazon. Meesho gives API access to approved partners only, so it depends on Meesho approving SellerSync."],
  ["Which marketplaces will it support?", "Amazon, Flipkart and Meesho. Each live connection depends on the access that marketplace provides."],
  ["Do I need to give you my marketplace password?", "No. SellerSync uses only the official, authorised connections each marketplace provides. It never stores marketplace passwords and never automates a seller panel."],
  ["Do I need to install an app?", "No. SellerSync opens in the phone browser, including barcode scanning. An Android app for warehouse staff is on the roadmap."],
  ["Will other sellers see my data?", "No. Each business sees only its own data, and every change is kept in an audit log that cannot be edited."],
  ["How much does it cost?", "There is no public price yet. Pilot sellers get a reduced price, to be agreed with you."],
  ["What does the pilot involve?", "You use the product for inventory, warehouses, counts, transfers and phone scanning. We do the setup for you, including catalogue import and staff training, and you get first access to the live Flipkart and Amazon connections. We ask for your product list, your storage locations, API access guided by us, and one person to give feedback each week."],
];

const h2 = "text-2xl sm:text-3xl font-bold mb-3";

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "SellerSync OS",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web browser",
          description: DESC,
          url: `${SITE}/products/sellersync-os`,
          publisher: { "@type": "Organization", name: "Ganivotech", url: SITE },
        }}
      />
      <JsonLd data={faqSchema(FAQS)} />

      {/* Hero */}
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[["Home", "/"], ["Premium Products", "/products"], ["SellerSync OS", "/products/sellersync-os"]]} />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-semibold">Pilot sellers welcome</span>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">SellerSync <span className="gradient-text">OS</span></h1>
              <p className="text-xl font-semibold mb-3">Sell everywhere. Manage everything. One inventory.</p>
              <p className="text-muted leading-relaxed mb-6">One stock figure for your whole business, shared with every marketplace you sell on. Products, warehouses, stock and orders in a single screen.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#pilot" className="px-7 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">Join the pilot</a>
                <a href="#how" className="px-7 py-3.5 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">See how it works</a>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6" role="img" aria-label="One central stock of 11 shared with Amazon, Flipkart and Meesho">
              <p className="text-xs font-semibold tracking-widest text-muted text-center mb-3">CENTRAL STOCK &middot; TS-BLK-M</p>
              <div className="mx-auto w-28 h-28 rounded-2xl gradient-bg flex flex-col items-center justify-center text-white mb-4">
                <span className="text-4xl font-bold">11</span><span className="text-xs">in stock</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[["Amazon", "in stock"], ["Flipkart", "1 just sold here"], ["Meesho", "in stock"]].map(([n, s]) => (
                  <div key={n} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs font-semibold text-muted">{n}</p>
                    <p className="text-2xl font-bold text-primary-dark">11</p>
                    <p className="text-[11px] text-muted">{s}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-center text-muted">Example. When Flipkart sells one, Amazon and Meesho update to match.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>Selling on many marketplaces is hard to keep straight</h2>
          <p className="text-muted mb-8 max-w-2xl">These are the problems SellerSync OS is built to remove.</p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROBLEMS.map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="font-semibold mb-1.5">{t}</h3>
                <p className="text-sm text-muted leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>What you get today</h2>
          <p className="text-muted mb-8">Everything here works in the product now.</p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {FEATURES.map(([tag, t, d]) => (
              <li key={tag} className="rounded-2xl border border-border bg-background p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{tag}</span>
                <h3 className="font-semibold mt-1 mb-1.5">{t}</h3>
                <p className="text-sm text-muted leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-background p-5 overflow-x-auto">
              <p className="text-xs font-semibold text-muted mb-3">STOCK (example data)</p>
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted"><tr><th className="py-2 font-medium">SKU</th><th className="py-2 font-medium">Physical</th><th className="py-2 font-medium">Reserved</th><th className="py-2 font-medium">Sellable</th></tr></thead>
                <tbody>
                  {[["TS-BLK-M", 12, 1, 11], ["JN-BLU-32", 25, 3, 22], ["SH-SPT-9", 4, 2, 2]].map(([s, p, r, a]) => (
                    <tr key={s} className="border-t border-border/60"><td className="py-2 font-mono text-xs">{s}</td><td className="py-2">{p}</td><td className="py-2">{r}</td><td className="py-2 font-semibold">{a}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-semibold text-muted mb-3">&quot;WHY?&quot; (example)</p>
              <p className="font-semibold text-sm mb-2">Why did TS-BLK-M change from 12 to 11?</p>
              <p className="text-sm text-muted leading-relaxed">Reserved +1 for Flipkart order FK12345</p>
              <p className="text-xs text-muted mt-1">Today 10:31 am, by System. Amazon and Meesho updated to 11.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-14 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>How it works</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
                <span className="shrink-0 w-9 h-9 rounded-full gradient-bg-orange text-white flex items-center justify-center font-bold">{i + 1}</span>
                <div><h3 className="font-semibold mb-1">{t}</h3><p className="text-sm text-muted leading-relaxed">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Phone */}
      <section className="py-14 sm:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className={h2}>The warehouse in your pocket</h2>
            <p className="text-muted mb-5">Open SellerSync in the phone browser. No app to install.</p>
            <ol className="space-y-4">
              {[["Photograph the barcode", "Or use a Bluetooth scanner, or type the code."], ["See the SKU and its stock", "By warehouse and bin, with a beep to confirm."], ["Receive stock or save a count", "Two large buttons. The history records who did it."]].map(([t, d], i) => (
                <li key={t} className="flex gap-3"><span className="font-bold text-primary">{i + 1}.</span><p className="text-sm"><strong>{t}.</strong> <span className="text-muted">{d}</span></p></li>
              ))}
            </ol>
          </div>
          <div className="mx-auto w-64 rounded-[2rem] border-8 border-primary-dark bg-background p-4 text-center" role="img" aria-label="Phone showing a scanned barcode matched to SKU TS-BLK-M">
            <p className="text-xs font-semibold text-muted mb-2">Scan</p>
            <p className="font-mono text-sm mb-1">2843436050595</p>
            <p className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-[11px] font-bold mb-3">FOUND</p>
            <p className="font-semibold">TS-BLK-M</p>
            <p className="text-xs text-muted mb-4">Physical 12 &middot; Sellable 11</p>
            <div className="grid grid-cols-2 gap-2"><span className="py-2 rounded-lg gradient-bg text-white text-xs font-semibold">Receive stock</span><span className="py-2 rounded-lg border border-border text-xs font-semibold">Save count</span></div>
            <p className="mt-3 text-[10px] text-muted">Example screen</p>
          </div>
        </div>
      </section>

      {/* Marketplaces */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>Marketplace connections: where things stand</h2>
          <p className="text-muted mb-6 max-w-3xl">The full flow works today against a built-in demonstration marketplace. Live connections to the real marketplaces are being built with pilot sellers and are not available yet.</p>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left"><tr><th className="p-3 font-semibold">Marketplace</th><th className="p-3 font-semibold">Demonstration</th><th className="p-3 font-semibold">Live connection</th><th className="p-3 font-semibold">What is needed</th></tr></thead>
              <tbody>{MARKETS.map(([m, d, l, n]) => <tr key={m} className="border-t border-border align-top"><td className="p-3 font-medium">{m}</td><td className="p-3">{d}</td><td className="p-3">{l}</td><td className="p-3 text-muted">{n}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="text-sm text-muted">SellerSync uses only the official, authorised connections each marketplace provides. It never stores marketplace passwords and never automates a seller panel.</p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-14 sm:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>What is coming next</h2>
          <p className="text-muted mb-6">In planned order.</p>
          <ol className="grid sm:grid-cols-2 gap-3">
            {NEXT.map((n, i) => (
              <li key={n} className="flex gap-3 rounded-xl border border-border bg-background p-4 text-sm"><span className="font-bold text-primary">{i + 1}</span>{n}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pilot */}
      <section id="pilot" className="py-14 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div>
            <h2 className={h2}>Join the pilot</h2>
            <p className="text-muted mb-6">We are taking a small number of pilot sellers now.</p>
            <h3 className="font-semibold mb-2">What you get</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted mb-6">
              <li>Full use of the product for inventory, warehouses, counts, transfers and phone scanning</li>
              <li>Setup done for you: catalogue import and staff training</li>
              <li>First access to the live Flipkart and Amazon connections</li>
              <li>A reduced price during the pilot, to be agreed</li>
            </ul>
            <h3 className="font-semibold mb-2">What we need from you</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted">
              <li>Your product list with SKU codes and current stock</li>
              <li>Your warehouse or storage locations</li>
              <li>API access from your Flipkart or Amazon seller account, with our guidance</li>
              <li>One person to give feedback each week</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <PilotForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>Frequently asked questions</h2>
          <div className="mt-6"><FaqList faqs={FAQS} /></div>
          <p className="mt-8 text-sm text-muted">More from Ganivotech: <Link href="/products" className="text-primary underline">all premium products</Link>, <Link href="/tools" className="text-primary underline">free tools</Link>.</p>
        </div>
      </section>
    </>
  );
}
