import HomePage from "@/components/HomePage";

const TITLE = "Ganivotech – IT Solutions, Web & App Development, Free Tools";
const DESC =
  "Ganivotech builds web and mobile apps, cloud and IT solutions for businesses, and offers free tools including a QR code generator, VCF maker and PDF maker.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESC, url: "/" },
};

export default function Page() {
  return <HomePage />;
}
