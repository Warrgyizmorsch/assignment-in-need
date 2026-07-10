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

  // Helper to get visible slides on desktop (3 items centered around activeIndex)
  const getVisibleSlides = () => {
    const total = testimonials.length;
    if (total === 0) return [];
    
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
    <div className={cn("w-full flex flex-col items-center gap-8", className)}>
      {/* Desktop view: 3-column layout where the center item is featured */}
      <div className="hidden md:grid grid-cols-3 gap-6 w-full items-stretch min-h-[300px]">
        {getVisibleSlides().map(({ data, index, position }) => {
          const isFeatured = position === "center";
          return (
            <div
              key={`desktop-testimonial-${position}-${index}`}
              className={cn(
                "transition-all duration-500 flex flex-col justify-stretch",
                isFeatured ? "scale-100 z-10 opacity-100" : "scale-95 opacity-60 hover:opacity-80"
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

      {/* Mobile view: single card slide */}
      <div className="flex md:hidden w-full">
        {testimonials.length > 0 && (
          <div className="w-full transition-all duration-300">
            <TestimonialCard
              name={testimonials[activeIndex].name}
              institution={testimonials[activeIndex].institution}
              quote={testimonials[activeIndex].quote}
              rating={testimonials[activeIndex].rating}
              avatar={testimonials[activeIndex].avatar}
              featured={true}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center gap-2 mt-2">
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
