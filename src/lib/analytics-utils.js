export const TZ = "Asia/Kolkata";
const IST_MS = 5.5 * 3600 * 1000;
const DAY = 86400000;

// ---- traffic source -------------------------------------------------------
// [host/app pattern, source name, medium]
const RULES = [
  [/(^|\.)google\.[a-z.]+$|^com\.google\.android\.googlequicksearchbox$/, "Google", "search"],
  [/(^|\.)bing\.com$/, "Bing", "search"],
  [/duckduckgo\.com$/, "DuckDuckGo", "search"],
  [/(^|\.)yahoo\.com$|search\.yahoo/, "Yahoo", "search"],
  [/ecosia\.org$/, "Ecosia", "search"],
  [/yandex\.[a-z]+$/, "Yandex", "search"],
  [/baidu\.com$/, "Baidu", "search"],
  [/^gemini\.google\.com$/, "Gemini", "ai"],
  [/chatgpt\.com$|chat\.openai\.com$/, "ChatGPT", "ai"],
  [/perplexity\.ai$/, "Perplexity", "ai"],
  [/claude\.ai$/, "Claude", "ai"],
  [/copilot\.microsoft\.com$/, "Copilot", "ai"],
  [/^mail\.google\.com$|^com\.google\.android\.gm$/, "Gmail", "email"],
  [/outlook\.(live|office)\.com$|^com\.microsoft\.office\.outlook$/, "Outlook", "email"],
  [/facebook\.com$|^fb\.com$|^l\.facebook\.com$|^com\.facebook\./, "Facebook", "social"],
  [/instagram\.com$|^com\.instagram\./, "Instagram", "social"],
  [/(^|\.)t\.co$|twitter\.com$|(^|\.)x\.com$/, "X (Twitter)", "social"],
  [/linkedin\.com$|^lnkd\.in$/, "LinkedIn", "social"],
  [/youtube\.com$|^youtu\.be$/, "YouTube", "social"],
  [/whatsapp\.com$|^wa\.me$|^com\.whatsapp/, "WhatsApp", "social"],
  [/(^|\.)t\.me$|telegram\.org$|^org\.telegram/, "Telegram", "social"],
  [/reddit\.com$/, "Reddit", "social"],
  [/pinterest\.[a-z.]+$/, "Pinterest", "social"],
  [/quora\.com$/, "Quora", "social"],
];

export function classifySource({ referrer, utmSource, utmMedium, nav, ownHost }) {
  if (nav) return { source: "internal", medium: "internal", refHost: null };
  const clean = (s) => String(s).toLowerCase().replace(/[^a-z0-9 _.\-]/g, "").slice(0, 40);

  let host = null;
  if (referrer) {
    try {
      host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    } catch {}
  }
  if (host && ownHost && (host === ownHost || host.endsWith(`.${ownHost}`))) {
    return { source: "internal", medium: "internal", refHost: host };
  }

  if (utmSource) {
    return { source: clean(utmSource) || "campaign", medium: clean(utmMedium || "campaign") || "campaign", refHost: host };
  }
  if (!host) return { source: "Direct", medium: "direct", refHost: null };

  for (const [re, source, medium] of RULES) if (re.test(host)) return { source, medium, refHost: host };
  return { source: host, medium: "referral", refHost: host };
}

// ---- user agent -----------------------------------------------------------
export const isBot = (ua = "") =>
  !ua ||
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pagespeed|vercel|monitor|uptime|curl|wget|python|node-fetch|undici|axios|ganivotech-seo-check/i.test(ua);

export function parseUA(ua = "") {
  const device = /ipad|tablet/i.test(ua) ? "Tablet" : /mobi|android|iphone/i.test(ua) ? "Mobile" : "Desktop";
  const browser = /FBAN|FBAV/.test(ua) ? "Facebook app"
    : /Instagram/.test(ua) ? "Instagram app"
    : /SamsungBrowser/.test(ua) ? "Samsung Internet"
    : /Edg\//.test(ua) ? "Edge"
    : /OPR\/|Opera/.test(ua) ? "Opera"
    : /Firefox|FxiOS/.test(ua) ? "Firefox"
    : /Chrome|CriOS/.test(ua) ? "Chrome"
    : /Safari/.test(ua) ? "Safari"
    : "Other";
  const os = /Windows/.test(ua) ? "Windows"
    : /Android/.test(ua) ? "Android"
    : /iPhone|iPad|iPod/.test(ua) ? "iOS"
    : /Mac OS X|Macintosh/.test(ua) ? "macOS"
    : /Linux/.test(ua) ? "Linux"
    : "Other";
  return { device, browser, os };
}

// ---- places ---------------------------------------------------------------
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
export const countryName = (c) => {
  if (!c) return "Unknown";
  try {
    return regionNames.of(c) || c;
  } catch {
    return c;
  }
};
export const flag = (c) =>
  c && /^[A-Za-z]{2}$/.test(c) ? String.fromCodePoint(...[...c.toUpperCase()].map((ch) => 127397 + ch.charCodeAt(0))) : "\u{1F310}";

// ---- date ranges (all in IST) ----------------------------------------------
const istDayStart = (ms) => Math.floor((ms + IST_MS) / DAY) * DAY - IST_MS;
export const istDateString = (ms = Date.now()) => new Date(ms + IST_MS).toISOString().slice(0, 10);

/** Turn ?range=today|7d|30d|all|custom&from=&to= into {from, to, label, key, gran}. `firstTs` is the earliest row (for all-time). */
export function resolveRange(sp, firstTs) {
  const now = Date.now();
  const today = istDayStart(now);
  const tomorrow = today + DAY;
  const key = ["today", "7d", "30d", "all", "custom"].includes(sp.range) ? sp.range : "7d";
  let from;
  let to = tomorrow;
  let label;

  if (key === "today") { from = today; label = "Today"; }
  else if (key === "30d") { from = today - 29 * DAY; label = "Last 30 days"; }
  else if (key === "all") { from = firstTs ? istDayStart(new Date(firstTs).getTime()) : today; label = "All time"; }
  else if (key === "custom") {
    const f = Date.parse(`${sp.from}T00:00:00+05:30`);
    const t = Date.parse(`${sp.to}T00:00:00+05:30`);
    if (Number.isFinite(f) && Number.isFinite(t) && t >= f) {
      from = f;
      to = t + DAY;
      label = `${sp.from} to ${sp.to}`;
    } else {
      from = today - 6 * DAY; label = "Last 7 days";
    }
  } else { from = today - 6 * DAY; label = "Last 7 days"; }

  const days = Math.round((to - from) / DAY);
  const gran = days <= 2 ? "hour" : days <= 120 ? "day" : "month";
  return { from: new Date(from), to: new Date(to), fromMs: from, toMs: to, label, key, gran };
}

// continuous bucket keys between from and to, matching the SQL to_char output
export function bucketKeys(fromMs, toMs, gran) {
  const keys = [];
  if (gran === "hour") {
    for (let t = fromMs; t < toMs; t += 3600000) {
      const s = new Date(t + IST_MS).toISOString();
      keys.push(`${s.slice(0, 10)} ${s.slice(11, 13)}:00`);
    }
  } else if (gran === "day") {
    for (let t = fromMs; t < toMs; t += DAY) keys.push(istDateString(t));
  } else {
    const d = new Date(fromMs + IST_MS);
    let y = d.getUTCFullYear();
    let m = d.getUTCMonth();
    const end = new Date(toMs - 1 + IST_MS);
    while (y < end.getUTCFullYear() || (y === end.getUTCFullYear() && m <= end.getUTCMonth())) {
      keys.push(`${y}-${String(m + 1).padStart(2, "0")}`);
      if (++m > 11) { m = 0; y++; }
    }
  }
  return keys;
}

export const fmtIST = (d) =>
  new Date(d).toLocaleString("en-IN", { timeZone: TZ, day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
