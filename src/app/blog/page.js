"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const posts = [
  {
    category: "Security",
    title: "10 Essential Cybersecurity Tips for Small Businesses",
    excerpt: "Protect your business from cyber threats with these practical security measures that every small business should implement today.",
    date: "Sep 25, 2026",
    readTime: "5 min read",
  },
  {
    category: "Cloud",
    title: "Getting Started with Cloud Computing: A Beginner's Guide",
    excerpt: "Learn the fundamentals of cloud computing and how it can transform your business operations and reduce IT costs.",
    date: "Sep 20, 2026",
    readTime: "7 min read",
  },
  {
    category: "Development",
    title: "Why Next.js is the Best Framework for Business Websites",
    excerpt: "Discover why top companies choose Next.js for their web applications and how it can benefit your business.",
    date: "Sep 15, 2026",
    readTime: "6 min read",
  },
  {
    category: "Tips",
    title: "5 Ways to Speed Up Your Website Performance",
    excerpt: "Simple yet effective techniques to make your website load faster and improve user experience and SEO rankings.",
    date: "Sep 10, 2026",
    readTime: "4 min read",
  },
  {
    category: "DevOps",
    title: "Introduction to CI/CD: Automate Your Deployments",
    excerpt: "Learn how continuous integration and delivery can streamline your development workflow and reduce deployment risks.",
    date: "Sep 5, 2026",
    readTime: "8 min read",
  },
  {
    category: "Tips",
    title: "Choosing the Right Tech Stack for Your Startup",
    excerpt: "A comprehensive guide to selecting the right technologies for your startup based on your goals, budget, and timeline.",
    date: "Sep 1, 2026",
    readTime: "6 min read",
  },
];

const categories = ["All", "Security", "Cloud", "Development", "Tips", "DevOps"];

export default function Blog() {
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
              Blog & IT Tips
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Insights & <span className="gradient-text">IT Tips</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              Stay updated with the latest technology trends, practical IT tips,
              and expert insights from the Ganivotech team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "gradient-bg text-white"
                    : "bg-surface border border-border text-muted hover:text-primary hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                className="rounded-2xl border border-border bg-surface overflow-hidden hover:border-primary/30 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="h-48 gradient-bg opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white/50 text-6xl font-bold">
                    {post.category[0]}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-light">{post.date}</span>
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      Read More &rarr;
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-muted mb-8">
              Subscribe to our newsletter for the latest IT tips, tutorials, and
              industry insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-6 py-3 rounded-xl gradient-bg-orange text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
