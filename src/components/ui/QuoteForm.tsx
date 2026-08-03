"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CustomDropdown } from "./CustomDropdown";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { dedupedFetch } from "@/lib/client-fetch";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

const COUNTRY_CODES = getCountries()
  .map((country) => {
    const code = getCountryCallingCode(country);
    const name = (en as any)[country] || country;
    return {
      label: `+${code} (${country === "GB" ? "UK" : name})`,
      value: `+${code}`,
      country,
    };
  })
  .sort((a, b) => {
    if (a.country === "GB") return -1;
    if (b.country === "GB") return 1;
    return a.label.localeCompare(b.label);
  });

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
  prefilledSubject,
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [apiServices, setApiServices] = useState<any[]>([]);
  const [apiUrgencies, setApiUrgencies] = useState<any[]>([]);
  const [apiSubjects, setApiSubjects] = useState<any[]>([]);
  const [apiWordCounts, setApiWordCounts] = useState<any[]>([]);
  const [apiBasePrice, setApiBasePrice] = useState<number>(0.03);
  const [apiDiscountPercent, setApiDiscountPercent] = useState<number>(40);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [servicesRes, urgenciesRes, subjectsRes, wcRes] = await Promise.all([
          dedupedFetch("/api/services"),
          dedupedFetch("/api/urgencies"),
          dedupedFetch("/api/subjects"),
          dedupedFetch("/api/word-count"),
        ]);

        if (servicesRes.ok) {
          const payload = await servicesRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiServices(payload.data);
          }
        }

        if (urgenciesRes.ok) {
          const payload = await urgenciesRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiUrgencies(payload.data);
          }
        }

        if (subjectsRes.ok) {
          const payload = await subjectsRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiSubjects(payload.data);
          }
        }

        if (wcRes.ok) {
          const payload = await wcRes.json();
          if (payload.success) {
            if (Array.isArray(payload.data)) setApiWordCounts(payload.data);
            if (payload.base_price_per_word) setApiBasePrice(Number(payload.base_price_per_word));
            if (payload.discount_percentage) setApiDiscountPercent(Number(payload.discount_percentage));
          }
        }
      } catch (err) {
        console.error("Error fetching configs in QuoteForm:", err);
      }
    };
    fetchConfigs();
  }, []);

  const finalProjectTypes = useMemo(() => {
    if (apiServices.length > 0) {
      return apiServices.map((s: any) => ({
        label: s.name,
        value: s.value || s.name
      }));
    }
    return projectTypeOptions;
  }, [apiServices, projectTypeOptions]);

  const finalTimePeriods = useMemo(() => {
    if (apiUrgencies.length > 0) {
      return apiUrgencies.map((u: any) => ({
        label: u.name,
        value: String(u.value)
      }));
    }
    return timePeriodOptions;
  }, [apiUrgencies, timePeriodOptions]);

  const finalSubjects = useMemo(() => {
    if (apiSubjects.length > 0) {
      return apiSubjects.map((sub: any) => ({
        label: sub.name,
        value: sub.value || sub.name
      }));
    }
    return [];
  }, [apiSubjects]);

  // Country Code -> ISO (Dynamic lookup across all world countries)
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
    setWordCount((prev) => prev + 250);
  };

  const handleDecrement = () => {
    setWordCount((prev) => Math.max(250, prev - 250));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const fullPhone = `${countryCode} ${mobileNo}`;
      const countryIso = getCountryIso(countryCode);

      const response = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: mobileNo,
          countryCode,
          countryIso,
          service: projectType || "Assignment",
          subject: prefilledSubject || "General",
          deadline: timePeriod.replace(/[^0-9]/g, "") || timePeriod || "5",
          wordCount: String(wordCount),
          description: description || "",
          source_page: typeof window !== "undefined" ? window.location.href : "https://www.assignmentinneed.co.uk/quote",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Quote submitted successfully!");
        setOrderId(data.order_id || "");
        setIsSuccess(true);
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className={`w-full max-w-[390px] bg-white rounded-2xl p-[1.5rem] border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative flex flex-col items-center justify-center text-center gap-4 font-sans ${className || ""}`}
        id="quote-form-success-card"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"
        >
          <CheckCircle2 className="w-7 h-7" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h3 className="text-base font-extrabold text-gray-900 leading-snug">
            Quote Submitted Successfully!
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[280px]">
            Thank you, <span className="font-bold text-[#3f159a]">{name}</span>. Your request is registered. Our coordinator will contact you shortly.
          </p>
        </motion.div>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-55 bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2 rounded-xl text-xs font-black select-all tracking-wider"
          >
            Order ID: <span className="font-extrabold text-emerald-600 font-mono">{orderId}</span>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setOrderId("");
            setName("");
            setEmail("");
            setMobileNo("");
            setProjectType("");
            setTimePeriod("");
            setWordCount(250);
            setDescription("");
          }}
          className="w-full mt-2 py-2 btn-shutter-blue-open text-xs font-bold rounded-lg cursor-pointer"
        >
          Submit Another Quote
        </motion.button>
      </div>
    );
  }

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
        <p className="text-[0.95rem] font-bold text-gray-900 m-0 mx-2 capitalize leading-snug whitespace-nowrap">
          {title}
        </p>
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
              options={finalProjectTypes}
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
                options={finalTimePeriods}
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
