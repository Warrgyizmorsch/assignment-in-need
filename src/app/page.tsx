"use client";

import React from "react";
import Link from "next/link";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { TrustSlider } from "@/components/ui/TrustSlider";
import { UniversityLogos } from "@/components/ui/UniversityLogos";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SubjectCard } from "@/components/ui/SubjectCard";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { ExpertCarousel } from "@/components/ui/ExpertCarousel";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Heading } from "@/components/ui/Heading";
import SeoContentSection from "@/components/home/SeoContentSection";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import {
  UploadCloud,
  UserCheck,
  Cpu,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FileText,
  HelpCircle,
  Star,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { WRITERS, SUBJECTS, BLOG_POSTS, TESTIMONIALS, FAQS } from "@/lib/data";
import { BlogSection } from "@/components/ui/BlogSection";
import { SampleSection } from "@/components/ui/SampleSection";
import HeroSection from "@/components/home/HeroSection";
import PopularServices from "@/components/home/PopularServices";
import ExploreSubjects from "@/components/home/ExploreSubjects";
import PromoBannerHome from "@/components/home/PromoBannerHome";
import AssignmentSamples from "@/components/home/AssignmentSamples";
import ResultsAndTools from "@/components/home/ResultsAndTools";
import ReviewsAndFaq from "@/components/home/ReviewsAndFaq";
import CtaBanner from "@/components/home/CtaBanner";
import { WritersAndTrust } from "@/components/home/WritersAndTrust";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Assignment In Need",
  alternateName: "Assignment In Need UK",
  url: "https://assignmentinneed.co.uk/",
  logo: "https://assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
  description:
    "Assignment In Need offers expert academic assistance for UK students, including essays, dissertations, coursework, and case studies, delivered by 150+ subject specialists.",
  telephone: "+44 78262 33106",
  email: "order@assignmentinneed.co.uk",
  priceRange: "£8 - £25",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Roehampton Lane",
    addressLocality: "London",
    postalCode: "SW15 5PU",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "City", name: "London" },
    { "@type": "City", name: "Manchester" },
    { "@type": "City", name: "Birmingham" },
    { "@type": "City", name: "Leeds" },
    { "@type": "City", name: "Glasgow" },
    { "@type": "City", name: "Liverpool" },
    { "@type": "City", name: "Cardiff" },
    { "@type": "City", name: "Bristol" },
    { "@type": "City", name: "Oxford" },
    { "@type": "City", name: "Sheffield" },
    { "@type": "City", name: "Edinburgh" },
  ],
  sameAs: [
    "https://www.instagram.com/assignmentinneedofficial/",
    "https://twitter.com/assignment_in",
    "https://www.youtube.com/@assignmentinneed1169",
    "https://in.pinterest.com/assignnmentinneed66/",
    "https://www.facebook.com/profile.php?id=61564613120071",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "25000",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://assignmentinneed.co.uk/#webpage",
  url: "https://assignmentinneed.co.uk/",
  name: "Assignment Help UK | Human-Written Academic Support",
  isPartOf: { "@id": "https://assignmentinneed.co.uk/#website" },
  about: { "@id": "https://assignmentinneed.co.uk/#organization" },
  description:
    "Need reliable Assignment Help UK? Get human-written essays, reports, coursework, and dissertations from subject specialists who understand UK universities.",
  inLanguage: "en-GB",
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "en-GB",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is assignment help legal in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, seeking assignment help is completely legal. Our services are designed to provide research assistance, model papers, and academic guidance to help you understand your topic better and improve your own writing.",
      },
    },
    {
      "@type": "Question",
      name: "How fast can you deliver my order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer flexible delivery options ranging from standard delivery (a few days) to urgent delivery within 24 hours or even less, depending on the complexity of the task.",
      },
    },
    {
      "@type": "Question",
      name: "Will my assignment be plagiarism-free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Every paper is written from scratch by our experts. We also provide a free plagiarism report with your completed order to guarantee its originality.",
      },
    },
    {
      "@type": "Question",
      name: "Can I communicate with my expert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can easily communicate with your assigned expert through our secure messaging portal to track progress, provide additional materials, or ask questions.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer unlimited revisions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer unlimited free revisions within a specified timeframe to ensure you are 100% satisfied with the final work delivered.",
      },
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Assignment In Need",
  image: "https://assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
  url: "https://assignmentinneed.co.uk/",
  telephone: "+44 78262 33106",
  priceRange: "£8 - £25",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Roehampton Lane",
    addressLocality: "London",
    postalCode: "SW15 5PU",
    addressCountry: "GB",
  },
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    webPageSchema,
    faqPageSchema,
    localBusinessSchema,
  ].map(({ "@context": _context, ...schema }) => schema),
};

export default function Home() {
  const steps = [
    {
      number: 1,
      icon: <UploadCloud className="w-6 h-6" />,
      title: "Submit Requirements",
      description: "Share your assignment details and specifications with us.",
    },
    {
      number: 2,
      icon: <UserCheck className="w-6 h-6" />,
      title: "Get Matched",
      description: "We pair you with the best writer for your subject.",
    },
    {
      number: 3,
      icon: <Cpu className="w-6 h-6" />,
      title: "Drafting & Quality Checks",
      description: "Your writer works while we perform quality checks.",
    },
    {
      number: 4,
      icon: <FileCheck2 className="w-6 h-6" />,
      title: "Download Work",
      description: "Get your completed high-quality assignment.",
    },
  ];

  // Map free promo items
  const freeBadges = [
    { icon: <CheckCircle2 />, label: "Plagiarism Report" },
    { icon: <CheckCircle2 />, label: "Paraphrase Check" },
    { icon: <CheckCircle2 />, label: "Title Page Maker" },
    { icon: <CheckCircle2 />, label: "APA Bibliography" },
    { icon: <CheckCircle2 />, label: "Layout Formatting" },
    { icon: <CheckCircle2 />, label: "Unlimited Revisions" },
    { icon: <CheckCircle2 />, label: "24/7 Priority Support" },
  ];

  return (
    <div className="bg-white home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageSchema, null, 2).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      {/* 1. Hero Section */}
      <HeroSection />

      <PopularServices />

      <ExploreSubjects />
      <PromoBannerHome />
      <AssignmentSamples />

      <SeoContentSection />
      <ResultsAndTools />
      <WritersAndTrust />
      <ReviewsAndFaq />
      <CtaBanner />

    </div>
  );
}
