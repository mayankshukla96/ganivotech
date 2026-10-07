// Browser-only image helpers: resize to exact pixels, compress to a size limit, pad to an exact byte size.

export const KB = 1024;

export const loadBitmap = (file) => createImageBitmap(file, { imageOrientation: "from-image" });

const toBlob = (canvas, type, q) => new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), type, q));
export const toJpeg = (canvas, q) => toBlob(canvas, "image/jpeg", q);
export const toWebp = (canvas, q) => toBlob(canvas, "image/webp", q);
export const toPng = (canvas) => toBlob(canvas, "image/png");

// whiten a paper background (for signatures): scale so the paper level becomes white, then snap near-white to white
function whiten(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const n = d.length / 4;
  // the paper colour of each channel = its 85th percentile (the ink is a small, dark part of the picture)
  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) hist[c][d[i + c]]++;
  const paper = hist.map((hc) => {
    let seen = 0;
    for (let v = 0; v < 256; v++) { seen += hc[v]; if (seen >= n * 0.85) return Math.max(v, 100); }
    return 255;
  });
  for (let i = 0; i < d.length; i += 4) {
    const r = Math.min(255, (d[i] * 255) / paper[0]);
    const g = Math.min(255, (d[i + 1] * 255) / paper[1]);
    const b = Math.min(255, (d[i + 2] * 255) / paper[2]);
    // light paper tones (including shadows) become pure white; ink stays
    if ((r * 299 + g * 587 + b * 114) / 1000 > 200) { d[i] = d[i + 1] = d[i + 2] = 255; } else { d[i] = r; d[i + 1] = g; d[i + 2] = b; }
  }
  ctx.putImageData(img, 0, 0);
}

/** Draw `src` into a w x h canvas. fit: stretch | cover (crop) | contain (white bars). */
export function drawToCanvas(src, w, h, fit = "contain", opts = {}) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: !!opts.whiten });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  const sw = src.width, sh = src.height;
  let sx = 0, sy = 0, sW = sw, sH = sh, dx = 0, dy = 0, dw = w, dh = h;
  if (fit === "cover") {
    const s = Math.max(w / sw, h / sh);
    sW = w / s; sH = h / s; sx = (sw - sW) / 2; sy = (sh - sH) / 2;
  } else if (fit === "contain") {
    const s = Math.min(w / sw, h / sh);
    dw = sw * s; dh = sh * s; dx = (w - dw) / 2; dy = (h - dh) / 2;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, sx, sy, sW, sH, dx, dy, dw, dh);
  if (opts.whiten) whiten(ctx, w, h);
  return c;
}

/** Highest-quality JPEG that is <= maxBytes, or null if even the lowest quality is too big. */
export async function jpegUnder(canvas, maxBytes) {
  const top = await toJpeg(canvas, 0.98);
  if (top.size <= maxBytes) return { blob: top, quality: 0.98 };
  let lo = 0.02, hi = 0.98;
  let best = await toJpeg(canvas, lo);
  if (best.size > maxBytes) return null;
  best = { blob: best, quality: lo };
  for (let i = 0; i < 9; i++) {
    const mid = (lo + hi) / 2;
    const b = await toJpeg(canvas, mid);
    if (b.size <= maxBytes) { best = { blob: b, quality: mid }; lo = mid; } else hi = mid;
  }
  return best;
}

/** Make the file exactly `target` bytes by adding invisible JPEG comment segments (the picture is unchanged). */
export function padJpeg(bytes, target) {
  const need = target - bytes.length;
  if (need <= 0) return bytes;
  let off = 2;
  if (bytes[2] === 0xff && bytes[3] === 0xe0) off = 4 + ((bytes[4] << 8) | bytes[5]);
  const out = new Uint8Array(target);
  out.set(bytes.subarray(0, off), 0);
  let p = off;
  let left = need;
  while (left >= 4) {
    let seg = Math.min(left, 65537); // marker(2) + length(2) + up to 65533 payload bytes
    if (left - seg > 0 && left - seg < 4) seg = left - 4;
    out[p] = 0xff; out[p + 1] = 0xfe; out[p + 2] = (seg - 2) >> 8; out[p + 3] = (seg - 2) & 255;
    p += seg;
    left -= seg;
  }
  out.set(bytes.subarray(off), p); // 1-3 leftover bytes stay as zero padding after the image data
  return out;
}

/** Write a DPI value into the JPEG (JFIF) header. */
export function setJpegDpi(bytes, dpi) {
  if (bytes[2] === 0xff && bytes[3] === 0xe0 && bytes[6] === 0x4a && bytes[7] === 0x46 && bytes[8] === 0x49 && bytes[9] === 0x46) {
    bytes[13] = 1;
    bytes[14] = dpi >> 8; bytes[15] = dpi & 255;
    bytes[16] = dpi >> 8; bytes[17] = dpi & 255;
  }
  return bytes;
}

/**
 * Encode `canvas` as JPEG within [minBytes, maxBytes]. exact=true pads up to exactly maxBytes.
 * Returns { blob, quality, size, note } or { error }.
 */
export async function encodeToSize(canvas, { maxBytes, exact = false, dpi = 0 }) {
  const r = await jpegUnder(canvas, maxBytes);
  if (!r) return { error: "too-small" };
  let bytes = new Uint8Array(await r.blob.arrayBuffer());
  if (dpi) bytes = setJpegDpi(bytes, dpi);
  if (exact) bytes = padJpeg(bytes, maxBytes);
  return { blob: new Blob([bytes], { type: "image/jpeg" }), quality: r.quality, size: bytes.length };
}

export const fmtBytes = (n) => (n < KB * KB ? `${(n / KB).toFixed(n < 10 * KB ? 2 : 1)} KB` : `${(n / KB / KB).toFixed(2)} MB`);

export function downloadBlob(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
