"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomDropdown } from "./CustomDropdown";

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

export interface QuoteFormProps {
  title?: string;
  projectTypeOptions?: { label: string; value: string }[];
  timePeriodOptions?: { label: string; value: string }[];
  onSubmit?: (values: {
    name: string;
    email: string;
    mobileNo: string;
    projectType: string;
    timePeriod: string;
    wordCount: number;
    description: string;
  }) => void;
  className?: string;
  variant?: string;
  prefilledSubject?: string;
}

const DEFAULT_PROJECT_TYPES = [
  { label: "Assignment", value: "Assignment" },
  { label: "Essay", value: "Essay" },
  { label: "Dissertation", value: "Dissertation" },
  { label: "Thesis", value: "Thesis" },
  { label: "Research Project", value: "Research Project" },
  { label: "Case Study", value: "Case Study" },
  { label: "Report", value: "Report" },
  { label: "Coursework", value: "Coursework" },
  { label: "Proofreading", value: "Proofreading" },
  { label: "Editing & Formatting", value: "Editing & Formatting" },
];

const DEFAULT_TIME_PERIODS = [
  { label: "6 Hours", value: "6 Hours" },
  { label: "12 Hours", value: "12 Hours" },
  { label: "24 Hours", value: "24 Hours" },
  { label: "2 Days", value: "2 Days" },
  { label: "3 Days", value: "3 Days" },
  { label: "5 Days", value: "5 Days" },
  { label: "7 Days", value: "7 Days" },
  { label: "10+ Days", value: "10+ Days" },
];

export const QuoteForm: React.FC<QuoteFormProps> = ({
  title = "Get Instant Quote",
  projectTypeOptions = DEFAULT_PROJECT_TYPES,
  timePeriodOptions = DEFAULT_TIME_PERIODS,
  onSubmit,
  className,
}) => {
  const router = useRouter();

  // Controlled field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [projectType, setProjectType] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [wordCount, setWordCount] = useState(250);
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Input Sanitization Handlers (prevent special characters)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setName(val);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, "");
    setEmail(val);
  };

  const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setMobileNo(val);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const val = e.target.value.replace(/[<>\/?[\]{}|\\;:'"`~^+=*]/g, "");
    setDescription(val);
  };

  // Stepper handlers
  const handleIncrement = () => {
    setWordCount((prev) => Math.min(20000, prev + 250));
  };

  const handleDecrement = () => {
    setWordCount((prev) => Math.max(250, prev - 250));
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = `${countryCode} ${mobileNo}`;
    const formValues = {
      name,
      email,
      mobileNo: fullPhone,
      projectType,
      timePeriod,
      wordCount,
      description,
    };

    setIsLoading(true);

    if (onSubmit) {
      onSubmit(formValues);
      setIsLoading(false);
    } else {
      // Default fallback redirect behavior to order page
      const pages = Math.ceil(wordCount / 250);
      const searchParams = new URLSearchParams({
        name,
        email,
        phone: fullPhone,
        service: projectType,
        pages: String(pages),
        deadline: timePeriod,
        description,
      });
      router.push(`/order?${searchParams.toString()}`);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-[390px] bg-white rounded-2xl p-[1rem] md:p-[1.2rem_1.4rem] border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative flex flex-col gap-3 font-sans ${className || ""}`}
      id="quote-form-card"
    >
      {/* Sparkle Header with Colored Sparkles */}
      <div className="flex items-center justify-center gap-2 mb-0.5">
        <svg
          className="w-[14px] h-[14px] text-amber-500 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a1 1 0 0 1 .93.64l1.6 3.86 3.86 1.6a1 1 0 0 1 0 1.86l-3.86 1.6-1.6 3.86a1 1 0 0 1-1.86 0l-1.6-3.86-3.86-1.6a1 1 0 0 1 0-1.86l3.86-1.6 1.6-3.86A1 1 0 0 1 12 2z" />
        </svg>
        <h3 className="text-[0.95rem] font-bold text-gray-900 m-0 mx-2 capitalize leading-snug whitespace-nowrap">
          {title}
        </h3>
        <svg
          className="w-[14px] h-[14px] text-purple-500 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a1 1 0 0 1 .93.64l1.6 3.86 3.86 1.6a1 1 0 0 1 0 1.86l-3.86 1.6-1.6 3.86a1 1 0 0 1-1.86 0l-1.6-3.86-3.86-1.6a1 1 0 0 1 0-1.86l3.86-1.6 1.6-3.86A1 1 0 0 1 12 2z" />
        </svg>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Name Row */}
        <div className="flex items-center justify-between gap-3">
          <label className="text-[0.78rem] font-medium text-slate-700 m-0 whitespace-nowrap w-[90px] text-left">
            Name
          </label>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg py-1 px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-gray-300">
            <input
              type="text"
              required
              placeholder="Enter Name"
              value={name}
              onChange={handleNameChange}
              className="w-full border-none bg-transparent text-[0.72rem] text-slate-800 outline-none font-medium py-0.5 box-border placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Email Row */}
        <div className="flex items-center justify-between gap-3">
          <label className="text-[0.78rem] font-medium text-slate-700 m-0 whitespace-nowrap w-[90px] text-left">
            Email
          </label>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg py-1 px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-gray-300">
            <input
              type="email"
              required
              placeholder="Enter Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full border-none bg-transparent text-[0.72rem] text-slate-800 outline-none font-medium py-0.5 box-border placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Mobile No Row */}
        <div className="flex items-center justify-between gap-3">
          <label className="text-[0.78rem] font-medium text-slate-700 m-0 whitespace-nowrap w-[90px] text-left">
            Mobile No
          </label>
          <div className="flex-1 flex gap-1.5">
            <div className="w-[75px] bg-white border border-gray-200 rounded-lg py-1 px-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-gray-300 flex items-center">
              <CustomDropdown
                options={COUNTRY_CODES}
                value={countryCode}
                onChange={setCountryCode}
                align="left"
              />
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-lg py-1 px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-gray-300">
              <input
                type="tel"
                required
                placeholder="Enter Mobile"
                value={mobileNo}
                onChange={handleMobileNoChange}
                className="w-full border-none bg-transparent text-[0.72rem] text-slate-800 outline-none font-medium py-0.5 box-border placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Project Type Row */}
        <div className="flex items-center justify-between gap-3">
          <label className="text-[0.78rem] font-medium text-slate-700 m-0 whitespace-nowrap w-[90px] text-left">
            Project Type
          </label>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] relative flex items-center h-[30px] focus-within:border-gray-300">
            <CustomDropdown
              options={projectTypeOptions}
              value={projectType}
              onChange={setProjectType}
              placeholder="Select Project Type"
            />
          </div>
        </div>

        {/* Time Period + Word Count side-by-side columns */}
        <div className="grid grid-cols-2 gap-3 mt-0.5">
          {/* Time Period Column */}
          <div className="flex flex-col gap-1">
            <label className="text-[0.78rem] font-medium text-slate-700 text-left">
              Time Period
            </label>
            <div className="bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] relative flex items-center h-[34px] focus-within:border-gray-300">
              <CustomDropdown
                options={timePeriodOptions}
                value={timePeriod}
                onChange={setTimePeriod}
                placeholder="Select Deadline"
              />
            </div>
          </div>

          {/* Word Count Column */}
          <div className="flex flex-col gap-1">
            <label className="text-[0.78rem] font-medium text-slate-700 text-left">
              Word Count
            </label>
            <div className="bg-white border border-gray-200 rounded-lg flex items-center justify-between px-1.5 w-full h-[34px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              {/* Decrement Button */}
              <button
                type="button"
                onClick={handleDecrement}
                className="text-gray-500 font-extrabold text-[14px] w-5 h-5 flex items-center justify-center hover:text-gray-800 cursor-pointer active:scale-90 select-none outline-none border-none bg-transparent focus:outline-none focus:ring-0"
              >
                −
              </button>
              {/* Counter Display */}
              <span className="text-[0.72rem] font-medium text-gray-800 select-none whitespace-nowrap">
                {wordCount} Words
              </span>
              {/* Increment Button */}
              <button
                type="button"
                onClick={handleIncrement}
                className="text-gray-500 font-extrabold text-[14px] w-5 h-5 flex items-center justify-center hover:text-gray-800 cursor-pointer active:scale-90 select-none outline-none border-none bg-transparent focus:outline-none focus:ring-0"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1">
          <label className="text-[0.78rem] font-medium text-slate-700 text-left">
            Description
          </label>
          <textarea
            placeholder="Type your requirements here..."
            value={description}
            onChange={handleDescriptionChange}
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2.5 text-[0.72rem] text-slate-800 outline-none font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 focus-visible:ring-0 focus-visible:outline-none resize-none"
          />
        </div>

        {/* Orange Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 btn-shutter-orange-open text-white text-[0.78rem] font-bold rounded-lg shadow-[0_4px_14px_rgba(249,115,22,0.25)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>Get Price Now &rarr;</>
          )}
        </button>
      </form>

      {/* Trust Row */}
      <div className="flex justify-between items-center text-[0.65rem] text-gray-500 font-medium tracking-wide pt-0.5 px-0.5">
        <span className="flex items-center gap-1 shrink-0">
          <svg
            className="w-3.5 h-3.5 text-[#22c55e] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          It's free
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <svg
            className="w-3.5 h-3.5 text-[#22c55e] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          No obligation
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <svg
            className="w-3.5 h-3.5 text-[#22c55e] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Quick response
        </span>
      </div>
    </div>
  );
};
QuoteForm.displayName = "QuoteForm";
