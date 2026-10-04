"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOOLS } from "@/lib/tools-content";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { label: "Free Tools", menu: true },
  { href: "/extensions", label: "Extensions" },
  { href: "/contact", label: "Contact" },
];

const linkCls = "text-sm font-medium text-muted hover:text-primary transition-colors";

function ToolsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)} className={`${linkCls} flex items-center gap-1`}>
        Free Tools
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-3 w-80">
          <div className="rounded-xl border border-border bg-background shadow-lg p-2">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-primary/10">
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block text-xs text-muted">{t.blurb}</span>
              </Link>
            ))}
            <Link href="/tools" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">See all free tools</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
                <ToolsMenu key="tools" />
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
            <div className="px-4 py-4 space-y-3">
              {links.map((link) =>
                link.menu ? (
                  <div key="tools" className="py-1">
                    <Link href="/tools" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-foreground py-2">Free Tools</Link>
                    <div className="ml-3 border-l border-border pl-3 space-y-1">
                      {TOOLS.map((t) => (
                        <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)} className="block text-sm text-muted hover:text-primary transition-colors py-1.5">
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>
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
