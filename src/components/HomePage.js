"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with cutting-edge technologies.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "App Development",
    description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure, migration, and DevOps to power your business operations.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "IT Consulting",
    description: "Strategic IT guidance to help you make informed technology decisions for your business.",
  },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "24/7", label: "Support" },
];

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-primary uppercase tracking-widest mb-4"
            >
              Welcome to Ganivotech
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Building the Future with{" "}
              <span className="gradient-text">Smart IT Solutions</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-muted leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              We help businesses grow with innovative technology solutions, expert
              consulting, and practical IT tips that make a real difference.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Start Your Project
              </Link>
              <Link
                href="/services"
                className="px-8 py-3.5 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Our Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              From concept to deployment, we deliver end-to-end IT solutions
              tailored to your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                className="p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
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

      {/* Free tools */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-4 rounded-full bg-accent/10 text-accent text-xs font-semibold">New: Free Tool</span>
              <h2 className="text-3xl font-bold mb-3">Short Link Maker</h2>
              <p className="font-semibold mb-2">Short links with your own name.</p>
              <p className="text-muted leading-relaxed mb-6">Turn a long web address into something like ganivotech.com/go/diwali-offer. Pick a name style, get a QR code, make WhatsApp chat links and see how many people clicked. Free, no signup.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tools/short-link-maker" className="px-6 py-3 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity">Make a short link</Link>
                <Link href="/tools" className="px-6 py-3 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors">All free tools</Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5 text-center" aria-hidden="true">
              <p className="text-xs text-muted mb-1 break-all">https://shop.example.in/offers/festival/sweets-box?utm_source=whatsapp&amp;ref=12345</p>
              <p className="text-2xl text-muted mb-1">&darr;</p>
              <p className="text-sm sm:text-lg font-bold text-primary break-all">ganivotech.com/go/diwali-offer</p>
            </div>
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
