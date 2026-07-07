"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Select } from "./Select";
import { Input, TextArea } from "./Input";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { CheckCircle2 } from "lucide-react";

export interface QuoteFormProps {
  className?: string;
  variant?: "compact" | "extended";
  prefilledSubject?: string;
  onSuccess?: (data: Record<string, string>) => void;
  title?: string;
}

const PROJECT_TYPES = [
  { label: "Assignment Writing", value: "assignment" },
  { label: "Essay Writing", value: "essay" },
  { label: "Dissertation Writing", value: "dissertation" },
  { label: "Case Study Writing", value: "case-study" },
  { label: "Report Writing", value: "report" },
  { label: "Coursework Writing", value: "coursework" },
  { label: "Proofreading", value: "proofreading" },
  { label: "Editing & Formatting", value: "editing" },
];

const TIME_PERIODS = [
  { label: "6 Hours", value: "6h" },
  { label: "12 Hours", value: "12h" },
  { label: "24 Hours", value: "24h" },
  { label: "2 Days", value: "2d" },
  { label: "3 Days", value: "3d" },
  { label: "5 Days", value: "5d" },
  { label: "7 Days", value: "7d" },
  { label: "10+ Days", value: "10d" },
];

const WORD_COUNTS = [
  { label: "250 Words (1 Page)", value: "250" },
  { label: "500 Words (2 Pages)", value: "500" },
  { label: "1000 Words (4 Pages)", value: "1000" },
  { label: "1500 Words (6 Pages)", value: "1500" },
  { label: "2000 Words (8 Pages)", value: "2000" },
  { label: "3000 Words (12 Pages)", value: "3000" },
  { label: "5000 Words (20 Pages)", value: "5000" },
  { label: "10000+ Words", value: "10000" },
];

export const QuoteForm: React.FC<QuoteFormProps> = ({
  className,
  variant = "compact",
  prefilledSubject,
  onSuccess,
  title = "Get Instant Quote",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [projectType, setProjectType] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [requirements, setRequirements] = useState("");
  const [subject, setSubject] = useState(prefilledSubject || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(prefilledSubject);
    }
  }, [prefilledSubject]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!mobileNo.trim()) newErrors.mobileNo = "Mobile number is required";
    if (!projectType) newErrors.projectType = "Project type is required";
    if (!wordCount) newErrors.wordCount = "Word count is required";
    if (!timePeriod) newErrors.timePeriod = "Time period is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess({ name, email, mobileNo, projectType, wordCount, timePeriod, requirements, subject });
      }
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className={cn("bg-white rounded-card shadow-card border border-primary-100/50 p-6 md:p-8 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]", className)}>
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-2 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <Heading level={3} className="text-2xl">Quote Request Sent!</Heading>
        <p className="text-text-body text-sm max-w-sm">
          We have received your requirements. One of our expert academic writers will contact you shortly at <span className="font-semibold text-primary-700">{email}</span> with a custom quote.
        </p>
        <Button
          variant="cta"
          size="sm"
          className="mt-4"
          onClick={() => {
            setIsSubmitted(false);
            setName("");
            setEmail("");
            setMobileNo("");
            setProjectType("");
            setWordCount("");
            setTimePeriod("");
            setRequirements("");
            setErrors({});
          }}
        >
          Request Another Quote
        </Button>
      </div>
    );
  }

  const defaultSubjectOptions = [
    { label: "Business", value: "business" },
    { label: "Law", value: "law" },
    { label: "Nursing", value: "nursing" },
    { label: "Engineering", value: "engineering" },
    { label: "Psychology", value: "psychology" },
    { label: "Marketing", value: "marketing" },
    { label: "Finance", value: "finance" },
    { label: "Other", value: "other" },
  ];

  const subjectOptions = [...defaultSubjectOptions];
  if (subject && !defaultSubjectOptions.some(opt => opt.value === subject)) {
    const formattedLabel = subject
      .split(/[-/]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    subjectOptions.push({ label: formattedLabel, value: subject });
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-7 flex flex-col gap-5", className)} id="quote-form">
      {/* Title */}
      <div className="flex items-center justify-center gap-2">
        <Heading level={3} className="text-[18px] md:text-[20px] font-extrabold text-gray-900 leading-tight">
          {title}
        </Heading>
        <span className="text-orange-500">✦</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {variant === "compact" ? (
          <>
            {/* Academic Level */}
            <div className="flex items-center gap-3">
              <label className="text-[13px] font-bold text-gray-700 whitespace-nowrap min-w-[110px]">Academic Level</label>
              <Select
                placeholder="Select Level"
                options={[
                  { label: "Undergraduate", value: "undergraduate" },
                  { label: "Masters", value: "masters" },
                  { label: "PhD", value: "phd" },
                  { label: "A-Level", value: "a-level" },
                  { label: "GCSE", value: "gcse" },
                ]}
                value={projectType}
                onValueChange={(val) => {
                  setProjectType(val);
                  if (errors.projectType) setErrors((prev) => ({ ...prev, projectType: "" }));
                }}
                error={errors.projectType}
              />
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3">
              <label className="text-[13px] font-bold text-gray-700 whitespace-nowrap min-w-[110px]">Subject</label>
              <Select
                placeholder="Select Subject"
                options={subjectOptions}
                value={subject}
                onValueChange={(val) => setSubject(val)}
              />
            </div>

            {/* Assignment Type */}
            <div className="flex items-center gap-3">
              <label className="text-[13px] font-bold text-gray-700 whitespace-nowrap min-w-[110px]">Assignment Type</label>
              <Select
                placeholder="Select Type"
                options={PROJECT_TYPES}
                value={wordCount}
                onValueChange={(val) => {
                  setWordCount(val);
                  if (errors.wordCount) setErrors((prev) => ({ ...prev, wordCount: "" }));
                }}
                error={errors.wordCount}
              />
            </div>

            {/* Deadline + Word Count / Pages - side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-gray-700">Deadline</label>
                <Select
                  placeholder="Select Deadline"
                  options={TIME_PERIODS}
                  value={timePeriod}
                  onValueChange={(val) => {
                    setTimePeriod(val);
                    if (errors.timePeriod) setErrors((prev) => ({ ...prev, timePeriod: "" }));
                  }}
                  error={errors.timePeriod}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-gray-700">Word Count / Pages</label>
                <Select
                  placeholder="1000 Words"
                  options={WORD_COUNTS}
                  value={wordCount}
                  onValueChange={(val) => {
                    setWordCount(val);
                    if (errors.wordCount) setErrors((prev) => ({ ...prev, wordCount: "" }));
                  }}
                  error={errors.wordCount}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-bold text-gray-700">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={errors.email}
              />
            </div>
          </>
        ) : (
          <>
            {/* Extended variant: original layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                error={errors.name}
              />
              <Input
                type="email"
                label="Email Address *"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={errors.email}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="tel"
                label="Mobile No *"
                placeholder="Enter mobile number"
                value={mobileNo}
                onChange={(e) => {
                  setMobileNo(e.target.value);
                  if (errors.mobileNo) setErrors((prev) => ({ ...prev, mobileNo: "" }));
                }}
                error={errors.mobileNo}
              />
              <Select
                label="Project Type *"
                placeholder="Select Project Type"
                options={PROJECT_TYPES}
                value={projectType}
                onValueChange={(val) => {
                  setProjectType(val);
                  if (errors.projectType) setErrors((prev) => ({ ...prev, projectType: "" }));
                }}
                error={errors.projectType}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Word Count *"
                placeholder="Select Word Count"
                options={WORD_COUNTS}
                value={wordCount}
                onValueChange={(val) => {
                  setWordCount(val);
                  if (errors.wordCount) setErrors((prev) => ({ ...prev, wordCount: "" }));
                }}
                error={errors.wordCount}
              />
              <Select
                label="Time Period *"
                placeholder="Select Time Period"
                options={TIME_PERIODS}
                value={timePeriod}
                onValueChange={(val) => {
                  setTimePeriod(val);
                  if (errors.timePeriod) setErrors((prev) => ({ ...prev, timePeriod: "" }));
                }}
                error={errors.timePeriod}
              />
            </div>

            <TextArea
              label="Additional Requirements"
              placeholder="Type your specific assignment instructions or specifications here..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={3}
            />
          </>
        )}

        {/* CTA Button — Orange gradient */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-[#E8590C] to-[#FF6B2B] hover:from-[#D94500] hover:to-[#E8590C] text-white text-[15px] font-bold rounded-lg shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              Get Price Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </>
          )}
        </button>
      </form>

      {/* Trust row */}
      <div className="flex items-center justify-between gap-x-2 flex-nowrap pt-2 px-1">
        <span className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wide shrink-0">
          <svg className="w-3 h-3 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          It&apos;s free
        </span>
        <span className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wide shrink-0">
          <svg className="w-3 h-3 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          No obligation
        </span>
        <span className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wide shrink-0">
          <svg className="w-3 h-3 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Quick response
        </span>
      </div>
    </div>
  );
};
QuoteForm.displayName = "QuoteForm";

