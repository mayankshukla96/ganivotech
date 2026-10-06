"use client";

import { useState } from "react";
import { checkPage, aliasProblem } from "@/lib/short-links";

const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const ghost = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-30";
const EMPTY = [{ label: "", url: "" }, { label: "", url: "" }];

// "One QR code, many links": the page is saved on this site and the QR code holds its short address.
export default function LinkPageForm({ fields, setFields }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rows, setRows] = useState(EMPTY);
  const [alias, setAlias] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [key, setKey] = useState("");

  const edit = (i, patch) => { setRows(rows.map((r, k) => (k === i ? { ...r, ...patch } : r))); setFields((f) => ({ ...f, short: "" })); setKey(""); };

  async function make() {
    setErr("");
    const page = { title, desc, links: rows };
    const c = checkPage(page);
    if (!c.ok) return setErr(c.error);
    if (alias.trim() && aliasProblem(alias.trim().toLowerCase())) return setErr(aliasProblem(alias.trim().toLowerCase()));
    setBusy(true);
    const r = await fetch("/api/short/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ page, alias: alias.trim(), expires: "never", website: hp }) })
      .then((x) => x.json()).catch(() => ({ ok: false, error: "Could not reach the server. Check your internet and try again." }));
    setBusy(false);
    if (!r.ok) return setErr(r.error);
    try {
      const list = JSON.parse(localStorage.getItem("gt_short_links") || "[]");
      localStorage.setItem("gt_short_links", JSON.stringify([{ alias: r.alias, key: r.key, url: r.url, title: title.trim(), created: Date.now() }, ...list]));
    } catch {}
    setKey(r.key);
    setFields((f) => ({ ...f, short: r.short }));
  }

  return (
    <div>
      <label htmlFor="lp-t" className="block text-sm font-medium mb-1.5">Page title</label>
      <input id="lp-t" value={title} onChange={(e) => { setTitle(e.target.value); setFields((f) => ({ ...f, short: "" })); setKey(""); }} maxLength={60} placeholder="Sharma Sweets" className={field + " mb-3"} />
      <label htmlFor="lp-d" className="block text-sm font-medium mb-1.5">Short line under it (optional)</label>
      <input id="lp-d" value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={140} placeholder="Order, find us or call us" className={field + " mb-4"} />

      <p className="text-sm font-medium mb-2">Your links (2 to 12)</p>
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="rounded-xl border border-border bg-background p-3">
            <div className="grid sm:grid-cols-2 gap-2">
              <input aria-label={`Button name ${i + 1}`} value={r.label} onChange={(e) => edit(i, { label: e.target.value })} maxLength={40} placeholder="Instagram" className={field} />
              <input aria-label={`Link ${i + 1}`} value={r.url} onChange={(e) => edit(i, { url: e.target.value })} placeholder="https://instagram.com/yourshop" inputMode="url" className={field} />
            </div>
            {rows.length > 2 && <button type="button" onClick={() => { setRows(rows.filter((_, k) => k !== i)); setFields((f) => ({ ...f, short: "" })); }} className={ghost + " mt-2"}>Remove</button>}
          </li>
        ))}
      </ul>
      {rows.length < 12 && <button type="button" onClick={() => setRows([...rows, { label: "", url: "" }])} className={ghost + " mt-3"}>+ Add another link</button>}

      <label htmlFor="lp-a" className="block text-sm font-medium mb-1.5 mt-4">Page name in the address (optional)</label>
      <div className="flex items-stretch rounded-xl border border-border bg-background overflow-hidden focus-within:border-primary">
        <span className="px-3 flex items-center text-xs text-muted bg-surface border-r border-border whitespace-nowrap">ganivotech.com/go/</span>
        <input id="lp-a" value={alias} onChange={(e) => setAlias(e.target.value.replace(/\s+/g, "-").toLowerCase())} maxLength={32} placeholder="sharma-sweets" className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent focus:outline-none" />
      </div>

      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" className="absolute -left-[9999px] w-px h-px opacity-0" />
      <button type="button" onClick={make} disabled={busy} className="mt-5 w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
        {busy ? "Making your page..." : fields.short ? "Make a new page" : "Create QR code"}
      </button>
      {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
      {fields.short && (
        <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm">
          <p className="mb-1">Your page: <a href={fields.short} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{fields.short.replace("https://", "")}</a></p>
          {key && <p className="text-xs text-muted">Manage key: <code className="break-all">{key}</code>. Saved in this browser. Use the <a href="/tools/short-link-maker" className="underline">Short Link Maker</a> to see clicks or switch the page off. We cannot recover the key.</p>}
          <p className="text-xs text-muted mt-1">To add or change a link later, make a new page. The QR code on the right opens this one.</p>
        </div>
      )}
    </div>
  );
}
