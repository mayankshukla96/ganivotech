import WorkWithUs from "@/components/WorkWithUs";

const TITLE = "Ganivotech Blog – IT Tips, Guides and Tutorials";
const DESC = "Practical IT tips, how-to guides and tutorials from the Ganivotech team, including guides on QR codes and everyday tech tools.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/blog" },
  openGraph: { title: TITLE, description: DESC, url: "/blog" },
};

export default function Layout({ children }) {
  return (
    <>
      {children}
      <WorkWithUs />
    </>
  );
}
