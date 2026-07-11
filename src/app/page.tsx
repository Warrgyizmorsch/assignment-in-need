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
      {/* 1. Hero Section */}
      <HeroSection />

      <PopularServices />

      <ExploreSubjects />
      <PromoBannerHome />
      <AssignmentSamples />

      <SeoContentSection />
      <ResultsAndTools />
      {/* <WritersAndTrust /> */}
      <ReviewsAndFaq />
      <CtaBanner />

    </div>
  );
}
