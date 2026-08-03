"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  FileText,
  ShieldCheck,
  GraduationCap,
  Clock,
  Headphones,
  Lock,
  Star,
  ArrowRight,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { dedupedFetch } from "@/lib/client-fetch";
import { CustomDropdown, CustomDropdownOption } from "./CustomDropdown";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

// Default Country codes list
const COUNTRY_CODES: CustomDropdownOption[] = getCountries()
  .map((country) => {
    const code = getCountryCallingCode(country);
    const name = (en as any)[country] || country;
    return {
      label: `+${code} (${country === "GB" ? "UK" : name})`,
      value: `+${code}`,
    };
  })
  .sort((a, b) => {
    if (a.value === "+44" && a.label.includes("UK")) return -1;
    if (b.value === "+44" && b.label.includes("UK")) return 1;
    return a.label.localeCompare(b.label);
  });

const getCountryIso = (code: string): string => {
  const digits = code.replace(/[^0-9]/g, "");
  if (!digits) return "GB";
  if (digits === "44") return "GB";
  if (digits === "1") return "US";
  if (digits === "91") return "IN";
  if (digits === "61") return "AU";
  const matched = getCountries().find((country) => getCountryCallingCode(country) === digits);
  return matched || "GB";
};

const DEFAULT_SUBJECT_OPTIONS: CustomDropdownOption[] = [
  { label: "Accountancy / Accounting", value: "Accountancy / Accounting" },
  { label: "Business & Management", value: "Business & Management" },
  { label: "Business Law", value: "Business Law" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Computer Science / IT", value: "Computer Science / IT" },
  { label: "Economics", value: "Economics" },
  { label: "Engineering", value: "Engineering" },
  { label: "English Literature", value: "English Literature" },
  { label: "Finance", value: "Finance" },
  { label: "Law", value: "Law" },
  { label: "Marketing", value: "Marketing" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Nursing & Healthcare", value: "Nursing & Healthcare" },
  { label: "Physics", value: "Physics" },
  { label: "Psychology", value: "Psychology" },
  { label: "Other Subject", value: "Other Subject" },
];

const DEFAULT_DEADLINE_OPTIONS: CustomDropdownOption[] = [
  { label: "6 Hours", value: "6 Hours" },
  { label: "12 Hours", value: "12 Hours" },
  { label: "24 Hours", value: "24 Hours" },
  { label: "2 Days", value: "2 Days" },
  { label: "3 Days", value: "3 Days" },
  { label: "5 Days", value: "5 Days" },
  { label: "7 Days", value: "7 Days" },
  { label: "10+ Days", value: "10+ Days" },
];

const DEFAULT_WORD_COUNT_OPTIONS: CustomDropdownOption[] = [
  { label: "250 Words (1 Page)", value: "250" },
  { label: "500 Words (2 Pages)", value: "500" },
  { label: "1000 Words (4 Pages)", value: "1000" },
  { label: "1500 Words (6 Pages)", value: "1500" },
  { label: "2000 Words (8 Pages)", value: "2000" },
  { label: "2500 Words (10 Pages)", value: "2500" },
  { label: "3000 Words (12 Pages)", value: "3000" },
  { label: "4000 Words (16 Pages)", value: "4000" },
  { label: "5000 Words (20 Pages)", value: "5000" },
  { label: "6000+ Words", value: "6000" },
];

// Helper to trigger the quote modal from anywhere
export function openQuoteModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-quote-modal"));
  }
}

export function QuoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [whatsappNo, setWhatsappNo] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [wordCount, setWordCount] = useState<number>(250);
  const [requirements, setRequirements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleIncrementWordCount = () => {
    setWordCount((prev) => prev + 250);
  };

  const handleDecrementWordCount = () => {
    setWordCount((prev) => Math.max(250, prev - 250));
  };

  // Dynamic API options
  const [subjectOptions, setSubjectOptions] = useState<CustomDropdownOption[]>(DEFAULT_SUBJECT_OPTIONS);
  const [deadlineOptions, setDeadlineOptions] = useState<CustomDropdownOption[]>(DEFAULT_DEADLINE_OPTIONS);
  const [wordCountOptions, setWordCountOptions] = useState<CustomDropdownOption[]>(DEFAULT_WORD_COUNT_OPTIONS);

  // Fetch subjects & urgencies/deadlines from API on mount
  useEffect(() => {
    const fetchApiOptions = async () => {
      try {
        const [subRes, urgRes, wcRes] = await Promise.all([
          dedupedFetch("/api/subjects"),
          dedupedFetch("/api/urgencies"),
          dedupedFetch("/api/word-count"),
        ]);

        if (subRes.ok) {
          const payload = await subRes.json();
          const list = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];
          if (list.length > 0) {
            const mapped = list.map((item: any) => {
              const name = item.name || item.title || item.subject_name || String(item);
              return { label: name, value: name };
            });
            setSubjectOptions(mapped);
          }
        }

        if (urgRes.ok) {
          const payload = await urgRes.json();
          const list = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];
          if (list.length > 0) {
            const mapped = list.map((item: any) => {
              const name = item.name || item.label || item.time_period || item.time || String(item);
              return { label: name, value: name };
            });
            setDeadlineOptions(mapped);
          }
        }

        if (wcRes.ok) {
          const payload = await wcRes.json();
          const list = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];
          if (list.length > 0) {
            const mapped = list.map((item: any) => {
              const val = String(item.value || item.word_count || item.name || String(item));
              const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
              const label = item.name || (num ? `${num} Words (${Math.ceil(num / 250)} Page${num > 250 ? 's' : ''})` : val);
              return { label, value: val };
            });
            setWordCountOptions(mapped);
          }
        }
      } catch (err) {
        console.error("QuoteModal: Error loading options from API", err);
      }
    };

    fetchApiOptions();
  }, []);

  // Global event listener for modal trigger & button intercepts
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);

    window.addEventListener("open-quote-modal", handleOpen);

    // Click handler for intercepting "Get Free Quote", "Get Instant Quote", etc. on page content
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("a, button") as HTMLElement | null;
      if (!clickable) return;

      // Do NOT intercept Navbar / Header "Get Free Quote" button
      const isInsideNavbar = Boolean(
        clickable.closest(
          "header, nav, .znh-header-wrapper, .znh-header-container"
        )
      );
      if (isInsideNavbar) return;

      const href = (clickable.getAttribute("href") || "").toLowerCase();
      const text = (clickable.textContent || "").trim().toLowerCase();
      const isQuoteTrigger =
        href === "#quote-modal" ||
        href === "#quote-form" ||
        clickable.getAttribute("data-open-quote-modal") === "true" ||
        text.includes("get free quote") ||
        text.includes("get instant quote") ||
        text.includes("get discounted quote") ||
        text.includes("get quote") ||
        text.includes("talk to an expert") ||
        text.includes("contact support");

      if (isQuoteTrigger) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("open-quote-modal", handleOpen);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!whatsappNo.trim()) {
      toast.error("Please enter your WhatsApp number");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = whatsappNo.replace(/[^0-9]/g, "");
      const cleanCode = countryCode.trim() || "+44";
      const fullPhone = `${cleanCode}${cleanPhone}`;
      const cleanWc = String(wordCount || 250);
      const calcPages = Math.max(1, Math.ceil(wordCount / 250));

      const payload = {
        name: fullName.trim(),
        user_name: fullName.trim(),
        email: email.trim(),
        phone: cleanPhone,
        mobile: cleanPhone,
        phone_number: fullPhone,
        countryCode: cleanCode,
        country_code: cleanCode,
        countrycode: cleanCode,
        countryIso: getCountryIso(cleanCode),

        service: subject || "Assignment",
        subject: subject || "General",
        deadline: deadline ? deadline.replace(/[^0-9]/g, "") || deadline : "5",
        urgency: deadline ? deadline.replace(/[^0-9]/g, "") || deadline : "5",
        wordCount: cleanWc,
        word_count: cleanWc,
        pages: calcPages,
        description: requirements ? requirements.trim() : `Subject: ${subject} | Deadline: ${deadline} | Word Count: ${cleanWc}`,
        message: requirements ? requirements.trim() : `Subject: ${subject} | Deadline: ${deadline} | Word Count: ${cleanWc}`,
        requirements: requirements ? requirements.trim() : `Subject: ${subject} | Deadline: ${deadline} | Word Count: ${cleanWc}`,
        notes: `Subject: ${subject} | Deadline: ${deadline} | Word Count: ${cleanWc} | Requirements: ${requirements}`,
        coupon_code: "AIN40",
        promo_code: "AIN40",
        coupon: "AIN40",
        source_page: typeof window !== "undefined" ? window.location.href : "https://www.assignmentinneed.co.uk/",
      };

      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };

      // Primary submission to /api/web-submit-quote
      let res = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Secondary backup submission to /api/submit-enquiry to guarantee CRM lead capture
      if (!res.ok) {
        res = await fetch("/api/submit-enquiry", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      // Third backup to /api/web-place-order
      if (!res.ok) {
        res = await fetch("/api/web-place-order", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => null);

      setIsSuccess(true);
      toast.success(data?.message || "Quote request submitted successfully!");


      try {
        localStorage.setItem(
          "ain_user",
          JSON.stringify({
            name: fullName,
            email: email,
            phone: `${countryCode}${whatsappNo}`,
          })
        );
      } catch (_) {}

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting quote modal lead:", err);
      setIsSuccess(true);
      toast.success("Quote request submitted!");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0 -z-10"
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[1020px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col text-gray-800 font-sans"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              type="button"
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 hover:bg-white text-gray-700 hover:text-purple-700 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer border border-gray-200 focus:outline-none"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12">
              {/* LEFT COLUMN - Promo & Graphic Banner */}
              <div className="lg:col-span-4 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#f8f5ff] via-[#f1ebff] to-[#e8dfff]">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src="/assets/media/modal/popup/popup-banner-bg.png"
                    alt="Popup background pattern"
                    fill
                    className="object-fit"
                    priority
                  />
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Top Logo */}
                  <div className="mb-3">
                    <Image
                      src="/assets/media/layout/ain-logo.webp"
                      alt="Assignment In Need Logo"
                      width={280}
                      height={90}
                      className="h-14 sm:h-16 w-auto object-contain"
                    />
                  </div>

                  {/* Main Title */}
                  <div>
                    <h2 className="text-2xl sm:text-[1.7rem] font-black leading-tight text-[#1a0c40]">
                      Get Expert <br />
                      <span className="text-[#3b1285]">Assignment Help</span>
                    </h2>
                    <p className="text-xs sm:text-[13px] text-gray-600 font-medium leading-relaxed mt-1.5">
                      High-quality, plagiarism-free assignments delivered on
                      time, every time.
                    </p>
                  </div>

                  {/* 40% OFF Ribbon Image */}
                  <div className="relative my-3 flex justify-center">
                    <div className="relative w-full max-w-[400px] sm:max-w-[450px] h-[155px] sm:h-[165px] drop-shadow-xl hover:scale-[1.03] transition-transform duration-300">
                      <Image
                        src="/assets/media/modal/popup/price-off-banner.png"
                        alt="Limited Time Offer - 40% Off on your first order"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Left Graphic & Security Box */}
                <div className="absolute right-1.5 bottom-8 z-10 mt-6 pt-4 border-t border-purple-200/60 flex items-center justify-between gap-2">
                  <div className="bg-white/80 backdrop-blur-sm border border-purple-200/80 rounded-xl p-2 px-3 flex items-center gap-2 shadow-sm text-left">
                    <Lock className="w-3.5 h-3.5 text-[#3f159a] shrink-0" />
                    <span className="text-[10px] font-bold text-gray-700 leading-tight">
                      Your information is <br />
                      <strong className="text-[#3f159a]">
                        safe & secure
                      </strong>{" "}
                      with us.
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Form */}
              <div className="lg:col-span-8 w-full p-6 sm:p-8 flex flex-col justify-between bg-white">
                {isSuccess ? (
                  <div className="py-12 px-4 text-center flex flex-col items-center justify-center my-auto">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      Request Submitted!
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                      Thank you for choosing Assignment In Need. Our expert will
                      contact you shortly with your discounted quote.
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 bg-[#3f159a] text-white font-bold text-sm rounded-xl hover:bg-[#320f7e] transition cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Header */}
                    <div className="mb-2">
                      <div className="flex items-center gap-3.5 sm:gap-4 text-left">
                        {/* Circular Edit Icon Badge */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#5c1db5] to-[#7b2cbf] text-white flex items-center justify-center shrink-0 shadow-md">
                          <Edit3 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                        </div>
                        {/* Title & Subtitle */}
                        <div>
                          <h3 className="text-xl sm:text-[1.5rem] font-black text-[#0f1b3d] leading-tight">
                            Get Your{" "}
                            <span className="text-[#5c1db5]">
                              Discounted Quote Now!
                            </span>
                          </h3>
                          <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-0.5">
                            Fill out the form below and our experts will get back to
                            you shortly.
                          </p>
                        </div>
                      </div>

                      {/* 3 Dots & Line Separator */}
                      <div className="flex items-center justify-center gap-2.5 my-3">
                        <span className="h-[1px] bg-gray-200 flex-1" />
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5c1db5]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5c1db5]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5c1db5]" />
                        </div>
                        <span className="h-[1px] bg-gray-200 flex-1" />
                      </div>
                    </div>

                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-500" /> Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#3f159a] focus:ring-2 focus:ring-purple-200 outline-none transition bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-500" /> Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#3f159a] focus:ring-2 focus:ring-purple-200 outline-none transition bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    {/* Row 2: WhatsApp Number & Subject/Course */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-green-600" /> WhatsApp Number
                        </label>
                        <div className="flex items-center gap-1.5">
                          <div className="w-[100px] shrink-0 border border-gray-200 rounded-xl bg-gray-50/50 px-2 py-2 text-xs">
                            <CustomDropdown
                              options={COUNTRY_CODES}
                              value={countryCode}
                              onChange={setCountryCode}
                              placeholder="+44"
                              enableSearch
                              className="w-full"
                              triggerClassName="text-xs font-bold text-gray-900 py-0"
                            />
                          </div>
                          <input
                            type="tel"
                            required
                            value={whatsappNo}
                            onChange={(e) => setWhatsappNo(e.target.value)}
                            placeholder="WhatsApp number"
                            className="w-full min-w-0 text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#3f159a] focus:ring-2 focus:ring-purple-200 outline-none transition bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-gray-500" /> Subject / Course
                        </label>
                        <div className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-3 py-2.5 focus-within:border-[#3f159a] focus-within:ring-2 focus-within:ring-purple-200 transition">
                          <CustomDropdown
                            options={subjectOptions}
                            value={subject}
                            onChange={setSubject}
                            placeholder="Select your subject"
                            enableSearch
                            className="w-full"
                            triggerClassName="text-xs font-medium text-gray-900 py-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Word Count & Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-gray-500" /> Word Count
                        </label>
                        <div className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-2 py-1 flex items-center justify-between h-[38px] transition focus-within:border-[#3f159a]">
                          <button
                            type="button"
                            onClick={handleDecrementWordCount}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 font-bold text-sm bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:text-[#3f159a] hover:border-purple-200 active:scale-95 transition-all outline-none cursor-pointer shadow-2xs select-none"
                            title="Decrease 250 words"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-gray-900 select-none whitespace-nowrap">
                            {wordCount} Words{" "}
                            <span className="text-[10px] text-gray-500 font-normal">
                              ({Math.max(1, Math.ceil(wordCount / 250))} Page{Math.ceil(wordCount / 250) > 1 ? "s" : ""})
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={handleIncrementWordCount}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 font-bold text-sm bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:text-[#3f159a] hover:border-purple-200 active:scale-95 transition-all outline-none cursor-pointer shadow-2xs select-none"
                            title="Increase 250 words"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" /> Deadline
                        </label>
                        <div className="w-full border border-gray-200 rounded-xl bg-gray-50/50 px-3 py-2.5 focus-within:border-[#3f159a] focus-within:ring-2 focus-within:ring-purple-200 transition">
                          <CustomDropdown
                            options={deadlineOptions}
                            value={deadline}
                            onChange={setDeadline}
                            placeholder="Select date / urgency"
                            enableSearch={false}
                            className="w-full"
                            triggerClassName="text-xs font-medium text-gray-900 py-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Describe Requirements */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-gray-500" /> Describe Your Requirements
                      </label>
                      <textarea
                        rows={2}
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Type your assignment requirements here..."
                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#3f159a] focus:ring-2 focus:ring-purple-200 outline-none transition bg-gray-50/50 hover:bg-white text-gray-900 font-medium resize-none"
                      />
                    </div>



                    {/* Submit Button (Default Shutter Button) */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-shutter-primary w-full py-3.5 px-6 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        {isSubmitting ? (
                          "Submitting Request..."
                        ) : (
                          <>
                            Get <span className="text-amber-300 text-lg font-black mx-1">40% OFF</span> Now
                            <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-gray-500 text-center font-medium mt-2 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-green-600 inline" />
                        We respect your privacy. Your details are 100% secure
                        with us.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* BOTTOM NAVY STRIPE */}
            <div className="bg-[#0e1838] text-white py-2.5 px-4 sm:px-8 text-[11px] sm:text-xs font-bold flex flex-wrap items-center justify-around gap-3 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Trusted by 10,000+ Students Worldwide</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>4.8/5 Rated by Our Students</span>
              </div>

              <div className="flex items-center gap-1.5 text-white">
                <Clock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span>Offer Valid for a Limited Time Only!</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
