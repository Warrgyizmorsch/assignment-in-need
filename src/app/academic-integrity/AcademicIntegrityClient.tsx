"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Bot,
  ChevronDown,
} from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Is using AI for an assignment cheating?",
    answer:
      "Not always. It is cheating when your university bans the use, or when you submit AI-written text as your own without the disclosure your course requires. Using AI to explain a concept is treated differently from using it to write your paragraphs. Because rules vary by university and sometimes by module, read the assignment brief first and ask your tutor in writing if it doesn't say.",
  },
  {
    question: "Is accidental plagiarism still academic misconduct?",
    answer:
      "It can be. Many universities separate careless referencing from deliberate copying, and the penalty is often lighter for the first. But the policy decides, not your intention. Missing quotation marks or an uncredited paraphrase can still be flagged. Referencing as you write is the simplest way to avoid it.",
  },
  {
    question: "Do all UK universities have the same academic integrity policy?",
    answer:
      "No. Each university writes its own policy, so definitions, procedures and penalties differ. The principles are similar everywhere: original work, credited sources and fair assessment. Always follow the version published by your own institution, and check your module handbook for extra rules.",
  },
  {
    question: "Is contract cheating illegal for students?",
    answer:
      "In England, the Skills and Post-16 Education Act 2022 made it an offence to provide or advertise contract cheating services to students. The offence targets providers, not students. That doesn't make it safe for students. Your university can still treat submitting purchased work as serious misconduct. Rules in Scotland, Wales and Northern Ireland differ, so check the current position on gov.uk.",
  },
];

const AI_RULES_TABLE = [
  {
    usage: "Spell-check and basic grammar tools",
    position: "Usually allowed",
    tag: "Allowed",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    usage: "Brainstorming ideas or explaining a concept",
    position: "Often allowed, sometimes with a short disclosure note",
    tag: "Conditional",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    usage: "Rewriting or paraphrasing your own paragraphs",
    position: "Varies. Check the assignment brief",
    tag: "Check Brief",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    usage: "Submitting AI-written text as your own work",
    position: "Usually treated as misconduct",
    tag: "Prohibited",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export default function AcademicIntegrityClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.assignmentinneed.co.uk/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Academic Integrity",
        item: "https://www.assignmentinneed.co.uk/academic-integrity",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Academic Integrity Policy: UK Student Guide",
    description:
      "Academic integrity policy explained for UK students: what counts as misconduct, the rules on AI, likely outcomes and how to protect yourself.",
    publisher: {
      "@type": "Organization",
      name: "Assignment In Need",
      logo: {
        "@type": "ImageObject",
        url: "https://assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.assignmentinneed.co.uk/academic-integrity",
    },
  };

  return (
    <div className="font-sans text-gray-800 bg-[#fbfbfe] min-h-screen pb-16">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* Header Hero Banner */}
      <section className="relative w-full bg-gradient-to-r from-[#3f159a] to-[#250d5e] text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1000px] mx-auto px-6 text-left relative z-10">
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Academic Integrity</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-300/30 px-3.5 py-1 rounded-full mb-3 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                Official Student Reference
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
              Academic Integrity Policy: UK Student Guide
            </h1>
            <p className="text-xs md:text-sm text-purple-100 font-medium max-w-2xl leading-relaxed">
              Academic integrity policy explained for UK students: what counts as misconduct, the rules on AI, likely outcomes and how to protect yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Card */}
      <AnimateIn
        variant="fadeUp"
        delay={0.15}
        as="main"
        className="max-w-[1000px] mx-auto px-6 mt-8 md:mt-12 block"
      >
        <div className="bg-white rounded-3xl border border-gray-150/70 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 md:p-10 flex flex-col gap-9 text-left">
          {/* Section 1 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              What Is an Academic Integrity Policy? A Plain-English Guide for UK Students
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              An academic integrity policy is the set of rules a university uses to define honest academic work and to deal with work that breaks those rules. Every UK university has one. The wording differs, but the core idea is the same: the work you submit must be yours, your sources must be credited, and you must not gain an unfair edge over other students.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Most students read their policy only after something goes wrong. That&apos;s a mistake. The policy decides what counts as misconduct, who investigates, and what happens next. This guide explains it in plain English.
            </p>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              What Does an Academic Integrity Policy Actually Cover?
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              An academic integrity policy covers how you must produce, source and submit assessed work, and what the university does when those rules are broken. Most policies contain four parts:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {[
                "A definition of acceptable work (your own ideas, properly referenced)",
                "A list of behaviours treated as misconduct",
                "The process for investigating an allegation",
                "The range of penalties",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 bg-purple-50/30 border border-purple-100/60 rounded-xl text-xs md:text-sm font-semibold text-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium mt-2">
              Some also add rules on AI tools, group work and exams. The policy usually sits inside a larger academic regulations handbook on the student portal. If you can&apos;t find it under &ldquo;integrity&rdquo;, search for &ldquo;academic misconduct&rdquo;. Many universities use that heading instead.
            </p>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              Why Do UK Universities Take Academic Integrity So Seriously?
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Universities take it seriously because a degree is only worth something if everyone earned it fairly. If one student can buy or copy a result, every honest graduate&apos;s qualification loses value.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              There&apos;s a practical side too. Courses such as nursing, teaching and law lead into regulated professions, where a record of dishonesty can follow you into fitness-to-practise checks. Employers also ask universities for references. A misconduct finding is not something you want attached to your name.
            </p>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              Types of Academic Misconduct at UK Universities
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Academic misconduct is any attempt to gain credit for work that doesn&apos;t truly reflect your own effort and understanding. These are the types you&apos;ll see in most policies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              {[
                {
                  title: "Plagiarism",
                  desc: "using someone's words, ideas or data without credit. This includes copying from classmates, websites and your own earlier submissions (self-plagiarism).",
                },
                {
                  title: "Collusion",
                  desc: "working with others on individual work when that isn't allowed. Sending your finished essay to a friend \"for ideas\" can count.",
                },
                {
                  title: "Fabrication",
                  desc: "inventing data, interview quotes or references.",
                },
                {
                  title: "Contract cheating",
                  desc: "getting someone else to produce work that you then submit as yours.",
                },
                {
                  title: "Exam offences",
                  desc: "hidden notes in a closed-book exam, impersonation, or communicating during a test.",
                },
                {
                  title: "Undeclared AI use",
                  desc: "submitting AI-generated text where the rules ban it or require you to disclose it.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs hover:border-purple-200 transition-colors"
                >
                  <h3 className="font-extrabold text-gray-950 text-sm md:text-[15px] mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f06a33]" />
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium mt-3 bg-amber-50/60 border border-amber-200/70 p-4 rounded-2xl">
              Students often assume intent decides everything. It doesn&apos;t. Some universities treat sloppy referencing as poor practice and deliberate copying as misconduct, but that line is drawn by the panel, not by you. If similarity software flags your essay, &ldquo;I didn&apos;t mean to&rdquo; is a weak opening position.
            </p>
          </section>

          {/* Section 5: AI Table */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              Can You Use AI Tools Without Breaking the Policy?
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              It depends on your university, your course and often the individual assignment. There is no single UK-wide rule. Here&apos;s a rough guide to how most institutions treat common uses:
            </p>

            {/* Custom Styled Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs mt-2">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-[#fbfcff]">
                  <tr>
                    <th className="px-5 py-3.5 text-xs font-black text-gray-950 uppercase tracking-wider border-r border-gray-200">
                      How you use AI
                    </th>
                    <th className="px-5 py-3.5 text-xs font-black text-gray-950 uppercase tracking-wider">
                      Typical position
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {AI_RULES_TABLE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-5 py-4 text-xs md:text-sm font-bold text-gray-900 border-r border-gray-200 align-top">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>{row.usage}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs md:text-sm text-gray-600 font-medium align-middle">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span>{row.position}</span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shrink-0 w-fit ${row.tagColor}`}
                          >
                            {row.tag}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium mt-2">
              Treat this table as a starting point only. The assignment brief overrides it. If the brief is silent, email your tutor and keep the reply.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Detection software is not proof. Many universities say a score alone shouldn&apos;t decide a case. But a flagged submission can still trigger a meeting, which is why your drafts matter more than any score.
            </p>
          </section>

          {/* Section 6 */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              What Happens If You Are Accused of Misconduct?
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              You will normally be told in writing, asked for evidence, and invited to a meeting or panel before anyone makes a decision. The exact steps depend on your university, but most follow this order:
            </p>
            <ol className="space-y-3 mt-1">
              {[
                {
                  step: "A concern is raised.",
                  detail: "Usually a marker spots a high similarity report, a sudden change in writing style or an odd reference.",
                },
                {
                  step: "You receive written notice.",
                  detail: "It explains what is alleged and what you can bring.",
                },
                {
                  step: "You attend a meeting or panel.",
                  detail: "You explain how you produced the work. Drafts, notes and version history help here.",
                },
                {
                  step: "A decision is made.",
                  detail: "The outcome depends on how serious the case is.",
                },
                {
                  step: "You can appeal.",
                  detail: "Appeals have a deadline, so read the notice carefully.",
                },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 bg-white border border-gray-200/70 rounded-2xl"
                >
                  <span className="w-6 h-6 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-xs md:text-sm">
                    <strong className="text-gray-950 font-bold">{item.step}</strong>{" "}
                    <span className="text-gray-600 font-medium">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium mt-2">
              Outcomes range from a formal warning or a capped resubmission, to a zero for the assessment, to failing the module. In serious or repeat cases, suspension or expulsion is possible. International students should also speak to their student advice team early, because a course ending can affect visa status.
            </p>
            <div className="bg-purple-50/70 border-l-4 border-[#3f159a] p-4 rounded-r-2xl mt-1">
              <p className="text-sm md:text-[15px] font-bold text-[#3f159a]">
                Your students&apos; union advice service is free and independent of the university. Use it.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              How to Find Your Own University&apos;s Academic Integrity Policy
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Your university&apos;s version is the only one that counts, so read it directly. It takes about ten minutes.
            </p>
            <ol className="space-y-2.5 mt-1">
              {[
                "Open your student portal and search for \"academic misconduct\" or \"academic integrity\".",
                "Download the latest version. Policies change, especially on AI.",
                "Read the definitions and the table of penalties.",
                "Check your module handbook for rules specific to each assignment.",
                "Note who to contact: your personal tutor, the academic skills team and the students' union advice service.",
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50/80 border border-gray-200/50 rounded-xl text-xs md:text-sm font-medium text-gray-700"
                >
                  <span className="text-[#3f159a] font-extrabold text-sm">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 8 */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              Habits That Protect You From an Integrity Complaint
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Most complaints are easier to defend if you can show how you worked. These habits cost very little:
            </p>
            <ul className="space-y-3 mt-1">
              {[
                {
                  title: "Keep dated drafts and notes.",
                  desc: "Turn on version history in Word or Google Docs. A student who can show five drafts and a notes file is in a far stronger position than one who can show only a final file.",
                },
                {
                  title: "Reference as you write.",
                  desc: "Keep a running source list. Rebuilding citations the night before a deadline is where accidental plagiarism starts.",
                },
                {
                  title: "Paraphrase from understanding.",
                  desc: "Close the source, write the idea from memory, then check it.",
                },
                {
                  title: "Never share finished work in group chats.",
                  desc: "Once it's out, you can't control where it goes.",
                },
                {
                  title: "Ask early.",
                  desc: "Your academic skills team exists for exactly these questions.",
                },
              ].map((habit, idx) => (
                <li
                  key={idx}
                  className="p-3.5 bg-white border border-gray-200/70 rounded-2xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm">
                    <strong className="text-gray-950 font-bold">{habit.title}</strong>{" "}
                    <span className="text-gray-600 font-medium">{habit.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 9: Position */}
          <section className="flex flex-col gap-3 border-t border-gray-100 pt-7">
            <h2 className="text-xl md:text-2xl font-black text-gray-950">
              Assignment In Need&apos;s Position on Academic Integrity
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <div className="bg-gradient-to-br from-purple-50/60 to-white border border-purple-200/60 p-5 md:p-6 rounded-2xl flex flex-col gap-3">
              <p className="text-sm md:text-[15px] leading-relaxed text-gray-700 font-medium">
                Assignment In Need is an academic support service for students in the UK. Our samples, referencing guides and explanations are for learning and reference. They are not meant to be submitted as your own work, and doing so would break your university&apos;s rules. We don&apos;t support exam help, impersonation or any other form of misconduct. You remain responsible for following your own university&apos;s academic integrity policy.
              </p>
              <p className="text-sm md:text-[15px] leading-relaxed text-gray-700 font-medium">
                If you&apos;re unsure how to structure an essay or format references, ask our team before you start writing.
              </p>
            </div>
          </section>

          {/* Section 10: FAQs */}
          <section className="flex flex-col gap-4 border-t border-gray-100 pt-7">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#3f159a]" />
              <h2 className="text-xl md:text-2xl font-black text-gray-950">
                Frequently Asked Questions About Academic Integrity Policies
              </h2>
            </div>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />

            {/* Smooth Animated FAQ Accordion matching website UI */}
            <div className="space-y-3 mt-1">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                      isOpen
                        ? "border-[#6d28d9]/40 ring-2 ring-[#6d28d9]/10 shadow-[0_4px_20px_rgba(109,40,217,0.06)]"
                        : "border-gray-200/80 hover:border-purple-200 hover:shadow-sm"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className={`w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm md:text-base transition-colors duration-200 cursor-pointer ${
                        isOpen ? "text-[#3f159a]" : "text-gray-900 hover:text-[#3f159a]"
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isOpen ? "text-[#3f159a]" : "text-gray-400"
                          }`}
                        />
                        <span>{faq.question}</span>
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        className={`w-4 h-4 text-[#3f159a] shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
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
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed font-medium border-t border-purple-50 bg-[#faf9fe]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Strip */}
          <section className="border-t border-gray-100 pt-6 mt-2">
            <div className="bg-[#fcfbff] border border-purple-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-950 text-sm md:text-base">
                  Need guidance on essay structuring or referencing rules?
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Our academic experts provide model papers and structural assistance compliant with UK benchmarks.
                </p>
              </div>
              <Link
                href="/contact"
                className="btn-shutter-blue-open text-white text-xs md:text-sm font-bold py-2.5 px-5 rounded-xl text-center shrink-0"
              >
                Get in Touch
              </Link>
            </div>
          </section>
        </div>
      </AnimateIn>
    </div>
  );
}
