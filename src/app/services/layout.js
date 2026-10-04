const TITLE = "IT Services – Web, App and Cloud Development | Ganivotech";
const DESC = "Web development, app development, cloud solutions and IT consulting from Ganivotech. See our services and how we work with your business.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/services" },
  openGraph: { title: TITLE, description: DESC, url: "/services" },
};

export default function Layout({ children }) {
  return children;
}
