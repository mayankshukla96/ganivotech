import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/seo";
import Analytics from "@/components/Analytics";
import { SITE } from "@/lib/qr-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Ganivotech - IT Solutions & Technology Partner",
  description:
    "Ganivotech provides innovative IT solutions, web development, app development, cloud services, and expert IT tips for businesses.",
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
  openGraph: { siteName: "Ganivotech", locale: "en_IN", type: "website", images: ["/logo.jpg"] },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

const orgSchema = [
  { "@context": "https://schema.org", "@type": "Organization", name: "Ganivotech", url: SITE, logo: `${SITE}/logo.jpg` },
  { "@context": "https://schema.org", "@type": "WebSite", name: "Ganivotech", url: SITE },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {orgSchema.map((s) => (
          <JsonLd key={s["@type"]} data={s} />
        ))}
        <Analytics />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
