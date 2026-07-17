"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { ExpertCard } from "@/components/ui/ExpertCard";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { WRITERS, TESTIMONIALS } from "@/lib/data";
import { mapExpertToWriter } from "@/lib/api";
import ServicePageLoading from "./loading";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  UploadCloud,
  FileCheck2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Star,
  Headset,
  Heart,
} from "lucide-react";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimateIn";

// NOTE: these are now ONLY used when the backend genuinely has nothing
// configured for a field. They must never override real API data.
const fallbackWhyItems = [
  { title: "100% Original Work", desc: "Plagiarism-free and authentic content." },
  { title: "AI-Free Writing", desc: "Human-written assignments, no AI tools." },
  { title: "UK Academic Standards", desc: "Followed by experts as per UK university guidelines." },
  { title: "Unlimited Revisions", desc: "We work until you are 100% satisfied with the result." },
  { title: "On-Time Delivery", desc: "Always delivered before the deadline." },
  { title: "Confidential Service", desc: "Your privacy and information are 100% safe." },
];

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

const mapReviewToTestimonial = (review: any) => ({
  name: review?.name || "Verified Student",
  institution:
    [review?.location, review?.services_type].filter(Boolean).join(" • ") ||
    "Verified Student",
  quote: review?.description || "",
  rating: Number.parseFloat(review?.customer_rating) || 5,
  avatar: review?.name?.charAt(0) || "S",
});

export default function ServiceLanding() {
  const params = useParams();
  const slugArray = params?.slug;
  const fullSlug = Array.isArray(slugArray)
    ? slugArray.join("/")
    : (slugArray as string) || "";

  const [pageData, setPageData] = useState<any>(null);
  const [experts, setExperts] = useState<any[]>([]);
  const [expertsFromPage, setExpertsFromPage] = useState(false); // NEW: track source of experts
  const [reviews, setReviews] = useState<any[]>([]);
  const [allServicePages, setAllServicePages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [seoExpanded, setSeoExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchServicePage = async () => {
      if (!fullSlug) return;
      try {
        setLoading(true);

        let apiSlug = fullSlug;
        if (
          fullSlug === "assignment-writing-uk" ||
          fullSlug === "service/assignment"
        ) {
          apiSlug = "assignment";
        } else if (
          fullSlug === "dissertation-writing-services" ||
          fullSlug === "service/dissertation"
        ) {
          apiSlug = "dissertation";
        } else if (fullSlug.startsWith("service/assignment/")) {
          apiSlug = fullSlug.replace("service/assignment/", "");
        } else if (fullSlug.startsWith("service/dissertation/")) {
          apiSlug = fullSlug.replace("service/dissertation/", "");
        } else if (fullSlug.endsWith("-assignment-writing-help")) {
          apiSlug = fullSlug.replace("-assignment-writing-help", "");
        } else if (fullSlug.endsWith("-dissertation-writing-help")) {
          apiSlug = fullSlug.replace("-dissertation-writing-help", "");
        } else if (fullSlug.includes("/")) {
          // Generic fallback: the backend keys pages by the LAST slug
          // segment (e.g. "service/assignment/english" -> "english"),
          // matching the shape of /api/service-pages/:slug.
          apiSlug = fullSlug.split("/").pop() || fullSlug;
        }

        // FIX: hit the real detail endpoint shape (/api/service-pages/:slug)
        // instead of the old admin query-string variant.
        let pageResult: any = null;
        
        // Try 1: Cleaned/extracted apiSlug
        try {
          const pageRes = await fetch(`/api/service-pages/${apiSlug}`);
          if (pageRes.ok) {
            const temp = await pageRes.json();
            if (temp && temp.success && temp.data && temp.data.page) {
              pageResult = temp;
            }
          }
        } catch (e) {
          console.error("Error in Try 1 fetch:", e);
        }

        // Try 2: Full uncleaned slug (e.g. /assignment/dissertation-writing-services)
        if (!pageResult || !pageResult.success || !pageResult.data || !pageResult.data.page) {
          try {
            const pageRes2 = await fetch(`/api/service-pages/${fullSlug}`);
            if (pageRes2.ok) {
              const temp = await pageRes2.json();
              if (temp && temp.success && temp.data && temp.data.page) {
                pageResult = temp;
              }
            }
          } catch (e) {
            console.error("Error in Try 2 fetch:", e);
          }
        }

        // Try 3: Full slug replacing slashes with dashes
        if (!pageResult || !pageResult.success || !pageResult.data || !pageResult.data.page) {
          try {
            const pageRes3 = await fetch(`/api/service-pages/${fullSlug.replace(/\//g, "-")}`);
            if (pageRes3.ok) {
              const temp = await pageRes3.json();
              if (temp && temp.success && temp.data && temp.data.page) {
                pageResult = temp;
              }
            }
          } catch (e) {
            console.error("Error in Try 3 fetch:", e);
          }
        }

        // Parse result if successfully loaded
        if (pageResult && pageResult.success && pageResult.data && pageResult.data.page) {
          setPageData(pageResult.data.page);

          if (
            Array.isArray(pageResult.data.experts) &&
            pageResult.data.experts.length > 0
          ) {
            // These are the experts the backend explicitly assigned to
            // this page (via expert_ids). Trust them as-is.
            setExperts(
              pageResult.data.experts.map((item: any) =>
                mapExpertToWriter(item),
              ),
            );
            setExpertsFromPage(true);
          } else {
            setExpertsFromPage(false);
          }

          if (Array.isArray(pageResult.data.reviews)) {
            setReviews(pageResult.data.reviews.map(mapReviewToTestimonial));
          }
        }

        if (
          !pageResult ||
          !pageResult.success ||
          !pageResult.data ||
          !pageResult.data.page
        ) {
          const listRes = await fetch("/api/service-pages");
          if (listRes.ok) {
            const listResult = await listRes.json();
            // FIX: the list endpoint reports success as `status: "success"`,
            // not `success: true`. The old check meant this branch never ran.
            if (
              listResult.status === "success" &&
              Array.isArray(listResult.data)
            ) {
              const flatPages: any[] = [];
              const extractPages = (arr: any[]) => {
                arr.forEach((item) => {
                  flatPages.push(item);
                  if (Array.isArray(item.children)) {
                    extractPages(item.children);
                  }
                });
              };
              extractPages(listResult.data);
              setAllServicePages(flatPages);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching service page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServicePage();
  }, [fullSlug]);

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

  const childServicePages = allServicePages.filter((service) => {
    const slug = service?.slug || "";
    return slug.startsWith(`${fullSlug}/`);
  });

  // FIX: this used to run unconditionally and clobber the page-specific
  // experts returned by the detail API with a fuzzy, often-wrong global
  // match. Now it's a genuine fallback: it only runs when the page itself
  // didn't come with any assigned experts.
  useEffect(() => {
    if (expertsFromPage) return;

    const fetchGlobalExperts = async () => {
      const currentTitle =
        pageData?.hero_heading || "Professional Assignment Help";
      if (!pageData) return;
      try {
        const resExp = await fetch("/api/experts");
        if (resExp.ok) {
          const result = await resExp.json();
          if (result.success && Array.isArray(result.data)) {
            const titleLower = currentTitle.toLowerCase();
            const slugLower = (fullSlug || "").toLowerCase();

            const subjectMatched = result.data.filter((item: any) => {
              const expertSubject = (item.subject || "").toLowerCase();
              if (!expertSubject) return false;
              return (
                titleLower.includes(expertSubject) ||
                slugLower.includes(expertSubject) ||
                expertSubject.includes(titleLower) ||
                expertSubject.includes(slugLower)
              );
            });

            const keywordMatched =
              subjectMatched.length > 0
                ? []
                : result.data.filter((item: any) => {
                    const skills = Array.isArray(item.skills)
                      ? item.skills.join(" ").toLowerCase()
                      : "";
                    const content = (item.content || "").toLowerCase();
                    return (
                      skills.includes(titleLower) ||
                      skills.includes(slugLower) ||
                      content.includes(titleLower) ||
                      content.includes(slugLower)
                    );
                  });

            const bestMatches =
              subjectMatched.length > 0 ? subjectMatched : keywordMatched;

            // Only fall back to "all experts" if we truly have no page
            // experts AND no keyword match — never used to override a
            // populated, page-specific list any more.
            const sourceExperts =
              bestMatches.length > 0 ? bestMatches : result.data;

            const mapped = sourceExperts.map((item: any) => {
              const parsed = mapExpertToWriter(item);
              return {
                ...parsed,
                role: parsed.role || `${currentTitle} Expert`,
              };
            });

            mapped.sort((a: any, b: any) => {
              if (b.rating !== a.rating) return b.rating - a.rating;
              const aOrders = parseInt(a.ordersCompleted || a.orders) || 0;
              const bOrders = parseInt(b.ordersCompleted || b.orders) || 0;
              return bOrders - aOrders;
            });

            setExperts(mapped);
          }
        }
      } catch (e) {
        console.error("Error fetching global experts for service:", e);
      }
    };
    fetchGlobalExperts();
  }, [pageData, fullSlug, expertsFromPage]);

  useEffect(() => {
    if (pageData && pageData.meta_title) {
      document.title = pageData.meta_title;
    }
  }, [pageData]);

  useEffect(() => {
    if (!loading && !pageData && childServicePages.length === 1) {
      router.replace(`/${childServicePages[0].slug}`);
    }
  }, [loading, pageData, childServicePages, router]);

  if (loading) {
    return <ServicePageLoading />;
  }

  if (!pageData && !loading && childServicePages.length === 1) {
    return <ServicePageLoading />;
  }

  if (!pageData) {
    if (childServicePages.length > 1) {
      return (
        <div className="bg-white min-h-[60vh] px-4 py-16 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 capitalize">
              {fullSlug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              This category contains several related service pages. Select one
              below to continue.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {childServicePages.map((service) => (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                className="group block rounded-3xl border border-gray-200 p-6 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-700">
                  {service.hero_heading || service.title || service.meta_title || service.slug}
                </h2>
                {service.hero_content ? (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-4">
                    {service.hero_content}
                  </p>
                ) : null}
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                  View Service
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-3xl font-extrabold text-gray-800">
          404 - Page Not Found
        </h1>
        <p className="text-gray-500 max-w-md">
          The requested service page does not exist or has not been published
          yet.
        </p>
        <Link href="/">
          <Button variant="blueOpen">Go back to Home</Button>
        </Link>
      </div>
    );
  }

  // Header and content selection
  const title = pageData.hero_heading;
  const highlight = pageData.hero_highlight || "According to UK Standards";
  // FIX: hero_content is HTML from the CMS (e.g. "<p>Struggling with
  // Shakespeare?</p>"). It must be rendered as HTML, not printed as text.
  const contentHtml =
    pageData.hero_content ||
    "<p>Get original model essays, complete dissertation proposals, or structural coursework help matching British higher education frameworks.</p>";
  const orderCount = "10,000+";

  const breadcrumbItems = [{ label: "Services", href: "/" }, { label: title }];

  // Guarantee list
  const whyHeading = pageData.why_heading || "Why Students Choose Our Service?";
  const whySubheading =
    pageData.why_subheading ||
    "We design custom academic support frameworks with rigorous quality control measures.";
  const dynamicWhyItems = normalizeArray(pageData.why_items)
    .map((item: any) => ({
      title: item?.heading || item?.title,
      desc: item?.content || item?.desc,
    }))
    .filter((item: any) => item.title || item.desc);
  const whyItems =
    dynamicWhyItems.length > 0 ? dynamicWhyItems : fallbackWhyItems;

  // Experts list
  const expertsToShow = experts.length > 0 ? experts : WRITERS.slice(0, 4);
  const testimonialsToShow = reviews.length > 0 ? reviews : TESTIMONIALS;

  // FIX: these fields were being fetched from the API and then completely
  // ignored. They now drive the two "long copy" sections and an optional
  // CTA banner, falling back to generic copy only when the backend hasn't
  // set them.
  const sectionTwoHeading =
    pageData.section_two_heading ||
    "Expert Assignment Writing Help For Every Academic Need";
  const sectionTwoContent = pageData.section_two_content || null;

  const sectionThreeHeading = pageData.section_three_heading || null;
  const sectionThreeContent = pageData.section_three_content || null;

  const longContentHtml =
    pageData.long_content ||
    `<p>When ordering our professional academic services, you connect with native British tutors holding accredited graduate degrees from leading institutions. We parse complex assignment criteria, gather scholarly evidence from peer-reviewed databases, and design standard analytical structures.</p>
     <p>Whether it is a complex qualitative business case study, a quantitative engineering lab report, or a comprehensive option pricing model for finance coursework, we provide complete, step-by-step documentation. All works undergo secondary checks by our review editors to align grammar and verify citation lists.</p>
     <p>We guarantee 100% human-written content. Every file is analyzed with advanced checking tools to ensure zero trace of AI-generated content or recycled phrasing, keeping your academic record completely secure.</p>`;

  const hasCta = Boolean(pageData.cta_content);

  const steps = [
    { number: 1, icon: (
        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ), title: "Submit Requirements", description: "Share your assignment details and upload instructions." },
    { number: 2, icon: (
        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ), title: "Choose Writer", description: "We assign the best suitable expert for your task." },
    { number: 3, icon: (
        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), title: "Track Progress", description: "Track the progress and stay updated at every step." },
    { number: 4, icon: (
        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ), title: "Receive Draft", description: "Review the draft and request any changes if needed." },
    { number: 5, icon: (
        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.9c2.785 0 5.43-.233 8.01-.683a60.43 60.43 0 00-.49-6.347m-15.26 0A12.01 12.01 0 0112 4.5c2.978 0 5.679 1.085 7.74 2.873m-15.26 2.774L12 14l7.74-4.227m0 0a12.01 12.01 0 003.74-8.273" />
        </svg>
      ), title: "Final Delivery", description: "Get the final assignment on time and score higher." },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section
        className="relative pt-6 pb-8 px-4 md:px-6 lg:px-8 overflow-hidden border-b border-gray-100"
        style={{ background: "linear-gradient(115deg, #ffffff 48%, #faf8ff)" }}
      >
        <div className="relative z-10 max-w-[1250px] mx-auto">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-6 font-medium">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>&gt;</span>
            <Link href="/services" className="hover:text-gray-600 transition-colors">Services</Link>
            <span>&gt;</span>
            <span className="text-[#3f159a] font-semibold">{title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative min-h-0">
            <AnimateIn
              variant="fadeUp"
              className="lg:col-span-7 flex flex-col justify-start items-start text-left z-20 pb-4 lg:pb-0 order-1 relative pt-2"
            >
              <div className="max-w-[75%] lg:max-w-[560px] xl:max-w-[600px] w-full flex flex-col items-start relative z-20">
                <h1
                  className="text-[34px] sm:text-[40px] lg:text-[42px] font-black text-[#0f1b3d] leading-[1.12] tracking-[-0.02em] mb-4"
                  style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
                >
                  {title}
                  <br />
                  {" "}
                  {/* <span className="text-[#3f159a]"></span> */}
                  <span className="text-[#ea580c]">{highlight}</span>
                </h1>

                {/* FIX: render hero_content as HTML, not escaped text */}
                <div
                  className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed mb-6 max-w-[500px] line-clamp-5 [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                <div className="relative w-full max-w-[360px] h-[240px] mx-auto my-4 block lg:hidden z-10">
                  <Image
                    src="/new-subject-sectionimg/herosubject.png"
                    alt={`${title} student`}
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                  <div className="absolute bottom-[20px] right-0 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-2.5 flex items-center gap-2 border border-gray-100 z-20">
                    <div className="w-7 h-7 rounded-full bg-[#fff2ea] flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div className="flex flex-col text-left pr-1">
                      <span className="font-extrabold text-[#0f1b3d] text-[10px] leading-tight">24/7</span>
                      <span className="text-[7px] text-gray-550 font-bold uppercase tracking-wider">Live Support</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 md:flex md:flex-nowrap items-center gap-x-2 lg:gap-x-2.5 gap-y-4 mb-8 max-w-[500px] w-full border-t border-b border-gray-100 py-3 md:border-none md:py-0">
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 md:pr-0">
                    <CheckCircle2 className="w-[18px] h-[18px] text-[#3f159a] shrink-0 mr-1.5 md:mr-2 hidden md:block" />
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11.5px] font-[950] text-[#0f1b3d] leading-none mb-0.5">25,000+</span>
                      <span className="text-[6.5px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">Assignments Delivered</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 md:pr-0">
                    <Users className="w-[18px] h-[18px] text-[#3f159a] shrink-0 mr-1.5 md:mr-2 hidden md:block" />
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11.5px] font-[950] text-[#0f1b3d] leading-none mb-0.5">150+</span>
                      <span className="text-[6.5px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">Subject Experts</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 md:pr-0">
                    <Star className="w-[18px] h-[18px] text-[#3f159a] shrink-0 mr-1.5 md:mr-2 hidden md:block" />
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11.5px] font-[950] text-[#0f1b3d] leading-none mb-0.5">4.9/5</span>
                      <span className="text-[6.5px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">Student Rating</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left border-r border-gray-150 md:border-none last:border-r-0 pr-1 pr-0">
                    <Heart className="w-[18px] h-[18px] text-[#3f159a] shrink-0 mr-1.5 md:mr-2 hidden md:block" />
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11.5px] font-[950] text-[#0f1b3d] leading-none mb-0.5">98%</span>
                      <span className="text-[6.5px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-tight leading-tight md:leading-none">On-Time Delivery</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <a
                    href="#quote-form"
                    className="btn-shutter-blue-open text-white font-bold py-3.5 px-6 rounded-lg text-[13px] transition shadow-md flex items-center justify-center gap-2.5 w-full sm:w-auto text-center shrink-0 cursor-pointer border-none"
                  >
                    Get Free Quote
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <Link
                    href={pageData.cta_button_url || "/samples"}
                    className="btn-shutter-blue-close font-bold py-3.5 px-6 rounded-lg text-[13px] transition shadow-sm flex items-center justify-center gap-2.5 w-full sm:w-auto text-center shrink-0 cursor-pointer"
                  >
                    {pageData.cta_button_label || "View Samples"}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </AnimateIn>

            <div
              className="absolute left-[54%] top-[20px] -translate-x-1/2 w-[420px] h-[450px] select-none pointer-events-none hidden lg:block z-0"
              style={{
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
              }}
            >
              <Image
                src="/new-subject-sectionimg/herosubject.png"
                alt={`${title} student`}
                fill
                className="object-contain object-top"
                priority
              />
            </div>

            <div className="absolute top-[300px] left-[44%] translate-x-[80px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3.5 flex items-center gap-2.5 border border-gray-150 pointer-events-auto z-30 hidden lg:flex">
              <div className="w-8 h-8 rounded-full bg-[#fff2ea] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="font-extrabold text-[#0f1b3d] text-[11px] leading-tight">24/7</span>
                <span className="text-[8px] text-gray-555 font-bold uppercase tracking-wider">Live Support</span>
              </div>
            </div>

            <div className="lg:col-span-1 hidden lg:block order-2" />

            <AnimateIn
              variant="fadeUp"
              delay={0.2}
              className="lg:col-span-4 flex justify-center lg:justify-center items-start z-20 pt-0 order-3"
              id="quote-form"
            >
              <QuoteForm
                variant="compact"
                prefilledSubject={title}
                title="Get Instant Quote"
                className="w-[390px] max-w-full shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              />
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* 2. Meet Your Expert Writer */}
      <SectionContainer className="bg-white py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-10 text-center max-w-[1250px] mx-auto relative">
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-[26px] md:text-[32px] font-black text-[#0f1b3d] tracking-tight font-heading">
              Meet Your <span className="text-[#3f159a]">Expert</span> Writer
            </h2>
          </div>

          <div className="relative">
            <div
              className="flex overflow-x-auto pb-4 lg:pb-0 -mx-4 px-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:mx-0 lg:px-0 gap-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {expertsToShow.slice(0, 4).map((writer, index) => {
                const firstName = writer.name.split(" ")[0];

                const getAvatarUrl = (avatarStr: string, writerName: string, idx: number) => {
                  if (
                    avatarStr &&
                    (avatarStr.startsWith("/") || avatarStr.startsWith("http")) &&
                    !avatarStr.includes("ui-avatars.com")
                  ) {
                    return avatarStr;
                  }
                  const nameLower = writerName.toLowerCase();
                  const isFemale =
                    nameLower.includes("sophia") || nameLower.includes("sophie") ||
                    nameLower.includes("olivia") || nameLower.includes("emily") ||
                    nameLower.includes("sara") || nameLower.includes("chloe") ||
                    nameLower.includes("grace") || nameLower.includes("lily") ||
                    nameLower.includes("jessica") || nameLower.includes("lucy") ||
                    nameLower.includes("mia") || nameLower.includes("ruby") ||
                    nameLower.includes("hannah");

                  if (isFemale) {
                    const females = ["/assets/media/avatars/150-5.jpg", "/assets/media/avatars/150-3.jpg", "/assets/media/avatars/150-9.jpg"];
                    return females[idx % females.length];
                  } else {
                    const males = ["/assets/media/avatars/150-2.jpg", "/assets/media/avatars/150-4.jpg", "/assets/media/avatars/150-10.jpg"];
                    return males[idx % males.length];
                  }
                };

                const avatarUrl = getAvatarUrl(writer.avatar, writer.name, index);

                const formattedRating =
                  typeof writer.rating === "number"
                    ? writer.rating.toFixed(1)
                    : parseFloat(writer.rating || "4.9").toFixed(1);

                const experienceStr = writer.experience
                  ? writer.experience.includes("Years") ? writer.experience : `${writer.experience} Experience`
                  : "6+ Years Experience";

                const qualStr = writer.qualifications || writer.qual || "Master's Qualified";
                const ordersCount = writer.ordersCompleted || writer.orders || "1200+";

                return (
                  <ExpertCard
                    key={writer.id || index}
                    name={writer.name}
                    role={writer.role || `${title} Expert`}
                    rating={parseFloat(formattedRating)}
                    ordersCount={ordersCount}
                    avatar={avatarUrl || "/assets/media/avatars/blank.png"}
                    experience={experienceStr}
                    qualifications={qualStr}
                    variant="subject"
                    className="w-[265px] sm:w-[45%] lg:w-auto shrink-0"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 3. Why Choose Our Service */}
      <SectionContainer className="py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1b3d] tracking-tight font-heading">
              Why Students Choose <span className="text-[#3f159a]">{whyHeading.replace("Why Students Choose ", "")}</span>
            </h2>
            {whySubheading ? (
              <p className="mt-3 text-sm md:text-base text-gray-500 font-semibold leading-relaxed">{whySubheading}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-6 md:gap-y-8">
            {whyItems.map((item: any, idx: number) => {
              const getIcon = (index: number) => {
                const icons = [
                  <svg key="i0" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>,
                  <svg key="i1" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0l.94.94a2.25 2.25 0 010 3.182l-.94.94a2.25 2.25 0 01-3.182 0l-.94-.94a2.25 2.25 0 010-3.182l.94-.94M5 14.5l-.94.94a2.25 2.25 0 000 3.182l.94.94a2.25 2.25 0 003.182 0l.94-.94a2.25 2.25 0 000-3.182L5 14.5" />
                  </svg>,
                  <svg key="i2" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>,
                  <svg key="i3" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>,
                  <svg key="i4" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>,
                  <svg key="i5" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>,
                ];
                return icons[index % icons.length];
              };

              return (
                <div key={idx} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0 select-none">
                  <div className="w-12 h-12 md:w-[56px] md:h-[56px] rounded-full bg-[#f4f2ff] md:bg-[#6c3bc4] flex items-center justify-center text-[#3f159a] md:text-white mb-0 md:mb-4 border border-purple-50 md:border-none shadow-sm md:shadow-[0_4px_14px_rgba(108,59,196,0.25)] shrink-0">
                    {getIcon(idx)}
                  </div>
                  <div className="flex flex-col text-left md:text-center">
                    <h3 className="font-bold text-[#0f1b3d] text-[14px] sm:text-[15px] leading-tight mb-1.5 font-heading">{item.title}</h3>
                    <p className="text-[12px] text-gray-400 leading-relaxed font-normal md:max-w-[180px] md:line-clamp-3">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionContainer>

      {/* 4. FREE With Every Order Banner (unchanged - static perk list, not backend-driven) */}
      <section className="bg-white py-2 md:py-3 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="w-full rounded-2xl py-4 px-5 md:py-4 md:px-6 lg:pr-[190px] text-white bg-gradient-to-r from-[#0b0742] via-[#1a0f69] to-[#3b1793] border border-purple-500/25 shadow-xl relative overflow-hidden select-none">
            <div className="absolute right-0 top-0 bottom-0 w-[40%] pointer-events-none select-none z-0 overflow-hidden">
              <div className="absolute top-[-30px] right-[-40px] w-[180px] h-[180px] rounded-full bg-purple-600/10 border border-purple-500/10" />
              <div className="absolute top-[20px] right-[40px] w-[130px] h-[130px] rounded-full bg-indigo-500/15 border border-indigo-400/15" />
              <div className="absolute bottom-[-30px] right-[-20px] w-[200px] h-[200px] rounded-full bg-purple-500/10 border border-purple-400/10" />
              <div className="absolute bottom-[30px] right-[80px] w-[100px] h-[100px] rounded-full bg-indigo-600/15 border border-indigo-500/15" />
            </div>

            <div className="text-center mb-3.5 z-10 relative">
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white leading-tight">
                <span className="text-[#ff7a00]">FREE</span> With Every Order
              </h2>
              <p className="text-[11px] md:text-xs font-semibold text-white/80 mt-0.5">Worth £92 Included Absolutely FREE</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-5 z-10 relative px-2 lg:px-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3 gap-x-2 flex-1 w-full text-center items-start">
                {[
                  {
                    name: "Turnitin Report",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    )
                  },
                  {
                    name: "AI Report",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        <circle cx="12" cy="8" r="1.2" fill="currentColor" />
                        <circle cx="9" cy="11" r="1.2" fill="currentColor" />
                        <circle cx="15" cy="11" r="1.2" fill="currentColor" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v3m-3 0h6" />
                      </svg>
                    )
                  },
                  {
                    name: "Bibliography & References",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5a2 2 0 012-2h10" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9h4m-4 4h4" />
                      </svg>
                    )
                  },
                  {
                    name: "Title Page",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25h13.5a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V7.5a2.25 2.25 0 012.25-2.25z" />
                      </svg>
                    )
                  },
                  {
                    name: "Proper Formatting",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
                      </svg>
                    )
                  },
                  {
                    name: "Unlimited Revisions",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    )
                  },
                  {
                    name: "24/7 Support",
                    icon: (
                      <svg className="w-6 h-6 mx-auto mb-1 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 11.034V12a6 6 0 01-12 0v-.966m12 0A6.003 6.003 0 0012 5a6.003 6.003 0 00-6 6.034m12 0v1.071c0 .173-.105.328-.268.388l-1.732.646a1.5 1.5 0 01-1.996-1.002L16 11.034zm-12 0v1.071c0 .173.105.328.268.388l1.732.646a1.5 1.5 0 001.996-1.002L8 11.034z" />
                      </svg>
                    )
                  },
                ].map((item, idx, arr) => (
                  <div key={idx} className="flex flex-col items-center justify-start relative px-1">
                    {item.icon}
                    <span className="text-[10px] md:text-[11px] font-extrabold text-white leading-tight mt-1.5 max-w-[110px] select-none">{item.name}</span>
                    {idx < arr.length - 1 && (
                      <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 h-6 w-[1px] bg-white/20 hidden lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[110px] h-[110px] lg:w-[190px] lg:h-[190px] shrink-0 relative lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 flex items-center justify-center z-10 mt-4 lg:mt-0">
              <Image src="/images/gift.png" alt="3D Gift Box" fill className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. What Our Students Say (Carousel) */}
      <SectionContainer className="py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-2 select-none">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1b3d]">
              What <span className="text-[#3f159a]">Our Students Say</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-semibold leading-relaxed">
              Trusted by thousands of students across the UK and worldwide.
            </p>
          </div>

          <TestimonialCarousel testimonials={testimonialsToShow} />
        </div>
      </SectionContainer>

      {/* 6. Process Flow Steps & Stats Banner */}
      <SectionContainer className="bg-white pt-6 pb-0 md:pt-8 md:pb-0 lg:pt-10 lg:pb-0">
        <div className="flex flex-col gap-12 w-full">
          <ProcessSteps steps={steps} title="Our Simple 5-Step Process" />
          <div className="mt-4 w-full">
            <StatsStrip showCta={false} />
          </div>
        </div>
      </SectionContainer>

      {/* FIX: optional CTA banner driven by cta_content/cta_button_label/cta_button_url,
          which previously existed in the API response but were never rendered anywhere. */}
      {hasCta && (
        <SectionContainer className="bg-white pt-6 pb-6 md:pt-8 md:pb-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#f4f2ff] border border-purple-100 p-8 text-center flex flex-col items-center gap-4">
            <div
              className="text-sm md:text-base text-[#0f1b3d] font-semibold leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.cta_content }}
            />
            {pageData.cta_button_label && (
              <a
                href={pageData.cta_button_url || "#quote-form"}
                className="btn-shutter-blue-open text-white font-bold py-3 px-6 rounded-lg text-[13px] transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {pageData.cta_button_label}
              </a>
            )}
          </div>
        </SectionContainer>
      )}

      {/* 3b. Backend-driven "section two" content (was fully hard-coded before) */}
      <SectionContainer className="bg-white pt-6 pb-6 md:pt-8 md:pb-8 lg:pt-10 lg:pb-10">
        <div className="flex flex-col gap-8 text-center max-w-[1000px] mx-auto select-none">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1b3d] tracking-tight">{sectionTwoHeading}</h2>

          {sectionTwoContent ? (
            <div
              className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-gray-500 font-medium max-w-4xl mx-auto text-left [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: sectionTwoContent }}
            />
          ) : (
            <div className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-gray-500 font-medium max-w-4xl mx-auto">
              <p>
                At Assignment In Need, we provide top-quality <strong>assignment writing services</strong> for
                students across the UK and worldwide. Our team of professional academic writers helps you with
                essays, reports, case studies, coursework, dissertations and more. We understand the pressure of
                academic life and are here to make it easier with high-quality, original and well-researched
                assignments.
              </p>
              <p>
                Every assignment is written from scratch based on your requirements. We follow UK university
                guidelines, use authentic references and ensure proper structure, formatting and citation styles.
                Our goal is to help you submit work that stands out and helps you achieve better grades.
              </p>
              <p>
                Whether you need urgent help or guidance on a complex topic, our experts are available 24/7 to
                support you. You focus on your learning, we take care of your assignments!
              </p>
            </div>
          )}

          {sectionThreeContent && (
            <>
              {sectionThreeHeading && (
                <h3 className="text-xl md:text-2xl font-bold text-[#0f1b3d] tracking-tight mt-2">{sectionThreeHeading}</h3>
              )}
              <div
                className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-gray-500 font-medium max-w-4xl mx-auto text-left [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: sectionThreeContent }}
              />
            </>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-4 font-extrabold text-[13px] text-[#0f1b3d]">
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] rounded-full border border-[#3f159a] flex items-center justify-center text-[#3f159a] bg-[#f3f0ff]/40">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <span>Subject Matter Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] rounded-full border border-[#3f159a] flex items-center justify-center text-[#3f159a] bg-[#f3f0ff]/40">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <span>Plagiarism Free Content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] rounded-full border border-[#3f159a] flex items-center justify-center text-[#3f159a] bg-[#f3f0ff]/40">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Affordable Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[32px] h-[32px] rounded-full border border-[#3f159a] flex items-center justify-center text-[#3f159a] bg-[#f3f0ff]/40">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* 7. Dynamic FAQ Accordion */}
      {pageData?.faqs && pageData.faqs.length > 0 && (
        <SectionContainer className="bg-white border-t border-slate-100 py-6 md:py-8 lg:py-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <Badge variant="soft-purple" className="w-fit mx-auto text-xs px-3 py-1 font-bold">FAQs</Badge>
              <Heading level={2} className="text-2xl md:text-3xl font-bold text-text-heading">
                Frequently Asked Questions
              </Heading>
            </div>

            <div className="space-y-4 text-left">
              {pageData.faqs.map((faq: any, idx: number) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-heading font-extrabold text-sm sm:text-base text-text-heading hover:bg-slate-50 transition-colors outline-none"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-text-muted transition-transform duration-200 shrink-0 ml-4",
                          isOpen && "transform rotate-180",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-5 border-t border-slate-100 bg-slate-50/50 text-xs sm:text-sm text-text-body leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      )}

      {/* 8. Backend-driven long-form SEO content (was fully hard-coded before) */}
      <SectionContainer className="bg-surface-lavender py-6 md:py-8 lg:py-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 text-left">
          <Heading level={3} className="text-xl md:text-2xl font-bold text-text-heading">
            Guaranteed Academic Support Under Strict Quality Frameworks
          </Heading>

          <div
            className={cn(
              "block text-sm text-text-body leading-relaxed transition-all duration-300 overflow-hidden space-y-3 rich-text-content",
              !seoExpanded && "max-h-[140px] relative",
            )}
            dangerouslySetInnerHTML={{ __html: longContentHtml }}
          />
          {!seoExpanded && (
            <div className="h-16 -mt-16 bg-gradient-to-t from-surface-lavender to-transparent pointer-events-none" />
          )}

          <button
            onClick={() => setSeoExpanded(!seoExpanded)}
            className="text-xs font-bold text-primary-700 hover:text-primary-600 transition-colors flex items-center gap-1 mt-1 underline"
          >
            {seoExpanded ? "Show Less ▲" : "Read More ▼"}
          </button>
        </div>
      </SectionContainer>

      {/* 9. Bottom Stats Strip */}
      <StatsStrip />
    </div>
  );
}