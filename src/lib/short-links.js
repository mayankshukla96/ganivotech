// Rules and name-style generators for the Short Link Maker. Pure functions: used by the page (instant feedback) and the API (the real check).

export const BASE = "https://ganivotech.com";
export const PREFIX = "/go/";
export const EXPIRY = { never: null, "1d": 1, "7d": 7, "30d": 30, "365d": 365 };

// ---- destination ------------------------------------------------------------
const SHORTENERS = new Set([
  "bit.ly", "bitly.com", "tinyurl.com", "t.co", "goo.gl", "is.gd", "v.gd", "cutt.ly", "rb.gy", "rebrand.ly", "shorturl.at",
  "ow.ly", "buff.ly", "t.ly", "tiny.cc", "lnkd.in", "s.id", "adf.ly", "bl.ink",
]);

/** Returns { ok: true, url } with a clean absolute https/http URL, or { ok: false, error }. */
export function checkDestination(input) {
  let s = String(input ?? "").trim();
  if (!s) return { ok: false, error: "Paste the link you want to shorten." };
  if (s.length > 2000) return { ok: false, error: "That link is too long (2000 characters is the limit)." };
  if (/\s/.test(s)) return { ok: false, error: "A link cannot contain spaces." };
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = `https://${s}`;
  let u;
  try { u = new URL(s); } catch { return { ok: false, error: "That does not look like a valid link." }; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return { ok: false, error: "Only http and https links can be shortened." };
  if (u.username || u.password) return { ok: false, error: "Links that contain a username or password are not allowed." };
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".onion") || host === "localhost") return { ok: false, error: "Enter a public website address, for example https://example.com/page." };
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return { ok: false, error: "Links to an IP address are not allowed. Use the website name." };
  if (host.split(".").some((p) => p.startsWith("xn--"))) return { ok: false, error: "Links with look-alike (international) domain names are not allowed, to keep people safe from fake sites." };
  if (u.port) return { ok: false, error: "Links with a custom port are not allowed." };
  if (SHORTENERS.has(host.replace(/^www\./, ""))) return { ok: false, error: "That is already a short link. Paste the full link instead." };
  if (/(^|\.)ganivotech\.com$/.test(host) && u.pathname.startsWith(PREFIX)) return { ok: false, error: "That is already a Ganivotech short link." };
  return { ok: true, url: u.toString() };
}

/** A link page: a title and up to 12 labelled links. Returns { ok, page } (cleaned) or { ok: false, error }. */
export function checkPage(p) {
  const title = String(p?.title ?? "").trim().slice(0, 60);
  if (!title) return { ok: false, error: "Give your page a title." };
  const raw = Array.isArray(p?.links) ? p.links : [];
  const links = [];
  for (const [i, l] of raw.entries()) {
    const label = String(l?.label ?? "").trim().slice(0, 40);
    if (!label && !String(l?.url ?? "").trim()) continue; // empty row
    const d = checkDestination(l?.url);
    if (!d.ok) return { ok: false, error: `Link ${i + 1}: ${d.error}` };
    if (!label) return { ok: false, error: `Link ${i + 1}: add a name for the button.` };
    links.push({ label, url: d.url });
  }
  if (links.length < 2) return { ok: false, error: "Add at least two links." };
  if (links.length > 12) return { ok: false, error: "A page can hold up to 12 links." };
  return { ok: true, page: { title, desc: String(p?.desc ?? "").trim().slice(0, 140), links } };
}

// ---- alias ------------------------------------------------------------------
const RESERVED = new Set(["admin", "api", "preview", "stats", "null", "undefined", "www", "help", "support", "about", "contact", "terms", "privacy", "tools", "go", "ganivotech", "home", "index"]);
// Names that scammers use to pretend to be a bank, wallet or prize. Blocked as whole words (tokens) or as parts of a name.
const BAD_TOKENS = new Set(["sex", "porn", "xxx", "nude", "rape", "lund", "bsdk", "sbi", "upi", "login", "signin", "secure", "winner", "prize", "claim", "reward", "gov", "kyc", "otp"]);
const BAD_PARTS = ["fuck", "shit", "bitch", "madarchod", "bhenchod", "chutiya", "gandu", "paypal", "paytm", "phonepe", "gpay", "googlepay", "hdfc", "icici", "verify", "password", "refund", "lottery", "aadhaar", "aadhar", "netbanking", "bank"];

/** Alias rules: 3 to 32 letters, numbers and single hyphens. Returns null when fine, else a message. Case is ignored. */
export function aliasProblem(alias) {
  const a = String(alias ?? "").toLowerCase();
  if (a.length < 3) return "Use at least 3 characters.";
  if (a.length > 32) return "Use at most 32 characters.";
  if (!/^[a-z0-9-]+$/.test(a)) return "Use only English letters, numbers and hyphens (-).";
  if (a.startsWith("-") || a.endsWith("-")) return "A name cannot start or end with a hyphen.";
  if (a.includes("--")) return "Use single hyphens only.";
  if (RESERVED.has(a)) return "That name is reserved. Try another.";
  if (a.split("-").some((t) => BAD_TOKENS.has(t)) || BAD_PARTS.some((b) => a.includes(b))) return "That name is not allowed (it could be used to impersonate a bank or app, or it is offensive). Try another.";
  return null;
}

// ---- name styles ---------------------------------------------------------------
export const STYLES = [
  { id: "title", label: "From my title", hint: "Your title as a readable name", needs: true },
  { id: "brand", label: "Brand + word", hint: "yourbrand-menu, yourbrand-offer", needs: true },
  { id: "words", label: "Two words", hint: "mango-tiger, chai-comet" },
  { id: "dated", label: "With the month", hint: "diwali-oct26" , needs: true },
  { id: "pron", label: "Easy to say", hint: "kovira, mebuto" },
  { id: "code", label: "Short code", hint: "k7m2xq" },
];

const ADJ = ["bright", "happy", "swift", "lucky", "cool", "bold", "calm", "royal", "sunny", "smart", "tiny", "wild", "fresh", "gold", "super", "magic", "desi", "spicy", "zesty", "cosmic", "silver", "brave", "merry", "snappy"];
const NOUN = ["mango", "tiger", "chai", "comet", "lotus", "rocket", "peacock", "monsoon", "diya", "kite", "falcon", "jasmine", "saffron", "river", "maple", "pixel", "cricket", "samosa", "banyan", "sparrow", "dosa", "sitar", "ginger", "orbit"];
const BRAND_WORDS = ["menu", "offer", "shop", "order", "hello", "book", "pay", "deals", "catalog", "contact", "store", "join", "info", "demo", "sale", "visit"];
const MON = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const pick = (arr) => arr[rand(arr.length)];
function rand(n) {
  const b = new Uint32Array(1);
  globalThis.crypto.getRandomValues(b);
  return b[0] % n;
}
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// cuts at a whole word, so "diwali offer" is never shortened to "diwali-off"
export const slugify = (t, max = 24) => {
  const words = String(t ?? "").toLowerCase().replace(/&/g, " and ").split(/[^a-z0-9]+/).filter(Boolean);
  let out = "";
  for (const w of words) {
    if ((out ? `${out}-${w}` : w).length > max) break;
    out = out ? `${out}-${w}` : w;
  }
  return out || (words[0] || "").slice(0, max);
};

const code = (n) => Array.from({ length: n }, () => "abcdefghjkmnpqrstuvwxyz23456789"[rand(31)]).join("");
const pron = () => { const C = "bdgklmnprstvz", V = "aeiou"; return Array.from({ length: 3 }, () => pick([...C]) + pick([...V])).join("") + (rand(2) ? pick([...C]) : ""); };

/** `n` fresh name ideas for a style. `text` is what the link is for (a title or brand name). */
export function suggest(style, text, n = 6) {
  const slug = slugify(text);
  const words = slug.split("-").filter(Boolean);
  const yy = String(new Date().getFullYear()).slice(2);
  const mon = MON[new Date().getMonth()];
  let out = [];
  if (style === "title" && slug) {
    const two = words.slice(0, 2).join("-");
    out = [slug, two, `my-${two}`, `get-${two}`, `${two}-now`, `${two}-link`, `${two}-${new Date().getFullYear()}`, `${two}-${rand(90) + 10}`];
  } else if (style === "brand" && words[0]) {
    out = shuffle([...BRAND_WORDS]).map((w) => `${words[0]}-${w}`);
  } else if (style === "dated" && slug) {
    const two = words.slice(0, 2).join("-");
    out = [`${two}-${mon}${yy}`, `${words[0]}-${mon}${yy}`, `${two}-${mon}`, `${two}-${yy}`, `${two}-${mon}${yy}-${code(2)}`, `${two}-${mon}-${new Date().getDate()}`];
  } else if (style === "pron") {
    out = Array.from({ length: n + 4 }, pron);
  } else if (style === "code") {
    out = Array.from({ length: n + 4 }, () => code(6));
  } else {
    out = Array.from({ length: n + 6 }, () => `${pick(ADJ)}-${pick(NOUN)}`);
  }
  return [...new Set(out.map((a) => a.toLowerCase()).filter((a) => !aliasProblem(a)))].slice(0, n);
}

export const randomAlias = () => code(6);

export const absolute = (alias) => `${BASE}${PREFIX}${alias}`;
