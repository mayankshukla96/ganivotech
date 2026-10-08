"use client";

import { useEffect, useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { downloadBlob, toJpeg, toPng } from "@/lib/image-tools";
import { buildPdf } from "@/lib/pdf-tools";
import { sheetLayout } from "@/lib/photo-id";
import { qrToSvg, svgToDataUrl } from "@/lib/qr-svg";
import { aliasProblem } from "@/lib/short-links";
import { CARD_MM, COLORS, TEMPLATES, checkCard, digits, vcardText } from "@/lib/visiting-card";

const card = "rounded-2xl border border-border bg-surface p-5 sm:p-6";
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const ghost = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-40";
const lab = "block text-xs font-medium mb-1";
const GOLD = "#f59e0b";
const FONT = '"Segoe UI", Roboto, Arial, sans-serif';
const DPI = 300;
const { w: CW, h: CH } = CARD_MM;

const FIELDS = [["name", "Full name", "Rahul Sharma"], ["title", "Job title", "Founder"], ["company", "Company", "Sharma Electricals"], ["phone", "Phone (with country code)", "919876543210"], ["email", "Email", "rahul@example.com"], ["website", "Website", "www.example.com"], ["address", "Address", "Jagatpura, Jaipur"], ["tagline", "Tagline (on the back)", "Wiring, repairs and solar, since 2012"]];

// shrink text until it fits the width
function fit(ctx, s, maxW, px, weight) {
  for (let size = px; size > px * 0.55; size -= px * 0.05) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(s).width <= maxW) return size;
  }
  return px * 0.55;
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

/** Draws one side of the card. k = pixels per mm. Everything is measured in mm so the preview and the 300 DPI file match. */
function drawCard(ctx, k, side, d, o, logo, qr) {
  const W = CW * k, H = CH * k;
  const mm = (v) => v * k;
  const light = o.template === "Classic" || o.template === "Minimal";
  const text = (s, x, y, size, { weight = "500", color = "#111", align = "left", max = CW } = {}) => {
    if (!s) return;
    const px = fit(ctx, s, mm(max), mm(size), weight);
    ctx.font = `${weight} ${px}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic";
    ctx.fillText(s, mm(x), mm(y));
  };
  const image = (img, x, y, size, tile) => {
    if (!img) return;
    if (tile) { rrect(ctx, mm(x), mm(y), mm(size), mm(size), mm(1.5)); ctx.fillStyle = "#fff"; ctx.fill(); }
    const pad = tile ? mm(1) : 0, s = mm(size) - pad * 2;
    const r = Math.min(s / img.width, s / img.height), iw = img.width * r, ih = img.height * r;
    ctx.drawImage(img, mm(x) + pad + (s - iw) / 2, mm(y) + pad + (s - ih) / 2, iw, ih);
  };
  const qrTile = (x, y, size, label) => {
    rrect(ctx, mm(x), mm(y), mm(size), mm(size), mm(1.5)); ctx.fillStyle = "#fff"; ctx.fill();
    if (qr) ctx.drawImage(qr, mm(x + 1.2), mm(y + 1.2), mm(size - 2.4), mm(size - 2.4));
    if (label) text(label, x + size / 2, y + size + 2.6, 1.9, { color: light && side === "front" ? "#555" : "rgba(255,255,255,0.9)", align: "center", max: size + 10 });
  };
  const brand = o.color, grey = "#555";
  const contacts = [d.phone && `+${digits(d.phone)}`, d.email, d.website, d.address].filter(Boolean);
  ctx.fillStyle = side === "back" || !light ? brand : "#fff";
  ctx.fillRect(0, 0, W, H);

  if (side === "back") {
    image(logo, 9, 8, 15, true);
    text(d.company || d.name, 9, 30, 3.4, { weight: "700", color: "#fff", max: 44 });
    if (d.tagline) {
      // wrap the tagline over up to three lines
      ctx.font = `400 ${mm(2.3)}px ${FONT}`;
      const words = d.tagline.split(" "), lines = []; let line = "";
      for (const w of words) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > mm(44) && line) { lines.push(line); line = w; } else line = t; }
      lines.push(line);
      lines.slice(0, 3).forEach((l, i) => text(l, 9, 35 + i * 3.6, 2.3, { weight: "400", color: "rgba(255,255,255,0.88)", max: 44 }));
    }
    text(d.website, 9, 47, 2.5, { weight: "600", color: GOLD, max: 44 });
    qrTile(59, 9, 24, o.smart.short ? "Scan to save or open my card" : "Scan to save my contact");
    return;
  }

  if (o.template === "Classic") {
    ctx.fillStyle = brand; ctx.fillRect(0, 0, mm(5), H);
    image(logo, 10, 7, 14, false);
    contacts.forEach((s, i) => text(s, 83, 10 + i * 4.3, 2.3, { color: grey, align: "right", max: 36 }));
    text(d.name, 10, 36, 4.6, { weight: "700", color: "#111", max: 52 });
    text(d.title, 10, 41, 2.6, { color: grey, max: 52 });
    text(d.company, 10, 46, 2.8, { weight: "700", color: brand, max: 52 });
    if (o.frontQr) qrTile(67, 28, 17, "Scan to save");
  } else if (o.template === "Bold") {
    image(logo, 8, 8, 14, true);
    contacts.forEach((s, i) => text(s, 82, 11 + i * 4.3, 2.3, { color: "rgba(255,255,255,0.9)", align: "right", max: 34 }));
    text(d.name, 8, 33, 5, { weight: "700", color: "#fff", max: 52 });
    text(d.title, 8, 38.5, 2.6, { color: "rgba(255,255,255,0.85)", max: 52 });
    text(d.company, 8, 44, 2.9, { weight: "700", color: GOLD, max: 52 });
    if (o.frontQr) qrTile(62, 27, 20, "Scan to save");
  } else if (o.template === "Split") {
    ctx.fillStyle = brand; ctx.fillRect(0, 0, mm(33), H);
    ctx.fillStyle = "#fff"; ctx.fillRect(mm(33), 0, W - mm(33), H);
    image(logo, 6, 6, 14, true);
    if (o.frontQr) qrTile(6.5, 24, 20, "Scan to save"); else text(d.company, 6, 30, 2.8, { weight: "700", color: "#fff", max: 24 });
    text(d.name, 38, 14, 4.4, { weight: "700", color: "#111", max: 48 });
    text(d.title, 38, 19, 2.5, { color: grey, max: 48 });
    text(d.company, 38, 24, 2.7, { weight: "700", color: brand, max: 48 });
    ctx.fillStyle = "#e5e7eb"; ctx.fillRect(mm(38), mm(27.5), mm(45), mm(0.3));
    contacts.forEach((s, i) => text(s, 38, 33 + i * 4.2, 2.3, { color: "#333", max: 47 }));
  } else {
    // Minimal
    image(logo, 37.5, 6, 14, false);
    text(d.name, 44.5, 27, 5, { weight: "700", color: "#111", align: "center", max: 78 });
    text([d.title, d.company].filter(Boolean).join("  ·  "), 44.5, 32.5, 2.6, { color: grey, align: "center", max: 78 });
    ctx.fillStyle = brand; ctx.fillRect(mm(39.5), mm(35.5), mm(10), mm(0.5));
    text(contacts.slice(0, 2).join("   ·   "), 44.5, 41.5, 2.3, { color: "#333", align: "center", max: 80 });
    text(contacts.slice(2).join("   ·   "), 44.5, 46, 2.3, { color: "#333", align: "center", max: 80 });
  }
}

const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

export default function VisitingCardMaker() {
  const [d, setD] = useState({ name: "", title: "", company: "", phone: "", email: "", website: "", address: "", tagline: "" });
  const [o, setO] = useState({ template: "Classic", color: COLORS[0][1], frontQr: true, mode: "vcard", smart: { short: "", key: "", alias: "" } });
  const [logoUrl, setLogoUrl] = useState("");
  const [logo, setLogo] = useState(null);
  const [qr, setQr] = useState(null);
  const [alias, setAlias] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const front = useRef(null), back = useRef(null);
  const setField = (k, v) => setD((c) => ({ ...c, [k]: v }));
  const setOpt = (patch) => setO((c) => ({ ...c, ...patch }));

  // the QR holds either the contact itself (works anywhere, no internet) or the address of the smart card
  const qrText = o.mode === "smart" && o.smart.short ? o.smart.short : d.name.trim() ? vcardText({ ...d, phone: digits(d.phone) }) : "";
  useEffect(() => {
    if (!qrText) return setQr(null);
    let live = true;
    try { loadImg(svgToDataUrl(qrToSvg(qrText, { fg: "#111111", bg: "#ffffff", pattern: "square", eye: "square", margin: 0, ecc: "M", size: 400 }))).then((i) => live && setQr(i)); } catch { setQr(null); }
    return () => { live = false; };
  }, [qrText]);

  async function onLogo([f]) {
    try {
      const bmp = await createImageBitmap(f);
      const k = Math.min(1, 512 / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      const url = c.toDataURL("image/png");
      setLogoUrl(url); setLogo(await loadImg(url)); setErr("");
    } catch { setErr("That logo file could not be opened. Use a PNG or JPG."); }
  }

  const paint = (canvas, side, k) => drawCard(canvas.getContext("2d"), k, side, d, o, logo, qr);
  useEffect(() => {
    for (const [ref, side] of [[front, "front"], [back, "back"]]) {
      const c = ref.current; if (!c) continue;
      const k = 8; c.width = CW * k; c.height = CH * k; // 8 px per mm on screen keeps the preview sharp
      paint(c, side, k);
    }
  });

  const render = (side) => { const c = document.createElement("canvas"); const k = DPI / 25.4; c.width = Math.round(CW * k); c.height = Math.round(CH * k); paint(c, side, k); return c; };
  const ready = d.name.trim().length > 1;
  const pt = (v) => (v / 25.4) * 72;

  async function savePng(side) { downloadBlob(await toPng(render(side)), `visiting-card-${side}.png`); }

  async function savePdf() {
    setBusy(true);
    try {
      const pages = [];
      for (const side of ["front", "back"]) { const c = render(side); pages.push({ jpeg: new Uint8Array(await (await toJpeg(c, 0.95)).arrayBuffer()), w: c.width, h: c.height, ptW: pt(CW), ptH: pt(CH) }); }
      downloadBlob(new Blob([buildPdf(pages)], { type: "application/pdf" }), "visiting-card.pdf");
    } finally { setBusy(false); }
  }

  async function saveSheet() {
    setBusy(true);
    try {
      const L = sheetLayout({ w: 210, h: 297 }, CW, CH, { gap: 3, margin: 8 });
      const k = DPI / 25.4, pages = [];
      for (const side of ["front", "back"]) {
        const cardC = render(side), c = document.createElement("canvas");
        c.width = Math.round(L.W * k); c.height = Math.round(L.H * k);
        const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
        for (const [x, y] of L.spots) {
          // the back is mirrored left to right, so both sides line up when the sheet is printed on both sides (flip on the long edge)
          const px = side === "back" ? (L.W - x - CW) * k : x * k, py = y * k;
          ctx.drawImage(cardC, px, py, CW * k, CH * k);
          ctx.strokeRect(px + 0.5, py + 0.5, CW * k - 1, CH * k - 1);
        }
        pages.push({ jpeg: new Uint8Array(await (await toJpeg(c, 0.92)).arrayBuffer()), w: c.width, h: c.height, ptW: pt(L.W), ptH: pt(L.H) });
      }
      downloadBlob(new Blob([buildPdf(pages)], { type: "application/pdf" }), "visiting-cards-a4-sheet.pdf");
      setMsg(`${L.spots.length} cards per A4 sheet. Print at actual size on both sides, flip on the long edge, then cut along the lines.`);
    } finally { setBusy(false); }
  }

  async function makeSmart() {
    setErr(""); setMsg("");
    const c = checkCard({ ...d, whatsapp: d.phone, color: o.color, logo: logoUrl.length <= 40000 ? logoUrl : "" });
    if (!c.ok) return setErr(c.error);
    if (alias.trim() && aliasProblem(alias.trim())) return setErr(aliasProblem(alias.trim()));
    setBusy(true);
    const r = await fetch("/api/short/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ page: c.page, alias: alias.trim(), expires: "never", website: hp }) })
      .then((x) => x.json()).catch(() => ({ ok: false, error: "Could not reach the server. Check your internet and try again." }));
    setBusy(false);
    if (!r.ok) return setErr(r.error);
    try {
      const list = JSON.parse(localStorage.getItem("gt_short_links") || "[]");
      localStorage.setItem("gt_short_links", JSON.stringify([{ alias: r.alias, key: r.key, url: r.url, title: `Card: ${d.name.trim()}`, created: Date.now() }, ...list]));
    } catch {}
    setOpt({ smart: { short: r.short, key: r.key, alias: r.alias } });
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-5">
        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">1. Your details</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FIELDS.map(([k, l, ph]) => (
              <div key={k} className={k === "address" || k === "tagline" ? "sm:col-span-2" : ""}>
                <label htmlFor={`vc-${k}`} className={lab}>{l}</label>
                <input id={`vc-${k}`} value={d[k]} onChange={(e) => setField(k, e.target.value)} placeholder={ph} maxLength={k === "address" ? 160 : k === "tagline" ? 100 : 80} inputMode={k === "phone" ? "tel" : undefined} className={field} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className={lab}>Logo (optional)</p>
            <FileDrop accept="image/*" onFiles={onLogo} label={logoUrl ? "Logo added. Click to change" : "Click or drop your logo (PNG or JPG)"} hint="A square logo on a plain background looks best." />
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">2. Design</h2>
          <p className={lab}>Style</p>
          <div className="flex flex-wrap gap-1.5 mb-4">{TEMPLATES.map((t) => <button key={t} type="button" onClick={() => setOpt({ template: t })} className={chip(o.template === t)}>{t}</button>)}</div>
          <p className={lab}>Colour</p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {COLORS.map(([n, hex]) => <button key={hex} type="button" onClick={() => setOpt({ color: hex })} aria-label={n} aria-pressed={o.color === hex} className={`w-7 h-7 rounded-full border-2 ${o.color === hex ? "border-primary ring-2 ring-primary/30" : "border-border"}`} style={{ background: hex }} />)}
            <input type="color" aria-label="Another colour" value={o.color} onChange={(e) => setOpt({ color: e.target.value })} className="w-9 h-8 rounded border border-border bg-background" />
          </div>
          {o.template !== "Minimal" && <label className="flex items-center gap-2 text-sm cursor-pointer mb-4"><input type="checkbox" checked={o.frontQr} onChange={(e) => setOpt({ frontQr: e.target.checked })} /> QR code on the front as well as the back</label>}

          <p className={lab}>What the QR code does</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <button type="button" onClick={() => setOpt({ mode: "vcard" })} className={chip(o.mode === "vcard")}>Save my contact (works offline)</button>
            <button type="button" onClick={() => setOpt({ mode: "smart" })} className={chip(o.mode === "smart")}>Smart card (opens my digital card)</button>
          </div>
          {o.mode === "vcard" ? (
            <p className="text-xs text-muted">The QR code holds your details themselves. Scanning offers to save you as a contact, even without internet. Nothing is stored on our servers.</p>
          ) : (
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-muted mb-2">The QR code opens a small page with your name, logo and buttons: Save contact, Call, WhatsApp, Email, Website and Directions. We host the page, and you can see how many people scanned it in the Short Link Maker.</p>
              {o.smart.short ? (
                <p className="text-sm">Your card is live at <a href={o.smart.short} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{o.smart.short.replace("https://", "")}</a>. The QR code now opens it. <span className="text-xs text-muted">Manage key: <code className="break-all">{o.smart.key}</code> (saved in this browser).</span></p>
              ) : (
                <>
                  <div className="flex items-stretch rounded-xl border border-border bg-surface overflow-hidden focus-within:border-primary mb-2">
                    <span className="px-3 flex items-center text-xs text-muted bg-background border-r border-border whitespace-nowrap">ganivotech.com/go/</span>
                    <input value={alias} onChange={(e) => setAlias(e.target.value.replace(/\s+/g, "-").toLowerCase())} maxLength={32} placeholder="rahul-sharma (optional)" aria-label="Name for the card address" className="flex-1 min-w-0 px-3 py-2 text-sm bg-transparent focus:outline-none" />
                  </div>
                  <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" className="absolute -left-[9999px] w-px h-px opacity-0" />
                  <button type="button" onClick={makeSmart} disabled={busy || !ready} className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold disabled:opacity-40">{busy ? "Creating..." : "Create my smart card"}</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={card + " lg:sticky lg:top-24"}>
        <h2 className="text-lg font-semibold mb-4">3. Preview and download</h2>
        <div className="space-y-3">
          <div><p className="text-xs text-muted mb-1">Front</p><canvas ref={front} role="img" aria-label="Front of the card" className="w-full rounded-lg border border-border shadow-sm" /></div>
          <div><p className="text-xs text-muted mb-1">Back</p><canvas ref={back} role="img" aria-label="Back of the card" className="w-full rounded-lg border border-border shadow-sm" /></div>
        </div>
        <p className="text-xs text-muted mt-2">89 x 51 mm, the standard visiting card size, saved at 300 DPI for printing.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => savePng("front")} disabled={!ready} className={ghost}>Front PNG</button>
          <button type="button" onClick={() => savePng("back")} disabled={!ready} className={ghost}>Back PNG</button>
          <button type="button" onClick={savePdf} disabled={!ready || busy} className="px-4 py-2 rounded-lg gradient-bg-orange text-white text-sm font-semibold disabled:opacity-40">PDF (front and back)</button>
          <button type="button" onClick={saveSheet} disabled={!ready || busy} className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold disabled:opacity-40">A4 print sheet</button>
        </div>
        {!ready && <p className="mt-3 text-xs text-muted">Type at least your name to enable downloads.</p>}
        {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
        {msg && <p role="status" className="mt-3 text-sm text-muted">{msg}</p>}
        <p className="mt-5 text-xs text-muted">The card is drawn in your browser. Your details leave your device only if you choose the smart card, which we host for you.</p>
      </div>
    </div>
  );
}
