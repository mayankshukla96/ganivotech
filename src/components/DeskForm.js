"use client";

import { useState } from "react";

const BUSINESS = ["Shop or retail", "Clinic or healthcare", "Coaching or school", "Online seller", "Agency or professional services", "Other"];
const NEEDS = ["Website", "Business email", "WhatsApp Business", "Security basics", "Choosing software", "Staff training", "Not sure yet"];
const field = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";

export default function DeskForm() {
  const [v, setV] = useState({ name: "", business: "", type: "", phone: "", email: "", message: "", website: "" });
  const [needs, setNeeds] = useState([]);
  const [state, setState] = useState({ busy: false, ok: false, err: "" });
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, ok: false, err: "" });
    try {
      const details = [v.type && `Type: ${v.type}`, needs.length && `Needs: ${needs.join(", ")}`].filter(Boolean).join(" | ");
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "digital-desk", name: v.name, phone: v.phone, email: v.email, business: v.business, details, message: v.message, website: v.website }),
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
        <p className="text-xl font-bold text-green-800 mb-2">Thank you, we have your request.</p>
        <p className="text-sm text-green-800">We will contact you to arrange your free review.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label htmlFor="dd-name" className="block text-sm font-medium mb-1.5">Your name *</label><input id="dd-name" required value={v.name} onChange={set("name")} className={field} autoComplete="name" /></div>
        <div><label htmlFor="dd-biz" className="block text-sm font-medium mb-1.5">Business name</label><input id="dd-biz" value={v.business} onChange={set("business")} className={field} autoComplete="organization" /></div>
        <div><label htmlFor="dd-phone" className="block text-sm font-medium mb-1.5">WhatsApp / phone *</label><input id="dd-phone" type="tel" value={v.phone} onChange={set("phone")} className={field} autoComplete="tel" placeholder="+91 98765 43210" /></div>
        <div><label htmlFor="dd-email" className="block text-sm font-medium mb-1.5">Email</label><input id="dd-email" type="email" value={v.email} onChange={set("email")} className={field} autoComplete="email" /></div>
      </div>
      <p className="text-xs text-muted -mt-2">Give a phone number or an email (or both) so we can reach you.</p>

      <div>
        <label htmlFor="dd-type" className="block text-sm font-medium mb-1.5">What kind of business?</label>
        <select id="dd-type" value={v.type} onChange={set("type")} className={field}>
          <option value="">Select</option>
          {BUSINESS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">What do you need help with?</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((n) => {
            const on = needs.includes(n);
            return (
              <button key={n} type="button" aria-pressed={on} onClick={() => setNeeds((a) => (on ? a.filter((x) => x !== n) : [...a, n]))}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`}>{n}</button>
            );
          })}
        </div>
      </fieldset>

      <div><label htmlFor="dd-msg" className="block text-sm font-medium mb-1.5">Tell us a little about your business</label><textarea id="dd-msg" rows={3} value={v.message} onChange={set("message")} className={field + " resize-y"} /></div>

      <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} /></label></div>

      {state.err && <p role="alert" className="text-sm text-red-600">{state.err}</p>}
      <button disabled={state.busy} className="w-full sm:w-auto px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
        {state.busy ? "Sending..." : "Book my free review"}
      </button>
      <p className="text-xs text-muted">We use your details only to reply about Digital Desk. See our <a href="/privacy" className="text-primary underline">privacy policy</a>.</p>
    </form>
  );
}
