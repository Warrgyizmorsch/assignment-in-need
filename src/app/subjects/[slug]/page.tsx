"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { mapExpertToWriter } from "@/lib/api";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

const COUNTRY_CODES = getCountries().map((country) => {
  const code = getCountryCallingCode(country);
  const name = (en as any)[country] || country;
  return {
    label: `${name} (+${code})`,
    value: `+${code}`
  };
}).sort((a, b) => a.label.localeCompare(b.label));

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
import { cn } from "@/lib/utils";
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
import { AnimateIn } from "@/components/ui/AnimateIn";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { Button } from "@/components/ui/Button";
import { ExpertCard } from "@/components/ui/ExpertCard";

export default function SubjectLanding() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : (rawSlug as string) || "";

  const normalizeArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Normalize slug to extract the subject key, e.g. "history-assignment-help" -> "history"
  const cleanSubjectSlug = (s: string) => {
    let base = s.replace("-assignment-help", "").toLowerCase();
    if (base === "math") base = "maths";
    return base;
  };
  const cleanSlugForSubject = cleanSubjectSlug(slug);

  // Find current subject or construct a dynamic fallback
  let subject = SUBJECTS.find((s) => s.slug === cleanSlugForSubject || s.slug === slug);
  if (!subject) {
    const humanName = cleanSlugForSubject === "math" ? "Maths" : cleanSlugForSubject.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    subject = {
      slug: cleanSlugForSubject,
      name: humanName,
      iconName: "BookOpen",
      orderCount: "4,500+",
      sampleCount: 10,
      letterBadge: humanName.charAt(0) || "S",
      letterColorClass: "bg-purple-100 text-purple-700",
      assignmentsDelivered: "15,000+",
      expertsCount: "120+",
      rating: "4.8/5",
      onTimeDelivery: "98%",
      roleName: `${humanName} Expert`,
      professionalsWord: `${humanName.toLowerCase()} specialists`,
      standardsWord: `${humanName.toLowerCase()} academic standards`,
      analyticalWord: `critical ${humanName.toLowerCase()} analysis`
    };
  }


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [projectType, setProjectType] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic States for API data
  const [pageData, setPageData] = useState<any>(null);
  const [expertsList, setExpertsList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(false);

  // Map backend helper to match Writer model
  const mapExpertToWriterLocal = (expert: any) => {
    const writerName = expert.name || "Academic Expert";
    const isDrOrProf =
      writerName.includes("Dr.") || writerName.includes("Prof.");
    const calculatedQualifications = isDrOrProf
      ? "Ph.D. Qualified"
      : "Master's Qualified";
    let calculatedExperience = "5+ Years";
    const finishOrder = parseInt(expert.finish_order) || 0;
    if (finishOrder > 2000) calculatedExperience = "8+ Years";
    else if (finishOrder > 1000) calculatedExperience = "7+ Years";
    else if (finishOrder > 500) calculatedExperience = "6+ Years";

    let calculatedRating = 4.8;
    if (expert.customer_review) {
      try {
        const reviewsArray =
          typeof expert.customer_review === "string"
            ? JSON.parse(expert.customer_review)
            : expert.customer_review;
        if (Array.isArray(reviewsArray) && reviewsArray.length > 0) {
          const ratings = reviewsArray
            .map((r: any) => parseFloat(r.rating) || 5)
            .filter(Boolean);
          if (ratings.length > 0) {
            calculatedRating =
              ratings.reduce((sum: number, r: number) => sum + r, 0) /
              ratings.length;
          }
        }
      } catch (e) {}
    }

    // Get image
    let avatarUrl = "";
    if (expert.image) {
      avatarUrl = expert.image.startsWith("http")
        ? expert.image
        : `https://ain.warrgyizmorsch.com/${expert.image.startsWith("/") ? expert.image : `/${expert.image}`}`;
    } else {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(writerName)}&background=f3e8ff&color=6b21a8`;
    }

    const finalImg = avatarUrl;

    return {
      name: writerName,
      role: `${subject.name} Expert`,
      qual: calculatedQualifications,
      exp: calculatedExperience,
      rating: parseFloat(calculatedRating.toFixed(1)),
      orders: `${finishOrder > 0 ? finishOrder : 1200}+`,
      img: finalImg,
    };
  };

  useEffect(() => {
    const fetchSubjectPage = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        let cleanSlug = slug.replace("-assignment-help", "");
        if (cleanSlug === "math") {
          cleanSlug = "maths";
        }
        let res = await fetch(`/api/admin/subjects?slug=${cleanSlug}`);
        let payload: any = null;
        if (res.ok) {
          payload = await res.json();
        }

        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          const res2 = await fetch(`/api/admin/subjects?slug=/subject/${cleanSlug}`);
          if (res2.ok) {
            const temp = await res2.json();
            if (temp.success && temp.data && temp.data.page) {
              payload = temp;
            }
          }
        }

        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          const res3 = await fetch(`/api/admin/subjects?slug=subject/${cleanSlug}`);
          if (res3.ok) {
            const temp = await res3.json();
            if (temp.success && temp.data && temp.data.page) {
              payload = temp;
            }
          }
        }

        // Fallback: try the service-pages API (for service children like economics, english)
        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          const serviceRes = await fetch(`/api/admin/service-pages?slug=${cleanSlug}`);
          if (serviceRes.ok) {
            const servicePayload = await serviceRes.json();
            if (servicePayload.success && servicePayload.data && servicePayload.data.page) {
              payload = servicePayload;
            }
          }
        }

        // Fallback: try with the original uncleaned slug (e.g. management-assignment-help)
        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          const origRes = await fetch(`/api/admin/subjects?slug=${slug}`);
          if (origRes.ok) {
            const temp = await origRes.json();
            if (temp.success && temp.data && temp.data.page) {
              payload = temp;
            }
          }
        }

        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          const origRes2 = await fetch(`/api/admin/subjects?slug=subject/${slug}`);
          if (origRes2.ok) {
            const temp = await origRes2.json();
            if (temp.success && temp.data && temp.data.page) {
              payload = temp;
            }
          }
        }

        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          const origRes3 = await fetch(`/api/admin/service-pages?slug=${slug}`);
          if (origRes3.ok) {
            const temp = await origRes3.json();
            if (temp.success && temp.data && temp.data.page) {
              payload = temp;
            }
          }
        }

        if (!payload || !payload.success || !payload.data || !payload.data.page) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }

        if (payload && payload.success && payload.data && payload.data.page) {
          setPageData(payload.data.page);
          
          if (
            Array.isArray(payload.data.reviews) &&
            payload.data.reviews.length > 0
          ) {
            const mapped = payload.data.reviews.map((item: any) => ({
              name: item.name,
              uni: item.location || "UK University",
              text: item.description,
              img: item.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f3e8ff&color=6b21a8` : "/assets/media/avatars/blank.png",
            }));
            setReviewsList(mapped);
          }

          if (
            Array.isArray(payload.data.experts) &&
            payload.data.experts.length > 0
          ) {
            const mapped = payload.data.experts.map((item: any) => {
              const parsed = mapExpertToWriter(item);
              return {
                id: parsed.id,
                name: parsed.name,
                role: `${subject.name} Expert`,
                qual: parsed.qualifications,
                exp: parsed.experience.includes("Years")
                  ? parsed.experience
                  : `${parsed.experience} Experience`,
                rating: parsed.rating,
                orders: parsed.ordersCompleted,
                img: parsed.avatar,
                expertise: parsed.expertise,
              };
            });
            setExpertsList(mapped);
          } else {
            // Fetch from global experts API and filter
            const resExp = await fetch("/api/experts");
            if (resExp.ok) {
              const result = await resExp.json();
              if (result.success && Array.isArray(result.data)) {
                const subjectLower = subject.name.toLowerCase();
                const slugLower = slug.toLowerCase().replace("-assignment-help", "");

                const subjectMatched = result.data.filter((item: any) => {
                  const expertSubject = (item.subject || "").toLowerCase();
                  return expertSubject === subjectLower ||
                         expertSubject === slugLower ||
                         expertSubject.includes(subjectLower) ||
                         subjectLower.includes(expertSubject);
                });

                const keywordMatched = subjectMatched.length > 0 ? [] : result.data.filter((item: any) => {
                  const skills = Array.isArray(item.skills) ? item.skills.join(" ").toLowerCase() : "";
                  const content = (item.content || "").toLowerCase();
                  return skills.includes(subjectLower) || skills.includes(slugLower) ||
                         content.includes(subjectLower) || content.includes(slugLower);
                });

                const bestMatches = subjectMatched.length > 0 ? subjectMatched : keywordMatched;
                const sourceExperts = bestMatches.length > 0 ? bestMatches : result.data;

                const mapped = sourceExperts.map((item: any) => {
                  const parsed = mapExpertToWriter(item);
                  return {
                    id: parsed.id,
                    name: parsed.name,
                    role: `${subject.name} Expert`,
                    qual: parsed.qualifications,
                    exp: parsed.experience.includes("Years")
                      ? parsed.experience
                      : `${parsed.experience} Experience`,
                    rating: parsed.rating,
                    orders: parsed.ordersCompleted,
                    img: parsed.avatar,
                    expertise: parsed.expertise,
                  };
                });

                mapped.sort((a: any, b: any) => {
                  if (b.rating !== a.rating) return b.rating - a.rating;
                  const aOrders = parseInt(a.orders) || 0;
                  const bOrders = parseInt(b.orders) || 0;
                  return bOrders - aOrders;
                });

                setExpertsList(mapped.slice(0, 5));
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch subject page data:", err);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectPage();
  }, [slug, subject.name]);

  useEffect(() => {
    if (pageData) {
      if (pageData.meta_title) {
        document.title = pageData.meta_title;
      }
      if (pageData.meta_description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", pageData.meta_description);
        } else {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          metaDesc.setAttribute("content", pageData.meta_description);
          document.head.appendChild(metaDesc);
        }
      }
    }
  }, [pageData]);

  if (isNotFound) {
    notFound();
  }

  // Fallbacks if backend data is loading / empty
  const pageTitle =
    pageData?.hero_heading || `Expert ${subject.name} Assignment Help`;
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
      img: "https://ui-avatars.com/api/?name=Emma+Taylor&background=f3e8ff&color=6b21a8",
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
      img: "https://ui-avatars.com/api/?name=Daniel+Harris&background=ede9fe&color=4c1d95",
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
      img: "https://ui-avatars.com/api/?name=Sophia+Martinez&background=fae8ff&color=86198f",
    },
    {
      name: "James Anderson",
      role: `${subject.name} Expert`,
      qual:
        subject.slug === "accounting" ? "CA, CPA" : `PhD, Chartered Specialist`,
      exp: "12+ Years Exp.",
      rating: 4.9,
      orders: "1500+",
      img: "https://ui-avatars.com/api/?name=James+Anderson&background=e0f2fe&color=0369a1",
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
      img: "https://ui-avatars.com/api/?name=Olivia+Bennett&background=f0fdf4&color=166534",
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

  const expertsToRender = (
    expertsList.length > 0 ? expertsList : defaultExperts
  ).slice(0, 5);
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

  const whyHeading = pageData?.why_heading || `Why Students Choose Our ${subject.name} Assignment Help?`;
  const whySubheading = pageData?.why_subheading || null;

  const dynamicWhyItems = normalizeArray(pageData?.why_items)
    .map((item: any) => ({
      title: item?.heading || item?.title,
      desc: item?.content || item?.desc,
    }))
    .filter((item: any) => item.title || item.desc);

  const choiceFeaturesToRender = dynamicWhyItems.length > 0
    ? dynamicWhyItems.map((item: any, idx: number) => {
        const match = choiceFeatures[idx % choiceFeatures.length];
        return {
          icon: match ? match.icon : choiceFeatures[0].icon,
          title: item.title,
          desc: item.desc
        };
      })
    : choiceFeatures;

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

  const sectionTwoHeading =
    pageData?.section_two_heading ||
    `Why Choose ${subject.name} Assignment Help From Us?`;
  const sectionTwoContent = pageData?.section_two_content || null;

  const sectionThreeHeading = pageData?.section_three_heading || null;
  const sectionThreeContent = pageData?.section_three_content || null;

  const longContentHtml = pageData?.long_content || null;

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

  const getCountryIso = (code: string) => {
    const mapping: Record<string, string> = {
      "+44": "GB",
      "+1": "US",
      "+91": "IN",
      "+61": "AU",
      "+971": "AE",
      "+966": "SA",
      "+353": "IE",
      "+64": "NZ",
      "+65": "SG",
      "+60": "MY",
    };
    return mapping[code] || "GB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const countryIso = getCountryIso(countryCode);

      const response = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: mobile,
          countryCode,
          countryIso,
          service: projectType || "Assignment",
          subject: subject?.name || "",
          deadline: timePeriod
            ? timePeriod.replace(/[^0-9]/g, "") || timePeriod
            : "5",
          wordCount: wordCount
            ? wordCount.replace(/[^0-9]/g, "") || wordCount
            : "1500",
          description: `Quote request for ${subject?.name || ""}`,
          source_page:
            typeof window !== "undefined"
              ? window.location.href
              : `https://assignmentinneed.com/${subject.slug}-assignment-help`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Quote submitted successfully!");
        setOrderId(data.order_id || "");
        setIsSuccess(true);
      } else {
        toast.error(
          data.message || "Failed to submit quote. Please check your details.",
        );
      }
    } catch (err: any) {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] font-sans text-[#111827] overflow-hidden">
        {/* Skeleton Hero Section */}
        <section
          className="relative pt-6 pb-8 px-4 md:px-6 lg:px-8 border-b border-gray-100 animate-pulse"
          style={{
            background: "linear-gradient(115deg, #ffffff 48%, #faf8ff)",
          }}
        >
          <div className="max-w-[1250px] mx-auto">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-1.5 mb-6">
              <div className="h-3.5 w-10 bg-slate-200 rounded"></div>
              <div className="h-3 w-3 bg-slate-200 rounded"></div>
              <div className="h-3.5 w-14 bg-slate-200 rounded"></div>
              <div className="h-3 w-3 bg-slate-200 rounded"></div>
              <div className="h-3.5 w-28 bg-slate-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px] lg:min-h-[545px]">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-7 flex flex-col justify-start items-start text-left z-20 pb-4 lg:pb-0 pt-2">
                {/* Badge Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-4 w-12 bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-48 bg-slate-200 rounded"></div>
                </div>

                {/* Title Skeleton */}
                <div className="h-9 w-[80%] bg-slate-200 rounded mb-3"></div>
                <div className="h-9 w-[60%] bg-slate-200 rounded mb-6"></div>

                {/* Description Skeleton */}
                <div className="space-y-2.5 w-full max-w-[500px] mb-8">
                  <div className="h-3.5 w-[95%] bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-[90%] bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-[75%] bg-slate-200 rounded"></div>
                </div>

                {/* Key Benefits Skeleton */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-[480px] mt-4">
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              </div>

              {/* Right Column (Quote Form) Skeleton */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end items-center z-20 pt-4">
                <div className="w-[390px] h-[450px] bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  {/* Form Header Skeleton */}
                  <div className="h-6 w-32 bg-slate-200 rounded mx-auto mb-2"></div>
                  {/* Inputs Skeleton */}
                  <div className="space-y-3.5 w-full">
                    <div className="h-8 bg-slate-200 rounded-lg"></div>
                    <div className="h-8 bg-slate-200 rounded-lg"></div>
                    <div className="h-8 bg-slate-200 rounded-lg"></div>
                    <div className="h-8 bg-slate-200 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-8 bg-slate-200 rounded-lg"></div>
                      <div className="h-8 bg-slate-200 rounded-lg"></div>
                    </div>
                  </div>
                  {/* Button Skeleton */}
                  <div className="h-10 bg-slate-200 rounded-lg mt-auto w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-sans text-[#111827] bg-white overflow-hidden">
      {/* 3.2 HERO SECTION (Incorporates breadcrumbs for seamless backdrop layout) */}
      <section
        className="relative pt-6 pb-0 px-4 md:px-6 lg:px-8 overflow-hidden border-b border-gray-100"
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
              {pageData?.hero_heading?.replace(/ Help$/, ' Help') || `${subject.name} Assignment Help`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative min-h-0">
            {/* Left Content Column */}
            <AnimateIn
              variant="fadeUp"
              className="lg:col-span-7 flex flex-col justify-start items-start text-left z-20 pb-4 lg:pb-0 order-1 relative pt-2"
            >
              {/* Star Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-[#1a6c38] text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-tight select-none">
                  ★★★★★
                </div>
                <span className="text-[11px] font-bold text-[#0f1b3d]">
                  Rated 4.9/5 by 25,000+ UK Students
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[42px] w-full max-w-[500px] font-[900] leading-[1.08] text-[#0f1b3d] tracking-tight mb-3 font-heading">
                {pageTitle}
                <br />
                <span className="text-[#ea580c] block mt-1.5">
                  {pageHighlight}
                </span>
              </h1>

              {/* Description */}
              {pageData?.hero_content ? (
                <div
                  className="text-gray-600 w-full max-w-[450px] text-sm md:text-[15px] font-semibold leading-relaxed mb-6 html-desc"
                  dangerouslySetInnerHTML={{ __html: pageData.hero_content }}
                />
              ) : (
                <p className="text-gray-600 w-full max-w-[450px] text-sm md:text-[15px] font-semibold leading-relaxed mb-6">
                  Get accurate, well-researched and plagiarism-free{" "}
                  {subject.name.toLowerCase()} assignments helped by qualified
                  experts to achieve top grades.
                </p>
              )}

              {/* 4 Stats Row */}
              <div className="grid grid-cols-4 md:flex md:flex-wrap items-center gap-x-2 gap-y-4 mb-8 max-w-[500px] w-full border-t border-b border-gray-100 py-3 md:border-none md:py-0">
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
                  href="/writers"
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
            </AnimateIn>

            {/* Student Image: centered at the background of the section */}
            <div
              className="absolute left-[54%] top-[20px] -translate-x-1/2 w-[420px] h-[450px] select-none pointer-events-none hidden lg:block z-0"
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
                className="object-contain object-top"
                priority
              />
            </div>

            {/* Floating Headset Live Support Badge */}
            <div className="absolute top-[300px] left-[44%] translate-x-[80px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3.5 flex items-center gap-2.5 border border-gray-100 pointer-events-auto z-30 hidden lg:flex">
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

            {/* Empty Spacer Column for Desktop to keep the center empty for absolute image */}
            <div className="lg:col-span-1 hidden lg:block order-2" />

            {/* Right Form Card Column */}
            <AnimateIn
              variant="fadeUp"
              delay={0.2}
              id="quote-form"
              className="lg:col-span-4 flex justify-center lg:justify-center items-start z-20 pt-0 order-3"
            >
              <QuoteForm className="w-full" prefilledSubject={subject?.name} />
            </AnimateIn>
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
                <ExpertCard
                  key={i}
                  name={expert.name}
                  role={expert.role}
                  rating={expert.rating}
                  ordersCount={expert.orders}
                  avatar={expert.img || "/assets/media/avatars/blank.png"}
                  experience={expert.exp}
                  qualifications={expert.qual}
                  variant="subject"
                  className="w-[265px] sm:w-[45%] lg:w-auto shrink-0"
                />
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

      {/* 3.3 "WHY STUDENTS CHOOSE" SECTION */}
      <section className="py-8 md:py-10 bg-white border-b border-gray-50">
        <div className="max-w-[1250px] mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto flex flex-col gap-2">
            <h2 className="text-[22px] md:text-[28px] font-black text-[#0f1b3d] tracking-tight font-heading leading-tight">
              Why Students Choose <span className="text-[#3f159a]">{whyHeading.replace("Why Students Choose ", "")}</span>
            </h2>
            {whySubheading && (
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mt-1">
                {whySubheading}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 md:gap-y-8">
            {choiceFeaturesToRender.map((f: any, i: number) => (
              <div
                key={i}
                className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0"
              >
                <div className="w-12 h-12 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] mb-3.5 border border-purple-50 shadow-sm transition-transform hover:scale-110 duration-200 shrink-0">
                  {f.icon}
                </div>
                <div className="flex flex-col text-left md:text-center">
                  <h3 className="text-[16px] md:text-[15px] font-extrabold text-[#0f1b3d] leading-snug whitespace-pre-line mb-1.5 font-heading">
                    {f.title}
                  </h3>
                  <p className="text-[14px] md:text-[13px] text-gray-600 font-bold leading-relaxed whitespace-pre-line">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.7 "WHY CHOOSE [SUBJECT] FROM US?" SECTION */}
      <section className="py-8 md:py-10 bg-white border-b border-gray-50">
        <div className="max-w-[1000px] mx-auto px-4 text-center select-none flex flex-col gap-6">
          <h2 className="text-[24px] md:text-[32px] font-[900] text-[#0f1b3d] tracking-tight font-heading leading-snug">
            {sectionTwoHeading}
          </h2>

          {sectionTwoContent ? (
            <div className="flex flex-col gap-4 text-left max-w-4xl mx-auto html-desc select-text">
              <div
                className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-gray-500 font-medium max-w-4xl mx-auto text-left [&_p]:m-0 html-desc"
                dangerouslySetInnerHTML={{ __html: sectionTwoContent }}
              />
              {sectionThreeContent && (
                <>
                  {sectionThreeHeading && (
                    <h3 className="text-xl md:text-2xl font-bold text-[#0f1b3d] tracking-tight mt-6">{sectionThreeHeading}</h3>
                  )}
                  <div
                    className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-gray-500 font-medium max-w-4xl mx-auto text-left [&_p]:m-0 html-desc mt-2"
                    dangerouslySetInnerHTML={{ __html: sectionThreeContent }}
                  />
                </>
              )}
            </div>
          ) : (
            <>
              <p className="text-[15px] text-gray-600 font-bold leading-relaxed max-w-3xl mx-auto mb-6">
                Well, the answer to your question is simple! When students seek{" "}
                {subject.name.toLowerCase()} assignment help from us, they get
                several benefits that add value to their service. So, do you want to
                know such valuable benefits that explain why seeking our assistance
                is the right decision to make? Continue reading to learn about it!
              </p>
              <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start text-left">
                    <div className="w-12 h-12 rounded-xl bg-[#f4f2ff] flex items-center justify-center shrink-0 mr-4 border border-purple-50 shadow-sm">
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="text-[16px] md:text-[15px] font-extrabold text-[#0f1b3d] mb-1.5 font-heading">
                        {b.title}
                      </h3>
                      <p className="text-[13px] text-gray-600 leading-relaxed font-bold">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
                    40%
                  </b>{" "}
                  OFF
                </strong>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                  ON YOUR FIRST ORDER
                </span>
                <em className="inline-block rounded-[4px] px-3.5 py-2 bg-white text-[#3f159a] text-[10px] font-black uppercase not-italic tracking-wider text-center shadow-sm cursor-pointer hover:bg-gray-50 transition">
                  Use Code: AIN40
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
                    className={`text-[13px] md:text-[14px] leading-relaxed mb-8 relative z-10 pt-4 font-semibold ${
                      isFeatured ? "text-white" : "text-gray-650"
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

      {/* Dynamic "long_content" SEO text from API */}
      {longContentHtml && (
        <section className="py-8 md:py-10 bg-white border-b border-gray-50 select-none">
          <div className="max-w-[1000px] mx-auto px-4 flex flex-col gap-4">
            <div
              className={cn(
                "relative overflow-hidden transition-all duration-500 ease-in-out",
                seoExpanded ? "max-h-[3000px]" : "max-h-[260px]"
              )}
            >
              <div
                className="block text-[14.5px] text-gray-700 leading-relaxed max-w-4xl mx-auto text-left space-y-3 rich-text-content html-desc select-text"
                dangerouslySetInnerHTML={{ __html: longContentHtml }}
              />
              {!seoExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              )}
            </div>
            <div className="w-full flex justify-center mt-3 z-10">
              <button
                type="button"
                onClick={() => setSeoExpanded(!seoExpanded)}
                className="py-2.5 px-6 rounded-full border border-solid border-purple-200 text-[#3f159a] bg-[#faf9fe] hover:bg-purple-50 transition-colors font-extrabold text-[12px] shadow-sm select-none cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <span>{seoExpanded ? "Read Less" : "Load More"}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", seoExpanded && "rotate-180")} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3.8 BOTTOM CTA STRIP */}
      <section className="py-6 bg-white border-b border-gray-50">
        <div className="max-w-[1100px] mx-auto px-4">
          {pageData?.cta_content ? (
            <div className="max-w-4xl mx-auto rounded-3xl bg-[#f4f2ff] border border-purple-100 p-8 text-center flex flex-col items-center gap-4">
              <div
                className="text-sm md:text-base text-[#0f1b3d] font-semibold leading-relaxed html-desc text-center"
                dangerouslySetInnerHTML={{ __html: pageData.cta_content }}
              />
              {pageData.cta_button_label && (
                <Link
                  href={pageData.cta_button_url || "#quote-form"}
                  className="btn-shutter-blue-open text-white font-bold py-3.5 px-6 rounded-lg text-[13px] transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {pageData.cta_button_label}
                </Link>
              )}
            </div>
          ) : (
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
                  <p className="text-[#0f1b3d] text-[15px] font-extrabold leading-relaxed m-0">
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
          )}
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
        .html-desc h1, .html-desc h2 {
          font-size: 1.8rem !important;
          font-weight: 800 !important;
          color: #0f1b3d !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.25 !important;
        }
        .html-desc h3 {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          color: #0f1b3d !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.3 !important;
        }
        .html-desc h4 {
          font-size: 1.2rem !important;
          font-weight: 700 !important;
          color: #0f1b3d !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }
        .html-desc p {
          font-size: 15px !important;
          line-height: 1.625 !important;
          color: #4b5563 !important;
          margin-bottom: 1.15rem !important;
        }
        .html-desc ul {
          list-style-type: disc !important;
          padding-left: 1.25rem !important;
          margin-bottom: 1.15rem !important;
        }
        .html-desc ol {
          list-style-type: decimal !important;
          padding-left: 1.25rem !important;
          margin-bottom: 1.15rem !important;
        }
        .html-desc li {
          font-size: 14.5px !important;
          line-height: 1.6 !important;
          color: #4b5563 !important;
          margin-bottom: 0.5rem !important;
        }
        .html-desc strong {
          font-weight: 750 !important;
          color: #0f1b3d !important;
        }
      `}</style>
    </div>
  );
}
