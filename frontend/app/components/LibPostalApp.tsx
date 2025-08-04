"use client";

import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { DemoSection } from "./DemoSection";
import { DocumentationSection } from "./DocumentationSection";
import { Footer } from "./Footer";

export function LibPostalApp() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navigation />
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection />
          <DemoSection />
          <DocumentationSection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
