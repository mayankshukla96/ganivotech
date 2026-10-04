const TITLE = "Free VCF Maker – Convert CSV Contacts to VCF File | GanivoTech";
const DESC = "Turn a CSV or Excel contact list into one VCF file and import all contacts into Android or iPhone at once. Free, runs in your browser, no signup.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/tools/vcf-maker" },
  openGraph: { title: TITLE, description: DESC, url: "/tools/vcf-maker", images: ["/logo.jpg"] },
};

export default function Layout({ children }) {
  return children;
}
