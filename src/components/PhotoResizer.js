"use client";

import { useEffect, useMemo, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { KB, drawToCanvas, downloadBlob, encodeToSize, fmtBytes, loadBitmap } from "@/lib/image-tools";

const SIZES = [10, 20, 30, 50, 100, 200, 500];
const DPIS = [72, 96, 150, 200, 300];
const UNIT_PER_INCH = { cm: 2.54, mm: 25.4, in: 1 };
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;

export default function PhotoResizer({ kind = "photo", initialKB = 50, initialW = 200, initialH = 230 }) {
  const [file, setFile] = useState(null);
  const [bmp, setBmp] = useState(null);
  const [unit, setUnit] = useState("px");
  const [w, setW] = useState(initialW);
  const [h, setH] = useState(initialH);
  const [dpi, setDpi] = useState(0);
  const [fit, setFit] = useState("cover");
  const [maxKB, setMaxKB] = useState(initialKB);
  const [exact, setExact] = useState(false);
  const [clean, setClean] = useState(kind === "signature");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  // pixel size from the chosen unit (cm / mm / inch need a DPI)
  const px = useMemo(() => {
    const d = dpi || 200;
    const conv = (v) => (unit === "px" ? Math.round(v) : Math.round((v / UNIT_PER_INCH[unit]) * d));
    return { w: conv(Number(w)), h: conv(Number(h)) };
  }, [w, h, unit, dpi]);

  useEffect(() => () => res?.url && URL.revokeObjectURL(res.url), [res]);

  async function onFile([f]) {
    setErr(""); setRes(null);
    try {
      setBmp(await loadBitmap(f));
      setFile(f);
    } catch {
      setErr("That file could not be read as an image. Please choose a JPG, PNG or WebP picture.");
    }
  }

  async function run() {
    setErr(""); setRes(null);
    if (!bmp) return;
    if (!(px.w >= 10 && px.h >= 10 && px.w <= 6000 && px.h <= 6000)) return setErr("Enter a width and height between 10 and 6000 pixels.");
    const maxBytes = Math.round(Number(maxKB) * KB);
    if (!(maxBytes >= 1 * KB)) return setErr("Enter a file size of at least 1 KB.");
    setBusy(true);
    try {
      const canvas = drawToCanvas(bmp, px.w, px.h, fit, { whiten: clean });
      const r = await encodeToSize(canvas, { maxBytes, exact, dpi: dpi || 0 });
      if (r.error) setErr(`This picture cannot be made as small as ${maxKB} KB at ${px.w} x ${px.h} px. Allow a larger size or use smaller dimensions.`);
      else setRes({ ...r, url: URL.createObjectURL(r.blob), w: px.w, h: px.h });
    } catch {
      setErr("Something went wrong while resizing. Please try another picture.");
    } finally {
      setBusy(false);
    }
  }

  const name = file ? file.name.replace(/\.[^.]+$/, "") : kind;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">1. Choose your {kind}</h2>
          <FileDrop accept="image/*" onFiles={onFile} label={file ? file.name : `Click or drop your ${kind} here`} hint="JPG, PNG, WebP. Stays on your device." />
          {bmp && <p className="mt-3 text-xs text-muted">Original: {bmp.width} x {bmp.height} px, {fmtBytes(file.size)}</p>}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">2. Set the size the form asks for</h2>

          <p className="text-xs font-medium text-muted mb-2">Dimensions</p>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-1 items-end">
            <div><label htmlFor="rw" className="block text-xs mb-1">Width</label><input id="rw" type="number" min="1" step="any" value={w} onChange={(e) => setW(e.target.value)} className={field} /></div>
            <div><label htmlFor="rh" className="block text-xs mb-1">Height</label><input id="rh" type="number" min="1" step="any" value={h} onChange={(e) => setH(e.target.value)} className={field} /></div>
            <div><label htmlFor="ru" className="block text-xs mb-1">Unit</label>
              <select id="ru" value={unit} onChange={(e) => setUnit(e.target.value)} className={field}>
                <option value="px">px</option><option value="cm">cm</option><option value="mm">mm</option><option value="in">inch</option>
              </select></div>
          </div>
          <p className="text-xs text-muted mb-4">{unit === "px" ? "Result: " : `At ${dpi || 200} DPI this is `}<strong>{px.w} x {px.h} px</strong></p>

          <p className="text-xs font-medium text-muted mb-2">Maximum file size (KB)</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SIZES.map((s) => <button key={s} type="button" onClick={() => setMaxKB(s)} className={chip(Number(maxKB) === s)}>{s} KB</button>)}
          </div>
          <input aria-label="Maximum size in KB" type="number" min="1" value={maxKB} onChange={(e) => setMaxKB(e.target.value)} className={field + " mb-3"} />
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setExact(false)} className={chip(!exact)}>Under this size</button>
            <button type="button" onClick={() => setExact(true)} className={chip(exact)}>Exactly this size</button>
          </div>

          <p className="text-xs font-medium text-muted mb-2">How to fit the picture</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button type="button" onClick={() => setFit("cover")} className={chip(fit === "cover")}>Crop to fill</button>
            <button type="button" onClick={() => setFit("contain")} className={chip(fit === "contain")}>Fit, white bars</button>
            <button type="button" onClick={() => setFit("stretch")} className={chip(fit === "stretch")}>Stretch</button>
          </div>

          <p className="text-xs font-medium text-muted mb-2">DPI (only if the form asks for it)</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button type="button" onClick={() => setDpi(0)} className={chip(!dpi)}>Not needed</button>
            {DPIS.map((d) => <button key={d} type="button" onClick={() => setDpi(d)} className={chip(dpi === d)}>{d}</button>)}
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={clean} onChange={(e) => setClean(e.target.checked)} className="accent-primary" />
            Whiten the background (good for a signature on paper)
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold mb-4">3. Download</h2>
        <button type="button" onClick={run} disabled={!bmp || busy} className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-4">
          {busy ? "Working..." : `Resize my ${kind}`}
        </button>
        {err && <p role="alert" className="mb-4 text-sm text-red-600">{err}</p>}
        {res ? (
          <div className="text-center">
            <div className="inline-block p-2 bg-white rounded-xl border border-border mb-3">
              <img src={res.url} alt={`Resized ${kind}`} className="max-w-full max-h-72 object-contain" />
            </div>
            <ul className="text-sm mb-4 space-y-1">
              <li><strong>{fmtBytes(res.size)}</strong> {Number(maxKB) * KB === res.size ? "(exactly as requested)" : `(limit ${maxKB} KB)`}</li>
              <li>{res.w} x {res.h} px{dpi ? `, ${dpi} DPI` : ""}</li>
              {res.quality < 0.3 && <li className="text-xs text-amber-600">The size limit is very tight, so the picture is heavily compressed.</li>}
            </ul>
            <button type="button" onClick={() => downloadBlob(res.blob, `${name}-${res.w}x${res.h}-${Math.round(res.size / KB)}kb.jpg`)} className="px-6 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Download JPG
            </button>
          </div>
        ) : (
          !err && <p className="text-sm text-muted">Your resized {kind} will appear here, with its exact size.</p>
        )}
        <p className="mt-5 text-xs text-muted">Everything happens in your browser. Your picture is not uploaded.</p>
      </div>
    </div>
  );
}
