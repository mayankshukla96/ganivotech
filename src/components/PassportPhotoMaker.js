"use client";

import { useEffect, useRef, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { KB, downloadBlob, encodeToSize, fmtBytes, loadBitmap, toJpeg } from "@/lib/image-tools";
import { PRESETS, SHEETS, brighten, mmToPx, sheetLayout, whitenBackground } from "@/lib/photo-id";
import { buildPdf } from "@/lib/pdf-tools";

const card = "rounded-2xl border border-border bg-surface p-5 sm:p-6";
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const label = "block text-xs font-medium mb-1";
const btn = "px-5 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40";
const DPIS = [200, 300];

export default function PassportPhotoMaker() {
  const [file, setFile] = useState(null);
  const [bmp, setBmp] = useState(null);
  const [preset, setPreset] = useState("p35x45");
  const [mm, setMm] = useState({ w: 35, h: 45 });
  const [dpi, setDpi] = useState(300);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // shift of the picture, as a fraction of the frame
  const [white, setWhite] = useState(true);
  const [tol, setTol] = useState(55);
  const [light, setLight] = useState(0);
  const [maxKB, setMaxKB] = useState(100);
  const [sheet, setSheet] = useState("4x6");
  const [copies, setCopies] = useState(0); // 0 = as many as fit
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const view = useRef(null);
  const out = useRef(null); // the finished photo canvas
  const [cleaned, setCleaned] = useState(null); // share of the picture the white-background step changed
  const drag = useRef(null);

  const W = mmToPx(mm.w, dpi), H = mmToPx(mm.h, dpi);

  function onFile([f]) {
    setErr(""); setMsg("");
    loadBitmap(f).then((b) => { setFile(f); setBmp(b); setZoom(1); setPos({ x: 0, y: 0 }); }).catch(() => setErr("That file could not be opened as a picture. Please choose a JPG, PNG or WebP photo."));
  }

  const clampPos = (p, z) => {
    // the picture always covers the frame, so there are never empty edges
    const k = Math.max(W / bmp.width, H / bmp.height) * z;
    const mx = Math.max(0, (bmp.width * k - W) / 2 / W), my = Math.max(0, (bmp.height * k - H) / 2 / H);
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  };

  // draw the finished photo whenever a setting changes
  useEffect(() => {
    if (!bmp) return;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
    const k = Math.max(W / bmp.width, H / bmp.height) * zoom;
    const p = clampPos(pos, zoom);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, W / 2 + p.x * W - (bmp.width * k) / 2, H / 2 + p.y * H - (bmp.height * k) / 2, bmp.width * k, bmp.height * k);
    setCleaned(white ? whitenBackground(c, tol) : null);
    brighten(c, light);
    out.current = c;
    const v = view.current;
    if (v) { v.width = W; v.height = H; v.getContext("2d").drawImage(c, 0, 0); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmp, W, H, zoom, pos, white, tol, light]);

  function down(e) { if (bmp) { drag.current = { x: e.clientX, y: e.clientY, p: pos }; e.currentTarget.setPointerCapture(e.pointerId); } }
  function move(e) {
    if (!drag.current) return;
    const r = view.current.getBoundingClientRect();
    setPos(clampPos({ x: drag.current.p.x + (e.clientX - drag.current.x) / r.width, y: drag.current.p.y + (e.clientY - drag.current.y) / r.height }, zoom));
  }
  const up = () => { drag.current = null; };

  const pick = (id) => { const p = PRESETS.find((x) => x.id === id); setPreset(id); setMm({ w: p.w, h: p.h }); setMaxKB(p.kb); setPos({ x: 0, y: 0 }); };
  const setSize = (k, v) => { setMm((m) => ({ ...m, [k]: Math.min(200, Math.max(10, Number(v) || 10)) })); setPreset("custom"); setPos({ x: 0, y: 0 }); };

  async function saveJpg() {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const r = await encodeToSize(out.current, { maxBytes: maxKB * KB, dpi });
      if (r.error) setErr("The photo cannot be made that small. Allow a larger size.");
      else { downloadBlob(r.blob, `passport-photo-${mm.w}x${mm.h}mm.jpg`); setMsg(`Saved ${fmtBytes(r.size)}, ${W} x ${H} px.`); }
    } catch { setErr("Could not save the photo. Please try again."); }
    setBusy(false);
  }

  async function sheetCanvas() {
    const S = SHEETS.find((s) => s.id === sheet);
    const L = sheetLayout(S, mm.w, mm.h);
    const n = copies ? Math.min(copies, L.spots.length) : L.spots.length;
    if (!L.spots.length) throw new Error("size");
    const c = document.createElement("canvas");
    c.width = mmToPx(L.W, dpi); c.height = mmToPx(L.H, dpi);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#b8b8b8"; ctx.lineWidth = 1;
    L.spots.slice(0, n).forEach(([x, y]) => {
      const px = mmToPx(x, dpi), py = mmToPx(y, dpi);
      ctx.drawImage(out.current, px, py, W, H);
      ctx.strokeRect(px + 0.5, py + 0.5, W - 1, H - 1); // thin cut line
    });
    return { c, L, n };
  }

  async function saveSheet(kind) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { c, L, n } = await sheetCanvas();
      const jpg = await toJpeg(c, 0.93);
      if (kind === "jpg") downloadBlob(jpg, `passport-photos-${sheet}.jpg`);
      else {
        const pdf = buildPdf([{ jpeg: new Uint8Array(await jpg.arrayBuffer()), w: c.width, h: c.height, ptW: (L.W / 25.4) * 72, ptH: (L.H / 25.4) * 72 }]);
        downloadBlob(new Blob([pdf], { type: "application/pdf" }), `passport-photos-${sheet}.pdf`);
      }
      setMsg(`${n} photo${n === 1 ? "" : "s"} on the sheet. Print at 100% / actual size, not "fit to page".`);
    } catch (e) { setErr(e.message === "size" ? "This photo size does not fit on that paper." : "Could not make the sheet. Please try again."); }
    setBusy(false);
  }

  const S = SHEETS.find((s) => s.id === sheet);
  const fits = sheetLayout(S, mm.w, mm.h).spots.length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-5">
        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">1. Choose your photo</h2>
          <FileDrop accept="image/*" onFiles={onFile} label={file ? file.name : "Click or drop a photo"} hint="Stays on your device. A plain wall behind you works best." />
        </div>
        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">2. Size and look</h2>
          <label htmlFor="pp-size" className={label}>Photo size</label>
          <select id="pp-size" value={preset} onChange={(e) => pick(e.target.value)} className={field + " mb-3"}>{PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div><label htmlFor="pp-w" className={label}>Width (mm)</label><input id="pp-w" type="number" min="10" max="200" value={mm.w} onChange={(e) => setSize("w", e.target.value)} className={field} /></div>
            <div><label htmlFor="pp-h" className={label}>Height (mm)</label><input id="pp-h" type="number" min="10" max="200" value={mm.h} onChange={(e) => setSize("h", e.target.value)} className={field} /></div>
            <div><label htmlFor="pp-dpi" className={label}>Quality</label><select id="pp-dpi" value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className={field}>{DPIS.map((d) => <option key={d} value={d}>{d} DPI</option>)}</select></div>
          </div>
          <p className="text-xs text-muted mb-4">Result: {W} x {H} px. Always check the size on the exact form or website you are using, because rules differ and change.</p>

          <label htmlFor="pp-zoom" className={label}>Zoom (then drag the photo to place your face)</label>
          <input id="pp-zoom" type="range" min="1" max="3" step="0.02" value={zoom} disabled={!bmp} onChange={(e) => { const z = Number(e.target.value); setZoom(z); setPos((p) => clampPos(p, z)); }} className="w-full mb-4" />

          <label className="flex items-center gap-2 text-sm cursor-pointer mb-2"><input type="checkbox" checked={white} onChange={(e) => setWhite(e.target.checked)} /> Make the background white</label>
          {white && (
            <>
              <label htmlFor="pp-tol" className={label}>Strength: raise it if some background is left, lower it if hair or clothes turn white</label>
              <input id="pp-tol" type="range" min="10" max="110" value={tol} onChange={(e) => setTol(Number(e.target.value))} className="w-full mb-1" />
              {bmp && cleaned !== null && cleaned < 0.05 && <p className="text-xs text-accent mb-2">Very little background was found. This works on plain, even walls, so stand against one and use good light.</p>}
              <p className="text-xs text-muted mb-3">This is a simple colour clean-up, not artificial intelligence. It works well on a plain light wall and may leave marks on busy backgrounds.</p>
            </>
          )}
          <label htmlFor="pp-light" className={label}>Brightness</label>
          <input id="pp-light" type="range" min="-30" max="40" value={light} onChange={(e) => setLight(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className={card + " lg:sticky lg:top-24"}>
        <h2 className="text-lg font-semibold mb-4">3. Preview and download</h2>
        <div className="mx-auto w-full max-w-[300px]">
          <div className="relative rounded-lg border border-border bg-white overflow-hidden touch-none select-none" style={{ aspectRatio: `${W} / ${H}`, cursor: bmp ? "grab" : "default" }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            <canvas ref={view} className="w-full h-full block" role="img" aria-label="Preview of your photo" />
            {!bmp && <p className="absolute inset-0 flex items-center justify-center text-sm text-muted text-center px-6">Choose a photo and it appears here.</p>}
            {bmp && <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"><ellipse cx="50" cy="44" rx="25" ry="31" fill="none" stroke="#0f3d8c" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7" /></svg>}
          </div>
          <p className="text-xs text-muted mt-2 text-center">Keep the face inside the dotted oval, eyes open, looking straight ahead. The oval is only a guide and is not saved.</p>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2 items-end">
          <div><label htmlFor="pp-kb" className={label}>Largest file size (KB)</label><input id="pp-kb" type="number" min="5" value={maxKB} onChange={(e) => setMaxKB(Math.max(5, Number(e.target.value) || 5))} className={field} /></div>
          <button type="button" onClick={saveJpg} disabled={!bmp || busy} className={btn}>Download photo (JPG)</button>
        </div>

        <div className="mt-6 pt-5 border-t border-border">
          <p className="text-sm font-semibold mb-2">Print sheet</p>
          <div className="flex flex-wrap gap-1.5 mb-3">{SHEETS.map((s) => <button key={s.id} type="button" onClick={() => setSheet(s.id)} className={chip(sheet === s.id)}>{s.label}</button>)}</div>
          <div className="mb-3">
            <label htmlFor="pp-n" className={label}>Copies (up to {fits} fit)</label>
            <input id="pp-n" type="number" min="0" max={fits} value={copies || ""} placeholder={`all ${fits}`} onChange={(e) => setCopies(Math.max(0, Math.floor(Number(e.target.value) || 0)))} className={field} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => saveSheet("jpg")} disabled={!bmp || busy || !fits} className={btn}>Sheet as JPG</button>
            <button type="button" onClick={() => saveSheet("pdf")} disabled={!bmp || busy || !fits} className={btn}>Sheet as PDF</button>
          </div>
        </div>
        {err && <p role="alert" className="mt-4 text-sm text-red-600">{err}</p>}
        {msg && <p role="status" className="mt-4 text-sm text-muted">{msg}</p>}
        <p className="mt-5 text-xs text-muted">Everything happens in your browser. Your photo is not uploaded.</p>
      </div>
    </div>
  );
}
