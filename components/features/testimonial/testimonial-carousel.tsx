"use client";

import { useEffect, useRef } from "react";
import { TestimonialCard } from "./testimonial-card";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  message: string;
  date: Date;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldScroll = testimonials.length > 3;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || testimonials.length === 0 || !shouldScroll) return;

    let scrollPosition = 0; // ... rest of effect
    const scrollSpeed = 0.5; // pixels per frame
    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollPosition += scrollSpeed;

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [testimonials.length, shouldScroll]);

  const displayTestimonials = shouldScroll
    ? [...testimonials, ...testimonials]
    : testimonials;

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-4 overflow-x-hidden scroll-smooth",
          !shouldScroll && "justify-center flex-wrap",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className="flex-shrink-0 w-80"
          >
            <TestimonialCard
              name={testimonial.name}
              rating={testimonial.rating}
              message={testimonial.message}
              date={testimonial.date}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
