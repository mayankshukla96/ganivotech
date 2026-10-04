"use client";

import { useState } from "react";

const MARKETS = ["Amazon", "Flipkart", "Meesho", "Other"];
const field = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";

export default function PilotForm() {
  const [v, setV] = useState({ name: "", phone: "", email: "", business: "", skus: "", message: "", website: "" });
  const [markets, setMarkets] = useState([]);
  const [state, setState] = useState({ busy: false, ok: false, err: "" });
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, ok: false, err: "" });
    try {
      const details = [markets.length ? `Sells on: ${markets.join(", ")}` : "", v.skus ? `About ${v.skus} products` : ""].filter(Boolean).join(" | ");
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "sellersync-os", name: v.name, phone: v.phone, email: v.email, business: v.business, details, message: v.message, website: v.website }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "Could not send. Please try again.");
      setState({ busy: false, ok: true, err: "" });
    } catch (x) {
      setState({ busy: false, ok: false, err: x.message });
    }
  }

  if (state.ok)
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-xl font-bold text-green-800 mb-2">Thank you, we have your application.</p>
        <p className="text-sm text-green-800">We will contact you on the details you gave. Keep your product list with SKU codes ready.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label htmlFor="pf-name" className="block text-sm font-medium mb-1.5">Your name *</label><input id="pf-name" required value={v.name} onChange={set("name")} className={field} autoComplete="name" /></div>
        <div><label htmlFor="pf-biz" className="block text-sm font-medium mb-1.5">Business name</label><input id="pf-biz" value={v.business} onChange={set("business")} className={field} autoComplete="organization" /></div>
        <div><label htmlFor="pf-phone" className="block text-sm font-medium mb-1.5">WhatsApp / phone *</label><input id="pf-phone" type="tel" value={v.phone} onChange={set("phone")} className={field} autoComplete="tel" placeholder="+91 98765 43210" /></div>
        <div><label htmlFor="pf-email" className="block text-sm font-medium mb-1.5">Email</label><input id="pf-email" type="email" value={v.email} onChange={set("email")} className={field} autoComplete="email" /></div>
      </div>
      <p className="text-xs text-muted -mt-2">Give a phone number or an email (or both) so we can reach you.</p>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">Where do you sell?</legend>
        <div className="flex flex-wrap gap-2">
          {MARKETS.map((m) => {
            const on = markets.includes(m);
            return (
              <button key={m} type="button" aria-pressed={on} onClick={() => setMarkets((a) => (on ? a.filter((x) => x !== m) : [...a, m]))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`}>{m}</button>
            );
          })}
        </div>
      </fieldset>

      <div><label htmlFor="pf-skus" className="block text-sm font-medium mb-1.5">Roughly how many products (SKUs)?</label><input id="pf-skus" inputMode="numeric" value={v.skus} onChange={set("skus")} className={field} placeholder="e.g. 150" /></div>
      <div><label htmlFor="pf-msg" className="block text-sm font-medium mb-1.5">Anything we should know?</label><textarea id="pf-msg" rows={3} value={v.message} onChange={set("message")} className={field + " resize-y"} /></div>

      {/* honeypot: hidden from people, bots tend to fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} /></label></div>

      {state.err && <p role="alert" className="text-sm text-red-600">{state.err}</p>}
      <button disabled={state.busy} className="w-full sm:w-auto px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
        {state.busy ? "Sending..." : "Apply for the pilot"}
      </button>
      <p className="text-xs text-muted">We use your details only to reply about SellerSync OS. See our <a href="/privacy" className="text-primary underline">privacy policy</a>.</p>
    </form>
  );
}
