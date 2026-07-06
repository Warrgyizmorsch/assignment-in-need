"use client";

import React, { useState, useMemo, useEffect } from "react";
import { WRITERS, Writer } from "@/lib/data";
import { getBaseUrl, mapExpertToWriter } from "@/lib/api";
import { Loader2 } from "lucide-react";
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

export default function WritersDirectory() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedQual, setSelectedQual] = useState("all");
  const [selectedExp, setSelectedExp] = useState("all");
  const [selectedSort, setSelectedSort] = useState("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        setLoading(true);
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/experts`);
        if (res.ok) {
          const result = await res.json();

          if (result.success && Array.isArray(result.data)) {
            const mapped = result.data.map((item: any) => mapExpertToWriter(item));
            const dbNames = new Set(mapped.map((w: any) => w.name.toLowerCase()));
            const nonDuplicateStatic = WRITERS.filter((w) => !dbNames.has(w.name.toLowerCase()));
            setWriters([...mapped, ...nonDuplicateStatic]);
          } else {
            setWriters(WRITERS);
          }
        } else {
          setWriters(WRITERS);
        }
      } catch (err) {
        console.error("Error fetching experts:", err);
        setWriters(WRITERS);
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, []);

  // Filter and sort logic
  const filteredWriters = useMemo(() => {
    let result = [...writers];

    // Subject Filter
    if (selectedSubject !== "all") {
      result = result.filter((w) =>
        w.expertise.some((exp) => exp.toLowerCase().includes(selectedSubject.toLowerCase()))
      );
    }

    // Qualification Filter
    if (selectedQual !== "all") {
      result = result.filter((w) => {
        const qual = w.qualifications.toLowerCase();
        if (selectedQual === "phd") return qual.includes("ph.d") || qual.includes("phd");
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

    // Sort
    result.sort((a, b) => {
      if (selectedSort === "rating-desc" || selectedSort === "rating-desc-high") {
        return b.rating - a.rating;
      }
      if (selectedSort === "orders-desc") {
        const aCount = typeof a.ordersCompleted === "number" ? a.ordersCompleted : parseInt(a.ordersCompleted) || 0;
        const bCount = typeof b.ordersCompleted === "number" ? b.ordersCompleted : parseInt(b.ordersCompleted) || 0;
        return bCount - aCount;
      }
      return 0;
    });

    return result;
  }, [writers, selectedSubject, selectedQual, selectedExp, selectedSort]);

  // Pagination bounds
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredWriters.length / itemsPerPage));
  
  const currentWriters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWriters.slice(start, start + itemsPerPage);
  }, [filteredWriters, currentPage]);

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
                Meet Our Top
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
              Our team of highly qualified academic writers is dedicated to helping you
              <br />
              achieve top grades with original, well-researched, and high-quality content.
            </p>
          </div>
          <div className="znw-hero-image-wrapper hidden lg:flex">
            <img 
              src="https://assignmentinneed.co.uk/public/new-home-page-images/Writer-Hero-bg.webp" 
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
                <select 
                  className="znw-filter-select"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="znw-filter-divider"></div>

            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Qualification</label>
                <select 
                  className="znw-filter-select"
                  value={selectedQual}
                  onChange={(e) => {
                    setSelectedQual(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {QUALIFICATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="znw-filter-divider"></div>

            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Experience</label>
                <select 
                  className="znw-filter-select"
                  value={selectedExp}
                  onChange={(e) => {
                    setSelectedExp(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="znw-filter-divider"></div>

            <div className="znw-filter-group">
              <div className="znw-filter-content">
                <label className="znw-filter-label">Sort By</label>
                <select 
                  className="znw-filter-select"
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Expert Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              <p className="text-sm font-semibold text-gray-500">Loading expert writers...</p>
            </div>
          ) : currentWriters.length > 0 ? (
            <div>
              <div className="znw-experts-grid">
                {currentWriters.map((writer) => {
                  const filledStars = Math.round(writer.rating);
                  return (
                    <div key={writer.id} className="znw-expert-card">
                      <div className="znw-card-header">
                        <div className="znw-avatar-wrapper">
                          <img 
                            src={writer.avatar || "/assets/media/avatars/blank.png"} 
                            alt={writer.name} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/media/avatars/blank.png";
                            }}
                          />
                        </div>
                        <div className="znw-header-info">
                          <h3 className="znw-expert-name">{writer.name}</h3>
                          <p className="znw-expert-role">{writer.role || "Academic Expert"}</p>
                          <div className="znw-expert-rating">
                            <div className="znw-stars">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < filledStars ? "text-[#fbbf24]" : "text-[#e5e7eb]"}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="znw-rating-number">{writer.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="znw-card-body">
                        <div className="znw-orders-stat">
                          <div className="znw-icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            <span className="znw-orders-text">Orders Completed</span>
                          </div>
                        </div>

                        <div className="znw-info-section">
                          <h4 className="znw-info-title">Expertise</h4>
                          <p className="znw-info-text">{writer.expertise.join(", ")}</p>
                        </div>

                        <div className="znw-info-section">
                          <h4 className="znw-info-title">Qualifications</h4>
                          <p className="znw-info-text">{writer.qualifications}</p>
                        </div>
                      </div>

                      <div className="znw-card-footer">
                        <button 
                          onClick={() => {
                            window.location.href = `/writers/${writer.id}`;
                          }}
                          className="znw-hire-btn"
                        >
                          Hire Now <span className="znw-btn-arrow">→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="znw-pagination-wrapper">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button 
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          className="page-link"
                          disabled={currentPage === 1}
                        >
                          ‹
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button 
                            onClick={() => setCurrentPage(i + 1)}
                            className="page-link"
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button 
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                          className="page-link"
                          disabled={currentPage === totalPages}
                        >
                          ›
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 mt-12">
              <p className="text-gray-500 font-semibold">No academic experts match your selected filters.</p>
              <button
                onClick={() => {
                  setSelectedSubject("all");
                  setSelectedQual("all");
                  setSelectedExp("all");
                  setSelectedSort("rating-desc");
                  setCurrentPage(1);
                }}
                className="text-xs text-[#4b23b3] font-bold underline mt-2 hover:text-[#6d28d9]"
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
              Our professional academic writers are here to deliver high-quality, plagiarism-free assignments
              tailored to your requirements.
            </p>
            <a href="#" className="znw-quote-btn">
              Get Free Quote Now &rarr;
            </a>
          </div>
          <div className="znw-banner-divider"></div>
          <div className="znw-banner-right">
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 14h6"></path>
                  <path d="M9 10h6"></path>
                  <path d="M9 18h6"></path>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">182532 +</span>
                <span className="znw-stat-label">Orders<br />Delivered</span>
              </div>
            </div>
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">30000 +</span>
                <span className="znw-stat-label">Happy<br />Clients</span>
              </div>
            </div>
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">4.8/5 +</span>
                <span className="znw-stat-label">Clients<br />Rating</span>
              </div>
            </div>
            <div className="znw-stat-box">
              <div className="znw-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div className="znw-stat-content">
                <span className="znw-stat-num">4500 +</span>
                <span className="znw-stat-label">PH.D<br />Experts</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
