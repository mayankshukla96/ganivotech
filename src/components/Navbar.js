"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOOLS, TOOL_GROUPS } from "@/lib/tools-content";
import { PRODUCT_LIST } from "@/lib/products";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { label: "Free Tools", menu: "tools" },
  { label: "Premium", menu: "premium" },
  { href: "/extensions", label: "Extensions" },
  { href: "/contact", label: "Contact" },
];

const linkCls = "text-sm font-medium text-muted hover:text-primary transition-colors";

const MENUS = {
  tools: {
    label: "Free Tools",
    items: TOOLS.map((t) => ({ href: t.href, name: t.name, blurb: t.blurb, group: t.group })),
    groups: TOOL_GROUPS,
    all: { href: "/tools", label: "See all free tools" },
  },
  premium: {
    label: "Premium",
    items: PRODUCT_LIST.map((p) => ({ href: p.href, name: p.name, blurb: p.tagline })),
    all: { href: "/products", label: "See all premium products" },
  },
};

function DropMenu({ menu }) {
  const [open, setOpen] = useState(false);
  const m = MENUS[menu];
  const wide = !!m.groups;
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)} className={`${linkCls} flex items-center gap-1`}>
        {m.label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        // a long list (the free tools) is shown in two columns so it fits on the screen; it scrolls on short screens
        <div className={`absolute top-full pt-3 ${wide ? "left-1/2 -translate-x-1/2 w-[min(46rem,calc(100vw-2rem))]" : "left-0 w-80"}`}>
          <div className="rounded-xl border border-border bg-background shadow-lg p-2 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {wide ? (
              <div className="grid grid-cols-3 gap-x-2 px-1 pt-1">
                {m.groups.map(([g, heading]) => (
                  <div key={g}>
                    <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{heading}</p>
                    {m.items.filter((t) => t.group === g).map((t) => (
                      <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary">{t.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              m.items.map((t) => (
                <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-primary/10">
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted">{t.blurb}</span>
                </Link>
              ))
            )}
            <Link href={m.all.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">{m.all.label}</Link>
          </div>
        </div>
      )}
    </div>
  );
}

// A tap-to-expand section of the phone menu, with the tools under their headings.
function MobileSection({ m, open, onToggle, close }) {
  const item = (t) => <Link key={t.href} href={t.href} onClick={close} className="block text-sm text-muted hover:text-primary transition-colors py-1.5">{t.name}</Link>;
  return (
    <div className="border-b border-border/60 pb-1">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between text-sm font-semibold text-foreground py-2">
        {m.label}
        <svg className={`w-4 h-4 text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="pb-2">
          {m.groups ? (
            m.groups.map(([g, heading]) => (
              <div key={g} className="mt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-0.5">{heading}</p>
                <div className="ml-2 border-l border-border pl-3">{m.items.filter((t) => t.group === g).map(item)}</div>
              </div>
            ))
          ) : (
            <div className="ml-2 border-l border-border pl-3">{m.items.map(item)}</div>
          )}
          <Link href={m.all.href} onClick={close} className="block text-sm font-semibold text-primary py-2 mt-1">{m.all.label} &rarr;</Link>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(""); // which menu section is open on a phone
  const [admin, setAdmin] = useState(false);

  // the Analytics link is shown only to the signed-in owner
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setAdmin(!!d.admin))
      .catch(() => {});
  }, []);

  const links = admin ? [...navLinks, { href: "/admin/analytics", label: "Analytics" }] : navLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Ganivotech"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary-dark">Ganivo</span>
              <span className="text-secondary">tech</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-6">
            {links.map((link) =>
              link.menu ? (
                <DropMenu key={link.menu} menu={link.menu} />
              ) : (
                <Link key={link.href} href={link.href} className={linkCls}>
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/contact"
              className="px-5 py-2 rounded-lg gradient-bg-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 text-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
              {links.map((link) =>
                link.menu ? (
                  <MobileSection key={link.menu} m={MENUS[link.menu]} open={expanded === link.menu} onToggle={() => setExpanded(expanded === link.menu ? "" : link.menu)} close={() => setMobileOpen(false)} />
                ) : (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted hover:text-primary transition-colors py-2">
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-2.5 rounded-lg gradient-bg-orange text-white text-sm font-semibold"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
