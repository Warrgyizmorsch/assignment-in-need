"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Download,
  Calendar,
  AlertCircle,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimateIn";
import { SidebarQuoteForm } from "@/components/ui/SidebarQuoteForm";

interface SampleDetailPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default function SampleDetailPage({ params }: SampleDetailPageProps) {
  const resolvedParams = use(params);
  const category = resolvedParams.category;
  const slug = resolvedParams.slug;

  const [sample, setSample] = useState<any>(null);
  const [relatedSamples, setRelatedSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>(category);
  const [allCategories, setAllCategories] = useState<any[]>([]);


  useEffect(() => {
    const fetchSampleDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch specific sample detail
        const response = await fetch(
          `/api/samples/${encodeURIComponent(slug)}`,
        );
        if (!response.ok) {
          throw new Error("Sample paper not found.");
        }
        const json = await response.json();

        if (json.success && json.data) {
          setSample(json.data);

          // Fetch related samples (limit=2)
          try {
            let resolvedCategoryId = category;
            const catRes = await fetch("/api/sample-categories");
            if (catRes.ok) {
              const catJson = await catRes.json();
              if (catJson.success && Array.isArray(catJson.data)) {
                setAllCategories(catJson.data);
                const decodedCategory = decodeURIComponent(category)
                  .toLowerCase()
                  .trim();
                const cleanCategory = decodedCategory
                  .replace(/-assignment-writing-help$/, "")
                  .replace(/-assignment-help$/, "")
                  .replace(/-assignment$/, "")
                  .replace(/-help$/, "")
                  .replace(/-/g, " ")
                  .trim();

                const matched = catJson.data.find((catItem: any) => {
                  const catName = (catItem.name || "").toLowerCase().trim();
                  const cleanCatName = catName.replace(/-/g, " ").trim();

                  if (
                    catName === decodedCategory ||
                    cleanCatName === cleanCategory
                  )
                    return true;
                  if (
                    cleanCatName.includes(cleanCategory) ||
                    cleanCategory.includes(cleanCatName)
                  )
                    return true;
                  if (
                    cleanCategory === "accounting" &&
                    cleanCatName === "account"
                  )
                    return true;
                  if (
                    cleanCategory === "account" &&
                    cleanCatName === "accounting"
                  )
                    return true;
                  if (
                    cleanCategory === "economics" &&
                    cleanCatName === "economic"
                  )
                    return true;
                  if (
                    cleanCategory === "economic" &&
                    cleanCatName === "economics"
                  )
                    return true;
                  if (cleanCategory === "maths" && cleanCatName === "math")
                    return true;
                  if (cleanCategory === "math" && cleanCatName === "maths")
                    return true;
                  if (
                    cleanCategory.includes("human resource") &&
                    cleanCatName.includes("human resource")
                  )
                    return true;
                  return false;
                });

                if (matched) {
                  resolvedCategoryId = String(matched.id);
                  setCategoryName(matched.name);
                }
              }
            }

            const relResponse = await fetch(
              `/api/samples?category=${encodeURIComponent(resolvedCategoryId)}&limit=2`,
            );
            if (relResponse.ok) {
              const relJson = await relResponse.json();
              if (relJson.success && relJson.data) {
                // Filter out the current sample
                const items = (relJson.data.data || []).filter(
                  (item: any) => item.slug !== slug,
                );
                setRelatedSamples(items.slice(0, 2));
              }
            }
          } catch (e) {
            console.error("Error loading related samples:", e);
          }
        } else {
          throw new Error("Failed to load sample data.");
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching the sample details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSampleDetail();
  }, [slug, category]);

  // Set document meta page title and description
  useEffect(() => {
    if (sample) {
      document.title = sample.meta_title || `${sample.title} | Free Samples`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", sample.meta_description || "");
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = sample.meta_description || "";
        document.head.appendChild(meta);
      }
    }
  }, [sample]);

  if (loading) {
    return (
      <main className="w-full font-sans text-gray-800 bg-white">
        {/* Breadcrumb Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-pulse flex gap-2">
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-4"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content Area Skeleton */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6 text-left">
              <div>
                <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded w-full mb-3"></div>
                <div className="h-10 bg-slate-200 rounded w-3/4"></div>
              </div>

              {/* Stats Bar Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>

              {/* Rich Content Placeholder */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-4 bg-slate-200 rounded"
                    style={{ width: `${100 - (idx % 4) * 10}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-24">
              <div className="h-48 bg-slate-200 rounded-2xl w-full"></div>
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-10 bg-slate-200 rounded-xl w-full"
                  ></div>
                ))}
                <div className="h-12 bg-slate-200 rounded-xl w-full mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !sample) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center px-4 bg-white min-h-[60vh] flex flex-col justify-center items-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load Sample
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {error || "The requested sample paper does not exist."}
        </p>
        <Link
          href="/samples"
          className="bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-purple-800 transition"
        >
          Return to Samples
        </Link>
      </div>
    );
  }

  const readableCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const words = ((sample.id * 7) % 1500) + 1000;
  const pages = Math.ceil(words / 250);
  const downloads = ((sample.id * 13) % 2000) + 1200;

  return (
    <main className="w-full font-sans text-gray-800 bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500 text-left">
        <Link href="/" className="hover:text-purple-700">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/samples" className="hover:text-purple-700">
          Samples
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href={`/samples/${category}`} className="hover:text-purple-700">
          {readableCategory}
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 font-medium truncate max-w-xs inline-block align-bottom">
          {sample.title}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content Area */}
          <AnimateIn
            variant="fadeUp"
            className="w-full lg:w-2/3 flex flex-col gap-6 text-left"
          >
            <div>
              <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                {sample.type_name || "Assignment Sample"}
              </span>
              <h1 className="text-2xl md:text-3.5xl font-extrabold text-gray-900 mt-3 leading-snug">
                {sample.title}
              </h1>
            </div>

            {/* Info Badges / Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Subject Area
                </span>
                <span className="text-sm font-bold text-purple-700 mt-1">
                  {readableCategory}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Words Count
                </span>
                <span className="text-sm font-bold text-gray-800 mt-1">
                  {words} Words
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Pages
                </span>
                <span className="text-sm font-bold text-gray-800 mt-1">
                  {pages} Pages
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Downloads
                </span>
                <span className="text-sm font-bold text-gray-800 mt-1">
                  {downloads}+ Downloads
                </span>
              </div>
            </div>

            {/* Dynamic Rich HTML Content */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div
                className="prose-content text-gray-700 leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: sample.content }}
              />
            </div>

            {/* Outline Footer Box */}
            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6 text-left flex items-start gap-4">
              <ShieldCheck className="w-10 h-10 text-purple-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1">
                  Academic Integrity Policy
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This model solution is provided free of charge to serve as a
                  structure reference guide for research, planning, or
                  referencing formatting study. It should not be submitted
                  directly as your own final coursework.
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Right Sidebar Form & Widgets */}
          <AnimateIn
            variant="fadeUp"
            delay={0.15}
            className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-6"
          >
            {/* Quick Order Form */}
            <SidebarQuoteForm
              sourceName={`Sample Detail Page: ${sample?.title || "General"}`}
            />

            {/* Popular Subjects counters */}
            <div className="bg-[#fafaff] border border-gray-100 rounded-3xl p-6 text-left shadow-sm">
              <h4 className="font-bold text-gray-900 text-base mb-4">
                Other Subjects
              </h4>
              <div className="flex flex-col gap-2.5">
                {allCategories
                  .filter((item: any) => {
                    const catName = item.name || item.title || "";
                    return (
                      catName.toLowerCase() !== category.toLowerCase() &&
                      catName.toLowerCase().replace(/-/g, " ") !==
                      category.toLowerCase().replace(/-/g, " ")
                    );
                  })
                  .slice(0, 8)
                  .map((item: any, idx: number) => {
                    const rawName = item.name || item.title || "";
                    const displayName = rawName
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase());
                    return (
                      <Link
                        key={item.id || idx}
                        href={`/samples/${encodeURIComponent(rawName)}`}
                        className="flex items-center justify-between text-xs font-bold text-gray-600 hover:text-purple-700 transition"
                      >
                        <span>{displayName}</span>
                        <span>&rarr;</span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Dynamic Related Samples Section */}
        {relatedSamples.length > 0 && (
          <section className="border-t border-gray-100 pt-12 mt-12 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Latest Related Free Samples
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Explore more verified samples from the same discipline
            </p>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedSamples.map((rel) => {
                const relWords = ((rel.id * 7) % 1500) + 1000;
                const relPages = Math.ceil(relWords / 250);
                const relDownloads = ((rel.id * 13) % 2000) + 1200;

                return (
                  <StaggerItem key={rel.id}>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left h-full">
                      <div>
                        <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-md font-bold mb-3">
                          {rel.type_name || "Assignment"}
                        </span>
                        <h3 className="font-bold text-gray-900 text-base group-hover:text-purple-800 transition-colors mb-2 line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                          {rel.meta_description ||
                            `High scoring free academic related outline on the subject of ${readableCategory}.`}
                        </p>
                      </div>
                      <div className="border-t border-purple-50 pt-4 mt-auto">
                        <div className="flex flex-wrap items-center gap-2 text-[9px] text-gray-400 font-medium mb-3">
                          <span>
                            Downloads: <strong>{relDownloads}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Words: <strong>{relWords}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Pages: <strong>{relPages}</strong>
                          </span>
                        </div>
                        <Link
                          href={`/samples/${category}/${rel.slug}`}
                          className="flex items-center justify-between font-bold text-[11px] text-purple-700 group-hover:text-purple-800 hover:underline"
                        >
                          View or Download &rarr;
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .prose-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #111827; text-align: left; }
        .prose-content h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.2rem; margin-bottom: 0.4rem; color: #1f2937; text-align: left; }
        .prose-content p { margin-bottom: 1rem; line-height: 1.625; text-align: left; }
        .prose-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; text-align: left; }
        .prose-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; text-align: left; }
        .prose-content li { margin-bottom: 0.25rem; text-align: left; }
        .prose-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .prose-content th, .prose-content td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
        .prose-content th { background-color: #f9fafb; font-weight: 600; }
      `,
        }}
      />
    </main>
  );
}
