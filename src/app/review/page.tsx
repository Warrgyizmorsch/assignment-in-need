"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  FileText, 
  Clock, 
  Star, 
  GraduationCap, 
  Zap, 
  User, 
  Calendar,
  Heart,
  ChevronDown
} from 'lucide-react';
import { getBaseUrl, getImageUrl } from '@/lib/api';

interface Review {
  id: number;
  name: string;
  meta: string;
  text: string;
  image: string;
  rating: number;
}

interface ReviewDetail extends Review {
  service?: string;
  deadline?: string;
  submission_date?: string;
  review_reply?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const STATIC_FAQS: FaqItem[] = [
  {
    question: 'How soon will my assignment be completed and delivered?',
    answer: 'We offer flexible delivery options ranging from standard delivery to express delivery within 24 hours. When submitting your order, you select the specific deadline, and we guarantee on-time completion.'
  },
  {
    question: 'Is there any chance my assignment will be shared?',
    answer: 'Absolutely not. We adhere to a strict confidentiality and privacy agreement. Your information and completed assignments are never shared, sold, or published to any third parties.'
  },
  {
    question: 'Will I be able to check my assignment before completing the final payment?',
    answer: 'Yes! We provide preview outlines or draft samples of your completed document so that you can verify the formatting, bibliography, and structure prior to releasing final settlements.'
  },
  {
    question: 'What if my teacher suddenly changes the topic after I place the order?',
    answer: 'If the topic changes, contact our support team immediately. If our writer hasn’t started or is in the early stages, we will adjust it for you. Extra pages or research changes might require nominal fee updates.'
  },
  {
    question: 'Do you offer unlimited free revisions?',
    answer: 'Yes, we offer unlimited free revision requests within 14-30 days of delivery, provided they align with your initial assignment instructions.'
  }
];

function mapReview(raw: any): Review {
  const name = raw.name || raw.student_name || 'Student';
  const image = raw.image
    ? getImageUrl(raw.image)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3e8ff&color=6b21a8&size=80`;

  return {
    id: raw.id,
    name,
    meta: raw.meta || raw.university || raw.location || 'UK University',
    text: raw.description || raw.review || raw.text || raw.message || raw.content || '',
    image,
    rating: parseFloat(raw.customer_rating ?? raw.rating) || 5,
  };
}

function mapReviewDetail(raw: any): ReviewDetail {
  return {
    ...mapReview(raw),
    service: raw.services_type || raw.service_type || raw.service || null,
    deadline: raw.deadline || null,
    submission_date: raw.submission_date || null,
    review_reply: raw.review_reply || null,
  };
}

function Stars({ rating }: { rating: number }) {
  const full = Math.min(5, Math.round(rating));
  return (
    <span className="text-amber-400 text-[1rem] tracking-widest">
      {'★'.repeat(full)}{'☆'.repeat(Math.max(0, 5 - full))}
    </span>
  );
}

/* ── Review Detail Modal ─────────────────────────────────────── */
function ReviewModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [detail, setDetail] = useState<ReviewDetail | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (!res.ok) throw new Error('Not found');
        const json = await res.json();
        const raw = json?.data ?? json;
        setDetail(mapReviewDetail(raw));
      } catch {
        setDetail(null);
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col gap-5 animate-[fadeSlideUp_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
              <div className="h-3 bg-gray-100 rounded w-4/5" />
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

/* ── Main Page ───────────────────────────────────────────────── */
export default function ReviewsAndFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expert, setExpert] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    deadline: "3 Days",
    service: "Assignment Help",
    subject: "",
    pages: "1 Page / 250 Words",
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        const raw: any[] = json?.data?.data ?? json?.data ?? json?.reviews ?? [];
        setReviews(raw.map(mapReview));
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Fetch dynamic expert profile (takes first one returned by backend)
  useEffect(() => {
    const fetchFirstExpert = async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/experts`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setExpert(json.data[0]);
          }
        }
      } catch (err) {
        console.error("Error loading top expert:", err);
      }
    };
    fetchFirstExpert();
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      window.open(`https://wa.me/447466847847?text=Hi, I want a quote for my ${quoteForm.subject || "assignment"}. Service: ${quoteForm.service}, Deadline: ${quoteForm.deadline}`, "_blank");
    }, 1000);
  };

  const skeletons = Array.from({ length: 4 });

  return (
    <div className="bg-[#fdfcff] w-full min-h-screen">
      {/* Detail modal */}
      {selectedId !== null && (
        <ReviewModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}

      {/* 1. Replicated Header Banner (Same as Experts page styling) */}
      <section className="znw-hero-section text-left">
        <div className="znw-hero-top">
          <div className="znw-hero-content">
            <div className="znw-hero-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              Student Reviews
            </div>
            <h1 className="znw-hero-title">
              <span className="znw-desktop-nowrap">
                Student Reviews for
                <br className="znw-br-mobile" />
                <span className="znw-text-purple">Assignment in need</span>
              </span>
              <br />
              <span className="znw-text-gradient font-black">Rated & Trusted by Learners</span>
            </h1>
            <p className="znw-hero-desc">
              See what real students say about our assignment help services. Honest feedback, proven results, and support you can count on when it matters most.
            </p>

            {/* Banner Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                "AI Free Content",
                "24/7 Live Support",
                "Plagiarism Free"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#6d28d9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="znw-hero-image-wrapper hidden lg:flex">
            <img 
              src="https://assignmentinneed.co.uk/public/new-home-page-images/Writer-Hero-bg.webp" 
              alt="Academic Writers Illustration" 
            />
          </div>
        </div>
      </section>

      {/* 2. Rated & Trusted Strip */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Google Review */}
          <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-4 flex items-center justify-between hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-gray-900 text-sm">Google Review</span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="w-5 h-5 rounded-md bg-[#4285F4] text-white flex items-center justify-center text-xs font-bold font-sans">★</span>
                  ))}
                  <span className="w-5 h-5 rounded-md bg-gray-200 text-white flex items-center justify-center text-xs font-bold font-sans">★</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#4285F4]">4.4/5</span>
            </div>
          </div>

          {/* Card 2: AIN Review */}
          <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-4 flex items-center justify-between hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                <span className="text-xs font-black text-purple-700">AIN</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-gray-900 text-sm">AIN Review</span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="w-5 h-5 rounded-md bg-[#6d28d9] text-white flex items-center justify-center text-xs font-bold font-sans">★</span>
                  ))}
                  <span className="w-5 h-5 rounded-md bg-gray-200 text-white flex items-center justify-center text-xs font-bold font-sans">★</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#6d28d9]">4.6/5</span>
            </div>
          </div>

          {/* Card 3: Trustpilot Review */}
          <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-4 flex items-center justify-between hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 text-[#00b67a] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-gray-900 text-sm">Trustpilot</span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="w-5 h-5 rounded-md bg-[#00b67a] text-white flex items-center justify-center text-xs font-bold font-sans">★</span>
                  ))}
                  <span className="w-5 h-5 rounded-md bg-gray-200 text-white flex items-center justify-center text-xs font-bold font-sans">★</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#00b67a]">4.2/5</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Detailed Ratings Section */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Our Detailed Ratings</h2>
          <p className="text-sm text-gray-500 mb-8">The quality of our service is reflected in the satisfaction of our students.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: "Written Excellence", value: "9.8/10", icon: "✍️" },
              { label: "Brand Reliability", value: "4.9/5", icon: "🤝" },
              { label: "Product Satisfaction", value: "99.2%", icon: "😊" },
              { label: "Value for Money", value: "4.8/5", icon: "💰" },
              { label: "Service Experience", value: "4.9/5", icon: "⭐" },
              { label: "Global Verification", value: "Verified", icon: "🌐" },
              { label: "Students Served", value: "10,000+", icon: "👥" }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-lg font-black text-purple-700">{item.value}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide text-center mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Converted Laravel ts-section Grid (Blobs, profile & reviews) */}
      <section className="ts-section">
        {/* Animated background shapes */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>

        <div className="ts-wrap">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight text-left">
            Trusted by 10,000+ Students Worldwide
          </h2>

          <div className="ts-grid">
            {/* LEFT / PROFILE */}
            {expert && (
              <div className="ts-card ts-profile text-left flex flex-col justify-between">
                <div>
                  <div className="ts-profileHead">
                    <div className="ts-avatarRing">
                      <Link href={`/writers/${expert.slug}`}>
                        <img
                          className="ts-avatar"
                          src={expert.image ? getImageUrl(expert.image) : "https://assignmentinneed.co.uk/assets/media/avatars/blank.png"}
                          alt={expert.name}
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    <div className="ts-profileMeta">
                      <div className="ts-nameRow flex items-center gap-1.5">
                        <h3 className="ts-name">{expert.name}</h3>
                        <span className="ts-check text-blue-500" title="Verified">
                          <CheckCircle2 className="w-4 h-4 fill-current inline-block" />
                        </span>
                      </div>
                      <p className="ts-role">Academic Research Specialist</p>
                      <span className="ts-verified">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                        Verified Expert
                      </span>
                    </div>
                  </div>

                  <p 
                    className="ts-bio"
                    dangerouslySetInnerHTML={{ 
                      __html: expert.content 
                        ? expert.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                        : "Expert academic writer dedicated to quality work." 
                    }} 
                  />
                </div>

                <div>
                  <div className="ts-stats">
                    <div className="ts-stat">
                      <div className="ts-statIcon">
                        <FileText className="w-4.5 h-4.5 mx-auto" />
                      </div>
                      <div className="ts-statNum">{expert.finish_order || 120}</div>
                      <div className="ts-statLbl">Completed</div>
                    </div>

                    <div className="ts-stat">
                      <div className="ts-statIcon">
                        <Clock className="w-4.5 h-4.5 mx-auto" />
                      </div>
                      <div className="ts-statNum">{expert.inprogress_order || 3}</div>
                      <div className="ts-statLbl">In Progress</div>
                    </div>

                    <div className="ts-stat">
                      <div className="ts-statIcon text-amber-500">
                        <Star className="w-4.5 h-4.5 mx-auto fill-current" />
                      </div>
                      <div className="ts-statNum">4.9</div>
                      <div className="ts-statLbl">Rating</div>
                    </div>
                  </div>

                  <div className="ts-badge">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    {expert.finish_order || 120}+ Students Served
                  </div>

                  <div className="ts-actions">
                    <Link href="/order" className="ts-btn ts-btnPrimary">
                      Hire Writer
                    </Link>
                    <Link href={`/writers/${expert.slug}`} className="ts-btn ts-btnOutline">
                      About Writer
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT / TOP ROW reviews */}
            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Dissertation Help</h4>
                <p className="ts-subject">Law : 20 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                I ordered my law dissertation from Assignment In Need and the result shocked me
                in a good way. The research, references, everything was on point. Scored high
                marks. Thank you so much!
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Leana</strong>
                    <span>Manchester</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> November 28, 2025</div>
              </div>
            </div>

            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Assignment Help</h4>
                <p className="ts-subject">Programming : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                Absolutely amazing service by Assignment In Need. I had only 18 hours left and
                they still delivered my work perfectly. Very kind team and super fast replies.
                Highly recommended.
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>John Sanz</strong>
                    <span>London</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> November 23, 2025</div>
              </div>
            </div>

            {/* LEFT / BELOW PROFILE */}
            <div className="ts-card ts-review ts-leftColCard">
              <div className="ts-head">
                <h4 className="ts-h4">Assignment Help</h4>
                <p className="ts-subject">Finance : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                I ordered my law dissertation from Assignment In Need and the result shocked me
                in a good way. The research, references, everything was on point. Scored high
                marks. Thank you so much!
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Fandrick</strong>
                    <span>London</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> November 20, 2025</div>
              </div>
            </div>

            {/* RIGHT / ROW 2 */}
            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Essay Help</h4>
                <p className="ts-subject">Sociology : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                Good quality work and very friendly service. The essay was simple, clear, and
                exactly what my professor wanted. Thank you Assignment In Need for helping me
                on short time.
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Fandrick</strong>
                    <span>Birmingham</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> December 26, 2025</div>
              </div>
            </div>

            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Case Study Help</h4>
                <p className="ts-subject">Nursing : 20 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                First time trying them and honestly I’m impressed. My nursing case study was
                done exactly as needed. They even fixed some mistakes without extra charge.
                Good and helpful team.
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Andrew</strong>
                    <span>Leeds</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> November 2, 2025</div>
              </div>
            </div>

            {/* LEFT / BOTTOM */}
            <div className="ts-card ts-review ts-leftColCard">
              <div className="ts-head">
                <h4 className="ts-h4">Essay Help</h4>
                <p className="ts-subject">English Literature : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                I ordered my law dissertation from Assignment In Need and the result shocked me
                in a good way. The research, references, everything was on point. Scored high
                marks. Thank you so much!
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Patrick</strong>
                    <span>Birmingham</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> November 25, 2025</div>
              </div>
            </div>

            {/* RIGHT / ROW 3 */}
            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Report Help</h4>
                <p className="ts-subject">Marketing : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                The report was very well written, very professional. They covered all sections
                clearly and delivered before the deadline. Good communication and very supportive team.
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Kenny</strong>
                    <span>Leeds</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> October 1, 2025</div>
              </div>
            </div>

            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Research Paper Help</h4>
                <p className="ts-subject">Economics : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                I ordered my law dissertation from Assignment In Need and the result shocked me
                in a good way. The research, references, everything was on point. Scored high marks.
                Thank you so much!
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Lily</strong>
                    <span>London</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> September 26, 2025</div>
              </div>
            </div>

            {/* RIGHT / ROW 4 */}
            <div className="ts-card ts-review">
              <div className="ts-head">
                <h4 className="ts-h4">Project Help</h4>
                <p className="ts-subject">Engineering : 10 pages, Deadline: 1.5 days</p>

                <div className="ts-ratingRow">
                  <div className="ts-stars text-amber-400 flex gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="ts-ratingPill">
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-current" /> 5.0 ratings
                  </span>
                </div>
              </div>
              <p className="ts-text line-clamp-4">
                I ordered my law dissertation from Assignment In Need and the result shocked me
                in a good way. The research, references, everything was on point. Scored high marks.
                Thank you so much!
              </p>
              <div className="ts-footer">
                <div className="ts-user">
                  <span className="ts-userIcon"><User className="w-4 h-4" /></span>
                  <div className="ts-userMeta">
                    <strong>Leigh</strong>
                    <span>London</span>
                  </div>
                </div>
                <div className="ts-date"><Calendar className="w-3.5 h-3.5" /> January 16, 2025</div>
              </div>
            </div>

            {/* CTA */}
            <div className="ts-card ts-cta">
              <h3 className="ts-ctaTitle">Original. Confidential.<br />On-time.</h3>
              <p className="ts-ctaText">Professional assignment help you can trust.</p>
              <Link href="/order" className="ts-ctaBtn">
                <Zap className="w-4.5 h-4.5 shrink-0" /> Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Subject Coverage Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Best Assignment Help UK Covering 200+ Academic Subjects</h2>
          <p className="text-sm text-gray-500 mb-8">We Provide Assignment Assistance in the following subjects for Students</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Engineering", icon: "⚙️" },
              { name: "Business", icon: "💼" },
              { name: "Management", icon: "📈" },
              { name: "Accounting", icon: "🧮" },
              { name: "Law", icon: "⚖️" },
              { name: "Nursing", icon: "🩺" },
              { name: "IT & Comp Sci", icon: "💻" },
              { name: "Psychology", icon: "🧠" },
              { name: "Math", icon: "📐" },
              { name: "Finance", icon: "💵" },
              { name: "Marketing", icon: "📢" },
              { name: "Chemistry", icon: "🧪" }
            ].map((sub, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer bg-white group text-left">
                <span className="text-xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                <span className="text-xs font-bold text-gray-700 group-hover:text-purple-700">{sub.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Dynamic database reviews listing section (Full Width) */}
      <section className="py-12 bg-[#fafaff] border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Detailed Database Feedback
            </h2>
            <p className="text-sm text-gray-500">Read the latest verified course entries from our global academic queue.</p>
          </div>

          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[560px] overflow-y-auto pr-2 pb-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#6d28d9 #f3e8ff' }}
          >
            {loading
              ? skeletons.map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded w-24" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 bg-gray-100 rounded w-full" />
                      <div className="h-2.5 bg-gray-100 rounded w-5/6" />
                      <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                ))
              : reviews.slice(0, visibleCount).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3 transition hover:-translate-y-1 hover:shadow-md cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-10 h-10 rounded-full bg-gray-100 object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=f3e8ff&color=6b21a8&size=80`;
                        }}
                      />
                      <div className="flex flex-col">
                        <strong className="text-sm text-gray-900 leading-tight">{r.name}</strong>
                        <span className="text-xs text-gray-500">{r.meta}</span>
                      </div>
                    </div>
                    <Stars rating={r.rating} />
                    <p className="text-xs text-gray-600 leading-relaxed m-0 line-clamp-3">{r.text}</p>
                    <span className="text-[11px] text-[#6d28d9] font-bold mt-auto hover:underline">Read full review &rarr;</span>
                  </div>
                ))}
          </div>

          {!loading && visibleCount < reviews.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setVisibleCount((prev) => prev + 6);
                  setTimeout(() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                    }
                  }, 50);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#6d28d9] text-[#6d28d9] text-[0.85rem] font-bold hover:bg-[#6d28d9] hover:text-white transition"
              >
                Load More Reviews
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. FAQs Section (Bottom Split Columns Layout) */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-12 text-left">
          <div className="lg:w-1/3">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-md font-bold uppercase tracking-wide mb-4">
              FAQ Coverage
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-snug">
              FAQs About Our <br />
              <span className="text-purple-700">Assignment Help</span> Services
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Find answers to the most common questions regarding security, payments, deadline changes, and quality.
            </p>
            <Link href="/faq" className="inline-flex items-center justify-center bg-white border border-gray-200 text-purple-700 font-bold px-6 py-3 rounded-lg hover:bg-purple-50 transition shadow-sm text-sm">
              View All FAQs &rarr;
            </Link>
          </div>

          <div className="lg:w-2/3 w-full space-y-4">
            {STATIC_FAQS.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group"
                >
                  <button
                    className={`w-full text-left bg-transparent border-none py-5 px-5 flex justify-between items-center cursor-pointer text-[0.95rem] font-bold transition-colors duration-200 ${isActive ? 'text-[#6d28d9]' : 'text-gray-800 hover:text-[#6d28d9]'}`}
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-[18px] h-[18px] text-[#6d28d9] shrink-0 ml-4 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className="overflow-hidden"
                    style={{ maxHeight: isActive ? '300px' : '0px', transition: 'max-height 0.3s ease-out' }}
                  >
                    <p className="pb-5 px-5 m-0 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Embedded CSS Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* SECTION BG (same look) */
        .ts-section {
          position: relative;
          overflow: hidden;
          padding: 3rem 2rem 2rem;
          box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px inset;
          background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%);
        }

        .ts-section::before,
        .ts-section::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          opacity: 0.55;
          pointer-events: none;
          transform: translateZ(0);
          animation: blobFloat 8s ease-in-out infinite;
        }
        .ts-section::before {
          width: 420px;
          height: 420px;
          left: -140px;
          top: 40px;
          background: radial-gradient(circle, #c9b7ff 0%, rgba(201, 183, 255, 0) 70%);
        }
        .ts-section::after {
          width: 460px;
          height: 460px;
          right: -160px;
          bottom: -140px;
          background: radial-gradient(circle, #ffb7d2 0%, rgba(255, 183, 210, 0) 70%);
          animation-delay: 1.2s;
        }

        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -14px) scale(1.03); }
        }

        .shape {
          position: absolute;
          border-radius: 999px;
          opacity: 0.35;
          filter: blur(0px);
          pointer-events: none;
          transform: translateZ(0);
          animation: shapeDrift 10s ease-in-out infinite;
        }
        .shape-1 {
          width: 260px; height: 260px;
          left: 1%; top: 2%;
          background: radial-gradient(circle, rgba(47,134,255,0.55), rgba(47,134,255,0));
        }
        .shape-2 {
          width: 220px; height: 220px;
          right: 1%; top: 12%;
          background: radial-gradient(circle, rgba(155,98,255,0.55), rgba(155,98,255,0));
          animation-delay: 1s;
        }
        .shape-3 {
          width: 240px; height: 240px;
          left: 1%; bottom: 22%;
          background: radial-gradient(circle, rgba(255,183,210,0.95), rgba(255,183,210,0));
          animation-delay: 1.8s;
        }
        .shape-4 {
          width: 200px; height: 200px;
          right: 1%; bottom: 28%;
          background: radial-gradient(circle, rgba(201,183,255,1), rgba(201,183,255,0));
          animation-delay: 2.4s;
        }
        @keyframes shapeDrift {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(14px,-18px); }
        }

        .ts-wrap {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .ts-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr;
          gap: 16px;
          align-items: stretch;
        }

        .ts-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 14px;
          padding: 20px 20px;
          box-shadow: 0 10px 24px rgba(32, 38, 57, 0.08);
          border: 1px solid rgba(90, 92, 160, 0.08);
          transform: translateY(0);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .ts-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(32, 38, 57, 0.12);
        }

        .ts-profile {
          grid-row: span 2;
          border: 2px solid #2f86ff;
          box-shadow: 0 0 0 6px rgba(47, 134, 255, 0.08),
            0 14px 30px rgba(47, 134, 255, 0.18);
          background: linear-gradient(180deg, #E2CDFF 0%, #D7F0FF 100%);
        }

        .ts-profileHead {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 10px;
        }

        .ts-avatarRing {
          width: 100px;
          height: 100px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2f86ff, #9b62ff);
          padding: 3px;
          flex: 0 0 auto;
          animation: ringPulse 2.8s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .ts-avatar {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          object-fit: cover;
          background: #fff;
          border: 3px solid #ffffff;
        }

        .ts-nameRow {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ts-name {
          margin: 0;
          font-size: 1.25rem;
          color: #3f3d99;
          font-weight: 700;
        }

        .ts-role {
          margin: 4px 0 5px 0;
          font-size: 13px;
          color: #4b5563;
        }

        .ts-verified {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #2f86ff;
          background: rgba(47, 134, 255, 0.08);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .ts-bio {
          margin: 17px 0;
          font-size: 14px;
          color: #4a4a4a;
          line-height: 1.5;
        }

        .ts-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        .ts-stat {
          text-align: center;
          background: rgba(243, 244, 255, 0.7);
          border: 1px solid rgba(120, 122, 196, 0.12);
          border-radius: 6px;
          padding: 10px 6px;
          transition: transform .2s ease;
        }
        .ts-stat:hover { transform: translateY(-3px); }

        .ts-statIcon {
          font-size: 14px;
          margin-bottom: 6px;
          color: #3f3d99;
        }
        .ts-statNum {
          font-weight: 800;
          color: #2d2d2d;
          font-size: 14px;
          line-height: 1;
        }
        .ts-statLbl {
          font-size: 10px;
          color: #808080;
          margin-top: 4px;
        }

        .ts-badge {
          margin: 10px 0 12px;
          text-align: center;
          font-size: 12px;
          color: #3f3d99;
          background: rgba(220, 220, 255, 0.55);
          border: 1px solid rgba(120, 122, 196, 0.12);
          padding: 8px 10px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .ts-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .ts-btn {
          border-radius: 10px;
          padding: 11px 10px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform .2s ease, box-shadow .2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ts-btn:active { transform: translateY(1px); }

        .ts-btnPrimary {
          background: #3f3d99;
          color: #fff;
          box-shadow: 0 10px 20px rgba(63, 61, 153, 0.18);
        }
        .ts-btnPrimary:hover {
          box-shadow: 0 14px 26px rgba(63, 61, 153, 0.22);
          transform: translateY(-2px);
        }
        .ts-btnOutline {
          background: #ffffff;
          color: #3f3d99;
          border-color: rgba(63, 61, 153, 0.55);
        }
        .ts-btnOutline:hover { transform: translateY(-2px); }

        .ts-review {
          display: flex;
          flex-direction: column;
          min-height: 168px;
        }

        .ts-head { margin-bottom: 8px; }
        .ts-h4 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #303030;
          font-weight: 800;
        }
        .ts-subject {
          margin: 0 0 8px;
          font-size: 11px;
          color: #8a8a8a;
        }

        .ts-ratingPill {
          font-size: 10px;
          color: #6f6f6f;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 3px 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .ts-text {
          margin: 0;
          font-size: 12.5px;
          color: #5a5a5a;
          line-height: 1.6;
          flex: 1;
        }

        .ts-footer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .ts-user {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6f6f6f;
        }
        .ts-userIcon {
          font-size: 14px;
          color: #3f3d99;
        }
        .ts-userMeta strong {
          display: block;
          font-size: 11px;
          color: #404040;
        }
        .ts-userMeta span {
          display: block;
          font-size: 10px;
          color: #8a8a8a;
        }
        .ts-date {
          font-size: 10px;
          color: #9a9a9a;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .ts-cta {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(233, 231, 255, 0.75));
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 18px 16px;
        }

        .ts-ctaTitle {
          margin: 0;
          font-size: 16px;
          color: #3f3d99;
          font-weight: 900;
          line-height: 1.25;
        }
        .ts-ctaText {
          margin: 8px 0 12px;
          font-size: 12px;
          color: #6b6b6b;
        }
        .ts-ctaBtn {
          border: none;
          cursor: pointer;
          border-radius: 12px;
          padding: 10px 18px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(90deg, #5c4cd0, #3498db);
          box-shadow: 0 12px 22px rgba(60, 120, 255, 0.18);
          transition: transform .2s ease, box-shadow .2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ts-ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(60, 120, 255, 0.22);
        }

        @media (max-width: 992px) {
          .ts-grid { grid-template-columns: 1fr 1fr; }
          .ts-profile { grid-row: auto; grid-column: 1 / -1; }
          .ts-leftColCard { grid-column: auto; }
        }

        @media (max-width: 640px) {
          .ts-grid { grid-template-columns: 1fr; }
          .ts-card { padding: 16px 16px; }
        }

        /* Writers Banner Styling */
        .znw-hero-section {
            padding: 2.5rem 1rem 0;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 0;
            position: relative;
        }
        .znw-hero-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
        }
        .znw-hero-content {
            flex: 1;
            max-width: 750px;
        }
        .znw-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #f3efff;
            color: #4b23b3;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }
        .znw-hero-badge svg {
            width: 18px;
            height: 18px;
        }
        .znw-hero-title {
            font-size: 2.4rem;
            font-weight: 800;
            color: #1a1530;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            letter-spacing: -0.5px;
        }
        .znw-br-mobile {
            display: none;
        }
        @media (min-width: 993px) {
            .znw-desktop-nowrap {
                white-space: nowrap;
            }
        }
        .znw-hero-title .znw-text-purple {
            color: #6d28d9;
        }
        .znw-hero-title .znw-text-gradient {
            background: linear-gradient(90deg, #db2777, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .znw-hero-desc {
            font-size: 1.1rem;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .znw-hero-image-wrapper {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            position: relative;
        }
        .znw-hero-image-wrapper img {
            max-width: 100%;
            height: auto;
            position: relative;
            z-index: 1;
            max-height: 420px;
            object-fit: contain;
        }
        @media (max-width: 992px) {
            .znw-hero-top {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }
            .znw-hero-content {
                max-width: 100%;
            }
            .znw-hero-badge {
                margin: 0 auto 1rem;
            }
            .znw-hero-title {
                font-size: 1.8rem;
            }
            .znw-hero-desc {
                font-size: 1rem;
            }
        }
      `}} />
    </div>
  );
}
