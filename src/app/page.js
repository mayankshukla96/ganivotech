import HomePage from "@/components/HomePage";

const TITLE = "Ganivotech: IT Solutions, Software & Apps, plus Free Tools";
const DESC =
  "Your business is yours, IT is ours. Ganivotech, Jaipur builds school transport ERP, custom software, apps and websites, and offers free QR, PDF and photo tools.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESC, url: "/" },
};

export default function Page() {
  return <HomePage />;
}
