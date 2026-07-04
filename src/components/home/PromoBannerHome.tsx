"use client";

import React from 'react';

export default function PromoBannerHome() {
  return (
    <section className="py-8 px-4 md:py-12 md:px-8 bg-white font-sans flex justify-center">
      <div className="max-w-[1400px] w-full">
        <div className="bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#3b0764] rounded-2xl md:rounded-[24px] p-8 md:p-[2.5rem_3rem] flex flex-col lg:flex-row justify-between items-center lg:items-center text-center lg:text-left shadow-[0_20px_40px_-10px_rgba(76,29,149,0.4)] relative overflow-hidden gap-8 lg:gap-12">
          {/* Subtle glowing background effect */}
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(216,180,254,0.2)_0%,transparent_70%)] rounded-full pointer-events-none"></div>

          <div className="flex flex-col gap-1 z-[2] shrink-0 min-w-[250px] items-center lg:items-start">
            <span className="text-base font-semibold tracking-wider text-gray-200">GET UP TO</span>
            <h2 className="text-[3rem] md:text-[3.5rem] font-[900] text-amber-400 m-0 leading-none [text-shadow:2px_2px_0_rgba(0,0,0,0.2)]">30% OFF</h2>
            <span className="text-[1.1rem] font-bold tracking-wide mb-2">ON YOUR FIRST ORDER</span>
            <div className="bg-white text-[#4c1d95] inline-block py-2 px-4 rounded-full text-[0.9rem] font-semibold my-2 w-max">Use Code: <strong>AIN30</strong></div>
            <p className="text-[0.75rem] text-gray-300 m-0">Hurry! Offer valid for limited time only.</p>
          </div>

          <div className="flex flex-col gap-5 z-[2] flex-1 w-full">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="text-[1.1rem] text-purple-300 opacity-80">✦</span>
              <h3 className="text-[1.1rem] md:text-[1.2rem] font-bold m-0 text-white tracking-wide">All These, Absolutely FREE!</h3>
            </div>

            <div className="grid grid-cols-3 md:flex md:flex-wrap lg:flex-nowrap gap-2 md:gap-3 w-full justify-between">
              {[
                {
                  title: <>Plagiarism<br />Report</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <circle cx="10" cy="13" r="2" />
                      <line x1="11.41" y1="14.41" x2="13.5" y2="16.5" />
                    </svg>
                  )
                },
                {
                  title: <>Rewriting &<br />Paraphrasing</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3v2M17 19v2M3 17h2M19 17h2M3 7h2M19 7h2M7 3v2M7 19v2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )
                },
                {
                  title: <>Title Page</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                      <line x1="9" y1="11" x2="11" y2="11" />
                    </svg>
                  )
                },
                {
                  title: <>Bibliography</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  )
                },
                {
                  title: <>Formatting</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="21" y1="6" x2="3" y2="6" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                      <line x1="21" y1="18" x2="7" y2="18" />
                    </svg>
                  )
                },
                {
                  title: <>Unlimited<br />Revisions</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l3.25 1.64" />
                    </svg>
                  )
                },
                {
                  title: <>24/7<br />Support</>,
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <circle cx="12" cy="11" r="3" />
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-xl md:rounded-[14px] p-3 md:p-[1rem_0.5rem] flex flex-col items-center justify-center gap-2 flex-1 md:max-w-[110px] md:min-w-[90px] md:min-h-[110px] min-h-[90px] text-center shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 ${
                    idx === 6 ? 'col-start-2' : ''
                  }`}
                >
                  <div className="w-[32px] h-[32px] md:w-[26px] md:h-[26px] md:bg-transparent bg-purple-50 md:p-0 p-1.5 rounded-full md:rounded-none flex items-center justify-center text-violet-800">
                    {item.svg}
                  </div>
                  <span className="text-[0.55rem] md:text-[0.65rem] font-bold text-gray-800 leading-[1.3] whitespace-normal">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
