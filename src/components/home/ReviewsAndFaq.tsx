"use client";

import React, { useState } from 'react';

interface Review {
  name: string;
  meta: string;
  text: string;
  image: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function ReviewsAndFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const reviews: Review[] = [
    {
      name: 'Emily R.',
      meta: 'University of Leeds',
      text: 'Amazing experience! The expert understood my requirements perfectly and delivered on time.',
      image: '/assets/media/layout/testimonial/testimonial1.webp'
    },
    {
      name: 'Daniel K.',
      meta: 'University of Manchester',
      text: 'High-quality work and excellent communication. Helped me secure a top grade.',
      image: '/assets/media/layout/testimonial/testimonial2.webp'
    },
    {
      name: 'Sophia L.',
      meta: 'King\'s College London',
      text: 'Very professional and reliable service. Highly recommended for every student.',
      image: '/assets/media/layout/testimonial/testimonial3.webp'
    },
    {
      name: 'James T.',
      meta: 'University of Birmingham',
      text: 'Got my assignment before the deadline and it was beyond my expectations.',
      image: '/assets/media/layout/testimonial/testimonial4.webp'
    }
  ];

  const faqs: FaqItem[] = [
    {
      question: 'Is assignment help legal in the UK?',
      answer: 'Yes, seeking assignment help is completely legal. Our services are designed to provide research assistance, model papers, and academic guidance to help you understand your topic better and improve your own writing.'
    },
    {
      question: 'How fast can you deliver my order?',
      answer: 'We offer flexible delivery options ranging from standard delivery (few days) to urgent delivery within 24 hours or even less, depending on the complexity of the task.'
    },
    {
      question: 'Will my assignment be plagiarism-free?',
      answer: 'Absolutely. Every paper is written from scratch by our experts. We also provide a free plagiarism report with your completed order to guarantee its originality.'
    },
    {
      question: 'Can I communicate with my expert?',
      answer: 'Yes, you can easily communicate with your assigned expert through our secure messaging portal to track progress, provide additional materials, or ask questions.'
    },
    {
      question: 'Do you offer unlimited revisions?',
      answer: 'Yes, we offer unlimited free revisions within a specified timeframe to ensure you are 100% satisfied with the final work delivered.'
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className="py-12 px-8 max-md:py-8 max-md:px-4 bg-[#fafaff] font-sans flex justify-center border-t border-gray-100">
      <div className="max-w-[1200px] w-full grid grid-cols-[1.3fr_0.9fr] max-lg:grid-cols-1 gap-12">
        
        {/* Reviews Column */}
        <div className="flex flex-col">
          <div>
            <h2 className="text-[1.6rem] font-extrabold text-gray-900 mb-6 tracking-tight">What Students Say <span className="text-blue-600">About Us</span></h2>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-[1.25rem_1rem] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3">
                  <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-gray-200" />
                  <div className="flex flex-col">
                    <strong className="text-[0.85rem] text-gray-900 leading-tight">{r.name}</strong>
                    <span className="text-[0.75rem] text-gray-500">{r.meta}</span>
                  </div>
                </div>
                <div className="text-amber-400 text-[1rem] tracking-widest">
                  ★★★★★
                </div>
                <p className="text-[0.82rem] text-gray-600 leading-relaxed m-0">{r.text}</p>
              </div>
            ))}
          </div>

          <div className="text-right mt-6">
            <a href="/review" className="text-[#6d28d9] hover:text-[#4c1d95] text-[0.85rem] font-bold no-underline hover:underline transition-colors duration-300 max-md:block max-md:w-full max-md:text-center max-md:py-3 max-md:mt-2.5 max-md:bg-white max-md:border max-md:border-gray-200 max-md:rounded-lg max-md:no-underline">View More Reviews →</a>
          </div>
        </div>

        {/* FAQ Column */}
        <div className="flex flex-col">
          <div>
            <h2 className="text-[1.6rem] font-extrabold text-gray-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-0 border-t border-gray-100 max-md:gap-3 max-md:border-t-0">
            {faqs.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div key={idx} className={`border-b border-gray-100 max-md:bg-white max-md:rounded-xl max-md:border-none max-md:shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-md:px-4`}>
                  <button 
                    className={`w-full text-left bg-transparent border-none py-5 max-md:py-4 flex justify-between items-center cursor-pointer text-[0.95rem] font-semibold transition-colors duration-200 font-[inherit] ${isActive ? 'text-indigo-600' : 'text-gray-800 hover:text-indigo-600'}`}
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.question}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-[18px] h-[18px] text-[#6d28d9] shrink-0 ml-4 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div 
                    className="overflow-hidden" 
                    style={{ 
                      maxHeight: isActive ? '200px' : '0px',
                      transition: 'max-height 0.3s ease-out'
                    }}
                  >
                    <p className="pb-5 m-0 text-[0.9rem] text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-left mt-6">
            <a href="/faq" className="text-[#6d28d9] hover:text-[#4c1d95] text-[0.85rem] font-bold no-underline hover:underline transition-colors duration-300 max-md:block max-md:w-full max-md:text-center max-md:py-3 max-md:mt-2.5 max-md:bg-white max-md:border max-md:border-gray-200 max-md:rounded-lg max-md:no-underline">View All FAQs →</a>
          </div>
        </div>

      </div>
    </section>
  );
}
