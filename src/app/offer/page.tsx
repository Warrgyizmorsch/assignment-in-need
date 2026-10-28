"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Flame,
  Search,
  MessageCircle,
  FileText,
  Briefcase,
  HeartPulse,
  Scale,
  Cpu,
  TrendingUp,
  Brain,
  BookOpen,
  PieChart,
  History,
  Calculator,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { openQuoteModal } from "@/components/ui/QuoteModal";
import { canonicalSubjectPath } from "@/lib/utils";
import { motion } from "framer-motion";
import "./offers.css";

// Comprehensive subject catalog with rich categorization & icons
interface SubjectItem {
  name: string;
  slug: string;
  category: "all" | "business" | "law" | "nursing" | "tech" | "humanities";
  icon: React.ReactNode;
  iconBg: string;
  experts: string;
}

const ALL_SUBJECTS: SubjectItem[] = [
  {
    name: "Nursing & Healthcare",
    slug: "nursing",
    category: "nursing",
    icon: <HeartPulse className="w-5 h-5 text-teal-600" />,
    iconBg: "bg-teal-50",
    experts: "180+ NHS & UK Specialists",
  },
  {
    name: "Business Management",
    slug: "business",
    category: "business",
    icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
    iconBg: "bg-indigo-50",
    experts: "320+ MBA & Strategy Experts",
  },
  {
    name: "Law & Legal Studies",
    slug: "law",
    category: "law",
    icon: <Scale className="w-5 h-5 text-blue-600" />,
    iconBg: "bg-blue-50",
    experts: "240+ UK Legal Scholars",
  },
  {
    name: "Computer Science & IT",
    slug: "programming",
    category: "tech",
    icon: <Cpu className="w-5 h-5 text-purple-600" />,
    iconBg: "bg-purple-50",
    experts: "190+ Code & AI Specialists",
  },
  {
    name: "Accounting & Finance",
    slug: "accounting",
    category: "business",
    icon: <Calculator className="w-5 h-5 text-emerald-600" />,
    iconBg: "bg-emerald-50",
    experts: "150+ ACCA & Finance Tutors",
  },
  {
    name: "Economics",
    slug: "economics",
    category: "business",
    icon: <TrendingUp className="w-5 h-5 text-green-600" />,
    iconBg: "bg-green-50",
    experts: "110+ Econometrics Specialists",
  },
  {
    name: "Marketing & Strategy",
    slug: "marketing",
    category: "business",
    icon: <PieChart className="w-5 h-5 text-pink-600" />,
    iconBg: "bg-pink-50",
    experts: "140+ Digital Marketing Pros",
  },
  {
    name: "Psychology & Behavioral",
    slug: "psychology",
    category: "humanities",
    icon: <Brain className="w-5 h-5 text-rose-600" />,
    iconBg: "bg-rose-50",
    experts: "95+ Clinical Psychology Tutors",
  },
  {
    name: "English Literature",
    slug: "english",
    category: "humanities",
    icon: <BookOpen className="w-5 h-5 text-amber-600" />,
    iconBg: "bg-amber-50",
    experts: "85+ Literary Analysis Editors",
  },
  {
    name: "History & Politics",
    slug: "history",
    category: "humanities",
    icon: <History className="w-5 h-5 text-orange-600" />,
    iconBg: "bg-orange-50",
    experts: "75+ Historiography Researchers",
  },
  {
    name: "Engineering Disciplines",
    slug: "engineering",
    category: "tech",
    icon: <Award className="w-5 h-5 text-sky-600" />,
    iconBg: "bg-sky-50",
    experts: "130+ MEng & MSc Engineers",
  },
  {
    name: "Dissertation & Thesis",
    slug: "dissertation",
    category: "all",
    icon: <GraduationCap className="w-5 h-5 text-purple-700" />,
    iconBg: "bg-purple-100",
    experts: "200+ PhD Lead Supervisors",
  },
];

// Helper to calculate the exact last date of the current active month dynamically
function getLastDateOfCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  // Day 0 of (month + 1) gives the last day of the current month (e.g. 31, 30, 28/29)
  const lastDay = new Date(year, month + 1, 0).getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${lastDay} ${months[month]} ${year}`;
}

export default function OffersPage() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [endDateFormatted, setEndDateFormatted] = useState<string>(getLastDateOfCurrentMonth);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dynamic end-date calculator (ensures last day of current month automatically)
  useEffect(() => {
    setEndDateFormatted(getLastDateOfCurrentMonth());
  }, []);

  // Copy Promo Code Handler
  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon code "${code}" copied to clipboard!`, {
        icon: "🎉",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#120C2E",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
      setTimeout(() => {
        setCopiedCode((prev) => (prev === code ? null : prev));
      }, 2500);
    }
  };

  // Claim Offer CTA Handler (Stores discount & triggers Quote Modal)
  const handleClaimOffer = (code: string, discountVal: string = "40") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ain_won_discount", `${discountVal}% OFF`);
      localStorage.setItem("ain_promo_code", code);
    }
    handleCopyCode(code);
    openQuoteModal();
  };

  // WhatsApp Discount Handler (10% extra)
  const handleWhatsAppOffer = () => {
    const text = encodeURIComponent(
      "Hi Assignment In Need! I want to claim the Extra 10% OFF discount on my assignment order (Code: EXTRA10)."
    );
    window.open(`https://wa.me/447826233106?text=${text}`, "_blank", "noopener,noreferrer");
  };

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((sub) => {
      const matchesCategory = selectedCategory === "all" || sub.category === selectedCategory || sub.category === "all";
      const matchesQuery = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const FAQS = [
    {
      q: "How do I apply my 40% discount code?",
      a: "Copy the code AIN40 and paste it during online checkout or when filling the quote form. The 40% discount is automatically deducted from your initial price.",
    },
    {
      q: "How does the Extra 10% WhatsApp offer work?",
      a: "When you contact our academic team directly on WhatsApp (+44 7826 233106), mention code EXTRA10. Our senior student coordinator will instantly deduct an additional 10% from your order quote.",
    },
    {
      q: "Can I use the 40% offer for urgent same-day deadlines?",
      a: "Yes! The 40% discount applies to all deadlines from urgent 6-hour express deliveries to multi-week dissertation submissions with 24/7 UK expert availability.",
    },
    {
      q: "Are Turnitin reports and revisions included with discounted orders?",
      a: "Yes, 100%. Even with our promotional offers, you receive an authentic Turnitin similarity report, 100% human-written content, and unlimited free revisions within your review window.",
    },
  ];

  return (
    <main className="ain-offers-page">
      {/* ---------------- 1. HERO SECTION (MATCHING SCREENSHOT 1) ---------------- */}
      <section className="ain-offers-hero-section">
        <div className="ain-offers-glow-purple" />
        <div className="ain-offers-glow-gold" />

        <div className="ain-offers-hero-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Offer Content */}
            <div className="lg:col-span-7 text-left">
              <div className="ain-offers-limited-badge">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                LIMITED TIME OFFER
              </div>

              <h1 className="ain-offers-hero-title">
                Get <span className="ain-offers-highlight-discount">40% off</span> your first assignment
              </h1>

              <p className="ain-offers-hero-desc">
                Pay less, hand in on time. UK experts for essays, coursework and dissertations, at student-friendly prices.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {/* Common Button Component */}
                <Button
                  variant="orangeOpen"
                  size="lg"
                  onClick={() => handleClaimOffer("AIN40", "40")}
                  className="shadow-lg shadow-orange-500/25 w-full sm:w-auto text-center"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Claim my discount
                </Button>

                <Button
                  variant="blueClose"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById("how-it-works");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto text-center"
                >
                  How it works
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="ain-offers-trust-pills">
                <div className="ain-offers-trust-pill">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>UK-based experts</span>
                </div>
                <div className="ain-offers-trust-pill">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>On-time delivery</span>
                </div>
                <div className="ain-offers-trust-pill">
                  <RotateCcw className="w-4 h-4 text-sky-400" />
                  <span>Free revisions</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Promo Code Card */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
              <div className="ain-offers-promo-box-wrapper">
                <div className="ain-offers-promo-label">
                  <span>YOUR PROMO CODE</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> 40% OFF
                  </span>
                </div>

                {/* Dashed Promo Code Box */}
                <div
                  className="ain-offers-code-ticket group"
                  onClick={() => handleCopyCode("AIN40")}
                  role="button"
                  tabIndex={0}
                  title="Click to copy code"
                  onKeyDown={(e) => e.key === "Enter" && handleCopyCode("AIN40")}
                >
                  <div className="ain-offers-code-text">
                    <span>AIN40</span>
                    {copiedCode === "AIN40" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-md">
                        <Check className="w-3.5 h-3.5" /> COPIED!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-md group-hover:bg-amber-300 transition-colors">
                        <Copy className="w-3.5 h-3.5" /> COPY
                      </span>
                    )}
                  </div>
                  <div className="ain-offers-code-copy-hint">
                    {copiedCode === "AIN40" ? "Code copied to clipboard!" : "Click anywhere to copy code"}
                  </div>
                </div>

                <div className="ain-offers-promo-info">
                  Enter this code at checkout. Valid until <strong>{endDateFormatted}</strong>.
                </div>

                {/* Common Button Component */}
                <Button
                  variant="blueOpen"
                  size="lg"
                  fullWidth={true}
                  icon={true}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("ain_won_discount", "40% OFF");
                      localStorage.setItem("ain_promo_code", "AIN40");
                    }
                    router.push("/order?coupon=AIN40");
                  }}
                  className="rounded-xl py-3.5 font-bold"
                >
                  Order with this code
                </Button>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Confidential
                  </span>
                  <span>•</span>
                  <span>Turnitin Report Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. SECTION: PICK YOUR OFFER (EXACT 2 OFFERS ONLY) ---------------- */}
      <section className="ain-offers-pick-section">
        <div className="ain-offers-section-header">
          <h2 className="ain-offers-section-title">Pick your offer</h2>
          <p className="ain-offers-section-subtitle">
            Every order gets a discount. Choose from our 2 active promotional offers.
          </p>
        </div>

        <div className="ain-offers-cards-grid-two">
          {/* OFFER 1: 40% OFF (Main First Order Offer) */}
          <div className="ain-offers-card-website">
            <div>
              <div className="ain-offers-card-audience text-[#4a17a3]">
                🌟 WEBSITE EXCLUSIVE • FIRST ORDER
              </div>
              <div className="ain-offers-card-percentage text-[#0f172a]">
                40% off
              </div>
              <p className="ain-offers-card-details text-slate-600">
                Get an instant 40% discount across all assignment types, essays, reports, and dissertations.
              </p>

              {/* Promo Code Box */}
              <div className="mb-6 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Promo Code:</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode("AIN40")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-purple-50 hover:bg-purple-100 text-[#4a17a3] rounded-lg border border-purple-200 transition-colors cursor-pointer"
                >
                  AIN40 {copiedCode === "AIN40" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Perks List */}
              <ul className="ain-offers-perks-list">
                <li className="ain-offers-perk-item text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Turnitin originality & AI similarity check</span>
                </li>
                <li className="ain-offers-perk-item text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Matched with verified UK university specialist</span>
                </li>
                <li className="ain-offers-perk-item text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited free revisions within review period</span>
                </li>
              </ul>
            </div>

            {/* Common Button Component */}
            <Button
              variant="blueOpen"
              size="lg"
              fullWidth={true}
              onClick={() => handleClaimOffer("AIN40", "40")}
              className="mt-2 font-bold"
            >
              Get 40% Offer
            </Button>
          </div>

          {/* OFFER 2: EXTRA 10% OFF (WhatsApp Exclusive Offer) */}
          <div className="ain-offers-card-whatsapp">
            <div>
              <div className="ain-offers-card-audience text-[#22c55e] flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 fill-[#22c55e]" />
                WHATSAPP EXCLUSIVE DISCOUNT
              </div>
              <div className="ain-offers-card-percentage text-amber-400">
                Extra 10% off
              </div>
              <p className="ain-offers-card-details text-slate-300">
                Connect directly with our UK academic advisor on WhatsApp to get an immediate extra 10% off your quote!
              </p>

              {/* Promo Code Box */}
              <div className="mb-6 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">WhatsApp Code:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/40">
                  EXTRA10
                </span>
              </div>

              {/* Perks List */}
              <ul className="ain-offers-perks-list">
                <li className="ain-offers-perk-item text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                  <span>Instant personalized quote within 2 minutes</span>
                </li>
                <li className="ain-offers-perk-item text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                  <span>Direct 1-on-1 requirements discussion</span>
                </li>
                <li className="ain-offers-perk-item text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                  <span>Express writer assignment for rush deadlines</span>
                </li>
              </ul>
            </div>

            {/* Common Button Component */}
            <Button
              variant="orangeOpen"
              size="lg"
              fullWidth={true}
              onClick={handleWhatsAppOffer}
              className="mt-2 font-bold bg-[#22c55e] hover:bg-[#16a34a] border-none text-white shadow-lg shadow-green-600/30"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Claim Extra 10% on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- 3. SECTION: CLAIM IT IN 3 STEPS (MATCHING SCREENSHOT 3) ---------------- */}
      <section id="how-it-works" className="ain-offers-steps-section">
        <div className="ain-offers-section-header">
          <h2 className="ain-offers-section-title">Claim it in 3 steps</h2>
          <p className="ain-offers-section-subtitle">
            Simple, transparent, and completely hassle-free savings for every student.
          </p>
        </div>

        <div className="ain-offers-steps-grid">
          {/* Step 1 */}
          <div className="ain-offers-step-item">
            <div className="ain-offers-step-badge">1</div>
            <h3 className="ain-offers-step-title">Send your brief</h3>
            <p className="ain-offers-step-text">
              Tell us the topic, word count and deadline. Upload any instructions, marking criteria, or rubrics.
            </p>
          </div>

          {/* Step 2 */}
          <div className="ain-offers-step-item">
            <div className="ain-offers-step-badge">2</div>
            <h3 className="ain-offers-step-title">Add your promo code</h3>
            <p className="ain-offers-step-text">
              Your discount shows in the price straight away. Enter code <strong>AIN40</strong> at checkout with zero hidden fees.
            </p>
          </div>

          {/* Step 3 */}
          <div className="ain-offers-step-item">
            <div className="ain-offers-step-badge">3</div>
            <h3 className="ain-offers-step-title">Get your work on time</h3>
            <p className="ain-offers-step-text">
              Your expert writes it. You review it and ask for changes if needed with unlimited free revisions.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 4. SECTION: ELEVATED SUBJECTS SHOWCASE ---------------- */}
      <section className="ain-offers-subjects-section">
        <div className="ain-offers-section-header">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="ain-offers-section-title">Offers apply to all subjects</h2>
              <p className="ain-offers-section-subtitle">
                Over 150+ academic disciplines covered with guaranteed subject specialists.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your subject..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4a17a3] focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="ain-offers-subject-tabs">
          {[
            { id: "all", label: "All Subjects" },
            { id: "business", label: "Business & Management" },
            { id: "law", label: "Law & Legal" },
            { id: "nursing", label: "Nursing & Healthcare" },
            { id: "tech", label: "Science & Engineering" },
            { id: "humanities", label: "Humanities & Arts" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`ain-offers-tab-btn ${selectedCategory === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Enhanced Subject Cards Grid */}
        <div className="ain-offers-subject-cards-grid">
          {filteredSubjects.map((sub) => (
            <Link
              key={sub.slug}
              href={canonicalSubjectPath(sub.slug)}
              className="ain-offers-subject-card group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`ain-offers-subject-icon-box ${sub.iconBg}`}>
                  {sub.icon}
                </div>
                <div className="ain-offers-subject-info truncate">
                  <h3 className="ain-offers-subject-name truncate">{sub.name}</h3>
                  <div className="ain-offers-subject-tag truncate">{sub.experts}</div>
                </div>
              </div>
              <div className="ain-offers-subject-discount-pill shrink-0">
                40% OFF
              </div>
            </Link>
          ))}
        </div>

        {/* ---------------- 5. CTA BANNER (MATCHING SCREENSHOT 4 BOTTOM) ---------------- */}
        <div className="ain-offers-cta-banner-wrapper">
          <div className="ain-offers-cta-banner">
            <div>
              <h3 className="ain-offers-cta-banner-title">
                Deadline close? Order today.
              </h3>
              <p className="ain-offers-cta-banner-sub">
                Offer ends {endDateFormatted}. Support is open 24/7.
              </p>
            </div>

            {/* Common Button Component */}
            <Button
              variant="blueOpen"
              size="lg"
              onClick={() => handleClaimOffer("AIN40", "40")}
              className="bg-[#120C2E] hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold border-none shadow-xl w-full sm:w-auto text-center shrink-0"
            >
              Order now
            </Button>
          </div>
        </div>

        {/* Terms Note */}
        <div className="ain-offers-terms-note">
          Terms: Valid for new and returning orders. 40% discount applies via code AIN40. Extra 10% discount applies via WhatsApp advisor booking. One coupon per checkout transaction. Free Turnitin report and revisions included with all orders.
        </div>
      </section>

      {/* ---------------- 6. FAQ SECTION ---------------- */}
      <section className="py-4 sm:py-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0f172a] mb-1 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about claiming your discount and promo codes.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm md:text-base hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#4a17a3] shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#4a17a3]" : ""
                      }`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-2 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
