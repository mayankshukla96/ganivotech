// Premium products catalog. Add an entry and it appears in the menu, hub, footer and sitemap.
export const PRODUCTS = {
  "sellersync-os": {
    name: "SellerSync OS",
    tagline: "One inventory for every marketplace.",
    blurb: "A multi-channel stock and order system for sellers on Amazon, Flipkart and Meesho. One central stock figure, shared with every channel.",
    status: "Pilot open",
    href: "/products/sellersync-os",
  },
  "digital-desk": {
    name: "Digital Desk",
    tagline: "Your IT and digital department, for a fixed monthly fee.",
    blurb: "A managed plan where Ganivotech sets up and looks after your website, email, WhatsApp, security and software, so you don't have to.",
    status: "Taking first clients",
    href: "/products/digital-desk",
  },
};

export const PRODUCT_LIST = Object.entries(PRODUCTS).map(([slug, p]) => ({ slug, ...p }));
