"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CustomDropdown } from "@/components/ui/CustomDropdown";

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
import {
  Mail,
  MapPin,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [subject, setSubject] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [subjectsOptions, setSubjectsOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/admin/subjects");
        if (res.ok) {
          const payload = await res.json();
          if ((payload.success || payload.status === "success") && Array.isArray(payload.data)) {
            const mapped = payload.data.map((sub: any) => {
              const cleanSlug = (sub.slug || "").replace(/^\/+/, "");
              const finalSlug = cleanSlug.startsWith("subject/") ? cleanSlug.replace("subject/", "") : cleanSlug;
              const humanized = finalSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
              const label = sub.title?.split(" Help")[0]?.split(" Assignment")[0] || humanized;
              return { label, value: finalSlug };
            });
            setSubjectsOptions(mapped);
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchSubjects();
  }, []);

  const SUBJECT_OPTIONS = [
    { label: "Accounting", value: "accounting" },
    { label: "Business Management", value: "business" },
    { label: "Law", value: "law" },
    { label: "Nursing", value: "nursing" },
    { label: "Engineering", value: "engineering" },
    { label: "Other", value: "other" },
  ];

  const INQUIRY_OPTIONS = [
    { label: "General Enquiry", value: "general" },
    { label: "Assignment Pricing", value: "pricing" },
    { label: "Writer Matching", value: "matching" },
    { label: "Revision Request", value: "revision" },
    { label: "Refund / Guarantee Check", value: "refund" },
  ];

  // Regex validations matching Laravel filters
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setName(val);
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, "");
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setPhone(val);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.replace(/[<>\/?[\]{}|\\;:'"`~^+=*]/g, "");
    setMessage(val);
    if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full Name is required";

    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!subject) newErrors.subject = "Subject is required";
    if (!inquiryType) newErrors.inquiryType = "Inquiry type is required";
    if (!message.trim()) newErrors.message = "Message details are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate contact form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const whatsappSvg = (
    <svg
      viewBox="0 0 24 24"
      className="fill-current text-[#25d366]"
      style={{ width: "13px", height: "13px" }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );

  return (
    <div className="font-sans text-[#111827] bg-[#fdfcff] overflow-hidden">
      {/* 3.1 BREADCRUMB + HEADER */}
      <section className="bg-white border-b border-gray-100 py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1250px] mx-auto text-left">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-[#3f159a] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-550">Contact Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
            {/* Left Column: Intro + Contact Methods */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left w-full">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-[#3f159a] text-[10px] font-extrabold uppercase tracking-widest w-fit mb-1">
                💬 Get In Touch
              </div>

              {/* Title */}
              <h1 className="text-[34px] sm:text-[40px] font-[900] leading-[1.1] text-[#0f1b3d] tracking-tight">
                We're Here to Help You
                <span className="bg-gradient-to-r from-[#ea580c] to-[#3f159a] bg-clip-text text-transparent block mt-2">
                  Anytime, Anywhere!
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-[13px] text-gray-500 font-bold leading-relaxed max-w-[480px]">
                Have a question or need assistance with your assignment? Fill
                out the form, and our support team will get back to you as soon
                as possible.
              </p>

              {/* Section Header */}
              <div className="mt-4">
                <h2 className="text-[14px] font-[900] text-[#0f1b3d] tracking-tight mb-3 uppercase border-b border-gray-150 pb-2">
                  In Case of Enquiry, Reach Us On
                </h2>

                <div className="flex flex-col gap-4">
                  {/* WhatsApp Card */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-[48px] h-[48px] rounded-[14px] bg-[#e6fbf0] flex items-center justify-center shrink-0 border border-green-50 shadow-sm">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[28px] h-[28px] fill-current text-[#25d366]"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      </div>
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-[#0f1b3d] mb-0.5 font-heading">
                          WhatsApp Support
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed font-bold">
                          Chat with us on WhatsApp for instant assistance 24/7.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="https://wa.me/447300640066"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0"
                    >
                      <Button
                        variant="blueClose"
                        size="sm"
                        className="text-[10px] font-extrabold uppercase tracking-wider h-[38px] w-full sm:w-auto whitespace-nowrap shrink-0"
                        icon={whatsappSvg}
                      >
                        Chat Now
                      </Button>
                    </Link>
                  </div>

                  {/* Phone Card */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-[48px] h-[48px] rounded-[14px] bg-[#f4f2ff] text-[#3f159a] flex items-center justify-center shrink-0 border border-purple-50 shadow-sm">
                        <PhoneCall className="w-5 h-5 text-[#3f159a]" />
                      </div>
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-[#0f1b3d] mb-0.5 font-heading">
                          Phone Support
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed font-bold">
                          Speak to our experts anytime. We're here to help!
                        </p>
                      </div>
                    </div>
                    <Link
                      href="tel:+447300640066"
                      className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0"
                    >
                      <Button
                        variant="blueClose"
                        size="sm"
                        className="font-extrabold text-[10px] uppercase tracking-wider h-[38px] w-full sm:w-auto whitespace-nowrap shrink-0"
                      >
                        +44 7300 640066
                      </Button>
                    </Link>
                  </div>

                  {/* Email Card */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-[48px] h-[48px] rounded-[14px] bg-[#fff2ea] text-[#ea580c] flex items-center justify-center shrink-0 border border-orange-50 shadow-sm">
                        <Mail className="w-5 h-5 text-[#ea580c]" />
                      </div>
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-[#0f1b3d] mb-0.5 font-heading">
                          Email Support
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed font-bold">
                          Drop us an email and we'll get back to you soon.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="mailto:support@assignmentinneed.com"
                      className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0"
                    >
                      <Button
                        variant="orangeClose"
                        size="sm"
                        className="font-extrabold text-[10px] lowercase tracking-wider h-[38px] w-full sm:w-auto whitespace-nowrap shrink-0"
                      >
                        support@assignmentinneed.com
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Connection Row */}
              <div className="flex flex-col gap-3 text-left mt-2">
                <h2 className="text-[14px] font-[900] text-[#0f1b3d] tracking-tight mb-2 uppercase border-b border-gray-150 pb-2">
                  Connect With Us
                </h2>
                <div className="flex items-center gap-3">
                  {[
                    {
                      name: "Facebook",
                      bg: "bg-[#1877F2] text-white",
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[18px] h-[18px] fill-current text-white"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                      url: "https://facebook.com/assignmentinneed",
                    },
                    {
                      name: "Twitter",
                      bg: "bg-black text-white",
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[14px] h-[14px] fill-current text-white"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                      url: "https://twitter.com/assignmentinneed",
                    },
                    {
                      name: "LinkedIn",
                      bg: "bg-[#0A66C2] text-white",
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[16px] h-[16px] fill-current text-white"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                      url: "https://linkedin.com/company/assignmentinneed",
                    },
                    {
                      name: "Instagram",
                      bg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
                      icon: (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[18px] h-[18px] fill-none stroke-current stroke-2 text-white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      ),
                      url: "https://instagram.com/assignmentinneed",
                    },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md ${s.bg}`}
                      aria-label={`Visit our ${s.name}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Enquiry Form Card */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end items-start w-full">
              {isSubmitted ? (
                <div className="w-full max-w-[620px] p-8 md:p-10 rounded-[24px] border border-gray-150 bg-white shadow-[0_12px_42px_rgba(0,0,0,0.06)] text-center flex flex-col items-center justify-center gap-5 min-h-[450px]">
                  <div className="w-16 h-16 rounded-full bg-[#e6fbf0] text-[#22c55e] flex items-center justify-center border border-green-50 shadow-sm mb-2 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-[900] text-[#0f1b3d] tracking-tight">
                    Enquiry Sent!
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm font-bold max-w-sm leading-relaxed">
                    Thank you, <span className="text-[#3f159a]">{name}</span>.
                    Your enquiry request has been sent successfully. Our support
                    desk will reach out to you shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setSubject("");
                      setInquiryType("");
                      setMessage("");
                    }}
                    variant="blueOpen"
                    size="sm"
                    className="mt-4"
                  >
                    Send Another Enquiry
                  </Button>
                </div>
              ) : (
                <div className="w-full max-w-[620px] p-6 md:p-8 rounded-[24px] border border-white bg-white shadow-[0_12px_42px_rgba(0,0,0,0.06)] relative flex flex-col justify-between">
                  <div className="mb-6 text-left">
                    <p className="text-[20px] text-[#0f1b3d] font-[900] mb-2 tracking-tight font-heading">
                      Send Us an Enquiry
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full" />
                  </div>

                  <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col gap-4 text-left"
                    id="placeOrder"
                  >
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-[#0f1b3d] uppercase tracking-wider block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium"
                      />
                      {errors.name && (
                        <span className="text-red-500 text-[10px] font-bold mt-0.5">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-[#0f1b3d] uppercase tracking-wider block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-[10px] font-bold mt-0.5">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-[#0f1b3d] uppercase tracking-wider block">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <div className="relative shrink-0 w-[100px] border border-gray-200 bg-gray-50 rounded-xl px-2 flex items-center h-11">
                          <CustomDropdown
                            options={COUNTRY_CODES}
                            value={countryCode}
                            onChange={setCountryCode}
                            align="left"
                          />
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="flex-grow h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                        />
                      </div>
                    </div>

                    {/* Subject + Inquiry Type Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Subject */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-[#0f1b3d] uppercase tracking-wider block">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <div className="hero-select-box relative w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3.5 flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-[#3f159a] transition-colors">
                          <CustomDropdown
                            options={subjectsOptions.length > 0 ? subjectsOptions : SUBJECT_OPTIONS}
                            value={subject}
                            onChange={(val) => {
                              setSubject(val);
                              if (errors.subject)
                                setErrors((prev) => ({ ...prev, subject: "" }));
                            }}
                            placeholder="Select a subject"
                          />
                        </div>
                        {errors.subject && (
                          <span className="text-red-500 text-[10px] font-bold mt-0.5">
                            {errors.subject}
                          </span>
                        )}
                      </div>

                      {/* Inquiry Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-[#0f1b3d] uppercase tracking-wider block">
                          Inquiry Type <span className="text-red-500">*</span>
                        </label>
                        <div className="hero-select-box relative w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3.5 flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-[#3f159a] transition-colors">
                          <CustomDropdown
                            options={INQUIRY_OPTIONS}
                            value={inquiryType}
                            onChange={(val) => {
                              setInquiryType(val);
                              if (errors.inquiryType)
                                setErrors((prev) => ({
                                  ...prev,
                                  inquiryType: "",
                                }));
                            }}
                            placeholder="Select inquiry type"
                          />
                        </div>
                        {errors.inquiryType && (
                          <span className="text-red-500 text-[10px] font-bold mt-0.5">
                            {errors.inquiryType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-[#0f1b3d] uppercase tracking-wider block">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Type your message here..."
                        value={message}
                        onChange={handleMessageChange}
                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium resize-none"
                      />
                      {errors.message && (
                        <span className="text-red-500 text-[10px] font-bold mt-0.5">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="blueOpen"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                      className="mt-2 text-white"
                      icon={true}
                    >
                      Send Message
                    </Button>

                    {/* Reassurance text */}
                    <span className="flex items-center gap-1.5 justify-center text-[10px] font-bold text-gray-400 mt-2">
                      <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                      Your information is 100% secure and confidential.
                    </span>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3.4 "OUR LOCATION" MAP SECTION */}
      <section className="py-8 bg-[#faf9fe]">
        <div className="max-w-[1250px] mx-auto px-4 text-center">
          <p className="text-[24px] md:text-[32px] font-[900] text-[#0f1b3d] mb-3 tracking-tight font-heading">
            Our Location
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full mx-auto mb-8" />

          <div className="relative w-full h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-gray-150">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2482.7214691459424!2d-0.14640108422964645!3d51.51834297963695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1680000000000"
              className="w-full h-full border-none outline-none"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map London Office Location"
            />

            {/* Custom Marker Pin */}
            <div className="absolute left-[calc(50%-22px)] top-[calc(50%-45px)] pointer-events-auto z-10 animate-bounce">
              <a
                href="https://www.google.com/maps/dir//77+Great+Portland+St,+London+W1W+6PQ,+UK"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="#3f159a"
                  className="w-[45px] h-[45px]"
                  style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {/* Pin Tooltip */}
                <div className="absolute bottom-[48px] left-[50%] -translate-x-[50%] bg-[#0f1b3d] text-white text-[10px] font-bold p-2.5 rounded-lg whitespace-nowrap opacity-95 transition shadow-md pointer-events-none group-hover:opacity-100">
                  Assignment In Need
                  <span className="block text-[8px] font-medium text-purple-200 mt-0.5">
                    77 Great Portland Street, London, W1W 6PQ, UK
                  </span>
                </div>
              </a>
            </div>

            {/* Address Overlay Card (Overlaid on desktop, stacked inside view on mobile) */}
            <div className="absolute bottom-4 left-4 right-4 md:right-auto max-w-[340px] bg-white border border-gray-150 p-4 rounded-2xl shadow-xl flex gap-3 items-start z-20 text-left backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-[#3f159a] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <span className="font-heading font-extrabold text-xs text-[#0f1b3d]">
                  Assignment In Need
                </span>
                <span className="text-[11px] text-gray-500 font-bold leading-relaxed">
                  77 Great Portland Street, London, W1W 6PQ, UK
                </span>
                <a
                  href="https://www.google.com/maps/dir//77+Great+Portland+St,+London+W1W+6PQ,+UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-extrabold text-[#3f159a] hover:text-[#2b0c61] transition flex items-center gap-1 uppercase tracking-wider"
                >
                  Get Directions &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Stylesheet for Select Box arrows and custom focus styles matching HeroSection.tsx */}
      <style>{`
        .hero-select-box select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 14px;
          padding-right: 16px;
        }
        #placeOrder input:focus,
        #placeOrder select:focus,
        #placeOrder input:focus-visible,
        #placeOrder select:focus-visible,
        #placeOrder input:active,
        #placeOrder select:active {
          outline: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
