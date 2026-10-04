const TITLE = "Contact Ganivotech – Get a Free IT Consultation";
const DESC = "Get in touch with Ganivotech for IT solutions, web and app development, or questions about our free tools. We reply to every message.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/contact" },
  openGraph: { title: TITLE, description: DESC, url: "/contact" },
};

export default function Layout({ children }) {
  return children;
}
