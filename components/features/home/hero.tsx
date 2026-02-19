"use client";

import { motion, TargetAndTransition } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface HeroProduct {
  id: string;
  name: string;
  image?: string | null;
  price?: number;
  slug?: string;
}

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  products?: HeroProduct[];
}

const currentYear = new Date().getFullYear();

export function Hero(props: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-background text-foreground animate-in fade-in duration-500">
      {/* Mobile Wrapper: Keep min-h: 560px for consistency, but adjust button placement */}
      <div className="block md:hidden h-[100dvh] min-h-[560px] relative w-full overflow-hidden">
        <MobileLayout {...props} />
      </div>

      <div className="hidden md:block lg:hidden h-[100dvh] min-h-[660px] relative w-full overflow-hidden">
        <TabletLayout {...props} />
      </div>

      <div className="hidden lg:block h-[100dvh] min-h-[700px] relative w-full overflow-hidden">
        <DesktopLayout {...props} />
      </div>
    </section>
  );
}

function MobileLayout({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  products = [],
}: HeroProps) {
  const dp = products.slice(0, 3);

  const configs = [
    { top: "8dvh", left: "6%", width: "18dvh", height: "18dvh", z: 10 },
    { top: "22dvh", right: "5%", width: "22dvh", height: "22dvh", z: 5 },
    { top: "58dvh", right: "8%", width: "16dvh", height: "16dvh", z: 15 },
  ];

  return (
    <>
      {dp.map((product, i) => (
        <FloatingCircle
          key={product.id}
          product={product}
          style={configs[i]}
          animIndex={i}
        />
      ))}

      <div
        className="absolute z-20 left-0 px-6 w-full max-w-[65%]"
        style={{ top: "28dvh" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <Badge />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter leading-[1.1] drop-shadow-md pr-4">
            {headline || "Redefining Modern Lifestyle"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {subheadline}
          </p>
        </motion.div>
      </div>

      {/* CTA Button: RESTORED to 'bottom: 12dvh' to avoid being cut off by browser address bar/safe area. */}
      {/* The reduced 'min-h: 560px' above will still minimize the 'gap' to the next section correctly. */}
      <div className="absolute z-20 left-6 right-6" style={{ bottom: "12dvh" }}>
        <CTAButton text={ctaText} href={ctaHref} />
      </div>
    </>
  );
}

function TabletLayout({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  products = [],
}: HeroProps) {
  const dp = products.slice(0, 3);

  const tabletConfigs = [
    { top: "15%", right: "20%", width: "160px", height: "160px", z: 10 },
    { top: "30%", right: "0%", width: "280px", height: "280px", z: 5 },
    { bottom: "15%", right: "10%", width: "140px", height: "140px", z: 15 },
  ];

  return (
    <div className="flex w-full h-full relative">
      <div className="w-[55%] h-full flex flex-col justify-center px-8 pl-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <Badge />
          <h1 className="text-5xl font-extrabold tracking-tighter leading-[1.1] text-foreground w-full">
            {headline || "Redefining Modern Lifestyle"}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            {subheadline}
          </p>
          <div className="pt-4">
            <CTAButton text={ctaText} href={ctaHref} />
          </div>
        </motion.div>
      </div>

      <div className="w-[45%] h-full relative z-10">
        {dp.map((product, i) => (
          <FloatingCircle
            key={product.id}
            product={product}
            style={tabletConfigs[i]}
            animIndex={i}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopLayout({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  products = [],
}: HeroProps) {
  const dp = products.slice(0, 3);

  const desktopConfigs = [
    { top: "15%", right: "30%", width: "240px", height: "240px", z: 10 },
    { top: "25%", right: "0%", width: "380px", height: "380px", z: 5 },
    { bottom: "15%", right: "20%", width: "200px", height: "200px", z: 15 },
  ];

  return (
    <div className="flex w-full h-full relative overflow-hidden">
      <div className="w-[45%] h-full flex flex-col justify-center pl-6 lg:pl-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <Badge />
          <h1 className="text-7xl xl:text-8xl 2xl:text-9xl font-extrabold tracking-tighter leading-[1] text-foreground w-full">
            {headline || "Redefining Modern Lifestyle"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            {subheadline}
          </p>
          <div className="pt-6">
            <CTAButton text={ctaText} href={ctaHref} size="lg" />
          </div>
        </motion.div>
      </div>

      <div className="w-[55%] h-full relative z-10">
        {dp.map((product, i) => (
          <FloatingCircle
            key={product.id}
            product={product}
            style={desktopConfigs[i]}
            animIndex={i}
          />
        ))}
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-secondary text-xs sm:text-sm font-medium tracking-wide uppercase text-secondary-foreground w-fit backdrop-blur-md shadow-sm">
      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
      New Collection {currentYear}
    </div>
  );
}

function CTAButton({
  text = "Shop Collection",
  href = "/products",
  size = "default",
}: {
  text?: string;
  href?: string;
  size?: "default" | "lg";
}) {
  const isLg = size === "lg";
  return (
    <Button
      asChild
      size={isLg ? "lg" : "default"}
      className={`${isLg ? "h-14 px-10 text-lg" : "h-12 px-8"} rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105`}
    >
      <Link href={href || "/products"}>
        {text || "Shop Collection"}{" "}
        <ShoppingBag className={`${isLg ? "ml-3 w-5 h-5" : "ml-2 w-4 h-4"}`} />
      </Link>
    </Button>
  );
}

interface FloatingStyle {
  width: string;
  height: string;
  z: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

function FloatingCircle({
  product,
  style,
  animIndex,
}: {
  product: HeroProduct;
  style: FloatingStyle;
  animIndex: number;
}) {
  const { width, height, z, ...pos } = style;

  const anims = [
    { y: [0, -15, 0], rotate: [-5, 5, -5], scale: [1, 1.02, 1] },
    { y: [0, 20, 0], rotate: [3, -3, 3], scale: [1, 1.05, 1] },
    { y: [0, -10, 0], rotate: [0, 10, 0], scale: [1, 1.02, 1] },
  ];

  const durations = [6, 8, 7];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: animIndex * 0.2 }}
      style={{
        position: "absolute",
        width,
        height,
        zIndex: z,
        ...pos,
      }}
      className="pointer-events-auto"
    >
      <motion.div
        animate={anims[animIndex]}
        transition={{
          duration: durations[animIndex],
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="w-full h-full"
      >
        <Link
          href={product.slug ? `/products/${product.slug}` : "#"}
          className="group block w-full h-full"
        >
          <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-br from-border/50 to-border/10 shadow-2xl backdrop-blur-sm">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-background border-4 border-background">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
