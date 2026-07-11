import React from "react";
import Link from "next/link";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

export default function ResultsAndTools() {
  return (
    <section className="py-8 px-8 max-md:py-8 max-md:px-4 bg-white md:bg-white max-md:bg-[#fafaff] font-sans flex justify-center">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real Results */}
        <div className="rounded-[20px] p-[1.2rem] flex flex-col gap-8 max-md:p-0 max-md:bg-transparent max-md:border-none max-md:shadow-none max-md:gap-5 bg-[#fdfdfd] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <AnimateIn variant="fadeUp" className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-gray-900 m-0 mb-2 tracking-tight">
              Real Results. Real Success.
            </h2>
            <p className="text-[0.95rem] text-gray-500 m-0 leading-normal">
              See how we help students improve their grades.
            </p>
          </AnimateIn>

          <StaggerContainer className="flex flex-col md:flex-row gap-4 w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] pb-2 max-md:flex-col">
            <StaggerItem className="flex-1 min-w-[170px]">
              <div className="group bg-white rounded-2xl p-[1.5rem_1rem] w-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-50 max-md:border-gray-100 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[1.5rem] font-extrabold text-[#f97316]">
                      68%
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
                      Before
                    </span>
                  </div>
                  <div className="text-gray-600 text-[1rem] font-bold">➔</div>
                  <div className="flex flex-col items-center">
                    <span className="text-[1.5rem] font-extrabold text-[#10b981]">
                      82%
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
                      After
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[0.8rem] font-bold text-gray-800">
                    Business Management
                  </strong>
                  <span className="text-[0.7rem] text-gray-500">
                    University of Manchester
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <img
                    src="/assets/media/layout/testimonial/testimonial4.webp"
                    alt="James T."
                    className="w-6 h-6 rounded-full bg-gray-200 transition-transform duration-300 hover:scale-130"
                  />
                  <span className="text-[0.75rem] font-semibold text-gray-700">
                    James T.
                  </span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="flex-1 min-w-[170px]">
              <div className="group bg-white rounded-2xl p-[1.5rem_1rem] w-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-50 max-md:border-gray-100 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[1.5rem] font-extrabold text-[#f97316]">
                      64%
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
                      Before
                    </span>
                  </div>
                  <div className="text-gray-600 text-[1rem] font-bold">➔</div>
                  <div className="flex flex-col items-center">
                    <span className="text-[1.5rem] font-extrabold text-[#10b981]">
                      78%
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
                      After
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[0.8rem] font-bold text-gray-800">
                    Nursing Case Study
                  </strong>
                  <span className="text-[0.7rem] text-gray-500">
                    King's College London
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <img
                    src="/assets/media/layout/testimonial/testimonial5.webp"
                    alt="Olivia D."
                    className="w-6 h-6 rounded-full bg-gray-200 transition-transform duration-300 hover:scale-130"
                  />
                  <span className="text-[0.75rem] font-semibold text-gray-700">
                    Olivia D.
                  </span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="flex-1 min-w-[170px]">
              <div className="group bg-white rounded-2xl p-[1.5rem_1rem] w-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-50 max-md:border-gray-100 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[1.5rem] font-extrabold text-[#f97316]">
                      59%
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
                      Before
                    </span>
                  </div>
                  <div className="text-gray-600 text-[1rem] font-bold">➔</div>
                  <div className="flex flex-col items-center">
                    <span className="text-[1.5rem] font-extrabold text-[#10b981]">
                      74%
                    </span>
                    <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">
                      After
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[0.8rem] font-bold text-gray-800">
                    Law Essay
                  </strong>
                  <span className="text-[0.7rem] text-gray-500">
                    University of Birmingham
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <img
                    src="/assets/media/layout/testimonial/testimonial6.webp"
                    alt="William K."
                    className="w-6 h-6 rounded-full bg-gray-200 transition-transform duration-300 hover:scale-130"
                  />
                  <span className="text-[0.75rem] font-semibold text-gray-700">
                    William K.
                  </span>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* <div className="text-right max-lg:text-left">
            <a
              href="#"
              className="text-[#6d28d9] hover:text-[#4c1d95] text-[0.85rem] font-bold hover:underline transition-colors duration-300 max-md:block max-md:w-full max-md:text-center max-md:py-3 max-md:px-4 max-md:mt-2.5 max-md:bg-white max-md:border max-md:border-gray-200 max-md:rounded-lg max-md:text-[#6d28d9] max-md:font-semibold max-md:text-[0.85rem] max-md:hover:bg-gray-50"
            >
              View More Success Stories ➔
            </a>
          </div> */}
        </div>

        {/* Academic Tools */}
        <div className="rounded-[20px] p-[1.2rem] flex flex-col gap-8 max-md:p-0 max-md:bg-transparent max-md:border-none max-md:shadow-none max-md:gap-5 bg-[#faf5ff] border border-purple-100">
          <AnimateIn variant="fadeUp" className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-gray-900 m-0 mb-2 tracking-tight">
              Academic Tools & Resources
            </h2>
            <p className="text-[0.95rem] text-gray-500 m-0 leading-normal">
              Free tools designed to support your academic journey.
            </p>
          </AnimateIn>

          <StaggerContainer className="flex gap-4 flex-nowrap justify-start overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] pb-2 max-md:flex-col max-md:bg-white max-md:rounded-2xl max-md:p-6 max-md:gap-6 max-md:shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
            <StaggerItem className="flex-1 min-w-[110px] max-w-[140px] max-md:max-w-full">
              <a
                href="#"
                className="group bg-white rounded-[14px] p-[1.4rem_0.8rem] flex flex-col items-center justify-center gap-3 w-full text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(109,40,217,0.08)] max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-4 max-md:p-0 max-md:bg-transparent max-md:shadow-none max-md:hover:translate-y-0"
              >
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-transparent max-md:bg-gray-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth="2"
                    className="w-7 h-7 max-md:w-5 max-md:h-5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <circle cx="10" cy="13" r="2" />
                    <line x1="11.41" y1="14.41" x2="13.5" y2="16.5" />
                  </svg>
                </div>
                <span className="block max-md:hidden text-[0.8rem] font-bold text-gray-800 leading-tight">
                  Grade
                  <br />
                  Calculator
                </span>
                <div className="hidden max-md:flex flex-col items-start text-left gap-0.5">
                  <strong className="text-[0.85rem] font-bold text-gray-900">
                    Grade Calculator
                  </strong>
                  <span className="text-[0.75rem] text-gray-500 font-medium">
                    Calculate your target grade
                  </span>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem className="flex-1 min-w-[110px] max-w-[140px] max-md:max-w-full">
              <a
                href="#"
                className="group bg-white rounded-[14px] p-[1.4rem_0.8rem] flex flex-col items-center justify-center gap-3 w-full text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(109,40,217,0.08)] max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-4 max-md:p-0 max-md:max-w-full max-md:bg-transparent max-md:shadow-none max-md:hover:translate-y-0"
              >
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-transparent max-md:bg-orange-50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    className="w-7 h-7 max-md:w-5 max-md:h-5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                </div>
                <span className="block max-md:hidden text-[0.8rem] font-bold text-gray-800 leading-tight">
                  Reference
                  <br />
                  Generator
                </span>
                <div className="hidden max-md:flex flex-col items-start text-left gap-0.5">
                  <strong className="text-[0.85rem] font-bold text-gray-900">
                    Reference Generator
                  </strong>
                  <span className="text-[0.75rem] text-gray-500 font-medium">
                    APA, Harvard, MLA & more
                  </span>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem className="flex-1 min-w-[110px] max-w-[140px] max-md:max-w-full">
              <a
                href="#"
                className="group bg-white rounded-[14px] p-[1.4rem_0.8rem] flex flex-col items-center justify-center gap-3 w-full text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(109,40,217,0.08)] max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-4 max-md:p-0 max-md:max-w-full max-md:bg-transparent max-md:shadow-none max-md:hover:translate-y-0"
              >
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-transparent max-md:bg-green-50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    className="w-7 h-7 max-md:w-5 max-md:h-5"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <span className="block max-md:hidden text-[0.8rem] font-bold text-gray-800 leading-tight">
                  Plagiarism
                  <br />
                  Checker
                </span>
                <div className="hidden max-md:flex flex-col items-start text-left gap-0.5">
                  <strong className="text-[0.85rem] font-bold text-gray-900">
                    Plagiarism Checker
                  </strong>
                  <span className="text-[0.75rem] text-gray-500 font-medium">
                    Check originality of your work
                  </span>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem className="flex-1 min-w-[110px] max-w-[140px] max-md:max-w-full">
              <a
                href="#"
                className="group bg-white rounded-[14px] p-[1.4rem_0.8rem] flex flex-col items-center justify-center gap-3 w-full text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(109,40,217,0.08)] max-md:flex-row max-md:items-center max-md:justify-start max-md:gap-4 max-md:p-0 max-md:max-w-full max-md:bg-transparent max-md:shadow-none max-md:hover:translate-y-0"
              >
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-transparent max-md:bg-indigo-50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    className="w-7 h-7 max-md:w-5 max-md:h-5"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <span className="block max-md:hidden text-[0.8rem] font-bold text-gray-800 leading-tight">
                  Word
                  <br />
                  Counter
                </span>
                <div className="hidden max-md:flex flex-col items-start text-left gap-0.5">
                  <strong className="text-[0.85rem] font-bold text-gray-900">
                    Word Counter
                  </strong>
                  <span className="text-[0.75rem] text-gray-500 font-medium">
                    Count words instantly
                  </span>
                </div>
              </a>
            </StaggerItem>
          </StaggerContainer>

          {/* <div className="text-left">
            <a
              href="#"
              className="text-[#6d28d9] hover:text-[#4c1d95] text-[0.85rem] font-bold hover:underline transition-colors duration-300 max-md:block max-md:w-full max-md:text-center max-md:py-3 max-md:px-4 max-md:mt-2.5 max-md:bg-white max-md:border max-md:border-gray-200 max-md:rounded-lg max-md:text-[#6d28d9] max-md:font-semibold max-md:text-[0.85rem] max-md:hover:bg-gray-50"
            >
              Explore All Tools ➔
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}
