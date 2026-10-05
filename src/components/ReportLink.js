"use client";

import { useState } from "react";

export default function ReportLink({ alias }) {
  const [done, setDone] = useState(false);
  return done ? (
    <p className="mt-3 text-xs text-muted">Thank you. We will look at it.</p>
  ) : (
    <button
      type="button"
      onClick={() => fetch("/api/short/report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ alias }) }).finally(() => setDone(true))}
      className="mt-3 text-xs text-muted underline hover:text-primary"
    >
      Report this link as unsafe or spam
    </button>
  );
}
