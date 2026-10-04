"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Privacy-friendly first-party page view beacon. No cookies, no stored IP.
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const p = new URLSearchParams(window.location.search);
    // referrer / UTM only describe the initial page load; later client-side navigations are "internal"
    const body = first.current
      ? { path: pathname, ref: document.referrer, utmSource: p.get("utm_source") || "", utmMedium: p.get("utm_medium") || "" }
      : { path: pathname, nav: true };
    first.current = false;
    try {
      navigator.sendBeacon("/api/collect", JSON.stringify(body));
    } catch {}
  }, [pathname]);

  return null;
}
