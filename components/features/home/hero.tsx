"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function Hero({
  headline = "Premium E-Commerce Experience",
  subheadline = "Discover our curated collection of high-quality products. Designed for excellence, built for you.",
  ctaText = "Shop Now",
  ctaHref = "/products",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-2xl md:text-4xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-sm md:text-xl lg:text-2xl">
            {subheadline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex gap-4"
        >
          <Link href={ctaHref}>
            <Button
              size="lg"
              className="h-10 px-6 text-sm sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg rounded-full hover:scale-105 transition-transform"
            >
              {ctaText} <ArrowRight className="ml-2 h-4 w-4 lg:h-6 lg:w-6" />
            </Button>
          </Link>
          <Link href="/support">
            <Button
              variant="outline"
              size="lg"
              className="h-10 px-6 text-sm sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg rounded-full border-2 hover:bg-accent hover:scale-105 transition-all"
            >
              <Phone className="mr-2 h-4 w-4 lg:h-6 lg:w-6" />
              Hubungi Kami
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-10 blur-[100px] bg-primary rounded-full pointer-events-none" />
    </section>
  );
}
