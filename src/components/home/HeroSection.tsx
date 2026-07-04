"use client";

import React, { useState, useRef } from 'react';

export default function HeroSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [projectType, setProjectType] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, mobile, projectType, wordCount, timePeriod });
  };

  const scrollMarqueeLeft = () => {
    if (marqueeWrapperRef.current) {
      marqueeWrapperRef.current.classList.add('user-scrolling');
      marqueeWrapperRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(() => marqueeWrapperRef.current?.classList.remove('user-scrolling'), 1000);
    }
  };

  const scrollMarqueeRight = () => {
    if (marqueeWrapperRef.current) {
      marqueeWrapperRef.current.classList.add('user-scrolling');
      marqueeWrapperRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(() => marqueeWrapperRef.current?.classList.remove('user-scrolling'), 1000);
    }
  };

  return (
    <>
      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 2rem)); }
        }
        @keyframes scrollMarqueeMobile {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.75rem)); }
        }
        .hero-marquee-wrapper:hover .hero-marquee-track,
        .hero-marquee-wrapper.user-scrolling .hero-marquee-track {
          animation-play-state: paused;
        }
        /* Mobile marquee grid */
        @media (max-width: 768px) {
          .hero-marquee-track img:nth-child(7),
          .hero-marquee-track img:nth-child(14) {
            display: none;
          }
          .hero-marquee-track {
            display: grid !important;
            grid-template-rows: 1fr 1fr;
            grid-auto-flow: column;
            gap: 1rem 1.5rem;
            width: max-content;
            animation: scrollMarqueeMobile 20s linear infinite !important;
          }
          .hero-marquee-wrapper {
            overflow: hidden !important;
            padding: 0 1.5rem;
          }
        }
        /* Select box custom arrow */
        .hero-select-box select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 14px;
          padding-right: 16px;
        }
        /* Disable focus visible ring on inputs and selects inside the form */
        #placeOrder input:focus,
        #placeOrder select:focus,
        #placeOrder input:focus-visible,
        #placeOrder select:focus-visible,
        #placeOrder input:active,
        #placeOrder select:active {
          outline: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          --tw-ring-color: transparent !important;
          --tw-ring-offset-width: 0px !important;
          --tw-ring-width: 0px !important;
        }
      `}</style>

    <section className="bg-[url('/new-home-page-images/ain-hero-bg.webp')] max-md:!bg-[#faf5ff] max-md:!bg-none bg-cover bg-center bg-no-repeat pt-6 pb-10 px-4 font-sans overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex flex-row items-center justify-between gap-8 max-lg:flex-col max-lg:items-center max-lg:gap-8">
                {/* Left Content Column */}
                <div className="flex-1 max-w-[650px] z-[2] max-lg:w-full max-lg:max-w-full max-lg:text-center max-lg:flex-none max-md:text-left max-md:items-start">
                    <div className="inline-flex items-center gap-2.5 bg-transparent mb-3 text-[0.78rem] max-[480px]:text-[0.65rem] font-semibold text-gray-800 max-lg:justify-center max-md:justify-start max-md:flex-nowrap max-md:whitespace-nowrap">
                        <div className="flex bg-green-800 py-[3px] px-1.5 rounded gap-0.5 max-[480px]:py-[2px] max-[480px]:px-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-[11px] h-[11px] max-[480px]:w-3 max-[480px]:h-3 text-white">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                        </div>
                        <span className="max-[480px]:whitespace-nowrap max-[480px]:overflow-hidden max-[480px]:text-ellipsis">Rated 4.9/5 by 25,000+ UK Students</span>
                    </div>

                    <h1 className="text-[1.95rem] max-md:text-[2.1rem] max-[480px]:text-[1.8rem] font-extrabold leading-[1.3] text-gray-900 mb-3 line-clamp-3 max-md:text-left">
                        Assignment Help UK That Helps You<br />
                        <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent block mt-1 whitespace-nowrap overflow-hidden text-ellipsis">Score Higher Grades</span>
                    </h1>

                    <div className="max-lg:text-center max-md:text-left">
                        <p className="text-[0.92rem] max-md:text-[0.78rem] text-gray-600 leading-relaxed mb-4">Get expert academic support for essays, reports, dissertations, case studies and more—crafted by
                            subject specialists to help you achieve your academic goals.</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-5 max-lg:justify-center max-md:justify-between max-md:gap-1 max-[480px]:gap-0.5 max-md:w-full max-md:flex-nowrap">
                        {[
                          { icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />, label: '25,000+', sub: 'Assignments\nDelivered' },
                          { icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, label: '150+', sub: 'Subject\nExperts' },
                          { icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, label: '4.9/5', sub: 'Student\nRating' },
                          { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, label: '98%', sub: 'On-Time\nDelivery' }
                        ].map((stat, i) => (
                          <div key={i} className="flex gap-2 max-md:grid max-md:grid-cols-[auto_auto] max-md:grid-rows-[auto_auto] max-md:gap-x-1 max-md:gap-y-0.5 max-md:items-center max-md:justify-center">
                            <div className="w-[13px] h-[13px] max-md:w-4 max-md:h-4 max-[480px]:w-3.5 max-[480px]:h-3.5 text-gray-500 max-md:col-start-1 max-md:row-start-1">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">{stat.icon}</svg>
                            </div>
                            <div className="flex flex-col text-[0.7rem] text-gray-600 max-md:contents">
                              <strong className="text-[0.78rem] max-[480px]:text-[0.65rem] text-gray-900 font-bold max-md:col-start-2 max-md:row-start-1 max-md:whitespace-nowrap max-md:text-left">{stat.label}</strong>
                              <span className="max-md:col-span-full max-md:row-start-2 max-md:text-[0.65rem] max-[480px]:text-[0.55rem] max-md:text-center max-md:leading-tight" dangerouslySetInnerHTML={{ __html: stat.sub.replace('\n', '<br/>') }} />
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-3 flex-wrap max-lg:justify-center max-md:!hidden">
                        <a href="/upload-your-assignment" className="bg-[#7c3aed] text-white py-[9px] px-4 rounded-lg no-underline font-semibold inline-flex items-center transition-all duration-300 border border-transparent hover:bg-[#6d28d9] hover:text-white hover:-translate-y-0.5">Get Free Quote &rarr;</a>
                        <a href="/writers" className="bg-white text-gray-900 py-[9px] px-4 rounded-lg no-underline font-semibold inline-flex items-center border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5">View Our Experts &rarr;</a>
                    </div>
                </div>

                {/* Middle Image Column */}
                <div className="flex-1 flex justify-center relative z-[1] max-lg:order-2 max-lg:mt-8 max-lg:w-full max-lg:max-w-[450px] max-lg:flex-none">
                    <div className="relative w-full max-w-[360px] min-h-[320px]">
                        <img 
                          src="/new-home-page-images/New-Hero-Bg.webp" 
                          alt="Student" 
                          className="hidden max-md:block w-full h-auto rounded-[20px] max-md:max-h-[380px] max-md:object-contain max-md:mx-auto" 
                        />

                        {/* Floating Badges */}
                        <div className="absolute bg-white py-2 px-3 rounded-xl flex items-center gap-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] top-[10%] left-[-10%] max-md:left-[2%] max-md:top-[5%] max-md:p-[6px_10px] max-md:gap-2 max-md:scale-90" style={{ animation: 'float 6s ease-in-out infinite 0s' }}>
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-[#7c3aed]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-[0.65rem] text-gray-500">
                                <strong className="text-[0.78rem] text-gray-900 font-bold">100%</strong>
                                <span>Plagiarism Free</span>
                            </div>
                        </div>

                        <div className="absolute bg-white py-2 px-3 rounded-xl flex items-center gap-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] bottom-[30%] left-[-15%] max-md:left-[-2%] max-md:bottom-[35%] max-md:p-[6px_10px] max-md:gap-2 max-md:scale-90" style={{ animation: 'float 6s ease-in-out infinite 2s' }}>
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]">
                                    <polyline points="23 4 23 10 17 10" />
                                    <polyline points="1 20 1 14 7 14" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-[0.65rem] text-gray-500">
                                <strong className="text-[0.78rem] text-gray-900 font-bold">Unlimited</strong>
                                <span>Revisions</span>
                            </div>
                        </div>

                        <div className="absolute bg-white py-2 px-3 rounded-xl flex items-center gap-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] bottom-[10%] right-[-5%] max-md:left-[calc(50%-80px)] max-md:bottom-[5%] max-md:right-auto max-md:top-auto max-md:p-[6px_10px] max-md:gap-2 max-md:scale-90" style={{ animation: 'float 6s ease-in-out infinite 4s' }}>
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-[0.65rem] text-gray-500">
                                <strong className="text-[0.78rem] text-gray-900 font-bold">24/7</strong>
                                <span>Live Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form Column */}
                <div className="flex-[0_0_350px] z-[2] max-lg:order-3 max-lg:mt-8 max-lg:w-full max-lg:max-w-[450px] max-lg:flex-none max-md:w-full max-md:flex-1">
                    <div className="bg-white rounded-2xl p-[0.8rem_1rem] max-md:p-[1.2rem] max-[480px]:p-[1rem_0.8rem] border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                            <span className="text-[1.2rem]" style={{ filter: 'grayscale(100%) opacity(0.6)' }}>✨</span>
                            <h3 className="text-[0.95rem] font-bold text-gray-900 m-0 mx-2 capitalize leading-snug whitespace-nowrap">Get Instant Quote</h3>
                            <span className="text-[1.2rem]" style={{ filter: 'grayscale(100%) opacity(0.6)' }}>✨</span>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-[0.15rem]" id="placeOrder">
                             {/* Name */}
                             <div className="flex items-center justify-between mb-1.5 gap-[15px] max-md:gap-2.5 max-[480px]:gap-1.5">
                                 <div className="flex items-center gap-3 flex-1 max-[480px]:gap-1.5">
                                     <span className="w-6 h-6 max-[480px]:w-[26px] max-[480px]:h-[26px] rounded-lg flex items-center justify-center bg-purple-100 text-[#7c3aed]">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 max-[480px]:w-[13px] max-[480px]:h-[13px]">
                                             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                             <circle cx="12" cy="7" r="4" />
                                         </svg>
                                     </span>
                                     <label className="text-[0.78rem] max-[480px]:text-[0.65rem] font-bold text-gray-800 m-0 whitespace-nowrap">Name</label>
                                 </div>
                                 <div className="hero-select-box flex-1 max-w-[170px] max-[480px]:max-w-[150px] max-[480px]:min-w-0 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                     <input 
                                         type="text" 
                                         name="name" 
                                         required 
                                         placeholder="Enter Name"
                                         value={name} 
                                         onChange={(e) => setName(e.target.value)}
                                         className="w-full border-none bg-transparent text-[0.7rem] text-slate-800 outline-none font-medium py-1 box-border placeholder:text-gray-400 focus:outline-none focus:border-none focus:shadow-none"
                                     />
                                 </div>
                             </div>

                             {/* Email */}
                             <div className="flex items-center justify-between mb-1.5 gap-[15px] max-md:gap-2.5 max-[480px]:gap-1.5">
                                 <div className="flex items-center gap-3 flex-1 max-[480px]:gap-1.5">
                                     <span className="w-6 h-6 max-[480px]:w-[26px] max-[480px]:h-[26px] rounded-lg flex items-center justify-center bg-blue-100 text-blue-500">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 max-[480px]:w-[13px] max-[480px]:h-[13px]">
                                             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                             <polyline points="22,6 12,13 2,6" />
                                         </svg>
                                     </span>
                                     <label className="text-[0.78rem] max-[480px]:text-[0.65rem] font-bold text-gray-800 m-0 whitespace-nowrap">Email</label>
                                 </div>
                                 <div className="hero-select-box flex-1 max-w-[170px] max-[480px]:max-w-[150px] max-[480px]:min-w-0 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                     <input 
                                         type="email" 
                                         name="email" 
                                         required 
                                         placeholder="Enter Email"
                                         value={email} 
                                         onChange={(e) => setEmail(e.target.value)}
                                         className="w-full border-none bg-transparent text-[0.7rem] text-slate-800 outline-none font-medium py-1 box-border placeholder:text-gray-400 focus:outline-none focus:border-none focus:shadow-none"
                                     />
                                 </div>
                             </div>

                             {/* Mobile No */}
                             <div className="flex items-center justify-between mb-1.5 gap-[15px] max-md:gap-2.5 max-[480px]:gap-1.5">
                                 <div className="flex items-center gap-3 flex-1 max-[480px]:gap-1.5">
                                     <span className="w-6 h-6 max-[480px]:w-[26px] max-[480px]:h-[26px] rounded-lg flex items-center justify-center bg-red-100 text-red-500">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 max-[480px]:w-[13px] max-[480px]:h-[13px]">
                                             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                         </svg>
                                     </span>
                                     <label className="text-[0.78rem] max-[480px]:text-[0.65rem] font-bold text-gray-800 m-0 whitespace-nowrap">Mobile No</label>
                                 </div>
                                 <div className="hero-select-box flex-1 max-w-[170px] max-[480px]:max-w-[150px] max-[480px]:min-w-0 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none">
                                     <input 
                                         type="tel" 
                                         name="mobile" 
                                         required 
                                         placeholder="Enter Mobile"
                                         value={mobile} 
                                         onChange={(e) => setMobile(e.target.value)}
                                         className="w-full border-none bg-transparent text-[0.7rem] text-slate-800 outline-none font-medium py-1 box-border placeholder:text-gray-400 focus:outline-none focus:border-none focus:shadow-none"
                                     />
                                 </div>
                             </div>

                             {/* Project Type */}
                             <div className="flex items-center justify-between mb-1.5 gap-[15px] max-md:gap-2.5 max-[480px]:gap-1.5">
                                 <div className="flex items-center gap-3 flex-1 max-[480px]:gap-1.5">
                                     <span className="w-6 h-6 max-[480px]:w-[26px] max-[480px]:h-[26px] rounded-lg flex items-center justify-center bg-green-100 text-green-500">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 max-[480px]:w-[13px] max-[480px]:h-[13px]">
                                             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                             <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                         </svg>
                                     </span>
                                     <label className="text-[0.78rem] max-[480px]:text-[0.65rem] font-bold text-gray-800 m-0 whitespace-nowrap">Project Type</label>
                                 </div>
                                 <div className="hero-select-box flex-1 max-w-[170px] max-[480px]:max-w-[150px] max-[480px]:min-w-0 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                     <select 
                                         name="projectType" 
                                         required 
                                         value={projectType} 
                                         onChange={(e) => setProjectType(e.target.value)}
                                         className="w-full border-none bg-transparent outline-none text-[0.75rem] max-[480px]:text-[0.65rem] text-slate-800 py-[0.2rem] cursor-pointer appearance-none font-medium whitespace-nowrap focus:outline-none focus:border-none focus:shadow-none max-md:text-ellipsis max-md:overflow-hidden max-md:whitespace-nowrap"
                                     >
                                         <option value="">Select Level</option>
                                         <option value="Assignment">Assignment</option>
                                         <option value="Dissertation">Dissertation</option>
                                         <option value="Thesis">Thesis</option>
                                         <option value="Research Project">Research Project</option>
                                     </select>
                                 </div>
                             </div>

                             {/* Word Count */}
                             <div className="flex items-center justify-between mb-1.5 gap-[15px] max-md:gap-2.5 max-[480px]:gap-1.5">
                                 <div className="flex items-center gap-3 flex-1 max-[480px]:gap-1.5">
                                     <span className="w-6 h-6 max-[480px]:w-[26px] max-[480px]:h-[26px] rounded-lg flex items-center justify-center bg-pink-100 text-pink-500">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 max-[480px]:w-[13px] max-[480px]:h-[13px]">
                                             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                             <polyline points="14 2 14 8 20 8" />
                                             <line x1="16" y1="13" x2="8" y2="13" />
                                             <line x1="16" y1="17" x2="8" y2="17" />
                                         </svg>
                                     </span>
                                     <label className="text-[0.78rem] max-[480px]:text-[0.65rem] font-bold text-gray-800 m-0 whitespace-nowrap">Word Count</label>
                                 </div>
                                 <div className="hero-select-box flex-1 max-w-[170px] max-[480px]:max-w-[150px] max-[480px]:min-w-0 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                     <select 
                                         name="wordCount" 
                                         required 
                                         value={wordCount} 
                                         onChange={(e) => setWordCount(e.target.value)}
                                         className="w-full border-none bg-transparent outline-none text-[0.75rem] max-[480px]:text-[0.65rem] text-slate-800 py-[0.2rem] cursor-pointer appearance-none font-medium whitespace-nowrap focus:outline-none focus:border-none focus:shadow-none max-md:text-ellipsis max-md:overflow-hidden max-md:whitespace-nowrap"
                                     >
                                         <option value="">Select Word Count</option>
                                         <option value="250">250 Words / 1 Page</option>
                                         <option value="500">500 Words / 2 Pages</option>
                                         <option value="1000">1000 Words / 4 Pages</option>
                                         <option value="1500">1500 Words / 6 Pages</option>
                                         <option value="2000">2000 Words / 8 Pages</option>
                                         <option value="2500">2500 Words / 10 Pages</option>
                                         <option value="3000">3000 Words / 12 Pages</option>
                                         <option value="4000">4000 Words / 16 Pages</option>
                                         <option value="5000">5000+ Words</option>
                                     </select>
                                 </div>
                             </div>

                             {/* Time Period */}
                             <div className="flex items-center justify-between mb-1.5 gap-[15px] max-md:gap-2.5 max-[480px]:gap-1.5">
                                 <div className="flex items-center gap-3 flex-1 max-[480px]:gap-1.5">
                                     <span className="w-6 h-6 max-[480px]:w-[26px] max-[480px]:h-[26px] rounded-lg flex items-center justify-center bg-yellow-100 text-yellow-600">
                                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 max-[480px]:w-[13px] max-[480px]:h-[13px]">
                                             <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                             <line x1="16" y1="2" x2="16" y2="6" />
                                             <line x1="8" y1="2" x2="8" y2="6" />
                                             <line x1="3" y1="10" x2="21" y2="10" />
                                         </svg>
                                     </span>
                                     <label className="text-[0.78rem] max-[480px]:text-[0.65rem] font-bold text-gray-800 m-0 whitespace-nowrap">Time Period</label>
                                 </div>
                                 <div className="hero-select-box flex-1 max-w-[170px] max-[480px]:max-w-[150px] max-[480px]:min-w-0 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                     <select 
                                         name="timePeriod" 
                                         required 
                                         value={timePeriod} 
                                         onChange={(e) => setTimePeriod(e.target.value)}
                                         className="w-full border-none bg-transparent outline-none text-[0.75rem] max-[480px]:text-[0.65rem] text-slate-800 py-[0.2rem] cursor-pointer appearance-none font-medium whitespace-nowrap focus:outline-none focus:border-none focus:shadow-none max-md:text-ellipsis max-md:overflow-hidden max-md:whitespace-nowrap"
                                     >
                                         <option value="">Select Deadline</option>
                                         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((d) => (
                                             <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>
                                         ))}
                                         <option value="16 to 20">16-20 Days</option>
                                         <option value="21+">21+ Days</option>
                                     </select>
                                 </div>
                             </div>

                             {/* Hidden inputs */}
                             <input type="hidden" name="workType" value="Standard" />
                             <input type="hidden" name="topic" value="Ordered from New Hero Form" />
                             <input type="hidden" name="requirements" value="Please refer to subject and service level." />
                             <input type="hidden" name="estimatedPrice" value="0" />
                             <input type="hidden" name="discount" value="0" />
                             <input type="hidden" name="finalPrice" value="0" />

                            <div className="mt-4 mb-4 flex justify-center">
                                <div className="g-recaptcha" data-sitekey="" style={{ transform: 'scale(0.85)', WebkitTransform: 'scale(0.85)', transformOrigin: '0 0', WebkitTransformOrigin: '0 0' }}></div>
                            </div>

                            <button type="submit" className="bg-orange-500 text-white border-none py-[9px] px-3 rounded-lg text-[0.78rem] font-semibold cursor-pointer transition-all duration-300 w-full shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:text-white hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(249,115,22,0.4)] whitespace-nowrap">Get Price Now &rarr;</button>

                            <div className="flex justify-between mt-1.5 text-[0.65rem] text-gray-500 max-[480px]:flex-row max-[480px]:justify-between max-[480px]:text-[0.65rem]">
                                <span className="flex items-center gap-1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" className="w-3 h-3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg> 
                                    It&apos;s free
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" className="w-3 h-3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg> 
                                    No obligation
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" className="w-3 h-3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg> 
                                    Quick response
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

      {/* University Marquee */}
      <div className="w-full flex justify-center relative mt-8 z-10 px-4">
        <div className="bg-white rounded-[30px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] max-w-[1200px] w-full py-3 px-6 flex flex-col items-center overflow-hidden border border-white/50">
          <h4 className="text-[0.9rem] font-bold text-gray-900 m-0 mb-4 text-center">Trusted by Students from Top UK Universities</h4>
          <div className="flex items-center w-full relative gap-3">
            <button className="bg-transparent border-none cursor-pointer text-[#7c3aed] flex items-center justify-center p-[5px] rounded-full transition-all duration-300 shrink-0 z-[2] hover:bg-purple-100 max-md:absolute max-md:w-7 max-md:h-7 max-md:p-0.5 max-md:z-10 max-md:bg-transparent max-md:left-[-5px] max-md:top-[75%] max-md:-translate-y-1/2" onClick={scrollMarqueeLeft}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="hero-marquee-wrapper w-full overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [&::-webkit-scrollbar]:hidden" ref={marqueeWrapperRef}>
              <div className="hero-marquee-track flex items-center gap-16 w-max" style={{ animation: 'scrollMarquee 25s linear infinite' }}>
                <img src="/assets/media/layout/university/oxford.jpg" alt="University of Oxford" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/cambridge.png" alt="University of Cambridge" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/ucl.png" alt="UCL" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/manchester.jpg" alt="University of Manchester" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/birmingham.png" alt="University of Birmingham" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/kingslondon.png" alt="King's College London" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/leedsuni.png" alt="University of Leeds" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />

                {/* Repeat for Infinite Loop */}
                <img src="/assets/media/layout/university/oxford.jpg" alt="University of Oxford" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/cambridge.png" alt="University of Cambridge" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/ucl.png" alt="UCL" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/manchester.jpg" alt="University of Manchester" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/birmingham.png" alt="University of Birmingham" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/kingslondon.png" alt="King's College London" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
                <img src="/assets/media/layout/university/leedsuni.png" alt="University of Leeds" className="h-8 max-md:h-[25px] w-auto object-contain transition-all duration-300 shrink-0 hover:scale-105" />
              </div>
            </div>

            <button className="bg-transparent border-none cursor-pointer text-[#7c3aed] flex items-center justify-center p-[5px] rounded-full transition-all duration-300 shrink-0 z-[2] hover:bg-purple-100 max-md:absolute max-md:w-7 max-md:h-7 max-md:p-0.5 max-md:z-10 max-md:bg-transparent max-md:right-[-5px] max-md:top-[25%] max-md:-translate-y-1/2" onClick={scrollMarqueeRight}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px]">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
