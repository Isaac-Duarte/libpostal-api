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
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-700">
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
            <p className="text-gray-400">
              Free address parsing and normalization API powered by libpostal.
              Built with Rust for high performance and reliability.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/docs" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("demo")}
                  className="hover:text-white transition-colors text-left"
                >
                  Interactive Demo
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/Isaac-Duarte/libpostal-rs"
                  className="hover:text-white transition-colors"
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
            <p className="text-gray-400">
              This service is provided free of charge. Built with libpostal-rs,
              a Rust wrapper for the libpostal C library.
            </p>
          </div>
        </motion.div>
        <motion.div 
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
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
