"use client";

import React, { useState } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { cn } from "@/lib/utils";

interface TestimonialData {
  name: string;
  institution: string;
  quote: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: TestimonialData[];
  className?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    if (!testimonials || testimonials.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials, isHovered]);

  // Helper to get visible slides on desktop (3 items centered around activeIndex)
  const getVisibleSlides = () => {
    const total = testimonials.length;
    if (total === 0) return [];
    if (total === 1) {
      return [{ data: testimonials[0], index: 0, position: "center" }];
    }
    if (total === 2) {
      const other = (activeIndex + 1) % 2;
      return [
        { data: testimonials[other], index: other, position: "left" },
        { data: testimonials[activeIndex], index: activeIndex, position: "center" },
      ];
    }
    
    const prev = (activeIndex - 1 + total) % total;
    const current = activeIndex;
    const next = (activeIndex + 1) % total;
    
    return [
      { data: testimonials[prev], index: prev, position: "left" },
      { data: testimonials[current], index: current, position: "center" },
      { data: testimonials[next], index: next, position: "right" },
    ];
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("w-full flex flex-col items-center gap-8", className)}
    >
      {/* Responsive testimonials grid (unified to render each card once without source code duplication) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch min-h-[300px]">
        {getVisibleSlides().map(({ data, index, position }) => {
          const isFeatured = position === "center";
          return (
            <div
              key={`testimonial-${position}-${index}`}
              className={cn(
                "transition-all duration-500 flex-col justify-stretch",
                isFeatured
                  ? "flex scale-100 z-10 opacity-100"
                  : "hidden md:flex scale-95 opacity-60 hover:opacity-80"
              )}
            >
              <TestimonialCard
                name={data.name}
                institution={data.institution}
                quote={data.quote}
                rating={data.rating}
                avatar={data.avatar}
                featured={isFeatured}
                className="h-full"
              />
            </div>
          );
        })}
      </div>

      {/* Navigation dots (Visible on Mobile only) */}
      <div className="flex md:hidden items-center gap-2 mt-2">
        {testimonials.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              idx === activeIndex
                ? "w-6 bg-primary-700"
                : "w-2.5 bg-primary-200 hover:bg-primary-300"
            )}
            aria-label={`Go to testimonial slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
TestimonialCarousel.displayName = "TestimonialCarousel";
