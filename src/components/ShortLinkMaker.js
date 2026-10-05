"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PREFIX, STYLES, absolute, aliasProblem, checkDestination, suggest } from "@/lib/short-links";
import { qrToSvg, svgToDataUrl, svgToPngBlob } from "@/lib/qr-svg";

const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const btnOrange = "px-5 py-2.5 rounded-lg gradient-bg-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40";
const btnBlue = "px-5 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40";
const btnGhost = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors";
const card = "rounded-2xl border border-border bg-surface p-5 sm:p-6";
const STORE = "gt_short_links";
const EXPIRIES = [["never", "Never"], ["1d", "1 day"], ["7d", "7 days"], ["30d", "30 days"], ["365d", "1 year"]];
const QR_STYLE = { fg: "#0f3d8c", bg: "#ffffff", pattern: "rounded", eye: "rounded", margin: 2, ecc: "M", size: 300 };

const post = (url, body) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()).catch(() => ({ ok: false, error: "Could not reach the server. Check your internet and try again." }));

function save(list) {
  try { localStorage.setItem(STORE, JSON.stringify(list)); } catch {}
}
function load() {
  try { return JSON.parse(localStorage.getItem(STORE) || "[]"); } catch { return []; }
}
function download(href, name) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

function buildDestination({ tab, url, phone, msg, utm }) {
  if (tab === "wa") {
    let d = phone.replace(/\D/g, "");
    if (d.length === 10) d = `91${d}`;
    if (d.length < 8 || d.length > 15) return { ok: false, error: "Enter the mobile number with country code, for example 919876543210." };
    return { ok: true, url: `https://wa.me/${d}${msg.trim() ? `?text=${encodeURIComponent(msg.trim())}` : ""}` };
  }
  const c = checkDestination(url);
  if (!c.ok || !utm.on) return c;
  const u = new URL(c.url);
  [["utm_source", utm.source], ["utm_medium", utm.medium], ["utm_campaign", utm.campaign]].forEach(([k, v]) => {
    if (v.trim() && !u.searchParams.has(k)) u.searchParams.set(k, v.trim());
  });
  return { ok: true, url: u.toString() };
}

function Stats({ s }) {
  const max = Math.max(1, ...s.days.map((d) => d.n));
  const list = (title, rows) => (
    <div>
      <p className="text-xs font-semibold mb-1">{title}</p>
      {rows.length ? rows.map((r) => <p key={r.k} className="text-xs text-muted flex justify-between gap-2"><span className="truncate">{r.k}</span><span>{r.n}</span></p>) : <p className="text-xs text-muted">No clicks yet</p>}
    </div>
  );
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs text-muted mb-2"><strong className="text-foreground">{s.link.clicks}</strong> clicks in total. Last 14 days:</p>
      <div className="flex items-end gap-1 h-14 mb-1" role="img" aria-label="Clicks per day for the last 14 days">
        {s.days.map((d) => (
          <div key={d.day} title={`${d.day}: ${d.n}`} className="flex-1 rounded-t bg-primary/80" style={{ height: `${Math.max(d.n ? 8 : 2, (d.n / max) * 100)}%`, opacity: d.n ? 1 : 0.25 }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {list("Where from", s.sources)}
        {list("Device", s.devices)}
        {list("Country", s.countries)}
      </div>
      {s.link.reports > 0 && <p className="text-xs mt-3 text-accent">This link has been reported {s.link.reports} time{s.link.reports > 1 ? "s" : ""}.</p>}
      {s.link.expires && <p className="text-xs text-muted mt-2">Expires {new Date(s.link.expires).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.</p>}
    </div>
  );
}

export default function ShortLinkMaker() {
  const [tab, setTab] = useState("web");
  const [url, setUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [text, setText] = useState("");
  const [utm, setUtm] = useState({ on: false, source: "", medium: "", campaign: "" });
  const [style, setStyle] = useState("words");
  const [alias, setAlias] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [aliasState, setAliasState] = useState({ s: "idle", msg: "" });
  const [expires, setExpires] = useState("never");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState("");
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({});
  const [open, setOpen] = useState("");
  const [add, setAdd] = useState({ alias: "", key: "" });
  const [note, setNote] = useState("");
  const seq = useRef(0);

  useEffect(() => setLinks(load()), []);

  // ---- name ideas, with a free/taken mark for each ------------------------------
  const refresh = useCallback(async () => {
    const n = ++seq.current;
    const names = suggest(style, text, 6);
    setIdeas(names.map((name) => ({ name, st: "…" })));
    if (!names.length) return;
    const r = await fetch(`/api/short/check?names=${names.join(",")}`).then((x) => x.json()).catch(() => null);
    if (n !== seq.current) return;
    setIdeas(names.map((name) => ({ name, st: r?.ok ? r.names[name] : "free" })));
  }, [style, text]);

  useEffect(() => {
    const t = setTimeout(refresh, 400);
    return () => clearTimeout(t);
  }, [refresh]);

  // ---- live check of the name typed by the user ----------------------------------
  useEffect(() => {
    const a = alias.trim().toLowerCase();
    if (!a) return setAliasState({ s: "idle", msg: "" });
    const p = aliasProblem(a);
    if (p) return setAliasState({ s: "bad", msg: p });
    setAliasState({ s: "checking", msg: "Checking..." });
    let live = true;
    const t = setTimeout(async () => {
      const r = await fetch(`/api/short/check?names=${a}`).then((x) => x.json()).catch(() => null);
      if (!live) return;
      const st = r?.ok ? r.names[a] : "free";
      setAliasState(st === "free" ? { s: "free", msg: "Available" } : st === "taken" ? { s: "bad", msg: "Already taken. Try one of the ideas below." } : { s: "bad", msg: st });
    }, 450);
    return () => { live = false; clearTimeout(t); };
  }, [alias]);

  const styleInfo = STYLES.find((s) => s.id === style);
  const needsText = styleInfo.needs && !text.trim();

  async function make() {
    setError("");
    setNote("");
    const d = buildDestination({ tab, url, phone, msg, utm });
    if (!d.ok) return setError(d.error);
    if (alias.trim() && aliasState.s === "bad") return setError(aliasState.msg);
    setBusy(true);
    const r = await post("/api/short/create", { url: d.url, alias: alias.trim(), title: text.trim(), expires, website: hp });
    setBusy(false);
    if (!r.ok) {
      if (r.field === "alias") refresh();
      return setError(r.error);
    }
    const entry = { alias: r.alias, key: r.key, url: r.url, title: text.trim(), created: Date.now() };
    const next = [entry, ...links.filter((l) => l.alias !== r.alias)];
    setLinks(next);
    save(next);
    setResult({ ...entry, short: r.short, expires: r.expires });
    try { setQr(qrToSvg(r.short, QR_STYLE)); } catch { setQr(""); }
    setAlias("");
    refresh();
  }

  const doCopy = async (what, value) => {
    if (await copy(value)) {
      setCopied(what);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  async function manage(l, action) {
    const r = await post("/api/short/manage", { alias: l.alias, key: l.key, action });
    if (!r.ok) return setNote(r.error);
    if (r.deleted) {
      const next = links.filter((x) => x.alias !== l.alias);
      setLinks(next);
      save(next);
      if (result?.alias === l.alias) setResult(null);
      return setOpen("");
    }
    setStats((s) => ({ ...s, [l.alias]: r }));
    setOpen(l.alias);
  }

  async function addExisting() {
    setNote("");
    const l = { alias: add.alias.trim().toLowerCase(), key: add.key.trim() };
    const r = await post("/api/short/manage", { ...l, action: "stats" });
    if (!r.ok) return setNote(r.error);
    const entry = { ...l, url: r.link.url, title: r.link.title || "", created: new Date(r.link.created).getTime() };
    const next = [entry, ...links.filter((x) => x.alias !== l.alias)];
    setLinks(next);
    save(next);
    setStats((s) => ({ ...s, [l.alias]: r }));
    setOpen(l.alias);
    setAdd({ alias: "", key: "" });
  }

  const short = result?.short;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-5">
          <div className={card}>
            <h2 className="text-lg font-semibold mb-4">1. What should the link open?</h2>
            <div className="flex gap-2 mb-4" role="tablist">
              <button type="button" role="tab" aria-selected={tab === "web"} onClick={() => setTab("web")} className={chip(tab === "web")}>Website link</button>
              <button type="button" role="tab" aria-selected={tab === "wa"} onClick={() => setTab("wa")} className={chip(tab === "wa")}>WhatsApp chat</button>
            </div>
            {tab === "web" ? (
              <>
                <label htmlFor="sl-url" className="block text-xs font-medium mb-1">Long link</label>
                <input id="sl-url" type="url" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/very/long/page?with=lots&of=things" className={field} />
                <label className="mt-3 flex items-center gap-2 text-xs text-muted cursor-pointer">
                  <input type="checkbox" checked={utm.on} onChange={(e) => setUtm({ ...utm, on: e.target.checked })} />
                  Add campaign tags (UTM) so Google Analytics shows where visitors came from
                </label>
                {utm.on && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[["source", "Source", "whatsapp"], ["medium", "Medium", "social"], ["campaign", "Campaign", "diwali-offer"]].map(([k, l, ph]) => (
                      <div key={k}>
                        <label htmlFor={`utm-${k}`} className="block text-xs mb-1">{l}</label>
                        <input id={`utm-${k}`} value={utm[k]} onChange={(e) => setUtm({ ...utm, [k]: e.target.value })} placeholder={ph} className={field} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <label htmlFor="sl-ph" className="block text-xs font-medium mb-1">WhatsApp number (with country code)</label>
                <input id="sl-ph" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="919876543210" className={field + " mb-3"} />
                <label htmlFor="sl-msg" className="block text-xs font-medium mb-1">Message that is ready to send (optional)</label>
                <textarea id="sl-msg" rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Hi, I would like to know more about your offer." className={field} />
                <p className="mt-2 text-xs text-muted">Anyone who opens your short link lands in a WhatsApp chat with you, message already typed.</p>
              </>
            )}
            <label htmlFor="sl-title" className="block text-xs font-medium mb-1 mt-4">What is it for? (optional, helps with the name ideas)</label>
            <input id="sl-title" value={text} onChange={(e) => setText(e.target.value)} maxLength={80} placeholder="Sharma Sweets Diwali Offer" className={field} />
          </div>

          <div className={card}>
            <h2 className="text-lg font-semibold mb-1">2. Pick a name style</h2>
            <p className="text-xs text-muted mb-3">Your link will read ganivotech.com{PREFIX}<strong>your-name</strong>. Choose a style for ideas, or type your own.</p>
            <div className="flex flex-wrap gap-1.5 mb-1" role="group" aria-label="Name style">
              {STYLES.map((s) => <button key={s.id} type="button" onClick={() => setStyle(s.id)} className={chip(style === s.id)} aria-pressed={style === s.id}>{s.label}</button>)}
            </div>
            <p className="text-xs text-muted mb-3">e.g. {styleInfo.hint}</p>

            <div className="flex flex-wrap gap-2 mb-1 min-h-[34px]" aria-live="polite">
              {needsText ? (
                <p className="text-xs text-muted">Type what the link is for in step 1 to get ideas in this style.</p>
              ) : (
                ideas.map((i) => (
                  <button key={i.name} type="button" disabled={i.st !== "free" && i.st !== "…"} onClick={() => setAlias(i.name)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${i.st === "free" ? "border-border hover:border-primary hover:text-primary" : "border-border text-muted line-through opacity-50"} ${alias === i.name ? "border-primary text-primary" : ""}`}>
                    {i.name}{i.st === "free" ? " ✓" : ""}
                  </button>
                ))
              )}
              {!needsText && <button type="button" onClick={refresh} className={btnGhost}>Shuffle</button>}
            </div>

            <label htmlFor="sl-alias" className="block text-xs font-medium mb-1 mt-3">Your name (leave empty for a random short code)</label>
            <div className="flex items-stretch rounded-xl border border-border bg-background overflow-hidden focus-within:border-primary transition-colors">
              <span className="px-3 flex items-center text-xs text-muted bg-surface border-r border-border whitespace-nowrap">ganivotech.com{PREFIX}</span>
              <input id="sl-alias" value={alias} onChange={(e) => setAlias(e.target.value.replace(/\s+/g, "-").toLowerCase())} maxLength={32} placeholder="diwali-offer" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent focus:outline-none" />
            </div>
            <p className={`mt-1 text-xs min-h-[16px] ${aliasState.s === "free" ? "text-green-600" : aliasState.s === "bad" ? "text-accent" : "text-muted"}`} aria-live="polite">
              {aliasState.s === "free" ? "✓ " : ""}{aliasState.msg}
            </p>

            <p className="text-xs font-medium text-muted mt-3 mb-2">Link expires</p>
            <div className="flex flex-wrap gap-1.5">
              {EXPIRIES.map(([k, l]) => <button key={k} type="button" onClick={() => setExpires(k)} className={chip(expires === k)}>{l}</button>)}
            </div>

            {/* honeypot: people never see or fill this */}
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" className="absolute -left-[9999px] w-px h-px opacity-0" />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={make} disabled={busy} className={btnOrange}>{busy ? "Making..." : "Make short link"}</button>
              {error && <p className="text-sm text-accent" role="alert">{error}</p>}
            </div>
          </div>
        </div>

        <div className={card + " text-center lg:sticky lg:top-24"}>
          <h2 className="text-lg font-semibold mb-4">3. Your short link</h2>
          {short ? (
            <>
              <p className="text-xl sm:text-2xl font-bold break-all text-primary" data-testid="short-url">{short.replace("https://", "")}</p>
              <p className="text-xs text-muted break-all mt-1">goes to {result.url.length > 70 ? `${result.url.slice(0, 70)}...` : result.url}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button type="button" onClick={() => doCopy("link", short)} className={btnOrange}>{copied === "link" ? "Copied!" : "Copy link"}</button>
                <a href={`https://wa.me/?text=${encodeURIComponent(short)}`} target="_blank" rel="noopener noreferrer" className={btnBlue + " inline-block"}>Share on WhatsApp</a>
                <a href={`${PREFIX}${result.alias}/preview`} target="_blank" rel="noopener noreferrer" className={btnGhost + " py-2.5"}>Preview page</a>
              </div>
              {qr && (
                <div className="mt-5">
                  <div className="mx-auto w-[180px] h-[180px] rounded-xl border border-border bg-white overflow-hidden">
                    <img src={svgToDataUrl(qr)} alt={`QR code for ${short}`} width={180} height={180} className="w-full h-full" />
                  </div>
                  <div className="flex justify-center gap-2 mt-3">
                    <button type="button" onClick={async () => download(URL.createObjectURL(await svgToPngBlob(qr, 1000)), `${result.alias}-qr.png`)} className={btnGhost}>QR PNG</button>
                    <button type="button" onClick={() => download(URL.createObjectURL(new Blob([qr], { type: "image/svg+xml" })), `${result.alias}-qr.svg`)} className={btnGhost}>QR SVG</button>
                  </div>
                </div>
              )}
              <div className="mt-5 rounded-xl bg-background border border-border p-3 text-left">
                <p className="text-xs font-semibold mb-1">Your manage key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs break-all">{result.key}</code>
                  <button type="button" onClick={() => doCopy("key", result.key)} className={btnGhost}>{copied === "key" ? "Copied!" : "Copy"}</button>
                </div>
                <p className="text-xs text-muted mt-2">It lets you see clicks, switch off or delete this link. It is saved in this browser and shown below. We cannot recover it, so copy it if you want to manage the link from another device.</p>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-14 px-6">
              <p className="text-sm text-muted">Paste a link, pick a name and press <strong>Make short link</strong>. Your short link, a QR code and your click stats appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className={card}>
        <h2 className="text-lg font-semibold mb-1">My links</h2>
        <p className="text-xs text-muted mb-4">Links you made are remembered in this browser only. Open one to see clicks, switch it off or delete it.</p>
        {note && <p className="text-sm text-accent mb-3" role="alert">{note}</p>}
        {links.length ? (
          <ul className="space-y-3">
            {links.map((l) => {
              const s = stats[l.alias];
              return (
                <li key={l.alias} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold break-all">{absolute(l.alias).replace("https://", "")}{s?.link.disabled && <span className="ml-2 text-xs text-accent">switched off</span>}</p>
                      <p className="text-xs text-muted break-all">{l.title ? `${l.title} → ` : ""}{l.url.length > 60 ? `${l.url.slice(0, 60)}...` : l.url}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => doCopy(l.alias, absolute(l.alias))} className={btnGhost}>{copied === l.alias ? "Copied!" : "Copy"}</button>
                      <button type="button" onClick={() => (open === l.alias ? setOpen("") : manage(l, "stats"))} className={btnGhost}>{open === l.alias ? "Hide stats" : "Stats"}</button>
                      {s && <button type="button" onClick={() => manage(l, s.link.disabled ? "enable" : "disable")} className={btnGhost}>{s.link.disabled ? "Switch on" : "Switch off"}</button>}
                      <button type="button" onClick={() => window.confirm(`Delete ${l.alias}? The link will stop working for good.`) && manage(l, "delete")} className={btnGhost}>Delete</button>
                    </div>
                  </div>
                  {open === l.alias && s && <Stats s={s} />}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">No links yet.</p>
        )}
        <details className="mt-4">
          <summary className="text-xs font-medium text-primary cursor-pointer">Manage a link from another device</summary>
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-end">
            <div><label htmlFor="ad-a" className="block text-xs mb-1">Link name</label><input id="ad-a" value={add.alias} onChange={(e) => setAdd({ ...add, alias: e.target.value })} placeholder="diwali-offer" className={field} /></div>
            <div><label htmlFor="ad-k" className="block text-xs mb-1">Manage key</label><input id="ad-k" value={add.key} onChange={(e) => setAdd({ ...add, key: e.target.value })} className={field} /></div>
            <button type="button" onClick={addExisting} disabled={!add.alias.trim() || !add.key.trim()} className={btnBlue}>Add</button>
          </div>
        </details>
      </div>
    </div>
  );
}
