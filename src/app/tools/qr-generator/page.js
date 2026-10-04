"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [size, setSize] = useState("300");

  function generate(e) {
    e.preventDefault();
    if (!url.trim()) return;
    const encoded = encodeURIComponent(url.trim());
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=png`
    );
  }

  function download() {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qr-code.png";
    a.click();
  }

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
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
            Enter any URL and get a downloadable QR code instantly.
          </p>
        </motion.div>

        <motion.form
          onSubmit={generate}
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium mb-2">URL</label>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors mb-4"
          />

          <label className="block text-sm font-medium mb-2">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors mb-5"
          >
            <option value="200">200 x 200</option>
            <option value="300">300 x 300</option>
            <option value="500">500 x 500</option>
            <option value="800">800 x 800</option>
            <option value="1000">1000 x 1000</option>
          </select>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Generate QR Code
          </button>
        </motion.form>

        {qrUrl && (
          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block p-4 bg-white rounded-xl mb-5">
              <img
                src={qrUrl}
                alt="QR Code"
                className="mx-auto"
                style={{ width: Math.min(Number(size), 300), height: Math.min(Number(size), 300) }}
              />
            </div>
            <div>
              <button
                onClick={download}
                className="px-6 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Download QR Code
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
