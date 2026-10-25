import Link from "next/link";
import { CLIENTS } from "@/lib/it-solutions";

// "Happy Clients" block. Each client is a card; the last card invites the next one.
export default function HappyClients({ heading = "Happy Clients" }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Trusted by</p>
          <h2 className="text-3xl sm:text-4xl font-bold">{heading}</h2>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CLIENTS.map((c) => (
            <li key={c.name}>
              <div className="h-full rounded-2xl border border-border bg-surface p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-11 h-11 rounded-xl gradient-bg text-white font-bold flex items-center justify-center shrink-0" aria-hidden="true">{c.name.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <p className="font-bold leading-tight">{c.name}</p>
                    <p className="text-xs text-primary font-semibold">{c.tag}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-4">{c.what}</p>
                {c.href && (c.external
                  ? <a href={c.href} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-semibold text-primary hover:underline">Visit website &rarr;</a>
                  : <Link href={c.href} className="mt-auto text-sm font-semibold text-primary hover:underline">See what we built &rarr;</Link>)}
              </div>
            </li>
          ))}
          <li>
            <Link href="/contact" className="h-full rounded-2xl border-2 border-dashed border-border p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
              <span className="font-bold mb-1">Your business next?</span>
              <span className="text-sm text-muted">Tell us the problem and we will build it.</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
