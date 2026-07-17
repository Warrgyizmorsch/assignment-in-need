"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { Loader2 } from "lucide-react";
import { getBaseUrl, getImageUrl } from "@/lib/api";
import { SidebarQuoteForm } from "@/components/ui/SidebarQuoteForm";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);



  const fetchBlogs = async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/blogs?page=${page}&limit=9`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          if (page === 1) {
            setBlogs(result.data.data);
          } else {
            setBlogs((prev) => [...prev, ...result.data.data]);
          }
          setCurrentPage(result.data.current_page);
          setLastPage(result.data.last_page);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const handleShowMore = () => {
    if (currentPage < lastPage) {
      fetchBlogs(currentPage + 1);
    }
  };



  const latestPost = blogs[0];
  const otherPosts = blogs.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-primary-700 to-navy-900 py-16 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wide uppercase font-heading drop-shadow-md">
            BLOGS : ASSIGNMENT IN NEED
          </h1>
        </div>
      </section>

      {/* Main Container Overlapping the Hero */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20 pb-24">
        <div className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Blog Feed (lg:col-span-8) */}
            <main className="lg:col-span-8 flex flex-col gap-10">
              {loading && blogs.length === 0 ? (
                <div className="flex flex-col gap-10">
                  {/* Featured Blog Card Skeleton */}
                  <div className="flex flex-col">
                    <div className="w-full h-[240px] sm:h-[400px] rounded-3xl bg-slate-200 animate-pulse mb-6" />

                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
                      <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                    </div>

                    <div className="w-3/4 h-8 bg-slate-200 rounded-md animate-pulse mb-4" />

                    <div className="bg-slate-100/50 border border-slate-100 rounded-3xl p-5 md:p-6 mb-6 flex flex-col gap-2.5 animate-pulse">
                      <div className="w-full h-4 bg-slate-200 rounded" />
                      <div className="w-11/12 h-4 bg-slate-200 rounded" />
                      <div className="w-4/5 h-4 bg-slate-200 rounded" />
                    </div>

                    <div className="w-36 h-12 bg-slate-200 rounded-full animate-pulse" />
                  </div>

                  <div className="w-full border-t border-slate-100 my-4" />

                  {/* Standard Blog Cards Grid Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-slate-100 rounded-[2rem] p-5 bg-white shadow-sm flex flex-col gap-4 animate-pulse"
                      >
                        <div className="w-full h-48 bg-slate-200 rounded-2xl" />
                        <div className="w-1/4 h-4 bg-slate-200 rounded" />
                        <div className="w-5/6 h-5 bg-slate-200 rounded" />
                        <div className="space-y-2">
                          <div className="w-full h-3.5 bg-slate-200 rounded" />
                          <div className="w-2/3 h-3.5 bg-slate-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-24 text-text-heading font-semibold">
                  No blogs found on the server.
                </div>
              ) : (
                <>
                  {/* Featured / Latest Blog Card */}
                  {latestPost && (
                    <Link
                      href={`/blog/${latestPost.slug}`}
                      className="flex flex-col animate-fadeIn group no-underline text-left cursor-pointer"
                    >
                      <div className="relative w-full h-[240px] sm:h-[400px] rounded-3xl overflow-hidden mb-6 shadow-md">
                        <Image
                          src={getImageUrl(latestPost.images)}
                          alt={latestPost.tittle}
                          fill
                          className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                          priority
                        />
                        <span className="absolute top-4 right-4 bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider">
                          Latest Blog
                        </span>
                      </div>

                      {/* Featured Meta Info */}
                      <div className="flex items-center gap-6 text-xs sm:text-sm text-text-muted mb-4 font-semibold">
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5z"
                            />
                          </svg>
                          Blog
                        </span>
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(latestPost.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>

                      {/* Featured Title */}
                      <h2 className="text-2xl sm:text-3.5xl font-extrabold text-text-heading group-hover:text-primary-700 transition-colors leading-tight mb-4">
                        {latestPost.tittle}
                      </h2>

                      {/* Featured Excerpt Box */}
                      {latestPost.meta_discribtion && (
                        <div className="bg-[#FFFDF4] border border-[#F5E2C4]/40 rounded-3xl p-5 md:p-6 mb-6 shadow-sm w-full">
                          <p className="text-text-body text-[0.95rem] leading-relaxed italic">
                            &ldquo;{latestPost.meta_discribtion}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Featured Learn More Button */}
                      <div>
                        <span className="btn-shutter-blue-open font-bold rounded-full px-8 py-3.5 cursor-pointer inline-flex items-center justify-center">
                          Learn More
                        </span>
                      </div>
                    </Link>
                  )}

                  {/* Divider */}
                  <div className="w-full border-t border-slate-100 my-4" />

                  {/* Grid of Other Blog Cards */}
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherPosts.map((post) => (
                      <StaggerItem key={post.id}>
                        <BlogCard
                          title={post.tittle}
                          excerpt={post.meta_discribtion}
                          date={new Date(post.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                          image={getImageUrl(post.images)}
                          href={`/blog/${post.slug}`}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {/* Show More Button */}
                  {currentPage < lastPage && (
                    <div className="text-center mt-6">
                      <button
                        onClick={handleShowMore}
                        disabled={loadingMore}
                        className="btn-shutter-blue-close inline-flex items-center justify-center font-bold rounded-full px-8 py-3 transition duration-300 disabled:opacity-50 gap-2 cursor-pointer"
                      >
                        {loadingMore && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Show More
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>

            {/* Right Column: Sidebar (lg:col-span-4) */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              <div className="space-y-8 lg:sticky lg:top-24">
                {/* 1. Get Free Assignment Quote Instantly Form */}
                <SidebarQuoteForm sourceName="Blog Page" />

                {/* 2. WhatsApp Order Banner */}
                <div className="rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:scale-[1.01] transition-transform duration-300">
                  <Link
                    href="https://wa.me/447575757575"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/whatsapp-order-now.webp"
                      alt="Order on WhatsApp with 10% discount"
                      width={600}
                      height={400}
                      className="object-cover w-full h-auto"
                      priority
                    />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
