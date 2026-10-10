"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { RatingBadge } from "@/components/ui/RatingBadge";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface SampleDetailPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
  initialSample?: any;
}

export default function SampleDetailPage({ params, initialSample }: SampleDetailPageProps) {
  const resolvedParams = use(params);
  const category = resolvedParams.category;
  const slug = resolvedParams.slug;

  const [sample, setSample] = useState<any>(initialSample || null);
  const [relatedSamples, setRelatedSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialSample);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>(category);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked =
        sessionStorage.getItem(`sample_unlocked_${slug}`) === "true" ||
        localStorage.getItem(`sample_unlocked_${slug}`) === "true";
      if (unlocked) {
        setIsUnlocked(true);
      }
    }
  }, [slug]);
  
  const [unlockName, setUnlockName] = useState("");
  const [unlockPhone, setUnlockPhone] = useState("");
  const [unlockEmail, setUnlockEmail] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Count headings (h1 + h2 + h3) in sequence: exactly 3 headings are visible,
  // and blur begins right after the 3rd heading (at the 4th heading)
  const { previewHtml, lockedHtml } = useMemo(() => {
    if (!sample?.content) return { previewHtml: "", lockedHtml: "" };
    if (isUnlocked) return { previewHtml: sample.content, lockedHtml: "" };

    const html = sample.content;

    // Match any h1, h2, or h3 heading in order
    const headingRegex = /<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/gi;
    const matches: { index: number; end: number }[] = [];
    let m;
    while ((m = headingRegex.exec(html)) !== null) {
      matches.push({ index: m.index, end: m.index + m[0].length });
    }

    let splitIndex = -1;

    if (matches.length >= 4) {
      // First 3 headings (h1/h2/h3) visible; blur starts at the 4th heading
      splitIndex = matches[3].index;
    } else if (matches.length === 3) {
      // Exactly 3 headings: include 3rd heading and its following text block
      const thirdEnd = matches[2].end;
      const pMatches = [...html.slice(thirdEnd).matchAll(/<\/p>|<\/ol>|<\/ul>/gi)];
      if (pMatches.length >= 2 && pMatches[1].index !== undefined) {
        splitIndex = thirdEnd + pMatches[1].index + 4;
      } else if (pMatches.length >= 1 && pMatches[0].index !== undefined) {
        splitIndex = thirdEnd + pMatches[0].index + 4;
      } else {
        splitIndex = thirdEnd;
      }
    } else {
      // Fewer than 3 headings: split after the 3rd paragraph or 40% of content
      const pMatches = [...html.matchAll(/<\/p>/gi)];
      if (pMatches.length >= 3 && pMatches[2].index !== undefined) {
        splitIndex = pMatches[2].index + 4;
      } else {
        splitIndex = Math.floor(html.length * 0.4);
      }
    }

    if (splitIndex <= 0 || splitIndex >= html.length) {
      splitIndex = Math.floor(html.length * 0.4);
    }

    return {
      previewHtml: html.slice(0, splitIndex),
      lockedHtml: html.slice(splitIndex),
    };
  }, [sample?.content, isUnlocked]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    try {
      const response = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: unlockName,
          email: unlockEmail,
          phone: unlockPhone,
          countryCode: "+44",
          countryIso: "GB",
          service: "Assignment",
          subject: categoryName || "Sample Reference",
          deadline: "5",
          wordCount: "250",
          description: `Unlock Sample Request: ${sample?.title || "Unknown Sample"}`,
          source_page: window.location.href,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem(`sample_unlocked_${slug}`, "true");
        sessionStorage.setItem(`sample_unlocked_${slug}`, "true");
        setIsUnlocked(true);
        toast.success("Sample unlocked successfully!");
      } else {
        toast.error(data.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };


  useEffect(() => {
    const fetchSampleDetail = async () => {
      // If we already have the sample from SSR, we can skip fetching it again,
      // or we can fetch only related samples
      if (!sample) {
        setLoading(true);
      }
      setError(null);
      try {
        let sampleData = sample;
        
        if (!sampleData) {
          // Fetch specific sample detail with retry logic
          let response;
          let retries = 3;
          let lastErrorMsg = "Sample paper not found.";

          while (retries > 0) {
            try {
              response = await fetch(`/api/samples/${encodeURIComponent(slug)}`);
              if (response.ok) {
                break;
              } else if (response.status === 404) {
                lastErrorMsg = "Sample paper not found.";
                break; // Don't retry 404s
              } else {
                const errJson = await response.json().catch(() => null);
                lastErrorMsg = errJson?.message || `Server error (${response.status})`;
                retries--;
                if (retries > 0) await new Promise(res => setTimeout(res, 1000));
              }
            } catch (e: any) {
              lastErrorMsg = e.message || "Network error occurred.";
              retries--;
              if (retries > 0) await new Promise(res => setTimeout(res, 1000));
            }
          }

          if (!response || !response.ok) {
            throw new Error(lastErrorMsg);
          }
          
          const json = await response.json();

          if (json.success && json.data) {
            sampleData = json.data;
            setSample(sampleData);
          } else {
            throw new Error("Failed to load sample data.");
          }
        }

        if (sampleData) {
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Area Skeleton */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left">
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
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
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
    notFound();
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
        <Link href={`/samples/${sample.category_name ? sample.category_name.toLowerCase().replace(/ /g, '-') : category}`} className="hover:text-purple-700">
          {sample.category_name || readableCategory}
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 font-medium truncate max-w-xs inline-block align-bottom">
          {sample.title}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6 text-left">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                  {sample.type_name || "Assignment Sample"}
                </span>
                <RatingBadge className="!mb-0" />
              </div>
              <h1 className="text-2xl md:text-3.5xl font-extrabold text-gray-900 mt-2 leading-snug">
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
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              {/* Unblurred Content (Intro + First 3 Headings & Text) */}
              <div
                className="prose-content text-gray-700 leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />

              {/* Locked/Blurred section after 3 headings */}
              {!isUnlocked && lockedHtml && (
                <div className="relative mt-6 pt-2 min-h-[480px]">
                  {/* Blurred background preview of the rest */}
                  <div
                    className="prose-content text-gray-700 leading-relaxed max-w-none select-none pointer-events-none filter blur-[4px] opacity-45 max-h-[550px] overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: lockedHtml }}
                  />

                  {/* Gradient fade overlay + Unlock Form */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-white/85 to-white p-4">
                    <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] max-w-md w-full border border-purple-100 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Full Sample</h3>
                      <p className="text-sm text-gray-500 mb-5">Enter your details to view the complete sample for free.</p>
                      <form 
                        className="flex flex-col gap-3.5 text-left" 
                        onSubmit={handleUnlockSubmit}
                      >
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                          <input type="text" required value={unlockName} onChange={e => setUnlockName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm" placeholder="Your Name" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                          <input type="tel" required value={unlockPhone} onChange={e => setUnlockPhone(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm" placeholder="Your Number" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                          <input type="email" required value={unlockEmail} onChange={e => setUnlockEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm" placeholder="Your Email" />
                        </div>
                        <button type="submit" disabled={isUnlocking} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors mt-1 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                          {isUnlocking ? <><Loader2 className="w-4 h-4 animate-spin" /> Unlocking...</> : "Unlock Now"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
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
          </div>

          {/* Right Sidebar Form & Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
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
          </div>
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
                          href={`/samples/${rel.category_name ? rel.category_name.toLowerCase().replace(/ /g, '-') : 'general'}/${rel.slug}`}
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
