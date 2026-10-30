// What Ganivotech builds. Used by the home page, the Clients page and the sitemap.
export const PORTAL = "https://transport.gccab.in"; // where schools, parents, drivers and teachers sign in to the GoConnect system

export const SOLUTIONS = [
  { slug: "school-transport-erp", href: "/solutions/school-transport-erp", title: "School Transport ERP", text: "Live bus tracking, route planning, fee collection and parent, driver and admin apps on one platform.", featured: true },
  { href: "/contact", title: "ERP and business software", text: "Custom systems for orders, stock, billing, staff and reports, built around how your business really works." },
  { href: "/services", title: "Mobile apps", text: "Android and iOS apps for your customers, your staff or your drivers." },
  { href: "/services", title: "Websites and web apps", text: "Fast business websites, online stores and booking systems that people can find on Google." },
  { href: "/services", title: "Dashboards and automation", text: "Admin panels, reports, WhatsApp and SMS alerts, so routine work does itself." },
  { href: "/products/digital-desk", title: "Managed IT (Digital Desk)", text: "Monthly IT care for small offices: backups, security, devices and a person to call." },
];

export const TRANSPORT_FEATURES = [
  ["AI route planning", "Smart, efficient routes for every bus."],
  ["Fee management", "Online payments and reminders."],
  ["Parent app", "Live tracking and updates for parents."],
  ["Driver app", "Routes, tracking and attendance."],
  ["Admin dashboard", "Complete control and reports."],
  ["Automation", "Smart alerts and issue management."],
  ["Multi-channel communication", "WhatsApp, SMS, email and app."],
  ["Fleet monitoring", "Live tracking and reports."],
];

// Happy clients shown on the home page and the Clients page. To add one, add a line here.
// name: client name. what: what we built for them. href: where to read more (optional).
export const CLIENTS = [
  { name: "GoConnect", tag: "Transport app", what: "School transport ERP: live bus tracking, route planning, fee management, parent and driver apps.", href: "/solutions/school-transport-erp" },
  { name: "Aravali Sports Academy", tag: "Sports academy, Jaipur", what: "Website with admissions, programs, gallery and an admin login for a sports coaching academy in Jaipur.", href: "https://www.aravalisport.com", external: true },
];
