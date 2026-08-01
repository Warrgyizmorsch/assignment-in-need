"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
  containerClassName?: string;
}

export function FaqAccordion({
  title = "Frequently Asked Questions",
  description,
  faqs,
  containerClassName = "py-10 md:py-14 bg-[#faf9fe] border-t border-slate-100",
}: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={containerClassName}>
      <div className="max-w-[900px] mx-auto px-4 text-left">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-[22px] md:text-[28px] font-[900] text-[#0f1b3d] tracking-tight font-heading mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-slate-500 font-medium">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-[#0f1b3d] text-sm md:text-base hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#3f159a] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#3f159a]" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-3 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
