"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zipSync } from "fflate";
import FileDrop from "@/components/FileDrop";
import PdfPageGrid, { freshPages } from "@/components/PdfPageGrid";
import { downloadBlob, drawToCanvas, fmtBytes, loadBitmap, toJpeg, toPng } from "@/lib/image-tools";
import { MAX_BYTES, NUMBER_FORMATS, PdfError, markSpots, merge, numberPages, parseRanges, pick, protect, split, unlock, watermark } from "@/lib/pdf-edit";
import { openPdf, renderPage, setHandoff, takeHandoff } from "@/lib/pdf-tools";
import { PDF_OPS } from "@/lib/pdf-toolkit-content";

const card = "rounded-2xl border border-border bg-surface p-5 sm:p-6";
const field = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"}`;
const ghost = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-30";
const label = "block text-xs font-medium mb-1";

// what each page of the toolkit does: `kind` picks the options panel and the work, `mode` is for the page grid
const UI = {
  "merge-pdf": { kind: "merge", action: "Merge files", done: "merged" },
  "split-pdf": { kind: "split", action: "Split PDF" },
  "extract-pdf-pages": { kind: "grid", mode: "extract", action: "Extract pages", done: "extract" },
  "delete-pdf-pages": { kind: "grid", mode: "delete", action: "Delete pages", done: "edited" },
  "organize-pdf": { kind: "grid", mode: "organize", action: "Save new order", done: "organized" },
  "rotate-pdf": { kind: "grid", mode: "rotate", action: "Save rotated PDF", done: "rotated" },
  "unlock-pdf": { kind: "unlock", action: "Remove password", done: "unlocked" },
  "protect-pdf": { kind: "protect", action: "Add password", done: "protected" },
  "watermark-pdf": { kind: "watermark", action: "Add watermark", done: "watermarked" },
  "add-page-numbers-to-pdf": { kind: "numbers", action: "Add page numbers", done: "numbered" },
  "pdf-to-jpg": { kind: "images", action: "Convert to pictures" },
};

const NEXT = ["merge-pdf", "organize-pdf", "add-page-numbers-to-pdf", "watermark-pdf", "protect-pdf", "pdf-to-jpg"]; // offered after a result
const MAX_PARTS = 500;
const MAX_IMAGES = 300;
const MARK_COLORS = [["Red", "#dc2626"], ["Grey", "#6b7280"], ["Blue", "#0f3d8c"], ["Black", "#111111"]];
const today = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const MARK_TEXTS = ["CONFIDENTIAL", "DRAFT", "COPY", () => `For KYC only, ${today()}`];
const POSITIONS = [["tl", "Top left"], ["tc", "Top centre"], ["tr", "Top right"], ["bl", "Bottom left"], ["bc", "Bottom centre"], ["br", "Bottom right"]];

// frees the memory pdf.js holds for an opened file
const closeDoc = (doc) => { doc.loadingTask?.destroy().catch(() => {}); };
const isPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
const isPicture = (f) => /^image\/(jpeg|png|webp)$/.test(f.type);
const readBytes = async (file) => new Uint8Array(await file.arrayBuffer());
// download names are built from the original name, without anything a file system could trip over
const stem = (name) => name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|\u0000-\u001f]+/g, " ").trim().slice(0, 80) || "file";
const partName = (g) => (g.length === 1 ? `page-${g[0] + 1}` : `pages-${g[0] + 1}-${g[g.length - 1] + 1}`);
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const explain = (e) =>
  e instanceof PdfError
    ? {
        password: "This PDF is locked. Choose it again and type its password. If that still fails, it uses a kind of lock this tool cannot open.",
        "wrong-password": "That password is not correct.",
        damaged: "This file could not be read. It may be damaged, or not a real PDF.",
        "not-locked": "This PDF has no password or restrictions, so there is nothing to remove.",
        range: e.message,
      }[e.code]
    : "Something went wrong with this file. Please try again.";

async function pictureToJpeg(file) {
  const bmp = await loadBitmap(file);
  const k = Math.min(1, 3000 / Math.max(bmp.width, bmp.height));
  const canvas = drawToCanvas(bmp, Math.round(bmp.width * k), Math.round(bmp.height * k), "stretch");
  return new Uint8Array(await (await toJpeg(canvas, 0.9)).arrayBuffer());
}

// The watermark is drawn by the browser, so Hindi and every other script the device can show works, then stamped as a picture.
function drawMark(text, color) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  const font = 'bold 120px "Noto Sans Devanagari", "Nirmala UI", "Segoe UI", Arial, sans-serif';
  ctx.font = font;
  const m = ctx.measureText(text);
  const up = Math.ceil(m.actualBoundingBoxAscent || 100), down = Math.ceil(m.actualBoundingBoxDescent || 30), pad = 14;
  c.width = Math.ceil(m.width) + pad * 2;
  c.height = up + down + pad * 2;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, pad, pad + up);
  return c;
}
const canvasPng = (c) => Uint8Array.from(atob(c.toDataURL("image/png").split(",")[1]), (ch) => ch.charCodeAt(0));

function MarkPreview({ doc, text, opt }) {
  const ref = useRef(null);
  const [page, setPage] = useState(null);

  useEffect(() => {
    let live = true;
    renderPage(doc, 1, 520).then((p) => live && setPage(p)).catch(() => {});
    return () => { live = false; };
  }, [doc]);

  useEffect(() => {
    const out = ref.current;
    if (!out || !page) return;
    const { canvas, ptW, ptH } = page;
    out.width = canvas.width;
    out.height = canvas.height;
    const ctx = out.getContext("2d");
    ctx.drawImage(canvas, 0, 0);
    if (!text) return;
    const mark = drawMark(text, opt.color);
    const k = canvas.width / ptW;
    const { w, h, spots } = markSpots(ptW, ptH, { ratio: mark.height / mark.width, size: opt.size, angle: opt.angle, layout: opt.layout });
    ctx.globalAlpha = opt.opacity;
    for (const [cx, cy] of spots) {
      ctx.save();
      ctx.translate(cx * k, (ptH - cy) * k);
      ctx.rotate((-opt.angle * Math.PI) / 180);
      ctx.drawImage(mark, (-w * k) / 2, (-h * k) / 2, w * k, h * k);
      ctx.restore();
    }
  }, [page, text, opt.color, opt.size, opt.angle, opt.opacity, opt.layout]);

  return <canvas ref={ref} role="img" aria-label="Preview of the first page with the watermark" className="mx-auto max-w-full max-h-80 rounded-lg border border-border bg-white" />;
}

export default function PdfToolkit({ op }) {
  const ui = UI[op];
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [asking, setAsking] = useState([]); // locked files waiting for their password: [{ file, wrong }]
  const [pw, setPw] = useState("");
  const [pages, setPages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [res, setRes] = useState(null);
  const [o, setO] = useState({
    splitMode: "ranges", ranges: "", every: 2,
    newPw: "", newPw2: "", show: false,
    text: "CONFIDENTIAL", color: MARK_COLORS[0][1], opacity: 0.25, size: 0.7, angle: 45, layout: "center",
    format: "n", pos: "bc", fontSize: 11, start: 1, from: 1,
    image: "jpg", dpi: 150, imgRange: "",
  });
  const set = (patch) => setO((cur) => ({ ...cur, ...patch }));
  const seq = useRef(0);
  const open = useRef(new Set()); // pdf.js documents to close when the page is left
  const drag = useRef(null);
  const single = ui.kind !== "merge";
  const it = items[0];
  const live = useRef(items); // the newest list, for code that runs after an await
  live.current = items;

  useEffect(() => {
    const f = takeHandoff();
    if (f) addFiles([f]);
    const docs = open.current;
    return () => { docs.forEach(closeDoc); docs.clear(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ui.kind === "grid") setPages(it ? freshPages(it.pages, ui.mode) : []);
  }, [it?.id, ui.kind, ui.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const changed = () => { setRes(null); setErr(""); };

  function drop(item) {
    if (item.doc) { open.current.delete(item.doc); closeDoc(item.doc); }
    if (item.kind === "picture") URL.revokeObjectURL(item.thumb);
  }

  async function loadPdf(file, password = "") {
    try {
      const doc = await openPdf(file, password);
      open.current.add(doc);
      const { canvas } = await renderPage(doc, 1, 240);
      const item = { id: ++seq.current, kind: "pdf", file, name: file.name, size: file.size, pages: doc.numPages, password, doc, thumb: canvas.toDataURL("image/jpeg", 0.7), range: "" };
      if (single) { live.current.forEach(drop); setItems([item]); } else setItems((cur) => [...cur, item]);
      return true;
    } catch (e) {
      if (e?.name !== "PasswordException") { setErr(`Could not open ${file.name}. It may be damaged, or not a real PDF.`); return true; }
      const wrong = e.code === 2;
      setAsking((q) => (q.some((a) => a.file === file) ? q.map((a) => (a.file === file ? { file, wrong } : a)) : single ? [{ file, wrong }] : [...q, { file, wrong }]));
      return false;
    }
  }

  async function addFiles(list) {
    changed();
    for (const file of single ? list.slice(0, 1) : list) {
      if (file.size > MAX_BYTES) setErr(`${file.name} is larger than 150 MB, which is too big to open in a browser.`);
      else if (!single && isPicture(file)) {
        const item = { id: ++seq.current, kind: "picture", file, name: file.name, size: file.size, pages: 1, thumb: URL.createObjectURL(file), range: "" };
        setItems((cur) => [...cur, item]);
      } else if (isPdf(file)) await loadPdf(file);
      else setErr(single ? "Please choose a PDF file." : `${file.name} is not a PDF, JPG, PNG or WebP file.`);
    }
  }

  async function submitPassword(e) {
    e.preventDefault();
    const { file } = asking[0];
    if (await loadPdf(file, pw)) setAsking((q) => q.filter((a) => a.file !== file));
    setPw("");
  }

  const removeItem = (x) => { changed(); drop(x); setItems(items.filter((y) => y !== x)); };
  const moveItem = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    changed();
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setItems(next);
  };

  // ---- the work ------------------------------------------------------------------
  const pdfOut = (bytes, name) => ({ blob: new Blob([bytes], { type: "application/pdf" }), name, pdf: true });
  function zipOut(files, names, zipName) {
    const used = new Map(), entries = {};
    names.forEach((n, i) => {
      const seen = used.get(n) || 0;
      used.set(n, seen + 1);
      entries[seen ? n.replace(/(\.[^.]+)$/, ` (${seen + 1})$1`) : n] = [files[i], { level: 0 }];
    });
    return { blob: new Blob([zipSync(entries)], { type: "application/zip" }), name: zipName, count: files.length };
  }

  async function work() {
    const base = it ? stem(it.name) : "file";
    const bytes = single ? await readBytes(it.file) : null;
    switch (ui.kind) {
      case "merge": {
        const parts = [];
        for (const x of items) {
          if (x.kind === "picture") { parts.push({ jpeg: await pictureToJpeg(x.file) }); continue; }
          let chosen;
          try { chosen = x.range.trim() ? parseRanges(x.range, x.pages).flat() : undefined; } catch (e) { throw new PdfError("range", `${x.name}: ${e.message}`); }
          parts.push({ bytes: await readBytes(x.file), password: x.password, pages: chosen });
        }
        return pdfOut(await merge(parts, (i, n) => setMsg(`Reading file ${i} of ${n}...`)), `${base}-merged.pdf`);
      }
      case "split": {
        let groups;
        if (o.splitMode === "ranges") groups = parseRanges(o.ranges, it.pages);
        else {
          const size = o.splitMode === "each" ? 1 : Math.floor(Number(o.every));
          if (!(size >= 1)) throw new PdfError("range", "Type how many pages each part should have.");
          groups = [];
          for (let i = 0; i < it.pages; i += size) groups.push(Array.from({ length: Math.min(size, it.pages - i) }, (_, k) => i + k));
        }
        if (groups.length > MAX_PARTS) throw new PdfError("range", `That would make ${groups.length} files. The limit is ${MAX_PARTS} at once, so use bigger parts or split in two goes.`);
        const files = await split(bytes, it.password, groups, (i, n) => setMsg(`Making file ${i} of ${n}...`));
        const names = groups.map((g) => `${base}-${partName(g)}.pdf`);
        return files.length === 1 ? pdfOut(files[0], names[0]) : zipOut(files, names, `${base}-split.zip`);
      }
      case "grid": {
        const keep = pages.filter((p) => p.on);
        const moved = pages.some((p, i) => p.index !== i), turned = keep.some((p) => p.rotate);
        if (!keep.length) throw new PdfError("range", ui.mode === "extract" ? "Click at least one page to keep." : "At least one page must stay in the file.");
        if (ui.mode === "delete" && keep.length === pages.length) throw new PdfError("range", "Click the pages you want to delete first.");
        if (ui.mode === "rotate" && !turned) throw new PdfError("range", "Turn at least one page first.");
        if (ui.mode === "organize" && !moved && !turned && keep.length === pages.length) throw new PdfError("range", "Move, turn or remove a page first.");
        return pdfOut(await pick(bytes, it.password, keep.map(({ index, rotate }) => ({ index, rotate }))), `${base}-${ui.done}.pdf`);
      }
      case "unlock":
        return pdfOut(await unlock(bytes, it.password), `${base}-unlocked.pdf`);
      case "protect": {
        if (o.newPw.length < 4) throw new PdfError("range", "Type a password of at least 4 characters.");
        if (o.newPw !== o.newPw2) throw new PdfError("range", "The two passwords do not match.");
        return pdfOut(await protect(bytes, it.password, o.newPw), `${base}-protected.pdf`);
      }
      case "watermark": {
        const text = o.text.trim();
        if (!text) throw new PdfError("range", "Type the watermark text.");
        return pdfOut(await watermark(bytes, it.password, { png: canvasPng(drawMark(text, o.color)), opacity: o.opacity, angle: o.angle, size: o.size, layout: o.layout }), `${base}-watermarked.pdf`);
      }
      case "numbers": {
        const from = Math.floor(Number(o.from)), start = Math.floor(Number(o.start));
        if (!(from >= 1 && from <= it.pages)) throw new PdfError("range", `Start numbering from a page between 1 and ${it.pages}.`);
        if (!(start >= 0)) throw new PdfError("range", "The first number must be 0 or more.");
        return pdfOut(await numberPages(bytes, it.password, { format: o.format, pos: o.pos, size: o.fontSize, start, from }), `${base}-numbered.pdf`);
      }
      case "images": {
        const list = o.imgRange.trim() ? [...new Set(parseRanges(o.imgRange, it.pages).flat())].sort((a, b) => a - b) : Array.from({ length: it.pages }, (_, i) => i);
        if (list.length > MAX_IMAGES) throw new PdfError("range", `That is ${list.length} pages. Up to ${MAX_IMAGES} pages can be converted at once, so type a smaller range in Pages.`);
        const files = [];
        for (const [k, i] of list.entries()) {
          setMsg(`Converting page ${k + 1} of ${list.length}...`);
          const { canvas } = await renderPage(it.doc, i + 1, 0, o.dpi);
          files.push(new Uint8Array(await (await (o.image === "png" ? toPng(canvas) : toJpeg(canvas, 0.9))).arrayBuffer()));
          canvas.width = canvas.height = 0;
        }
        const names = list.map((i) => `${base}-page-${i + 1}.${o.image}`);
        return files.length === 1 ? { blob: new Blob([files[0]], { type: o.image === "png" ? "image/png" : "image/jpeg" }), name: names[0] } : zipOut(files, names, `${base}-${o.image}.zip`);
      }
    }
  }

  async function run() {
    setErr("");
    setRes(null);
    setBusy(true);
    setMsg("Working...");
    try {
      setRes(await work());
    } catch (e) {
      setErr(explain(e));
    } finally {
      setBusy(false);
      setMsg("");
    }
  }

  function sendTo(href) {
    setHandoff(new File([res.blob], res.name, { type: "application/pdf" }));
    router.push(href);
  }

  const ready = single ? !!it : items.length >= 2;
  const next = [["Compress to exact size", "/tools/compress-to-exact-size"], ...NEXT.filter((slug) => slug !== op).map((slug) => [PDF_OPS[slug].name, PDF_OPS[slug].path])];

  // ---- step 1: the file(s) ---------------------------------------------------------
  const chooser = (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">1. {single ? "Choose your PDF" : "Add your files"}</h2>
      <FileDrop
        accept={single ? ".pdf,application/pdf" : ".pdf,application/pdf,image/jpeg,image/png,image/webp"}
        multiple={!single}
        onFiles={addFiles}
        label={single ? (it ? it.name : "Click or drop a PDF") : items.length ? "Add more files" : "Click or drop PDFs and pictures"}
        hint="Stays on your device. Nothing is uploaded."
      />

      {asking[0] && (
        <form onSubmit={submitPassword} className="mt-4 rounded-xl border border-border bg-background p-4">
          <label htmlFor="pdf-pw" className="block text-sm font-medium mb-2 break-all">{asking[0].file.name} is password protected. Type its password to open it.</label>
          <div className="flex gap-2">
            <input id="pdf-pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="off" autoFocus className={field} />
            <button type="submit" disabled={!pw} className="px-4 rounded-xl gradient-bg text-white text-sm font-semibold disabled:opacity-40">Open</button>
            <button type="button" onClick={() => { setAsking((q) => q.slice(1)); setPw(""); }} className={ghost}>Skip</button>
          </div>
          {asking[0].wrong && <p role="alert" className="mt-2 text-sm text-red-600">That password is not correct. Try again.</p>}
          <p className="mt-2 text-xs text-muted">The password is used only inside your browser. It is not sent or saved anywhere.</p>
        </form>
      )}

      {single && it && (
        <p className="mt-3 text-xs text-muted">{plural(it.pages, "page")}, {fmtBytes(it.size)}{it.password ? ". Opened with your password; the new file is saved without it." : ""}</p>
      )}

      {!single && items.length > 0 && (
        <ol className="mt-4 space-y-2">
          {items.map((x, i) => (
            <li
              key={x.id}
              draggable
              onDragStart={() => { drag.current = i; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (drag.current !== null) moveItem(drag.current, i); drag.current = null; }}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-2"
            >
              <img src={x.thumb} alt="" draggable={false} className="w-10 h-12 object-contain bg-white rounded border border-border shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{i + 1}. {x.name}</p>
                <p className="text-xs text-muted">{x.kind === "picture" ? "Picture" : plural(x.pages, "page")}, {fmtBytes(x.size)}</p>
                {x.kind === "pdf" && x.pages > 1 && (
                  <input aria-label={`Pages to take from ${x.name}`} value={x.range} onChange={(e) => { changed(); setItems(items.map((y) => (y.id === x.id ? { ...y, range: e.target.value } : y))); }} placeholder="Pages: all (or type 1-3, 5)" className="mt-1 w-full px-2 py-1 rounded-lg border border-border bg-surface text-xs focus:outline-none focus:border-primary" />
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => moveItem(i, i - 1)} disabled={i === 0} aria-label={`Move ${x.name} up`} className={ghost}>&uarr;</button>
                <button type="button" onClick={() => moveItem(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${x.name} down`} className={ghost}>&darr;</button>
                <button type="button" onClick={() => removeItem(x)} aria-label={`Remove ${x.name}`} className={ghost}>&times;</button>
              </div>
            </li>
          ))}
        </ol>
      )}
      {!single && items.length === 1 && <p className="mt-3 text-xs text-muted">Add at least one more file to merge.</p>}
    </div>
  );

  // ---- step 2: options ------------------------------------------------------------
  let options = null;
  if (ui.kind === "split") {
    options = (
      <>
        <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="How to split">
          {[["ranges", "By ranges"], ["every", "Every few pages"], ["each", "Every page"]].map(([k, l]) => <button key={k} type="button" onClick={() => { changed(); set({ splitMode: k }); }} className={chip(o.splitMode === k)}>{l}</button>)}
        </div>
        {o.splitMode === "ranges" && (
          <>
            <label htmlFor="sp-r" className={label}>Page ranges, one file for each part between commas</label>
            <input id="sp-r" value={o.ranges} onChange={(e) => { changed(); set({ ranges: e.target.value }); }} placeholder="for example 1-3, 4-8, 9-" className={field} />
          </>
        )}
        {o.splitMode === "every" && (
          <>
            <label htmlFor="sp-n" className={label}>Pages in each file</label>
            <input id="sp-n" type="number" min="1" value={o.every} onChange={(e) => { changed(); set({ every: e.target.value }); }} className={field} />
          </>
        )}
        {o.splitMode === "each" && <p className="text-sm text-muted">Each page is saved as its own PDF.</p>}
      </>
    );
  } else if (ui.kind === "unlock") {
    options = (
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted">
        <li>If the file asks for a password when you open it, you type it in step 1.</li>
        <li>Files that only block printing, copying or editing are unlocked directly.</li>
        <li>Only unlock files that are yours or that you are allowed to change.</li>
      </ul>
    );
  } else if (ui.kind === "protect") {
    options = (
      <>
        <label htmlFor="np1" className={label}>New password</label>
        <input id="np1" type={o.show ? "text" : "password"} value={o.newPw} onChange={(e) => { changed(); set({ newPw: e.target.value }); }} autoComplete="new-password" maxLength={64} className={field + " mb-3"} />
        <label htmlFor="np2" className={label}>Type it again</label>
        <input id="np2" type={o.show ? "text" : "password"} value={o.newPw2} onChange={(e) => { changed(); set({ newPw2: e.target.value }); }} autoComplete="new-password" maxLength={64} className={field} />
        <label className="mt-3 flex items-center gap-2 text-xs text-muted cursor-pointer"><input type="checkbox" checked={o.show} onChange={(e) => set({ show: e.target.checked })} /> Show the password</label>
        {o.newPw && o.newPw.length < 8 && <p className="mt-2 text-xs text-accent">Short passwords are easy to guess. Use 8 or more characters.</p>}
        {o.newPw2 && o.newPw !== o.newPw2 && <p className="mt-2 text-xs text-red-600">The two passwords do not match yet.</p>}
        <p className="mt-3 text-xs text-muted">Nobody can open the file without this password, and we cannot recover it for you. Keep it safe.</p>
      </>
    );
  } else if (ui.kind === "watermark") {
    options = (
      <>
        <label htmlFor="wm-t" className={label}>Watermark text (any language)</label>
        <input id="wm-t" value={o.text} onChange={(e) => { changed(); set({ text: e.target.value }); }} maxLength={60} className={field} />
        <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
          {MARK_TEXTS.map((t) => { const v = typeof t === "function" ? t() : t; return <button key={v} type="button" onClick={() => { changed(); set({ text: v }); }} className={ghost}>{v}</button>; })}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Where to put it">
          <button type="button" onClick={() => { changed(); set({ layout: "center", size: 0.7 }); }} className={chip(o.layout === "center")}>Once, in the middle</button>
          <button type="button" onClick={() => { changed(); set({ layout: "tile", size: 0.3 }); }} className={chip(o.layout === "tile")}>Repeat over the page</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4" role="group" aria-label="Colour">
          {MARK_COLORS.map(([name, hex]) => <button key={hex} type="button" onClick={() => { changed(); set({ color: hex }); }} aria-label={name} aria-pressed={o.color === hex} className={`w-7 h-7 rounded-full border-2 ${o.color === hex ? "border-primary" : "border-border"}`} style={{ background: hex }} />)}
          <input type="color" aria-label="Another colour" value={o.color} onChange={(e) => { changed(); set({ color: e.target.value }); }} className="w-9 h-8 rounded border border-border bg-background" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label htmlFor="wm-s" className={label}>Size</label><input id="wm-s" type="range" min="0.1" max="1" step="0.05" value={o.size} onChange={(e) => { changed(); set({ size: Number(e.target.value) }); }} className="w-full" /></div>
          <div><label htmlFor="wm-o" className={label}>Strength</label><input id="wm-o" type="range" min="0.05" max="1" step="0.05" value={o.opacity} onChange={(e) => { changed(); set({ opacity: Number(e.target.value) }); }} className="w-full" /></div>
          <div><label htmlFor="wm-a" className={label}>Angle ({o.angle}&deg;)</label><input id="wm-a" type="range" min="-90" max="90" step="15" value={o.angle} onChange={(e) => { changed(); set({ angle: Number(e.target.value) }); }} className="w-full" /></div>
        </div>
      </>
    );
  } else if (ui.kind === "numbers") {
    options = (
      <>
        <p className={label}>Style</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Object.entries(NUMBER_FORMATS).map(([k, f]) => <button key={k} type="button" onClick={() => { changed(); set({ format: k }); }} className={chip(o.format === k)}>{f.label}</button>)}
        </div>
        <p className={label}>Position on the page</p>
        <div className="grid grid-cols-3 gap-1.5 w-44 p-2 mb-4 rounded-lg border border-border bg-white" role="group" aria-label="Position on the page">
          {POSITIONS.map(([k, l], i) => <button key={k} type="button" onClick={() => { changed(); set({ pos: k }); }} aria-label={l} aria-pressed={o.pos === k} className={`h-9 rounded text-[11px] font-semibold ${i < 3 ? "mb-8" : ""} ${o.pos === k ? "gradient-bg text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{o.pos === k ? "1" : ""}</button>)}
        </div>
        <p className={label}>Text size</p>
        <div className="flex gap-1.5 mb-4">
          {[[9, "Small"], [11, "Medium"], [14, "Large"]].map(([s, l]) => <button key={s} type="button" onClick={() => { changed(); set({ fontSize: s }); }} className={chip(o.fontSize === s)}>{l}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor="pn-f" className={label}>Start numbering from page</label><input id="pn-f" type="number" min="1" value={o.from} onChange={(e) => { changed(); set({ from: e.target.value }); }} className={field} /></div>
          <div><label htmlFor="pn-s" className={label}>First number</label><input id="pn-s" type="number" min="0" value={o.start} onChange={(e) => { changed(); set({ start: e.target.value }); }} className={field} /></div>
        </div>
      </>
    );
  } else if (ui.kind === "images") {
    options = (
      <>
        <p className={label}>Picture type</p>
        <div className="flex gap-1.5 mb-4">
          {[["jpg", "JPG (smaller)"], ["png", "PNG (sharper)"]].map(([k, l]) => <button key={k} type="button" onClick={() => { changed(); set({ image: k }); }} className={chip(o.image === k)}>{l}</button>)}
        </div>
        <p className={label}>Quality</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {[[96, "Screen (96 DPI)"], [150, "Good (150 DPI)"], [300, "Print (300 DPI)"]].map(([d, l]) => <button key={d} type="button" onClick={() => { changed(); set({ dpi: d }); }} className={chip(o.dpi === d)}>{l}</button>)}
        </div>
        <label htmlFor="im-r" className={label}>Pages (leave empty for every page)</label>
        <input id="im-r" value={o.imgRange} onChange={(e) => { changed(); set({ imgRange: e.target.value }); }} placeholder="for example 1-3, 5" className={field} />
      </>
    );
  }

  const optionsCard = options && (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">2. {ui.kind === "unlock" ? "How it works" : "Set the options"}</h2>
      {options}
    </div>
  );

  const gridCard = ui.kind === "grid" && it && pages.length > 0 && (
    <div className={card}>
      <h2 className="text-lg font-semibold mb-4">2. {{ extract: "Choose the pages to keep", delete: "Choose the pages to delete", organize: "Arrange the pages", rotate: "Turn the pages" }[ui.mode]}</h2>
      <PdfPageGrid doc={it.doc} pages={pages} setPages={(p) => { changed(); setPages(p); }} mode={ui.mode} />
    </div>
  );

  // ---- step 3: the result -----------------------------------------------------------
  const result = (
    <div className={card + (ui.kind === "grid" ? "" : " lg:sticky lg:top-24")}>
      <h2 className="text-lg font-semibold mb-4">{options || ui.kind === "grid" ? "3" : "2"}. Download</h2>
      {ui.kind === "watermark" && it && <div className="mb-4"><MarkPreview doc={it.doc} text={o.text.trim()} opt={o} /></div>}
      <button type="button" onClick={run} disabled={!ready || busy} className="w-full py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 mb-4">
        {busy ? "Working..." : ui.action}
      </button>
      {busy && msg && <p className="text-sm text-muted mb-3" role="status">{msg}</p>}
      {err && <p role="alert" className="mb-4 text-sm text-red-600 break-words">{err}</p>}
      {res ? (
        <div className="text-center">
          <p className="text-sm mb-1 break-all"><strong>{res.name}</strong></p>
          <p className="text-sm text-muted mb-4">{fmtBytes(res.blob.size)}{res.count ? `, ${res.count} files inside` : ""}</p>
          <button type="button" onClick={() => downloadBlob(res.blob, res.name)} className="px-6 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Download {res.count ? "ZIP" : res.pdf ? "PDF" : "picture"}
          </button>
          {res.pdf && (
            <div className="mt-5 pt-4 border-t border-border text-left">
              <p className="text-xs font-medium mb-2">Do more with this file, without uploading it:</p>
              <div className="flex flex-wrap gap-1.5">
                {next.map(([name, href]) => <button key={href} type="button" onClick={() => sendTo(href)} className={ghost}>{name}</button>)}
              </div>
            </div>
          )}
        </div>
      ) : (
        !err && !busy && <p className="text-sm text-muted">Your new file will appear here.</p>
      )}
      <p className="mt-5 text-xs text-muted">Everything happens in your browser. Your file and any password are not uploaded.</p>
    </div>
  );

  if (ui.kind === "grid") return <div className="space-y-5">{chooser}{gridCard}{result}</div>;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-5">{chooser}{optionsCard}</div>
      {result}
    </div>
  );
}
