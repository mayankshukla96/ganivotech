import HomePage from "@/components/HomePage";

const TITLE = "Free QR, PDF & Photo Tools, plus Software Development | GanivoTech";
const DESC =
  "Free browser tools for QR codes, PDFs, passport and exam photos, short links and visiting cards. Ganivotech, Jaipur, also builds custom software, apps and websites.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESC, url: "/" },
};

export default function Page() {
  return <HomePage />;
}
