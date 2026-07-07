"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Star, 
  Users, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  Upload, 
  ArrowRight, 
  Lock,
  User,
  Calculator,
  HelpCircle,
  FileUp,
  Trash2
} from "lucide-react";

import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, TextArea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Badge } from "@/components/ui/Badge";
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
  { label: "🇬🇧 +44 (UK)", value: "+44" },
  { label: "🇺🇸 +1 (US)", value: "+1" },
  { label: "🇦🇺 +61 (AUS)", value: "+61" },
  { label: "🇨🇦 +1 (CAN)", value: "+1-CA" },
  { label: "🇳🇿 +64 (NZ)", value: "+64" },
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/service-pages`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
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
    fetchServices();
  }, []);

  // Step 3: Delivery Details
  const [selectedDeadline, setSelectedDeadline] = useState("3d");
  const [selectedWordCount, setSelectedWordCount] = useState("2500");

  // Step 4: Instructions
  const [instructions, setInstructions] = useState("");

  // Step 5: Upload Files (Simulated)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Map subjects/services for Radix Select Options
  const subjectOptions = useMemo(() => 
    SUBJECTS.map((sub) => ({ label: sub.name, value: sub.slug })),
    []
  );

  const serviceOptions = useMemo(() => 
    dynamicServices.map((s) => ({ label: s.hero_heading || s.meta_title || "Service", value: s.slug })),
    [dynamicServices]
  );

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map(file => file.name);
      setAttachedFiles(prev => [...prev, ...names]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
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

    return Number((pages * basePricePerPage * deadlineMult * levelMult * workTypeMult).toFixed(2));
  }, [selectedWordCount, selectedDeadline, academicLevel, selectedWorkType]);

  const discount = useMemo(() => {
    return Number((subtotal * 0.40).toFixed(2));
  }, [subtotal]);

  const total = useMemo(() => {
    return Number((subtotal - discount).toFixed(2));
  }, [subtotal, discount]);

  const pagesCount = useMemo(() => {
    return parseInt(selectedWordCount, 10) / 250;
  }, [selectedWordCount]);

  const activeServiceLabel = useMemo(() => {
    const match = dynamicServices.find(s => s.slug === selectedService);
    return match ? (match.hero_heading || "Service") : "Academic Writing";
  }, [selectedService, dynamicServices]);

  const activeDeadlineLabel = useMemo(() => {
    const match = DEADLINES.find(d => d.value === selectedDeadline);
    return match ? match.label : "3 Days";
  }, [selectedDeadline]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-surface-lavender min-h-screen py-16 flex items-center justify-center">
        <SectionContainer className="max-w-xl text-center">
          <Card className="p-8 md:p-12 flex flex-col items-center justify-center gap-6 shadow-xl border border-primary-100">
            <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center text-success animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <Heading level={2} className="text-2xl md:text-3xl text-text-heading">Order Placed Successfully!</Heading>
            <Text className="text-text-body text-base max-w-sm">
              Thank you, <span className="font-bold text-primary-700">{fullName || "Student"}</span>. Your academic order is registered. Our coordinator will email you at <span className="font-semibold text-primary-700">{email || "your address"}</span> to assign your PhD subject specialist.
            </Text>
            <div className="flex gap-4 w-full mt-4">
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">Return Home</Button>
              </Link>
              <Button variant="cta" className="w-full" onClick={() => setIsSuccess(false)}>New Order</Button>
            </div>
          </Card>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="bg-surface-lavender min-h-screen">
      {/* 1. Hero Title Header Block */}
      <section className="bg-gradient-to-br from-primary-50/50 via-white to-primary-50/20 py-10 md:py-14 border-b border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Text Info */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-left">
            <Badge variant="soft-purple" className="w-fit font-bold px-3 py-1">Order Process</Badge>
            <Heading level={1} className="text-3xl md:text-4xl lg:text-5xl leading-tight">
              Need Assignment Help?
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 block mt-1">
                Get Expert Assistance in 3 Simple Steps
              </span>
            </Heading>
            <Text className="text-sm md:text-base text-text-body leading-relaxed max-w-xl">
              High-quality, plagiarism-free assignments delivered on time, every time. Fill in your requirements below and check your summary price in real-time.
            </Text>

            {/* Micro Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/75 p-3 rounded-xl border border-primary-100/50 shadow-sm mt-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-xs text-text-heading">4.9</span>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Rating</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-xs text-text-heading">5500+</span>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Reviews</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-xs text-text-heading">15000+</span>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Completed</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-xs text-text-heading">100%</span>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Confidential</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-tr from-primary-100 to-primary-50 overflow-hidden border-2 border-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80" 
                alt="Student assignment help assistance" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Support Float Bubble */}
            <div className="absolute bottom-4 right-8 bg-white border border-primary-100 shadow-md rounded-xl p-3 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-text-heading">24/7</span>
                <span className="text-[9px] text-text-muted uppercase font-semibold">Active Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Order Form Main Section */}
      <SectionContainer className="py-12">
        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input details (65%) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="p-6 md:p-8 flex flex-col gap-8 text-left shadow-md bg-white border border-primary-100/50">
              <div className="flex items-center gap-2 border-b border-primary-50 pb-3">
                <Calculator className="w-5.5 h-5.5 text-primary-700" />
                <Heading level={2} className="text-lg md:text-xl text-text-heading">Submit Your Assignment</Heading>
              </div>

              {/* STEP 1: Personal Info */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-heading font-extrabold text-primary-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs">1</span>
                  Personal Information
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    label="Full Name *"
                    placeholder="Enter your full name"
                    icon={<User />}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input 
                    label="Email Address *"
                    placeholder="Enter your email address"
                    icon={<Mail />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="flex flex-col gap-1.5 w-full">
                    <span className="text-sm font-heading font-semibold text-text-heading">Phone Number *</span>
                    <div className="grid grid-cols-[110px_1fr] gap-2 items-center">
                      <Select 
                        options={COUNTRY_CODES}
                        value={countryCode}
                        onValueChange={setCountryCode}
                        className="h-12 border-primary-100/50"
                      />
                      <Input 
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="py-3 px-4 h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Assignment Details */}
              <div className="flex flex-col gap-4 border-t border-primary-50/50 pt-6">
                <span className="text-sm font-heading font-extrabold text-primary-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs">2</span>
                  Assignment Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select 
                    label="Subject *"
                    options={subjectOptions}
                    placeholder="Select Subject"
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  />
                  <Select 
                    label="Service *"
                    options={serviceOptions}
                    placeholder="Select Service"
                    value={selectedService}
                    onValueChange={setSelectedService}
                  />
                  <Select 
                    label="Work Type *"
                    options={WORK_TYPES}
                    placeholder="Select Work Type"
                    value={selectedWorkType}
                    onValueChange={setSelectedWorkType}
                  />
                </div>
              </div>

              {/* STEP 3: Delivery Details */}
              <div className="flex flex-col gap-4 border-t border-primary-50/50 pt-6">
                <span className="text-sm font-heading font-extrabold text-primary-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs">3</span>
                  Delivery Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select 
                    label="Deadline / Urgency *"
                    options={DEADLINES}
                    placeholder="Select Deadline"
                    value={selectedDeadline}
                    onValueChange={setSelectedDeadline}
                    labelIcon={<Calendar className="w-4 h-4" />}
                  />
                  <Select 
                    label="Word Count *"
                    options={WORD_COUNTS}
                    placeholder="Select Word Count"
                    value={selectedWordCount}
                    onValueChange={setSelectedWordCount}
                  />
                  <Input 
                    label="Pages"
                    value={`${pagesCount} Page${pagesCount > 1 ? "s" : ""}`}
                    disabled
                    readOnly
                    className="bg-primary-50/15 border-dashed cursor-not-allowed select-none text-text-muted"
                  />
                </div>
                
                {/* Academic Level */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-semibold text-text-heading">Academic Level:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setAcademicLevel(lvl.value)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          academicLevel === lvl.value
                            ? "bg-primary-700 border-primary-700 text-white shadow-sm"
                            : "bg-white border-primary-100 hover:bg-primary-50/40 text-text-body"
                        )}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 4: Additional Instructions */}
              <div className="flex flex-col gap-4 border-t border-primary-50/50 pt-6">
                <span className="text-sm font-heading font-extrabold text-primary-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs">4</span>
                  Additional Instructions
                </span>
                <TextArea 
                  placeholder="Enter your instructions here..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                />
              </div>

              {/* STEP 5: Upload Files */}
              <div className="flex flex-col gap-4 border-t border-primary-50/50 pt-6">
                <span className="text-sm font-heading font-extrabold text-primary-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs">5</span>
                  Upload Files (Optional)
                </span>
                
                {/* Drag and Drop Box */}
                <div className="relative border-2 border-dashed border-primary-200 hover:border-primary-400 bg-primary-50/5 rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center gap-3">
                  <input 
                    type="file" 
                    id="file-upload" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handleFileChange}
                  />
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shadow-inner">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-text-heading">Drag & Drop your files here</span>
                    <span className="text-xs text-text-muted">or click to browse local folders (Max file size: 20MB)</span>
                  </div>
                  <label htmlFor="file-upload" className="bg-primary-700 hover:bg-primary-600 text-white font-heading font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-sm relative z-10 transition-colors">
                    Choose Files
                  </label>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-xs font-bold text-text-heading">Attached Files ({attachedFiles.length}):</span>
                    <div className="flex flex-col gap-1.5">
                      {attachedFiles.map((filename, index) => (
                        <div key={index} className="flex items-center justify-between bg-primary-50/20 p-2.5 rounded-lg border border-primary-100/30 text-xs text-text-heading font-medium">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileUp className="w-4 h-4 text-primary-500 shrink-0" />
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
              </div>
            </Card>

            {/* Bottom Benefits Strips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: "Plagiarism Free", desc: "100% original content guaranteed" },
                { title: "On-Time Delivery", desc: "We deliver before the deadline" },
                { title: "Expert Writers", desc: "PhD qualified writers in your subject" },
                { title: "24/7 Support", desc: "Always here to help you succeed" },
              ].map((b, idx) => (
                <div key={idx} className="bg-white border border-primary-100/50 p-4 rounded-xl text-left flex flex-col gap-1 items-start shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-text-heading">{b.title}</span>
                  <span className="text-[10px] text-text-muted leading-tight">{b.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar dynamic values (35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            {/* 1. Order Summary Card */}
            <Card className="p-6 border-t-4 border-t-primary-700 shadow-md text-left flex flex-col gap-4 bg-white border border-primary-100/50">
              <div className="flex items-center gap-2 border-b border-primary-50 pb-3">
                <FileText className="w-4.5 h-4.5 text-primary-700" />
                <Heading level={3} className="text-base text-text-heading">Order Summary</Heading>
              </div>

              {/* Active Selection Details list */}
              <div className="flex flex-col gap-3.5 py-1 text-xs font-medium text-text-body">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Service</span>
                  <span className="text-text-heading font-semibold">{activeServiceLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Work Type</span>
                  <span className="text-text-heading font-semibold uppercase">{selectedWorkType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Deadline</span>
                  <span className="text-text-heading font-semibold">{activeDeadlineLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Word Count</span>
                  <span className="text-text-heading font-semibold">{selectedWordCount} Words</span>
                </div>
              </div>

              {/* Price Details breakdown */}
              <div className="border-t border-primary-50/50 pt-4 flex flex-col gap-2.5">
                <div className="flex justify-between text-xs font-semibold text-text-body">
                  <span>Subtotal</span>
                  <span className="text-text-heading">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-success bg-success/5 p-2.5 rounded-lg border border-success/15">
                  <span>Discount (40%)</span>
                  <span>- £{discount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Row price */}
              <div className="border-t border-dashed border-primary-100 pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-text-heading">Total Price</span>
                <span className="font-heading font-black text-2xl md:text-3xl text-primary-700 leading-none">
                  £{total.toFixed(2)}
                </span>
              </div>

              {/* Submit CTA button */}
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                type="submit"
                className="mt-2 text-base font-bold shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span>Continue to Order</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

              {/* Payment Safe Safeguard */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-muted font-bold mt-1 uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5 text-success" />
                <span>Secure & Safe Payment</span>
              </div>
            </Card>

            {/* 2. Need Help support Card */}
            <Card className="p-6 text-left flex flex-col gap-3.5 bg-white border border-primary-100/50 shadow-md">
              <Heading level={4} className="text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4.5 h-4.5 text-primary-500" />
                Need Help?
              </Heading>
              <Text className="text-xs text-text-body leading-relaxed">
                Our support team is available 24/7 to assist you with any questions.
              </Text>
              <Link href="/contact" className="w-full">
                <Button variant="outline" size="sm" className="w-full font-bold">
                  Contact Support
                </Button>
              </Link>
            </Card>
          </div>
        </form>
      </SectionContainer>
    </div>
  );
}
