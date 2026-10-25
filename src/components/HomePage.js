"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import HappyClients from "@/components/HappyClients";
import ToolFinder from "@/components/ToolFinder";
import { PORTAL, SOLUTIONS } from "@/lib/it-solutions";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible">
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
              IT solutions for every business
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your business is yours.{" "}
              <span className="gradient-text">IT is ours.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              We build the software, apps, websites and systems that run your business, and we stay with you after launch. You focus on your work; we take care of the technology.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">
                Tell us your problem
              </Link>
              <Link href="/clients" className="px-8 py-3.5 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">
                Our work and clients
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-6 text-sm text-muted">
              Already a client? <a href={PORTAL} rel="noopener" className="text-primary underline font-medium">Sign in to your portal</a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* IT solutions */}
      <section className="py-16 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">What we do</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">IT solutions for different needs</h2>
            <p className="text-muted max-w-2xl mx-auto">From a school&apos;s bus fleet to a shop&apos;s website, one team builds and looks after the technology.</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOLUTIONS.map((s) => (
              <li key={s.title}>
                <Link href={s.href} className={`block h-full rounded-2xl border p-6 bg-background transition-colors hover:border-primary ${s.featured ? "border-primary" : "border-border"}`}>
                  {s.featured && <span className="inline-block mb-3 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">Our own product</span>}
                  <span className="block text-lg font-bold mb-2">{s.title}</span>
                  <span className="block text-sm text-muted leading-relaxed">{s.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured work */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="mx-auto w-full max-w-sm rounded-3xl overflow-hidden border border-border bg-white shadow-sm order-last lg:order-first">
              <Image src="/solutions/school-transport-erp.jpg" alt="School Transport ERP with live bus tracking, fee management, parent and driver apps" width={1024} height={1536} className="w-full h-auto" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Our work</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">GoConnect: school transport on one platform</h2>
              <p className="text-muted leading-relaxed mb-5">We built a transport ERP for schools. Teachers, drivers and the transport office stop phoning each other; parents see where the bus is; fees, routes and alerts run from one dashboard.</p>
              <ul className="space-y-2 mb-8 text-muted">
                {["Live bus tracking and route planning", "Fee management with online payments and reminders", "Parent app, driver app and admin dashboard", "Alerts by WhatsApp, SMS, email and app"].map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-primary font-bold" aria-hidden="true">&#10003;</span>{t}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/solutions/school-transport-erp" className="px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">See School Transport ERP</Link>
                <Link href="/clients" className="px-6 py-3 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">All our work</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HappyClients />

      {/* Free tools */}
      <section className="py-16 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Free tools from our team</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">QR codes, PDFs and photos, free</h2>
            <p className="text-muted max-w-2xl mx-auto">No signup and nothing uploaded: everything runs in your browser, so your files stay on your device.</p>
          </div>
          <ToolFinder />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 sm:py-28 bg-surface overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
                Why Ganivotech
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Your Trusted Technology Partner
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                We combine technical expertise with a deep understanding of
                business to deliver solutions that drive real results. Our team
                stays ahead of the latest trends so you don&apos;t have to.
              </p>
              <div className="space-y-4">
                {[
                  "Expert team with diverse technology skills",
                  "Agile development with transparent communication",
                  "Scalable solutions that grow with your business",
                  "Ongoing support and maintenance",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square rounded-2xl gradient-bg p-[2px]">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                  <div className="text-center p-8">
                    <Image
                      src="/logo.jpg"
                      alt="Ganivotech"
                      width={120}
                      height={120}
                      className="mx-auto mb-6 object-contain"
                    />
                    <h3 className="text-2xl font-bold mb-2">
                      <span className="text-primary-dark">Ganivo</span>
                      <span className="text-secondary">tech</span>
                    </h3>
                    <p className="text-muted text-sm">
                      Innovation &middot; Quality &middot; Growth
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium products */}
      <section className="py-16 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-background p-8 sm:p-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-semibold">New: Premium Products</span>
              <h2 className="text-3xl font-bold mb-3">SellerSync OS</h2>
              <p className="font-semibold mb-2">Sell everywhere. Manage everything. One inventory.</p>
              <p className="text-muted leading-relaxed mb-6">A multichannel stock and order system for sellers on Amazon, Flipkart and Meesho. One central stock figure, shared with every channel. Pilot sellers welcome.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products/sellersync-os" className="px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">See SellerSync OS</Link>
                <Link href="/products" className="px-6 py-3 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">All premium products</Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 text-center" aria-hidden="true">
              <p className="text-xs font-semibold tracking-widest text-muted mb-2">CENTRAL STOCK</p>
              <p className="text-5xl font-bold text-primary-dark mb-3">11</p>
              <div className="grid grid-cols-3 gap-2 text-xs">{["Amazon", "Flipkart", "Meesho"].map((m) => <div key={m} className="rounded-lg border border-border bg-background py-2"><span className="block text-muted">{m}</span><strong>11</strong></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-3xl gradient-bg p-12 sm:p-16 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Let&apos;s discuss how Ganivotech can help you achieve your
              technology goals. Get in touch today.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 rounded-xl bg-white text-primary-dark font-semibold hover:bg-white/90 transition-colors"
            >
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
