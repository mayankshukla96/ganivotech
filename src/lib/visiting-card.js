// Shared by the Visiting Card Maker, the smart-card page and the contact download. Pure: no DOM, no network.
import { checkDestination } from "@/lib/short-links";

export const CARD_MM = { w: 89, h: 51 }; // the common Indian visiting card size
export const COLORS = [["Navy", "#0f3d8c"], ["Teal", "#0f766e"], ["Maroon", "#7f1d1d"], ["Purple", "#5b21b6"], ["Green", "#166534"], ["Black", "#111111"]];
export const TEMPLATES = ["Classic", "Bold", "Split", "Minimal"];

export const digits = (s) => String(s ?? "").replace(/\D/g, "");
const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

/** A vCard 3.0 that phones import as a contact. */
export function vcardText(c) {
  const [first, ...rest] = String(c.name || "").trim().split(/\s+/);
  const tel = digits(c.phone);
  return [
    "BEGIN:VCARD", "VERSION:3.0",
    `N:${esc(rest.join(" "))};${esc(first)};;;`, `FN:${esc(c.name)}`,
    c.company && `ORG:${esc(c.company)}`, c.title && `TITLE:${esc(c.title)}`,
    tel && `TEL;TYPE=CELL,VOICE:+${tel}`, c.email && `EMAIL;TYPE=INTERNET:${esc(c.email)}`,
    c.website && `URL:${esc(c.website)}`, c.address && `ADR;TYPE=WORK:;;${esc(c.address)};;;;`,
    c.tagline && `NOTE:${esc(c.tagline)}`, "END:VCARD",
  ].filter(Boolean).join("\r\n");
}

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

/** Checks and cleans the details of a smart card before it is saved. Returns { ok, page } or { ok: false, error }. */
export function checkCard(p) {
  const name = clip(p?.name, 60);
  if (name.length < 2) return { ok: false, error: "Enter your name." };
  const phone = digits(p?.phone), whatsapp = digits(p?.whatsapp || p?.phone);
  if (phone && (phone.length < 8 || phone.length > 15)) return { ok: false, error: "Please check the phone number. Include the country code, for example 919876543210." };
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) return { ok: false, error: "Please check the WhatsApp number." };
  const email = clip(p?.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: "Please check the email address." };
  let website = clip(p?.website, 300);
  if (website) {
    const d = checkDestination(website);
    if (!d.ok) return { ok: false, error: `Website: ${d.error}` };
    website = d.url;
  }
  if (!phone && !email && !website) return { ok: false, error: "Add at least a phone number, an email or a website." };
  const color = /^#[0-9a-f]{6}$/i.test(p?.color) ? p.color.toLowerCase() : "#0f3d8c";
  const logo = typeof p?.logo === "string" && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(p.logo) && p.logo.length <= 40000 ? p.logo : "";
  return {
    ok: true,
    page: { kind: "card", name, title: clip(p?.title, 60), company: clip(p?.company, 60), phone, whatsapp, email, website, address: clip(p?.address, 160), tagline: clip(p?.tagline, 100), color, logo },
  };
}
