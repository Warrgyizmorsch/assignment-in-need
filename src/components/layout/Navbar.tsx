"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

const SERVICES = [
  { name: "Assignment Writing", slug: "assignment-writing" },
  { name: "Essay Writing", slug: "essay-writing" },
  { name: "Dissertation Help", slug: "dissertation-help" },
  { name: "Case Study Help", slug: "case-study-help" },
  { name: "Report Writing", slug: "report-writing" },
  { name: "Coursework Help", slug: "coursework-help" },
  { name: "Proofreading & Editing", slug: "proofreading-editing" },
];

const SUBJECTS = [
  { name: "Accounting", slug: "accounting" },
  { name: "Business Management", slug: "business" },
  { name: "Law", slug: "law" },
  { name: "Nursing", slug: "nursing" },
  { name: "Engineering", slug: "engineering" },
  { name: "Computer Science", slug: "computer-science" },
  { name: "Psychology", slug: "psychology" },
];

const RESOURCES = [
  { name: "Referencing Guides", slug: "samples" },
  { name: "Writing Tips", slug: "samples" },
  { name: "Free Samples", slug: "samples" },
  { name: "Academic Blog", slug: "about" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);

  const toggleMobileDropdown = (name: string) => {
    setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-100/50 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo matching second screenshot */}
        <Link href="/" className="flex items-center gap-3 select-none shrink-0">
          <svg viewBox="0 0 24 24" className="w-9 h-9 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Triangular stylized A logo */}
            <path d="M12 2L3 20h3.5l2.5-5.5h6l2.5 5.5h3.5L12 2z" fill="url(#logoGrad)" />
            <path d="M10.2 11.5h3.6L12 7.5l-1.8 4z" fill="#ffffff" />
            <path d="M7 17.5h10l-1.5-2.5h-7L7 17.5z" fill="#F97316" />
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6D28D9" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col text-left leading-none gap-0.5">
            <span className="font-heading font-extrabold text-base md:text-lg text-[#120C2E] leading-none tracking-tight">
              Assignment
            </span>
            <span className="font-heading font-black text-xs md:text-sm text-[#F97316] leading-none tracking-wider uppercase">
              IN NEED
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links matching second screenshot */}
        <nav className="hidden lg:flex items-center gap-6">
          
          {/* Services Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 text-sm font-bold text-text-muted hover:text-[#5B21B6] transition-colors group-hover:text-[#5B21B6]">
              Services
              <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-250" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-primary-100 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 p-2 flex flex-col gap-0.5 z-50">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="text-xs font-semibold text-text-body hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Subjects Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 text-sm font-bold text-text-muted hover:text-[#5B21B6] transition-colors group-hover:text-[#5B21B6]">
              Subjects
              <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-250" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-primary-100 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 p-2 flex flex-col gap-0.5 z-50">
              {SUBJECTS.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/subjects/${sub.slug}`}
                  className="text-xs font-semibold text-text-body hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                >
                  {sub.name} Assignment Help
                </Link>
              ))}
            </div>
          </div>

          <Link href="/writers" className="text-sm font-bold text-text-muted hover:text-[#5B21B6] transition-colors">
            Experts
          </Link>

          <Link href="/samples" className="text-sm font-bold text-text-muted hover:text-[#5B21B6] transition-colors">
            Samples
          </Link>

          {/* Resources Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 text-sm font-bold text-text-muted hover:text-[#5B21B6] transition-colors group-hover:text-[#5B21B6]">
              Resources
              <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-250" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-primary-100 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 p-2 flex flex-col gap-0.5 z-50">
              {RESOURCES.map((res, index) => (
                <Link
                  key={index}
                  href={`/${res.slug}`}
                  className="text-xs font-semibold text-text-body hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                >
                  {res.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/about" className="text-sm font-bold text-text-muted hover:text-[#5B21B6] transition-colors">
            About Us
          </Link>

          <Link href="/contact" className="text-sm font-bold text-[#5B21B6] hover:text-[#4C1D95] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Button & Contact Info matching second screenshot */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <a
            href="tel:+447300640066"
            className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-[#F3E8FF] text-[#5B21B6] flex items-center justify-center shrink-0 shadow-sm">
              <Phone className="w-4.5 h-4.5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#120C2E] leading-tight">+44 7300 640066</span>
              <span className="text-[10px] text-text-muted font-bold tracking-wide leading-none mt-0.5">24/7 Support</span>
            </div>
          </a>
          <Link href="/pricing">
            <Button variant="primary" size="sm" className="px-5 py-2.5">
              Get Free Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-2 text-text-heading hover:text-[#5B21B6] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer (with mobile-friendly nested dropdowns) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white border-b border-primary-100/50 flex flex-col p-6 gap-4 shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          
          {/* Services Mobile Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleMobileDropdown("services")}
              className="flex items-center justify-between w-full text-base font-bold text-text-heading hover:text-primary-700 py-1 text-left"
            >
              <span>Services</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", activeMobileDropdown === "services" && "rotate-180")} />
            </button>
            {activeMobileDropdown === "services" && (
              <div className="flex flex-col gap-2 pl-4 mt-2 border-l border-primary-50">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="text-sm font-semibold text-text-body hover:text-primary-700 py-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Subjects Mobile Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleMobileDropdown("subjects")}
              className="flex items-center justify-between w-full text-base font-bold text-text-heading hover:text-primary-700 py-1 text-left"
            >
              <span>Subjects</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", activeMobileDropdown === "subjects" && "rotate-180")} />
            </button>
            {activeMobileDropdown === "subjects" && (
              <div className="flex flex-col gap-2 pl-4 mt-2 border-l border-primary-50">
                {SUBJECTS.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/subjects/${sub.slug}`}
                    className="text-sm font-semibold text-text-body hover:text-primary-700 py-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    {sub.name} Assignment Help
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/writers" className="text-base font-bold text-text-heading hover:text-primary-700 py-1" onClick={() => setIsOpen(false)}>
            Experts
          </Link>

          <Link href="/samples" className="text-base font-bold text-text-heading hover:text-primary-700 py-1" onClick={() => setIsOpen(false)}>
            Samples
          </Link>

          {/* Resources Mobile Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleMobileDropdown("resources")}
              className="flex items-center justify-between w-full text-base font-bold text-text-heading hover:text-primary-700 py-1 text-left"
            >
              <span>Resources</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", activeMobileDropdown === "resources" && "rotate-180")} />
            </button>
            {activeMobileDropdown === "resources" && (
              <div className="flex flex-col gap-2 pl-4 mt-2 border-l border-primary-50">
                {RESOURCES.map((res, index) => (
                  <Link
                    key={index}
                    href={`/${res.slug}`}
                    className="text-sm font-semibold text-text-body hover:text-primary-700 py-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    {res.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="text-base font-bold text-text-heading hover:text-primary-700 py-1" onClick={() => setIsOpen(false)}>
            About Us
          </Link>

          <Link href="/contact" className="text-base font-bold text-[#5B21B6] hover:text-primary-700 py-1" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          <hr className="border-primary-100/50 my-1" />

          <a href="tel:+447300640066" className="flex items-center gap-3 text-base font-bold text-text-heading py-2">
            <div className="w-10 h-10 rounded-full bg-[#F3E8FF] text-[#5B21B6] flex items-center justify-center">
              <Phone className="w-4 h-4 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#120C2E] leading-tight">+44 7300 640066</span>
              <span className="text-[10px] text-text-muted font-bold mt-0.5">24/7 Support</span>
            </div>
          </a>

          <Link href="/pricing" onClick={() => setIsOpen(false)}>
            <Button variant="primary" size="md" fullWidth>
              Get Free Quote
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};
Navbar.displayName = "Navbar";
