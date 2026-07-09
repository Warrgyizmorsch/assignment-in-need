"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { CustomDropdown } from "@/components/ui/CustomDropdown";

const COUNTRY_CODES = [
  { label: "UK (+44)", value: "+44" },
  { label: "US (+1)", value: "+1" },
  { label: "IN (+91)", value: "+91" },
  { label: "AU (+61)", value: "+61" },
  { label: "CA (+1)", value: "+1" },
  { label: "AE (+971)", value: "+971" },
  { label: "SA (+966)", value: "+966" },
  { label: "IE (+353)", value: "+353" },
  { label: "NZ (+64)", value: "+64" },
  { label: "SG (+65)", value: "+65" },
  { label: "MY (+60)", value: "+60" },
];

const DEADLINE_OPTIONS = [
  { label: "6 Hours", value: "6h" },
  { label: "12 Hours", value: "12h" },
  { label: "24 Hours", value: "24h" },
  { label: "2 Days", value: "2d" },
  { label: "3 Days", value: "3d" },
  { label: "5 Days", value: "5d" },
  { label: "7 Days", value: "7d" },
  { label: "10+ Days", value: "10d" },
];

const SERVICE_OPTIONS = [
  { label: "Assignment Writing", value: "assignment" },
  { label: "Essay Writing", value: "essay" },
  { label: "Dissertation Writing", value: "dissertation" },
  { label: "Coursework Writing", value: "coursework" },
  { label: "Case Study Writing", value: "case-study" },
  { label: "Report Writing", value: "report" },
];
import {
  CheckCircle2,
  User,
  Mail,
  Calendar,
  Phone,
  BookOpen,
  PenTool,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { getBaseUrl, getImageUrl } from "@/lib/api";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [service, setService] = useState("");
  const [subject, setSubject] = useState("");
  const [pages, setPages] = useState(1);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!service) newErrors.service = "Service is required";
    if (!deadline) newErrors.deadline = "Deadline is required";
    if (!agree) newErrors.agree = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setDeadline("");
    setPhone("");
    setCountryCode("+44");
    setService("");
    setSubject("");
    setPages(1);
    setAgree(false);
    setErrors({});
    setIsSubmitted(false);
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
                    <div className="flex flex-col animate-fadeIn">
                      <div className="relative w-full h-[240px] sm:h-[400px] rounded-3xl overflow-hidden mb-6 shadow-md group">
                        <img
                          src={getImageUrl(latestPost.images)}
                          alt={latestPost.tittle}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
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
                      <h2 className="text-2xl sm:text-3.5xl font-extrabold text-text-heading hover:text-primary-700 transition-colors leading-tight mb-4">
                        <Link href={`/blog/${latestPost.slug}`}>
                          {latestPost.tittle}
                        </Link>
                      </h2>

                      {/* Featured Excerpt Box */}
                      {latestPost.meta_discribtion && (
                        <div className="bg-[#FFFDF4] border border-[#F5E2C4]/40 rounded-3xl p-5 md:p-6 mb-6 shadow-sm">
                          <p className="text-text-body text-[0.95rem] leading-relaxed italic">
                            &ldquo;{latestPost.meta_discribtion}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Featured Learn More Button */}
                      <div>
                        <Link
                          href={`/blog/${latestPost.slug}`}
                          className="btn-shutter-blue-open font-bold rounded-full px-8 py-3.5 cursor-pointer inline-flex items-center justify-center"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-full border-t border-slate-100 my-4" />

                  {/* Grid of Other Blog Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {otherPosts.map((post) => (
                      <BlogCard
                        key={post.id}
                        title={post.tittle}
                        excerpt={post.meta_discribtion}
                        date={new Date(post.created_at).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                        image={getImageUrl(post.images)}
                        href={`/blog/${post.slug}`}
                      />
                    ))}
                  </div>

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
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 md:p-7">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-primary-700 leading-tight">
                      Get Free Assignment Quote Instantly
                    </h3>
                    <div className="w-12 h-1 bg-gradient-logo rounded-full mx-auto mt-2.5" />
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success mb-2 animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-text-heading">
                        Quote Request Sent!
                      </h4>
                      <p className="text-xs text-text-body max-w-xs leading-relaxed">
                        We have received your requirements. One of our academic
                        writers will contact you shortly with a custom price
                        estimation.
                      </p>
                      <button
                        onClick={handleResetForm}
                        className="btn-shutter-blue-open mt-4 font-semibold text-xs px-5 py-2.5 rounded-full cursor-pointer"
                      >
                        Request Another Quote
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {/* Name */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) =>
                              setName(
                                e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                              )
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
                          />
                        </div>
                        {errors.name && (
                          <span className="text-[10px] text-red-500 mt-1 block">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                              setEmail(
                                e.target.value.replace(
                                  /[^a-zA-Z0-9@._+-]/g,
                                  "",
                                ),
                              )
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
                          />
                        </div>
                        {errors.email && (
                          <span className="text-[10px] text-red-500 mt-1 block">
                            {errors.email}
                          </span>
                        )}
                      </div>

                      {/* Deadline */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Deadline
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-text-heading focus-within:border-primary-500 focus-within:bg-white transition-all h-[38px] flex items-center">
                            <CustomDropdown
                              options={DEADLINE_OPTIONS}
                              value={deadline}
                              onChange={setDeadline}
                              placeholder="Select deadline"
                            />
                          </div>
                        </div>
                        {errors.deadline && (
                          <span className="text-[10px] text-red-500 mt-1 block">
                            {errors.deadline}
                          </span>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Phone number
                        </label>
                        <div className="flex gap-2">
                          <div className="relative shrink-0 w-[95px] bg-slate-50 border border-slate-200 rounded-xl px-2 flex items-center h-[38px]">
                            <CustomDropdown
                              options={COUNTRY_CODES}
                              value={countryCode}
                              onChange={setCountryCode}
                              align="left"
                            />
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="tel"
                              placeholder="Phone number"
                              value={phone}
                              onChange={(e) =>
                                setPhone(e.target.value.replace(/[^0-9]/g, ""))
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                        {errors.phone && (
                          <span className="text-[10px] text-red-500 mt-1 block">
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      {/* Service */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Service
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-text-heading focus-within:border-primary-500 focus-within:bg-white transition-all h-[38px] flex items-center">
                            <CustomDropdown
                              options={SERVICE_OPTIONS}
                              value={service}
                              onChange={setService}
                              placeholder="Select service"
                            />
                          </div>
                        </div>
                        {errors.service && (
                          <span className="text-[10px] text-red-500 mt-1 block">
                            {errors.service}
                          </span>
                        )}
                      </div>

                      {/* Subject */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Subject
                        </label>
                        <div className="relative">
                          <PenTool className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g., IT"
                            value={subject}
                            onChange={(e) =>
                              setSubject(
                                e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""),
                              )
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      {/* Pages Counter */}
                      <div className="relative">
                        <label className="text-[11px] font-bold text-gray-600 mb-1 block">
                          Pages
                        </label>
                        <div className="flex items-center justify-between border border-slate-200 rounded-xl px-2 py-1 bg-slate-50 select-none">
                          <button
                            type="button"
                            onClick={() => pages > 1 && setPages(pages - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-gray-700 hover:bg-slate-100 hover:text-primary-700 active:scale-95 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-text-heading">
                            {pages} Pages{" "}
                            <span className="text-[10px] text-text-muted font-medium">
                              ({pages * 250} words)
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setPages(pages + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-gray-700 hover:bg-slate-100 hover:text-primary-700 active:scale-95 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* T&C Checkbox */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <input
                          id="agree"
                          type="checkbox"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-primary-700 focus:ring-primary-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <label
                          htmlFor="agree"
                          className="text-[10px] text-text-body leading-tight select-none cursor-pointer"
                        >
                          I agree with{" "}
                          <Link
                            href="/privacy-policy"
                            className="text-primary-700 hover:underline"
                          >
                            Privacy Policy
                          </Link>{" "}
                          &{" "}
                          <Link
                            href="/terms"
                            className="text-primary-700 hover:underline"
                          >
                            T&C
                          </Link>
                          .
                        </label>
                      </div>
                      {errors.agree && (
                        <span className="text-[10px] text-red-500 block">
                          {errors.agree}
                        </span>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-shutter-orange-open w-full text-white font-bold rounded-xl py-3 text-xs transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Calculating price...
                          </>
                        ) : (
                          "Chat with experts now"
                        )}
                      </button>
                    </form>
                  )}
                </div>

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
