import Link from "next/link";

export default function WorkWithUs() {
  return (
    <aside className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Need a website, app or IT help for your business?</h2>
        <p className="text-sm text-muted mb-5">The tools are free. If you need something built for you, tell us what you need and we will reply with a plan and a price.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">Talk to us</Link>
          <Link href="/services" className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:border-primary transition-colors">See our services</Link>
        </div>
      </div>
    </aside>
  );
}
