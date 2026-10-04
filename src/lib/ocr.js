// Browser-only OCR helpers: run Tesseract, rebuild rows/columns from word positions, write .xlsx / .docx / .csv.
import { zipSync, strToU8 } from "fflate";

export const LANGS = {
  eng: { label: "English", codes: ["eng"] },
  hin: { label: "Hindi", codes: ["hin"] },
  "eng+hin": { label: "English + Hindi", codes: ["eng", "hin"] },
};

let workerCache = { key: "", worker: null };

export async function getWorker(langKey, onProgress) {
  if (workerCache.key === langKey && workerCache.worker) return workerCache.worker;
  if (workerCache.worker) await workerCache.worker.terminate();
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(LANGS[langKey].codes, 1, {
    logger: (m) => onProgress && onProgress(m),
  });
  workerCache = { key: langKey, worker };
  return worker;
}

export async function stopWorker() {
  if (workerCache.worker) await workerCache.worker.terminate();
  workerCache = { key: "", worker: null };
}

/** OCR one canvas/image. mode "table" keeps rows intact (single block); "text" lets Tesseract find the layout. */
export async function ocrCanvas(worker, canvas, mode) {
  await worker.setParameters({ tessedit_pageseg_mode: mode === "table" ? "6" : "3", preserve_interword_spaces: "1" });
  const { data } = await worker.recognize(canvas, {}, { text: true, tsv: true });
  return { text: (data.text || "").trim(), words: parseTsv(data.tsv || "") };
}

// TSV columns: level page block par line word left top width height conf text
export function parseTsv(tsv) {
  const words = [];
  for (const line of tsv.split("\n")) {
    const c = line.split("\t");
    if (c.length < 12 || c[0] !== "5") continue;
    const text = c.slice(11).join("\t").trim();
    const conf = parseFloat(c[10]);
    if (!text || conf < 15) continue;
    words.push({ text, x: +c[6], y: +c[7], w: +c[8], h: +c[9] });
  }
  return words;
}

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

/** Words -> table rows: group by line, split a line into cells at wide gaps, then align cells to shared columns. */
export function wordsToTable(words) {
  if (!words.length) return [];
  const mh = median(words.map((w) => w.h)) || 10;
  const sorted = [...words].sort((a, b) => a.y + a.h / 2 - (b.y + b.h / 2) || a.x - b.x);

  const rows = [];
  for (const w of sorted) {
    const cy = w.y + w.h / 2;
    const last = rows[rows.length - 1];
    if (last && Math.abs(cy - last.cy) < mh * 0.6) {
      last.words.push(w);
      last.cy = (last.cy * (last.words.length - 1) + cy) / last.words.length;
    } else rows.push({ cy, words: [w] });
  }

  // cells = runs of words with small gaps
  const gap = mh * 1.3;
  const lineCells = rows.map((r) => {
    const ws = r.words.sort((a, b) => a.x - b.x);
    const cells = [];
    for (const w of ws) {
      const cur = cells[cells.length - 1];
      if (cur && w.x - cur.right < gap) { cur.text += " " + w.text; cur.right = w.x + w.w; }
      else cells.push({ text: w.text, left: w.x, right: w.x + w.w });
    }
    return cells;
  });

  // column anchors = clusters of cell left edges
  const lefts = lineCells.flat().map((c) => c.left).sort((a, b) => a - b);
  const anchors = [];
  for (const l of lefts) {
    const a = anchors[anchors.length - 1];
    if (a && l - a.last < mh * 1.5) { a.sum += l; a.n++; a.last = l; } else anchors.push({ sum: l, n: 1, last: l });
  }
  const cols = anchors.filter((a) => a.n >= Math.max(2, Math.ceil(rows.length * 0.2))).map((a) => a.sum / a.n);
  if (!cols.length) return lineCells.map((cells) => [cells.map((c) => c.text).join(" ")]);

  return lineCells.map((cells) => {
    const out = Array(cols.length).fill("");
    for (const c of cells) {
      let best = 0;
      for (let i = 1; i < cols.length; i++) if (Math.abs(cols[i] - c.left) < Math.abs(cols[best] - c.left)) best = i;
      out[best] = out[best] ? out[best] + " " + c.text : c.text;
    }
    return out;
  });
}

export const textToRows = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => [l]);

// ---------- writers ----------
const xmlEsc = (s) => String(s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const colName = (i) => {
  let n = i + 1, s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
};

const isPlainNumber = (v) => /^-?(0|[1-9]\d{0,14})(\.\d+)?$/.test(v);

/** sheets: [{ name, rows: string[][] }] -> .xlsx bytes. Numbers with leading zeros (phone numbers, roll numbers) stay text. */
export function toXlsx(sheets) {
  const sheetXml = (rows) =>
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>` +
    rows
      .map(
        (r, ri) =>
          `<row r="${ri + 1}">` +
          r
            .map((v, ci) => {
              const ref = colName(ci) + (ri + 1);
              if (v === "") return "";
              return isPlainNumber(v) ? `<c r="${ref}"><v>${v}</v></c>` : `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
            })
            .join("") +
          `</row>`
      )
      .join("") +
    `</sheetData></worksheet>`;

  const names = sheets.map((s, i) => xmlEsc((s.name || `Sheet${i + 1}`).replace(/[\\/?*[\]:]/g, " ").slice(0, 31)));
  const files = {
    "[Content_Types].xml": strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
        sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("") +
        `</Types>`
    ),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    "xl/workbook.xml": strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>` +
        names.map((n, i) => `<sheet name="${n}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("") +
        `</sheets></workbook>`
    ),
    "xl/_rels/workbook.xml.rels": strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
        sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("") +
        `</Relationships>`
    ),
  };
  sheets.forEach((s, i) => (files[`xl/worksheets/sheet${i + 1}.xml`] = strToU8(sheetXml(s.rows))));
  return zipSync(files);
}

/** pages: [{ rows: string[][], table: boolean }] -> .docx bytes (a Word table for table pages, paragraphs for text pages). */
export function toDocx(pages) {
  const para = (t) => `<w:p><w:r><w:t xml:space="preserve">${xmlEsc(t)}</w:t></w:r></w:p>`;
  const border = ["top", "left", "bottom", "right", "insideH", "insideV"].map((b) => `<w:${b} w:val="single" w:sz="4" w:space="0" w:color="999999"/>`).join("");
  const table = (rows) => {
    const n = Math.max(1, ...rows.map((r) => r.length));
    return (
      `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${border}</w:tblBorders></w:tblPr><w:tblGrid>${Array(n).fill('<w:gridCol w:w="2000"/>').join("")}</w:tblGrid>` +
      rows.map((r) => `<w:tr>${Array.from({ length: n }, (_, i) => `<w:tc><w:tcPr><w:tcW w:w="2000" w:type="dxa"/></w:tcPr>${para(r[i] || "")}</w:tc>`).join("")}</w:tr>`).join("") +
      `</w:tbl><w:p/>`
    );
  };
  const body = pages
    .map((p, i) => (i ? `<w:p><w:r><w:br w:type="page"/></w:r></w:p>` : "") + (p.table ? table(p.rows) : p.rows.map((r) => para(r.join(" "))).join("")))
    .join("");
  return zipSync({
    "[Content_Types].xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`),
    "word/document.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr/></w:body></w:document>`),
  });
}

export function toCsv(rows) {
  const q = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return "﻿" + rows.map((r) => r.map(q).join(",")).join("\r\n");
}
