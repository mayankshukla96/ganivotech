"use client";

import { useState } from "react";
import FileDrop from "@/components/FileDrop";
import { downloadBlob, drawToCanvas, loadBitmap } from "@/lib/image-tools";
import { openPdf, renderPage } from "@/lib/pdf-tools";
import { LANGS, getWorker, ocrCanvas, stopWorker, textToRows, toCsv, toDocx, toXlsx, wordsToTable } from "@/lib/ocr";

const MAX_PAGES = 15;
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const isPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);

// small photos read better when enlarged; huge ones are slowed down for nothing
async function prepImage(file) {
  const b = await loadBitmap(file);
  const side = Math.max(b.width, b.height);
  const s = side < 1600 ? Math.min(2.5, 1600 / side) : Math.min(1, 3200 / side);
  return drawToCanvas(b, Math.round(b.width * s), Math.round(b.height * s), "stretch");
}

export default function OcrTool() {
  const [files, setFiles] = useState([]);
  const [lang, setLang] = useState("eng");
  const [mode, setMode] = useState("table");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [pct, setPct] = useState(null);
  const [err, setErr] = useState("");
  const [pages, setPages] = useState([]);
  const [outMode, setOutMode] = useState("table");

  async function run() {
    setErr(""); setPages([]);
    setBusy(true);
    try {
      setStage("Preparing...");
      const jobs = [];
      for (const f of files) {
        if (isPdf(f)) {
          const doc = await openPdf(f);
          for (let i = 1; i <= doc.numPages; i++) jobs.push({ label: `${f.name} - page ${i}`, get: async () => (await renderPage(doc, i, 2000)).canvas });
        } else jobs.push({ label: f.name, get: () => prepImage(f) });
      }
      if (jobs.length > MAX_PAGES) throw Object.assign(new Error("pages"), { count: jobs.length });

      const worker = await getWorker(lang, (m) => {
        if (m.status === "recognizing text") setPct(m.progress);
        else if (m.status) { setStage(m.status.charAt(0).toUpperCase() + m.status.slice(1) + (m.status.includes("load") || m.status.includes("init") ? " (first time only)" : "")); setPct(m.progress ?? null); }
      });
      const out = [];
      for (let i = 0; i < jobs.length; i++) {
        setStage(`Reading ${jobs[i].label} (${i + 1} of ${jobs.length})...`);
        setPct(0);
        const r = await ocrCanvas(worker, await jobs[i].get(), mode);
        out.push({ label: jobs[i].label, text: r.text, rows: mode === "table" ? wordsToTable(r.words) : textToRows(r.text) });
      }
      setOutMode(mode);
      if (out.some((p) => p.text)) setPages(out);
      else setErr("No text was found. Try a clearer, larger picture, or choose the right language.");
    } catch (e) {
      setErr(e.count ? `That is ${e.count} pages. For now the limit is ${MAX_PAGES} pages at a time.` : "Could not read the file. Check your internet connection (the language data downloads once) and try again.");
      stopWorker();
    } finally {
      setBusy(false); setStage(""); setPct(null);
    }
  }

  const editText = (i, v) => setPages((p) => p.map((x, k) => (k === i ? { ...x, text: v, rows: outMode === "table" ? x.rows : textToRows(v) } : x)));
  const rowsOf = (p) => (p.rows.length ? p.rows : [[""]]);
  const base = files[0] ? files[0].name.replace(/\.[^.]+$/, "") : "ocr";
  const allText = pages.map((p) => p.text).join("\n\n");
  const table = outMode === "table";

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold mb-4">1. Add pictures or PDFs</h2>
          <FileDrop multiple accept="image/*,.pdf,application/pdf" onFiles={(f) => { setFiles(f); setPages([]); setErr(""); }} label={files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Click or drop images or PDFs"} hint="Photos of tables, forms, notes or scans." />
          {files.length > 0 && <ul className="mt-3 text-xs text-muted space-y-0.5">{files.slice(0, 5).map((f) => <li key={f.name} className="truncate">{f.name}</li>)}{files.length > 5 && <li>and {files.length - 5} more</li>}</ul>}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold mb-4">2. Language and layout</h2>
          <label htmlFor="ol" className="block text-xs font-medium mb-1">Language in the picture</label>
          <select id="ol" value={lang} onChange={(e) => setLang(e.target.value)} className={field + " mb-4"}>
            {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <p className="text-xs font-medium text-muted mb-2">What is in it?</p>
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setMode("table")} className={chip(mode === "table")}>A table (for Excel)</button>
            <button type="button" onClick={() => setMode("text")} className={chip(mode === "text")}>Plain text (for Word)</button>
          </div>
          <button type="button" onClick={run} disabled={!files.length || busy} className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
            {busy ? "Reading..." : "Read the text"}
          </button>
          {busy && (
            <div className="mt-3" role="status">
              <p className="text-xs text-muted mb-1">{stage}</p>
              {pct != null && <div className="h-1.5 rounded-full bg-border"><div className="h-1.5 rounded-full gradient-bg-orange" style={{ width: `${Math.round(pct * 100)}%` }} /></div>}
            </div>
          )}
          {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}
          <p className="mt-4 text-xs text-muted">Your files are read on your device and never uploaded. The first run downloads the language data (a few MB).</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 min-h-64">
        <h2 className="text-lg font-semibold mb-4">3. Check and download</h2>
        {!pages.length ? (
          <p className="text-sm text-muted">The text found in your pictures will appear here. Check it, then download as Excel, Word, CSV or text.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              <button type="button" onClick={() => downloadBlob(new Blob([toXlsx(pages.map((p, i) => ({ name: `Page ${i + 1}`, rows: rowsOf(p) })))], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${base}.xlsx`)} className="px-4 py-2 rounded-lg gradient-bg-orange text-white text-sm font-semibold">Excel (.xlsx)</button>
              <button type="button" onClick={() => downloadBlob(new Blob([toDocx(pages.map((p) => ({ rows: rowsOf(p), table })))], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), `${base}.docx`)} className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold">Word (.docx)</button>
              <button type="button" onClick={() => downloadBlob(new Blob([toCsv(pages.flatMap(rowsOf))], { type: "text/csv;charset=utf-8" }), `${base}.csv`)} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:border-primary">CSV</button>
              <button type="button" onClick={() => downloadBlob(new Blob(["﻿" + allText], { type: "text/plain;charset=utf-8" }), `${base}.txt`)} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:border-primary">Text</button>
              <button type="button" onClick={() => navigator.clipboard.writeText(allText)} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:border-primary">Copy</button>
            </div>
            {pages.map((p, i) => (
              <section key={i} className="mb-5">
                <h3 className="text-xs font-semibold text-muted mb-2">{p.label}</h3>
                {table ? (
                  <div className="overflow-auto max-h-80 rounded-xl border border-border">
                    <table className="w-full text-xs">
                      <tbody>
                        {p.rows.slice(0, 60).map((r, ri) => (
                          <tr key={ri} className="border-b border-border/60 last:border-0">{r.map((c, ci) => <td key={ci} className="px-2 py-1.5 align-top">{c}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                    {p.rows.length > 60 && <p className="p-2 text-xs text-muted">Showing the first 60 rows. The download has all {p.rows.length}.</p>}
                  </div>
                ) : (
                  <textarea aria-label={`Text of ${p.label}`} value={p.text} onChange={(e) => editText(i, e.target.value)} rows={10} className={field + " font-mono resize-y"} />
                )}
              </section>
            ))}
            <p className="text-xs text-muted">OCR is not perfect. Always check numbers and names before you use them.</p>
          </>
        )}
      </div>
    </div>
  );
}
