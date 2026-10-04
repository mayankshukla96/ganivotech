// Premium products catalog. Add an entry and it appears in the menu, hub, footer and sitemap.
export const PRODUCTS = {
  "sellersync-os": {
    name: "SellerSync OS",
    tagline: "One inventory for every marketplace.",
    blurb: "A multi-channel stock and order system for sellers on Amazon, Flipkart and Meesho. One central stock figure, shared with every channel.",
    status: "Pilot open",
    href: "/products/sellersync-os",
  },
};

export const PRODUCT_LIST = Object.entries(PRODUCTS).map(([slug, p]) => ({ slug, ...p }));
