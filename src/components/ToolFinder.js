"use client";

import Link from "next/link";
import { useState } from "react";
import { TOOLS, TOOL_GROUPS } from "@/lib/tools-content";

// The home page's tool grid: a search box over the same TOOLS list that feeds the menu, footer and hub.
export default function ToolFinder({ withSearch = true }) {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const match = (t) => words.every((w) => `${t.name} ${t.blurb}`.toLowerCase().includes(w));
  const shown = TOOLS.filter(match);

  return (
    <div>
      {withSearch && (
        <div className="max-w-xl mx-auto mb-8">
          <label htmlFor="tool-search" className="sr-only">Search the free tools</label>
          <input
            id="tool-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
            placeholder="What do you need? Try: pdf, qr, photo, kb, whatsapp"
            className="w-full px-5 py-3.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}
      {shown.length ? (
        TOOL_GROUPS.map(([g, heading]) => {
          const list = shown.filter((t) => t.group === g);
          if (!list.length) return null;
          return (
            <div key={g} className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">{heading}</h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="block h-full rounded-2xl border border-border bg-surface p-5 hover:border-primary transition-colors">
                      <span className="block font-bold mb-1">{t.name}</span>
                      <span className="block text-sm text-muted leading-relaxed">{t.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      ) : (
        <p className="text-center text-muted">No tool matches &quot;{q}&quot;. <Link href="/contact" className="text-primary underline">Tell us what you need</Link> and we may build it.</p>
      )}
    </div>
  );
}
