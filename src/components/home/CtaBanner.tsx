import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default function CtaBanner() {
  return (
    <section className="pt-2 pb-6 px-4 md:pt-4 md:pb-8 md:px-6 bg-[#fafaff] font-sans flex justify-center overflow-hidden">
      {/* Outer Banner Card with responsive padding to accommodate absolute student image */}
      <AnimateIn variant="scaleUp" className="relative w-full max-w-[1200px] bg-gradient-to-r from-[#241165] via-[#3a1a8c] to-[#e8523f] rounded-2xl flex flex-col lg:flex-row items-center justify-between p-6 md:p-[2rem_2rem_2rem_200px] lg:p-[2rem_3rem_2rem_220px] text-center lg:text-left gap-6 lg:gap-0 shadow-[0_10px_35px_rgba(0,0,0,0.06)] overflow-visible">
        {/* Layered transparent circles for premium texture */}
        <div className="absolute top-0 right-0 bottom-0 w-[300px] overflow-hidden rounded-r-2xl pointer-events-none z-[1]">
          <div className="absolute w-[200px] h-[200px] top-[-80px] right-[-40px] rounded-full bg-white/5" />
          <div className="absolute w-[180px] h-[180px] bottom-[-60px] right-[80px] rounded-full bg-white/5" />
        </div>

        {/* Student Image popping out of the top container border */}
        <Image
          src="/new-home-page-images/Cta-New.webp"
          alt="Student assignment help assistance"
          width={360}
          height={450}
          className="hidden md:block absolute left-[1rem] lg:left-[-1rem] bottom-0 h-[135%] max-w-[30%] lg:max-w-[30%] z-[2] pointer-events-none object-contain object-left-bottom select-none"
        />

        {/* Left Columns Container (Centered) */}
        <div className="flex flex-col items-center flex-1 z-[2] relative max-w-[65%] text-center lg:text-center">
          <h2 className="text-xl md:text-2xl lg:text-[2rem] font-black text-white tracking-tight leading-tight m-0 text-center">
            Stuck On Your Assignment?
          </h2>
          <p className="text-xs md:text-sm text-purple-100 font-semibold mt-1.5 mb-5 lg:mb-6 max-w-lg leading-relaxed m-0 text-center">
            Get expert help and improve your grades with confidence.
          </p>

          {/* Three Feature Strips */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 justify-center items-center w-full">
            {/* feature 1 */}
            <div className="flex items-center gap-2.5 text-left shrink-0">
              <div className="w-[34px] h-[34px] rounded-full border border-white/20 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-white"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11v-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15h.01"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <strong className="text-xs font-bold text-white">
                  24/7 Support
                </strong>
                <span className="text-[10px] text-purple-200 font-semibold mt-0.5">
                  We&apos;re here anytime
                </span>
              </div>
            </div>

            {/* feature 2 */}
            <div className="flex items-center gap-2.5 text-left shrink-0">
              <div className="w-[34px] h-[34px] rounded-full border border-white/20 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-white"
                >
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 21v-2a4 4 0 0 0-3-3.87"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <strong className="text-xs font-bold text-white">
                  Expert Writers
                </strong>
                <span className="text-[10px] text-purple-200 font-semibold mt-0.5">
                  Subject specialists
                </span>
              </div>
            </div>

            {/* feature 3 */}
            <div className="flex items-center gap-2.5 text-left shrink-0">
              <div className="w-[34px] h-[34px] rounded-full border border-white/20 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-white"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="12 6 12 12 16 14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <strong className="text-xs font-bold text-white">
                  On-Time Delivery
                </strong>
                <span className="text-[10px] text-purple-200 font-semibold mt-0.5">
                  Before your deadline
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Block Container */}
        <div className="flex flex-col items-center lg:items-start gap-3.5 lg:shrink-0 lg:ml-6 z-[2] relative w-full lg:w-auto">
          <Link
            href="/order"
            className="w-full lg:w-auto min-w-[210px] btn-shutter-orange-open text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(249,78,18,0.25)] text-center border-0 cursor-pointer select-none"
          >
            Get Free Quote Now &rarr;
          </Link>

          <div className="flex items-center gap-2.5 justify-center lg:justify-start">
            {/* Hardcoded pixel widths to prevent browser sizing fallback stretching the avatars */}
            <div className="flex -space-x-2 shrink-0">
              <Image
                src="/assets/media/layout/testimonial/testimonial1.webp"
                alt="Student avatar 1"
                width={28}
                height={28}
                className="w-[28px] h-[28px] rounded-full border-2 border-white bg-gray-150 relative z-[1]"
              />
              <Image
                src="/assets/media/layout/testimonial/testimonial2.webp"
                alt="Student avatar 2"
                width={28}
                height={28}
                className="w-[28px] h-[28px] rounded-full border-2 border-white bg-gray-150 relative z-[2]"
              />
              <Image
                src="/assets/media/layout/testimonial/testimonial3.webp"
                alt="Student avatar 3"
                width={28}
                height={28}
                className="w-[28px] h-[28px] rounded-full border-2 border-white bg-gray-150 relative z-[3]"
              />
              <Image
                src="/assets/media/layout/testimonial/testimonial4.webp"
                alt="Student avatar 4"
                width={28}
                height={28}
                className="w-[28px] h-[28px] rounded-full border-2 border-white bg-gray-150 relative z-[4]"
              />
            </div>
            <span className="text-[11px] font-bold text-white/90 leading-none select-none">
              Join 25,000+ Happy Students
            </span>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
