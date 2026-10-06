// Passport / ID photo helpers: preset sizes, white-background clean-up and print-sheet layout. Browser only, no network.

export const PRESETS = [
  { id: "p51", label: "Passport / OCI / US visa (51 x 51 mm, 2 x 2 in)", w: 51, h: 51, kb: 100 },
  { id: "p35x45", label: "35 x 45 mm (Aadhaar, Schengen, UK and most visas)", w: 35, h: 45, kb: 100 },
  { id: "p25x35", label: "25 x 35 mm (small ID and PAN-style photo)", w: 25, h: 35, kb: 50 },
  { id: "custom", label: "Custom size", w: 35, h: 45, kb: 100 },
];

export const SHEETS = [
  { id: "4x6", label: "4 x 6 inch photo paper", w: 6 * 25.4, h: 4 * 25.4 },
  { id: "a4", label: "A4 paper", w: 297, h: 210 },
];

export const mmToPx = (mm, dpi) => Math.max(1, Math.round((mm * dpi) / 25.4));

/**
 * Turn a plain background white. The background colour is read from the picture's edges, then painted over wherever it
 * touches the edge (so a similar colour inside the face or clothes is left alone). tol: 10 (careful) to 100 (strong).
 * Returns how much of the picture was changed (0 to 1) so the screen can warn when it found nothing.
 */
export function whitenBackground(canvas, tol) {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const edge = [];
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.02));
  for (let x = 0; x < w; x += 2) for (let y = 0; y < band; y++) edge.push((y * w + x) * 4);
  for (let y = 0; y < h; y += 2) for (let x = 0; x < band; x++) edge.push((y * w + x) * 4, (y * w + (w - 1 - x)) * 4);
  const med = (c) => { const v = edge.map((i) => d[i + c]).sort((a, b) => a - b); return v[v.length >> 1]; };
  const bg = [med(0), med(1), med(2)];
  const near = (i) => { const a = d[i] - bg[0], b = d[i + 1] - bg[1], c = d[i + 2] - bg[2]; return Math.sqrt(a * a + b * b + c * c) <= tol; };
  const mark = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { const p = y * w + x; if (!mark[p] && near(p * 4)) { mark[p] = 1; stack.push(p); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  let n = 0;
  while (stack.length) {
    const p = stack.pop();
    n++;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  const white = (i, k) => { d[i] = d[i] + (255 - d[i]) * k; d[i + 1] = d[i + 1] + (255 - d[i + 1]) * k; d[i + 2] = d[i + 2] + (255 - d[i + 2]) * k; };
  for (let p = 0; p < w * h; p++) {
    if (mark[p]) { d[p * 4] = d[p * 4 + 1] = d[p * 4 + 2] = 255; continue; }
    // soften the one-pixel rim next to the cleaned area so the outline is not jagged
    const x = p % w, y = (p / w) | 0;
    if ((x > 0 && mark[p - 1]) || (x < w - 1 && mark[p + 1]) || (y > 0 && mark[p - w]) || (y < h - 1 && mark[p + w])) white(p * 4, 0.5);
  }
  ctx.putImageData(img, 0, 0);
  return n / (w * h);
}

/** Brighten (amount -50 to 50) with a simple gain, applied to the whole picture. */
export function brighten(canvas, amount) {
  if (!amount) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data, g = 1 + amount / 100;
  for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * g); d[i + 1] = Math.min(255, d[i + 1] * g); d[i + 2] = Math.min(255, d[i + 2] * g); }
  ctx.putImageData(img, 0, 0);
}

/** How many photos of pw x ph mm fit on a sheet (with a gap and a margin) and where each one goes, in mm. */
export function sheetLayout(sheet, pw, ph, { gap = 2, margin = 4 } = {}) {
  const fit = (W, H) => ({ cols: Math.max(0, Math.floor((W - 2 * margin + gap) / (pw + gap))), rows: Math.max(0, Math.floor((H - 2 * margin + gap) / (ph + gap))) });
  // a sheet can be used either way round; take the one that holds more
  const a = fit(sheet.w, sheet.h), b = fit(sheet.h, sheet.w);
  const turned = b.cols * b.rows > a.cols * a.rows;
  const W = turned ? sheet.h : sheet.w, H = turned ? sheet.w : sheet.h, { cols, rows } = turned ? b : a;
  const gw = cols * pw + (cols - 1) * gap, gh = rows * ph + (rows - 1) * gap;
  const x0 = (W - gw) / 2, y0 = (H - gh) / 2;
  const spots = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) spots.push([x0 + c * (pw + gap), y0 + r * (ph + gap)]);
  return { W, H, spots, cols, rows };
}
