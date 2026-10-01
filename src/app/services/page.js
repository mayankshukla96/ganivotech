"use client";

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
    description: "We build fast, responsive, and SEO-friendly websites and web applications using modern frameworks like React, Next.js, and Node.js.",
    features: ["Custom Website Design", "E-commerce Solutions", "Progressive Web Apps", "API Development"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "App Development",
    description: "Native and cross-platform mobile applications for iOS and Android that deliver smooth performance and great user experiences.",
    features: ["iOS & Android Apps", "Cross-Platform (React Native)", "UI/UX Design", "App Store Optimization"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Cloud & DevOps",
    description: "Scalable cloud infrastructure and CI/CD pipelines that keep your applications running smoothly and deploying with confidence.",
    features: ["AWS / Azure / GCP", "CI/CD Pipelines", "Docker & Kubernetes", "Server Monitoring"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "IT Consulting",
    description: "Strategic technology guidance to help you make the right decisions, reduce costs, and stay ahead of the competition.",
    features: ["Technology Audits", "Digital Strategy", "System Architecture", "Vendor Selection"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Cybersecurity",
    description: "Protect your business with comprehensive security assessments, monitoring, and implementation of best practices.",
    features: ["Security Audits", "Penetration Testing", "Data Protection", "Compliance"],
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "Database Solutions",
    description: "Design, optimization, and management of databases to ensure your data is secure, accessible, and performing at its best.",
    features: ["Database Design", "Performance Tuning", "Data Migration", "Backup & Recovery"],
  },
];

const process = [
  { step: "01", title: "Discovery", description: "We understand your business, goals, and technical requirements." },
  { step: "02", title: "Planning", description: "We create a detailed roadmap with timelines and deliverables." },
  { step: "03", title: "Development", description: "Our team builds your solution with agile methodology." },
  { step: "04", title: "Delivery", description: "We deploy, test, and provide ongoing support." },
];

export default function Services() {
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
              Our Services
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              IT Solutions That{" "}
              <span className="gradient-text">Drive Results</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              From web development to cloud infrastructure, we provide
              comprehensive IT services to help your business succeed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                className="p-8 rounded-2xl border border-border bg-surface hover:border-primary/30 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              How We Work
            </p>
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-muted max-w-2xl mx-auto">
              A proven approach that delivers results on time and within budget.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-bold gradient-text mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-3xl gradient-bg p-12 sm:p-16 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Every business is unique. Let&apos;s discuss your specific
              requirements and build something great together.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 rounded-xl bg-white text-primary-dark font-semibold hover:bg-white/90 transition-colors"
            >
              Get a Free Quote
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
