"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert } from "lucide-react";

interface SeoBlock {
  id: string;
  number: string;
  shortHeading: string;
  rightTitle: string;
  content: React.ReactNode;
}

export default function SeoContentSection() {
  const [activeSection, setActiveSection] = useState(0);

  // Track active section index using client-side scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".seo-content-block");
      if (sections.length === 0) return;

      let activeIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        // Added a 120px offset to align naturally with your scroll-mt-24 margin
        const distance = Math.abs(rect.top - 120);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = i;
        }
      }

      // FIX: Force highlight the last section if the user has scrolled to the bottom of the page
      // This handles cases where the last section is too short to win the minDistance check
      const isAtBottom = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 50;
      
      if (isAtBottom) {
        activeIndex = sections.length - 1;
      }

      setActiveSection(activeIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to establish initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const seoBlocks: SeoBlock[] = [
    {
      id: "trust-and-quality",
      number: "01",
      shortHeading: "Assignment Help UK You Can Actually Trust",
      rightTitle: "Assignment Help UK You Can Actually Trust",
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-[16px] lg:text-[17px]">
          <p>
            Struggling with a deadline, a confusing brief, or a subject you just can't get your head around?
            <strong className="text-gray-900 font-bold"> AssignmentInNeed (AIN)</strong> offers assignment help UK students rely on when things get tight. Whether you need an assignment helper for a single tricky chapter or full help with assignments online from start to finish, our UK-based writers work directly with your module requirements no generic templates, no copy-paste answers.
          </p>
          <p>
            We built AIN around one idea: help with assignments should mean real subject knowledge, real referencing accuracy, and real deadlines met not a rushed, AI-generated draft with your name on it.
          </p>
        </div>
      ),
    },
    {
      id: "why-choose-ain",
      number: "02",
      shortHeading: "Why Students Choose AIN for Assignment Help Online",
      rightTitle: "Why Students Choose AIN for Assignment Help Online",
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-[16px] lg:text-[17px]">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Subject-matched writers",
                desc: "Every assignment helper on our team is matched to your course level and subject not a generalist writing outside their field.",
              },
              {
                title: "100% human-written work",
                desc: "No AI-generated content. Every piece is checked against AI-detection tools before it reaches you, so what you submit reads like your own understanding, properly written.",
              },
              {
                title: "Referencing done right",
                desc: "Harvard, APA, OSCOLA, MLA, whatever your university demands, formatted correctly, not guessed at.",
              },
              {
                title: "UK academic standards",
                desc: "We write to UK marking criteria, not a generic international template repackaged for the UK market.",
              },
              {
                title: "On-time, every time",
                desc: "Deadlines are non-negotiable in academic work. We treat them the same way.",
              },
              {
                title: "Direct communication",
                desc: "You can talk to your assigned writer throughout the process not a support ticket that goes nowhere.",
              },
            ].map((item, idx) => (
              <li key={idx} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3f159a] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[16px] text-gray-900 leading-snug">{item.title}</span>
                  <span className="text-[15px] text-slate-500 leading-snug">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "our-match-process",
      number: "03",
      shortHeading: "Assignment Writing Help, Structured Around You",
      rightTitle: "Assignment Writing Help, Structured Around You",
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-[16px] lg:text-[17px]">
          <p>
            Whether you're looking for assignment services for a single essay or ongoing assignment assistance online across a full term, our process stays the same:
          </p>
          <ol className="grid grid-cols-1 gap-3 pt-2">
            {[
              "Tell us what you need: Share your brief, word count, and deadline.",
              "We match you with a writer: Based on subject, level, and referencing style.",
              "You review and request changes: Nothing goes final until you're satisfied.",
              "You submit with confidence: Properly referenced, plagiarism-checked, and human-written.",
            ].map((step, idx) => (
              <li key={idx} className="flex gap-4 items-center text-[15px] font-semibold text-slate-800 bg-slate-50/50 rounded-xl py-3 px-4 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p>
            This isn't a black box. You know who's working on your assignment and why they were picked.
          </p>
          
          {/* Subsection: Academic Integrity */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">An Honest Note on Academic Integrity</h3>
            <p>
              We're not going to pretend this is a grey area. Assignment help exists to support your understanding model answers, structural guidance, and properly researched drafts you can learn from and build on.
            </p>
            <p className="mt-3">
              What you submit and how you use what we provide is your responsibility under your university's academic integrity policy. We'd rather say that plainly than dodge it in a footnote.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "all-subjects-coverage",
      number: "04",
      shortHeading: "Best Assignment Help Across Every Subject",
      rightTitle: "Best Assignment Help Across Every Subject",
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-[16px] lg:text-[17px]">
          <p>
            From business and law to nursing, computer science, and the humanities, our assignment help services cover undergraduate and postgraduate work across UK universities. If you need help on assignments in a subject that isn't listed here, ask we'll tell you honestly if we have the right expertise before you commit, not after.
          </p>
          <p>
            We don't stretch writers across subjects they're unfamiliar with just to say yes to every request. If a topic falls outside what we can genuinely support well, we'll tell you upfront rather than delivering weak work and hoping you don't notice. That's a deliberate trade-off we'd rather turn down a request than damage the trust that makes people come back for assignment help online again.
          </p>
          <p>
            For students juggling multiple modules, this also means consistency. You're not getting a different quality standard depending on which writer happens to be free. Whether it's a single essay or ongoing assignment services across a term, the same subject-matching process applies every time.
          </p>

          {/* Subsection: Who writes your work */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Assignment Helper UK: Who Actually Writes Your Work</h3>
            <p>
              A lot of assignment help services in the UK outsource to whoever is available that day. We don't work that way. When you come to AIN for assignment writing help, you get a writer who has actually studied and worked in your subject area not a generalist assigned based on availability.
            </p>
            <p className="mt-3">
              This matters more than most students realise. An assignment helper who understands your subject can catch gaps in your brief, flag where your argument is weak, and structure the work the way your marker expects it not just fill word count. That's the difference between assignment assistance that gets you a pass and assignment assistance online that gets you a strong grade.
            </p>
          </div>

          {/* Subsection: Built for UK deadlines */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Assignment Help Services Built for Real UK Deadlines</h3>
            <p>
              Every UK university has its own deadline culture, referencing rules, and marking style. Generic assignment help services that serve a global market don't account for this. AIN does.
            </p>
            <p className="mt-3">
              When you ask for help with assignments UK-based, you're getting:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Writers trained on UK grading rubrics, not adapted from a different education system</li>
              <li>Referencing formatted exactly to your university's required style</li>
              <li>Deadlines treated as fixed, not flexible</li>
              <li>A process where you can ask questions and request changes before you submit anything</li>
            </ul>
            <p className="mt-4">
              This is assignment help online the way it should work transparent, subject-matched, and built around your actual course, not a one-size-fits-all template.
            </p>
            <p className="font-bold text-[#3f159a] border-l-4 border-[#3f159a] pl-4 py-1.5 mt-6">
              Need help with an assignment today? Get in touch and tell us your deadline, subject, and requirements we'll match you with the right assignment helper and give you a straight answer on turnaround before you commit to anything.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="pt-8 pb-4 md:pt-12 md:pb-6 bg-white border-t border-slate-100 flex justify-center">
      <div className="max-w-[1250px] w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
          
          {/* Left Column: Sticky Timeline Index (Desktop Only) */}
          <div className="hidden lg:block lg:w-[35%] sticky top-32 self-start py-4">
            
            <div className="relative pl-6 border-l border-slate-200 flex flex-col gap-6">
              
              {/* Fluid Slider Track line background */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-200" />

              {seoBlocks.map((block, idx) => {
                const isActive = activeSection === idx;
                return (
                  <button
                    key={block.id}
                    onClick={() => handleHeadingClick(block.id)}
                    className="text-left w-full focus:outline-none flex flex-col gap-1 transition-all duration-300 py-1.5 relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute w-[4px] bg-[#3f159a] rounded-full"
                        style={{ left: "-26px", top: "4px", bottom: "4px" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span
                      className={`text-[16px] lg:text-[17px] font-extrabold leading-snug transition-all duration-300 origin-left ${
                        isActive 
                          ? "text-gray-900 scale-100" 
                          : "text-slate-400 hover:text-slate-600 scale-[0.98]"
                      }`}
                    >
                      {block.shortHeading}
                    </span>
                  </button>
                );
              })}
            </div>
            
          </div>

          {/* Right Column: Seamless Content Stream */}
          <div className="w-full lg:w-[65%] flex flex-col">
            {seoBlocks.map((block, index) => (
              <div
                key={block.id}
                id={block.id}
                data-index={index}
                className="seo-content-block py-5 lg:py-7 first:pt-0 last:pb-0 border-b border-slate-100 last:border-none flex flex-col gap-4 scroll-mt-24"
              >
                {/* Mobile Heading Row */}
                <div className="flex lg:hidden items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-[#3f159a] bg-purple-50/70 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {block.shortHeading}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight m-0">
                    {block.rightTitle}
                  </h2>
                </div>

                <div className="mt-2 text-slate-600">
                  {block.content}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}