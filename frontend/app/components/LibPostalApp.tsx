"use client";

import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { DemoSection } from "./DemoSection";
import { DocumentationSection } from "./DocumentationSection";
import { Footer } from "./Footer";
import { ThemeProvider } from "~/contexts/ThemeContext";

export function LibPostalApp() {
  return (
    <ThemeProvider>
      <div className="bg-background min-h-screen text-foreground">
        <Navigation />
        <main className="pt-16">
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
    </ThemeProvider>
  );
}
