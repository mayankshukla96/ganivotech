const enc = encodeURIComponent;
const esc = (s) => String(s).replace(/([\\;,:"])/g, "\\$1");
const icsDate = (v) => (v ? v.replace(/[-:]/g, "") + "00" : "");

// field: [key, label, placeholder, inputType?]  build() returns "" until required fields are filled
export const QR_TYPES = {
  url: {
    label: "URL",
    fields: [["url", "Website link", "https://example.com"]],
    build: (f) => {
      const u = f.url?.trim();
      if (!u) return "";
      return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
    },
  },
  text: {
    label: "Text",
    fields: [["text", "Your text", "Any message, note or code", "textarea"]],
    build: (f) => f.text?.trim() || "",
  },
  wifi: {
    label: "WiFi",
    fields: [
      ["ssid", "Network name (SSID)", "MyHomeWiFi"],
      ["pass", "Password (leave empty for an open network)", "password"],
    ],
    build: (f) =>
      f.ssid?.trim() ? `WIFI:T:${f.pass ? "WPA" : "nopass"};S:${esc(f.ssid)};P:${esc(f.pass || "")};;` : "",
  },
  whatsapp: {
    label: "WhatsApp",
    fields: [
      ["wa", "WhatsApp number with country code", "919876543210"],
      ["message", "Pre-filled message (optional)", "Hi, I'd like to know more"],
    ],
    build: (f) => {
      const n = f.wa?.replace(/\D/g, "");
      return n ? `https://wa.me/${n}${f.message ? `?text=${enc(f.message)}` : ""}` : "";
    },
  },
  vcard: {
    label: "Contact (vCard)",
    fields: [
      ["name", "Full name", "Rahul Sharma"],
      ["phone", "Phone", "+919876543210"],
      ["email", "Email", "rahul@example.com"],
      ["org", "Company", "Ganivotech"],
      ["site", "Website", "https://ganivotech.com"],
    ],
    build: (f) => {
      if (!f.name?.trim()) return "";
      const [first, ...rest] = f.name.trim().split(" ");
      return [
        "BEGIN:VCARD", "VERSION:3.0",
        `N:${rest.join(" ")};${first};;;`, `FN:${f.name.trim()}`,
        f.org && `ORG:${f.org}`, f.phone && `TEL;TYPE=CELL:${f.phone}`,
        f.email && `EMAIL:${f.email}`, f.site && `URL:${f.site}`, "END:VCARD",
      ].filter(Boolean).join("\n");
    },
  },
  email: {
    label: "Email",
    fields: [
      ["to", "Email address", "hello@example.com"],
      ["subject", "Subject (optional)", "Enquiry"],
      ["body", "Message (optional)", "Hello,", "textarea"],
    ],
    build: (f) => {
      if (!f.to?.trim()) return "";
      const q = [f.subject && `subject=${enc(f.subject)}`, f.body && `body=${enc(f.body)}`].filter(Boolean).join("&");
      return `mailto:${f.to.trim()}${q ? `?${q}` : ""}`;
    },
  },
  phone: {
    label: "Phone",
    fields: [["tel", "Phone number", "+919876543210"]],
    build: (f) => (f.tel?.trim() ? `tel:${f.tel.replace(/[^\d+]/g, "")}` : ""),
  },
  sms: {
    label: "SMS",
    fields: [
      ["smsNum", "Phone number", "+919876543210"],
      ["smsMsg", "Message (optional)", "Hello", "textarea"],
    ],
    build: (f) => (f.smsNum?.trim() ? `SMSTO:${f.smsNum.replace(/[^\d+]/g, "")}:${f.smsMsg || ""}` : ""),
  },
  location: {
    label: "Location",
    fields: [["place", "Search a place, school, shop or address", "India Gate, New Delhi", "place"]],
    build: (f) =>
      f.latlng
        ? `https://www.google.com/maps/search/?api=1&query=${f.latlng}`
        : f.place?.trim()
          ? `https://www.google.com/maps/search/?api=1&query=${enc(f.place.trim())}`
          : "",
  },
  event: {
    label: "Event",
    fields: [
      ["title", "Event title", "Annual Day"],
      ["start", "Starts", "", "datetime-local"],
      ["end", "Ends (optional)", "", "datetime-local"],
      ["where", "Venue (optional)", "School Auditorium"],
      ["about", "Details (optional)", "", "textarea"],
    ],
    build: (f) =>
      f.title?.trim() && f.start
        ? [
            "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
            `SUMMARY:${f.title.trim()}`, `DTSTART:${icsDate(f.start)}`,
            f.end && `DTEND:${icsDate(f.end)}`,
            f.where && `LOCATION:${f.where}`,
            f.about && `DESCRIPTION:${f.about.replace(/\n/g, "\\n")}`,
            "END:VEVENT", "END:VCALENDAR",
          ].filter(Boolean).join("\n")
        : "",
  },
  upi: {
    label: "UPI Payment",
    fields: [
      ["vpa", "UPI ID", "name@okbank"],
      ["payee", "Payee name (optional)", "Ganivotech"],
      ["amount", "Amount in INR (optional)", "499", "number"],
      ["note", "Note (optional)", "Invoice 101"],
    ],
    build: (f) =>
      f.vpa?.trim()
        ? `upi://pay?pa=${f.vpa.trim()}${f.payee ? `&pn=${enc(f.payee)}` : ""}${f.amount ? `&am=${f.amount}` : ""}&cu=INR${f.note ? `&tn=${enc(f.note)}` : ""}`
        : "",
  },
};

export const typeHref = (id) => (id === "url" ? "/tools/qr-generator" : `/tools/qr-generator/${id}`);
