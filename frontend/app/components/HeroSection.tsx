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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-gray-800 to-gray-900" />
      
      <div className="relative py-20 text-white">
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
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto"
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
              className="glass-effect border-white/20 text-white hover:bg-white/10"
            >
              Try the Demo
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToSection("docs")}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/50"
            >
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
            <Card className="glass-effect border-white/20 bg-white/10 p-6">
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-gray-300">No API Keys Required</div>
            </Card>
            <Card className="glass-effect border-white/20 bg-white/10 p-6">
              <div className="text-3xl font-bold mb-2">Global</div>
              <div className="text-gray-300">Worldwide Address Support</div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
