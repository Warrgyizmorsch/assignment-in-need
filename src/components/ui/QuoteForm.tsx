"use client";

import React, { useState } from "react";
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

  return (
    <div className={cn("bg-white rounded-card shadow-card border border-primary-100/50 p-6 md:p-8 flex flex-col gap-6", className)} id="quote-form">
      <div>
        <Heading level={3} className="text-xl md:text-2xl leading-tight flex items-center gap-1.5">
          {title}
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-600 animate-ping" />
        </Heading>
        <div className="w-12 h-1 bg-gradient-logo rounded-full mt-2" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {variant === "extended" && (
          <TextArea
            label="Additional Requirements"
            placeholder="Type your specific assignment instructions or specifications here..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={3}
          />
        )}

        <Button
          type="submit"
          variant="cta"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-2 text-white"
        >
          {variant === "extended" ? "Get Instant Quote" : "Get Price Now"}
        </Button>
      </form>


      {/* Trust row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary-100/50 pt-4 mt-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-success">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
          </svg>
          It&apos;s free
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-success">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
          </svg>
          No obligation
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-success">
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
          </svg>
          Quick response
        </span>
      </div>
    </div>
  );
};
QuoteForm.displayName = "QuoteForm";
