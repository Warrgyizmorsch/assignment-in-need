import React from "react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

export default function PromoBannerHome() {
  return (
    <section className="py-6 px-4 md:py-8 md:px-6 bg-white font-sans flex justify-center overflow-hidden">
      <AnimateIn variant="scaleUp" className="max-w-[1200px] w-full">
        {/* Outer Banner Card with precise gradient matching the reference image */}
        <div className="bg-gradient-to-r from-[#0b053f] via-[#1b0b5d] to-[#401269] rounded-2xl p-5 md:p-6 lg:p-7 flex flex-col lg:flex-row justify-between items-center text-center lg:text-left shadow-lg relative overflow-hidden gap-6 lg:gap-4 border border-purple-500/10">

          {/* Subtle warm glow overlay on the right side */}
          <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-[radial-gradient(circle_at_right_bottom,rgba(251,113,133,0.12)_0%,transparent_75%)] pointer-events-none z-[1]" />

          {/* Left Block: Discount Callout */}
          <div className="flex flex-col gap-0.5 z-[2] shrink-0 min-w-[210px] items-center lg:items-start text-center lg:text-left">
            <span className="text-[10px] md:text-xs font-black tracking-widest text-[#dcd6fc]">
              GET UP TO
            </span>
            <div className="text-3xl md:text-[2.6rem] font-black text-white m-0 leading-none tracking-tight">
              <span className="text-[#ff7a00]">40%</span> OFF
            </div>
            <span className="text-[10px] md:text-xs font-black tracking-widest text-[#dcd6fc] mt-0.5">
              ON YOUR FIRST ORDER
            </span>

            {/* Promo Code Badge */}
            <div className="bg-white text-[#4a17a3] text-[10px] font-extrabold py-1 px-4 rounded-full mt-2 mb-1.5 w-max border border-purple-100 select-all">
              Use Code: <strong className="text-[#4a17a3]">AIN40</strong>
            </div>

            <p className="text-[9px] md:text-[10px] text-white/50 m-0 font-medium tracking-wide">
              Hurry! Offer valid for limited time only.
            </p>
          </div>

          {/* Vertical Separator line visible only on desktop */}
          <div className="w-[1px] bg-white/10 hidden lg:block self-stretch mx-4 z-[2]" />

          {/* Right Block: Reusable Cards Slider/Grid */}
          <div className="flex flex-col gap-3.5 z-[2] flex-1 w-full min-w-0">
            {/* sparkles icon + title + savings */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full gap-2 mb-1 lg:mb-0">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <span className="text-amber-400 text-xs select-none">✨</span>
                <p className="text-xs md:text-sm font-extrabold m-0 text-white tracking-wider uppercase">
                  All These, Absolutely FREE!
                </p>
              </div>
              <div className="bg-[#3f159a]/50 text-white border border-[#3f159a] text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-full flex flex-wrap items-center gap-1.5 shadow-sm">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                <span>TOTAL SAVINGS:</span>
                <span className="line-through text-white/90 decoration-red-400 decoration-2 font-medium">GBP 88.19</span>
                <span className="bg-white text-[#3f159a] px-1.5 py-0.5 rounded ml-0.5 text-[9px] uppercase tracking-wide">FREE</span>
              </div>
            </div>

            {/* Grid layout on mobile, horizontal row layout on desktop */}
            <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 lg:flex lg:flex-row gap-2 md:gap-2.5 w-full justify-between">
              {[
                {
                  title: "Title & Bibliography",
                  price: "GBP 7.85",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M9 12h6" />
                      <path d="M12 12v5" />
                    </svg>
                  )
                },
                {
                  title: "Formatting",
                  price: "GBP 9.12",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="7" y1="8" x2="17" y2="8" />
                      <line x1="7" y1="12" x2="13" y2="12" />
                      <line x1="7" y1="16" x2="15" y2="16" />
                    </svg>
                  )
                },
                {
                  title: "Preferred Writer",
                  price: "GBP 12.05",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                      <polygon points="16 3 18 5 22 1" stroke="#f59e0b" />
                    </svg>
                  )
                },
                {
                  title: "Order Tracking",
                  price: "GBP 14.25",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  )
                },
                {
                  title: "Unlimited Revisions",
                  price: "GBP 16.55",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38L21.5 8" />
                    </svg>
                  )
                },
                {
                  title: "24/7 Support",
                  price: "GBP 13.05",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <path d="M3 12c0-5 4-9 9-9s9 4 9 9" />
                      <rect x="2" y="10" width="2" height="4" rx="1" />
                      <rect x="20" y="10" width="2" height="4" rx="1" />
                      <path d="M20 12v1a3 3 0 0 1-3 3h-2" />
                      <circle cx="12" cy="11" r="3" />
                      <path d="M9 17a3 3 0 0 0 6 0" />
                    </svg>
                  )
                },
                {
                  title: "Quality Check",
                  price: "GBP 15.32",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#4a17a3]">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <StaggerItem key={idx} className="flex-1 min-w-[95px] lg:min-w-[105px]">
                  <div
                    className="bg-white rounded-xl p-2 md:p-2.5 flex flex-col items-center justify-between gap-1 w-full h-full min-h-[125px] lg:min-h-[140px] text-center shadow-md transition-transform duration-200 hover:-translate-y-1 select-none border border-purple-50/10"
                  >
                    <div className="w-[36px] h-[36px] bg-[#f4f7fe] rounded-lg flex items-center justify-center shrink-0 mb-1">
                      {item.svg}
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-800 leading-tight whitespace-normal">
                      {item.title}
                    </span>
                    <span className="text-[11px] md:text-[12px] text-gray-500 font-bold line-through decoration-red-500/70 decoration-2">
                      {item.price}
                    </span>
                    <div className="bg-[#3f159a] text-white text-[9px] font-bold px-3 py-1 rounded-full mt-auto w-full md:w-auto shadow-sm tracking-widest">
                      FREE
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

        </div>
      </AnimateIn>
    </section>
  );
}
