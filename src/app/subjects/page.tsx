"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, HelpCircle, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SubjectCard } from "@/components/ui/SubjectCard";
import { Button } from "@/components/ui/Button";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

const STATIC_SUBJECTS = [
  { name: "Maths", slug: "math" },
  { name: "English", slug: "english" },
  { name: "Economics", slug: "economics" },
  { name: "Chemistry", slug: "chemistry" },
  { name: "History", slug: "history" },
  { name: "Law", slug: "law" },
  { name: "Linguistics", slug: "linguistic" },
  { name: "Nursing", slug: "nursing" },
  { name: "Physics", slug: "physics" },
  { name: "Sociology", slug: "sociology" },
  { name: "Philosophy", slug: "philosophy" },
  { name: "Statistics", slug: "statistics" },
  { name: "Accounting", slug: "accounting" },
  { name: "Programming", slug: "programming" },
  { name: "Marketing", slug: "marketing" },
  { name: "Computer Science", slug: "computer-science" },
  { name: "Engineering", slug: "engineering" },
  { name: "Finance", slug: "finance" },
  { name: "Management", slug: "management" },
  { name: "Business", slug: "business" },
  { name: "Geography", slug: "geography" },
  { name: "Psychology", slug: "psychology" },
  { name: "Biology", slug: "biology" },
  { name: "Entrepreneurship", slug: "entrepreneurship" },
  { name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Humanities", slug: "humanities" },
];

const getSubjectIconName = (slug: string) => {
  const normalized = slug.toLowerCase();
  if (normalized.includes("math") || normalized.includes("stat")) return "Calculator";
  if (normalized.includes("accounting") || normalized.includes("finance")) return "Calculator";
  if (normalized.includes("law")) return "Scale";
  if (normalized.includes("nursing") || normalized.includes("health")) return "Stethoscope";
  if (normalized.includes("business") || normalized.includes("management")) return "GraduationCap";
  if (normalized.includes("marketing")) return "Megaphone";
  if (normalized.includes("economic")) return "TrendingUp";
  if (normalized.includes("psychology") || normalized.includes("philosophy")) return "Brain";
  if (normalized.includes("computer") || normalized.includes("programming") || normalized.includes("cyber")) return "Code2";
  if (normalized.includes("engineering") || normalized.includes("setting")) return "Settings";
  if (normalized.includes("physics") || normalized.includes("chemistry") || normalized.includes("biology") || normalized.includes("science")) return "Atom";
  if (normalized.includes("history") || normalized.includes("clock")) return "Clock";
  return "BookOpen";
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

export default function SubjectsListPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subject-pages", {
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();
        if (response.ok && (payload?.success || payload?.status === "success") && Array.isArray(payload?.data)) {
          const mapped = payload.data.map((item: any) => {
            const cleanSlug = (item.slug || "").replace(/^\/+/, "");
            const finalSlug = cleanSlug.startsWith("subject/") ? cleanSlug.replace("subject/", "") : cleanSlug;
            const humanized = finalSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
            const name = item.title?.trim() || humanized;
            return {
              name,
              slug: finalSlug,
            };
          });

          // Merge STATIC_SUBJECTS to ensure subjects like Economics are always present
          const existingSlugs = new Set(mapped.map((m: any) => m.slug.toLowerCase()));
          STATIC_SUBJECTS.forEach((staticSub) => {
            const sSlug = staticSub.slug.toLowerCase();
            if (!existingSlugs.has(sSlug) && !existingSlugs.has(`${sSlug}-assignment-help`)) {
              mapped.push(staticSub);
            }
          });

          setSubjects(mapped);
        } else {
          setSubjects(STATIC_SUBJECTS);
        }
      } catch (err) {
        console.warn("Failed to fetch subjects API, falling back to static list:", err);
        setSubjects(STATIC_SUBJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="w-full bg-surface-white">
      {/* Breadcrumb container */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Subjects" }]} />
      </div>

      {/* Hero Section Container */}
      <SectionContainer background="white" className="pt-4 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
          <AnimateIn variant="fadeUp" className="lg:w-1/2">
            <span className="bg-primary-50 text-primary-700 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider inline-block mb-4">
              Academic Expertise
            </span>
            <Heading level={1} highlight="Academic Subjects" highlightVariant="purple">
              Explore Our Academic Subjects
            </Heading>
            <p className="text-text-muted mt-4 text-base md:text-lg leading-relaxed">
              We cover more than 100+ subjects across all academic levels. Find expert assignment help, structured research guides, and custom model papers tailored specifically for your coursework.
            </p>
          </AnimateIn>

          <AnimateIn variant="scaleUp" className="hidden lg:flex lg:w-1/2 justify-end">
            <img
              src="/new-sample-img/hero1.png"
              alt="Subjects Illustration"
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
            placeholder="Search academic subjects (e.g. Maths, Nursing)..."
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
        ) : filteredSubjects.length === 0 ? (
          /* Empty Search State */
          <div className="py-20 text-center bg-white rounded-3xl border border-primary-100/50 px-6 max-w-lg mx-auto">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-text-heading text-lg mb-1">
              No Subjects Found
            </h3>
            <p className="text-text-muted text-sm">
              We couldn't find any subjects matching "{searchTerm}". Try checking your spelling or enter different keywords.
            </p>
          </div>
        ) : (
          /* Grid list items using dynamic SubjectCard component */
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSubjects.map((sub, idx) => {
              const iconName = getSubjectIconName(sub.slug);
              const letterBadge = sub.name.charAt(0) || "S";
              const letterColorClass = getLetterColorClass(idx);
              const orderCount = `${1200 + (idx * 150)}+`;
              
              return (
                <StaggerItem key={sub.slug || idx}>
                  <SubjectCard
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
            Can't Find Your Academic Subject?
          </Heading>
          <p className="text-blue-100/80 text-base mt-4 mb-8 max-w-xl">
            Don't worry! Our expert writers have degrees in virtually every subject. Contact us directly and we'll match you with the perfect expert.
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
