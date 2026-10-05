"use client";

import { useRouter } from "next/navigation";

// Owner-only buttons on the dashboard; the API accepts them because of the admin login cookie.
export default function AdminLinkActions({ alias, disabled }) {
  const router = useRouter();
  const run = (action) =>
    fetch("/api/short/manage", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ alias, action }) }).then(() => router.refresh());
  const cls = "px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted hover:border-primary hover:text-primary";
  return (
    <div className="flex gap-1.5">
      <button type="button" onClick={() => run(disabled ? "enable" : "disable")} className={cls}>{disabled ? "Switch on" : "Switch off"}</button>
      <button type="button" onClick={() => window.confirm(`Delete /go/${alias}?`) && run("delete")} className={cls}>Delete</button>
    </div>
  );
}
