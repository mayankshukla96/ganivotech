// Browser-only spreadsheet readers: CSV/TXT and .xlsx (no external spreadsheet library).
import { unzipSync } from "fflate";

export const MAX_ROWS = 20000;

const colLetter = (i) => {
  let n = i + 1, s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
};
export { colLetter };

const trimTable = (rows) => {
  const out = rows.map((r) => {
    const a = [...r];
    while (a.length && String(a.at(-1)).trim() === "") a.pop();
    return a;
  });
  while (out.length && !out.at(-1).length) out.pop();
  return out.slice(0, MAX_ROWS);
};

/** CSV / TSV / semicolon text -> rows. Handles quotes, escaped quotes, newlines inside quotes and a BOM. */
export function parseCsv(text) {
  text = text.replace(/^﻿/, "");
  const first = text.split(/\r?\n/, 1)[0] || "";
  const count = (ch) => { let q = false, n = 0; for (const c of first) { if (c === '"') q = !q; else if (!q && c === ch) n++; } return n; };
  const counts = [",", ";", "\t"].map((d) => [d, count(d)]).sort((a, b) => b[1] - a[1]);
  const delim = counts[0][1] > 0 ? counts[0][0] : ",";

  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"' && cell === "") q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  row.push(cell);
  rows.push(row);
  return trimTable(rows);
}

// ---------- xlsx ----------
const REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const dec = new TextDecoder();
const xml = (s) => new DOMParser().parseFromString(s, "application/xml");

const BUILTIN_DATE = new Set([14, 15, 16, 17, 18, 19, 20, 21, 22, 45, 46, 47]);

function excelDate(serial) {
  const ms = Math.round((serial - 25569) * 86400000);
  const d = new Date(ms);
  if (isNaN(d)) return String(serial);
  const iso = d.toISOString();
  return serial % 1 === 0 ? iso.slice(0, 10) : `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

/** .xlsx bytes -> [{ name, rows }]. Dates are shown as YYYY-MM-DD, numbers as stored. */
export function parseXlsx(buf) {
  const files = unzipSync(new Uint8Array(buf));
  const get = (p) => (files[p] ? dec.decode(files[p]) : null);
  const wbXml = get("xl/workbook.xml");
  if (!wbXml) throw new Error("not-xlsx");
  const wb = xml(wbXml);

  const rels = {};
  const relXml = get("xl/_rels/workbook.xml.rels");
  if (relXml) for (const r of xml(relXml).getElementsByTagName("Relationship")) rels[r.getAttribute("Id")] = r.getAttribute("Target");

  const shared = [];
  const ssXml = get("xl/sharedStrings.xml");
  if (ssXml) {
    for (const si of xml(ssXml).getElementsByTagName("si")) {
      let s = "";
      for (const t of si.getElementsByTagName("t")) if (t.parentNode.nodeName !== "rPh") s += t.textContent;
      shared.push(s);
    }
  }

  // which cell styles are dates
  const dateStyle = new Set();
  const stXml = get("xl/styles.xml");
  if (stXml) {
    const st = xml(stXml);
    const custom = {};
    for (const n of st.getElementsByTagName("numFmt")) custom[n.getAttribute("numFmtId")] = n.getAttribute("formatCode") || "";
    const xfs = st.getElementsByTagName("cellXfs")[0];
    if (xfs) [...xfs.getElementsByTagName("xf")].forEach((xf, i) => {
      const id = Number(xf.getAttribute("numFmtId"));
      const code = (custom[id] || "").replace(/"[^"]*"|\[[^\]]*\]|\\./g, "");
      if (BUILTIN_DATE.has(id) || (custom[id] && /[dmyh]/i.test(code) && !/[0#?]/.test(code))) dateStyle.add(i);
    });
  }

  const sheets = [];
  for (const sh of wb.getElementsByTagName("sheet")) {
    const name = sh.getAttribute("name");
    const rid = sh.getAttributeNS(REL_NS, "id") || sh.getAttribute("r:id");
    let target = rels[rid] || "";
    target = target.startsWith("/") ? target.slice(1) : "xl/" + target.replace(/^\.\//, "");
    const sx = get(target);
    if (!sx) continue;
    const rows = [];
    for (const row of xml(sx).getElementsByTagName("row")) {
      const r = [];
      for (const c of row.getElementsByTagName("c")) {
        const ref = c.getAttribute("r") || "";
        const letters = ref.replace(/[0-9]/g, "");
        let col = 0;
        for (const ch of letters) col = col * 26 + (ch.charCodeAt(0) - 64);
        col -= 1;
        if (col < 0) col = r.length;
        const t = c.getAttribute("t");
        const v = c.getElementsByTagName("v")[0]?.textContent ?? "";
        let val = "";
        if (t === "s") val = shared[Number(v)] ?? "";
        else if (t === "inlineStr") val = [...c.getElementsByTagName("t")].map((x) => x.textContent).join("");
        else if (t === "str") val = v;
        else if (t === "b") val = v === "1" ? "TRUE" : "FALSE";
        else if (t === "e") val = "";
        else if (v !== "") val = dateStyle.has(Number(c.getAttribute("s"))) && !isNaN(Number(v)) ? excelDate(Number(v)) : v;
        while (r.length < col) r.push("");
        r[col] = val;
      }
      const rn = Number(row.getAttribute("r")) - 1;
      if (rn >= 0) while (rows.length < rn) rows.push([]);
      rows.push(r);
      if (rows.length > MAX_ROWS) break;
    }
    sheets.push({ name, rows: trimTable(rows) });
  }
  if (!sheets.length) throw new Error("not-xlsx");
  return sheets;
}

/** File -> [{ name, rows }] (a CSV gives one sheet). .xls (old Excel) is not supported. */
export async function readTableFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "xlsx" || ext === "xlsm") return parseXlsx(await file.arrayBuffer());
  if (ext === "xls") throw new Error("xls");
  return [{ name: file.name, rows: parseCsv(await file.text()) }];
}
