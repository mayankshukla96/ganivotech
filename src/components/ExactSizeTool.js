"use client";

import { useEffect, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { KB, downloadBlob, drawToCanvas, encodeToSize, fmtBytes, loadBitmap, toJpeg } from "@/lib/image-tools";
import { buildPdf, openPdf, renderPage } from "@/lib/pdf-tools";

const MAX_PAGES = 20;
const PRESETS = [["50 KB", 50 * KB], ["100 KB", 100 * KB], ["200 KB", 200 * KB], ["500 KB", 500 * KB], ["1 MB", KB * KB], ["2 MB", 2 * KB * KB]];
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const isPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);

async function compressImage(file, target, exact) {
  const bmp = await loadBitmap(file);
  if (!exact && file.size <= target && file.type === "image/jpeg") return { blob: file, size: file.size, w: bmp.width, h: bmp.height, same: true };
  let scale = Math.min(1, 4096 / Math.max(bmp.width, bmp.height));
  for (let i = 0; i < 16; i++) {
    const w = Math.max(16, Math.round(bmp.width * scale)), h = Math.max(16, Math.round(bmp.height * scale));
    const r = await encodeToSize(drawToCanvas(bmp, w, h, "stretch"), { maxBytes: target, exact });
    if (!r.error) return { ...r, w, h, shrunk: scale < 1 };
    scale *= 0.85;
  }
  return null;
}

const shrink = (c, s) => drawToCanvas(c, Math.max(16, Math.round(c.width * s)), Math.max(16, Math.round(c.height * s)), "stretch");

async function compressPdf(file, target, exact, say) {
  const doc = await openPdf(file);
  if (doc.numPages > MAX_PAGES) throw Object.assign(new Error("pages"), { pages: doc.numPages });
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    say(`Reading page ${i} of ${doc.numPages}...`);
    pages.push(await renderPage(doc, i, 1500));
  }
  let scale = 1;
  for (let attempt = 0; attempt < 8; attempt++) {
    const canvases = pages.map((p) => (scale === 1 ? p.canvas : shrink(p.canvas, scale)));
    const toPages = (jp) => jp.map((j, i) => ({ jpeg: j, w: canvases[i].width, h: canvases[i].height, ptW: pages[i].ptW, ptH: pages[i].ptH }));
    const make = async (q) => {
      const jp = [];
      for (const c of canvases) jp.push(new Uint8Array(await (await toJpeg(c, q)).arrayBuffer()));
      return { jp, bytes: buildPdf(toPages(jp)) };
    };
    say(`Shrinking to fit... (try ${attempt + 1})`);
    const lowest = await make(0.1);
    if (lowest.bytes.length > target) { scale *= 0.8; continue; }
    let best = lowest;
    let lo = 0.1, hi = 0.92;
    const top = await make(hi);
    if (top.bytes.length <= target) best = top;
    else for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      const out = await make(mid);
      if (out.bytes.length <= target) { best = out; lo = mid; } else hi = mid;
    }
    return { bytes: exact ? buildPdf(toPages(best.jp), target) : best.bytes, pages: doc.numPages };
  }
  return null;
}

export default function ExactSizeTool({ initialTarget = 200 * KB }) {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState(initialTarget);
  const [custom, setCustom] = useState(String(Math.round(initialTarget / KB)));
  const [unit, setUnit] = useState("KB");
  const [exact, setExact] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [res, setRes] = useState(null);

  useEffect(() => () => res?.url && URL.revokeObjectURL(res.url), [res]);

  const setPreset = (b) => { setTarget(b); setUnit(b >= KB * KB ? "MB" : "KB"); setCustom(String(b >= KB * KB ? b / KB / KB : b / KB)); };
  const onCustom = (v, u = unit) => { setCustom(v); setUnit(u); setTarget(Math.round(Number(v) * (u === "MB" ? KB * KB : KB))); };

  async function run() {
    setErr(""); setRes(null);
    if (!file) return;
    if (!(target >= 2 * KB)) return setErr("Enter a target size of at least 2 KB.");
    setBusy(true);
    try {
      if (isPdf(file)) {
        if (!exact && file.size <= target) { setRes({ blob: file, size: file.size, same: true, pdf: true }); return; }
        const r = await compressPdf(file, target, exact, setMsg);
        if (!r) setErr("This PDF cannot be made that small. Allow a larger size.");
        else setRes({ blob: new Blob([r.bytes], { type: "application/pdf" }), size: r.bytes.length, pdf: true, pages: r.pages });
      } else {
        setMsg("Compressing...");
        const r = await compressImage(file, target, exact);
        if (!r) setErr("This picture cannot be made that small. Allow a larger size.");
        else setRes({ ...r, url: URL.createObjectURL(r.blob) });
      }
    } catch (e) {
      setErr(e.pages ? `This PDF has ${e.pages} pages. For now the limit is ${MAX_PAGES} pages.` : "Could not process this file. It may be damaged or password protected.");
    } finally {
      setBusy(false);
      setMsg("");
    }
  }

  const base = file ? file.name.replace(/\.[^.]+$/, "") : "file";
  const ext = res?.pdf ? "pdf" : "jpg";

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">1. Choose your file</h2>
          <FileDrop accept="image/*,.pdf,application/pdf" onFiles={([f]) => { setFile(f); setRes(null); setErr(""); }} label={file ? file.name : "Click or drop a JPG, PNG, WebP or PDF"} hint="Stays on your device." />
          {file && <p className="mt-3 text-xs text-muted">Current size: {fmtBytes(file.size)}</p>}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">2. Target size</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PRESETS.map(([l, b]) => <button key={l} type="button" onClick={() => setPreset(b)} className={chip(target === b)}>{l}</button>)}
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2 mb-4">
            <input aria-label="Target size" type="number" min="1" step="any" value={custom} onChange={(e) => onCustom(e.target.value)} className={field} />
            <select aria-label="Unit" value={unit} onChange={(e) => onCustom(custom, e.target.value)} className={field}><option>KB</option><option>MB</option></select>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setExact(false)} className={chip(!exact)}>Under this size</button>
            <button type="button" onClick={() => setExact(true)} className={chip(exact)}>Exactly this size</button>
          </div>
          <p className="mt-3 text-xs text-muted">1 KB = 1024 bytes. &quot;Exactly&quot; adds invisible padding when the file is already smaller than the target.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold mb-4">3. Download</h2>
        <button type="button" onClick={run} disabled={!file || busy} className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-4">
          {busy ? "Working..." : "Make it this size"}
        </button>
        {busy && msg && <p className="text-sm text-muted mb-3" role="status">{msg}</p>}
        {err && <p role="alert" className="mb-4 text-sm text-red-600">{err}</p>}
        {res ? (
          <div className="text-center">
            {res.url && <div className="inline-block p-2 bg-white rounded-xl border border-border mb-3"><img src={res.url} alt="Result" className="max-w-full max-h-64 object-contain" /></div>}
            <ul className="text-sm mb-4 space-y-1">
              <li>{fmtBytes(file.size)} &rarr; <strong>{fmtBytes(res.size)}</strong>{res.same ? " (already within the limit, unchanged)" : ""}</li>
              {res.w && <li>{res.w} x {res.h} px{res.shrunk ? " (reduced to fit)" : ""}</li>}
              {res.pdf && res.pages && <li>{res.pages} page{res.pages > 1 ? "s" : ""}. Pages are saved as pictures, so text cannot be selected.</li>}
            </ul>
            <button type="button" onClick={() => downloadBlob(res.blob, res.same ? file.name : `${base}-${Math.round(res.size / KB)}kb.${ext}`)} className="px-6 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Download {ext.toUpperCase()}
            </button>
          </div>
        ) : (
          !err && !busy && <p className="text-sm text-muted">Your smaller file will appear here.</p>
        )}
        <p className="mt-5 text-xs text-muted">Everything happens in your browser. Your file is not uploaded.</p>
      </div>
    </div>
  );
}
