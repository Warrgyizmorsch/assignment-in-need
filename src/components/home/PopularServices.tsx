"use client";

import React from 'react';
import Link from 'next/link';

export default function PopularServices() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-8 bg-white font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-3 md:block gap-2">
        <h2 className="grid-col-span-full md:col-span-1 text-center text-xl md:text-[2rem] font-extrabold text-gray-900 m-0 mb-6 md:mb-12 col-span-3 whitespace-nowrap">
          Our Most Popular Services
        </h2>

        <div className="contents md:flex md:gap-6 md:items-stretch">
          {/*  Large Card (Main)  */}
          <Link 
            href="/assignment-writing-uk" 
            className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#f3e8ff] w-full md:w-1/4 shrink-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
          >
            <div className="contents md:relative md:z-[2]">
              <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                Assignment Help
              </h3>
              <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[90%]">
                All types of assignments on any subject
              </p>
              <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £12</span>
                <span className="hidden md:inline text-[0.85rem] text-gray-400">12,500+ Orders</span>
              </div>
            </div>
            <img 
              src="/new-home-page-images/Assignment-Help.webp" 
              alt="Assignment Help"
              className="order-1 md:order-none static md:absolute bottom-[-5%] right-[-5%] w-8 h-8 md:w-[110%] md:h-auto md:max-h-[75%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#e0f2fe] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
            />
          </Link>

          {/*  Right Side Container  */}
          <div className="contents md:flex md:flex-col md:gap-6 md:flex-1">
            {/*  Top Row (3 Cards)  */}
            <div className="contents md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:flex-1">
              {/* Card 2: Essay Writing */}
              <Link 
                href="/essay-writing-help-services" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#fff7ed] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Essay Writing
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    Well-researched, plagiarism-free essays
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £12</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">18,600+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Essay-Writing.webp" 
                  alt="Essay Writing"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#ffedd5] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>

              {/* Card 3: Dissertation Help */}
              <Link 
                href="/dissertation-writing-help-services" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#faf5ff] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Dissertation Help
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    Expert assistance for Master's & PhD
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £25</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">8,900+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Disseratation-Help.webp" 
                  alt="Dissertation Help"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#e0e7ff] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>

              {/* Card 4: Case Study Help */}
              <Link 
                href="/upload-your-assignment" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#fff1f2] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Case Study Help
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    In-depth case analysis and solutions
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £15</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">6,200+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Case-Study-Help.webp" 
                  alt="Case Study Help"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#ffe4e6] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>
            </div>

            {/*  Bottom Row (4 Cards)  */}
            <div className="contents md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:flex-1">
              {/* Card 5: Report Writing */}
              <Link 
                href="/upload-your-assignment" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#f0f9ff] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Report Writing
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    Detailed and structured reports
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £15</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">7,800+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Report-Writing.webp" 
                  alt="Report Writing"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#e0f2fe] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>

              {/* Card 6: Coursework Help */}
              <Link 
                href="/coursework-writing-help" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#f8fafc] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Coursework Help
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    Error-free coursework done on time
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £12</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">9,100+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Coursework-Help.webp" 
                  alt="Coursework Help"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#f3e8ff] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>

              {/* Card 7: Proofreading */}
              <Link 
                href="/upload-your-assignment" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#fdf4ff] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Proofreading
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    Perfect grammar, zero errors
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £8</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">11,200+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Proofreading.webp" 
                  alt="Proofreading"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#fee2e2] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>

              {/* Card 8: Editing & Formatting */}
              <Link 
                href="/upload-your-assignment" 
                className="group block rounded-xl md:rounded-[20px] p-3 md:p-6 relative overflow-hidden flex flex-col justify-center md:justify-between transition-all duration-300 hover:md:-translate-y-1 hover:md:shadow-[0_15px_30px_rgba(0,0,0,0.05)] min-h-0 md:min-h-[200px] bg-gradient-to-br from-white to-[#f0fdf4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border md:border-0 border-gray-100 p-[12px_4px] items-center text-center md:text-left md:items-stretch"
              >
                <div className="contents md:relative md:z-[2]">
                  <h3 className="order-2 md:order-none text-[0.65rem] md:text-[1.2rem] font-bold text-gray-900 m-0 mb-[2px] md:mb-2 leading-tight md:leading-normal text-center md:text-left">
                    Editing & Formatting
                  </h3>
                  <p className="hidden md:block text-[0.85rem] text-gray-600 m-0 mb-6 leading-normal max-w-[60%]">
                    References, citations and formatting
                  </p>
                  <div className="order-3 md:order-none flex flex-col gap-0 md:gap-1 items-center md:items-start">
                    <span className="text-[0.55rem] md:text-[0.85rem] text-gray-500 md:text-gray-600 font-medium">From £10</span>
                    <span className="hidden md:inline text-[0.85rem] text-gray-400">5,600+ Orders</span>
                  </div>
                </div>
                <img 
                  src="/new-home-page-images/Editing.webp" 
                  alt="Editing & Formatting"
                  className="order-1 md:order-none static md:absolute bottom-[-15px] right-[-15px] w-8 h-8 md:w-[65%] md:h-auto md:max-h-[85%] object-contain rounded-full md:rounded-none p-1.5 md:p-0 bg-[#dcfce7] md:bg-transparent transition-transform duration-300 group-hover:md:scale-105" 
                />
              </Link>
            </div>
          </div>
        </div>

        <Link 
          href="/services" 
          className="flex md:hidden grid-column-span-full col-span-3 justify-center items-center w-full p-2.5 mt-2.5 bg-white border border-gray-200 rounded-lg text-indigo-600 font-semibold text-[0.8rem] transition-all duration-300 hover:bg-gray-50 hover:text-indigo-800"
        >
          View All Services &rarr;
        </Link>
      </div>
    </section>
  );
}
