// Self-check for src/lib/pdf-edit.js. Run: node scripts/check-pdf-edit.mjs
import assert from "node:assert/strict";
import { PDFDocument, PDFName, PDFDict, StandardFonts } from "@cantoo/pdf-lib";
import { PdfError, isLocked, markSpots, merge, numberPages, parseRanges, pick, protect, split, unlock, watermark } from "../src/lib/pdf-edit.js";

const code = async (fn) => { try { await fn(); return "ok"; } catch (e) { return e instanceof PdfError ? e.code : `other:${e.message}`; } };
const pageObjects = (doc) => doc.context.enumerateIndirectObjects().filter(([, o]) => o instanceof PDFDict && o.lookup(PDFName.of("Type")) === PDFName.of("Page")).length;

// a document whose first page links to its last page, so copying page 1 tries to drag page n along
async function sample(n, label = "P") {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= n; i++) doc.addPage([595, 842]).drawText(`${label}${i}`, { x: 50, y: 700, size: 30, font });
  const pages = doc.getPages();
  const link = doc.context.obj({ Type: "Annot", Subtype: "Link", Rect: [40, 690, 200, 740], Dest: [pages[n - 1].ref, "Fit"], P: pages[0].ref });
  pages[0].node.set(PDFName.of("Annots"), doc.context.obj([doc.context.register(link)]));
  return doc.save();
}

// page ranges
assert.deepEqual(parseRanges("1-3, 5", 6), [[0, 1, 2], [4]]);
assert.deepEqual(parseRanges("4-", 6), [[3, 4, 5]]);
assert.deepEqual(parseRanges("3 - 1;6", 6), [[2, 1, 0], [5]]);
for (const bad of ["", "0", "7", "2-9", "a", "1--2", "-3"]) assert.throws(() => parseRanges(bad, 6), PdfError, bad);

const six = await sample(6), three = await sample(3, "Q");

// merge keeps order and page count; a page range limits what is taken
let out = await PDFDocument.load(await merge([{ bytes: six }, { bytes: three, pages: [2, 0] }]));
assert.equal(out.getPageCount(), 8);

// split
const parts = await split(six, "", [[0, 1], [5]]);
assert.deepEqual(await Promise.all(parts.map(async (b) => (await PDFDocument.load(b)).getPageCount())), [2, 1]);

// removed pages must be truly gone, even when a kept page links to them
out = await PDFDocument.load(await pick(six, "", [{ index: 1 }, { index: 0, rotate: 90 }]));
assert.equal(out.getPageCount(), 2);
assert.equal(pageObjects(out), 2, "a removed page is still inside the file");
assert.equal(out.getPage(1).getRotation().angle, 90);
assert.ok((await pick(six, "", [{ index: 0 }])).length < six.length / 2, "single page file should be much smaller");

// rotate only: same pages, turned in place
out = await PDFDocument.load(await pick(six, "", Array.from({ length: 6 }, (_, index) => ({ index, rotate: index === 2 ? -90 : 0 }))));
assert.equal(out.getPageCount(), 6);
assert.equal(out.getPage(2).getRotation().angle, 270);

// page numbers and watermark keep every page
assert.equal((await PDFDocument.load(await numberPages(six, "", { format: "page-of", pos: "tr", from: 2 }))).getPageCount(), 6);
const png = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGP4z8DwH4QZYAwAR8oH+WdZbrIAAAAASUVORK5CYII="), (c) => c.charCodeAt(0));
assert.equal((await PDFDocument.load(await watermark(six, "", { png, layout: "tile" }))).getPageCount(), 6);
assert.equal(markSpots(600, 800, { ratio: 0.2 }).spots.length, 1);
assert.ok(markSpots(600, 800, { ratio: 0.2, size: 0.3, layout: "tile" }).spots.length > 6);

// password: protect, then the wrong, missing and right password
const locked = await protect(six, "", "s3cret-पास");
assert.equal(await isLocked(locked), true);
assert.equal(await isLocked(six), false);
assert.equal(await code(() => unlock(locked, "")), "password");
assert.equal(await code(() => unlock(locked, "nope")), "wrong-password");
assert.equal(await code(() => unlock(six, "")), "not-locked");
assert.equal(await code(() => merge([{ bytes: locked }])), "password");
assert.equal(await code(() => merge([{ bytes: new Uint8Array([1, 2, 3]) }])), "damaged");
const open = await unlock(locked, "s3cret-पास");
assert.equal(await isLocked(open), false);
// nothing of the old lock (its password hashes) may stay hidden in the unlocked file
const raw = Buffer.from(open).toString("latin1");
assert.ok(!raw.includes("/Encrypt"), "old lock record left in the unlocked file");
assert.equal(raw.split("/Type /XRef").length - 1, 1, "old index table left in the unlocked file");
// and the unlocked file must keep working in the other tools
assert.equal((await PDFDocument.load(await merge([{ bytes: open }, { bytes: three }]))).getPageCount(), 9);
assert.equal((await PDFDocument.load(open)).getPageCount(), 6);

console.log("pdf-edit: all checks passed");
