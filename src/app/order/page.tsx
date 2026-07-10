"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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

const COUNTRY_CODES = [
  { label: "🇬🇧 +44", value: "+44" },
  { label: "🇺🇸 +1", value: "+1" },
  { label: "🇦🇺 +61", value: "+61" },
  { label: "🇨🇦 +1", value: "+1-CA" },
  { label: "🇳🇿 +64", value: "+64" },
];

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

    fetchServices();
    fetchSubjects();
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
      
      if (Array.isArray(s.children)) {
        s.children.forEach((c: any) => {
          const cName = c.title || c.hero_heading || c.meta_title || "Sub-Service";
          list.push({ label: `↳ ${cName}`, value: c.slug });
        });
      }
    });
    return list;
  }, [dynamicServices]);

  // Step 3: Delivery Details
  const [selectedDeadline, setSelectedDeadline] = useState("3d");
  const [selectedWordCount, setSelectedWordCount] = useState("2500");

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
    const pages = parseInt(selectedWordCount, 10) / 250;
    const basePricePerPage = 2.002;

    // Deadline Multipliers
    let deadlineMult = 1.0;
    if (selectedDeadline === "12h") deadlineMult = 2.5;
    else if (selectedDeadline === "24h") deadlineMult = 2.0;
    else if (selectedDeadline === "2d") deadlineMult = 1.5;
    else if (selectedDeadline === "3d") deadlineMult = 1.0;
    else if (selectedDeadline === "5d") deadlineMult = 0.9;
    else if (selectedDeadline === "7d") deadlineMult = 0.8;
    else if (selectedDeadline === "10d") deadlineMult = 0.7;
    else if (selectedDeadline === "14d") deadlineMult = 0.6;

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
        pages *
        basePricePerPage *
        deadlineMult *
        levelMult *
        workTypeMult
      ).toFixed(2),
    );
  }, [selectedWordCount, selectedDeadline, academicLevel, selectedWorkType]);

  const discount = useMemo(() => {
    return Number((subtotal * 0.4).toFixed(2));
  }, [subtotal]);

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

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#fbfcff] min-h-screen py-8 flex items-center justify-center">
        <SectionContainer className="max-w-xl text-center">
          <Card className="p-8 md:p-12 flex flex-col items-center justify-center gap-6 shadow-xl border border-primary-100">
            <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center text-success animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <Heading
              level={2}
              className="text-2xl md:text-3xl text-text-heading"
            >
              Order Placed Successfully!
            </Heading>
            <Text className="text-text-body text-base max-w-sm">
              Thank you,{" "}
              <span className="font-bold text-primary-700">
                {fullName || "Student"}
              </span>
              . Your academic order is registered. Our coordinator will email
              you at{" "}
              <span className="font-semibold text-primary-700">
                {email || "your address"}
              </span>{" "}
              to assign your PhD subject specialist.
            </Text>
            <div className="flex gap-4 w-full mt-4">
              <Link href="/" className="w-full">
                <Button variant="blueClose" className="w-full">
                  Return Home
                </Button>
              </Link>
              <Button
                variant="orangeOpen"
                className="w-full"
                onClick={() => setIsSuccess(false)}
              >
                New Order
              </Button>
            </div>
          </Card>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-8">
      {/* 1. Hero Title Header Block */}
      <section className="relative w-full bg-gradient-to-r from-white via-purple-50/20 to-purple-50/40 py-2 overflow-hidden">
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
          <div className="lg:col-span-7 flex flex-col gap-5 text-left">
            <h1 className="text-[36px] md:text-[44px] font-black text-gray-950 leading-tight">
              Need Assignment Help?
            </h1>
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
          </div>

          {/* Right Column Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full max-w-[340px] aspect-square">
              <img
                src="/order-page/order-hero.png"
                alt="Student assignment help assistance"
                className="w-full h-full object-contain"
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
          </div>
        </div>
      </section>

      {/* 2. Order Form Main Section */}
      <SectionContainer className="!py-10 !pb-2">
        <form
          onSubmit={handleOrderSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* LEFT COLUMN: Input details (65%) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="p-6 md:p-8 flex flex-col gap-8 text-left shadow-[0_10px_40px_rgba(0,0,0,0.02)] bg-white border border-gray-150/70 rounded-3xl">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <FileText className="w-6 h-6 text-[#3f159a]" />
                <Heading
                  level={2}
                  className="text-[18px] md:text-[20px] font-extrabold text-gray-900"
                >
                  Submit Your Assignment
                </Heading>
              </div>

              {/* STEP 1: Personal Info */}
              <div className="flex flex-col gap-5">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Personal Information
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
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 h-[46px] border border-gray-200 bg-white rounded-xl text-[14px] text-gray-800 focus:outline-none focus:border-purple-600 transition-colors shadow-sm font-medium"
                        value={fullName}
                        onChange={handleFullNameChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <FileText className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 h-[46px] border border-gray-200 bg-white rounded-xl text-[14px] text-gray-800 focus:outline-none focus:border-purple-600 transition-colors shadow-sm font-medium"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex border border-gray-200 bg-white rounded-xl overflow-hidden focus-within:border-purple-600 transition-colors shadow-sm h-[46px]">
                      {/* Country Selector Dropdown */}
                      <div className="relative flex items-center bg-gray-50/50 border-r border-gray-200 shrink-0">
                        <select
                          className="pl-3 pr-8 h-full bg-transparent text-[14px] font-bold text-gray-800 focus:outline-none appearance-none cursor-pointer"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-gray-400">
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </div>
                      {/* Input number */}
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        className="flex-1 pl-4 pr-4 h-full bg-transparent text-[14px] text-gray-800 focus:outline-none font-medium"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Assignment Details */}
              <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
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
                  <span className="w-5.5 h-5.5 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Delivery Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        options={DEADLINES}
                        value={selectedDeadline}
                        onChange={setSelectedDeadline}
                        placeholder="Select Deadline"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>

                  {/* Word Count */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Word Count <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                        <span className="font-black text-[11px] text-gray-400 select-none">
                          123
                        </span>
                      </div>
                      <CustomDropdown
                        options={WORD_COUNTS}
                        value={selectedWordCount}
                        onChange={setSelectedWordCount}
                        placeholder="Select Word Count"
                        triggerClassName="!text-[14px] !text-gray-800 !font-medium !h-[46px] pl-10 pr-4 bg-white !border !border-solid !border-gray-200 rounded-xl focus:border-purple-600 focus-within:border-purple-600 transition-colors shadow-sm flex items-center justify-between"
                        dropdownClassName="!text-[14px] shadow-lg rounded-xl border border-gray-150"
                      />
                    </div>
                  </div>

                  {/* Calculated Pages */}
                  <div className="flex flex-col gap-1.5 w-full text-left">
                    <label className="text-[13px] font-bold text-gray-700">
                      Pages
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <BookOpen className="w-[18px] h-[18px] text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled
                        className="w-full pl-10 pr-4 h-[46px] border border-gray-200 bg-gray-50/50 rounded-xl text-[14px] text-gray-500 font-bold select-none cursor-not-allowed"
                        value={pagesCount > 0 ? `${pagesCount}` : "-"}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Level */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <span className="text-xs font-bold text-gray-700">
                    Academic Level:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setAcademicLevel(lvl.value)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          academicLevel === lvl.value
                            ? "bg-[#3f159a] border-[#3f159a] text-white shadow-sm"
                            : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600",
                        )}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 4: Additional Instructions */}
              <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Additional Instructions
                </span>
                <textarea
                  placeholder="Enter your instructions here..."
                  className="w-full p-4 border border-gray-200 bg-white rounded-xl text-[14px] text-gray-800 focus:outline-none focus:border-purple-600 transition-colors shadow-sm font-medium"
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* STEP 5: Upload Files */}
              {/* <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <span className="text-sm font-extrabold text-[#3f159a] flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#3f159a] text-white flex items-center justify-center text-xs font-bold">5</span>
                  Upload Files (Optional)
                </span>
                
                <div className="relative border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/5 rounded-2xl p-6 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
                  <input 
                    type="file" 
                    id="file-upload" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                      <FileUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-purple-800">Drag & Drop your files here</span>
                      <span className="text-xs text-gray-400 font-semibold mt-0.5">or click to browse local folders (Max file size: 20MB)</span>
                    </div>
                  </div>
                  <Button 
                    type="button"
                    variant="blueOpen"
                    size="sm"
                    className="relative z-20 shrink-0"
                  >
                    Choose Files
                  </Button>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2 text-left">
                    <span className="text-xs font-bold text-gray-900">Attached Files ({attachedFiles.length}):</span>
                    <div className="flex flex-col gap-1.5">
                      {attachedFiles.map((filename, index) => (
                        <div key={index} className="flex items-center justify-between bg-purple-50/20 p-2.5 rounded-lg border border-purple-100/30 text-xs text-gray-800 font-medium">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileUp className="w-4 h-4 text-purple-500 shrink-0" />
                            <span className="truncate">{filename}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            aria-label={`Remove file ${filename}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}
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
          </div>

          {/* RIGHT COLUMN: Sidebar dynamic values (35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            {/* 1. Order Summary Card */}
            <Card className="p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] text-left flex flex-col gap-5 bg-white border border-gray-150/70 rounded-3xl">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText className="w-5 h-5 text-purple-700" />
                <Heading
                  level={3}
                  className="text-base font-extrabold text-gray-900"
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

              {/* Submit CTA button */}
              <Button
                type="submit"
                variant="blueOpen"
                size="lg"
                fullWidth
                className="mt-2"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Continue to Order
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
          </div>
        </form>
      </SectionContainer>
    </div>
  );
}
