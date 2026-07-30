"use client";

import React, { useRef, useEffect, useState } from "react";
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
  autoSlideInterval?: number; // ms, default 1500ms
}

export const ExpertSlider: React.FC<ExpertSliderProps> = ({
  experts,
  className,
  autoSlideInterval = 1500,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isMoreThanFour = experts.length > 4;

  useEffect(() => {
    if (!isMoreThanFour || isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Near the end: smooth reset to beginning
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Slide by width of 1 card + gap
          const firstChild = scrollRef.current.children[0] as HTMLElement;
          const step = firstChild ? firstChild.offsetWidth + 24 : 290;
          scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isMoreThanFour, isHovered, autoSlideInterval]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const step = firstChild ? firstChild.offsetWidth + 24 : 290;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    }
  };

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
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-gray-700 hover:text-purple-700 hover:scale-110 transition-all -ml-3 md:-ml-5 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Previous Expert"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-gray-700 hover:text-purple-700 hover:scale-110 transition-all -mr-3 md:-mr-5 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Next Expert"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slider / Grid Container */}
      <div
        ref={scrollRef}
        className={cn(
          "w-full flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2",
          !isMoreThanFour ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:overflow-visible" : ""
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {experts.map((expert, idx) => {
          const targetHref = `/writers/${expert.id || expert.slug || ""}`;
          return (
            <div
              key={expert.id || idx}
              className={cn(
                "shrink-0 flex flex-col items-stretch",
                isMoreThanFour
                  ? "w-[85%] sm:w-[46%] lg:w-[calc(25%-18px)]"
                  : "w-full"
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
    </div>
  );
};

ExpertSlider.displayName = "ExpertSlider";
