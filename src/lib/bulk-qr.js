// Browser-only bulk QR engine: merge spreadsheet rows into QR content, then build a ZIP or printable PDF sheets.
import { strToU8, zipSync, zlibSync } from "fflate";
import { qrToSvg, svgToDataUrl } from "@/lib/qr-svg";
import { buildPdf } from "@/lib/pdf-tools";
import { toJpeg } from "@/lib/image-tools";

export const MAX_ZIP = 1000;
export const MAX_PDF = 500;

const norm = (s) => String(s).trim().toLowerCase();
// yield to the page without setTimeout, which browsers slow to 1 second in background tabs
const channel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
const tick = () => new Promise((r) => { if (!channel) return setTimeout(r, 0); channel.port1.onmessage = () => r(); channel.port2.postMessage(0); });

export function columnIndex(headers, name) {
  const n = norm(name);
  const i = headers.findIndex((h) => norm(h) === n);
  if (i >= 0) return i;
  const m = n.match(/^col(?:umn)?\s*([a-z]+)$/); // "Column B"
  if (m) {
    let c = 0;
    for (const ch of m[1]) c = c * 26 + (ch.charCodeAt(0) - 96);
    return c - 1 < headers.length ? c - 1 : -1;
  }
  return -1;
}

const PLACEHOLDER = /\{([^{}|]+?)(?:\|(url|digits))?\}/g;

/** Replace {Column} (or {Column|url}, {Column|digits}) with the row's cell values. */
export function fillTemplate(template, headers, row) {
  const missing = new Set();
  const text = template.replace(PLACEHOLDER, (_, name, mod) => {
    const i = columnIndex(headers, name);
    if (i < 0) { missing.add(name.trim()); return ""; }
    let v = String(row[i] ?? "").trim();
    if (mod === "url") v = encodeURIComponent(v);
    else if (mod === "digits") v = v.replace(/\D/g, "");
    return v;
  });
  return { text, missing };
}

/** Clean up what a template produced: drop empty URL parameters and empty vCard lines, add https:// to bare domains. */
export function tidy(text, autoHttps = true) {
  let t = text.trim();
  if (/^(upi:\/\/|https?:\/\/)/i.test(t) && t.includes("?")) {
    const [base, ...rest] = t.split("?");
    const q = rest.join("?").split("&").filter((p) => p && !/^[^=]+=$/.test(p)).join("&");
    t = base + (q ? "?" + q : "");
  } else if (/^BEGIN:VCARD/i.test(t)) {
    t = t.split(/\r?\n/).filter((l) => !/^[A-Z;=\-]+:\s*$/i.test(l.trim())).join("\n");
  } else if (autoHttps && !/^[a-z][a-z0-9+.-]*:/i.test(t) && !/\s/.test(t) && !t.includes("@") && /^(www\.)?[\w-]+(\.[\w-]+)*\.[a-z]{2,}(\/\S*)?$/i.test(t)) {
    t = "https://" + t;
  }
  return t;
}

/** rows -> items to turn into QR codes. firstRow = spreadsheet row number of rows[0] (for messages). */
export function buildItems(rows, headers, { template, labelCol = -1, autoHttps = true, firstRow = 2 }) {
  const items = [], skipped = [], missing = new Set();
  rows.forEach((row, i) => {
    const n = firstRow + i;
    if (!row.some((c) => String(c).trim() !== "")) return; // blank spreadsheet row
    const f = fillTemplate(template, headers, row);
    f.missing.forEach((m) => missing.add(m));
    const text = tidy(f.text, autoHttps);
    if (!text) { skipped.push({ n, reason: "nothing to put in the QR code" }); return; }
    items.push({ n, text, label: labelCol >= 0 ? String(row[labelCol] ?? "").trim() : "" });
  });
  return { items, skipped, missing: [...missing] };
}

export function fileNames(items, ext) {
  const used = new Set();
  return items.map((it) => {
    let base = (it.label || `qr-${it.n}`).replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").replace(/^[.\s]+|[.\s]+$/g, "").slice(0, 80) || `qr-${it.n}`;
    let name = base, k = 2;
    while (used.has(name.toLowerCase())) name = `${base}-${k++}`;
    used.add(name.toLowerCase());
    return `${name}.${ext}`;
  });
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Add a text caption strip under a QR svg (made by qrToSvg). */
export function addCaption(svg, text, color = "#111111", bg = "#ffffff") {
  const N = +svg.match(/viewBox="0 0 ([\d.]+) [\d.]+"/)[1];
  const size = +svg.match(/ width="([\d.]+)"/)[1];
  const capH = +(N * 0.16).toFixed(2);
  const fs = +(capH * 0.5).toFixed(2);
  const est = [...text].length * fs * 0.55;
  const fit = est > N * 0.9 ? ` textLength="${(N * 0.9).toFixed(2)}" lengthAdjust="spacingAndGlyphs"` : "";
  const H = +(N + capH).toFixed(2);
  return svg
    .replace(/viewBox="[^"]+"/, `viewBox="0 0 ${N} ${H}"`)
    .replace(/ height="[\d.]+"/, ` height="${+((size * H) / N).toFixed(1)}"`)
    .replace(
      "</svg>",
      `<rect x="0" y="${N}" width="${N}" height="${capH}" fill="${bg}"/><text x="${N / 2}" y="${(N + capH * 0.66).toFixed(2)}" font-size="${fs}" text-anchor="middle" font-family="'Segoe UI',Arial,'Noto Sans','Noto Sans Devanagari',sans-serif" fill="${color}"${fit}>${esc(text)}</text></svg>`
    );
}

function oneSvg(it, style, size, caption) {
  let svg = qrToSvg(it.text, { ...style, size });
  if (caption && it.label) svg = addCaption(svg, it.label, style.fg, style.bg);
  return svg;
}

// PNG written in plain JavaScript (RGB, "Up" filter + zlib). canvas.toBlob can crawl in background tabs, this cannot.
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function pngChunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

export function encodePng(canvas) {
  const { width: w, height: h } = canvas;
  const px = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const stride = w * 3, row = stride + 1;
  const raw = new Uint8Array(row * h);
  for (let y = 0; y < h; y++) {
    const o = y * row;
    raw[o] = y ? 2 : 0;
    for (let x = 0, s = y * w * 4, d = o + 1; x < w; x++, s += 4, d += 3) { raw[d] = px[s]; raw[d + 1] = px[s + 1]; raw[d + 2] = px[s + 2]; }
  }
  for (let y = h - 1; y > 0; y--) { // bottom-up, so the row above is still unfiltered
    const o = y * row + 1, p = (y - 1) * row + 1;
    for (let i = 0; i < stride; i++) raw[o + i] = (raw[o + i] - raw[p + i]) & 255;
  }
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h); ihdr[8] = 8; ihdr[9] = 2;
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk("IHDR", ihdr), pngChunk("IDAT", zlibSync(raw, { level: 6 })), pngChunk("IEND", new Uint8Array(0))];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}

async function svgToPng(svg) {
  const img = new Image();
  img.src = svgToDataUrl(svg);
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  c.getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0);
  return encodePng(c);
}

/** One ZIP with a PNG or SVG per item, plus _index.csv listing file -> content. */
export async function makeZip(items, { style, size = 800, format = "png", caption = true, onProgress }) {
  const names = fileNames(items, format);
  const files = {};
  const errors = [];
  const index = ["file,content,label"];
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    try {
      const svg = oneSvg(it, style, size, caption);
      files[names[i]] = format === "svg" ? strToU8(svg) : [await svgToPng(svg), { level: 0 }];
      index.push([q(names[i]), q(it.text), q(it.label)].join(","));
    } catch {
      errors.push({ n: it.n, reason: "too much text for one QR code" });
    }
    if (i % 8 === 7) { onProgress?.((i + 1) / items.length); await tick(); }
  }
  files["_index.csv"] = strToU8("﻿" + index.join("\r\n"));
  onProgress?.(1);
  return { blob: new Blob([zipSync(files)], { type: "application/zip" }), errors, count: items.length - errors.length };
}

/** Printable A4 sheets (cols x rows labels per page) as one PDF. */
export async function makeSheets(items, { style, caption = true, cols = 3, rows = 4, cutLines = true, onProgress }) {
  const DPI = 200, PW = Math.round(8.27 * DPI), PH = Math.round(11.69 * DPI), M = Math.round((10 / 25.4) * DPI);
  const per = cols * rows, cw = (PW - 2 * M) / cols, ch = (PH - 2 * M) / rows, pad = 16;
  const canvas = document.createElement("canvas");
  canvas.width = PW;
  canvas.height = PH;
  const ctx = canvas.getContext("2d");
  const pages = [], errors = [];
  const blank = () => { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, PW, PH); };
  blank();
  let onPage = 0;
  const flush = async () => {
    const blob = await toJpeg(canvas, 0.92);
    pages.push({ jpeg: new Uint8Array(await blob.arrayBuffer()), w: PW, h: PH, ptW: 595.28, ptH: 841.89 });
    blank();
    onPage = 0;
  };
  for (let i = 0; i < items.length; i++) {
    try {
      const img = new Image();
      img.src = svgToDataUrl(oneSvg(items[i], style, 800, caption));
      await img.decode();
      const x = M + (onPage % cols) * cw, y = M + Math.floor(onPage / cols) * ch;
      const s = Math.min((cw - 2 * pad) / img.naturalWidth, (ch - 2 * pad) / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, x + (cw - w) / 2, y + (ch - h) / 2, w, h);
      if (cutLines) { ctx.strokeStyle = "#c8c8c8"; ctx.lineWidth = 1; ctx.setLineDash([8, 8]); ctx.strokeRect(x, y, cw, ch); ctx.setLineDash([]); }
      onPage++;
    } catch {
      errors.push({ n: items[i].n, reason: "too much text for one QR code" });
    }
    if (onPage === per) await flush();
    if (i % 4 === 3) { onProgress?.((i + 1) / items.length); await tick(); }
  }
  if (onPage > 0) await flush();
  onProgress?.(1);
  return { blob: new Blob([buildPdf(pages)], { type: "application/pdf" }), errors, pages: pages.length };
}

export const SAMPLE_CSV = {
  urls: "Name,Link\nGanivotech,https://ganivotech.com\nQR Code Maker,ganivotech.com/tools/qr-generator\nPDF Maker,ganivotech.com/tools/pdf-maker\n",
  upi: "Shop Name,UPI ID,Amount\nSharma Store,sharma@okaxis,\nVerma Dairy,verma@oksbi,500\n",
  whatsapp: "Name,Phone,Message\nRahul Sharma,+91 98765 43210,Hello! I would like to know more.\nPriya Singh,09123456789,\n",
  vcard: "Name,Phone,Email,Company\nRahul Sharma,+919876543210,rahul@example.com,Ganivotech\nPriya Singh,+919123456789,,Example School\n",
  "id-cards": "Roll No,Student Name,Class\n101,Rahul Sharma,5A\n102,Priya Singh,5B\n103,Amit Patel,6A\n",
};

export const PRESETS = {
  urls: { template: "{Link}", label: "Name" },
  upi: { template: "upi://pay?pa={UPI ID}&pn={Shop Name|url}&am={Amount}&cu=INR", label: "Shop Name" },
  whatsapp: { template: "https://wa.me/{Phone|digits}?text={Message|url}", label: "Name" },
  vcard: { template: "BEGIN:VCARD\nVERSION:3.0\nFN:{Name}\nTEL:{Phone}\nEMAIL:{Email}\nORG:{Company}\nEND:VCARD", label: "Name" },
  "id-cards": { template: "{Roll No}", label: "Student Name" },
};
