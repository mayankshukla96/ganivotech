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

const SMART_TYPES = ["WhatsApp", "WiFi", "Email"];

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
  const [smartType, setSmartType] = useState("WhatsApp");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [ready, setReady] = useState(false);
  const canvasRef = useRef(null);

  let content = text.trim();
  if (tab === "smart") {
    if (smartType === "WhatsApp")
      content = phone.trim()
        ? `https://wa.me/${phone.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`
        : "";
    else if (smartType === "WiFi")
      content = ssid.trim() ? `WIFI:T:${wifiPass ? "WPA" : "nopass"};S:${ssid};P:${wifiPass};;` : "";
    else
      content = email.trim()
        ? `mailto:${email.trim()}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
        : "";
  }

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
              <div className="flex gap-2 mb-4">
                {SMART_TYPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSmartType(s)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                      smartType === s ? "gradient-bg text-white" : "border border-border text-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {smartType === "WhatsApp" && (
                <>
                  <label className="block text-sm font-medium mb-2">WhatsApp number (with country code)</label>
                  <input className={inputCls} placeholder="919876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <label className="block text-sm font-medium mb-2">Pre-filled message (optional)</label>
                  <input className={inputCls} placeholder="Hi, I want to know more" value={message} onChange={(e) => setMessage(e.target.value)} />
                </>
              )}
              {smartType === "WiFi" && (
                <>
                  <label className="block text-sm font-medium mb-2">WiFi name (SSID)</label>
                  <input className={inputCls} placeholder="MyHomeWiFi" value={ssid} onChange={(e) => setSsid(e.target.value)} />
                  <label className="block text-sm font-medium mb-2">Password (leave empty for open network)</label>
                  <input className={inputCls} placeholder="password" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} />
                </>
              )}
              {smartType === "Email" && (
                <>
                  <label className="block text-sm font-medium mb-2">Email address</label>
                  <input className={inputCls} placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <label className="block text-sm font-medium mb-2">Subject (optional)</label>
                  <input className={inputCls} placeholder="Enquiry" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </>
              )}
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
