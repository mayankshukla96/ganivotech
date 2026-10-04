"use client";

import { useRef, useState } from "react";

export default function FileDrop({ accept, multiple = false, onFiles, label, hint }) {
  const [over, setOver] = useState(false);
  const ref = useRef(null);
  const take = (list) => {
    const files = [...(list || [])];
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      className={`flex flex-col items-center justify-center w-full min-h-36 px-4 py-6 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-colors bg-background ${over ? "border-primary" : "border-border hover:border-primary/50"}`}
    >
      <svg className="w-9 h-9 text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="text-xs text-muted mt-1">{hint}</span>}
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => { take(e.target.files); e.target.value = ""; }} />
    </label>
  );
}
