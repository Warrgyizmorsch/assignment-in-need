"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Lock,
  User,
  HelpCircle,
  FileUp,
  Trash2,
  Headset,
  BookOpen,
  Briefcase,
  Clock,
  Award,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";

import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SUBJECTS } from "@/lib/data";
import { getBaseUrl } from "@/lib/api";
import { AnimateIn } from "@/components/ui/AnimateIn";

const ACADEMIC_LEVELS = [
  { label: "Undergraduate", value: "undergraduate" },
  { label: "Postgraduate", value: "postgraduate" },
  { label: "PhD / Doctoral", value: "phd" },
  { label: "College / High School", value: "college" },
];

const WORK_TYPES = [
  { label: "Writing (from scratch)", value: "writing" },
  { label: "Editing & Proofreading", value: "editing" },
  { label: "Rewriting", value: "rewriting" },
];

const DEADLINES = [
  { label: "12 Hours", value: "12h" },
  { label: "24 Hours", value: "24h" },
  { label: "2 Days", value: "2d" },
  { label: "3 Days", value: "3d" },
  { label: "5 Days", value: "5d" },
  { label: "7 Days", value: "7d" },
  { label: "10 Days", value: "10d" },
  { label: "14+ Days", value: "14d" },
];

const WORD_COUNTS = [
  { label: "250 Words (1 Page)", value: "250" },
  { label: "500 Words (2 Pages)", value: "500" },
  { label: "1000 Words (4 Pages)", value: "1000" },
  { label: "1500 Words (6 Pages)", value: "1500" },
  { label: "2000 Words (8 Pages)", value: "2000" },
  { label: "2500 Words (10 Pages)", value: "2500" },
  { label: "3000 Words (12 Pages)", value: "3000" },
  { label: "4000 Words (16 Pages)", value: "4000" },
  { label: "5000 Words (20 Pages)", value: "5000" },
];

import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

const COUNTRY_CODES = getCountries().map((country) => {
  const code = getCountryCallingCode(country);
  const name = (en as any)[country] || country;
  return {
    label: `${name} (+${code})`,
    value: `+${code}`
  };
}).sort((a, b) => a.label.localeCompare(b.label));

export default function OrderPage() {
  // Step 1: Personal Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Step 2: Assignment Details
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("writing");
  const [academicLevel, setAcademicLevel] = useState("undergraduate");
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);
  const [dynamicSubjects, setDynamicSubjects] = useState<any[]>([]);

  // Dynamic API configurations
  const [apiWordCounts, setApiWordCounts] = useState<any[]>([]);
  const [apiUrgencies, setApiUrgencies] = useState<any[]>([]);
  const [apiCountries, setApiCountries] = useState<any[]>([]);
  const [apiBasePrice, setApiBasePrice] = useState<number>(0.03);
  const [apiDiscountPercent, setApiDiscountPercent] = useState<number>(40);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/admin/service-pages");
        if (res.ok) {
          const result = await res.json();
          if ((result.success || result.status === "success") && Array.isArray(result.data)) {
            setDynamicServices(result.data);
            if (result.data.length > 0) {
              setSelectedService(result.data[0].slug);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching services for order form:", err);
      }
    };

    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/admin/subjects");
        if (res.ok) {
          const payload = await res.json();
          if ((payload.success || payload.status === "success") && Array.isArray(payload.data)) {
            setDynamicSubjects(payload.data);
            if (payload.data.length > 0) {
              const cleanSlug = (payload.data[0].slug || "").replace(/^\/+/, "");
              const finalSlug = cleanSlug.startsWith("subject/") ? cleanSlug.replace("subject/", "") : cleanSlug;
              setSelectedSubject(finalSlug);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching subjects for order form:", err);
      }
    };

    const fetchAppConfigs = async () => {
      try {
        const [wcRes, urgRes, countryRes] = await Promise.all([
          fetch("/api/app/word-count"),
          fetch("/api/app/urgencies"),
          fetch("/api/app/countries")
        ]);

        if (wcRes.ok) {
          const payload = await wcRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiWordCounts(payload.data);
            if (payload.base_price_per_word) {
              setApiBasePrice(Number(payload.base_price_per_word));
            }
            if (payload.discount_percentage) {
              setApiDiscountPercent(Number(payload.discount_percentage));
            }
          }
        }

        if (urgRes.ok) {
          const payload = await urgRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiUrgencies(payload.data);
          }
        }

        if (countryRes.ok) {
          const payload = await countryRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiCountries(payload.data);
          }
        }
      } catch (err) {
        console.error("Error fetching app configurations for order form:", err);
      }
    };

    fetchServices();
    fetchSubjects();
    fetchAppConfigs();
  }, []);

  const subjectOptions = useMemo(() => {
    if (dynamicSubjects.length > 0) {
      return dynamicSubjects.map((sub: any) => {
        const cleanSlug = (sub.slug || "").replace(/^\/+/, "");
        const finalSlug = cleanSlug.startsWith("subject/") ? cleanSlug.replace("subject/", "") : cleanSlug;
        const humanized = finalSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        const label = sub.title || humanized;
        return { label, value: finalSlug };
      });
    }
    return SUBJECTS.map((sub) => ({ label: sub.name, value: sub.slug }));
  }, [dynamicSubjects]);

  const serviceOptions = useMemo(() => {
    const list: { label: string; value: string }[] = [];
    dynamicServices.forEach((s: any) => {
      const pName = s.title || s.hero_heading || s.meta_title || "Service";
      list.push({ label: pName, value: s.slug });
    });
    return list;
  }, [dynamicServices]);

  // Step 3: Delivery Details
  const [selectedDeadline, setSelectedDeadline] = useState("3d");
  const [selectedWordCount, setSelectedWordCount] = useState("250");

  const wordCountOptions = useMemo(() => {
    if (apiWordCounts.length > 0) {
      return apiWordCounts.map((wc: any) => ({
        label: `${wc.name} (${Math.ceil(wc.value / 250)} Page${wc.value > 250 ? 's' : ''})`,
        value: String(wc.value)
      }));
    }
    return WORD_COUNTS;
  }, [apiWordCounts]);

  const deadlineOptions = useMemo(() => {
    if (apiUrgencies.length > 0) {
      return apiUrgencies.map((urg: any) => ({
        label: urg.name,
        value: String(urg.value)
      }));
    }
    return DEADLINES;
  }, [apiUrgencies]);

  useEffect(() => {
    if (apiUrgencies.length > 0 && selectedDeadline === "3d") {
      const match = apiUrgencies.find((u: any) => String(u.value) === "3");
      if (match) {
        setSelectedDeadline(String(match.value));
      } else {
        setSelectedDeadline(String(apiUrgencies[0].value));
      }
    }
  }, [apiUrgencies]);

  // Step 4: Instructions
  const [instructions, setInstructions] = useState("");

  // Step 5: Upload Files (Simulated)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Input Sanitization Handlers (prevent special characters)
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setFullName(val);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, "");
    setEmail(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(val);
  };

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const val = e.target.value.replace(/[<>\/?[\]{}|\\;:'"`~^+=*]/g, "");
    setInstructions(val);
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((file) => file.name);
      setAttachedFiles((prev) => [...prev, ...names]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Live Price Calculation Details
  const subtotal = useMemo(() => {
    const wordCount = parseInt(selectedWordCount, 10) || 250;
    const basePricePerWord = apiBasePrice || 0.03;
    let basePrice = basePricePerWord * wordCount;

    // Find multiplier from API data
    const matchedWc = apiWordCounts.find((wc: any) => Number(wc.value) === wordCount);
    if (matchedWc) {
      basePrice *= Number(matchedWc.multiplier);
    } else {
      // Range-based fallback
      if (wordCount >= 250 && wordCount < 500) {
        basePrice *= 2.67;
      } else if (wordCount >= 500 && wordCount < 1000) {
        basePrice *= 2.22;
      } else if (wordCount >= 1000 && wordCount < 2000) {
        basePrice *= 1.94;
      } else if (wordCount >= 2000 && wordCount < 3000) {
        basePrice *= 1.67;
      } else if (wordCount >= 3000 && wordCount < 4000) {
        basePrice *= 1.30;
      } else if (wordCount >= 4000 && wordCount < 5000) {
        basePrice *= 1.13;
      } else if (wordCount >= 5000) {
        basePrice *= 1.17;
      }
    }

    // Deadline Multipliers
    let deadlineMult = 1.0;
    const matchedUrg = apiUrgencies.find((urg: any) => String(urg.value) === selectedDeadline);
    if (matchedUrg) {
      deadlineMult = Number(matchedUrg.multiplier);
    } else {
      // Fallback mapping for Next.js static deadline slugs
      if (selectedDeadline === "12h") deadlineMult = 2.5;
      else if (selectedDeadline === "24h") deadlineMult = 2.0;
      else if (selectedDeadline === "2d") deadlineMult = 1.5;
      else if (selectedDeadline === "3d") deadlineMult = 1.4;
      else if (selectedDeadline === "5d") deadlineMult = 1.2;
      else if (selectedDeadline === "7d") deadlineMult = 1.1;
      else if (selectedDeadline === "10d") deadlineMult = 1.05;
      else if (selectedDeadline === "14d") deadlineMult = 1.0;
    }

    // Service Multiplier (Dissertation, Thesis, and Research Project get 1.1)
    const serviceSlug = (selectedService || "").toLowerCase();
    const serviceMultiplier =
      serviceSlug.includes("dissertation") ||
      serviceSlug.includes("thesis") ||
      serviceSlug.includes("research")
        ? 1.1
        : 1.0;

    // Academic Level Multipliers
    let levelMult = 1.0;
    if (academicLevel === "postgraduate") levelMult = 1.3;
    else if (academicLevel === "phd") levelMult = 1.6;
    else if (academicLevel === "college") levelMult = 0.85;

    // Work Type Multipliers
    let workTypeMult = 1.0;
    if (selectedWorkType === "editing") workTypeMult = 0.5;
    else if (selectedWorkType === "rewriting") workTypeMult = 0.8;

    return Number(
      (
        basePrice *
        deadlineMult *
        serviceMultiplier *
        levelMult *
        workTypeMult
      ).toFixed(2),
    );
  }, [
    selectedWordCount,
    selectedDeadline,
    selectedService,
    academicLevel,
    selectedWorkType,
    apiWordCounts,
    apiUrgencies,
    apiBasePrice
  ]);

  const discount = useMemo(() => {
    const rate = (apiDiscountPercent ?? 40) / 100;
    return Number((subtotal * rate).toFixed(2));
  }, [subtotal, apiDiscountPercent]);

  const total = useMemo(() => {
    return Number((subtotal - discount).toFixed(2));
  }, [subtotal, discount]);

  const pagesCount = useMemo(() => {
    return Math.ceil(parseInt(selectedWordCount, 10) / 250);
  }, [selectedWordCount]);

  const activeServiceLabel = useMemo(() => {
    let matchName = "";
    dynamicServices.forEach((s: any) => {
      if (s.slug === selectedService) {
        matchName = s.title || s.hero_heading || "Service";
      }
      if (Array.isArray(s.children)) {
        s.children.forEach((c: any) => {
          if (c.slug === selectedService) {
            matchName = c.title || c.hero_heading || "Service";
          }
        });
      }
    });
    return matchName || "Academic Writing";
  }, [selectedService, dynamicServices]);

  const activeDeadlineLabel = useMemo(() => {
    const match = DEADLINES.find((d) => d.value === selectedDeadline);
    return match ? match.label : "3 Days";
  }, [selectedDeadline]);

  const urgencyValue = useMemo(() => {
    if (selectedDeadline === "12h" || selectedDeadline === "24h") {
      return "1";
    }
    return selectedDeadline.replace("d", "");
  }, [selectedDeadline]);

  const activeSubjectLabel = useMemo(() => {
    const match = subjectOptions.find((s) => s.value === selectedSubject);
    return match ? match.label : selectedSubject || "Academic Subject";
  }, [selectedSubject, subjectOptions]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderId, setOrderId] = useState("");

  const getCountryName = (code: string) => {
    switch (code) {
      case "+44": return "United Kingdom";
      case "+1": return "United States";
      case "+61": return "Australia";
      case "+1-CA": return "Canada";
      case "+64": return "New Zealand";
      default: return "United Kingdom";
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const cleanCountryCode = countryCode.replace("-CA", "");
      const payload = {
        name: fullName,
        email: email,
        countrycode: cleanCountryCode,
        phone: phoneNumber,
        service: activeServiceLabel,
        workType: selectedWorkType === "writing" ? "Writing" : selectedWorkType === "editing" ? "Editing" : "Rewriting",
        country: getCountryName(countryCode),
        subject: activeSubjectLabel,
        urgency: urgencyValue,
        wordCount: parseInt(selectedWordCount, 10) || 250,
        pages: pagesCount || 1,
        topic: "Academic Assignment Help",
        requirements: instructions || "No requirements specified.",
        finalPrice: total,
        source_page: typeof window !== "undefined" ? window.location.href : "https://assignmentinneed.com/order"
      };

      const response = await fetch("/api/web-place-order", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setOrderId(data.order_id || "");
        toast.success(data.message || "Order placed successfully!");
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }
        setIsSuccess(true);
      } else {
        let errMsg = data.message || "Failed to place order. Please try again.";
        if (data.errors && typeof data.errors === "object") {
          const details = Object.values(data.errors).flat().join(" ");
          if (details) {
            errMsg = `${errMsg} Details: ${details}`;
          }
        }
        setSubmitError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      const errMsg = "Network error. Please check your internet connection.";
      setSubmitError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#fbfcff] min-h-screen py-12 flex items-center justify-center">
        <SectionContainer className="max-w-xl text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="p-8 md:p-12 flex flex-col items-center justify-center gap-6 shadow-2xl border border-emerald-100 rounded-3xl bg-white relative overflow-hidden">
              {/* Confetti-style background accent */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-70 pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-50 rounded-full blur-2xl opacity-70 pointer-events-none" />

              {/* Bouncing Success Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>

              {/* Animated Text Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex flex-col gap-3"
              >
                <Heading
                  level={2}
                  className="text-2xl md:text-3xl text-gray-900 font-extrabold"
                >
                  Order Placed Successfully!
                </Heading>
                <Text className="text-gray-600 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                  Thank you,{" "}
                  <span className="font-extrabold text-[#3f159a]">
                    {fullName || "Student"}
                  </span>
                  . Your academic order is registered. Our coordinator will email
                  you at{" "}
                  <span className="font-bold text-[#3f159a]">
                    {email || "your address"}
                  </span>{" "}
                  to assign your PhD subject specialist.
                </Text>
              </motion.div>

              {/* Animated Order ID Badge */}
              {orderId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="bg-emerald-50/75 text-emerald-800 border border-emerald-100/50 px-5 py-3 rounded-2xl font-black text-sm select-all tracking-wider shadow-sm"
                >
                  Order ID: <span className="font-extrabold text-emerald-600 font-mono">{orderId}</span>
                </motion.div>
              )}

              {/* Animated Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="flex gap-4 w-full mt-4"
              >
                <Link href="/" className="w-full">
                  <Button variant="blueClose" className="w-full h-11 rounded-xl font-bold shadow-sm">
                    Return Home
                  </Button>
                </Link>
                <Button
                  variant="orangeOpen"
                  className="w-full h-11 rounded-xl font-bold shadow-sm"
                  onClick={() => {
                    setIsSuccess(false);
                    setOrderId("");
                  }}
                >
                  New Order
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-8">
      {/* 1. Hero Title Header Block */}
      <section className="relative  w-full bg-gradient-to-r from-white via-purple-50/20 to-purple-50/40 overflow-hidden">
        {/* Soft background shape */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/new-pricingimg/hero.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center right",
            backgroundSize: "contain",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column Text Info */}
          <AnimateIn variant="fadeUp" className="lg:col-span-7 flex flex-col gap-5 text-left">
            <Heading level={2} className="font-black text-gray-950 leading-tight">
              Need Assignment Help?
            </Heading>
            <h2 className="text-[20px] md:text-[24px] font-extrabold text-[#3f159a] leading-tight -mt-3">
              Get Expert Assistance in 3 Simple Steps
            </h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl font-medium">
              High-quality, plagiarism-free assignments delivered on time, every
              time.
            </p>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-sm text-gray-900 leading-none">
                    4.9
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                    Rating
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-sm text-gray-900 leading-none">
                    5500+
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                    Reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-sm text-gray-900 leading-none">
                    15000+
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                    Delivered
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-sm text-gray-900 leading-none">
                    100%
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                    Confidential
                  </span>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Right Column Graphic */}
          <AnimateIn variant="scaleUp" delay={0.15} className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full max-w-[340px] aspect-square">
              <Image
                src="/order-page/order-hero.png"
                alt="Student assignment help assistance"
                fill
                className="object-contain"
                priority
              />

              {/* Floating 24/7 support badge */}
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-2xl p-3.5 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Headset className="w-5 h-5 text-purple-700" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[13px] font-extrabold text-gray-900">
                    24/7
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                    Support
                  </span>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
{/* 2. Order Form Main Section */}
      <SectionContainer className="!py-2 !pb-2">
        <form
          onSubmit={handleOrderSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* LEFT COLUMN: Input details (65%) */}
          <AnimateIn variant="fadeUp" className="lg:col-span-8 flex flex-col gap-6">
            <Card className="p-6 md:p-8 flex flex-col gap-8 text-left shadow-[0_10px_40px_rgba(0,0,0,0.02)] bg-white border border-gray-150/70 rounded-3xl">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <FileText className="w-6 h-6 text-[#3f159a]" />
                <Heading
                  level={3}
                  className="text-[18px] md:text-[20px] text-gray-900"
                >
                  Order Form
                </Heading>
              </div>

              {/* STEP 1: Contact Information */}
              <div className="flex flex-col gap-5">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-sm px-2 py-1 bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Contact Information
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) =>
                          setFullName(
                            e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                          )
                        }
                        placeholder="Enter Your Full Name"
                        className="w-full text-[14px] text-gray-800 font-medium h-[46px] pl-10 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) =>
                          setEmail(
                            e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, ""),
                          )
                        }
                        placeholder="Enter Your Email Address"
                        className="w-full text-[14px] text-gray-800 font-medium h-[46px] pl-10 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px]  font-bold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-[80px] shrink-0 border border-gray-200 bg-white rounded-xl pl-9 pr-2 flex items-center h-[46px]">
                        <Phone className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                        <CustomDropdown
                          options={COUNTRY_CODES}
                          value={countryCode}
                          onChange={setCountryCode}
                          align="left"
                        />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        placeholder="Enter Your Phone Number"
                        className="w-full text-[14px] text-gray-800 font-medium h-[46px] px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 transition-colors shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Assignment Details */}
              <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-sm px-2 py-1 bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Assignment Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Subject Dropdown */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                        <BookOpen className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <CustomDropdown
                        options={subjectOptions}
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        placeholder="Select Subject"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>

                  {/* Service Dropdown */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                        <FileText className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <CustomDropdown
                        options={serviceOptions}
                        value={selectedService}
                        onChange={setSelectedService}
                        placeholder="Select Service"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>

                  {/* Work Type Dropdown */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Work Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                        <Briefcase className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <CustomDropdown
                        options={WORK_TYPES}
                        value={selectedWorkType}
                        onChange={setSelectedWorkType}
                        placeholder="Select Work Type"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: Delivery Details */}
              <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-sm px-2 py-1 bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Delivery Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Academic Level Dropdown */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Academic Level <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                        <Award className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <CustomDropdown
                        options={ACADEMIC_LEVELS}
                        value={academicLevel}
                        onChange={setAcademicLevel}
                        placeholder="Select Academic Level"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>

                  {/* Deadline Dropdown */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Deadline / Urgency <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                        <Calendar className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <CustomDropdown
                        options={deadlineOptions}
                        value={selectedDeadline}
                        onChange={setSelectedDeadline}
                        placeholder="Select Deadline"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>

                  {/* Word Count Stepper */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Pages / Word Count <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-white border border-solid border-gray-200 rounded-xl flex items-center justify-between px-2 w-full h-[46px] shadow-sm select-none">
                      {/* Decrement Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = parseInt(selectedWordCount, 10) || 250;
                          const nextVal = Math.max(250, currentVal - 250);
                          setSelectedWordCount(String(nextVal));
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-solid border-slate-200 text-gray-600 hover:bg-slate-50 hover:text-purple-700 active:scale-95 transition-all cursor-pointer font-bold text-lg select-none outline-none focus:outline-none"
                      >
                        −
                      </button>
                      {/* Display */}
                      <span className="text-[14px] font-semibold text-gray-800 flex items-center justify-center gap-1.5">
                        <span>
                          {Math.ceil((parseInt(selectedWordCount, 10) || 250) / 250)}{" "}
                          {Math.ceil((parseInt(selectedWordCount, 10) || 250) / 250) === 1 ? "Page" : "Pages"}
                        </span>
                        <span className="text-[12px] text-gray-500 font-medium">
                          ({parseInt(selectedWordCount, 10) || 250} words)
                        </span>
                      </span>
                      {/* Increment Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = parseInt(selectedWordCount, 10) || 250;
                          const nextVal = Math.min(20000, currentVal + 250);
                          setSelectedWordCount(String(nextVal));
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-solid border-slate-200 text-gray-600 hover:bg-slate-50 hover:text-purple-700 active:scale-95 transition-all cursor-pointer font-bold text-lg select-none outline-none focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 4: Additional Instructions */}
              <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-sm px-2 py-1 bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Additional Instructions
                </span>
                <textarea
                  placeholder="Enter your instructions here..."
                  className="w-full p-4 border border-gray-200 bg-white rounded-xl text-[14px] text-gray-800 focus:outline-none focus:border-purple-600 transition-colors shadow-sm font-medium"
                  rows={4}
                  value={instructions}
                  onChange={handleInstructionsChange}
                />
              </div>
            </Card>

            {/* Bottom Benefits Strips */}
            <div className="bg-white border border-gray-150/80 rounded-3xl p-6 shadow-sm mt-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: <FileText className="w-5 h-5 text-purple-700" />,
                    title: "Plagiarism Free",
                    desc: "100% original content guaranteed",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-purple-700" />,
                    title: "On-Time Delivery",
                    desc: "We deliver before the deadline",
                  },
                  {
                    icon: <Award className="w-5 h-5 text-purple-700" />,
                    title: "Expert Writers",
                    desc: "PhD qualified writers in your subject",
                  },
                  {
                    icon: <Headset className="w-5 h-5 text-purple-700" />,
                    title: "24/7 Support",
                    desc: "Always here to help you succeed",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm leading-none">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-semibold mt-1.5 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>

          {/* RIGHT COLUMN: Sidebar dynamic values (35%) */}
          <AnimateIn variant="fadeUp" delay={0.15} className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            {/* 1. Order Summary Card */}
            <Card className="p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] text-left flex flex-col gap-5 bg-white border border-gray-150/70 rounded-3xl">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText className="w-5 h-5 text-purple-700" />
                <Heading
                  level={3}
                  className="text-base text-gray-900"
                >
                  Order Summary
                </Heading>
              </div>

              {/* Active Selection Details list */}
              <div className="flex flex-col gap-3.5 py-1 text-xs font-bold text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold">Service</span>
                  <span className="text-gray-900">{activeServiceLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold">Work Type</span>
                  <span className="text-gray-900 uppercase">
                    {selectedWorkType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold">Deadline</span>
                  <span className="text-gray-900">{activeDeadlineLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold">
                    Word Count
                  </span>
                  <span className="text-gray-900">
                    {selectedWordCount} Words
                  </span>
                </div>
              </div>

              {/* Price Details breakdown */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Subtotal</span>
                  <span className="text-gray-950">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span>Discount (40%)</span>
                  <span>- £{discount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Row price */}
              <div className="border-t border-gray-100 pt-4 bg-[#f8f6ff] border border-purple-100/50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-bold text-[#3f159a]">
                  Total Price
                </span>
                <span className="font-heading font-black text-2xl md:text-3xl text-[#3f159a] leading-none">
                  £{total.toFixed(2)}
                </span>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="bg-red-50 text-red-700 text-xs px-3.5 py-2.5 rounded-xl border border-red-100 font-semibold text-center mt-2">
                  {submitError}
                </div>
              )}

              {/* Submit CTA button */}
              <Button
                type="submit"
                variant="blueOpen"
                size="lg"
                fullWidth
                className="mt-2"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              >
                {isSubmitting ? "Placing Order..." : "Continue to Order"}
              </Button>

              {/* Payment Safe Safeguard */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure & Safe Payment</span>
              </div>
            </Card>

            {/* 2. Need Help support Card */}
            <div className="bg-white border border-gray-150/70 rounded-3xl p-6 text-left flex flex-col gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Headset className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-sm">
                    Need Help?
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our support team is available 24/7 to assist you with any
                questions.
              </p>
              <Link href="/contact" className="w-full">
                <Button
                  type="button"
                  variant="blueClose"
                  size="sm"
                  fullWidth
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </form>
      </SectionContainer>
    </div>
  );
}
