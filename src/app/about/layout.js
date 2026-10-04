const TITLE = "About Ganivotech – Our Story, Mission and Team";
const DESC = "Learn about Ganivotech, an IT startup building web and mobile solutions and free online tools for businesses, schools and individuals.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESC, url: "/about" },
};

export default function Layout({ children }) {
  return children;
}
