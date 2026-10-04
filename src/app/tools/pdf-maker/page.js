"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function PDFMaker() {
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState("normal");
  const [quality, setQuality] = useState("high");
  const fileRef = useRef(null);

  function handleFiles(e) {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "txt", "html", "htm"].includes(ext);
    });
    if (valid.length === 0) {
      alert("Please select image files (JPG, PNG, GIF, BMP, WebP, SVG) or text/HTML files.");
      return;
    }

    const promises = valid.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          const ext = file.name.split(".").pop().toLowerCase();
          const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext);
          reader.onload = (ev) =>
            resolve({
              name: file.name,
              type: isImage ? "image" : "text",
              data: ev.target.result,
              size: file.size,
            });
          if (isImage) reader.readAsDataURL(file);
          else reader.readAsText(file);
        })
    );

    Promise.all(promises).then((results) => {
      setFiles((prev) => [...prev, ...results]);
    });
  }

  function removeFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  function moveFile(i, dir) {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function generatePDF() {
    if (files.length === 0) return;

    const margins = { none: "0", normal: "10mm", large: "20mm" };
    const m = margins[margin];
    const size = pageSize === "letter" ? "letter" : pageSize === "legal" ? "legal" : "A4";

    let html = `<!DOCTYPE html><html><head><title>PDF - Ganivotech</title><style>
@page { size: ${size} ${orientation}; margin: ${m}; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; }
.page { page-break-after: always; width: 100%; }
.page:last-child { page-break-after: auto; }
.page img { display: block; width: 100%; height: auto; max-height: 96vh; object-fit: contain; object-position: top center; }
.text-page { padding: 15mm; display: block; }
.text-page pre { white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.6; font-family: 'Courier New', monospace; }
.html-page { padding: 10mm; display: block; }
@media print { .page { page-break-after: always; } }
</style></head><body>`;

    files.forEach((f) => {
      if (f.type === "image") {
        html += `<div class="page"><img src="${f.data}" alt="${f.name}"></div>`;
      } else {
        const ext = f.name.split(".").pop().toLowerCase();
        if (ext === "html" || ext === "htm") {
          html += `<div class="html-page">${f.data}</div>`;
        } else {
          const escaped = f.data
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          html += `<div class="page text-page"><pre>${escaped}</pre></div>`;
        }
      }
    });

    html += "</body></html>";

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Free Tool
          </p>
          <h1 className="text-4xl font-bold mb-4">
            PDF <span className="gradient-text">Maker</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Upload images or text files and convert them into a single PDF.
            100% client-side — your files never leave your device.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-background">
            <svg
              className="w-10 h-10 text-muted mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-muted">
              Click to upload images or text files
            </span>
            <span className="text-xs text-muted/60 mt-1">
              JPG, PNG, GIF, WebP, SVG, TXT, HTML
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.txt,.html,.htm"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* File List */}
        {files.length > 0 && (
          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Files ({files.length})
              </h2>
              <button
                onClick={() => {
                  setFiles([]);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                >
                  {f.type === "image" ? (
                    <img
                      src={f.data}
                      alt={f.name}
                      className="w-10 h-10 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      TXT
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted">{formatSize(f.size)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFile(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-xs hover:bg-primary/10 disabled:opacity-30"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFile(i, 1)}
                      disabled={i === files.length - 1}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-xs hover:bg-primary/10 disabled:opacity-30"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFile(i)}
                      className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 text-sm"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Options */}
        {files.length > 0 && (
          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold mb-4">PDF Options</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Margins
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="none">None</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generate Button */}
        {files.length > 0 && (
          <button
            onClick={generatePDF}
            className="w-full py-4 rounded-xl gradient-bg-orange text-white font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Generate PDF ({files.length} {files.length === 1 ? "file" : "files"})
          </button>
        )}

        {/* How it works */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="w-12 h-12 rounded-full gradient-bg-orange text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold mb-1">Upload Files</h3>
              <p className="text-sm text-muted">
                Select images (JPG, PNG, etc.) or text files from your device.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="w-12 h-12 rounded-full gradient-bg-orange text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold mb-1">Arrange & Configure</h3>
              <p className="text-sm text-muted">
                Reorder files and choose page size, orientation, and margins.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="w-12 h-12 rounded-full gradient-bg-orange text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold mb-1">Save as PDF</h3>
              <p className="text-sm text-muted">
                Click Generate and use your browser&apos;s &quot;Save as PDF&quot; option.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mt-6">
            <h3 className="text-lg font-semibold mb-3">Privacy First</h3>
            <p className="text-sm text-muted leading-relaxed">
              Everything runs <strong>100% in your browser</strong>. Your files are never uploaded to any server. No data leaves your device. Close the tab and everything is gone — completely private and secure.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
