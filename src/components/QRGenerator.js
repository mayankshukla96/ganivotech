"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { QR_TYPES, typeHref } from "@/lib/qr-builders";
import { qrToSvg, svgToDataUrl, svgToPngBlob, contrast } from "@/lib/qr-svg";

const PRESETS = {
  Classic: { fg: "#000000", gradient: false, bg: "#ffffff", pattern: "square", eye: "square" },
  Ganivotech: { fg: "#0f3d8c", fg2: "#f59e0b", gradient: true, bg: "#ffffff", pattern: "rounded", eye: "rounded" },
  Dots: { fg: "#111827", gradient: false, bg: "#ffffff", pattern: "dots", eye: "rounded" },
};

const enc = encodeURIComponent;
const fieldCls =
  "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";
const chip = (on) =>
  `px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
    on ? "gradient-bg text-white" : "border border-border text-muted hover:border-primary hover:text-primary"
  }`;

// shrink uploaded logos so the SVG/PNG stays small
function fileToSmallDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const s = Math.max(256 / img.width, 256 / img.height);
      c.getContext("2d").drawImage(img, (256 - img.width * s) / 2, (256 - img.height * s) / 2, img.width * s, img.height * s);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function download(href, name) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
}

export default function QRGenerator({ type = "url" }) {
  const cfg = QR_TYPES[type];
  const [fields, setFields] = useState({});
  const [style, setStyle] = useState(PRESETS.Classic);
  const [margin, setMargin] = useState(3);
  const [ecc, setEcc] = useState("Q");
  const [size, setSize] = useState(1000);
  const [logo, setLogo] = useState(null);
  const [places, setPlaces] = useState([]);
  const set = (patch) => setStyle((s) => ({ ...s, ...patch }));

  const content = cfg.build(fields);

  const { svg, error } = useMemo(() => {
    if (!content) return { svg: "" };
    try {
      return {
        svg: qrToSvg(content, {
          fg: style.fg,
          fg2: style.gradient ? style.fg2 || "#f59e0b" : null,
          bg: style.bg,
          pattern: style.pattern,
          eye: style.eye,
          margin,
          ecc,
          logo,
          size,
        }),
      };
    } catch {
      return { svg: "", error: "That is too much data for one QR code. Please shorten it." };
    }
  }, [content, style, margin, ecc, logo, size]);

  // free place search (Photon / OpenStreetMap); not used once a suggestion is picked
  useEffect(() => {
    const q = fields.place?.trim();
    if (type !== "location" || fields.latlng || !q || q.length < 3) {
      setPlaces([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`https://photon.komoot.io/api/?q=${enc(q)}&limit=6`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) =>
          setPlaces(
            (d.features || []).map((f) => {
              const p = f.properties;
              const label = [...new Set([p.name, p.street, p.district, p.city, p.state, p.country].filter(Boolean))].join(", ");
              return { label, latlng: `${f.geometry.coordinates[1]},${f.geometry.coordinates[0]}` };
            })
          )
        )
        .catch(() => {});
    }, 400);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [fields.place, fields.latlng, type]);

  async function useBrandLogo() {
    const blob = await (await fetch("/logo.jpg")).blob();
    setLogo(await fileToSmallDataUrl(blob));
  }

  async function onLogoFile(e) {
    const file = e.target.files?.[0];
    if (file) setLogo(await fileToSmallDataUrl(file));
  }

  const lowContrast = contrast(style.fg, style.bg) < 3 || (style.gradient && contrast(style.fg2 || "#f59e0b", style.bg) < 3);
  const base = `ganivotech-qr-${type}`;

  return (
    <div>
      <nav aria-label="QR code types" className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.entries(QR_TYPES).map(([id, t]) => (
          <Link key={id} href={typeHref(id)} aria-current={id === type ? "page" : undefined} className={chip(id === type)}>
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">1. Enter your {cfg.label} details</h2>
            {cfg.fields.map(([key, label, ph, kind]) => (
              <div key={key} className="mb-4">
                <label htmlFor={`f-${key}`} className="block text-sm font-medium mb-1.5">
                  {label}
                </label>
                {kind === "textarea" ? (
                  <textarea
                    id={`f-${key}`}
                    rows={3}
                    placeholder={ph}
                    value={fields[key] || ""}
                    onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                    className={fieldCls + " resize-y"}
                  />
                ) : (
                  <input
                    id={`f-${key}`}
                    type={kind === "place" || !kind ? "text" : kind}
                    placeholder={ph}
                    autoComplete="off"
                    value={fields[key] || ""}
                    onChange={(e) =>
                      setFields((f) => ({ ...f, [key]: e.target.value, ...(kind === "place" && { latlng: "" }) }))
                    }
                    className={fieldCls}
                  />
                )}
                {kind === "place" && places.length > 0 && (
                  <ul className="mt-2 rounded-xl border border-border bg-background overflow-hidden">
                    {places.map((p) => (
                      <li key={p.latlng}>
                        <button
                          type="button"
                          onClick={() => setFields((f) => ({ ...f, place: p.label, latlng: p.latlng }))}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/10 border-b border-border last:border-0"
                        >
                          {p.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {kind === "place" && fields.latlng && (
                  <p className="mt-2 text-xs text-green-600">Exact location selected. The QR opens it in Google Maps.</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">2. Customize your QR code</h2>

            <p className="text-xs font-medium text-muted mb-2">Quick styles</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(PRESETS).map(([name, p]) => (
                <button key={name} type="button" onClick={() => setStyle(p)} className={chip(false)}>
                  {name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label htmlFor="c-fg" className="block text-xs font-medium mb-1">QR colour</label>
                <input id="c-fg" type="color" value={style.fg} onChange={(e) => set({ fg: e.target.value })} className="w-full h-10 rounded-lg border border-border" />
              </div>
              <div>
                <label htmlFor="c-bg" className="block text-xs font-medium mb-1">Background</label>
                <input id="c-bg" type="color" value={style.bg} onChange={(e) => set({ bg: e.target.value })} className="w-full h-10 rounded-lg border border-border" />
              </div>
              <div>
                <label htmlFor="c-fg2" className="flex items-center gap-1.5 text-xs font-medium mb-1">
                  <input type="checkbox" checked={!!style.gradient} onChange={(e) => set({ gradient: e.target.checked })} className="accent-primary" />
                  Gradient to
                </label>
                <input id="c-fg2" type="color" disabled={!style.gradient} value={style.fg2 || "#f59e0b"} onChange={(e) => set({ fg2: e.target.value })} className="w-full h-10 rounded-lg border border-border disabled:opacity-40" />
              </div>
            </div>
            {lowContrast && (
              <p role="alert" className="mb-5 text-xs text-red-600">
                Low contrast: use a dark QR colour on a light background so phones can scan it.
              </p>
            )}

            <p className="text-xs font-medium text-muted mb-2">Pattern</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["square", "rounded", "dots"].map((p) => (
                <button key={p} type="button" onClick={() => set({ pattern: p })} className={chip(style.pattern === p) + " capitalize"}>
                  {p}
                </button>
              ))}
            </div>

            <p className="text-xs font-medium text-muted mb-2">Corner (eye) style</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["square", "rounded", "circle"].map((p) => (
                <button key={p} type="button" onClick={() => set({ eye: p })} className={chip(style.eye === p) + " capitalize"}>
                  {p}
                </button>
              ))}
            </div>

            <p className="text-xs font-medium text-muted mb-2">Logo in the centre (optional)</p>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <button type="button" onClick={useBrandLogo} className={chip(false)}>Use Ganivotech logo</button>
              <label className={chip(false) + " cursor-pointer"}>
                Upload your logo
                <input type="file" accept="image/*" onChange={onLogoFile} className="sr-only" />
              </label>
              {logo && (
                <>
                  <img src={logo} alt="Selected logo" width={32} height={32} className="w-8 h-8 rounded border border-border object-cover" />
                  <button type="button" onClick={() => setLogo(null)} className="text-xs text-red-500 font-medium">Remove</button>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="o-margin" className="block text-xs font-medium mb-1">Margin</label>
                <select id="o-margin" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className={fieldCls}>
                  {[0, 1, 2, 3, 4, 6, 8].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="o-ecc" className="block text-xs font-medium mb-1">Error correction</label>
                <select id="o-ecc" value={logo ? "H" : ecc} disabled={!!logo} onChange={(e) => setEcc(e.target.value)} className={fieldCls}>
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
              <div>
                <label htmlFor="o-size" className="block text-xs font-medium mb-1">PNG size</label>
                <select id="o-size" value={size} onChange={(e) => setSize(Number(e.target.value))} className={fieldCls}>
                  {[300, 500, 1000, 2000].map((v) => <option key={v} value={v}>{v} px</option>)}
                </select>
              </div>
            </div>
            {logo && <p className="mt-2 text-xs text-muted">Error correction is set to High automatically when a logo is added.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 text-center lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold mb-4">3. Download</h2>
          <div className="mx-auto w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-xl border border-border bg-white flex items-center justify-center overflow-hidden mb-5">
            {svg ? (
              <img src={svgToDataUrl(svg)} alt={`Generated ${cfg.label} QR code`} width={300} height={300} className="w-full h-full" />
            ) : (
              <p className="text-sm text-muted px-6" aria-live="polite">
                {error || "Fill in the details and your QR code appears here instantly."}
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled={!svg}
              onClick={async () => download(URL.createObjectURL(await svgToPngBlob(svg, size)), `${base}.png`)}
              className="px-6 py-2.5 rounded-lg gradient-bg-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Download PNG
            </button>
            <button
              type="button"
              disabled={!svg}
              onClick={() => download(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), `${base}.svg`)}
              className="px-6 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Download SVG
            </button>
          </div>
          <p className="mt-4 text-xs text-muted">
            Generated in your browser. Your details are not uploaded
            {type === "location" ? ", except the text you type in place search, which goes to the free Photon (OpenStreetMap) service." : "."}
          </p>
        </div>
      </div>
    </div>
  );
}
