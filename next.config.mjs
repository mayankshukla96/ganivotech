// What pages on this site are allowed to load and where they may send data. The tools promise that files stay on the
// device, and this makes the browser enforce it: a page can only talk to this site, the OCR engine's CDN and the map search.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.jsdelivr.net", // Next.js inlines page data; OCR loads its engine from jsDelivr
  "worker-src 'self' blob:",
  "connect-src 'self' blob: data: https://cdn.jsdelivr.net https://photon.komoot.io",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  // the development server needs eval and a websocket for hot reload, so the policy is only sent in production
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // the *.vercel.app copy of the site must not compete with ganivotech.com in search results
      { source: "/:path*", has: [{ type: "host", value: "ganivotech.vercel.app" }], destination: "https://ganivotech.com/:path*", permanent: true },
      // the URL generator is the main page; avoid a duplicate /url page
      { source: "/tools/qr-generator/url", destination: "/tools/qr-generator", permanent: true },
      // retired tool
      { source: "/worksheet", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
