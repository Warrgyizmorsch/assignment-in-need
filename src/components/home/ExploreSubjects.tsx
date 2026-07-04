"use client";

import React, { useRef } from 'react';
import Link from 'next/link';

export default function ExploreSubjects() {
  const trackWrapperRef = useRef<HTMLDivElement>(null);

  const slideSubjects = (direction: number) => {
    const wrapper = trackWrapperRef.current;
    if (!wrapper) return;
    
    const scrollAmount = 280 * direction;

    if (direction === 1 && (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10)) {
      wrapper.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (direction === -1 && wrapper.scrollLeft <= 10) {
      wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' });
      return;
    }

    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="py-8 px-4 md:py-8 md:px-4 bg-[#faf5ff] font-sans border-t border-b border-[#f3e8ff]/50">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-5 px-4 md:px-4 text-center md:text-left flex-col md:flex-row gap-2 md:gap-0">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl md:text-[1.8rem] font-extrabold text-[#1e1b4b] m-0 mb-2">Explore Subjects</h2>
            <p className="text-[0.95rem] text-gray-600 m-0 font-medium">Expert help in 150+ subjects</p>
          </div>
          <a href="/services" className="hidden md:flex text-[0.95rem] font-bold text-[#4f46e5] hover:text-[#3730a3] items-center gap-2 transition-colors duration-300">View All Subjects &rarr;</a>
        </div>

        <div className="relative flex items-center gap-4">
          <button className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer text-[#4f46e5] items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-[#f3e8ff] hover:border-[#d8b4fe] shrink-0 z-[2]" onClick={() => slideSubjects(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] py-2 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] max-md:overflow-visible max-md:mask-none" id="znhSubjectsTrackWrapper" ref={trackWrapperRef}>
            <div className="flex gap-3 w-max px-2.5 max-md:grid max-md:grid-cols-3 max-md:gap-2 max-md:w-full max-md:p-0">
              {/* Card 1: Business */}
              <a href="/business-assignment-writing-help" className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#f3e8ff] text-[#7e22ce] max-md:w-9 max-md:h-9 max-md:rounded-full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">Business</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">12,500+ Orders</span>
                </div>
              </a>

              {/* Card 2: Law */}
              <a href="/law-assignment-writing-help" className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#ffedd5] text-[#ea580c] max-md:w-9 max-md:h-9 max-md:rounded-full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">Law</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">8,600+ Orders</span>
                </div>
              </a>

              {/* Card 3: Nursing */}
              <a href="/nursing-assignment-writing-help" className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#dcfce7] text-[#16a34a] max-md:w-9 max-md:h-9 max-md:rounded-full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">Nursing</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">9,800+ Orders</span>
                </div>
              </a>

              {/* Card 4: Psychology */}
              <a href="/psychology-assignment-help-uk" className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#fee2e2] text-[#dc2626] max-md:w-9 max-md:h-9 max-md:rounded-full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">Psychology</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">6,300+ Orders</span>
                </div>
              </a>

              {/* Card 5: Engineering */}
              <a href="/engineering-assignment-writing-help" className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#dbeafe] text-[#2563eb] max-md:w-9 max-md:h-9 max-md:rounded-full">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">Engineering</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">8,000+ Orders</span>
                </div>
              </a>

              {/* Card 6: Mobile ONLY 6th Card "More Subjects" */}
              <a href="/services" className="flex md:hidden bg-white rounded-lg p-3 flex-col justify-center items-center gap-2 border border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.03)] w-full min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#fee2e2] text-[#dc2626]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex flex-col gap-[2px] items-center">
                  <h4 className="m-0 text-[0.65rem] text-center font-bold text-gray-900 whitespace-nowrap">More Subjects</h4>
                  <span className="text-[0.55rem] text-gray-500 font-medium text-center">View All</span>
                </div>
              </a>

              {/* Card 7: Computer Science (Desktop only) */}
              <a href="/computer-science-assignment-writing-help" className="hidden md:flex bg-white rounded-lg p-[0.6rem_0.8rem] items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#ccfbf1] text-[#0d9488]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900">Computer Science</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium">7,900+ Orders</span>
                </div>
              </a>

              {/* Card 8: Accounting (Desktop only) */}
              <a href="/accounting-assignment-writing-help" className="hidden md:flex bg-white rounded-lg p-[0.6rem_0.8rem] items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#fef3c7] text-[#d97706]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900">Accounting</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium">7,600+ Orders</span>
                </div>
              </a>

              {/* Card 9: Marketing (Desktop only) */}
              <a href="/marketing-assignment-writing-help" className="hidden md:flex bg-white rounded-lg p-[0.6rem_0.8rem] items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#f3e8ff] text-[#7e22ce]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="m-0 text-[0.68rem] font-bold text-gray-900">Marketing</h4>
                  <span className="text-[0.68rem] text-gray-500 font-medium">5,500+ Orders</span>
                </div>
              </a>
            </div>
          </div>

          <button className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer text-[#4f46e5] items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-[#f3e8ff] hover:border-[#d8b4fe] shrink-0 z-[2]" onClick={() => slideSubjects(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <a href="/services" className="flex md:hidden justify-center items-center w-full p-3 mt-5 bg-white border border-gray-200 rounded-lg text-[#4f46e5] hover:bg-gray-50 font-semibold text-[0.68rem] transition-all duration-300">View All Subjects &rarr;</a>
      </div>
    </section>
  );
}
