"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "hello@ganivotech.com",
    href: "mailto:hello@ganivotech.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Location",
    value: "India",
    href: null,
  },
];

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", subject: "", service: "", message: "", website: "" });
  const [st, setSt] = useState({ busy: false, ok: false, err: "" });
  const on = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSt({ busy: true, ok: false, err: "" });
    try {
      const message = [f.subject && `Subject: ${f.subject}`, f.service && `Service: ${f.service}`, f.message].filter(Boolean).join("\n");
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "contact", name: f.name, email: f.email, message, website: f.website }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "Could not send. Please try again.");
      setSt({ busy: false, ok: true, err: "" });
      setF({ name: "", email: "", subject: "", service: "", message: "", website: "" });
    } catch (x) {
      setSt({ busy: false, ok: false, err: x.message });
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Contact Us
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Let&apos;s <span className="gradient-text">Work Together</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              Have a project in mind? Want to learn more about our services?
              We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-8 rounded-2xl border border-border bg-surface">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={submit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className="block text-sm font-medium mb-2">Full Name *</label>
                      <input id="c-name" type="text" required autoComplete="name" value={f.name} onChange={on("name")} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="c-email" className="block text-sm font-medium mb-2">Email *</label>
                      <input id="c-email" type="email" required autoComplete="email" value={f.email} onChange={on("email")} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-subject" className="block text-sm font-medium mb-2">Subject</label>
                    <input id="c-subject" type="text" value={f.subject} onChange={on("subject")} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="c-service" className="block text-sm font-medium mb-2">Service Interested In</label>
                    <select id="c-service" value={f.service} onChange={on("service")} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors">
                      <option value="">Select a service</option>
                      <option value="web">Web Development</option>
                      <option value="app">App Development</option>
                      <option value="cloud">Cloud & DevOps</option>
                      <option value="consulting">IT Consulting</option>
                      <option value="security">Cybersecurity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="block text-sm font-medium mb-2">Message *</label>
                    <textarea id="c-message" rows={5} required value={f.message} onChange={on("message")} placeholder="Tell us about your project..." className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
                  </div>
                  <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={on("website")} /></label></div>
                  {st.err && <p role="alert" className="text-sm text-red-600">{st.err}</p>}
                  {st.ok && <p role="status" className="text-sm font-semibold text-green-700">Thank you! We have your message and will reply soon.</p>}
                  <button
                    type="submit"
                    disabled={st.busy}
                    className="w-full px-8 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {st.busy ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="p-6 rounded-2xl border border-border bg-surface"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.label}</h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-sm text-muted hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-muted">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-6 rounded-2xl gradient-bg text-white">
                  <h3 className="font-semibold text-lg mb-2">
                    Free Consultation
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    Not sure what you need? Book a free 30-minute consultation
                    and we&apos;ll help you find the right solution.
                  </p>
                  <button className="px-6 py-2.5 rounded-xl bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors">
                    Book a Call
                  </button>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-surface">
                  <h3 className="font-semibold mb-3">Follow Us</h3>
                  <div className="flex items-center gap-3">
                    {["LinkedIn", "Twitter", "GitHub", "Instagram"].map(
                      (social) => (
                        <a
                          key={social}
                          href="#"
                          className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-colors text-xs font-semibold"
                        >
                          {social[0] + social[1]}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
