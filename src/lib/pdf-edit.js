// PDF editing for the PDF Toolkit, built on pdf-lib (loaded only when a tool is used).
// Pure functions: bytes in, bytes out, no DOM and no network, so the same code runs in the browser and in `node scripts/check-pdf-edit.mjs`.

let libPromise;
const lib = () => (libPromise ||= import("@cantoo/pdf-lib"));

export const MAX_BYTES = 150 * 1024 * 1024;
const A4 = [595.28, 841.89];

/** `code` is one of: password (needed), wrong-password, damaged, range, not-locked. The screen turns it into a message. */
export class PdfError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code;
  }
}

async function open(bytes, password) {
  const PDF = await lib();
  try {
    // an empty password also opens files that are only locked against printing or copying
    const doc = await PDF.PDFDocument.load(bytes, { password: password || "", parseSpeed: PDF.ParseSpeeds.Fast, updateMetadata: false });
    // After decrypting, pdf-lib still holds the old lock record (with its password hashes) and the old index tables, and would
    // write them back as hidden leftovers. Sweep them out, so an unlocked file carries no trace of its password.
    if (doc.context.isDecrypted) sweep(doc, PDF);
    return doc;
  } catch (e) {
    const m = String(e?.message || "");
    if (/NEEDS PASSWORD/i.test(m)) throw new PdfError("password");
    if (/Password incorrect/i.test(m)) throw new PdfError(password ? "wrong-password" : "password");
    throw new PdfError("damaged");
  }
}

const save = (doc) => doc.save({ objectsPerTick: 200 });

/**
 * "1-3, 5, 8-" with n pages -> [[0,1,2],[4],[7..n-1]]: one group of 0-based page numbers for each comma part.
 * "5-3" counts down. Throws PdfError("range") with a readable message.
 */
export function parseRanges(text, n) {
  const parts = String(text ?? "").replace(/\s*[-–—]\s*/g, "-").split(/[,;\s]+/).filter(Boolean);
  if (!parts.length) throw new PdfError("range", "Type the page numbers, for example 1-3, 5.");
  return parts.map((part) => {
    const m = /^(\d+)(?:(-)(\d*))?$/.exec(part);
    if (!m) throw new PdfError("range", `"${part}" is not a page number or range. Use numbers like 1-3, 5.`);
    const a = Number(m[1]);
    const b = m[2] ? (m[3] ? Number(m[3]) : n) : a;
    if (a < 1 || b < 1 || a > n || b > n) throw new PdfError("range", `This PDF has ${n} page${n === 1 ? "" : "s"}, so "${part}" is out of range.`);
    const step = a <= b ? 1 : -1;
    return Array.from({ length: Math.abs(b - a) + 1 }, (_, i) => a - 1 + i * step);
  });
}

// Filled-in form fields do not survive being copied to a new file, so their values are first drawn onto the page as normal content.
function flatten(doc) {
  try {
    const form = doc.getForm();
    if (form.getFields().length) form.flatten();
  } catch {}
}

/**
 * Remove everything the finished document does not use.
 * Copying a page can drag other pages along by reference (a link, a bookmark target, a form field), where they would stay
 * hidden inside the file. Those are deleted first, then every object that can no longer be reached from the document root.
 */
function sweep(doc, PDF) {
  const { PDFRef, PDFDict, PDFArray, PDFStream, PDFName } = PDF;
  const ctx = doc.context;
  const kept = new Set(doc.getPages().map((p) => p.ref));
  const TYPE = PDFName.of("Type"), PAGE = PDFName.of("Page");
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (obj instanceof PDFDict && obj.lookup(TYPE) === PAGE && !kept.has(ref)) ctx.delete(ref);
  }
  const seen = new Set();
  const stack = Object.values(ctx.trailerInfo).filter(Boolean);
  while (stack.length) {
    const o = stack.pop();
    if (o instanceof PDFRef) {
      if (seen.has(o)) continue;
      seen.add(o);
      const target = ctx.lookup(o);
      if (target) stack.push(target);
    } else if (o instanceof PDFDict) for (const v of o.values()) stack.push(v);
    else if (o instanceof PDFArray) for (const v of o.asArray()) stack.push(v);
    else if (o instanceof PDFStream) stack.push(o.dict);
  }
  for (const [ref] of ctx.enumerateIndirectObjects()) if (!seen.has(ref)) ctx.delete(ref);
}

/** sources: [{ doc, pages: number[] } | { jpeg: Uint8Array }] -> a new document with exactly those pages, in that order. */
async function compose(sources) {
  const PDF = await lib();
  const out = await PDF.PDFDocument.create();
  for (const s of sources) {
    if (s.jpeg) {
      // a picture becomes an A4 page, turned to suit the picture
      const img = await out.embedJpg(s.jpeg);
      const [W, H] = img.width > img.height ? [A4[1], A4[0]] : A4;
      const k = Math.min(W / img.width, H / img.height);
      out.addPage([W, H]).drawImage(img, { x: (W - img.width * k) / 2, y: (H - img.height * k) / 2, width: img.width * k, height: img.height * k });
    } else {
      (await out.copyPages(s.doc, s.pages)).forEach((p) => out.addPage(p));
    }
  }
  await out.flush();
  sweep(out, PDF);
  return out;
}

/** parts: [{ bytes, password?, pages?: number[] } | { jpeg }] -> one PDF, in the order given. */
export async function merge(parts, onProgress) {
  const sources = [];
  for (const [i, p] of parts.entries()) {
    onProgress?.(i + 1, parts.length);
    if (p.jpeg) { sources.push(p); continue; }
    const doc = await open(p.bytes, p.password);
    flatten(doc);
    sources.push({ doc, pages: p.pages || doc.getPageIndices() });
  }
  return save(await compose(sources));
}

/** groups: number[][] of 0-based page numbers -> one PDF for each group. */
export async function split(bytes, password, groups, onProgress) {
  const doc = await open(bytes, password);
  flatten(doc);
  const out = [];
  for (const pages of groups) {
    out.push(await save(await compose([{ doc, pages }])));
    onProgress?.(out.length, groups.length);
  }
  return out;
}

/** Keep the listed pages, in the listed order, each turned by `rotate` more degrees. pages: [{ index, rotate? }] */
export async function pick(bytes, password, pages) {
  const { degrees } = await lib();
  let doc = await open(bytes, password);
  const untouched = pages.length === doc.getPageCount() && pages.every((p, i) => p.index === i);
  if (!untouched) {
    flatten(doc);
    doc = await compose([{ doc, pages: pages.map((p) => p.index) }]);
  }
  doc.getPages().forEach((pg, i) => {
    const turn = pages[i].rotate || 0;
    if (turn) pg.setRotation(degrees((((pg.getRotation().angle + turn) % 360) + 360) % 360));
  });
  return save(doc);
}

// The page as a person sees it (after its own rotation), and where a point on that view sits in PDF coordinates.
// (vx, vy) is measured from the bottom-left corner of the page on screen.
function view(page) {
  const { x, y, width: w, height: h } = page.getCropBox();
  const r = (((page.getRotation().angle % 360) + 360) % 360);
  const at = { 0: (vx, vy) => [x + vx, y + vy], 90: (vx, vy) => [x + w - vy, y + vx], 180: (vx, vy) => [x + w - vx, y + h - vy], 270: (vx, vy) => [x + vy, y + h - vx] }[r];
  if (!at) return { r: 0, W: w, H: h, at: (vx, vy) => [x + vx, y + vy] };
  return { r, W: r % 180 ? h : w, H: r % 180 ? w : h, at };
}

/**
 * Where watermarks go on a page W x H: { w, h, spots: [[centreX, centreY]] }, measured from the bottom-left.
 * Shared by the PDF writer and the on-screen preview so both always agree.
 */
export function markSpots(W, H, { ratio, size = 0.6, angle = 45, layout = "center" }) {
  const w = W * size, h = w * ratio;
  if (layout !== "tile") return { w, h, spots: [[W / 2, H / 2]] };
  const a = (angle * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const stepX = w * 1.45, stepY = Math.max(h * 3, W * 0.2), reach = Math.hypot(W, H) / 2;
  const spots = [];
  for (let j = -Math.ceil(reach / stepY); j * stepY <= reach; j++) {
    for (let i = -Math.ceil(reach / stepX) - 1; i * stepX <= reach + stepX; i++) {
      const gx = (i + (j & 1 ? 0.5 : 0)) * stepX, gy = j * stepY;
      const cx = W / 2 + gx * c - gy * s, cy = H / 2 + gx * s + gy * c;
      if (cx > -w / 2 && cx < W + w / 2 && cy > -w / 2 && cy < H + w / 2) spots.push([cx, cy]);
    }
  }
  return { w, h, spots };
}

/** Stamp a picture of the watermark (a PNG, so any language works) on every page. */
export async function watermark(bytes, password, { png, opacity = 0.25, angle = 45, size = 0.6, layout = "center" }) {
  const { degrees } = await lib();
  const doc = await open(bytes, password);
  const img = await doc.embedPng(png);
  const ratio = img.height / img.width;
  for (const pg of doc.getPages()) {
    const v = view(pg);
    const { w, h, spots } = markSpots(v.W, v.H, { ratio, size, angle, layout });
    const t = ((angle + v.r) * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    for (const [cx, cy] of spots) {
      const [ux, uy] = v.at(cx, cy);
      // drawImage turns the picture around its bottom-left corner, so step back from the centre
      pg.drawImage(img, { x: ux - ((w / 2) * c - (h / 2) * s), y: uy - ((w / 2) * s + (h / 2) * c), width: w, height: h, rotate: degrees(angle + v.r), opacity });
    }
  }
  return save(doc);
}

export const NUMBER_FORMATS = {
  n: { label: "1", make: (n) => `${n}` },
  "n/t": { label: "1 / 12", make: (n, t) => `${n} / ${t}` },
  page: { label: "Page 1", make: (n) => `Page ${n}` },
  "page-of": { label: "Page 1 of 12", make: (n, t) => `Page ${n} of ${t}` },
  dash: { label: "- 1 -", make: (n) => `- ${n} -` },
};

/**
 * pos: two letters, t|b then l|c|r (for example "bc" = bottom centre). `from` is the first page that gets a number (1-based),
 * `start` is the number printed on it.
 */
export async function numberPages(bytes, password, { format = "n", pos = "bc", size = 11, start = 1, from = 1, margin = 28 } = {}) {
  const { StandardFonts, rgb, degrees } = await lib();
  const doc = await open(bytes, password);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const last = start + pages.length - from;
  const make = (NUMBER_FORMATS[format] || NUMBER_FORMATS.n).make;
  pages.forEach((pg, i) => {
    if (i < from - 1) return;
    const text = make(start + i - (from - 1), last);
    const v = view(pg), tw = font.widthOfTextAtSize(text, size);
    const vx = pos[1] === "l" ? margin : pos[1] === "r" ? v.W - margin - tw : (v.W - tw) / 2;
    const vy = pos[0] === "t" ? v.H - margin - size * 0.72 : margin;
    const [x, y] = v.at(vx, vy);
    pg.drawText(text, { x, y, size, font, color: rgb(0.12, 0.12, 0.12), rotate: degrees(v.r) });
  });
  return save(doc);
}

/** True when the file is locked in any way (needs a password to open, or only limits printing and copying). */
export async function isLocked(bytes) {
  const { PDFDocument, ParseSpeeds } = await lib();
  try {
    return (await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false, parseSpeed: ParseSpeeds.Fast })).isEncrypted;
  } catch {
    throw new PdfError("damaged");
  }
}

/** The same PDF with its password and restrictions removed. The right password is needed if the file has one. */
export async function unlock(bytes, password) {
  if (!(await isLocked(bytes))) throw new PdfError("not-locked");
  return save(await open(bytes, password));
}

// pdf-lib encrypts streams, which hold nearly everything, but writes a few records outside them (the catalog, the page
// records and stream headers) with their text strings still readable, which also makes other readers show them as garbage.
// Encrypt those strings as the PDF standard requires. Signature records are exempt by the standard.
function encryptLooseStrings(doc, { PDFDict, PDFArray, PDFStream, PDFString, PDFHexString, PDFCatalog, PDFPageTree, PDFPageLeaf, PDFName }) {
  const ctx = doc.context;
  const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  const walk = (o, enc) => {
    const visit = (v, put) => {
      if (v instanceof PDFString || v instanceof PDFHexString) put(PDFHexString.of(hex(enc(v.asBytes()))));
      else if (v instanceof PDFDict || v instanceof PDFArray) walk(v, enc);
    };
    if (o instanceof PDFDict) for (const [k, v] of o.entries()) visit(v, (n) => o.set(k, n));
    else o.asArray().forEach((v, i) => visit(v, (n) => o.set(i, n)));
  };
  for (const [ref, o] of ctx.enumerateIndirectObjects()) {
    if (ref === ctx.trailerInfo.Encrypt) continue;
    const loose = o instanceof PDFStream || o instanceof PDFCatalog || o instanceof PDFPageTree || o instanceof PDFPageLeaf || ref.generationNumber !== 0;
    const signature = o instanceof PDFDict && o.lookup(PDFName.of("Type")) === PDFName.of("Sig");
    if (loose && !signature) walk(o instanceof PDFStream ? o.dict : o, ctx.security.getEncryptFn(ref.objectNumber, ref.generationNumber));
  }
}

/** The same PDF, now asking for `newPassword` to open (AES-256). */
export async function protect(bytes, password, newPassword) {
  const PDF = await lib();
  const doc = await open(bytes, password);
  await doc.flush();
  doc.encrypt({ userPassword: newPassword, ownerPassword: newPassword });
  encryptLooseStrings(doc, PDF);
  return save(doc);
}
