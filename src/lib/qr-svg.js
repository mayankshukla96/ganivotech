import QRCode from "qrcode";

const rr = (x, y, w, h, r) =>
  r <= 0
    ? `M${x} ${y}h${w}v${h}h${-w}z`
    : `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}z`;

// [outer radius, ring-hole radius, centre radius] for the three finder "eyes"
const EYES = { square: [0, 0, 0], rounded: [2, 1.2, 0.9], circle: [3.5, 2.5, 1.5] };

/**
 * Build a QR code as an SVG string (units = QR modules, so it scales losslessly).
 * o: { fg, fg2, bg, pattern: square|rounded|dots, eye: square|rounded|circle, margin, ecc, logo (data URL), size }
 */
export function qrToSvg(text, o) {
  const qr = QRCode.create(text, { errorCorrectionLevel: o.logo ? "H" : o.ecc });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const N = n + o.margin * 2;
  const m = o.margin;
  const [eo, ei, ec] = EYES[o.eye];

  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  let d = "";

  [[0, 0], [0, n - 7], [n - 7, 0]].forEach(([r, c]) => {
    const x = c + m;
    const y = r + m;
    d += rr(x, y, 7, 7, eo) + rr(x + 1, y + 1, 5, 5, ei) + rr(x + 2, y + 2, 3, 3, ec);
  });

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!data[r * n + c] || finder(r, c)) continue;
      const x = c + m;
      const y = r + m;
      if (o.pattern === "dots") d += rr(x + 0.05, y + 0.05, 0.9, 0.9, 0.45);
      else if (o.pattern === "rounded") d += rr(x, y, 1, 1, 0.4);
      else d += rr(x, y, 1, 1, 0);
    }
  }

  const gradient = o.fg2
    ? `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${N}" y2="${N}"><stop offset="0" stop-color="${o.fg}"/><stop offset="1" stop-color="${o.fg2}"/></linearGradient></defs>`
    : "";
  const fill = o.fg2 ? "url(#g)" : o.fg;

  let logo = "";
  if (o.logo) {
    const box = +(N * 0.2).toFixed(2);
    const x = +((N - box) / 2).toFixed(2);
    const pad = 0.8;
    logo =
      `<rect x="${x - pad}" y="${x - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="1.5" fill="${o.bg}"/>` +
      `<clipPath id="c"><rect x="${x}" y="${x}" width="${box}" height="${box}" rx="1"/></clipPath>` +
      `<image clip-path="url(#c)" x="${x}" y="${x}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid slice" href="${o.logo}" xlink:href="${o.logo}"/>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${N} ${N}" width="${o.size}" height="${o.size}"` +
    `${o.pattern === "square" ? ' shape-rendering="crispEdges"' : ""}>` +
    `<title>QR code</title>${gradient}<rect width="${N}" height="${N}" fill="${o.bg}"/>` +
    `<path fill="${fill}" fill-rule="evenodd" d="${d}"/>${logo}</svg>`
  );
}

export const svgToDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function svgToPngBlob(svg, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      c.getContext("2d").drawImage(img, 0, 0, size, size);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("png failed"))), "image/png");
    };
    img.onerror = reject;
    img.src = svgToDataUrl(svg);
  });
}

// WCAG-style contrast ratio between two #rrggbb colours
export function contrast(a, b) {
  const lum = (h) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const v = parseInt(h.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
