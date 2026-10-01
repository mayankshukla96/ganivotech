"use client";

import { motion } from "framer-motion";

const team = [
  {
    name: "Founder",
    role: "CEO & Lead Developer",
    bio: "Passionate about using technology to solve real-world business problems.",
  },
  {
    name: "Tech Lead",
    role: "Full-Stack Developer",
    bio: "Expert in building scalable web and mobile applications.",
  },
  {
    name: "Designer",
    role: "UI/UX Designer",
    bio: "Creating intuitive and beautiful user experiences.",
  },
];

const values = [
  {
    title: "Innovation",
    description: "We stay ahead of the curve, embracing new technologies to deliver cutting-edge solutions.",
    color: "text-primary",
  },
  {
    title: "Quality",
    description: "Every line of code we write meets the highest standards of quality and performance.",
    color: "text-secondary",
  },
  {
    title: "Transparency",
    description: "Clear communication and honest collaboration are at the heart of everything we do.",
    color: "text-accent",
  },
  {
    title: "Growth",
    description: "We are committed to the continuous growth of our team, clients, and the communities we serve.",
    color: "text-primary",
  },
];

export default function About() {
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
              About Us
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              We Are <span className="gradient-text">Ganivotech</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              A passionate IT startup on a mission to empower businesses with
              smart, reliable, and affordable technology solutions. We believe
              technology should work for you, not the other way around.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Ganivotech was founded with a simple idea: make great technology
                  accessible to every business, regardless of size or budget.
                </p>
                <p>
                  Starting as a small team of passionate developers, we have grown
                  into a full-service IT company offering everything from web
                  development to cloud solutions and IT consulting.
                </p>
                <p>
                  Today, we continue to push boundaries, helping our clients
                  navigate the digital landscape with confidence and clarity.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {values.map((value, i) => (
                <div
                  key={value.title}
                  className="p-5 rounded-xl border border-border bg-background"
                >
                  <h3 className={`font-semibold mb-2 ${value.color}`}>{value.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="p-8 rounded-2xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted leading-relaxed">
                To deliver innovative, reliable, and cost-effective IT solutions
                that help businesses thrive in the digital age. We are committed
                to making technology simple and accessible for everyone.
              </p>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-muted leading-relaxed">
                To become a leading IT solutions provider recognized for innovation,
                quality, and client satisfaction. We envision a world where every
                business has access to world-class technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Our Team
            </p>
            <h2 className="text-3xl font-bold mb-4">Meet the People Behind Ganivotech</h2>
            <p className="text-muted max-w-2xl mx-auto">
              A dedicated team of professionals passionate about technology and
              committed to your success.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.role}
                className="text-center p-6 rounded-2xl border border-border bg-background"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name[0]}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-xs text-muted">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
