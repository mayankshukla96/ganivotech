import { JsonLd, appSchema, faqSchema } from "@/components/seo";
import { PDF_FAQS } from "@/lib/pdf-content";

const TITLE = "Free PDF Maker – Convert Images and Text to PDF | GanivoTech";
const DESC = "Combine images and text files into one PDF. Free, private (runs in your browser), no signup.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/tools/pdf-maker" },
  openGraph: { title: TITLE, description: DESC, url: "/tools/pdf-maker", images: ["/logo.jpg"] },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd data={appSchema("GanivoTech Free PDF Maker", "/tools/pdf-maker", DESC)} />
      <JsonLd data={faqSchema(PDF_FAQS)} />
      {children}
    </>
  );
}
