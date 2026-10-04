// Emails the owner when a lead arrives. Uses Brevo's transactional email API (free plan: 300 emails a day).
// Needs BREVO_API_KEY, LEAD_ALERT_FROM (a sender verified in Brevo) and LEAD_ALERT_TO (comma separated). Without them it does nothing.
import { SITE } from "@/lib/qr-content";

const API = process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

export const alertConfigured = () => !!(process.env.BREVO_API_KEY && process.env.LEAD_ALERT_FROM && process.env.LEAD_ALERT_TO);

const LABELS = { "sellersync-os": "SellerSync pilot", "digital-desk": "Digital Desk", contact: "Contact form" };
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e || "");

/** Returns null on success, or a short error message. Never throws. */
export async function sendLeadAlert(lead) {
  try {
    const label = LABELS[lead.product] || lead.product;
    const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
    const digits = (lead.phone || "").replace(/\D/g, "");
    const rows = [
      ["Name", lead.name],
      ["Business", lead.business],
      ["Phone", lead.phone && `<a href="tel:${esc((lead.phone || "").replace(/[^\d+]/g, ""))}">${esc(lead.phone)}</a> &middot; <a href="https://wa.me/${digits}">WhatsApp</a>`],
      ["Email", lead.email && `<a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a>`],
      ["Details", lead.details],
      ["Message", lead.message],
    ].filter(([, v]) => v);
    const html =
      `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">` +
      `<h2 style="margin:0 0 4px">New lead: ${esc(label)}</h2><p style="margin:0 0 16px;color:#64748b">${esc(when)} IST</p>` +
      `<table cellpadding="6" style="border-collapse:collapse;width:100%">` +
      rows.map(([k, v]) => `<tr><td style="color:#64748b;vertical-align:top;white-space:nowrap">${k}</td><td>${k === "Phone" || k === "Email" ? v : esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("") +
      `</table><p style="margin-top:20px"><a href="${SITE}/admin/analytics">Open the dashboard</a></p></div>`;

    const body = {
      sender: { name: "Ganivotech Leads", email: process.env.LEAD_ALERT_FROM },
      to: process.env.LEAD_ALERT_TO.split(",").map((e) => ({ email: e.trim() })).filter((t) => emailOk(t.email)),
      subject: `New lead: ${label} - ${lead.name}`.slice(0, 150),
      htmlContent: html,
    };
    if (!body.to.length) return "LEAD_ALERT_TO has no valid email address";
    if (emailOk(lead.email)) body.replyTo = { email: lead.email, name: lead.name };

    const res = await fetch(API, {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return null;
    let msg = "";
    try { msg = (await res.json()).message || ""; } catch {}
    return `Brevo ${res.status}${msg ? `: ${msg}` : ""}`.slice(0, 240);
  } catch (e) {
    return `Could not reach Brevo (${e.name || "error"})`;
  }
}
