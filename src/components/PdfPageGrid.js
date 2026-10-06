"use client";

import { useEffect, useRef, useState } from "react";
import { parseRanges } from "@/lib/pdf-edit";
import { renderPage } from "@/lib/pdf-tools";

const MAX_THUMBS = 300;
const tool = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors";
const mini = "w-7 h-7 rounded-md border border-border bg-background text-sm leading-none hover:border-primary hover:text-primary disabled:opacity-30";
const field = "w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors";

/** One entry per page, in file order. `on` means the page will be in the new file (in extract mode nothing is chosen at first). */
export const freshPages = (n, mode) => Array.from({ length: n }, (_, index) => ({ index, rotate: 0, on: mode !== "extract" }));

// [0,1,2,4] -> "1-3, 5"
function toRanges(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    out.push(i === j ? `${list[i] + 1}` : `${list[i] + 1}-${list[j] + 1}`);
    i = j;
  }
  return out.join(", ");
}

/**
 * Page thumbnails for choosing, turning, removing and reordering pages.
 * pages: [{ index, rotate, on }] in display order. mode: organize | rotate | delete | extract.
 */
export default function PdfPageGrid({ doc, pages, setPages, mode }) {
  const [thumbs, setThumbs] = useState({});
  const [draft, setDraft] = useState("");
  const [rangeErr, setRangeErr] = useState("");
  const drag = useRef(null);
  const n = doc.numPages;
  const canTurn = mode === "organize" || mode === "rotate";
  const picking = mode === "delete" || mode === "extract";
  // the pages the typed range talks about: the ones to delete, or the ones to keep
  const marked = (p) => (mode === "delete" ? !p.on : p.on);

  useEffect(() => {
    let live = true;
    setThumbs({});
    (async () => {
      for (let k = 1; k <= Math.min(n, MAX_THUMBS) && live; k++) {
        try {
          const { canvas } = await renderPage(doc, k, 200);
          const url = canvas.toDataURL("image/jpeg", 0.7);
          if (live) setThumbs((t) => ({ ...t, [k - 1]: url }));
        } catch {}
      }
    })();
    return () => { live = false; };
  }, [doc, n]);

  useEffect(() => {
    if (picking) setDraft(toRanges(pages.filter(marked).map((p) => p.index).sort((a, b) => a - b)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, mode]);

  const update = (i, patch) => setPages(pages.map((p, k) => (k === i ? { ...p, ...patch } : p)));
  const turn = (i, d) => update(i, { rotate: (pages[i].rotate + d + 360) % 360 });
  const turnAll = (d) => setPages(pages.map((p) => ({ ...p, rotate: (p.rotate + d + 360) % 360 })));
  const move = (from, to) => {
    if (to < 0 || to >= pages.length || from === to) return;
    const next = [...pages];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setPages(next);
  };
  const applyRange = () => {
    setRangeErr("");
    if (!draft.trim()) return setPages(pages.map((p) => ({ ...p, on: mode === "delete" })));
    try {
      const set = new Set(parseRanges(draft, n).flat());
      setPages(pages.map((p) => ({ ...p, on: mode === "delete" ? !set.has(p.index) : set.has(p.index) })));
    } catch (e) {
      setRangeErr(e.message);
    }
  };

  const kept = pages.filter((p) => p.on).length;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2 mb-3">
        {picking && (
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="pg-range" className="block text-xs font-medium mb-1">{mode === "delete" ? "Pages to delete" : "Pages to keep"} (click the pages, or type numbers)</label>
            <div className="flex gap-2">
              <input id="pg-range" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyRange()} placeholder="for example 2, 5-7" inputMode="text" className={field} />
              <button type="button" onClick={applyRange} className={tool}>Apply</button>
            </div>
          </div>
        )}
        {canTurn && (
          <>
            <button type="button" onClick={() => turnAll(-90)} className={tool}>Turn all left</button>
            <button type="button" onClick={() => turnAll(90)} className={tool}>Turn all right</button>
          </>
        )}
        <button type="button" onClick={() => { setRangeErr(""); setPages(freshPages(n, mode)); }} className={tool}>Reset</button>
      </div>
      {rangeErr && <p role="alert" className="text-sm text-red-600 mb-2">{rangeErr}</p>}
      <p className="text-xs text-muted mb-3" aria-live="polite">
        {mode === "rotate" ? `${n} page${n === 1 ? "" : "s"}. Use the arrows under a page to turn it.` : `${kept} of ${n} page${n === 1 ? "" : "s"} will be in the new file.`}
        {mode === "organize" && " Drag a page, or use the arrows, to move it."}
        {n > MAX_THUMBS && ` Previews are shown for the first ${MAX_THUMBS} pages; the rest show their page number.`}
      </p>

      <ul className={`grid gap-3 ${mode === "organize" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"}`}>
        {pages.map((p, i) => (
          <li
            key={p.index}
            draggable={mode === "organize"}
            onDragStart={() => { drag.current = i; }}
            onDragOver={(e) => mode === "organize" && e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (drag.current !== null) move(drag.current, i); drag.current = null; }}
            className={`rounded-xl border p-1.5 bg-background ${p.on ? (mode === "extract" ? "border-primary ring-1 ring-primary" : "border-border") : "border-border opacity-45"}`}
          >
            <button
              type="button"
              disabled={!picking}
              onClick={() => update(i, { on: !p.on })}
              aria-pressed={picking ? marked(p) : undefined}
              aria-label={picking ? `Page ${p.index + 1}${marked(p) ? (mode === "delete" ? ", will be deleted" : ", selected") : ""}` : `Page ${p.index + 1}`}
              className={`relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-white ${picking ? "cursor-pointer" : "cursor-default"}`}
            >
              {thumbs[p.index] ? (
                <img src={thumbs[p.index]} alt="" draggable={false} className="max-w-full max-h-full transition-transform" style={{ transform: `rotate(${p.rotate}deg)` }} />
              ) : (
                <span className="text-xs text-muted">{p.index + 1}</span>
              )}
              {!p.on && mode !== "extract" && <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-red-600 bg-white/60">Removed</span>}
            </button>
            <div className="flex items-center justify-between gap-1 mt-1.5">
              <span className="text-[11px] text-muted pl-0.5">{p.index + 1}</span>
              <span className="flex flex-wrap justify-end gap-1">
                {mode === "organize" && <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move page ${p.index + 1} earlier`} className={mini}>&larr;</button>}
                {mode === "organize" && <button type="button" onClick={() => move(i, i + 1)} disabled={i === pages.length - 1} aria-label={`Move page ${p.index + 1} later`} className={mini}>&rarr;</button>}
                {canTurn && <button type="button" onClick={() => turn(i, -90)} aria-label={`Turn page ${p.index + 1} left`} className={mini}>&#8630;</button>}
                {canTurn && <button type="button" onClick={() => turn(i, 90)} aria-label={`Turn page ${p.index + 1} right`} className={mini}>&#8631;</button>}
                {mode === "organize" && <button type="button" onClick={() => update(i, { on: !p.on })} aria-label={p.on ? `Remove page ${p.index + 1}` : `Put back page ${p.index + 1}`} className={mini}>{p.on ? "×" : "+"}</button>}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
