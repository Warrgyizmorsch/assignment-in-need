"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
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
  Loader2
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
        const res = await fetch(`${baseUrl}/api/experts/${id}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setWriter(mapExpertToWriter(result.data));
            return;
          }
        }
        // Fallback to static if not found or unsuccessful
        const staticWriter = WRITERS.find((w) => w.id === id) || WRITERS.find((w) => w.id.toLowerCase() === id?.toLowerCase());
        setWriter(staticWriter || WRITERS[0]);
      } catch (err) {
        console.error("Error fetching writer details:", err);
        const staticWriter = WRITERS.find((w) => w.id === id) || WRITERS.find((w) => w.id.toLowerCase() === id?.toLowerCase());
        setWriter(staticWriter || WRITERS[0]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWriter();
    }
  }, [id]);

  if (loading || !writer) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-sm font-semibold text-text-muted font-heading">Loading expert profile...</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Our Writers", href: "/writers" },
    { label: writer.name },
  ];

  return (
    <div className="bg-white">
      <SectionContainer className="bg-white py-6 md:py-10">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">

          {/* LEFT COLUMN: Main profile details (65%) */}
          <div className="lg:col-span-8 flex flex-col gap-6 text-left">

            {/* Header Card */}
            <div className="bg-gradient-to-br from-primary-50/40 to-white rounded-card border border-primary-100/50 p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/30 rounded-full blur-2xl pointer-events-none" />

              {/* Profile Ring Avatar */}
              <div className="w-24 h-24 rounded-full bg-white p-1 border-2 border-primary-500 shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
                {writer.avatar.length <= 3 ? (
                  <span className="font-heading font-extrabold text-2xl text-primary-700 uppercase">{writer.avatar}</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={writer.avatar} alt={writer.name} className="w-full h-full rounded-full object-cover" />
                )}
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow border border-primary-100">
                  <ShieldCheck className="w-4 h-4 text-success fill-success/10" />
                </div>
              </div>

              {/* Title metrics */}
              <div className="flex flex-col items-center sm:items-start gap-1">
                <Heading level={1} className="text-xl md:text-2xl font-extrabold text-text-heading">
                  {writer.name}
                </Heading>
                <Badge variant="soft-purple" className="text-[10px] py-0.5 px-2.5 font-bold mt-0.5">
                  {writer.role}
                </Badge>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-text-muted font-medium">
                  <div className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-text-heading ml-1">{writer.rating.toFixed(1)}</span>
                  <span>({writer.reviewCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* 3x2 Colored Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-lg text-primary-700">{writer.ordersCompleted}+</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Orders</span>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-lg text-blue-700">{writer.ordersInProgress}</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">In Progress</span>
              </div>
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-lg text-success">{writer.reviewCount}</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Reviews</span>
              </div>
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex flex-col justify-center text-center">
                <span className="font-heading font-extrabold text-base text-accent-700 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" /> {writer.location}
                </span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Location</span>
              </div>
              <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 flex flex-col justify-center text-center col-span-2 sm:col-span-1">
                <span className="font-heading font-extrabold text-lg text-purple-700">{writer.successRate}%</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Success Rate</span>
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
                  <Badge key={skill} className="bg-primary-700 text-white rounded-pill text-[10px] px-3 py-1 font-bold font-sans">
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
                  <Badge key={help} className="bg-navy-900 text-white rounded-pill text-[10px] px-3 py-1 font-bold font-sans">
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

              <div className={cn("block text-sm text-text-body leading-relaxed transition-all duration-300 overflow-hidden space-y-3", !isExpanded && "max-h-[140px] relative")}>
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
                  <div key={idx} className="flex gap-3 items-start bg-primary-50/20 p-3.5 rounded-xl border border-primary-100/30">
                    <Award className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-text-muted font-extrabold uppercase tracking-wide">{cred.label}</span>
                      <span className="text-xs text-text-heading font-bold mt-0.5 break-words">{cred.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar layout (35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Why Choose Card */}
            <Card className="p-6 border-t-4 border-t-primary-700 shadow-md">
              <Heading level={4} className="text-base border-b border-primary-50 pb-3 text-left">
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
                  <li key={item} className="flex items-center gap-2 text-xs font-semibold text-text-body">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
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

              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold tracking-wider bg-white/15 px-2 py-0.5 rounded-pill w-fit uppercase mb-1.5">First Order Offer</span>
                  <Heading level={4} className="text-sm italic tracking-wide uppercase leading-tight text-white">
                    TOP-QUALITY, 100% ORIGINAL ASSIGNMENTS
                  </Heading>
                  <p className="text-[10px] text-primary-200 mt-1">Delivered in just a few hours!</p>
                </div>

                {/* Clock 3D logo representation */}
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0 animate-bounce">
                  ⏰
                </div>
              </div>

              <ul className="flex flex-col gap-1.5 text-[10px] text-primary-100 font-medium">
                <li>✓ Lightning-Fast Delivery</li>
                <li>✓ Guaranteed Originality</li>
                <li>✓ Subject Experts</li>
                <li>✓ Always Available</li>
              </ul>

              <div className="flex flex-col border-t border-white/10 pt-3">
                <span className="text-[10px] text-primary-200">Get Up To</span>
                <span className="font-heading font-black text-2xl text-accent-400">40% OFF</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] bg-success text-white font-extrabold px-2 py-0.5 rounded uppercase">Free CV</span>
                  <span className="text-[9px] text-primary-200">included in the offer</span>
                </div>
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
                  <span className="text-xs text-text-muted font-semibold">{writer.rating} ({writer.reviewCount} Reviews)</span>
                </div>

                <div className="flex flex-col gap-3">
                  {writer.reviews.slice(0, 3).map((rev, idx) => (
                    <div key={idx} className="bg-primary-50/15 border border-primary-50 rounded-xl p-4 flex flex-col gap-3 relative">
                      <MessageSquare className="absolute top-3 right-3 w-4 h-4 text-primary-100" />
                      <p className="text-xs italic text-text-body leading-relaxed">
                        &quot;{rev.quote}&quot;
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-heading font-extrabold text-xs flex items-center justify-center uppercase shrink-0">
                          {rev.avatar || rev.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-text-heading truncate">{rev.name}</span>
                          <span className="text-[10px] text-text-muted truncate">{rev.institution}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <a href="#reviews" className="text-xs font-bold text-primary-700 hover:text-primary-600 transition-colors text-center underline mt-1">
                  View All Reviews →
                </a>
              </div>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* Bottom metrics strip */}
      <StatsStrip />
    </div>
  );
}
