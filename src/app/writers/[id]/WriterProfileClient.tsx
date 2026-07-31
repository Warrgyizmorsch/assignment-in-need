"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { WRITERS, Writer } from "@/lib/data";
import { getBaseUrl, mapExpertToWriter } from "@/lib/api";
import {
  Star,
  CheckCircle2,
  MapPin,
  BookOpen,
  FolderLock,
  Award,
  ShieldCheck,
  MessageSquare,
  Loader2,
} from "lucide-react";

export default function WriterProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [writer, setWriter] = useState<Writer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchWriter = async () => {
      try {
        setLoading(true);
        const baseUrl = getBaseUrl();
        
        // 1. Try direct ID endpoint
        const res = await fetch(`${baseUrl}/api/experts/${id}`, { cache: "no-store" });
        if (res.ok) {
          const result = await res.json().catch(() => null);
          const expertObj = result?.data?.page || result?.data || result?.expert;
          if (expertObj && typeof expertObj === "object" && !Array.isArray(expertObj)) {
            setWriter(mapExpertToWriter(expertObj));
            return;
          }
        }

        // 2. Try fetching full experts list from backend
        const listRes = await fetch(`${baseUrl}/api/experts`, { cache: "no-store" });
        if (listRes.ok) {
          const listJson = await listRes.json().catch(() => null);
          const expertsArray = Array.isArray(listJson?.data)
            ? listJson.data
            : Array.isArray(listJson)
            ? listJson
            : [];

          const cleanSlug = (str: string) =>
            str
              ?.toLowerCase()
              ?.replace(/^dr\.?\s*/i, "")
              ?.replace(/^prof\.?\s*/i, "")
              ?.replace(/[^a-z0-9]+/g, "-")
              ?.replace(/^-+|-+$/g, "") || "";

          const targetClean = cleanSlug(id);

          const matchedExpert = expertsArray.find((item: any) => {
            if (String(item.id) === String(id)) return true;
            if (item.slug && (item.slug === id || cleanSlug(item.slug) === targetClean)) return true;
            if (item.name && cleanSlug(item.name) === targetClean) return true;
            return false;
          });

          if (matchedExpert) {
            setWriter(mapExpertToWriter(matchedExpert));
            return;
          }
        }

        // 3. Fallback to static WRITERS list
        const cleanSlug = (str: string) =>
          str
            ?.toLowerCase()
            ?.replace(/^dr\.?\s*/i, "")
            ?.replace(/^prof\.?\s*/i, "")
            ?.replace(/[^a-z0-9]+/g, "-")
            ?.replace(/^-+|-+$/g, "") || "";

        const targetClean = cleanSlug(id);

        const staticWriter = WRITERS.find((w) => {
          if (w.id === id || w.id.toLowerCase() === id?.toLowerCase()) return true;
          const wIdClean = cleanSlug(w.id);
          const wNameClean = cleanSlug(w.name);
          return wIdClean === targetClean || wNameClean === targetClean;
        }) || WRITERS.find((w) => {
          const wIdClean = cleanSlug(w.id);
          const wNameClean = cleanSlug(w.name);
          return (targetClean && (wIdClean.includes(targetClean) || targetClean.includes(wIdClean))) ||
                 (targetClean && (wNameClean.includes(targetClean) || targetClean.includes(wNameClean)));
        }) || WRITERS[0];

        setWriter(staticWriter);
      } catch (err) {
        console.error("Error fetching writer details:", err);
        setWriter(WRITERS[0]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWriter();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-[80vh]">
        <SectionContainer className="bg-white pt-2 pb-6 md:pt-4 md:pb-10 lg:pt-4 lg:pb-10">
          {/* Breadcrumb Skeleton */}
          <div className="w-1/4 h-4 bg-slate-200 rounded animate-pulse mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
            {/* LEFT COLUMN: Main profile details (65%) */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left animate-pulse">
              {/* Header Card Skeleton */}
              <div className="bg-gradient-to-br from-primary-50/20 to-white rounded-[2rem] border border-primary-100/50 p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-slate-200 shrink-0" />
                <div className="flex flex-col items-center sm:items-start gap-3 flex-1">
                  <div className="w-48 h-7 bg-slate-200 rounded-md" />
                  <div className="w-24 h-5 bg-slate-200 rounded-full" />
                  <div className="w-32 h-4 bg-slate-200 rounded" />
                </div>
              </div>

              {/* 3x2 Stats Grid Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-center items-center gap-2"
                  >
                    <div className="w-16 h-6 bg-slate-200 rounded" />
                    <div className="w-12 h-3.5 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>

              {/* Skills Section Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="w-32 h-5 bg-slate-200 rounded" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-6 bg-slate-200 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Helps With Section Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="w-28 h-5 bg-slate-200 rounded" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-24 h-6 bg-slate-200 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Biography Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="w-36 h-5 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-slate-200 rounded" />
                  <div className="w-full h-4 bg-slate-200 rounded" />
                  <div className="w-11/12 h-4 bg-slate-200 rounded" />
                  <div className="w-5/6 h-4 bg-slate-200 rounded" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar layout (35%) */}
            <div className="lg:col-span-4 flex flex-col gap-6 animate-pulse">
              {/* Hire Card Skeleton */}
              <div className="p-6 border border-slate-150 rounded-2xl bg-white flex flex-col gap-4">
                <div className="w-2/3 h-5 bg-slate-200 rounded" />
                <div className="space-y-3 py-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded-full shrink-0" />
                      <div className="w-full h-4 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
                <div className="w-full h-11 bg-slate-200 rounded-lg" />
              </div>

              {/* Promo Offer Card Skeleton */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-4">
                <div className="w-1/3 h-4 bg-slate-200 rounded" />
                <div className="w-full h-10 bg-slate-200 rounded" />
                <div className="w-1/2 h-4 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    );
  }

  if (!writer) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Writer Profile Not Found</h2>
        <p className="text-slate-600 mb-6">The writer profile you are looking for could not be found.</p>
        <Button onClick={() => router.push("/writers")}>View All Writers</Button>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Our Writers", href: "/writers" },
    { label: writer.name },
  ];

  return (
    <div className="bg-white">
      <SectionContainer className="bg-white pt-2 pb-6 md:pt-4 md:pb-10 lg:pt-4 lg:pb-10">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
          {/* LEFT COLUMN: Main profile details (65%) */}
          <AnimateIn
            variant="fadeUp"
            className="lg:col-span-8 flex flex-col gap-6 text-left"
          >
            {/* Header Card */}
            <div className="bg-gradient-to-br from-primary-50/40 to-white rounded-card border border-primary-100/50 p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/30 rounded-full blur-2xl pointer-events-none" />

              {/* Profile Ring Avatar */}
              <div className="w-24 h-24 rounded-full bg-white p-1 border-2 border-primary-500 shadow-md flex items-center justify-center overflow-show shrink-0 relative">
                {writer.avatar.length <= 3 ? (
                  <span className="font-heading font-extrabold text-2xl text-primary-700 uppercase">
                    {writer.avatar}
                  </span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={writer.avatar}
                    alt={writer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow border z-50 border-primary-100">
                  <ShieldCheck className="w-4 h-4 text-success fill-success/10" />
                </div>
              </div>

              {/* Title metrics */}
              <div className="flex flex-col items-center sm:items-start gap-1">
                <Heading level={1} className="text-text-heading">
                  {writer.name}
                </Heading>
                <Badge
                  variant="soft-purple"
                  className="text-[10px] py-0.5 px-2.5 font-bold mt-0.5"
                >
                  {writer.role}
                </Badge>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-text-muted font-medium">
                  <div className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-text-heading ml-1">
                    {writer.rating.toFixed(1)}
                  </span>
                  <span>({writer.reviewCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* 3x2 Colored Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-lg text-primary-700">
                  {writer.ordersCompleted}+
                </span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  Orders
                </span>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-lg text-blue-700">
                  {writer.ordersInProgress}
                </span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  In Progress
                </span>
              </div>
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-lg text-success">
                  {writer.reviewCount}
                </span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  Reviews
                </span>
              </div>
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-base text-accent-700 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" /> {writer.location}
                </span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  Location
                </span>
              </div>
              <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 flex flex-col justify-center text-center col-span-2 sm:col-span-1">
                <span className="font-heading font-extrabold text-lg text-purple-700">
                  {writer.successRate}%
                </span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  Success Rate
                </span>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="flex flex-col gap-2.5">
              <span className="flex items-center gap-1.5 font-heading font-bold text-sm text-text-heading border-b border-primary-50 pb-2">
                <Award className="w-4.5 h-4.5 text-primary-500" />
                Skills & Expertise
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {writer.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-primary-700 text-white rounded-pill text-[10px] px-3 py-1 font-bold font-sans"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Helps With */}
            <div className="flex flex-col gap-2.5">
              <span className="flex items-center gap-1.5 font-heading font-bold text-sm text-text-heading border-b border-primary-50 pb-2">
                <BookOpen className="w-4.5 h-4.5 text-primary-500" />
                Helps With
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {writer.helpsWith.map((help) => (
                  <Badge
                    key={help}
                    className="bg-navy-900 text-white rounded-pill text-[10px] px-3 py-1 font-bold font-sans"
                  >
                    {help}
                  </Badge>
                ))}
              </div>
            </div>

            {/* About Biography Expandable */}
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-1.5 font-heading font-bold text-sm text-text-heading border-b border-primary-50 pb-2">
                <FolderLock className="w-4.5 h-4.5 text-primary-500" />
                About {writer.name}
              </span>

              <div
                className={cn(
                  "block text-sm text-text-body leading-relaxed transition-all duration-300 overflow-hidden space-y-3",
                  !isExpanded && "max-h-[140px] relative",
                )}
              >
                {writer.about.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
                {!isExpanded && (
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-primary-700 hover:text-primary-600 transition-colors flex items-center gap-1 mt-1 underline"
              >
                {isExpanded ? "Show Less ▲" : "Read More ▼"}
              </button>
            </div>

            {/* Credentials Row list */}
            <div className="flex flex-col gap-3">
              <span className="font-heading font-bold text-sm text-text-heading border-b border-primary-50 pb-2">
                Credentials & Background
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {writer.credentials.map((cred, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start bg-primary-50/20 p-3.5 rounded-xl border border-primary-100/30"
                  >
                    <Award className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-text-muted font-extrabold uppercase tracking-wide">
                        {cred.label}
                      </span>
                      <span className="text-xs text-text-heading font-bold mt-0.5 break-words">
                        {cred.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>

          {/* RIGHT COLUMN: Sidebar layout (35%) */}
          <AnimateIn
            variant="fadeUp"
            delay={0.15}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Why Choose Card */}
            <Card className="p-6 border-t-4 border-t-primary-700 shadow-md">
              <Heading
                level={4}
                className="text-base border-b border-primary-50 pb-3 text-left"
              >
                Why Choose {writer.name.split(" ")[1]}?
              </Heading>
              <ul className="flex flex-col gap-3 py-4 text-left">
                {[
                  "Qualified & Experienced Writers",
                  "Quality Writing with Zero AI",
                  "Plagiarism Report",
                  "Unlimited Revisions & Reworks",
                  "On-Time Delivery Guaranteed",
                  "24/7 Priority Support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs font-semibold text-text-body"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="blueOpen"
                size="md"
                fullWidth
                onClick={() => {
                  router.push("/pricing");
                }}
              >
                Hire {writer.name.split(" ")[1]} Now
              </Button>
            </Card>

            {/* Promo Card Block */}
            <Card className="p-5 bg-gradient-to-br from-primary-800 to-primary-650 text-white flex flex-col gap-4 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start">
                <div className="flex flex-col max-w-[68%]">
                  <span className="text-[9px] font-extrabold tracking-wider bg-white/15 px-2 py-0.5 rounded-pill w-fit uppercase mb-1.5">
                    First Order Offer
                  </span>
                  <Heading
                    level={4}
                    className="text-sm italic tracking-wide uppercase leading-tight text-white"
                  >
                    TOP-QUALITY, 100% ORIGINAL ASSIGNMENTS
                  </Heading>
                  <p className="text-[10px] text-primary-200 mt-1">
                    Delivered in just a few hours!
                  </p>
                </div>

              </div>

              <ul className="flex flex-col gap-1.5 text-[10px] text-primary-100 font-medium max-w-[66%]">
                <li>✓ Lightning-Fast Delivery</li>
                <li>✓ Guaranteed Originality</li>
                <li>✓ Subject Experts</li>
                <li>✓ Always Available</li>
              </ul>

              <div className="flex flex-col border-t border-white/10 pt-3 relative z-10">
                <span className="text-[10px] text-primary-200">Get Up To</span>
                <span className="font-heading font-black text-2xl text-accent-400">
                  40% OFF
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] bg-success text-white font-extrabold px-2 py-0.5 rounded uppercase">
                    Free CV
                  </span>
                  <span className="text-[9px] text-primary-200">
                    included in the offer
                  </span>
                </div>
              </div>

              <div className="writer-promo-clock" aria-hidden="true">
                <Image
                  src="/images/clock-ain.png"
                  alt=""
                  width={256}
                  height={256}
                  className="writer-promo-clock-image"
                  sizes="(max-width: 1023px) 120px, 135px"
                />
              </div>
            </Card>

            {/* Student Reviews list */}
            {writer.reviews.length > 0 && (
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-primary-50 pb-2">
                  <span className="font-heading font-extrabold text-sm text-text-heading flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    Student Reviews
                  </span>
                  <span className="text-xs text-text-muted font-semibold">
                    {writer.rating} ({writer.reviewCount} Reviews)
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {writer.reviews.slice(0, 3).map((rev, idx) => (
                    <div
                      key={idx}
                      className="bg-primary-50/15 border border-primary-50 rounded-xl p-4 flex flex-col gap-3 relative"
                    >
                      <MessageSquare className="absolute top-3 right-3 w-4 h-4 text-primary-100" />
                      <p className="text-xs italic text-text-body leading-relaxed">
                        &quot;{rev.quote}&quot;
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-heading font-extrabold text-xs flex items-center justify-center uppercase shrink-0">
                          {rev.avatar || rev.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-text-heading truncate">
                            {rev.name}
                          </span>
                          <span className="text-[10px] text-text-muted truncate">
                            {rev.institution}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#reviews"
                  className="text-xs font-bold text-primary-700 hover:text-primary-600 transition-colors text-center underline mt-1"
                >
                  View All Reviews →
                </a>
              </div>
            )}
          </AnimateIn>
        </div>
      </SectionContainer>

      {/* Bottom metrics strip */}
      <StatsStrip />
    </div>
  );
}
