"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { WRITERS, Writer } from "@/lib/data";
import { mapExpertToWriter } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { Button } from "@/components/ui/Button";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimateIn";
import "./writers.css";

const SUBJECT_OPTIONS = [
  { label: "All Subjects", value: "all" },
  { label: "Business", value: "business" },
  { label: "Chemistry", value: "chemistry" },
  { label: "English", value: "english" },
  { label: "Finance", value: "finance" },
  { label: "History", value: "history" },
  { label: "Marketing", value: "marketing" },
  { label: "Math", value: "math" },
  { label: "Philosophy", value: "philosophy" },
];

const QUALIFICATION_OPTIONS = [
  { label: "All Qualifications", value: "all" },
  { label: "Ph.D.", value: "phd" },
  { label: "Master's Degree", value: "masters" },
  { label: "Bachelor's Degree", value: "bachelors" },
];

const EXPERIENCE_OPTIONS = [
  { label: "All Experience", value: "all" },
  { label: "1 - 3 Years", value: "1" },
  { label: "3 - 5 Years", value: "3" },
  { label: "5 - 10 Years", value: "5" },
  { label: "10+ Years", value: "10" },
];

const SORT_OPTIONS = [
  { label: "Most Rated", value: "rating-desc" },
  { label: "Highest Rated", value: "rating-desc-high" },
  { label: "Newest Experts", value: "orders-desc" },
];

const sortWriters = (writers: Writer[], sort: string) =>
  [...writers].sort((a, b) => {
    if (sort === "rating-desc" || sort === "rating-desc-high") {
      return b.rating - a.rating;
    }

    if (sort === "orders-desc") {
      const aCount =
        typeof a.ordersCompleted === "number"
          ? a.ordersCompleted
          : parseInt(a.ordersCompleted) || 0;
      const bCount =
        typeof b.ordersCompleted === "number"
          ? b.ordersCompleted
          : parseInt(b.ordersCompleted) || 0;
      return bCount - aCount;
    }

    return 0;
  });

const getWriterIdentity = (writer: Writer) => {
  const id = `${writer.id ?? ""}`.trim().toLowerCase();
  if (id && id !== "undefined" && id !== "null") return `id:${id}`;
  return `name:${writer.name.trim().toLowerCase().replace(/\s+/g, "-")}`;
};

export default function WritersDirectory() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedQual, setSelectedQual] = useState("all");
  const [selectedExp, setSelectedExp] = useState("all");
  const [selectedSort, setSelectedSort] = useState("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreWriters, setHasMoreWriters] = useState(true);
  const [dynamicSubjects, setDynamicSubjects] = useState<any[]>([]);

  // Sync URL search params on mount (persists page & filter state on hard refresh)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const subjectParam = params.get("subject") || "all";
      const qualParam = params.get("qual") || "all";
      const expParam = params.get("exp") || "all";
      const sortParam = params.get("sort") || "rating-desc";

      if (subjectParam) setSelectedSubject(subjectParam);
      if (qualParam) setSelectedQual(qualParam);
      if (expParam) setSelectedExp(expParam);
      if (sortParam) setSelectedSort(sortParam);
    }
  }, []);

  const updateUrlParams = (
    subject: string,
    qual: string,
    exp: string,
    sort: string,
  ) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (subject !== "all") params.set("subject", subject);
      if (qual !== "all") params.set("qual", qual);
      if (exp !== "all") params.set("exp", exp);
      if (sort !== "rating-desc") params.set("sort", sort);

      const queryString = params.toString();
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  };

  const handleSubjectChange = (val: string) => {
    setSelectedSubject(val);
    setCurrentPage(1);
    updateUrlParams(val, selectedQual, selectedExp, selectedSort);
  };

  const handleQualChange = (val: string) => {
    setSelectedQual(val);
    setCurrentPage(1);
    updateUrlParams(selectedSubject, val, selectedExp, selectedSort);
  };

  const handleExpChange = (val: string) => {
    setSelectedExp(val);
    setCurrentPage(1);
    updateUrlParams(selectedSubject, selectedQual, val, selectedSort);
  };

  const handleSortChange = (val: string) => {
    setSelectedSort(val);
    setCurrentPage(1);
    updateUrlParams(selectedSubject, selectedQual, selectedExp, val);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subject-pages", { cache: "no-store" });
        if (res.ok) {
          const payload = await res.json();
          if (
            (payload.success || payload.status === "success") &&
            Array.isArray(payload.data)
          ) {
            const mapped = payload.data.map((sub: any) => {
              const cleanSlug = (sub.slug || "").replace(/^\/+/, "");
              const finalSlug = cleanSlug.startsWith("subject/")
                ? cleanSlug.replace("subject/", "")
                : cleanSlug;
              const humanized = finalSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c: string) => c.toUpperCase());
              const label =
                sub.title?.split(" Help")[0]?.split(" Assignment")[0] ||
                humanized;
              return { label, value: finalSlug };
            });
            setDynamicSubjects([
              { label: "All Subjects", value: "all" },
              ...mapped,
            ]);
          }
        }
      } catch (err) {
        console.error("Error fetching subjects for writers filter:", err);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        if (currentPage === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const res = await fetch(`/api/experts?page=${currentPage}&limit=8`, {
          cache: "no-store",
        });
        if (res.ok) {
          const result = await res.json();

          if (result.success && Array.isArray(result.data)) {
            const mapped: Writer[] = sortWriters(
              result.data.map((item: any) => mapExpertToWriter(item)),
              selectedSort,
            );
            const reportedTotal = Number(result.pagination?.total) || 0;

            setWriters((previous) => {
              const existingIdentities = new Set(
                previous.flatMap((writer) => [
                  getWriterIdentity(writer),
                  writer.name.trim().toLowerCase(),
                ]),
              );
              const newWriters =
                currentPage === 1
                  ? mapped
                  : mapped.filter((writer) => {
                      const identity = getWriterIdentity(writer);
                      const normalizedName = writer.name.trim().toLowerCase();
                      if (
                        existingIdentities.has(identity) ||
                        existingIdentities.has(normalizedName)
                      ) {
                        return false;
                      }
                      existingIdentities.add(identity);
                      existingIdentities.add(normalizedName);
                      return true;
                    });
              const combined =
                currentPage === 1 ? newWriters : [...previous, ...newWriters];

              setHasMoreWriters(
                newWriters.length > 0 &&
                  mapped.length === 8 &&
                  (reportedTotal === 0 || combined.length < reportedTotal),
              );

              return combined;
            });
          } else {
            setHasMoreWriters(false);
          }
        } else {
          setHasMoreWriters(false);
        }
      } catch (err) {
        console.error("Error fetching experts:", err);
        if (currentPage === 1) {
          setWriters(WRITERS.slice(0, 8));
          setHasMoreWriters(WRITERS.length > 8);
        } else {
          setHasMoreWriters(false);
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchWriters();
  }, [currentPage]);


  // Filter and sort logic
  const filteredWriters = useMemo(() => {
    let result = [...writers];

    // Subject Filter
    if (selectedSubject !== "all") {
      result = result.filter((w) =>
        w.expertise.some((exp) =>
          exp.toLowerCase().includes(selectedSubject.toLowerCase()),
        ),
      );
    }

    // Qualification Filter
    if (selectedQual !== "all") {
      result = result.filter((w) => {
        const qual = w.qualifications.toLowerCase();
        if (selectedQual === "phd")
          return qual.includes("ph.d") || qual.includes("phd");
        if (selectedQual === "masters") return qual.includes("master");
        if (selectedQual === "bachelors") return qual.includes("bachelor");
        return true;
      });
    }

    // Experience Filter
    if (selectedExp !== "all") {
      result = result.filter((w) => {
        const years = parseInt(w.experience) || 0;
        return years >= parseInt(selectedExp);
      });
    }

    // Keep loaded batches in append order so new experts always appear below.
    // On the first batch, sorting still responds immediately to the filter.
    if (currentPage === 1) {
      result = sortWriters(result, selectedSort);
    }

    return result;
  }, [
    writers,
    selectedSubject,
    selectedQual,
    selectedExp,
    selectedSort,
    currentPage,
  ]);

  const currentWriters = filteredWriters;

  return (
    <div className="znw-page-wrapper">
      {/* Hero Section */}
      <section className="znw-hero-section">
        <div className="znw-hero-top">
          <div className="znw-hero-content">
            <div className="znw-hero-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              Our Writers
            </div>
            <h1 className="znw-hero-title">
              <span className="znw-desktop-nowrap">
                Meet Our Top{" "}
                <br className="znw-br-mobile" />
                Academic Writers
              </span>
              <br />
              <span>
                <span className="znw-text-purple">Experts</span>{" "}
                <span className="znw-text-gradient">You Can Rely On</span>
              </span>
            </h1>
            <p className="znw-hero-desc">
              Our team of highly qualified academic writers is dedicated to
              helping you
              <br />
              achieve top grades with original, well-researched, and
              high-quality content.
            </p>
          </div>
          <div className="znw-hero-image-wrapper hidden lg:flex">
            <img
              src="/new-home-page-images/Writer-Hero-bg.webp"
              alt="Academic Writers Illustration"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Dropdown Filters */}
          <div className="znw-filters-container">
            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Subject</label>
                <CustomDropdown
                  options={
                    dynamicSubjects.length > 0
                      ? dynamicSubjects
                      : SUBJECT_OPTIONS
                  }
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  triggerClassName="!text-[0.95rem] !text-gray-600 !h-[46px] !px-4 bg-white !border !border-solid !border-gray-200 rounded-lg focus:border-purple-600 focus-within:border-purple-600 transition-colors flex items-center justify-between shadow-sm w-full font-medium"
                  dropdownClassName="!text-[0.95rem] shadow-lg rounded-lg border border-gray-150"
                />
              </div>
            </div>

            <div className="znw-filter-divider"></div>

            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Qualification</label>
                <CustomDropdown
                  options={QUALIFICATION_OPTIONS}
                  value={selectedQual}
                  onChange={handleQualChange}
                  triggerClassName="!text-[0.95rem] !text-gray-600 !h-[46px] !px-4 bg-white !border !border-solid !border-gray-200 rounded-lg focus:border-purple-600 focus-within:border-purple-600 transition-colors flex items-center justify-between shadow-sm w-full font-medium"
                  dropdownClassName="!text-[0.95rem] shadow-lg rounded-lg border border-gray-150"
                />
              </div>
            </div>

            <div className="znw-filter-divider"></div>

            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Experience</label>
                <CustomDropdown
                  options={EXPERIENCE_OPTIONS}
                  value={selectedExp}
                  onChange={handleExpChange}
                  triggerClassName="!text-[0.95rem] !text-gray-600 !h-[46px] !px-4 bg-white !border !border-solid !border-gray-200 rounded-lg focus:border-purple-600 focus-within:border-purple-600 transition-colors flex items-center justify-between shadow-sm w-full font-medium"
                  dropdownClassName="!text-[0.95rem] shadow-lg rounded-lg border border-gray-150"
                />
              </div>
            </div>

            <div className="znw-filter-divider"></div>

            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Sort By</label>
                <CustomDropdown
                  options={SORT_OPTIONS}
                  value={selectedSort}
                  onChange={handleSortChange}
                  triggerClassName="!text-[0.95rem] !text-gray-600 !h-[46px] !px-4 bg-white !border !border-solid !border-gray-200 rounded-lg focus:border-purple-600 focus-within:border-purple-600 transition-colors flex items-center justify-between shadow-sm w-full font-medium"
                  dropdownClassName="!text-[0.95rem] shadow-lg rounded-lg border border-gray-150"
                />
              </div>
            </div>
          </div>

          {/* Expert Grid */}
          {loading ? (
            <div className="znw-experts-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="znw-expert-card animate-pulse">
                  <div className="znw-card-header">
                    <div className="znw-avatar-wrapper bg-slate-200" />
                    <div className="znw-header-info flex flex-col gap-2">
                      <div className="w-28 h-5 bg-slate-200 rounded" />
                      <div className="w-20 h-3.5 bg-slate-200 rounded" />
                      <div className="w-24 h-3.5 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="znw-card-body flex flex-col gap-3">
                    <div className="w-2/3 h-4 bg-slate-200 rounded" />
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-slate-200 rounded" />
                      <div className="w-5/6 h-3 bg-slate-200 rounded" />
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-slate-200 rounded" />
                      <div className="w-4/5 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="znw-card-footer mt-4">
                    <div className="w-full h-10 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : currentWriters.length > 0 ? (
            <div>
              <StaggerContainer className="znw-experts-grid">
                {currentWriters.map((writer) => {
                  const filledStars = Math.round(writer.rating);
                  return (
                    <StaggerItem key={writer.id}>
                      <div className="znw-expert-card h-full flex flex-col justify-between">
                        <div>
                          <div className="znw-card-header">
                            <div className="znw-avatar-wrapper">
                              {writer.avatar &&
                              writer.avatar.length > 3 &&
                              (writer.avatar.startsWith("/") ||
                                writer.avatar.startsWith("http")) ? (
                                <img
                                  src={writer.avatar}
                                  alt={writer.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/assets/media/avatars/blank.png";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-lg uppercase">
                                  {writer.avatar || writer.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="znw-header-info">
                              <h3 className="znw-expert-name">{writer.name}</h3>
                              <p className="znw-expert-role">
                                {writer.role || "Academic Expert"}
                              </p>
                              <div className="znw-expert-rating">
                                <div className="znw-stars">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={
                                        i < filledStars
                                          ? "text-[#fbbf24]"
                                          : "text-[#e5e7eb]"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="znw-rating-number">
                                  {writer.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="znw-card-body">
                            <div className="znw-orders-stat">
                              <div className="znw-icon">
                                <svg
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                              </div>
                              <div>
                                <span className="znw-orders-count">
                                  {writer.ordersCompleted}
                                </span>{" "}
                                <span className="znw-orders-text">
                                  Orders Completed
                                </span>
                              </div>
                            </div>

                            <div className="znw-info-section">
                              <h4 className="znw-info-title">Expertise</h4>
                              <p className="znw-info-text">
                                {writer.expertise.join(", ")}
                              </p>
                            </div>

                            <div className="znw-info-section">
                              <h4 className="znw-info-title">Qualifications</h4>
                              <p className="znw-info-text">
                                {writer.qualifications}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="znw-card-footer">
                          <button
                            onClick={() => {
                              window.location.href = `/writers/${writer.id}`;
                            }}
                            className="btn-shutter-blue-close flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold text-[0.95rem] rounded-lg cursor-pointer"
                          >
                            Hire Now{" "}
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>

              {hasMoreWriters && (
                <div className="mb-12 mt-8 flex justify-center">
                  <Button
                    type="button"
                    variant="blueOpen"
                    size="md"
                    isLoading={isLoadingMore}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    className="min-w-[160px]"
                  >
                    {isLoadingMore ? "Loading Experts..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 mt-12">
              <p className="text-gray-500 font-semibold">
                No academic experts match your selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedSubject("all");
                  setSelectedQual("all");
                  setSelectedExp("all");
                  setSelectedSort("rating-desc");
                  setCurrentPage(1);
                }}
                className="btn-shutter-blue-close text-xs font-bold mt-2 px-4 py-2 rounded-lg cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Stats Banner Section */}
      <section className="znw-stats-section">
        <div className="znw-stats-banner">
          <div className="znw-banner-left">
            <h2 style={{ whiteSpace: "nowrap" }}>
              <span className="block">Need Expert Help With</span>
              <span className="block">Your Assignments?</span>
            </h2>
            <p>
              Our professional academic writers are here to deliver
              high-quality, plagiarism-free assignments tailored to your
              requirements.
            </p>
            <Link
              href="/order"
              className="btn-shutter-orange-open inline-flex items-center gap-2 font-semibold text-base py-3.5 px-7 rounded-lg cursor-pointer shadow-[0_4px_15px_rgba(255,107,0,0.4)]"
            >
              Get Free Quote Now &rarr;
            </Link>
          </div>
          <div className="znw-banner-divider"></div>
          <div className="znw-banner-right">
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 14h6"></path>
                  <path d="M9 10h6"></path>
                  <path d="M9 18h6"></path>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">182532 +</span>
                <span className="znw-stat-label">
                  Orders
                  <br />
                  Delivered
                </span>
              </div>
            </div>
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">30000 +</span>
                <span className="znw-stat-label">
                  Happy
                  <br />
                  Clients
                </span>
              </div>
            </div>
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">4.8/5 +</span>
                <span className="znw-stat-label">
                  Clients
                  <br />
                  Rating
                </span>
              </div>
            </div>
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">4500 +</span>
                <span className="znw-stat-label">
                  PH.D
                  <br />
                  Experts
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
