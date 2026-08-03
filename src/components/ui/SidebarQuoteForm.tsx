"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import {
  CheckCircle2,
  User,
  Mail,
  Calendar,
  Phone,
  BookOpen,
  PenTool,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { dedupedFetch } from "@/lib/client-fetch";

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

const DEADLINE_OPTIONS = [
  { label: "6 Hours", value: "6h" },
  { label: "12 Hours", value: "12h" },
  { label: "24 Hours", value: "24h" },
  { label: "2 Days", value: "2d" },
  { label: "3 Days", value: "3d" },
  { label: "5 Days", value: "5d" },
  { label: "7 Days", value: "7d" },
  { label: "10+ Days", value: "10d" },
];

const SERVICE_OPTIONS = [
  { label: "Assignment Writing", value: "assignment" },
  { label: "Essay Writing", value: "essay" },
  { label: "Dissertation Writing", value: "dissertation" },
  { label: "Coursework Writing", value: "coursework" },
  { label: "Case Study Writing", value: "case-study" },
  { label: "Report Writing", value: "report" },
];

interface SidebarQuoteFormProps {
  sourceName?: string;
}

export function SidebarQuoteForm({ sourceName = "Blog Page" }: SidebarQuoteFormProps) {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [service, setService] = useState("");
  const [subject, setSubject] = useState("");
  const [pages, setPages] = useState(1);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [subjectsOptions, setSubjectsOptions] = useState<any[]>([]);
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [apiUrgencies, setApiUrgencies] = useState<any[]>([]);
  const [orderId, setOrderId] = useState("");

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

  const [apiWordCounts, setApiWordCounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppConfigs = async () => {
      try {
        const [servicesRes, urgRes, subRes, wcRes] = await Promise.all([
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

        if (urgRes.ok) {
          const payload = await urgRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiUrgencies(payload.data);
          }
        }

        if (subRes.ok) {
          const payload = await subRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            const mapped = payload.data.map((sub: any) => ({
              label: sub.name,
              value: sub.value || sub.name
            }));
            setSubjectsOptions(mapped);
          }
        }

        if (wcRes.ok) {
          const payload = await wcRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiWordCounts(payload.data);
          }
        }
      } catch (err) {
        console.error("Error fetching configurations for sidebar form:", err);
      }
    };

    fetchAppConfigs();
  }, []);

  const dynamicServicesOptions = useMemo(() => {
    if (apiServices.length > 0) {
      return apiServices.map((s: any) => ({
        label: s.name,
        value: s.value || s.name
      }));
    }
    return SERVICE_OPTIONS;
  }, [apiServices]);

  const dynamicDeadlineOptions = useMemo(() => {
    if (apiUrgencies.length > 0) {
      return apiUrgencies.map((u: any) => ({
        label: u.name,
        value: String(u.value)
      }));
    }
    return DEADLINE_OPTIONS;
  }, [apiUrgencies]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!service) newErrors.service = "Service is required";
    if (!deadline) newErrors.deadline = "Deadline is required";
    if (!agree) newErrors.agree = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const countryIso = getCountryIso(countryCode);
      const cleanedDeadline = deadline.replace(/[^0-9]/g, "") || deadline || "5";

      const response = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          countryCode,
          countryIso,
          service: service || "Assignment",
          subject: subject || "General",
          deadline: cleanedDeadline,
          wordCount: String(pages * 250),
          description: `Quote request from ${sourceName}`,
          source_page: typeof window !== "undefined" ? window.location.href : "https://www.assignmentinneed.co.uk/blog",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Quote submitted successfully!");
        setOrderId(data.order_id || "");
        setIsSubmitted(true);
      } else {
        toast.error(data.message || "Failed to submit quote. Please try again.");
      }
    } catch (error: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setDeadline("");
    setPhone("");
    setCountryCode("+44");
    setService("");
    setSubject("");
    setPages(1);
    setAgree(false);
    setErrors({});
    setOrderId("");
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 md:p-7 text-left">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary-700 leading-tight">
          Get Free Assignment Quote Instantly
        </h3>
        <div className="w-12 h-1 bg-gradient-logo rounded-full mx-auto mt-2.5" />
      </div>

      {isSubmitted ? (
        <div className="text-center py-10 flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success mb-2 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-text-heading">
            Quote Request Sent!
          </h4>
          <p className="text-xs text-text-body max-w-xs leading-relaxed">
            We have received your requirements. One of our academic
            writers will contact you shortly with a custom price
            estimation.
          </p>
          {orderId && (
            <div className="bg-success/5 text-success border border-success/20 px-4 py-2 rounded-xl text-xs font-black select-all tracking-wider">
              Order ID: <span className="font-extrabold text-success font-mono">{orderId}</span>
            </div>
          )}
          <button
            onClick={handleResetForm}
            className="btn-shutter-blue-open mt-4 font-semibold text-xs px-5 py-2.5 rounded-full cursor-pointer"
          >
            Request Another Quote
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            {errors.name && (
              <span className="text-[10px] text-red-500 mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value.replace(
                      /[^a-zA-Z0-9@._+-]/g,
                      "",
                    ),
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-500 mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          {/* Deadline */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Deadline
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-text-heading focus-within:border-primary-500 focus-within:bg-white transition-all h-[38px] flex items-center">
                <CustomDropdown
                  options={dynamicDeadlineOptions}
                  value={deadline}
                  onChange={setDeadline}
                  placeholder="Select deadline"
                />
              </div>
            </div>
            {errors.deadline && (
              <span className="text-[10px] text-red-500 mt-1 block">
                {errors.deadline}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Phone number
            </label>
            <div className="flex gap-2">
              <div className="relative shrink-0 w-[95px] bg-slate-50 border border-slate-200 rounded-xl px-2 flex items-center h-[38px]">
                <CustomDropdown
                  options={COUNTRY_CODES}
                  value={countryCode}
                  onChange={setCountryCode}
                  align="left"
                />
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-text-heading outline-none focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            {errors.phone && (
              <span className="text-[10px] text-red-500 mt-1 block">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Service */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Service
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-text-heading focus-within:border-primary-500 focus-within:bg-white transition-all h-[38px] flex items-center">
                <CustomDropdown
                  options={dynamicServicesOptions}
                  value={service}
                  onChange={setService}
                  placeholder="Select service"
                />
              </div>
            </div>
            {errors.service && (
              <span className="text-[10px] text-red-500 mt-1 block">
                {errors.service}
              </span>
            )}
          </div>

          {/* Subject */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Subject
            </label>
            <div className="relative">
              <PenTool className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-text-heading focus-within:border-primary-500 focus-within:bg-white transition-all h-[38px] flex items-center">
                <CustomDropdown
                  options={subjectsOptions.length > 0 ? subjectsOptions : [
                    { label: "Matlab", value: "Matlab" },
                    { label: "Data Science", value: "Data Science" },
                    { label: "Engineering", value: "Engineering" },
                    { label: "App Development", value: "App Development" },
                    { label: "Web Development", value: "Web Development" },
                    { label: "Exam", value: "Exam" },
                    { label: "Public Health", value: "Public Health" },
                    { label: "Presentation (PPT)", value: "Presentation" },
                    { label: "Portfolio", value: "Portfolio" },
                    { label: "Research Report", value: "Research Report" },
                    { label: "Business Management", value: "Business Management" },
                    { label: "Project Management", value: "Project Management" },
                    { label: "Essay", value: "Essay" },
                    { label: "HRM", value: "HRM" },
                    { label: "Economic", value: "Economic" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={subject}
                  onChange={setSubject}
                  placeholder="Select subject"
                />
              </div>
            </div>
          </div>

          {/* Pages Counter */}
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-600 mb-1 block">
              Pages
            </label>
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-2 py-1 bg-slate-50 select-none">
              <button
                type="button"
                onClick={() => pages > 1 && setPages(pages - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-gray-700 hover:bg-slate-100 hover:text-primary-700 active:scale-95 transition-all"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-semibold text-text-heading">
                {pages} {pages === 1 ? "Page" : "Pages"}{" "}
                <span className="text-[10px] text-text-muted font-medium">
                  ({pages * 250} words)
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPages(pages + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-gray-700 hover:bg-slate-100 hover:text-primary-700 active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* T&C Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="agree-form"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-primary-700 focus:ring-primary-500 w-3.5 h-3.5 cursor-pointer"
            />
            <label
              htmlFor="agree-form"
              className="text-[10px] text-text-body leading-tight select-none cursor-pointer"
            >
              I agree with{" "}
              <Link
                href="/privacy-policy"
                className="text-primary-700 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              &{" "}
              <Link
                href="/terms"
                className="text-primary-700 hover:underline"
              >
                T&C
              </Link>
              .
            </label>
          </div>
          {errors.agree && (
            <span className="text-[10px] text-red-500 block">
              {errors.agree}
            </span>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agree}
            className="btn-shutter-orange-open w-full text-white font-bold rounded-xl py-3 text-xs transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating price...
              </>
            ) : (
              "Chat with experts now"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
