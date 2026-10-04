"use client";

import { useMemo, useState } from "react";
import FileDrop from "@/components/FileDrop";
import { downloadBlob } from "@/lib/image-tools";
import { qrToSvg, svgToDataUrl } from "@/lib/qr-svg";
import { MAX_PDF, MAX_ZIP, PRESETS, SAMPLE_CSV, addCaption, buildItems, columnIndex, makeSheets, makeZip } from "@/lib/bulk-qr";
import { colLetter, parseCsv, readTableFile } from "@/lib/table-parse";

const STYLES = {
  Classic: { fg: "#000000", fg2: null, bg: "#ffffff", pattern: "square", eye: "square" },
  Brand: { fg: "#0f3d8c", fg2: "#f59e0b", bg: "#ffffff", pattern: "rounded", eye: "rounded" },
  Ocean: { fg: "#0369a1", fg2: "#0d9488", bg: "#ffffff", pattern: "rounded", eye: "rounded" },
};
const LAYOUTS = [["2 x 3 (6 per page)", 2, 3], ["3 x 4 (12 per page)", 3, 4], ["4 x 5 (20 per page)", 4, 5], ["5 x 7 (35 per page)", 5, 7]];
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;

function smallLogo(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const s = Math.max(256 / img.width, 256 / img.height);
      c.getContext("2d").drawImage(img, (256 - img.width * s) / 2, (256 - img.height * s) / 2, img.width * s, img.height * s);
      URL.revokeObjectURL(url);
      res(c.toDataURL("image/png"));
    };
    img.onerror = rej;
    img.src = url;
  });
}

export default function BulkQR({ preset = "urls" }) {
  const p = PRESETS[preset];
  const [sheets, setSheets] = useState(null);
  const [sheetIdx, setSheetIdx] = useState(0);
  const [hasHeader, setHasHeader] = useState(true);
  const [paste, setPaste] = useState("");
  const [fileName, setFileName] = useState("");
  const [template, setTemplate] = useState(p.template);
  const [labelName, setLabelName] = useState(p.label);
  const [caption, setCaption] = useState(true);
  const [autoHttps, setAutoHttps] = useState(true);
  const [style, setStyle] = useState({ ...STYLES.Classic, margin: 3, ecc: "Q" });
  const [logo, setLogo] = useState(null);
  const [size, setSize] = useState(800);
  const [layout, setLayout] = useState(1);
  const [cutLines, setCutLines] = useState(true);
  const [busy, setBusy] = useState("");
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");

  const sheet = sheets?.[sheetIdx];
  const { headers, data, firstRow } = useMemo(() => {
    const rows = sheet?.rows || [];
    if (!rows.length) return { headers: [], data: [], firstRow: 2 };
    const width = Math.max(...rows.map((r) => r.length));
    const letters = Array.from({ length: width }, (_, i) => `Column ${colLetter(i)}`);
    if (!hasHeader) return { headers: letters, data: rows, firstRow: 1 };
    return { headers: letters.map((l, i) => String(rows[0][i] ?? "").trim() || l), data: rows.slice(1), firstRow: 2 };
  }, [sheet, hasHeader]);

  const labelCol = labelName ? columnIndex(headers, labelName) : -1;
  const built = useMemo(() => (data.length ? buildItems(data, headers, { template, labelCol, autoHttps, firstRow }) : null), [data, headers, template, labelCol, autoHttps, firstRow]);
  const full = { ...style, logo };
  const preview = useMemo(() => {
    if (!built) return [];
    return built.items.slice(0, 6).map((it) => {
      try {
        let svg = qrToSvg(it.text, { ...full, size: 400 });
        if (caption && it.label) svg = addCaption(svg, it.label, style.fg, style.bg);
        return { it, url: svgToDataUrl(svg) };
      } catch {
        return { it, url: null };
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built, style, logo, caption]);

  function load(list, name) {
    setErr(""); setDone("");
    const ok = list.filter((s) => s.rows.length);
    if (!ok.length) return setErr("That file has no rows. Add your list, with one item per row.");
    setSheets(ok); setSheetIdx(0); setFileName(name);
    const first = ok[0].rows[0] || [];
    const cols = first.map((c) => String(c).trim().toLowerCase());
    const hit = (t) => [...t.matchAll(/\{([^{}|]+)/g)].every((m) => cols.includes(m[1].trim().toLowerCase()));
    if (hit(p.template)) { setTemplate(p.template); setLabelName(p.label); }
    else { setTemplate(first[0] ? `{${String(first[0]).trim()}}` : "{Column A}"); setLabelName(""); }
  }

  async function onFile([f]) {
    try { load(await readTableFile(f), f.name); }
    catch (e) { setErr(e.message === "xls" ? "Old .xls files are not supported. In Excel choose Save As and pick .xlsx or CSV, then upload that." : "That file could not be read. Please upload an .xlsx or CSV file."); }
  }

  const usePasted = () => paste.trim() && load([{ name: "Pasted list", rows: parseCsv(paste) }], "pasted list");

  const downloadSample = () => downloadBlob(new Blob(["﻿" + SAMPLE_CSV[preset]], { type: "text/csv" }), `sample-${preset}.csv`);

  async function run(kind) {
    setErr(""); setDone(""); setPct(0);
    let items = built.items;
    const cap = kind === "pdf" ? MAX_PDF : MAX_ZIP;
    const trimmed = items.length > cap;
    items = items.slice(0, cap);
    setBusy(kind);
    try {
      if (kind === "pdf") {
        const [, cols, rows] = LAYOUTS[layout];
        const r = await makeSheets(items, { style: full, caption, cols, rows, cutLines, onProgress: setPct });
        downloadBlob(r.blob, "qr-code-sheets.pdf");
        setDone(`${items.length - r.errors.length} QR codes on ${r.pages} A4 page${r.pages > 1 ? "s" : ""}.${trimmed ? ` Only the first ${cap} rows were used.` : ""}${r.errors.length ? ` ${r.errors.length} skipped (too much text).` : ""}`);
      } else {
        const r = await makeZip(items, { style: full, size, format: kind, caption, onProgress: setPct });
        downloadBlob(r.blob, `qr-codes-${kind}.zip`);
        setDone(`${r.count} ${kind.toUpperCase()} files in the ZIP, plus _index.csv.${trimmed ? ` Only the first ${cap} rows were used.` : ""}${r.errors.length ? ` ${r.errors.length} skipped (too much text).` : ""}`);
      }
    } catch {
      setErr("Something went wrong while making the files. Try fewer rows or a smaller size.");
    } finally {
      setBusy("");
    }
  }

  const insert = (h) => setTemplate((t) => `${t}{${h}}`);
  const count = built?.items.length || 0;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">1. Add your list</h2>
          <FileDrop accept=".csv,.xlsx,.xlsm,.tsv,.txt,text/csv" onFiles={onFile} label={fileName || "Click or drop an Excel (.xlsx) or CSV file"} hint="Stays on your device. First row = column names works best." />
          <p className="my-3 text-xs text-muted text-center">or paste cells copied from Excel or Google Sheets</p>
          <textarea aria-label="Pasted list" rows={3} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder={"Name\tLink\nGanivotech\thttps://ganivotech.com"} className={field + " font-mono resize-y"} />
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" onClick={usePasted} disabled={!paste.trim()} className={chip(false) + " disabled:opacity-40"}>Use pasted list</button>
            <button type="button" onClick={downloadSample} className={chip(false)}>Download a sample file</button>
          </div>
          {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}

          {sheet && (
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                <strong>{data.length} row{data.length === 1 ? "" : "s"}</strong><span className="text-muted">{headers.length} columns</span>
                {sheets.length > 1 && (
                  <select aria-label="Sheet" value={sheetIdx} onChange={(e) => setSheetIdx(Number(e.target.value))} className={field + " !w-auto"}>
                    {sheets.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
                  </select>
                )}
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="accent-primary" /> First row has column names</label>
              </div>
              <div className="overflow-auto max-h-44 rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-background text-left"><tr>{headers.map((h, i) => <th key={i} className="px-2 py-1.5 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>{data.slice(0, 5).map((r, ri) => <tr key={ri} className="border-t border-border/60">{headers.map((_, ci) => <td key={ci} className="px-2 py-1.5 whitespace-nowrap max-w-48 truncate">{r[ci]}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {sheet && (
          <>
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">2. What goes in each QR code?</h2>
              <label htmlFor="tpl" className="block text-sm font-medium mb-1.5">Content (use a column name in curly brackets)</label>
              <textarea id="tpl" rows={template.includes("\n") ? 6 : 2} value={template} onChange={(e) => setTemplate(e.target.value)} className={field + " font-mono resize-y"} />
              <p className="mt-2 text-xs text-muted mb-1">Click a column to add it:</p>
              <div className="flex flex-wrap gap-1.5 mb-3">{headers.map((h, i) => <button key={i} type="button" onClick={() => insert(h)} className={chip(false)}>{h}</button>)}</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-xs text-muted self-center">Quick start:</span>
                {[["{first}", "Just the cell"], ["urls", "Website link"], ["upi", "UPI payment"], ["whatsapp", "WhatsApp chat"], ["vcard", "Contact card"]].map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setTemplate(k === "{first}" ? `{${headers[0]}}` : PRESETS[k].template)} className={chip(false)}>{l}</button>
                ))}
              </div>
              {built?.missing.length > 0 && <p role="alert" className="mb-3 text-xs text-amber-700">No column is named: {built.missing.map((m) => `{${m}}`).join(", ")}. Rename the column in your file, or click a column above.</p>}
              <div className="grid sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label htmlFor="lab" className="block text-sm font-medium mb-1.5">Caption under each QR (also the file name)</label>
                  <select id="lab" value={labelName} onChange={(e) => setLabelName(e.target.value)} className={field}>
                    <option value="">None (files are numbered)</option>
                    {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer pb-2"><input type="checkbox" checked={caption} onChange={(e) => setCaption(e.target.checked)} className="accent-primary" /> Print the caption under the QR</label>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={autoHttps} onChange={(e) => setAutoHttps(e.target.checked)} className="accent-primary" /> Add https:// to web addresses that have none</label>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">3. Style</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(STYLES).map(([n, s]) => <button key={n} type="button" onClick={() => setStyle((o) => ({ ...o, ...s }))} className={chip(false)}>{n}</button>)}
                {["square", "rounded", "dots"].map((x) => <button key={x} type="button" onClick={() => setStyle((o) => ({ ...o, pattern: x }))} className={chip(style.pattern === x) + " capitalize"}>{x}</button>)}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 items-end">
                <div><label htmlFor="b-fg" className="block text-xs mb-1">QR colour</label><input id="b-fg" type="color" value={style.fg} onChange={(e) => setStyle((o) => ({ ...o, fg: e.target.value, fg2: null }))} className="w-full h-10 rounded-lg border border-border" /></div>
                <div><label htmlFor="b-bg" className="block text-xs mb-1">Background</label><input id="b-bg" type="color" value={style.bg} onChange={(e) => setStyle((o) => ({ ...o, bg: e.target.value }))} className="w-full h-10 rounded-lg border border-border" /></div>
                <div><label htmlFor="b-ec" className="block text-xs mb-1">Error correction</label>
                  <select id="b-ec" value={logo ? "H" : style.ecc} disabled={!!logo} onChange={(e) => setStyle((o) => ({ ...o, ecc: e.target.value }))} className={field}><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H">High</option></select></div>
                <div><label htmlFor="b-sz" className="block text-xs mb-1">PNG size</label>
                  <select id="b-sz" value={size} onChange={(e) => setSize(Number(e.target.value))} className={field}>{[500, 800, 1000, 1500].map((s) => <option key={s} value={s}>{s} px</option>)}</select></div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted">Logo in the centre:</span>
                <button type="button" onClick={async () => setLogo(await smallLogo(await (await fetch("/logo.jpg")).blob()))} className={chip(false)}>Ganivotech logo</button>
                <label className={chip(false) + " cursor-pointer"}>Upload<input type="file" accept="image/*" className="sr-only" onChange={async (e) => e.target.files[0] && setLogo(await smallLogo(e.target.files[0]))} /></label>
                {logo && <button type="button" onClick={() => setLogo(null)} className="text-xs text-red-500 font-medium">Remove</button>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold mb-3">4. Download</h2>
        {!built ? (
          <p className="text-sm text-muted">Add your list to see a live preview of your QR codes.</p>
        ) : (
          <>
            <p className="text-sm mb-1"><strong>{count}</strong> QR code{count === 1 ? "" : "s"} ready{built.skipped.length ? `, ${built.skipped.length} row${built.skipped.length > 1 ? "s" : ""} skipped` : ""}.</p>
            {built.skipped.length > 0 && <p className="text-xs text-muted mb-2">Skipped: {built.skipped.slice(0, 4).map((s) => `row ${s.n}`).join(", ")}{built.skipped.length > 4 ? "..." : ""} (nothing to put in the QR code).</p>}
            {count > MAX_ZIP && <p className="text-xs text-amber-700 mb-2">Only the first {MAX_ZIP} rows are used for ZIP files ({MAX_PDF} for PDF sheets).</p>}
            <div className="grid grid-cols-3 gap-2 my-4">
              {preview.map(({ it, url }, i) => (
                <div key={i} className="rounded-lg border border-border bg-white p-1 flex items-center justify-center aspect-[5/6]">
                  {url ? <img src={url} alt={`QR code preview for ${it.label || `row ${it.n}`}`} className="max-w-full max-h-full" /> : <span className="text-[10px] text-red-500 text-center">Too much text</span>}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mb-4">Preview of the first {preview.length}. Scan one with your phone to check it.</p>

            <div className="space-y-2">
              <button type="button" disabled={!count || !!busy} onClick={() => run("png")} className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{busy === "png" ? "Making ZIP..." : "Download ZIP of PNG files"}</button>
              <button type="button" disabled={!count || !!busy} onClick={() => run("svg")} className="w-full py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{busy === "svg" ? "Making ZIP..." : "Download ZIP of SVG files"}</button>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs font-medium mb-2">Printable A4 sheets (labels, stickers, ID cards)</p>
                <div className="flex gap-2">
                  <select aria-label="Labels per page" value={layout} onChange={(e) => setLayout(Number(e.target.value))} className={field}>{LAYOUTS.map(([l], i) => <option key={i} value={i}>{l}</option>)}</select>
                  <button type="button" disabled={!count || !!busy} onClick={() => run("pdf")} className="shrink-0 px-4 rounded-xl border border-border text-sm font-semibold hover:border-primary disabled:opacity-40">{busy === "pdf" ? "Making..." : "PDF"}</button>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={cutLines} onChange={(e) => setCutLines(e.target.checked)} className="accent-primary" /> Dotted cutting lines</label>
              </div>
            </div>
            {busy && <div className="mt-3 h-1.5 rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(pct * 100)}><div className="h-1.5 rounded-full gradient-bg-orange" style={{ width: `${Math.round(pct * 100)}%` }} /></div>}
            {done && <p role="status" className="mt-3 text-sm text-green-700">{done}</p>}
          </>
        )}
        <p className="mt-5 text-xs text-muted">Everything happens in your browser. Your list is not uploaded.</p>
      </div>
    </div>
  );
}
