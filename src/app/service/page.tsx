"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, HelpCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ServiceListCard } from "@/components/ui/ServiceListCard";
import { Button } from "@/components/ui/Button";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

const STATIC_SERVICES = [
  { name: "Assignment Help", slug: "service/assignment" },
  { name: "Dissertation Help", slug: "service/dissertation" },
  { name: "Essay Writing Help", slug: "service/essay" },
  { name: "Coursework Help", slug: "service/coursework" },
  { name: "Homework Help", slug: "service/homework" },
  { name: "Research Paper Help", slug: "service/research-paper" },
  { name: "Thesis Help", slug: "service/thesis" },
  { name: "Case Study Help", slug: "service/case-study" },
  { name: "Programming Help", slug: "service/programming" },
  { name: "Online Exam Help", slug: "service/online-exam" },
  { name: "Do My Assignment", slug: "service/do-my-assignment" },
];

const getServiceIconName = (slug: string) => {
  const normalized = slug.toLowerCase();
  if (normalized.includes("programming") || normalized.includes("code")) return "Code2";
  if (normalized.includes("essay") || normalized.includes("writing")) return "PenTool";
  if (normalized.includes("dissertation") || normalized.includes("thesis")) return "BookMarked";
  if (normalized.includes("exam") || normalized.includes("quiz")) return "Timer";
  if (normalized.includes("research")) return "Search";
  if (normalized.includes("case-study")) return "Briefcase";
  return "FileText";
};

const getLetterColorClass = (idx: number) => {
  const classes = [
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-rose-100 text-rose-700 border-rose-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-pink-100 text-pink-700 border-pink-200",
  ];
  return classes[idx % classes.length];
};

export default function ServicesListPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/service-pages", {
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();
        if (response.ok && (payload?.success || payload?.status === "success") && Array.isArray(payload?.data)) {
          // Flatten service children if nested
          let mapped: any[] = [];
          
          payload.data.forEach((item: any) => {
            const processItem = (svc: any) => {
              const cleanSlug = (svc.slug || "").replace(/^\/+/, "");
              const humanized = cleanSlug.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Service";
              const name = svc.title?.trim() || humanized;
              
              mapped.push({
                name,
                slug: cleanSlug,
              });
              
              if (Array.isArray(svc.children)) {
                svc.children.forEach(processItem);
              }
            };
            processItem(item);
          });

          // Remove duplicates
          const existingSlugs = new Set();
          mapped = mapped.filter((m: any) => {
             const s = m.slug.toLowerCase();
             if (existingSlugs.has(s)) return false;
             existingSlugs.add(s);
             return true;
          });

          // Fallback static
          if (mapped.length === 0) {
            mapped = [...STATIC_SERVICES];
          }

          setServices(mapped);
        } else {
          setServices(STATIC_SERVICES);
        }
      } catch (err) {
        console.warn("Failed to fetch services API, falling back to static list:", err);
        setServices(STATIC_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="w-full bg-surface-white">
      {/* Breadcrumb container */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Services" }]} />
      </div>

      {/* Hero Section Container */}
      <SectionContainer background="white" className="pt-4 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
          <AnimateIn variant="fadeUp" className="lg:w-1/2">
            <span className="bg-primary-50 text-primary-700 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider inline-block mb-4">
              Academic Expertise
            </span>
            <Heading level={1} highlight="Academic Services" highlightVariant="purple">
              Explore Our Academic Services
            </Heading>
            <p className="text-text-muted mt-4 text-base md:text-lg leading-relaxed">
              We offer a wide range of academic writing and tutoring services. Find expert assignment help, structured research guides, and custom model papers tailored specifically for your coursework.
            </p>
          </AnimateIn>

          <AnimateIn variant="scaleUp" className="hidden lg:flex lg:w-1/2 justify-end">
            <img
              src="/new-sample-img/hero1.png"
              alt="Services Illustration"
              className="w-full max-w-[450px] h-auto object-contain"
            />
          </AnimateIn>
        </div>
      </SectionContainer>

      {/* List Container with Search Bar */}
      <SectionContainer background="lavender" className="py-16">
        {/* Search Input Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search academic services (e.g. Essay, Dissertation)..."
            className="w-full border border-gray-200 rounded-2xl pl-4 pr-12 py-3.5 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.03)] focus:border-primary-500 focus:outline-none transition-all duration-300"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-primary-100/50 rounded-2xl p-5 flex items-center gap-4 animate-pulse shadow-sm h-[80px]"
              >
                <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          /* Empty Search State */
          <div className="py-20 text-center bg-white rounded-3xl border border-primary-100/50 px-6 max-w-lg mx-auto">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-text-heading text-lg mb-1">
              No Services Found
            </h3>
            <p className="text-text-muted text-sm">
              We couldn't find any services matching "{searchTerm}". Try checking your spelling or enter different keywords.
            </p>
          </div>
        ) : (
          /* Grid list items using dynamic ServiceListCard component */
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredServices.map((sub, idx) => {
              const iconName = getServiceIconName(sub.slug);
              const letterBadge = sub.name.charAt(0) || "S";
              const letterColorClass = getLetterColorClass(idx);
              const orderCount = `${1200 + (idx * 150)}+`;
              
              return (
                <StaggerItem key={sub.slug || idx}>
                  <ServiceListCard
                    name={sub.name}
                    iconName={iconName}
                    slug={sub.slug}
                    letterBadge={letterBadge}
                    letterColorClass={letterColorClass}
                    orderCount={orderCount}
                  />
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </SectionContainer>

      {/* CTA section banner using default classes and buttons */}
      <SectionContainer background="navy" className="py-16 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Heading level={2} className="text-white">
            Can't Find Your Academic Service?
          </Heading>
          <p className="text-blue-100/80 text-base mt-4 mb-8 max-w-xl">
            Don't worry! Our expert writers provide custom assistance for virtually any academic need. Contact us directly and we'll match you with the perfect expert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/contact" className="inline-flex">
              <Button variant="orangeOpen" size="lg" icon={true}>
                Contact Support
              </Button>
            </Link>
            <a
              href="https://wa.me/447826233106"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center font-heading font-semibold rounded-btn transition-all duration-200 px-7 py-3 text-lg bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}
