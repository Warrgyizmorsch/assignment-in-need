"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

const PROJECT_TYPE_OPTIONS = [
  { label: "Assignment", value: "Assignment" },
  { label: "Dissertation", value: "Dissertation" },
  { label: "Thesis", value: "Thesis" },
  { label: "Research Project", value: "Research Project" },
];

const WORD_COUNT_OPTIONS = [
  { label: "250 Words / 1 Page", value: "250" },
  { label: "500 Words / 2 Pages", value: "500" },
  { label: "1000 Words / 4 Pages", value: "1000" },
  { label: "1500 Words / 6 Pages", value: "1500" },
  { label: "2000 Words / 8 Pages", value: "2000" },
  { label: "2500 Words / 10 Pages", value: "2500" },
  { label: "3000 Words / 12 Pages", value: "3000" },
  { label: "4000 Words / 16 Pages", value: "4000" },
  { label: "5000+ Words", value: "5000" },
];

const TIME_PERIOD_OPTIONS = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((d) => ({
    label: `${d} Day${d > 1 ? "s" : ""}`,
    value: String(d),
  })),
  { label: "16-20 Days", value: "16 to 20" },
  { label: "21+ Days", value: "21+" },
];
import { SUBJECTS } from "@/lib/data";
import {
  Star,
  ShieldCheck,
  Award,
  Clock,
  Users,
  ChevronRight,
  ArrowRight,
  FileText,
  CheckCircle2,
  ChevronDown,
  Gift,
  FileSignature,
  FileCheck2,
  RefreshCw,
  BookOpen,
  Headset,
  AlignLeft,
  ChevronLeft,
  GraduationCap,
  Network,
  PaintRoller,
} from "lucide-react";

export default function SubjectLanding() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find current subject or default to Accounting
  const subject = SUBJECTS.find((s) => s.slug === slug) || SUBJECTS[0];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [projectType, setProjectType] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [timePeriod, setTimePeriod] = useState("");

  // Dynamic States for API data
  const [pageData, setPageData] = useState<any>(null);
  const [expertsList, setExpertsList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Map backend helper to match Writer model
  const mapExpertToWriterLocal = (expert: any) => {
    const writerName = expert.name || "Academic Expert";
    const isDrOrProf = writerName.includes("Dr.") || writerName.includes("Prof.");
    const calculatedQualifications = isDrOrProf ? "Ph.D. Qualified" : "Master's Qualified";
    let calculatedExperience = "5+ Years";
    const finishOrder = parseInt(expert.finish_order) || 0;
    if (finishOrder > 2000) calculatedExperience = "8+ Years";
    else if (finishOrder > 1000) calculatedExperience = "7+ Years";
    else if (finishOrder > 500) calculatedExperience = "6+ Years";

    let calculatedRating = 4.8;
    if (expert.customer_review) {
      try {
        const reviewsArray = typeof expert.customer_review === "string" 
          ? JSON.parse(expert.customer_review) 
          : expert.customer_review;
        if (Array.isArray(reviewsArray) && reviewsArray.length > 0) {
          const ratings = reviewsArray.map((r: any) => parseFloat(r.rating) || 5).filter(Boolean);
          if (ratings.length > 0) {
            calculatedRating = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
          }
        }
      } catch (e) {}
    }
    
    // Get image
    let avatarUrl = "";
    if (expert.image) {
      avatarUrl = expert.image.startsWith("http") ? expert.image : `https://ain.warrgyizmorsch.com/${expert.image.startsWith("/") ? expert.image : `/${expert.image}`}`;
    } else {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(writerName)}&background=f3e8ff&color=6b21a8`;
    }

    const hasRealImage = expert.image && !expert.image.includes("blank.png") && !expert.image.includes("ui-avatars.com");
    const finalImg = hasRealImage ? avatarUrl : "/assets/media/avatars/blank.png";

    return {
      name: writerName,
      role: expert.subject ? `${expert.subject} Expert` : `${subject.name} Expert`,
      qual: calculatedQualifications,
      exp: calculatedExperience,
      rating: parseFloat(calculatedRating.toFixed(1)),
      orders: `${finishOrder > 0 ? finishOrder : 1200}+`,
      img: finalImg
    };
  };

  useEffect(() => {
    const fetchSubjectPage = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/subjects?slug=${slug}`);
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && payload.data && payload.data.page) {
            setPageData(payload.data.page);
            if (Array.isArray(payload.data.experts) && payload.data.experts.length > 0) {
              const mapped = payload.data.experts.map(mapExpertToWriterLocal);
              setExpertsList(mapped);
            }
            if (Array.isArray(payload.data.reviews) && payload.data.reviews.length > 0) {
              const mapped = payload.data.reviews.map((item: any) => ({
                name: item.name,
                uni: item.location || "UK University",
                text: item.description,
                img: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f3e8ff&color=6b21a8`
              }));
              setReviewsList(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch subject page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectPage();
  }, [slug]);

  useEffect(() => {
    if (pageData && pageData.meta_title) {
      document.title = pageData.meta_title;
    }
  }, [pageData]);

  // Fallbacks if backend data is loading / empty
  const pageTitle = pageData?.hero_heading || `Expert ${subject.name} Assignment Help`;
  const pageHighlight = pageData?.hero_highlight || "You Can Rely On";

  // Generate subject-specific experts
  const defaultExperts = [
    {
      name: "Emma Taylor",
      role: `${subject.name} Expert`,
      qual:
        subject.slug === "accounting"
          ? "MSc Accounting & Finance"
          : `MSc in ${subject.name}`,
      exp: "8+ Years Exp.",
      rating: 4.9,
      orders: "1200+",
      img: "/images/resource/team-1.jpg",
    },
    {
      name: "Daniel Harris",
      role: `${subject.name} Expert`,
      qual:
        subject.slug === "accounting"
          ? "ACCA, MBA"
          : `MBA, ${subject.name} Specialist`,
      exp: "10+ Years Exp.",
      rating: 4.9,
      orders: "1900+",
      img: "/images/resource/team-2.jpg",
    },
    {
      name: "Sophia Martinez",
      role: `${subject.name} Expert`,
      qual:
        subject.slug === "accounting"
          ? "PhD Accounting"
          : `PhD in ${subject.name}`,
      exp: "7+ Years Exp.",
      rating: 4.8,
      orders: "980+",
      img: "/images/resource/team-3.jpg",
    },
    {
      name: "James Anderson",
      role: `${subject.name} Expert`,
      qual:
        subject.slug === "accounting" ? "CA, CPA" : `PhD, Chartered Specialist`,
      exp: "12+ Years Exp.",
      rating: 4.9,
      orders: "1500+",
      img: "/images/resource/team-4.jpg",
    },
    {
      name: "Olivia Bennett",
      role: `${subject.name} Expert`,
      qual:
        subject.slug === "accounting"
          ? "MSc Finance"
          : `MSc Applied ${subject.name}`,
      exp: "6+ Years Exp.",
      rating: 4.8,
      orders: "860+",
      img: "/images/resource/team-5.jpg",
    },
  ];

  // Generate subject-specific reviews
  const defaultReviews = [
    {
      name: "Liem O'Connor",
      uni: "University of Manchester",
      text: `The ${subject.name.toLowerCase()} assignment was perfect! Well-structured, accurate, and delivered before the deadline. Got an A+.`,
      img: "/images/resource/team-4.jpg",
    },
    {
      name: "Emily Johnson",
      uni: "University of Leeds",
      text: `Excellent work on my financial ${subject.name.toLowerCase()} assignment. The expert followed all the instructions and provided great insights.`,
      img: "/images/resource/team-3.jpg",
    },
    {
      name: "Noah Williams",
      uni: "King's College London",
      text: `Amazing experience! The calculations were 100% correct and the report was very professional.`,
      img: "/images/resource/team-2.jpg",
    },
  ];

  const expertsToRender = expertsList.length > 0 ? expertsList : defaultExperts;
  const reviewsToRender = reviewsList.length > 0 ? reviewsList : defaultReviews;

  // Dynamic choice features row
  const choiceFeatures = [
    {
      icon: <Users className="w-5 h-5" />,
      title: `Qualified\n${subject.name} Experts`,
      desc:
        subject.slug === "accounting"
          ? "Professional accountants\nand academic writers."
          : `Professional ${subject.name.toLowerCase()} specialists\nand academic writers.`,
    },
    {
      icon: <FileCheck2 className="w-5 h-5" />,
      title: "100% Original\n& Plagiarism Free",
      desc: "Every assignment is\nunique and verified.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "On-Time\nDelivery",
      desc: "We value your time and\nalways meet deadlines.",
    },
    {
      icon: <Headset className="w-5 h-5" />,
      title: "24/7\nSupport",
      desc: "Our support team is\navailable anytime.",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: `UK-Based\n${subject.slug === "accounting" ? "Accountants" : "Professionals"}`,
      desc: "Writers familiar with UK\nacademic standards.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Affordable\nPricing",
      desc: "Premium quality help\nwithin your budget.",
    },
  ];

  // Dynamic promo banner inclusions row
  const promoInclusions = [
    {
      icon: <FileCheck2 className="w-6 h-6" />,
      label: "Plagiarism\nReport",
      visibility: "flex",
    },
    {
      icon: <Network className="w-6 h-6" />,
      label: "AI Report",
      visibility: "flex",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: "Title\nPage",
      visibility: "flex",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: "Bibliography",
      visibility: "hidden sm:flex",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      label: "Unlimited\nRevisions",
      visibility: "hidden lg:flex",
    },
    {
      icon: <PaintRoller className="w-6 h-6" />,
      label: "Formatting",
      visibility: "hidden lg:flex",
    },
    {
      icon: <Headset className="w-6 h-6" />,
      label: "24/7\nSupport",
      visibility: "hidden lg:flex",
    },
  ];

  // Dynamic benefits points
  const benefits = [
    {
      icon: <Award className="w-6 h-6 text-[#3f159a]" />,
      title: "Quality Assistance",
      desc: `With experienced ${subject.professionalsWord}, our team is equipped with the latest tools and technologies that enable us to offer quality ${subject.name.toLowerCase()} help for students.`,
    },
    {
      icon: <Users className="w-6 h-6 text-[#3f159a]" />,
      title: "Customized Solutions",
      desc: `When you seek our online ${subject.name.toLowerCase()} assignment help, you get personalized and tailor-made support that fulfills all your needs and demands.`,
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#3f159a]" />,
      title: "Accuracy and Precision",
      desc: `Our experts aim to deliver accurate and error-free solutions. We have a committed team that adheres to ${subject.standardsWord} and provides precise work.`,
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#3f159a]" />,
      title: "100% Confidentiality",
      desc: "We maintain a policy where your personal information remains 100% secure. Your confidentiality and privacy are our top priorities.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      email,
      mobile: `${countryCode} ${mobile}`,
      projectType,
      wordCount,
      timePeriod,
      subject: subject.name,
    });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-10 h-10 border-4 border-[#3f159a] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold animate-pulse">Loading subject details...</p>
      </div>
    );
  }

  return (
    <div className="font-sans text-[#111827] bg-white overflow-hidden">
      {/* 3.2 HERO SECTION (Incorporates breadcrumbs for seamless backdrop layout) */}
      <section
        className="relative pt-6 pb-8 px-4 md:px-6 lg:px-8 overflow-hidden border-b border-gray-100"
        style={{ background: "linear-gradient(115deg, #ffffff 48%, #faf8ff)" }}
      >
        <div className="relative z-10 max-w-[1250px] mx-auto">
          {/* Dynamic Breadcrumbs inside Hero */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-[#3f159a] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/subjects"
              className="hover:text-[#3f159a] transition-colors"
            >
              Subjects
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-550">
              {subject.name} Assignment Help
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative min-h-[500px] lg:min-h-[545px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-start items-start text-left z-20 pb-4 lg:pb-0 order-1 relative pt-2">
              {/* Star Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-[#22c55e] text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-tight select-none">
                  ★★★★★
                </div>
                <span className="text-[11px] font-bold text-[#0f1b3d]">
                  Rated 4.9/5 by 25,000+ UK Students
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[34px] sm:text-[40px] lg:text-[42px] font-[900] leading-[1.08] text-[#0f1b3d] tracking-tight mb-3 font-heading">
                {pageTitle}
                <br />
                <span className="text-[#ea580c] block mt-1.5">
                  {pageHighlight}
                </span>
              </h1>

              {/* Description */}
              {pageData?.hero_content ? (
                <div 
                  className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed mb-6 max-w-[500px] html-desc"
                  dangerouslySetInnerHTML={{ __html: pageData.hero_content }}
                />
              ) : (
                <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed mb-6 max-w-[500px]">
                  Get accurate, well-researched and plagiarism-free{" "}
                  {subject.name.toLowerCase()} assignments helped by qualified
                  experts to achieve top grades.
                </p>
              )}

              {/* Mobile Student Image block */}
              <div className="relative w-full max-w-[360px] h-[240px] mx-auto my-4 block lg:hidden z-10">
                <Image
                  src="/new-subject-sectionimg/herosubject.png"
                  alt={`${subject.name} student`}
                  fill
                  className="object-contain object-bottom"
                  priority
                />
                {/* Floating Headset Live Support Badge on mobile overlaying the image */}
                <div className="absolute bottom-[20px] right-0 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-2.5 flex items-center gap-2 border border-gray-100 z-20">
                  <div className="w-7 h-7 rounded-full bg-[#fff2ea] flex items-center justify-center shrink-0">
                    <Headset className="w-3.5 h-3.5 text-[#ea580c]" />
                  </div>
                  <div className="flex flex-col text-left pr-1">
                    <span className="font-extrabold text-[#0f1b3d] text-[10px] leading-tight">
                      24/7
                    </span>
                    <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wider">
                      Live Support
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Stats Row */}
              <div className="grid grid-cols-4 md:flex md:flex-wrap items-center gap-x-6 gap-y-4 mb-8 max-w-[560px] w-full border-t border-b border-gray-100 py-3 md:border-none md:py-0">
                {/* Stat 1 */}
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2.5 text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 md:pr-0">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hidden md:flex">
                    <CheckCircle2 className="w-4 h-4 text-[#0f1b3d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-[13px] font-[950] text-[#0f1b3d] leading-none mb-1">
                      {subject.assignmentsDelivered}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">
                      Assignments Delivered
                    </span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2.5 text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 md:pr-0">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hidden md:flex">
                    <Users className="w-4 h-4 text-[#0f1b3d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-[13px] font-[950] text-[#0f1b3d] leading-none mb-1">
                      {subject.expertsCount}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">
                      Subject Experts
                    </span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2.5 text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 md:pr-0">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hidden md:flex">
                    <Star className="w-4 h-4 text-[#eab308] fill-[#eab308]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-[13px] font-[950] text-[#0f1b3d] leading-none mb-1">
                      {subject.rating}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">
                      Student Rating
                    </span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2.5 text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 pr-0">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hidden md:flex">
                    <Clock className="w-4 h-4 text-[#0f1b3d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-[13px] font-[950] text-[#0f1b3d] leading-none mb-1">
                      {subject.onTimeDelivery}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">
                      On-Time Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Purple Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link
                  href="#quote-form"
                  className="btn-shutter-blue-open text-white font-extrabold py-3.5 px-6 rounded-lg text-[11px] tracking-wider transition uppercase shadow-md flex items-center justify-center gap-2 w-full sm:w-auto text-center shrink-0 cursor-pointer border-none"
                >
                  Talk To An Expert <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/samples"
                  className="btn-shutter-blue-close font-extrabold py-3.5 px-6 rounded-lg text-[11px] tracking-wider transition uppercase shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto text-center shrink-0 cursor-pointer"
                >
                  View Samples <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Absolutely positioned center image, matching Laravel structure for organic overlap */}
              <div
                className="absolute right-[-170px] bottom-[-48px] w-[420px] h-[450px] select-none pointer-events-none hidden lg:block z-10"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
                }}
              >
                <Image
                  src="/new-subject-sectionimg/herosubject.png"
                  alt={`${subject.name} student`}
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>

              {/* Floating Headset Live Support Badge */}
              <div className="absolute bottom-[40px] right-[-160px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3.5 flex items-center gap-2.5 border border-gray-100 pointer-events-auto z-30 hidden lg:flex">
                <div className="w-8 h-8 rounded-full bg-[#fff2ea] flex items-center justify-center shrink-0">
                  <Headset className="w-4 h-4 text-[#ea580c]" />
                </div>
                <div className="flex flex-col text-left pr-1">
                  <span className="font-extrabold text-[#0f1b3d] text-[11px] leading-tight">
                    24/7
                  </span>
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                    Live Support
                  </span>
                </div>
              </div>
            </div>

            {/* Empty Spacer Column for Desktop to keep the center empty for absolute image */}
            <div className="lg:col-span-1 hidden lg:block order-2" />

            {/* Right Form Card Column */}
            <div
              className="lg:col-span-4 flex justify-center lg:justify-end items-center z-20 pt-4 order-3"
              id="quote-form"
            >
              <div className="w-[390px] max-w-full p-[0.8rem_1rem] rounded-2xl border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white relative">
                {/* Offer ribbon banner at top-right */}
                <div className="absolute top-[-26px] right-0 z-[5] pointer-events-none h-[48px] w-[300px]">
                  <Image
                    src="/images/offer-3.png"
                    alt="Enjoy Upto 40% Off"
                    fill
                    className="object-contain rounded-tr-[10px]"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 mb-2 pt-4">
                  <span
                    className="text-[1.2rem] select-none"
                    style={{ filter: "grayscale(100%) opacity(0.6)" }}
                  >
                    ✨
                  </span>
                  <h3 className="text-[0.95rem] font-bold text-gray-900 m-0 mx-2 capitalize leading-snug whitespace-nowrap">
                    Get Instant Quote
                  </h3>
                  <span
                    className="text-[1.2rem] select-none"
                    style={{ filter: "grayscale(100%) opacity(0.6)" }}
                  >
                    ✨
                  </span>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-[0.15rem]"
                  id="placeOrder"
                >
                  {/* Name Row */}
                  <div className="flex items-center justify-between mb-1.5 gap-[15px]">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-100 text-[#7c3aed]">
                        <Users className="w-3 h-3 text-[#7c3aed]" />
                      </span>
                      <label className="text-[0.78rem] font-bold text-gray-800 m-0 whitespace-nowrap">
                        Name
                      </label>
                    </div>
                    <div className="hero-select-box flex-1 max-w-[170px] bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <input
                        type="text"
                        required
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-none bg-transparent text-[0.7rem] text-slate-800 outline-none font-medium py-1 box-border placeholder:text-gray-400 focus:outline-none focus:border-none focus:shadow-none"
                      />
                    </div>
                  </div>

                  {/* Email Row */}
                  <div className="flex items-center justify-between mb-1.5 gap-[15px]">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-blue-100 text-blue-500">
                        <FileText className="w-3 h-3 text-blue-500" />
                      </span>
                      <label className="text-[0.78rem] font-bold text-gray-800 m-0 whitespace-nowrap">
                        Email
                      </label>
                    </div>
                    <div className="hero-select-box flex-1 max-w-[170px] bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <input
                        type="email"
                        required
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-none bg-transparent text-[0.7rem] text-slate-800 outline-none font-medium py-1 box-border placeholder:text-gray-400 focus:outline-none focus:border-none focus:shadow-none"
                      />
                    </div>
                  </div>

                  {/* Mobile Row */}
                  <div className="flex items-center justify-between mb-1.5 gap-[15px]">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-red-100 text-red-500">
                        <Headset className="w-3 h-3 text-red-555" />
                      </span>
                      <label className="text-[0.78rem] font-bold text-gray-800 m-0 whitespace-nowrap">
                        Mobile No
                      </label>
                    </div>
                    <div className="flex-grow flex-1 max-w-[170px] flex gap-1">
                      <div className="w-[65px] bg-white border border-gray-200 rounded-lg py-1 px-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <CustomDropdown
                          options={COUNTRY_CODES}
                          value={countryCode}
                          onChange={setCountryCode}
                          align="left"
                        />
                      </div>
                      <div className="flex-grow bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <input
                          type="tel"
                          required
                          placeholder="Enter Mobile"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="w-full border-none bg-transparent text-[0.7rem] text-slate-800 outline-none font-medium py-0.5 box-border placeholder:text-gray-400 focus:outline-none focus:border-none focus:shadow-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Type Row */}
                  <div className="flex items-center justify-between mb-1.5 gap-[15px]">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-green-100 text-green-500">
                        <BookOpen className="w-3 h-3 text-green-600" />
                      </span>
                      <label className="text-[0.78rem] font-bold text-gray-800 m-0 whitespace-nowrap">
                        Project Type
                      </label>
                    </div>
                    <div className="hero-select-box flex-1 max-w-[170px] bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <CustomDropdown
                        options={PROJECT_TYPE_OPTIONS}
                        value={projectType}
                        onChange={setProjectType}
                        placeholder="Select Level"
                      />
                    </div>
                  </div>

                  {/* Word Count Row */}
                  <div className="flex items-center justify-between mb-1.5 gap-[15px]">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-pink-100 text-pink-500">
                        <AlignLeft className="w-3 h-3 text-pink-500" />
                      </span>
                      <label className="text-[0.78rem] font-bold text-gray-800 m-0 whitespace-nowrap">
                        Word Count
                      </label>
                    </div>
                    <div className="hero-select-box flex-1 max-w-[170px] bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <CustomDropdown
                        options={WORD_COUNT_OPTIONS}
                        value={wordCount}
                        onChange={setWordCount}
                        placeholder="Select Word Count"
                      />
                    </div>
                  </div>

                  {/* Time Period Row */}
                  <div className="flex items-center justify-between mb-1.5 gap-[15px]">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-yellow-100 text-yellow-600">
                        <Clock className="w-3 h-3 text-yellow-600" />
                      </span>
                      <label className="text-[0.78rem] font-bold text-gray-800 m-0 whitespace-nowrap">
                        Time Period
                      </label>
                    </div>
                    <div className="hero-select-box flex-1 max-w-[170px] bg-white border border-gray-200 rounded-lg py-1 px-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <CustomDropdown
                        options={TIME_PERIOD_OPTIONS}
                        value={timePeriod}
                        onChange={setTimePeriod}
                        placeholder="Select Deadline"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-shutter-orange-open border-none py-[9px] px-3 rounded-lg text-[0.78rem] font-semibold cursor-pointer w-full mt-3 shadow-[0_4px_14px_rgba(249,115,22,0.3)] whitespace-nowrap"
                  >
                    Get Price Now &rarr;
                  </button>

                  <div className="flex justify-between mt-2.5 text-[0.65rem] text-gray-500 border-t border-gray-100 pt-2.5">
                    <span className="flex items-center gap-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        className="w-3 h-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      It&apos;s free
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        className="w-3 h-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      No obligation
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        className="w-3 h-3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Quick response
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.3 "WHY STUDENTS CHOOSE" SECTION */}
      <section className="py-8 md:py-10 bg-white border-b border-gray-50">
        <div className="max-w-[1250px] mx-auto px-4">
          <h2 className="text-[22px] md:text-[26px] font-[900] text-[#0f1b3d] text-center mb-10 tracking-tight font-heading">
            Why Students Choose Our {subject.name} Assignment Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 md:gap-y-8">
            {choiceFeatures.map((f, i) => (
              <div
                key={i}
                className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0"
              >
                <div className="w-12 h-12 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] mb-3.5 border border-purple-50 shadow-sm transition-transform hover:scale-110 duration-200 shrink-0">
                  {f.icon}
                </div>
                <div className="flex flex-col text-left md:text-center">
                  <h3 className="text-[13px] md:text-[12px] font-extrabold text-[#0f1b3d] leading-snug whitespace-pre-line mb-1.5 font-heading">
                    {f.title}
                  </h3>
                  <p className="text-[11px] md:text-[10px] text-gray-500 font-bold leading-relaxed whitespace-pre-line">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.4 "OUR EXPERTS" SECTION */}
      <section className="py-8 md:py-10 bg-[#faf9fe] border-b border-gray-50">
        <div className="max-w-[1250px] mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8">
            <div className="text-center w-full">
              <h2 className="text-[22px] sm:text-[28px] font-[900] text-[#0f1b3d] mb-1.5 tracking-tight font-heading leading-snug">
                Our {subject.name} Assignment Experts
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                Learn from the best. Our experts are here to help you achieve
                top grades.
              </p>
            </div>
            <div className="flex justify-end w-full">
              <Link
                href="/writers"
                className="text-[11px] font-extrabold text-[#3f159a] flex items-center hover:underline uppercase tracking-widest gap-0.5 shrink-0"
              >
                View All Experts <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="relative">
            {/* Carousel track */}
            <div
              className="flex overflow-x-auto pb-4 lg:pb-0 -mx-4 px-4 snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:mx-0 lg:px-0 gap-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {expertsToRender.map((expert, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-gray-100 flex flex-col items-center p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(63,21,154,0.06)] hover:-translate-y-1.5 duration-300 flex-none w-[265px] sm:w-[45%] lg:w-auto snap-center relative overflow-hidden"
                >
                  {/* Decorative top colored block */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-3xl" />

                  {/* Avatar Section */}
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center shrink-0 mb-4 ring-4 ring-white shadow-md overflow-hidden mt-3 bg-gray-150">
                    <img
                      src={expert.img || "/assets/media/avatars/blank.png"}
                      alt={expert.name}
                      className="w-full h-full object-cover object-center bg-gray-100"
                    />
                  </div>

                  {/* Name and Role */}
                  <div className="flex flex-col items-center flex-1 min-w-0 w-full text-center">
                    <h3 className="font-extrabold text-[#0f1b3d] text-[14px] mb-1 tracking-tight truncate w-full">
                      {expert.name}
                    </h3>
                    <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                      {expert.role}
                    </span>

                    {/* Stats block */}
                    <div className="space-y-0.5 mb-3 text-center">
                      <p className="text-[10px] font-extrabold text-[#3f159a]">
                        {expert.qual}
                      </p>
                      <p className="text-[9px] text-gray-500 font-bold">
                        {expert.exp} Experience
                      </p>
                    </div>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1.5 justify-center mb-3">
                      <div className="flex text-yellow-400 text-[10px]">
                        ★★★★★
                      </div>
                      <span className="text-[#0f1b3d] text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                        {expert.rating || 4.8}
                      </span>
                    </div>

                    {/* Mini stats row */}
                    <div className="grid grid-cols-2 gap-1 w-full pt-3 border-t border-gray-100 mt-auto text-left">
                      <div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide m-0">Orders</p>
                        <p className="text-[10px] font-black text-slate-800 m-0">{expert.orders}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide m-0">Success Rate</p>
                        <p className="text-[10px] font-black text-emerald-600 m-0">99%</p>
                      </div>
                    </div>

                    <Link
                      href="#quote-form"
                      className="btn-shutter-blue-close block w-full py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-center transition-colors duration-250 cursor-pointer mt-3"
                    >
                      Hire Expert
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Dot pagination for mobile to match design spec */}
            <div className="flex md:hidden justify-center gap-2 mt-6">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3f159a]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 PROMO BANNER */}
      <section className="py-4 bg-white border-b border-gray-50">
        <div className="max-w-[1250px] mx-auto px-4">
          <div
            className="rounded-[20px] overflow-hidden relative shadow-lg p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-white"
            style={{
              background:
                "linear-gradient(100deg, #24105f 0%, #3c168b 58%, #6a23b6 100%)",
            }}
          >
            {/* Promo offer left column + gift box next to it on mobile/desktop */}
            <div className="flex flex-row items-center justify-between gap-4 w-full lg:w-[35%] shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left leading-none">
                <small className="block text-[10px] font-bold text-purple-200 uppercase tracking-wider">
                  UP TO
                </small>
                <strong className="block my-1 text-[26px] md:text-[32px] font-extrabold uppercase leading-none">
                  <b className="text-[#ff6a12] text-[36px] md:text-[45px] font-black mr-1.5">
                    30%
                  </b>{" "}
                  OFF
                </strong>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                  ON YOUR FIRST ORDER
                </span>
                <em className="inline-block rounded-[4px] px-3.5 py-2 bg-white text-[#3f159a] text-[10px] font-black uppercase not-italic tracking-wider text-center shadow-sm cursor-pointer hover:bg-gray-50 transition">
                  Use Code: AIN30
                </em>
              </div>

              {/* Rotated gift emoji */}
              <div
                className="text-[64px] md:text-[80px] select-none pointer-events-none z-10 shrink-0 leading-none"
                style={{
                  filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.15))",
                  transform: "rotate(-7deg)",
                }}
              >
                🎁
              </div>
            </div>

            {/* Middle benefits column */}
            <div className="lg:flex-1 w-full grid grid-cols-4 lg:grid-cols-7 gap-y-4 gap-x-2 text-center lg:pl-6">
              {promoInclusions.map((item, i) => (
                <div
                  key={i}
                  className={`min-h-[74px] flex flex-col items-center justify-center gap-2 px-[9px] text-center lg:border-l lg:border-white/13 lg:first:border-l-0 ${item.visibility}`}
                >
                  <div className="text-white">
                    {React.cloneElement(item.icon, {
                      className: "w-[23px] h-[23px] text-white stroke-[2]",
                    })}
                  </div>
                  <span className="text-[9px] font-bold text-white leading-tight whitespace-pre-line">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.6 TESTIMONIALS */}
      <section className="py-8 md:py-10 bg-[#faf9fe] border-b border-gray-50">
        <div className="max-w-[1250px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[24px] md:text-[32px] font-[900] text-[#0f1b3d] mb-2 tracking-tight font-heading">
              What Our Students <span className="text-[#3f159a]">Say</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">
              Trusted by thousands of students across the UK and worldwide.
            </p>
          </div>

          {/* Testimonials Grid / List */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">
            {reviewsToRender.map((review, i) => {
              const isFeatured = i === 1; // Middle card featured
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-7 relative flex flex-col justify-between text-left transition-all duration-300 hover:scale-[1.02] ${
                    isFeatured
                      ? "bg-[#3f159a] shadow-2xl text-white md:-translate-y-4"
                      : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-150"
                  }`}
                >
                  <span
                    className={`text-[80px] leading-[0.1] select-none font-serif opacity-20 absolute top-10 left-5 ${
                      isFeatured ? "text-purple-300" : "text-[#3f159a]"
                    }`}
                  >
                    “
                  </span>
                  <p
                    className={`text-[12px] md:text-[13px] leading-relaxed mb-8 relative z-10 pt-4 font-semibold ${
                      isFeatured ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {review.text}
                  </p>
                  <div className="flex items-center relative z-10 pt-4 border-t border-gray-100/10">
                    <div className="w-10 h-10 rounded-full mr-3.5 overflow-hidden bg-gray-200 shrink-0 shadow-sm border border-white">
                      <img
                        src={review.img}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-extrabold text-[12px] m-0 ${isFeatured ? "text-white" : "text-[#0f1b3d]"}`}
                      >
                        {review.name}
                      </h4>
                      <p
                        className={`text-[10px] m-0 font-bold ${isFeatured ? "text-purple-200" : "text-gray-400"}`}
                      >
                        {review.uni}
                      </p>
                      <div className="flex text-[11px] mt-1 gap-0.5 text-yellow-400">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Dot pagination for mobile to match design spec */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f159a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </div>
        </div>
      </section>

      {/* 3.7 "WHY CHOOSE [SUBJECT] FROM US?" SECTION */}
      <section className="py-8 md:py-10 bg-white border-b border-gray-50">
        <div className="max-w-[800px] mx-auto px-4 text-center mb-12">
          <h2 className="text-[24px] md:text-[32px] font-[900] text-[#0f1b3d] mb-4 tracking-tight font-heading">
            Why Choose {subject.name} Assignment Help From Us?
          </h2>
          <p className="text-[13px] text-gray-500 font-bold leading-relaxed">
            Well, the answer to your question is simple! When students seek{" "}
            {subject.name.toLowerCase()} assignment help from us, they get
            several benefits that add value to their service. So, do you want to
            know such valuable benefits that explain why seeking our assistance
            is the right decision to make? Continue reading to learn about it!
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-[#f4f2ff] flex items-center justify-center shrink-0 mr-4 border border-purple-50 shadow-sm">
                {b.icon}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#0f1b3d] mb-1.5 font-heading">
                  {b.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-bold">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.8 BOTTOM CTA STRIP */}
      <section className="py-6 bg-white border-b border-gray-50">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="bg-[#f4f2ff] border border-purple-100 shadow-[0_8px_30px_rgba(63,21,154,0.04)] rounded-2xl p-5 md:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src="/assets/media/avatars/books-with-graduation-cap-digital-art-style-education-day-removebg-preview.png"
                  alt="Graduation Cap Books"
                  fill
                  className="object-contain animate-pulse"
                />
              </div>
              <div>
                <p className="text-[#0f1b3d] text-[13px] font-extrabold leading-relaxed m-0">
                  {subject.name} is a crucial subject that requires{" "}
                  {subject.analyticalWord}.
                </p>
                <p className="text-gray-400 text-xs font-bold leading-normal m-0 mt-0.5">
                  Our experts are here to help you excel in your assignments!
                </p>
              </div>
            </div>
            <Link
              href="#quote-form"
              className="btn-shutter-blue-open text-white font-extrabold py-3.5 px-6 rounded-lg text-[11px] uppercase tracking-wider shadow-md transition duration-200 whitespace-nowrap w-full md:w-auto text-center cursor-pointer border-none"
            >
              Order Now &rarr;
            </Link>
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
