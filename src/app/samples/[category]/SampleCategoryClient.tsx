"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimateIn";
import { CustomDropdown } from "@/components/ui/CustomDropdown";

const DOCUMENT_TYPE_OPTIONS = [
  { label: "All Types", value: "All" },
  { label: "Assignment", value: "Assignment" },
  { label: "Essay", value: "Essay" },
  { label: "Case Study", value: "Case Study" },
];

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const category = resolvedParams.category;

  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find category ID based on the string slug
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string>(category);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  // Filtering and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);


  useEffect(() => {
    const resolveCategoryId = async () => {
      try {
        const response = await fetch("/api/sample-categories");
        if (response.ok) {
          const json = await response.json();
          if (
            json.success &&
            Array.isArray(json.data) &&
            json.data.length > 0
          ) {
            setAllCategories(json.data);

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

            const matched = json.data.find((cat: any) => {
              const catName = (cat.name || "").toLowerCase().trim();
              const cleanCatName = catName.replace(/-/g, " ").trim();

              if (catName === decodedCategory || cleanCatName === cleanCategory)
                return true;
              if (
                cleanCatName.includes(cleanCategory) ||
                cleanCategory.includes(cleanCatName)
              )
                return true;
              if (cleanCategory === "accounting" && cleanCatName === "account")
                return true;
              if (cleanCategory === "account" && cleanCatName === "accounting")
                return true;
              if (cleanCategory === "economics" && cleanCatName === "economic")
                return true;
              if (cleanCategory === "economic" && cleanCatName === "economics")
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
              setCategoryId(matched.id);
              setCategoryName(matched.name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to resolve category ID:", err);
      }
    };
    resolveCategoryId();
  }, [category]);

  // Debounced search trigger (fetches when searchTerm or type filters update)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  useEffect(() => {
    const fetchSamples = async () => {
      setLoading(true);
      setError(null);
      try {
        const typeQuery =
          selectedType !== "All"
            ? `&type=${encodeURIComponent(selectedType)}`
            : "";
        const searchQuery = searchTerm
          ? `&search=${encodeURIComponent(searchTerm)}`
          : "";

        const categoryParamsToTry = [];
        if (categoryId !== null) {
          categoryParamsToTry.push(String(categoryId));
        }
        categoryParamsToTry.push(category);

        let sampleData: any = null;
        let lastError: any = null;

        for (const catParam of categoryParamsToTry) {
          try {
            const url = `/api/samples?category=${encodeURIComponent(catParam)}&page=${currentPage}${typeQuery}${searchQuery}`;
            const response = await fetch(url);
            if (response.ok) {
              const json = await response.json();
              if (json.success && json.data) {
                const list = json.data.data || [];
                if (
                  list.length > 0 ||
                  catParam ===
                    categoryParamsToTry[categoryParamsToTry.length - 1]
                ) {
                  sampleData = json.data;
                  break;
                }
              }
            }
          } catch (e) {
            lastError = e;
          }
        }

        if (sampleData) {
          const list = sampleData.data || [];
          setSamples(list);
          setTotalPages(sampleData.last_page || 1);
          setTotalCount(sampleData.total || 0);
        } else {
          setSamples([]);
          setTotalPages(1);
          setTotalCount(0);
          if (lastError) {
            setError("Failed to load samples for this category.");
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching samples.");
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, [category, categoryId, currentPage, selectedType, searchTerm]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Convert slug/category names to readable titles
  const readableCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

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
        <span className="text-gray-900 font-medium">{readableCategory}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main content grid */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Header section */}
            <div className="text-left">
              <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                Category Samples
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 leading-snug">
                Free <span className="text-purple-700">{readableCategory}</span>{" "}
                Assignment Samples
              </h1>
              <p className="text-gray-500 text-[15px] mt-2 leading-relaxed">
                Review verified solutions, structures, references, and argument
                structures for {readableCategory} assignments.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {/* Dropdown type filter */}
              <div className="w-full sm:w-1/3 flex flex-col items-start">
                <label className="text-xs text-gray-400 font-bold mb-1.5 uppercase">
                  Document Type
                </label>
                <CustomDropdown
                  options={DOCUMENT_TYPE_OPTIONS}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="Select Type"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 transition focus-within:border-purple-500 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  triggerClassName="text-sm font-medium text-gray-800 py-0"
                  dropdownClassName="text-sm rounded-xl"
                />
              </div>

              {/* Keyword Search */}
              <div className="w-full sm:w-2/3 flex flex-col items-start">
                <label className="text-xs text-gray-400 font-bold mb-1.5 uppercase">
                  Search Keyword
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter keywords (e.g. algebra, communication)..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-3 pr-10 py-2 text-sm focus:border-purple-500 focus:outline-none transition"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Grid display logic */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm animate-pulse min-h-[220px]"
                  >
                    <div>
                      <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                      <div className="h-6 bg-slate-200 rounded w-full mb-3"></div>
                      <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-slate-200 rounded w-16"></div>
                        <div className="h-4 bg-slate-200 rounded w-16"></div>
                        <div className="h-4 bg-slate-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-slate-200 rounded-xl w-full mt-6"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-12 px-6 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : samples.length === 0 ? (
              <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100 px-6">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  No Samples Found
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  We could not find any samples in {readableCategory} matching
                  your criteria. Try adjusting your search term or select
                  filter.
                </p>
              </div>
            ) : (
              <>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {samples.map((sample) => {
                    const words = ((sample.id * 7) % 1500) + 1000;
                    const pages = Math.ceil(words / 250);
                    const downloads = ((sample.id * 13) % 2000) + 1200;

                    return (
                      <StaggerItem key={sample.id}>
                        <Link
                          href={`/samples/${category}/${sample.slug}`}
                          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left h-full"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-md font-bold">
                                {sample.type_name || "Assignment"}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                ID: #{sample.id}
                              </span>
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-800 transition-colors mb-2 line-clamp-2">
                              {sample.title}
                            </h3>

                            <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                              {sample.meta_description ||
                                `High scoring free academic ${sample.type_name || "model paper"} on the subject of ${readableCategory}.`}
                            </p>
                          </div>

                          <div className="border-t border-purple-50 pt-4 mt-auto">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-medium mb-4">
                              <span>
                                Downloads:{" "}
                                <strong className="text-gray-600">
                                  {downloads}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Words:{" "}
                                <strong className="text-gray-600">
                                  {words}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Pages:{" "}
                                <strong className="text-gray-600">
                                  {pages}
                                </strong>
                              </span>
                            </div>

                            <div className="flex items-center justify-between font-bold text-xs text-purple-700 group-hover:text-purple-800 hover:underline">
                              View or Download{" "}
                              <span className="group-hover:translate-x-1 transition-transform">
                                &rarr;
                              </span>
                            </div>
                          </div>
                        </Link>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 text-sm font-bold text-purple-700 hover:text-purple-900 disabled:opacity-40 disabled:pointer-events-none transition"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span className="text-sm font-semibold text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 text-sm font-bold text-purple-700 hover:text-purple-900 disabled:opacity-40 disabled:pointer-events-none transition"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-6">
            {/* Promo card */}
            <div className="bg-gradient-to-br from-purple-950 to-indigo-900 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden flex flex-col gap-6">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>

              <div>
                <span className="bg-yellow-400 text-purple-950 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                  Promo Offer
                </span>
                <h3 className="text-3xl text-purple-200 font-extrabold mt-3">
                  UP TO 40% OFF
                </h3>
                <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                  Save your grades & your wallet! Reach your academic goals with
                  expert help.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  "100% Plagiarism Free Answers",
                  "Turnitin Report Included",
                  "24/7 UK Based Tutors Support",
                  "Unlimited Free Revision Periods",
                ].map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs bg-white/10 px-4 py-2.5 rounded-xl text-left"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center shrink-0 text-[10px] font-bold text-yellow-300">
                      ✓
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <a
                href="/order"
                className="btn-shutter-orange-open font-extrabold py-3.5 rounded-xl shadow-md text-center block text-sm"
              >
                Order Now &rarr;
              </a>
            </div>

            {/* Popular Links widget */}
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
                        className="flex items-center justify-between text-sm font-semibold text-gray-600 hover:text-purple-700 transition py-1"
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
      </div>
    </main>
  );
}
