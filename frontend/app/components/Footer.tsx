"use client";

import { motion } from "framer-motion";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card text-card-foreground py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-lg font-semibold mb-4">LibPostal API</h3>
            <p className="text-muted-foreground">
              Free address parsing and normalization API powered by libpostal.
              Built with Rust for high performance and reliability.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a
                  href="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("demo")}
                  className="hover:text-foreground transition-colors text-left"
                >
                  Interactive Demo
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/Isaac-Duarte/libpostal-rs"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  libpostal-rs on GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-muted-foreground">
              This service is provided free of charge. Built with libpostal-rs,
              a Rust wrapper for the libpostal C library.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="border-t border-border mt-8 pt-8 text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 LibPostal API. Open source and free to use.</p>
        </motion.div>
      </div>
    </footer>
  );
}
