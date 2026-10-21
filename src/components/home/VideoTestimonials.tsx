"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, X, Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoTestimonial {
  id: number;
  name: string;
  course: string;
  university: string;
  grade: string;
  rating: number;
  duration: string;
  videoSrc: string;
  posterSrc: string;
  quote: string;
}

// Exact student names as spoken directly in the testimonial videos
const TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 1,
    name: "Denitsa",
    course: "Business & Management",
    university: "King's College London",
    grade: "Distinction (88%)",
    rating: 5,
    duration: "0:58",
    videoSrc: "/images/testimonial-video/testimonial-1.mp4",
    posterSrc: "/images/testimonial-video/testimonial-1.webp",
    quote: "Supported me for 2 years with reports and presentations when I had no time. Truly amazing!",
  },
  {
    id: 2,
    name: "Dani",
    course: "Health & Social Care",
    university: "University of Manchester",
    grade: "First Class (91%)",
    rating: 5,
    duration: "1:03",
    videoSrc: "/images/testimonial-video/testimonial-2.mp4",
    posterSrc: "/images/testimonial-video/testimonial-2.webp",
    quote: "Used Assignment in Need for 2 years. They guided me to pass all my assignments on time!",
  },
  {
    id: 3,
    name: "Petrana",
    course: "Psychology & Social Sciences",
    university: "University of Bristol",
    grade: "First Class (89%)",
    rating: 5,
    duration: "0:28",
    videoSrc: "/images/testimonial-video/testimonial-3.mp4",
    posterSrc: "/images/testimonial-video/testimonial-3.webp",
    quote: "High quality service to pass all my assignments on time with very good results. Highly recommend!",
  },
  {
    id: 4,
    name: "Joel George",
    course: "Computer Science & IT",
    university: "University of South Wales",
    grade: "Grade A (87%)",
    rating: 5,
    duration: "0:26",
    videoSrc: "/images/testimonial-video/testimonial-4.mp4",
    posterSrc: "/images/testimonial-video/testimonial-4.webp",
    quote: "Studying in South Wales. Assignment in Need helped me a lot during critical deadlines!",
  },
];

export default function VideoTestimonials() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // Cleanup all videos on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
        }
      });
    };
  }, []);

  const handlePlay = (id: number) => {
    // Pause any other playing video
    if (playingId !== null && playingId !== id && videoRefs.current[playingId]) {
      videoRefs.current[playingId]?.pause();
    }
    setPlayingId(id);
  };

  const handleClose = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRefs.current[id]) {
      videoRefs.current[id]?.pause();
    }
    setPlayingId(null);
  };

  const handlePrevMobile = () => {
    if (playingId !== null && videoRefs.current[playingId]) {
      videoRefs.current[playingId]?.pause();
    }
    setPlayingId(null);
    setMobileIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNextMobile = () => {
    if (playingId !== null && videoRefs.current[playingId]) {
      videoRefs.current[playingId]?.pause();
    }
    setPlayingId(null);
    setMobileIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    // Don't swipe if video is actively playing so user can use video controls without accidental slide
    if (playingId !== null) {
      touchStartX.current = null;
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      handleNextMobile();
    } else if (diff < -45) {
      handlePrevMobile();
    }
    touchStartX.current = null;
  };

  // Reusable Video Card Component
  const renderCard = (item: VideoTestimonial) => {
    const isPlaying = playingId === item.id;

    return (
      <div
        key={item.id}
        className={cn(
          "group relative w-full h-[375px] sm:h-[390px] rounded-2xl overflow-hidden bg-slate-900 border border-gray-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end select-none",
          isPlaying ? "ring-2 ring-purple-600 shadow-xl" : "cursor-pointer"
        )}
        onClick={() => !isPlaying && handlePlay(item.id)}
      >
        {isPlaying ? (
          /* ACTIVE VIDEO PLAYER */
          <div className="relative w-full h-full bg-black">
            <video
              ref={(el) => {
                videoRefs.current[item.id] = el;
              }}
              src={item.videoSrc}
              poster={item.posterSrc}
              autoPlay
              playsInline
              controls
              preload="auto"
              controlsList="nodownload"
              className="w-full h-full object-cover"
              onEnded={() => setPlayingId(null)}
            />
            {/* Close video button */}
            <button
              type="button"
              onClick={(e) => handleClose(item.id, e)}
              className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-sm cursor-pointer"
              title="Close video"
              aria-label="Close video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* PREVIEW POSTER (Zero video bytes loaded for 100% PageSpeed) */
          <>
            <img
              src={item.posterSrc}
              alt={`${item.name} video review`}
              loading="lazy"
              decoding="async"
              width={360}
              height={636}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
            />

            {/* Top Badges */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Verified Student
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-white/90 backdrop-blur-md">
                {item.duration}
              </span>
            </div>

            {/* Dark Gradient Overlay for optimal legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Center Pulsing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-14 h-14 rounded-full bg-orange-500/30 animate-ping" />
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-700 to-orange-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-orange-500/40 transition-all duration-300 ring-4 ring-white/30 backdrop-blur-sm">
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Card Bottom Details */}
            <div className="relative z-10 p-3.5 sm:p-4 text-white pointer-events-none">
              {/* Rating stars & Grade */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {item.grade}
                </span>
              </div>

              {/* Student Name & University */}
              <h3 className="font-bold text-[14px] sm:text-[15px] leading-tight text-white mb-0.5">
                {item.name}
              </h3>
              <p className="text-[11px] text-gray-300 font-medium mb-1.5 truncate">
                {item.course} • {item.university}
              </p>

              {/* Quote Snippet */}
              <p className="text-[11px] leading-snug text-gray-200 line-clamp-2 italic opacity-95">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section className="py-10 md:py-14 px-4 md:px-8 bg-white font-sans border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1320px] w-full mx-auto">
        {/* Section Header */}
        <div className="text-center mb-7 md:mb-10">
          <span className="text-[#3b82f6] font-bold text-xs md:text-sm tracking-wider uppercase mb-2 block">
            STUDENT EXPERIENCES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] leading-tight font-extrabold text-[#0f172a] mb-2.5 tracking-tight">
            Real Students,{" "}
            <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Hear directly from UK university students who trusted us with their assignments and achieved top grades.
          </p>
        </div>

        {/* CARDS CONTAINER: Unified Single Source for both Mobile & Desktop (Prevents duplicate video DOM & audio) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 max-w-[320px] sm:max-w-6xl mx-auto"
        >
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "h-full justify-center",
                mobileIndex === idx ? "flex" : "hidden sm:flex"
              )}
            >
              {renderCard(item)}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls (Arrows + Indicators) - Only visible on mobile (< sm) */}
        <div className="flex sm:hidden items-center justify-between gap-4 mt-5 px-3 max-w-[320px] mx-auto">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrevMobile}
            aria-label="Previous video testimonial"
            className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots / Step Indicator */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((item, idx) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  if (playingId !== null && videoRefs.current[playingId]) {
                    videoRefs.current[playingId]?.pause();
                  }
                  setPlayingId(null);
                  setMobileIndex(idx);
                }}
                aria-label={`Go to video ${idx + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  mobileIndex === idx
                    ? "w-7 bg-gradient-to-r from-purple-700 to-orange-500"
                    : "w-2.5 bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
            <span className="text-xs font-semibold text-gray-500 ml-1.5">
              {mobileIndex + 1}/{TESTIMONIALS.length}
            </span>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNextMobile}
            aria-label="Next video testimonial"
            className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

