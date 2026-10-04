"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";

const TABS = [
  { id: "normal", label: "Normal QR" },
  { id: "logo", label: "QR with Logo" },
  { id: "stylish", label: "Stylish QR" },
  { id: "smart", label: "Smart QR" },
];

const enc = encodeURIComponent;

// each type: input fields [key, label, placeholder] and a builder that returns "" until required fields are filled
const SMART = {
  Contact: {
    fields: [
      ["name", "Full name", "Rahul Sharma"],
      ["phone", "Phone", "+919876543210"],
      ["email", "Email", "rahul@example.com"],
      ["org", "Company", "Ganivotech"],
      ["site", "Website", "https://ganivotech.com"],
    ],
    build: (f) => {
      if (!f.name?.trim()) return "";
      const [first, ...rest] = f.name.trim().split(" ");
      return [
        "BEGIN:VCARD", "VERSION:3.0",
        `N:${rest.join(" ")};${first};;;`, `FN:${f.name.trim()}`,
        f.org && `ORG:${f.org}`, f.phone && `TEL;TYPE=CELL:${f.phone}`,
        f.email && `EMAIL:${f.email}`, f.site && `URL:${f.site}`, "END:VCARD",
      ].filter(Boolean).join("\n");
    },
  },
  WhatsApp: {
    fields: [
      ["wa", "WhatsApp number (with country code)", "919876543210"],
      ["message", "Pre-filled message (optional)", "Hi, I want to know more"],
    ],
    build: (f) =>
      f.wa?.replace(/\D/g, "")
        ? `https://wa.me/${f.wa.replace(/\D/g, "")}${f.message ? `?text=${enc(f.message)}` : ""}`
        : "",
  },
  UPI: {
    fields: [
      ["vpa", "UPI ID", "name@okbank"],
      ["payee", "Payee name (optional)", "Ganivotech"],
      ["amount", "Amount in INR (optional)", "499"],
      ["note", "Note (optional)", "Invoice 101"],
    ],
    build: (f) =>
      f.vpa?.trim()
        ? `upi://pay?pa=${f.vpa.trim()}${f.payee ? `&pn=${enc(f.payee)}` : ""}${f.amount ? `&am=${f.amount}` : ""}&cu=INR${f.note ? `&tn=${enc(f.note)}` : ""}`
        : "",
  },
  WiFi: {
    fields: [
      ["ssid", "WiFi name (SSID)", "MyHomeWiFi"],
      ["pass", "Password (empty for open network)", "password"],
    ],
    build: (f) =>
      f.ssid?.trim() ? `WIFI:T:${f.pass ? "WPA" : "nopass"};S:${f.ssid};P:${f.pass || ""};;` : "",
  },
  Email: {
    fields: [
      ["to", "Email address", "hello@example.com"],
      ["subject", "Subject (optional)", "Enquiry"],
    ],
    build: (f) => (f.to?.trim() ? `mailto:${f.to.trim()}${f.subject ? `?subject=${enc(f.subject)}` : ""}` : ""),
  },
  SMS: {
    fields: [
      ["smsNum", "Phone number", "+919876543210"],
      ["smsMsg", "Message (optional)", "Hello"],
    ],
    build: (f) => (f.smsNum?.trim() ? `SMSTO:${f.smsNum.trim()}:${f.smsMsg || ""}` : ""),
  },
  Location: {
    fields: [["place", "Search a place, school, shop or address", "Jayshree Periwal Global School"]],
    build: (f) =>
      f.latlng
        ? `https://www.google.com/maps/search/?api=1&query=${f.latlng}`
        : f.place?.trim()
          ? `https://www.google.com/maps/search/?api=1&query=${enc(f.place.trim())}`
          : "",
  },
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function drawQR(canvas, text, o) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const pad = 2;
  const cell = Math.max(1, Math.floor(o.size / (n + pad * 2)));
  const px = cell * (n + pad * 2);
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = o.bg;
  ctx.fillRect(0, 0, px, px);

  let fill = o.fg;
  if (o.fg2) {
    fill = ctx.createLinearGradient(0, 0, px, px);
    fill.addColorStop(0, o.fg);
    fill.addColorStop(1, o.fg2);
  }
  ctx.fillStyle = fill;

  const isFinder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const eyeR = o.shape === "square" ? 0 : cell * 2;
  const innerR = o.shape === "square" ? 0 : cell * 1.2;

  // finder "eyes": outer ring (evenodd hole) + inner block
  [[0, 0], [0, n - 7], [n - 7, 0]].forEach(([r, c]) => {
    const x = (c + pad) * cell;
    const y = (r + pad) * cell;
    ctx.beginPath();
    roundRectPath(ctx, x, y, cell * 7, cell * 7, eyeR);
    roundRectPath(ctx, x + cell, y + cell, cell * 5, cell * 5, innerR);
    ctx.fill("evenodd");
    ctx.beginPath();
    roundRectPath(ctx, x + cell * 2, y + cell * 2, cell * 3, cell * 3, innerR);
    ctx.fill();
  });

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!data[r * n + c] || isFinder(r, c)) continue;
      const x = (c + pad) * cell;
      const y = (r + pad) * cell;
      if (o.shape === "dots") {
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.shape === "rounded") {
        ctx.beginPath();
        roundRectPath(ctx, x, y, cell, cell, cell * 0.4);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }

  if (o.logo) {
    const img = await loadImage(o.logo);
    const box = px * 0.22;
    const x = (px - box) / 2;
    ctx.fillStyle = o.bg;
    ctx.beginPath();
    roundRectPath(ctx, x - cell, x - cell, box + cell * 2, box + cell * 2, cell * 2);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    roundRectPath(ctx, x, x, box, box, cell);
    ctx.clip();
    ctx.drawImage(img, x, x, box, box);
    ctx.restore();
  }
}

export default function QRMaker() {
  const [tab, setTab] = useState("normal");
  const [text, setText] = useState("");
  const [size, setSize] = useState(500);
  const [fg, setFg] = useState("#0f3d8c");
  const [fg2, setFg2] = useState("#f59e0b");
  const [bg, setBg] = useState("#ffffff");
  const [shape, setShape] = useState("rounded");
  const [logo, setLogo] = useState("/logo.jpg");
  const [smartType, setSmartType] = useState("Contact");
  const [fields, setFields] = useState({});
  const [ready, setReady] = useState(false);
  const canvasRef = useRef(null);

  const [places, setPlaces] = useState([]);

  const content = tab === "smart" ? SMART[smartType].build(fields) : text.trim();

  // free place search (Photon / OpenStreetMap); skipped once a suggestion is picked
  useEffect(() => {
    const q = fields.place?.trim();
    if (tab !== "smart" || smartType !== "Location" || fields.latlng || !q || q.length < 3) {
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
  }, [fields.place, fields.latlng, tab, smartType]);

  useEffect(() => {
    if (!content || !canvasRef.current) {
      setReady(false);
      return;
    }
    const styled = tab === "stylish" || tab === "smart";
    const opts = {
      size,
      bg: tab === "normal" ? "#ffffff" : bg,
      fg: tab === "normal" ? "#000000" : fg,
      fg2: styled ? fg2 : null,
      shape: styled ? shape : "square",
      logo: tab === "logo" ? logo : null,
    };
    let cancelled = false;
    drawQR(canvasRef.current, content, opts)
      .then(() => !cancelled && setReady(true))
      .catch(() => !cancelled && setReady(false));
    return () => {
      cancelled = true;
    };
  }, [content, tab, size, fg, fg2, bg, shape, logo]);

  function download() {
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = `ganivotech-qr-${tab}.png`;
    a.click();
  }

  function onLogoFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors mb-4";
  const styled = tab === "stylish" || tab === "smart";

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Free Tool
          </p>
          <h1 className="text-4xl font-bold mb-4">
            QR Code <span className="gradient-text">Maker</span>
          </h1>
          <p className="text-muted">
            Plain, logo, stylish or smart QR codes — made in your browser, free.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? "gradient-bg-orange text-white shadow"
                  : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6">
          {tab !== "smart" && (
            <>
              <label className="block text-sm font-medium mb-2">URL or Text</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={inputCls}
              />
            </>
          )}

          {tab === "smart" && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(SMART).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSmartType(s)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                      smartType === s ? "gradient-bg text-white" : "border border-border text-muted"
                    }`}
                  >
                    {s === "Contact" ? "Contact (vCard)" : s === "UPI" ? "UPI Payment" : s}
                  </button>
                ))}
              </div>
              {SMART[smartType].fields.map(([key, label, ph]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <input
                    className={inputCls}
                    placeholder={ph}
                    value={fields[key] || ""}
                    onChange={(e) =>
                      setFields((p) => ({ ...p, [key]: e.target.value, ...(key === "place" && { latlng: "" }) }))
                    }
                  />
                  {key === "place" && places.length > 0 && (
                    <ul className="-mt-3 mb-4 rounded-xl border border-border bg-background overflow-hidden">
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
                  {key === "place" && fields.latlng && (
                    <p className="-mt-3 mb-4 text-xs text-green-600">Exact location selected — QR opens it in Google Maps.</p>
                  )}
                </div>
              ))}
            </>
          )}

          {tab === "logo" && (
            <>
              <label className="block text-sm font-medium mb-2">Your logo (default: Ganivotech)</label>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="logo" className="w-12 h-12 rounded-lg object-cover border border-border" />
                <input type="file" accept="image/*" onChange={onLogoFile} className="text-sm" />
              </div>
            </>
          )}

          {tab !== "normal" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1">{styled ? "Color 1" : "QR color"}</label>
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full h-10 rounded-lg border border-border" />
              </div>
              {styled && (
                <div>
                  <label className="block text-xs font-medium mb-1">Color 2 (gradient)</label>
                  <input type="color" value={fg2} onChange={(e) => setFg2(e.target.value)} className="w-full h-10 rounded-lg border border-border" />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1">Background</label>
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-10 rounded-lg border border-border" />
              </div>
            </div>
          )}

          {styled && (
            <>
              <label className="block text-sm font-medium mb-2">Shape</label>
              <div className="flex gap-2 mb-4">
                {["square", "rounded", "dots"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize ${
                      shape === s ? "gradient-bg text-white" : "border border-border text-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <label className="block text-sm font-medium mb-2">Size</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={inputCls + " mb-0"}>
            {[300, 500, 800, 1000, 1500].map((s) => (
              <option key={s} value={s}>{s} x {s}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center">
          {!ready && <p className="text-sm text-muted py-6">Fill in the details above — your QR code appears here instantly.</p>}
          <div className={ready ? "" : "hidden"}>
            <div className="inline-block p-3 bg-white rounded-xl mb-5 border border-border">
              <canvas ref={canvasRef} style={{ width: 300, height: 300 }} />
            </div>
            <div>
              <button onClick={download} className="px-6 py-2.5 rounded-lg gradient-bg-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
