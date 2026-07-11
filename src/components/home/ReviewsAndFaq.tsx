"use client";

import React, { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/api";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

interface Review {
  id: number | string;
  name: string;
  meta: string;
  text: string;
  image: string;
  rating: number;
}

interface FaqItem {
  question: string;
  answer: string;
}

type ApiRecord = Record<string, unknown>;

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "emily-r",
    name: "Emily R.",
    meta: "University of Leeds",
    text: "Amazing experience! The expert understood my requirements perfectly and delivered on time.",
    image: "/assets/media/layout/testimonial/testimonial1.webp",
    rating: 5,
  },
  {
    id: "daniel-k",
    name: "Daniel K.",
    meta: "University of Manchester",
    text: "High-quality work and excellent communication. Helped me secure a top grade.",
    image: "/assets/media/layout/testimonial/testimonial2.webp",
    rating: 5,
  },
  {
    id: "sophia-l",
    name: "Sophia L.",
    meta: "King's College London",
    text: "Very professional and reliable service. Highly recommended for every student.",
    image: "/assets/media/layout/testimonial/testimonial3.webp",
    rating: 5,
  },
  {
    id: "james-t",
    name: "James T.",
    meta: "University of Birmingham",
    text: "Got my assignment before the deadline and it was beyond my expectations.",
    image: "/assets/media/layout/testimonial/testimonial4.webp",
    rating: 5,
  },
];

const isApiRecord = (value: unknown): value is ApiRecord =>
  value !== null && typeof value === "object";

const asString = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

function mapReview(raw: ApiRecord, index: number): Review {
  const name = asString(raw.name) || asString(raw.student_name) || "Student";
  const rawImage = asString(raw.image);
  const image = rawImage
    ? getImageUrl(rawImage)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3e8ff&color=6b21a8&size=80`;

  return {
    id: asString(raw.id) || `${name}-${index}`,
    name,
    meta:
      asString(raw.meta) ||
      asString(raw.university) ||
      asString(raw.location) ||
      "UK University",
    text:
      asString(raw.description) ||
      asString(raw.review) ||
      asString(raw.text) ||
      asString(raw.message) ||
      asString(raw.content),
    image,
    rating:
      parseFloat(asString(raw.customer_rating) || asString(raw.rating)) || 5,
  };
}

function Stars({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span className="text-amber-400 text-[1rem] tracking-widest">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}

interface ReviewDetail {
  id: number | string;
  name: string;
  meta: string;
  text: string;
  image: string;
  rating: number;
  service?: string | null;
  deadline?: string | null;
  submission_date?: string | null;
  review_reply?: string | null;
}

function ReviewDetailModal({
  id,
  onClose,
}: {
  id: number | string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<ReviewDetail | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        const raw = json?.data ?? json;
        
        const mappedBase = mapReview(raw, 0);
        setDetail({
          ...mappedBase,
          service: raw.services_type || raw.service_type || raw.service || null,
          deadline: raw.deadline || null,
          submission_date: raw.submission_date || null,
          review_reply: raw.review_reply || null,
        });
      } catch {
        setDetail(null);
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-5 animate-[fadeSlideUp_0.25s_ease] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition border-none cursor-pointer"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {fetching ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded w-32" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          </div>
        ) : !detail ? (
          <div className="text-center py-6 text-gray-500 text-sm">Could not load review details.</div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <img
                src={detail.image}
                alt={detail.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-100 bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.name)}&background=f3e8ff&color=6b21a8&size=80`;
                }}
              />
              <div className="flex flex-col gap-0.5">
                <strong className="text-gray-900 text-[0.95rem] leading-snug">{detail.name}</strong>
                <span className="text-[0.78rem] text-gray-500">{detail.meta}</span>
              </div>
            </div>

            <Stars rating={detail.rating} />

            <div className="flex flex-wrap gap-2">
              {detail.service && (
                <span className="bg-purple-50 text-purple-700 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full">
                  📋 {detail.service}
                </span>
              )}
              {detail.deadline && (
                <span className="bg-amber-50 text-amber-700 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full">
                  ⏱ {detail.deadline}
                </span>
              )}
              {detail.submission_date && (
                <span className="bg-gray-100 text-gray-600 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full">
                  📅 {new Date(detail.submission_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            <p className="text-[0.88rem] text-gray-700 leading-relaxed border-t border-gray-100 pt-4 m-0">
              {detail.text}
            </p>

            {detail.review_reply && (
              <div className="bg-purple-50 border-l-4 border-[#6d28d9] rounded-r-xl px-4 py-3 flex flex-col gap-1">
                <span className="text-[0.7rem] font-bold text-[#6d28d9] uppercase tracking-wide">Reply from Assignment In Need</span>
                <p className="text-[0.82rem] text-gray-700 m-0 leading-relaxed">{detail.review_reply}</p>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

export default function ReviewsAndFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [faqsList, setFaqsList] = useState<FaqItem[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<string | number | null>(null);

  const fallbackFaqs: FaqItem[] = [
    {
      question: "Is assignment help legal in the UK?",
      answer:
        "Yes, seeking assignment help is completely legal. Our services are designed to provide research assistance, model papers, and academic guidance to help you understand your topic better and improve your own writing.",
    },
    {
      question: "How fast can you deliver my order?",
      answer:
        "We offer flexible delivery options ranging from standard delivery (few days) to urgent delivery within 24 hours or even less, depending on the complexity of the task.",
    },
    {
      question: "Will my assignment be plagiarism-free?",
      answer:
        "Absolutely. Every paper is written from scratch by our experts. We also provide a free plagiarism report with your completed order to guarantee its originality.",
    },
    {
      question: "Can I communicate with my expert?",
      answer:
        "Yes, you can easily communicate with your assigned expert through our secure messaging portal to track progress, provide additional materials, or ask questions.",
    },
    {
      question: "Do you offer unlimited revisions?",
      answer:
        "Yes, we offer unlimited free revisions within a specified timeframe to ensure you are 100% satisfied with the final work delivered.",
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("Failed to load homepage reviews");

        const json = await response.json();
        const raw = json?.data?.data ?? json?.data ?? json?.reviews ?? [];
        if (Array.isArray(raw) && raw.length > 0) {
          setReviews(raw.filter(isApiRecord).slice(0, 4).map(mapReview));
        }
      } catch (err) {
        console.error("Error fetching homepage reviews:", err);
      }
    };

    const fetchFaqs = async () => {
      try {
        const response = await fetch("/api/faqs");
        if (response.ok) {
          const json = await response.json();
          const raw = json?.data ?? json?.faqs ?? [];
          if (Array.isArray(raw) && raw.length > 0) {
            const mapped = raw.map((item: any) => ({
              question: item.question || item.title || "FAQ Question",
              answer: item.answer || item.content || "FAQ Answer"
            }));
            setFaqsList(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic FAQs:", err);
      }
    };

    fetchReviews();
    fetchFaqs();
  }, []);

  const faqsToRender = faqsList.length > 0 ? faqsList : fallbackFaqs;

  return (
    <section className="py-12 px-8 max-md:py-8 max-md:px-4 bg-[#fafaff] font-sans flex justify-center border-t border-gray-100">
      <div className="max-w-[1200px] w-full grid grid-cols-[1.3fr_0.9fr] max-lg:grid-cols-1 gap-12">
        {/* Reviews Column */}
        <div className="flex flex-col">
          <AnimateIn variant="fadeUp">
            <h2 className="text-[1.6rem] font-extrabold text-gray-900 mb-6 tracking-tight">
              What Students Say <span className="text-blue-600">About Us</span>
            </h2>
          </AnimateIn>

          <StaggerContainer className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
            {reviews.map((r) => (
              <StaggerItem key={r.id}>
                <div
                  onClick={() => setSelectedReviewId(r.id)}
                  className="bg-white rounded-2xl p-[1.25rem_1rem] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] cursor-pointer h-full"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-gray-200"
                      onError={(event) => {
                        event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=f3e8ff&color=6b21a8&size=80`;
                      }}
                    />
                    <div className="flex flex-col">
                      <strong className="text-[0.85rem] text-gray-900 leading-tight">
                        {r.name}
                      </strong>
                      <span className="text-[0.75rem] text-gray-500">
                        {r.meta}
                      </span>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="text-[0.82rem] text-gray-600 leading-relaxed m-0">
                    {r.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-right mt-6">
            <a
              href="/review"
              className="text-[#6d28d9] hover:text-[#4c1d95] text-[0.85rem] font-bold no-underline hover:underline transition-colors duration-300 max-md:block max-md:w-full max-md:text-center max-md:py-3 max-md:mt-2.5 max-md:bg-white max-md:border max-md:border-gray-200 max-md:rounded-lg max-md:no-underline"
            >
              View More Reviews →
            </a>
          </div>
        </div>

        {/* FAQ Column */}
        <div className="flex flex-col">
          <AnimateIn variant="fadeUp">
            <h2 className="text-[1.6rem] font-extrabold text-gray-900 mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
          </AnimateIn>

          <StaggerContainer className="flex flex-col gap-0 border-t border-gray-100 max-md:gap-3 max-md:border-t-0">
            {faqsToRender.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <StaggerItem key={idx}>
                  <div
                    className={`border-b border-gray-100 max-md:bg-white max-md:rounded-xl max-md:border-none max-md:shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-md:px-4`}
                  >
                    <button
                      className={`w-full text-left bg-transparent border-none py-5 max-md:py-4 flex justify-between items-center cursor-pointer text-[0.95rem] font-semibold transition-colors duration-200 font-[inherit] ${isActive ? "text-indigo-600" : "text-gray-800 hover:text-indigo-600"}`}
                      onClick={() => toggleFaq(idx)}
                    >
                      <span>{faq.question}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`w-[18px] h-[18px] text-[#6d28d9] shrink-0 ml-4 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div
                      className="overflow-hidden"
                      style={{
                        maxHeight: isActive ? "200px" : "0px",
                        transition: "max-height 0.3s ease-out",
                      }}
                    >
                      <p className="pb-5 m-0 text-[0.9rem] text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* <div className="text-left mt-6">
            <a
              href="#"
              className="text-[#6d28d9] hover:text-[#4c1d95] text-[0.85rem] font-bold no-underline hover:underline transition-colors duration-300 max-md:block max-md:w-full max-md:text-center max-md:py-3 max-md:mt-2.5 max-md:bg-white max-md:border max-md:border-gray-200 max-md:rounded-lg max-md:no-underline"
            >
              View All FAQs →
            </a>
          </div> */}
        </div>
      </div>

      {selectedReviewId !== null && (
        <ReviewDetailModal
          id={selectedReviewId}
          onClose={() => setSelectedReviewId(null)}
        />
      )}
    </section>
  );
}
