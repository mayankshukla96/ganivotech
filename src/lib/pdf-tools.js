// Browser-only PDF helpers: read pages with pdf.js (served from /pdfjs) and write simple image-based PDFs.

let pdfjsPromise;
export function loadPdfJs() {
  if (!pdfjsPromise) {
    // loaded at runtime from /public so the bundler does not need to process the large worker
    // (a plain import the bundler is told to leave alone: the site's security policy forbids building code from strings)
    pdfjsPromise = import(/* webpackIgnore: true */ /* turbopackIgnore: true */ "/pdfjs/pdf.min.mjs").then((m) => {
      m.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return m;
    });
  }
  return pdfjsPromise;
}

/** Open a PDF for viewing. A locked file rejects with name "PasswordException" (code 1 = password needed, 2 = wrong password). */
export async function openPdf(file, password) {
  const pdfjs = await loadPdfJs();
  // isEvalSupported off: a PDF is untrusted input, so pdf.js must never build code from it
  return pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), password: password || undefined, isEvalSupported: false }).promise;
}

const MAX_PIXELS = 36e6; // keeps a single page inside what phone browsers can hold as one canvas

/**
 * Render page `n` (1-based) so its longest side is about `maxSide` pixels, or at `dpi` when given.
 * Returns { canvas, ptW, ptH } where ptW x ptH is the page size in points as shown on screen.
 */
export async function renderPage(doc, n, maxSide = 1600, dpi = 0) {
  const page = await doc.getPage(n);
  const base = page.getViewport({ scale: 1 });
  const scale = dpi
    ? Math.min(dpi / 72, Math.sqrt(MAX_PIXELS / (base.width * base.height)))
    : Math.min(4, maxSide / Math.max(base.width, base.height));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // "print" intent does not wait for animation frames, so it keeps working if the user switches tabs
  await page.render({ canvasContext: ctx, canvas, viewport, intent: "print" }).promise;
  page.cleanup();
  return { canvas, ptW: base.width, ptH: base.height };
}

/**
 * pages: [{ jpeg: Uint8Array, w, h (pixels), ptW, ptH (page size in points) }] -> PDF bytes.
 * padTo (optional): make the file exactly this many bytes, using a PDF comment placed before the xref table.
 */
export function buildPdf(pages, padTo = 0) {
  const enc = new TextEncoder();
  const chunks = [];
  let len = 0;
  const push = (d) => {
    const u = typeof d === "string" ? enc.encode(d) : d;
    chunks.push(u);
    len += u.length;
  };
  const offsets = [];
  const obj = (id, body) => {
    offsets[id] = len;
    push(`${id} 0 obj\n`);
    push(body);
    push("\nendobj\n");
  };
  push("%PDF-1.4\n");
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, `<< /Type /Pages /Kids [${pages.map((_, i) => `${3 + 3 * i} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  pages.forEach((p, i) => {
    const pid = 3 + 3 * i, cid = pid + 1, iid = pid + 2;
    const W = p.ptW.toFixed(2), H = p.ptH.toFixed(2);
    const content = `q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
    obj(pid, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${iid} 0 R >> >> /Contents ${cid} 0 R >>`);
    obj(cid, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    offsets[iid] = len;
    push(`${iid} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`);
    push(p.jpeg);
    push("\nendstream\nendobj\n");
  });
  const total = 3 + 3 * pages.length;
  const tail = (pos) => {
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let id = 1; id < total; id++) x += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    return x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF`;
  };
  if (padTo > len + tail(len).length) {
    const need = padTo - len - tail(len).length;
    const digits = (n) => String(n).length;
    // the startxref number can gain a digit once the padding pushes the xref table further down
    for (let d = 0; d <= 8; d++) {
      const extra = need - d;
      if (extra >= 0 && digits(len + extra) - digits(len) === d) {
        if (extra >= 2) push("%" + "0".repeat(extra - 2) + "\n");
        else if (extra === 1) push("\n");
        break;
      }
    }
  }
  push(tail(len));
  const out = new Uint8Array(len);
  let p = 0;
  for (const c of chunks) { out.set(c, p); p += c.length; }
  return out;
}

// Hands a finished file to the next tool page. It only lives in this tab's memory and is cleared as soon as it is picked up.
let handoff = null;
export const setHandoff = (file) => { handoff = file; };
export const takeHandoff = () => { const f = handoff; handoff = null; return f; };
