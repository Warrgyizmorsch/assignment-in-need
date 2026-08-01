"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { toast } from "react-hot-toast";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";

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
import {
  Award,
  Clock,
  GraduationCap,
  Headset,
  ShieldCheck,
  FileText,
  UserCheck,
  RotateCw,
  Tag,
  Lock,
  ChevronDown,
  Quote,
  BadgeCheck,
  ShoppingCart,
  Zap,
  Coins,
  CheckCircle2,
} from "lucide-react";

export default function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
  const pricingScrollRef = useRef<HTMLDivElement>(null);
  const [activePricingIndex, setActivePricingIndex] = useState(0);

  const handlePricingScroll = () => {
    if (!pricingScrollRef.current) return;
    const { scrollLeft } = pricingScrollRef.current;
    const firstChild = pricingScrollRef.current.children[0] as HTMLElement;
    if (!firstChild) return;
    const cardWidth = firstChild.offsetWidth + 16;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx >= 0 && newIdx < testimonials.length) {
      setActivePricingIndex(newIdx);
    }
  };

  const scrollToPricingTestimonial = (idx: number) => {
    if (!pricingScrollRef.current) return;
    const firstChild = pricingScrollRef.current.children[0] as HTMLElement;
    if (!firstChild) return;
    const cardWidth = firstChild.offsetWidth + 16;
    pricingScrollRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: "smooth",
    });
    setActivePricingIndex(idx);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pricingScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = pricingScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          pricingScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const firstChild = pricingScrollRef.current.children[0] as HTMLElement;
          const step = firstChild ? firstChild.offsetWidth + 16 : 280;
          pricingScrollRef.current.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && Array.isArray(payload.data)) {
            const mapped = payload.data.map((sub: any) => ({
              label: sub.name,
              value: sub.value || sub.name
            }));
            setSubjectsOptions(mapped);
          }
        }
      } catch (e) {}
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-enquiry", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile: phone || "",
          country_code: countryCode,
          subject,
          inquiry_type: inquiryType,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Enquiry submitted successfully!");
        setIsSubmitted(true);
      } else {
        toast.error(data.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (error: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trustBadges = [
    {
      icon: <Award className="w-5 h-5 lg:w-6 lg:h-6" />,
      label: "100% Original\nWork",
    },
    {
      icon: <Clock className="w-5 h-5 lg:w-6 lg:h-6" />,
      label: "On-Time\nDelivery",
    },
    {
      icon: <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />,
      label: "Expert\nWriters",
    },
    {
      icon: <Headset className="w-5 h-5 lg:w-6 lg:h-6" />,
      label: "24/7\nSupport",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />,
      label: "Money Back\nGuarantee",
    },
  ];

  const whatsIncluded = [
    {
      icon: <FileText className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: "100% Original Content",
      desc: "Plagiarism-free content that is 100% original and authentic.",
    },
    {
      icon: <UserCheck className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: "Expert Writers",
      desc: "Top 1% academic writers with advanced degrees.",
    },
    {
      icon: <Clock className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: "On-Time Delivery",
      desc: "Timely delivery before your deadline, every time.",
    },
    {
      icon: <RotateCw className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: "Unlimited Revisions",
      desc: "Unlimited revisions until you are completely satisfied.",
    },
    {
      icon: <Headset className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: "24/7 Customer Support",
      desc: "Our support team is available 24/7 to assist you.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: "Money Back Guarantee",
      desc: "100% money back guarantee if you're not satisfied.",
    },
  ];

  const whyChooseUs = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Trusted by Thousands",
      desc: "Thousands of students across the UK and worldwide trust us for their academic needs.",
    },
    {
      icon: <Tag className="w-5 h-5" />,
      title: "Affordable Pricing",
      desc: "Get premium quality help at prices that fit your budget.",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Quality You Can Rely On",
      desc: "We follow strict quality control to deliver the best results.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Confidential & Secure",
      desc: "Your privacy and information are 100% protected with us.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The assignment was well-researched, perfectly written, and delivered on time. It helped me score an A+. Highly recommend!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Emma Taylor",
      university: "University of Manchester",
      stars: 5,
    },
    {
      quote:
        "Excellent work! The writer followed all instructions and provided original content. Will definitely use your services again.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Liam O'Connor",
      university: "University of Leeds",
      stars: 5,
    },
    {
      quote:
        "Amazing experience from start to finish. Support team was helpful and the quality of the work was outstanding!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Olivia Bennett",
      university: "King's College London",
      stars: 5,
    },
  ];

  const faqs = [
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      question: "Is the work you provide 100% original?",
      answer:
        "Yes, all assignments we deliver are 100% original and written from scratch by our experts. We also provide a free plagiarism report to guarantee uniqueness.",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      question: "How do I place an order?",
      answer:
        "You can place an order by filling out our quick order/quote form, specifying your requirements, academic level, and deadline, or you can directly chat with us for assistance.",
    },
    {
      icon: <RotateCw className="w-5 h-5" />,
      question: "Can I request revisions?",
      answer:
        "Absolutely! We offer unlimited free revisions within 14-30 days of delivery if the final document does not meet your initial requirements.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      question: "What if I need my order urgently?",
      answer:
        "No problem! We have express experts who can tackle urgent tasks and deliver high-quality assignments in as little as 3 to 6 hours.",
    },
    {
      icon: <Coins className="w-5 h-5" />,
      question: "Do you offer refunds?",
      answer:
        "Yes, we have a clear refund policy. If we fail to deliver within the deadline or if the work fails to meet acceptable academic standards, you can request a refund.",
    },
  ];

  return (
    <main className="w-full font-sans text-gray-800 bg-[#fbfcff]">
      {/* Breadcrumb row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-[15px] text-gray-500">
        Home <span className="mx-2">&gt;</span>{" "}
        <span className="text-gray-900">Pricing</span>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5 flex flex-col lg:flex-row gap-12 items-start justify-between">
        {/* Faded Background Image for Mobile */}
        <div
          className="absolute inset-0 z-0 lg:hidden pointer-events-none"
          style={{
            backgroundImage: "url('/new-pricingimg/hero.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.15,
          }}
        />

        {/* Hero Left Content */}
        <AnimateIn variant="fadeUp" className="lg:w-1/2 pt-4 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wide mb-6">
            <FileText className="w-4 h-4 text-purple-700" />
            Get Instant Quote
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Get The Perfect Help <br />
            <span className="text-purple-700">For Your Assignments</span>
          </h1>

          <p className="text-gray-600 text-base mb-8 max-w-lg">
            Fill out the form with your requirements and our academic experts
            will provide you with a tailored solution and price. No hidden
            charges, 100% transparency.
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-5 gap-2 lg:flex lg:flex-wrap lg:gap-8 mb-10">
            {trustBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm border border-gray-100 mb-1 lg:mb-2 text-base lg:text-2xl group-hover:bg-[#3F159A] group-hover:text-white group-hover:scale-110 group-hover:shadow-purple-200 transition-all duration-300">
                  {badge.icon}
                </div>
                <span className="text-[9px] lg:text-xs font-bold text-gray-900 leading-tight whitespace-pre-line">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* 3D Illustration asset */}
          <div className="hidden lg:block relative w-[75%] max-w-md mt-4 lg:-ml-4">
            <img
              src="/new-pricingimg/hero.png"
              alt="Pricing Assets"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </AnimateIn>

        {/* Hero Right Column Quote Form */}
        <AnimateIn
          variant="fadeUp"
          delay={0.2}
          id="quote-form"
          className="lg:w-1/2 w-full relative z-10 flex justify-center lg:justify-end items-start"
        >
          {isSubmitted ? (
            <div className="w-full max-w-[620px] p-8 md:p-10 rounded-[24px] border border-gray-150 bg-white shadow-[0_12px_42px_rgba(0,0,0,0.06)] text-center flex flex-col items-center justify-center gap-5 min-h-[450px]">
              <div className="w-16 h-16 rounded-full bg-[#e6fbf0] text-[#22c55e] flex items-center justify-center border border-green-50 shadow-sm mb-2 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-[900] text-[#0f1b3d] tracking-tight">
                Enquiry Sent!
              </h3>
              <p className="text-gray-500 text-sm md:text-[15px] font-bold max-w-sm leading-relaxed">
                Thank you, <span className="text-[#3f159a]">{name}</span>. Your
                enquiry request has been sent successfully. Our support desk
                will reach out to you shortly.
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
                className="mt-4 text-white"
              >
                Send Another Enquiry
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-[620px] p-6 md:p-8 rounded-[24px] border border-white bg-white shadow-[0_12px_42px_rgba(0,0,0,0.06)] relative flex flex-col justify-between">
              <div className="mb-6 text-left">
                <h3 className="text-[20px] text-[#0f1b3d] font-bold mb-2 tracking-tight font-heading">
                  Send Us an Enquiry
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full" />
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-4 text-left"
                id="placeOrder"
              >
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0f1b3d] uppercase tracking-wider block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-[10px] font-bold mt-0.5">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0f1b3d] uppercase tracking-wider block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-[10px] font-bold mt-0.5">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#0f1b3d] uppercase tracking-wider block">
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
                    <label className="text-xs font-semibold text-[#0f1b3d] uppercase tracking-wider block">
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
                    <label className="text-xs font-semibold text-[#0f1b3d] uppercase tracking-wider block">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <div className="hero-select-box relative w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3.5 flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-[#3f159a] transition-colors">
                      <CustomDropdown
                        options={INQUIRY_OPTIONS}
                        value={inquiryType}
                        onChange={(val) => {
                          setInquiryType(val);
                          if (errors.inquiryType)
                            setErrors((prev) => ({ ...prev, inquiryType: "" }));
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
                  <label className="text-xs font-semibold text-[#0f1b3d] uppercase tracking-wider block">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={handleMessageChange}
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3f159a] outline-none text-xs text-gray-800 transition-colors font-medium resize-none focus:ring-0 focus-visible:ring-0"
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
        </AnimateIn>
      </section>

      {/* What's Included Section */}
      <section className="bg-white py-12 md:py-16 border-t border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wide mb-4">
            <Award className="w-4 h-4 text-purple-700" />
            What&apos;s Included
          </div>
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-10 max-w-xl leading-snug">
            Everything You Get With Assignment In Need
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 w-full">
            {whatsIncluded.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#fbfcff] p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group lg:col-span-1"
              >
                <div className="flex items-center gap-3 mb-1 lg:mb-3">
                  <div className="w-12 h-12 flex-shrink-0 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center text-xl lg:text-2xl group-hover:bg-purple-700 group-hover:text-white transition-colors duration-300 group-hover:rotate-6">
                    {card.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm lg:text-[13px] xl:text-sm leading-tight">
                    {card.title}
                  </h4>
                </div>
                <div className="ml-[60px] lg:ml-0">
                  <p className="text-[11px] lg:text-xs text-gray-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 md:py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-5/12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide mb-4">
              <Award className="w-4 h-4 text-purple-700" />
              Why Students Choose Us
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-snug">
              Why Students <br />
              <span className="text-purple-700">Choose</span> <br />
              <span className="text-orange-500">Assignment In Need?</span>
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              We are committed to helping students achieve academic excellence
              by providing reliable, high-quality, and affordable assignment
              help.
            </p>
          </div>

          <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-4 lg:pl-1">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 group p-3 rounded-xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm text-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Success Stories) Section */}
      <section className="bg-white py-12 md:py-16 border-t border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wide mb-4">
              Student Success Stories
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-snug">
              See What Our Students Have To Say
            </h2>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold text-purple-800">4.8/5</span>
              <span className="text-yellow-400 text-xl mb-1">★★★★★</span>
            </div>
            <p className="text-[15px] text-gray-500 font-medium">
              Based on 2,500+ Reviews
            </p>
          </div>

          <div className="lg:w-3/4 w-full">
            <TestimonialCarousel
              testimonials={testimonials.map((t) => ({
                name: t.name,
                institution: t.university,
                quote: t.quote,
                rating: 5,
                avatar: t.avatar,
              }))}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide mb-4">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-snug">
              Find Answers To{" "}
              <span className="text-purple-700">Common Questions</span>
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
              If you have any other questions, feel free to contact our support
              team.
            </p>
            <Link
              href="/contact"
              className="btn-shutter-blue-close inline-flex items-center justify-center font-bold px-6 py-3 rounded-lg text-sm cursor-pointer"
            >
              Contact Us &rarr;
            </Link>
          </div>

          <div className="lg:w-2/3 w-full space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group hover:-translate-y-1"
                >
                  <div
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex items-center justify-between p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 group-hover:rotate-12">
                        {faq.icon}
                      </div>
                      <span className="font-bold text-gray-900 text-sm md:text-base group-hover:text-purple-700 transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="bg-[#240e60] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img
              src="/new-pricingimg/barimg.png"
              alt="Graduation Cap on Books"
              className="w-20 md:w-24 h-auto object-contain drop-shadow-md"
            />
            <div>
              <h2 className="text-white text-xl md:text-2xl font-bold mb-1">
                Ready To Get Started?
              </h2>
              <p className="text-purple-200 text-xs md:text-sm">
                Fill out the form above and get a customized quote for your
                assignment.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex-shrink-0">
            <a
              href="#quote-form"
              className="btn-shutter-orange-open text-white font-bold py-2.5 px-6 rounded text-sm inline-flex items-center gap-2 transition-colors shadow-md cursor-pointer border-none"
            >
              Get Instant Quote &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Custom Stylesheet for Select Box arrows and custom focus styles matching HeroSection.tsx */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hero-select-box select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 14px;
          padding-right: 16px;
        }
        #placeOrder input:focus,
        #placeOrder select:focus,
        #placeOrder textarea:focus,
        #placeOrder input:focus-visible,
        #placeOrder select:focus-visible,
        #placeOrder textarea:focus-visible,
        #placeOrder input:active,
        #placeOrder select:active {
          outline: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
      `,
        }}
      />
    </main>
  );
}
