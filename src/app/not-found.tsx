"use client";

import React from "react";
import Link from "next/link";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Award,
  FileText,
  Calculator,
  BookOpen,
  Star,
  Home,
  ArrowLeft,
  ChevronRight
} from "lucide-react";

export default function NotFound() {
  const leftOptions = [
    {
      title: "Place an Order",
      href: "/order",
      icon: <ShoppingCart className="w-5.5 h-5.5" />,
      alignClass: "left-4 top-10",
      linePath: "M 290 70 H 420 L 490 200",
    },
    {
      title: "Academic Services",
      href: "/services",
      icon: <Award className="w-5.5 h-5.5" />,
      alignClass: "left-0 top-[216px]",
      linePath: "M 320 240 H 440",
    },
    {
      title: "Free Essay Samples",
      href: "/samples",
      icon: <FileText className="w-5.5 h-5.5" />,
      alignClass: "left-4 bottom-10",
      linePath: "M 290 410 H 420 L 490 280",
    },
  ];

  const rightOptions = [
    {
      title: "Pricing Calculator",
      href: "/pricing",
      icon: <Calculator className="w-5.5 h-5.5" />,
      alignClass: "right-4 top-10",
      linePath: "M 810 70 H 680 L 610 200",
    },
    {
      title: "Subject Helpdesk",
      href: "/subjects",
      icon: <BookOpen className="w-5.5 h-5.5" />,
      alignClass: "right-0 top-[216px]",
      linePath: "M 780 240 H 660",
    },
    {
      title: "Customer Reviews",
      href: "/review",
      icon: <Star className="w-5.5 h-5.5" />,
      alignClass: "right-4 bottom-10",
      linePath: "M 810 410 H 680 L 610 280",
    },
  ];

  return (
    <div className="min-h-[85vh] bg-[#fdfdfd] flex flex-col justify-center items-center py-16 px-4 relative overflow-hidden font-sans select-none">
      {/* Background soft glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-50/50 blur-[120px] pointer-events-none" />

      {/* Header Block */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f1b3d] tracking-tight leading-tight mb-3 font-heading">
          Sorry, we couldn't find that page
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-semibold max-w-[550px] mx-auto leading-relaxed">
          Make sure you've typed the URL correctly or explore the key sections of our website below to get back on track.
        </p>
      </div>

      {/* Main interactive diagram block */}
      <div className="w-full max-w-[1100px] relative z-10 my-4">
        
        {/* Desktop Hub-and-Spoke (lg screens) */}
        <div className="hidden lg:block relative w-full h-[480px]">
          
          {/* Dashed Connecting Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1100 480" fill="none">
            {/* Left connections */}
            {leftOptions.map((opt, i) => (
              <path
                key={`left-line-${i}`}
                d={opt.linePath}
                stroke="#d8b4fe"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="transition-all duration-300 group-hover:stroke-purple-600"
              />
            ))}
            {/* Right connections */}
            {rightOptions.map((opt, i) => (
              <path
                key={`right-line-${i}`}
                d={opt.linePath}
                stroke="#d8b4fe"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            ))}
          </svg>

          {/* Left Spokes Column */}
          {leftOptions.map((opt, i) => (
            <Link
              key={`left-opt-${i}`}
              href={opt.href}
              className={cn(
                "absolute flex items-center gap-4 text-[#0f1b3d] hover:text-[#3f159a] transition-all duration-300 group select-none",
                opt.alignClass
              )}
            >
              {/* Icon Circle */}
              <div className="w-14 h-14 rounded-full bg-[#f4f2ff] border border-purple-100 flex items-center justify-center text-[#3f159a] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#3f159a] group-hover:text-white group-hover:border-transparent group-hover:shadow-md shrink-0">
                {opt.icon}
              </div>
              {/* Label */}
              <div className="flex flex-col items-start leading-none pr-4">
                <span className="text-[14px] font-black uppercase tracking-wider">
                  {opt.title}
                </span>
                <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5">
                  Explore now <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}

          {/* Central Hub (404 Page Not Found) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center justify-center w-[220px] h-[220px] rounded-full bg-white border border-purple-100/50 shadow-[0_12px_40px_rgba(63,21,154,0.05)] select-none">
            <h2 className="text-7xl font-black text-[#0f1b3d] tracking-tighter leading-none mb-1 font-heading">
              404
            </h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Page Not Found
            </p>
          </div>

          {/* Right Spokes Column */}
          {rightOptions.map((opt, i) => (
            <Link
              key={`right-opt-${i}`}
              href={opt.href}
              className={cn(
                "absolute flex flex-row-reverse items-center gap-4 text-[#0f1b3d] hover:text-[#3f159a] transition-all duration-300 group select-none",
                opt.alignClass
              )}
            >
              {/* Icon Circle */}
              <div className="w-14 h-14 rounded-full bg-[#f4f2ff] border border-purple-100 flex items-center justify-center text-[#3f159a] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#3f159a] group-hover:text-white group-hover:border-transparent group-hover:shadow-md shrink-0">
                {opt.icon}
              </div>
              {/* Label */}
              <div className="flex flex-col items-end leading-none pl-4">
                <span className="text-[14px] font-black uppercase tracking-wider text-right">
                  {opt.title}
                </span>
                <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5">
                  <ChevronRight className="w-3 h-3 rotate-180" /> Explore now
                </span>
              </div>
            </Link>
          ))}

        </div>

        {/* Mobile Grid Layout (md & sm screens) */}
        <div className="block lg:hidden w-full px-4 flex flex-col items-center gap-8">
          {/* Large Center 404 block for mobile */}
          <div className="w-[180px] h-[180px] rounded-full bg-white border border-purple-100/50 shadow-md flex flex-col items-center justify-center text-center">
            <h2 className="text-6xl font-black text-[#0f1b3d] leading-none mb-1 font-heading">
              404
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Page Not Found
            </p>
          </div>

          {/* Simple Link Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[600px]">
            {[...leftOptions, ...rightOptions].map((opt, i) => (
              <Link
                key={`mobile-opt-${i}`}
                href={opt.href}
                className="flex items-center gap-4 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition group select-none active:scale-98"
              >
                <div className="w-12 h-12 rounded-xl bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] group-hover:bg-[#3f159a] group-hover:text-white transition shrink-0">
                  {opt.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-extrabold text-[#0f1b3d]">
                    {opt.title}
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold mt-0.5">
                    Click to view &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Footer Actions */}
      <AnimateIn variant="fadeUp" className="mt-12 flex flex-col sm:flex-row items-center gap-4 relative z-20">
        <Link
          href="/"
          className="btn-shutter-orange-open text-white font-extrabold text-[12px] uppercase tracking-wider py-4 px-8 rounded-xl shadow-md transition inline-flex items-center gap-2 cursor-pointer border-none text-center"
        >
          <Home className="w-4 h-4" />
          Back to Homepage
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="py-4 px-8 rounded-xl border border-solid border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-extrabold text-[12px] uppercase tracking-wider shadow-sm select-none cursor-pointer flex items-center justify-center gap-2 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </AnimateIn>
    </div>
  );
}
