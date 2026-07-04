"use client";

import React from 'react';

export default function CtaBanner() {
  return (
    <section className="py-8 px-4 md:py-8 md:px-4 pb-8 bg-[#fafaff] font-sans flex justify-center">
      <div className="relative w-full max-w-[1200px] bg-gradient-to-r from-[#241468] via-[#461f8d] to-[#db6161] rounded-xl flex flex-col lg:flex-row items-center justify-between p-8 md:p-[2.5rem_2rem_2.5rem_260px] lg:p-[2.5rem_3rem_2.5rem_380px] text-center lg:text-left gap-6 lg:gap-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-lg:overflow-hidden overflow-visible">
        <div className="absolute top-0 right-0 bottom-0 w-[400px] overflow-hidden rounded-r-xl pointer-events-none z-[1]">
          <div className="absolute w-[300px] h-[300px] top-[-100px] right-[-50px] rounded-full bg-white/5"></div>
          <div className="absolute w-[250px] h-[250px] bottom-[-80px] right-[150px] rounded-full bg-white/5"></div>
        </div>

        <img src="/new-home-page-images/Cta-New.webp" alt="Student" className="hidden lg:block absolute left-[-4rem] bottom-0 h-[130%] max-w-[450px] z-[2] pointer-events-none object-contain object-left-bottom" />

        <div className="contents lg:flex lg:flex-col lg:gap-2 lg:flex-1 lg:z-[2]">
          <h2 className="order-1 lg:order-none text-2xl md:text-[2.2rem] font-bold text-white m-0 tracking-tight">Stuck On Your Assignment?</h2>
          <p className="order-2 lg:order-none text-sm md:text-base text-white/90 m-0 mb-4 lg:mb-6">Get expert help and improve your grades with confidence.</p>

          <div className="order-4 lg:order-none flex flex-col md:flex-row md:flex-wrap md:justify-center lg:flex-row lg:flex-nowrap gap-4 md:gap-8 items-start md:items-center w-full lg:w-auto pl-4 md:pl-0">
            <div className="flex items-center gap-3 text-left w-full md:w-auto">
              <div className="w-[38px] h-[38px] rounded-full border border-white/35 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px] text-white">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M12 11v-4" />
                  <path d="M12 15h.01" />
                </svg>
              </div>
              <div className="flex flex-col">
                <strong className="text-[0.85rem] md:text-[0.95rem] font-bold text-white leading-tight">24/7 Support</strong>
                <span className="text-[0.75rem] md:text-[0.8rem] text-white/75">We're here anytime</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left w-full md:w-auto">
              <div className="w-[38px] h-[38px] rounded-full border border-white/35 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px] text-white">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex flex-col">
                <strong className="text-[0.85rem] md:text-[0.95rem] font-bold text-white leading-tight">Expert Writers</strong>
                <span className="text-[0.75rem] md:text-[0.8rem] text-white/75">Subject specialists</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left w-full md:w-auto">
              <div className="w-[38px] h-[38px] rounded-full border border-white/35 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px] text-white">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                  <path d="M12 2v2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <strong className="text-[0.85rem] md:text-[0.95rem] font-bold text-white leading-tight">On-Time Delivery</strong>
                <span className="text-[0.75rem] md:text-[0.8rem] text-white/75">Before your deadline</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contents lg:flex lg:flex-col lg:items-start lg:gap-5 lg:min-w-[280px] lg:ml-8 lg:z-[2]">
          <a href="/upload-your-assignment" className="order-3 w-full max-w-[400px] bg-gradient-to-r from-[#ff8b49] to-[#fa6830] text-white font-bold text-[1rem] md:text-[1.1rem] py-3.5 md:py-4 px-8 rounded-lg shadow-[0_10px_20px_rgba(250,104,48,0.3)] hover:-translate-y-0.75 hover:shadow-[0_15px_25px_rgba(250,104,48,0.4)] transition-all duration-300 text-center border-0">Get Free Quote Now &rarr;</a>
          <div className="order-5 lg:order-none flex items-center justify-center lg:justify-start gap-3 w-full lg:w-auto max-lg:mx-auto max-lg:w-max mt-2 md:mt-0">
            <div className="flex">
              <img src="/assets/media/layout/testimonial/testimonial1.webp" alt="Student" className="w-[30px] h-[30px] rounded-full border-2 border-white -ml-2.5 bg-gray-100 relative z-[1] transition-all duration-300 hover:scale-140 hover:z-[10] hover:border-[#ff8b49] first:ml-0" />
              <img src="/assets/media/layout/testimonial/testimonial2.webp" alt="Student" className="w-[30px] h-[30px] rounded-full border-2 border-white -ml-2.5 bg-gray-100 relative z-[1] transition-all duration-300 hover:scale-140 hover:z-[10] hover:border-[#ff8b49] first:ml-0" />
              <img src="/assets/media/layout/testimonial/testimonial3.webp" alt="Student" className="w-[30px] h-[30px] rounded-full border-2 border-white -ml-2.5 bg-gray-100 relative z-[1] transition-all duration-300 hover:scale-140 hover:z-[10] hover:border-[#ff8b49] first:ml-0" />
              <img src="/assets/media/layout/testimonial/testimonial4.webp" alt="Student" className="w-[30px] h-[30px] rounded-full border-2 border-white -ml-2.5 bg-gray-100 relative z-[1] transition-all duration-300 hover:scale-140 hover:z-[10] hover:border-[#ff8b49] first:ml-0" />
            </div>
            <span className="text-[0.85rem] font-medium leading-tight text-white/95">Join 25,000+ Happy Students</span>
          </div>
        </div>
      </div>
    </section>
  );
}
