"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import NextLink from "next/link";
import { ExpertCard } from "./ExpertCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Link = (props: React.ComponentProps<typeof NextLink>) => (
  <NextLink {...props} prefetch={false} />
);

export interface ExpertItem {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  ordersCount: number | string;
  experience?: string;
  qualifications?: string;
  slug?: string;
}

interface ExpertSliderProps {
  experts: ExpertItem[];
  className?: string;
  autoSlideInterval?: number; // ms, default 3000ms
}

export const ExpertSlider: React.FC<ExpertSliderProps> = ({
  experts,
  className,
  autoSlideInterval = 3000,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isMoreThanFour = experts.length > 4;

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const firstChild = scrollRef.current.children[0] as HTMLElement;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth + 16; // card width + gap on mobile/desktop
    const index = Math.round(scrollLeft / itemWidth);
    if (index >= 0 && index < experts.length) {
      setActiveIndex(index);
    }
  }, [experts.length]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const firstChild = scrollRef.current.children[0] as HTMLElement;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth + 16;
    scrollRef.current.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleArrowScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const step = firstChild ? firstChild.offsetWidth + 16 : 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (experts.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const firstChild = scrollRef.current.children[0] as HTMLElement;
          const step = firstChild ? firstChild.offsetWidth + 16 : 280;
          scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [experts.length, isHovered, autoSlideInterval]);

  return (
    <div
      className={cn("relative w-full group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows for > 4 items */}
      {isMoreThanFour && (
        <>
          <button
            onClick={() => handleArrowScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-gray-700 hover:text-purple-700 hover:scale-110 transition-all -ml-3 md:-ml-5 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Previous Expert"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleArrowScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-gray-700 hover:text-purple-700 hover:scale-110 transition-all -mr-3 md:-mr-5 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Next Expert"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slider Container — Always 1-by-1 horizontal slider on mobile */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "w-full flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 snap-x snap-mandatory",
          !isMoreThanFour ? "sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible" : ""
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {experts.map((expert, idx) => {
          const targetHref = `/writers/${expert.id || expert.slug || ""}`;
          return (
            <div
              key={expert.id || idx}
              className={cn(
                "shrink-0 flex flex-col items-stretch snap-center",
                "w-[85%] sm:w-[46%] lg:w-[calc(25%-18px)]"
              )}
            >
              <Link
                href={targetHref}
                className="block h-full no-underline hover:no-underline"
              >
                <ExpertCard
                  name={expert.name}
                  role={expert.role}
                  rating={expert.rating}
                  ordersCount={expert.ordersCount}
                  avatar={expert.avatar}
                  experience={expert.experience}
                  qualifications={expert.qualifications}
                  onHire={() => {
                    window.location.href = "/order";
                  }}
                  className="h-full"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Working Dynamic Interactive Pagination Dots */}
      {experts.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
          {experts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to expert ${idx + 1}`}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 cursor-pointer border-none p-0 focus:outline-none",
                activeIndex === idx
                  ? "w-6 bg-purple-700 shadow-sm"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ExpertSlider.displayName = "ExpertSlider";
