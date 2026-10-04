import { SITE } from "@/lib/qr-content";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
