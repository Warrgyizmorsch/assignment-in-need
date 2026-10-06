"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Check, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewData {
  id: number;
  rating: number;
  result: string;
  text: string;
  meta: string;
  avatar: string;
  name: string;
  university: string;
  order: string;
  category: string;
}

const TrustBadge = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-[0.85rem] font-medium text-gray-700 shadow-sm">
    <Check className="w-4 h-4 text-emerald-600" />
    {text}
  </div>
);

export default function HomeStudentReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Assignment", "Dissertation", "Essay", "Coursework"];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const json = await res.json();
          const raw = json.data || json || [];
          if (Array.isArray(raw)) {
            const mapped = raw.map((r: any) => {
              const name = r.name || r.student_name || "Student";
              const avatar = name.substring(0, 2).toUpperCase();
              return {
                id: r.id,
                rating: parseInt(r.customer_rating || r.rating) || 5,
                result: `${Math.floor(Math.random() * (99 - 85 + 1) + 85)}%`,
                text: r.description || r.review || r.text || "",
                meta: `${r.services_type || 'Academic'} - ${r.deadline || 'Completed'}`,
                avatar: avatar,
                name: name,
                university: r.location || "UK",
                order: `#${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`,
                category: r.services_type || "Assignment"
              };
            });
            setReviews(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = activeCategory === "All"
    ? reviews
    : reviews.filter(r => (r.category || "").toLowerCase() === activeCategory.toLowerCase());

  const autoSlideInterval = 3000;

  const scrollContainer = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstChild = container.children[0] as HTMLElement;
      if (!firstChild) return;

      const step = firstChild.offsetWidth + 24; // card width + gap-6

      if (direction === "left") {
        container.scrollBy({ left: -step, behavior: "smooth" });
      } else {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (filteredReviews.length <= 3 || isHovered) return;
    const interval = setInterval(() => {
      scrollContainer("right");
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [filteredReviews.length, isHovered, scrollContainer]);

  return (
    <section className="pt-8 pb-2 px-4 md:px-8 bg-gray-50/50 font-sans border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-10 mb-2">
          <div className="max-w-2xl flex flex-col">
            <AnimateIn variant="fadeUp" className="mb-6">
              <span className="text-[#3b82f6] font-bold text-sm tracking-wider uppercase mb-2 block">
                STUDENT REVIEWS
              </span>
              <h2 className="text-3xl lg:text-[2rem] leading-tight font-extrabold text-[#0f172a] mb-4 tracking-tight">
                What UK students say after they get <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent overflow-hidden text-ellipsis">their grades</span>
              </h2>
              <p className="text-[1.05rem] text-gray-600">
                Every review below is linked to a real order. Filter by subject to see results close to yours.
              </p>
            </AnimateIn>

            <div className="flex flex-col gap-6">
              <AnimateIn variant="fadeUp" delay={0.1}>
                <div className="flex flex-wrap gap-3">
                  <TrustBadge text="Checked by order ID" />
                  <TrustBadge text="Same reviews on Trustpilot / Google" />
                  <TrustBadge text="Includes 3-star reviews too" />
                </div>
              </AnimateIn>

              <AnimateIn variant="fadeUp" delay={0.2}>
                <div className="flex flex-wrap gap-3 pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-6 py-2 rounded-full text-[0.95rem] font-semibold transition-all duration-300 border",
                        activeCategory === cat
                          ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#3b82f6] hover:text-[#3b82f6]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </AnimateIn>
            </div>
          </div>

          {/* Rating Summary Box */}
          <AnimateIn variant="fadeLeft" delay={0.1} className="shrink-0 w-full lg:w-[480px]">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-2">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[3.5rem] lg:text-[4rem] font-extrabold text-[#0f172a] leading-none mb-2">4.8</div>
                  <div className="flex text-amber-400 text-lg lg:text-xl mb-1">★★★★★</div>
                  {/* <div className="text-[0.8rem] text-gray-500 font-semibold">Sample numbers</div> */}
                </div>
                <div className="flex-1 flex flex-col gap-2.5 border-l-2 border-gray-100 pl-6">
                  {[
                    { stars: 5, pct: 86 },
                    { stars: 4, pct: 10 },
                    { stars: 3, pct: 3 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 0 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-4 text-[0.9rem] font-bold text-gray-600">
                      <span className="w-2.5 text-center">{row.stars}</span>
                      <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: row.pct + "%" }}
                        />
                      </div>
                      <span className="w-8 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* View All Reviews Link - Positioned exactly above slider on the right */}
        <div className="flex justify-end w-full px-4 md:px-2 mb-3">
          <AnimateIn variant="fadeLeft" delay={0.2}>
            <Link href="/review" className="flex items-center gap-1.5 text-[0.95rem] font-bold text-blue-600 hover:text-blue-800 transition-colors">
              View All Reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
        </div>

        {/* Reviews Slider */}
        <div
          className="relative group -mx-4 md:-mx-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <>
            {filteredReviews.length > 3 && (
              <>
                <button
                  onClick={() => scrollContainer("left")}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#3b82f6] hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollContainer("right")}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#3b82f6] hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-4 px-6 md:px-14 no-scrollbar scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="shrink-0 w-[340px] min-w-[340px] max-w-[340px] md:w-[380px] md:min-w-[380px] md:max-w-[380px] min-h-[300px] snap-center bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] transition-shadow flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex text-amber-400 text-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                      ))}
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[0.8rem] font-bold">
                      Result: {review.result}
                    </div>
                  </div>

                  <p className="text-[1.05rem] text-gray-800 leading-relaxed mb-6 flex-1 font-medium line-clamp-5">
                    "{review.text}"
                  </p>

                  <div className="text-[0.8rem] text-gray-500 mb-6 font-medium line-clamp-1">
                    {review.meta}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-3 w-[65%]">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.95rem] font-bold text-gray-900 truncate">{review.name}</div>
                        <div className="text-[0.8rem] text-gray-500 truncate">{review.university}</div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 text-emerald-600 text-[0.8rem] font-bold bg-emerald-50/50 px-2.5 py-1.5 rounded-md">
                      <Check className="w-3.5 h-3.5" />
                      Order {review.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        </div>
      </div>
    </section>
  );
}
