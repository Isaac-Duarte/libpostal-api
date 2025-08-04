"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary to-background" />

      <div className="relative py-20 text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Free Address Parsing API
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Parse and normalize addresses from around the world with high
            accuracy. Powered by libpostal, completely free to use.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("demo")}
              className="glass-effect"
            >
              Try the Demo
            </Button>
            <Button size="lg" onClick={() => scrollToSection("docs")}>
              View API Docs
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="glass-effect p-6">
              <div className="text-3xl text-foreground font-bold mb-2">
                Free
              </div>
              <div className="text-muted-foreground">No API Keys Required</div>
            </Card>
            <Card className="glass-effect p-6">
              <div className="text-3xl font-bold mb-2">Global</div>
              <div className="text-muted-foreground">
                Worldwide Address Support
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
