"use client";

import React from "react";

interface Expert {
  name: string;
  subject: string;
  experience: string;
  rating: number;
  orders: number;
  image: string;
}

const EXPERTS_DATA: Expert[] = [
  {
    name: "Dr. Laura Baker",
    subject: "Business Management",
    experience: "9+ Years Exp.",
    rating: 4.9,
    orders: 1340,
    image: "/assets/media/layout/testimonial/testimonial5.webp"
  },
  {
    name: "Prof. Oliver Bennett",
    subject: "Law Expert",
    experience: "12+ Years Exp.",
    rating: 4.8,
    orders: 2100,
    image: "/assets/media/layout/testimonial/testimonial6.webp"
  },
  {
    name: "Dr. Sophia Adams",
    subject: "Nursing Expert",
    experience: "8+ Years Exp.",
    rating: 4.9,
    orders: 1360,
    image: "/assets/media/layout/testimonial/testimonial1.webp"
  },
  {
    name: "Dr. Daniel Carter",
    subject: "Computer Science",
    experience: "10+ Years Exp.",
    rating: 4.9,
    orders: 1550,
    image: "/assets/media/layout/testimonial/testimonial2.webp"
  }
];

const CHECKLIST_ITEMS = [
  "UK-Based Subject Experts",
  "100% Plagiarism-Free Work",
  "Referencing (APA, Harvard, MLA, OSCOLA)",
  "Unlimited Revisions",
  "24/7 Support & On-Time Delivery",
  "100% Confidential"
];

export const WritersAndTrust: React.FC = () => {
  return (
    <div className="font-sans bg-white flex flex-col">
      {/* 1. Our Academic Experts */}
      <section className="md:py-16 md:px-8 py-8 px-6 bg-white max-w-[1400px] w-full mx-auto" id="experts">
        <div className="mb-10 text-center">
          <h2 className="text-3xl lg:text-[2rem] font-extrabold text-gray-900 m-0 mb-2">Our Academic Experts</h2>
          <p className="text-base text-gray-600 m-0">150+ Subject Experts | PhD & Master's Qualified</p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {EXPERTS_DATA.map((expert, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(109,40,217,0.08)] hover:border-purple-200">
              <img src={expert.image} alt={expert.name} className="w-[90px] h-[90px] rounded-full object-cover mb-4 border-[3px] border-purple-50" />
              <div className="flex flex-col items-center">
                <h3 className="text-[1.1rem] font-bold text-gray-900 m-0 mb-1">{expert.name}</h3>
                <span className="block text-[0.85rem] text-gray-500 mb-1 font-medium">{expert.subject}</span>
                <span className="block text-[0.8rem] text-[#7c3aed] font-semibold mb-2">{expert.experience}</span>
                <div className="inline-flex items-center gap-1 text-[0.8rem] text-gray-600 font-semibold">
                  <span className="text-amber-500 text-[1rem]">★</span>
                  <span>{expert.rating} ({expert.orders}+ Orders)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile vertical list */}
        <div className="flex md:hidden flex-col gap-3 mb-6">
          {EXPERTS_DATA.map((expert, idx) => (
            <div key={idx} className="bg-white rounded-xl p-[1.2rem_1rem] flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#f9fafb]">
              <img src={expert.image} alt={expert.name} className="w-[65px] h-[65px] rounded-full object-cover bg-gray-100" />
              <div className="flex flex-col flex-1 text-left">
                <h3 className="text-[0.95rem] font-bold text-gray-900 m-0 mb-1">{expert.name}</h3>
                <span className="text-[0.75rem] text-gray-500 m-0 mb-1">{expert.subject}</span>
                <span className="text-[0.75rem] text-gray-600 font-semibold m-0 mb-1.5">{expert.experience}</span>
                <div className="flex items-center gap-1.5 text-[0.8rem] text-gray-600 font-semibold">
                  <i className="text-amber-500 not-italic text-[1rem]">★</i>
                  <span>{expert.rating} ({expert.orders}+ Orders)</span>
                </div>
              </div>
              <div className="text-gray-300 text-2xl pl-2 font-bold">&rarr;</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="/writers" className="inline-block py-2.5 px-6 border border-gray-200 rounded-lg text-[#6d28d9] font-bold text-[0.9rem] hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 md:w-auto w-full text-center">View All Experts &rarr;</a>
        </div>
      </section>

      {/* 2. Why Students Choose Section */}
      <section className="py-16 px-8 bg-[#fafaff] border-t border-b border-gray-100 md:py-16 md:px-8 py-8 px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl lg:text-[2rem] font-extrabold text-gray-900 m-0 mb-4 text-center">Why Students Choose <span className="text-blue-500">Assignment In Need</span></h2>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-16 items-center md:gap-10 gap-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none p-0 m-0 md:gap-5 gap-3">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-[0.95rem] font-semibold text-gray-700 md:text-[0.95rem] text-[0.85rem]">
                <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center w-full">
            <div className="bg-[#032b2f] text-white p-[1.5rem_2rem] rounded-xl flex flex-col items-center gap-2 shadow-[0_4px_15px_rgba(3,43,47,0.15)] w-full max-w-[320px] md:max-w-[320px] max-w-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00b67a] text-2xl">★</span>
                <strong className="text-2xl font-bold tracking-tight">Trustpilot</strong>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="w-6 h-6 bg-[#00b67a] text-white flex items-center justify-center text-[0.9rem]">★</span>
                ))}
              </div>
              <span className="text-[0.8rem] opacity-90">Rated 4.9/5 | 25,000+ Reviews</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
