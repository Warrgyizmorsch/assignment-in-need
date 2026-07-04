"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AssignmentSamples() {
  const trackWrapperRef = useRef<HTMLDivElement>(null);

  const slideSamples = (direction: number) => {
    const wrapper = trackWrapperRef.current;
    if (!wrapper) return;

    const card = wrapper.querySelector('.group') as HTMLElement;
    const cardWidth = card ? card.offsetWidth : 220;
    const gap = window.innerWidth <= 768 ? 8 : 20;
    const scrollAmount = (cardWidth + gap) * direction;

    if (direction === 1 && (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10)) {
      wrapper.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      slideSamples(1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-8 max-md:py-4 max-md:px-4 bg-[#fafaff] font-sans flex justify-center overflow-hidden border-b border-[#f3e8ff]/50">
      <div className="max-w-[1200px] w-full flex items-center gap-10 max-lg:flex-col max-lg:items-start max-lg:gap-6">
        <div className="w-[260px] max-lg:w-full shrink-0 flex flex-col gap-4 max-lg:flex-row max-lg:items-center max-lg:justify-between max-md:flex-col max-md:items-start">
          <h2 className="text-2xl md:text-[1.8rem] font-extrabold text-[#1e1b4b] m-0 leading-tight max-md:text-[1.4rem]">Assignment Samples</h2>
          <p className="text-[0.95rem] text-gray-600 m-0 leading-relaxed max-lg:hidden max-md:block max-md:text-[0.85rem]">High-quality work samples to get an idea of our writing quality.</p>
          <a href="/free-samples" className="hidden md:block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-[0.9rem] py-3 px-5 rounded-lg text-center w-max transition-all duration-300 hover:-translate-y-0.5 mt-2">View All Samples</a>
        </div>

        <div className="flex-1 relative flex items-center gap-4 min-w-0 max-md:w-full">
          <a href="/samples" className="hidden md:flex absolute top-[-45px] right-5 w-12 h-12 bg-[#faf5ff] hover:bg-[#f3e8ff] border border-purple-200/10 rounded-xl items-center justify-center text-[#6d28d9] shadow-[0_4px_10px_rgba(109,40,217,0.05)] hover:shadow-[0_8px_15px_rgba(109,40,217,0.15)] z-[5] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:rotate-6" title="View all samples">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5.5 h-5.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="15" x2="15" y2="15" />
              <line x1="9" y1="11" x2="11" y2="11" />
            </svg>
          </a>

          <div className="w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] py-4 [mask-image:linear-gradient(to_right,black_85%,transparent)] max-md:mask-none max-md:py-2" id="znh-samplesTrackWrapper" ref={trackWrapperRef}>
            <div className="flex gap-5 w-max max-md:gap-2">
              <a href="/samples" className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl">
                <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden">
                  <img src="/new-home-page-images/Business-Report.webp" alt="Business Report" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                </div>
                <div className="p-4 max-md:p-2 relative flex flex-col gap-1">
                  <h4 className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight">Business Report</h4>
                  <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium">Management</span>
                  <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">PDF</div>
                </div>
              </a>
              <a href="/samples" className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl">
                <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden">
                  <img src="/new-home-page-images/Essay-Writing.webp" alt="Nursing Essay" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                </div>
                <div className="p-4 max-md:p-2 relative flex flex-col gap-1">
                  <h4 className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight">Nursing Essay</h4>
                  <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium">Nursing</span>
                  <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">PDF</div>
                </div>
              </a>
              <a href="/samples" className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl">
                <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden">
                  <img src="/new-home-page-images/Law-Case-Study.webp" alt="Law Case Study" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                </div>
                <div className="p-4 max-md:p-2 relative flex flex-col gap-1">
                  <h4 className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight">Law Case Study</h4>
                  <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium">Law</span>
                  <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">PDF</div>
                </div>
              </a>
              <a href="/samples" className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl">
                <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden">
                  <img src="/new-home-page-images/Report-Writing.webp" alt="Marketing Plan" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                </div>
                <div className="p-4 max-md:p-2 relative flex flex-col gap-1">
                  <h4 className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight">Marketing Plan</h4>
                  <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium">Marketing</span>
                  <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">PDF</div>
                </div>
              </a>
              <a href="/samples" className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl">
                <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden">
                  <img src="/new-home-page-images/Case-Study-Help.webp" alt="Computer Science" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                </div>
                <div className="p-4 max-md:p-2 relative flex flex-col gap-1">
                  <h4 className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight">Computer Science</h4>
                  <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium">Computer Science</span>
                  <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">PDF</div>
                </div>
              </a>
              <a href="/samples" className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl">
                <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden">
                  <img src="/new-home-page-images/Reseacrh-Proposal.webp" alt="Research Proposal" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                </div>
                <div className="p-4 max-md:p-2 relative flex flex-col gap-1">
                  <h4 className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight">Research Proposal</h4>
                  <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium">PhD Proposal</span>
                  <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">PDF</div>
                </div>
              </a>
            </div>
          </div>

          <button className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.05)] cursor-pointer text-gray-400 items-center justify-center w-[45px] h-[45px] rounded-full transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shrink-0 z-[2]" onClick={() => slideSamples(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <a href="/samples" className="flex md:hidden justify-center items-center w-full p-3 mt-2.5 bg-white border border-gray-200 rounded-lg text-[#7c3aed] hover:text-[#6d28d9] hover:bg-gray-50 font-semibold text-[0.8rem] transition-all duration-300">View All Samples &rarr;</a>
      </div>
    </section>
  );
}
