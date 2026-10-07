"use client";

import { useEffect, useRef, useState } from "react";
import { zipSync } from "fflate";
import FileDrop from "@/components/FileDrop";
import { downloadBlob, fmtBytes, loadBitmap } from "@/lib/image-tools";

const card = "rounded-2xl border border-border bg-surface p-5 sm:p-6";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const ghost = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors";
const FORMATS = { jpg: ["JPG", "image/jpeg"], png: ["PNG", "image/png"], webp: ["WebP", "image/webp"] };
const WIDTHS = [[0, "Original size"], [3000, "3000 px"], [1920, "1920 px"], [1280, "1280 px"], [800, "800 px"]];
const MAX_FILES = 100;
const stem = (n) => n.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|\u0000-\u001f]+/g, " ").trim().slice(0, 80) || "image";

async function convert(file, type, quality, maxW) {
  const bmp = await loadBitmap(file);
  const k = maxW && bmp.width > maxW ? maxW / bmp.width : 1;
  const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); } // JPG has no transparency
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close?.();
  const blob = await new Promise((res) => c.toBlob(res, type, quality));
  c.width = c.height = 0;
  if (!blob || blob.type !== type) throw new Error("unsupported");
  return { blob, w, h };
}

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [fmt, setFmt] = useState("jpg");
  const [quality, setQuality] = useState(90);
  const [maxW, setMaxW] = useState(0);
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const run = useRef(0);

  useEffect(() => { setResults([]); }, [fmt, quality, maxW, files]);

  function add(list) {
    const ok = list.filter((f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|bmp|avif|svg)$/i.test(f.name));
    setErr(ok.length < list.length ? "Some files were skipped because they are not pictures this browser can open (HEIC photos from iPhones are not supported here)." : "");
    setFiles((cur) => [...cur, ...ok].slice(0, MAX_FILES));
  }

  async function go() {
    const id = ++run.current;
    setBusy(true); setErr(""); setResults([]);
    const [, type] = FORMATS[fmt];
    const out = [];
    for (const [i, f] of files.entries()) {
      if (id !== run.current) return;
      setMsg(`Converting ${i + 1} of ${files.length}...`);
      try {
        const r = await convert(f, type, quality / 100, maxW);
        out.push({ name: `${stem(f.name)}.${fmt}`, from: f.size, ...r });
      } catch (e) {
        out.push({ name: f.name, error: e.message === "unsupported" ? `This browser cannot save ${FORMATS[fmt][0]} files. Try another format.` : "Could not open this picture." });
        if (e.message === "unsupported") break;
      }
    }
    setResults(out); setBusy(false); setMsg("");
  }

  const good = results.filter((r) => r.blob);
  async function zip() {
    const used = new Map(), entries = {};
    for (const r of good) {
      const n = used.get(r.name) || 0;
      used.set(r.name, n + 1);
      entries[n ? r.name.replace(/(\.[^.]+)$/, ` (${n + 1})$1`) : r.name] = [new Uint8Array(await r.blob.arrayBuffer()), { level: 0 }];
    }
    downloadBlob(new Blob([zipSync(entries)], { type: "application/zip" }), `converted-${fmt}.zip`);
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-5">
        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">1. Choose your pictures</h2>
          <FileDrop multiple accept="image/*" onFiles={add} label={files.length ? `${files.length} picture${files.length === 1 ? "" : "s"} selected. Add more` : "Click or drop JPG, PNG, WebP, GIF, BMP or AVIF pictures"} hint={`Up to ${MAX_FILES} at once. Stays on your device.`} />
          {files.length > 0 && (
            <>
              <ul className="mt-3 space-y-1 max-h-40 overflow-auto text-xs text-muted">
                {files.map((f, i) => <li key={i} className="flex justify-between gap-2"><span className="truncate">{f.name}</span><span className="shrink-0">{fmtBytes(f.size)}</span></li>)}
              </ul>
              <button type="button" onClick={() => setFiles([])} className={ghost + " mt-3"}>Clear all</button>
            </>
          )}
        </div>
        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">2. Convert to</h2>
          <div className="flex gap-1.5 mb-4" role="group" aria-label="Format">
            {Object.entries(FORMATS).map(([k, [l]]) => <button key={k} type="button" onClick={() => setFmt(k)} aria-pressed={fmt === k} className={chip(fmt === k)}>{l}</button>)}
          </div>
          {fmt !== "png" && (
            <>
              <label htmlFor="ic-q" className="block text-xs font-medium mb-1">Quality: {quality}% (lower makes a smaller file)</label>
              <input id="ic-q" type="range" min="40" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full mb-4" />
            </>
          )}
          <p className="text-xs font-medium mb-2">Make the picture no wider than</p>
          <div className="flex flex-wrap gap-1.5">{WIDTHS.map(([w, l]) => <button key={w} type="button" onClick={() => setMaxW(w)} className={chip(maxW === w)}>{l}</button>)}</div>
          <p className="text-xs text-muted mt-3">{fmt === "jpg" ? "JPG cannot be see-through, so transparent areas become white. " : fmt === "png" ? "PNG keeps every detail and see-through areas, but files are larger. " : "WebP files are small and are accepted by most modern websites. "}Animated GIFs become a single still picture.</p>
        </div>
      </div>

      <div className={card + " lg:sticky lg:top-24"}>
        <h2 className="text-lg font-semibold mb-4">3. Download</h2>
        <button type="button" onClick={go} disabled={!files.length || busy} className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-4">
          {busy ? "Working..." : `Convert to ${FORMATS[fmt][0]}`}
        </button>
        {busy && <p className="text-sm text-muted mb-3" role="status">{msg}</p>}
        {err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
        {results.length > 0 ? (
          <>
            <ul className="space-y-2 max-h-72 overflow-auto">
              {results.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-sm rounded-lg border border-border bg-background px-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate">{r.name}</span>
                    <span className={`block text-xs ${r.error ? "text-red-600" : "text-muted"}`}>{r.error || `${fmtBytes(r.from)} → ${fmtBytes(r.blob.size)}, ${r.w} x ${r.h} px`}</span>
                  </span>
                  {r.blob && <button type="button" onClick={() => downloadBlob(r.blob, r.name)} className={ghost}>Save</button>}
                </li>
              ))}
            </ul>
            {good.length > 1 && <button type="button" onClick={zip} className="mt-4 px-5 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity">Download all as ZIP</button>}
          </>
        ) : (
          !busy && <p className="text-sm text-muted">Your converted pictures will appear here.</p>
        )}
        <p className="mt-5 text-xs text-muted">Everything happens in your browser. Your pictures are not uploaded.</p>
      </div>
    </div>
  );
}
