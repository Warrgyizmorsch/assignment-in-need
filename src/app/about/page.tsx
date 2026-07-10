"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { mapExpertToWriter } from "@/lib/api";
import {
  GraduationCap,
  Users,
  Clock,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Headset,
  Lock,
  Star,
  BookOpen,
  Mail,
  ArrowRight,
  MessageSquare,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  const steps = [
    {
      number: 1,
      title: "Submit Requirements",
      description: "Share your assignment details with us.",
    },
    {
      number: 2,
      title: "Choose Expert",
      description: "We match you with the best expert for your topic.",
    },
    {
      number: 3,
      title: "Track Progress",
      description: "Track progress and stay updated at every step.",
    },
    {
      number: 4,
      title: "Receive Assignment",
      description: "Get your assignment on time, every time.",
    },
    {
      number: 5,
      title: "Achieve Better Grades",
      description: "Submit with confidence and achieve success.",
    },
  ];

  const platformFeatures = [
    {
      title: "Academic Guidance",
      desc: "Get expert help for assignments, essays, dissertations and more tailored to your needs.",
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
    },
    {
      title: "Referencing Assistance",
      desc: "Accurate referencing in APA, Harvard, MLA, OSCOLA and other major styles.",
      icon: <MessageSquare className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-100",
    },
    {
      title: "Expert Consultation",
      desc: "Connect with subject specialists for clarification and in-depth understanding.",
      icon: <Users className="w-5 h-5 text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Student Resources",
      desc: "Access samples, guides, writing tips and tools to improve your academic skills.",
      icon: <FolderOpen className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100",
    },
  ];

  const trustBadges = [
    {
      label: "100% Original Work",
      icon: <ShieldCheck className="w-4.5 h-4.5 text-[#3f159a]" />,
    },
    {
      label: "Unlimited Revisions",
      icon: <RefreshCw className="w-4.5 h-4.5 text-[#3f159a]" />,
    },
    {
      label: "24/7 Support",
      icon: <Headset className="w-4.5 h-4.5 text-[#3f159a]" />,
    },
    {
      label: "Confidential Service",
      icon: <Lock className="w-4.5 h-4.5 text-[#3f159a]" />,
    },
    {
      label: "Subject Experts",
      icon: <Users className="w-4.5 h-4.5 text-[#3f159a]" />,
    },
    {
      label: "On-Time Delivery",
      icon: <Clock className="w-4.5 h-4.5 text-[#3f159a]" />,
    },
  ];

  const [dynamicExperts, setDynamicExperts] = useState<any[]>([]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch("/api/experts");
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && Array.isArray(payload.data)) {
            const mapped = payload.data.slice(0, 4).map((item: any) => {
              const writer = mapExpertToWriter(item);
              const hasRealImage = writer.avatar && !writer.avatar.includes("blank.png") && !writer.avatar.includes("ui-avatars.com");
              return {
                name: writer.name,
                role: writer.role,
                rating: writer.rating,
                img: hasRealImage ? writer.avatar : "/assets/media/avatars/blank.png",
                orders: writer.ordersCompleted || 1200,
                success: writer.successRate || 98
              };
            });
            setDynamicExperts(mapped);
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchExperts();
  }, []);

  const experts = dynamicExperts.length > 0 ? dynamicExperts : [
    {
      name: "Sophia Adams",
      role: "Marketing Expert",
      rating: 4.9,
      img: "/images/resource/team-1.jpg",
    },
    {
      name: "Dr. James Wilson",
      role: "Finance Expert",
      rating: 4.8,
      img: "/images/resource/team-2.jpg",
    },
    {
      name: "Olivia Bennett",
      role: "Management Expert",
      rating: 4.9,
      img: "/images/resource/team-3.jpg",
    },
    {
      name: "Dr. Daniel Harris",
      role: "Economics Expert",
      rating: 4.7,
      img: "/images/resource/team-4.jpg",
    },
  ];

  return (
    <div className="font-sans text-[#111827] bg-white overflow-hidden">
      {/* 3.1 BREADCRUMB + HEADER */}
      <section className="bg-white border-b border-gray-150 py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1250px] mx-auto text-left">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-[#3f159a] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#3f159a]">About Us</span>
          </div>

          {/* 3.2 HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            {/* Left Column Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#f3f0ff] text-[#3f159a] text-[10px] font-extrabold uppercase tracking-widest w-fit mb-1 shadow-sm">
                ABOUT ASSIGNMENT IN NEED
              </div>

              {/* H1 */}
              <h1 className="text-[34px] sm:text-[42px] lg:text-[45px] font-[900] leading-[1.1] text-[#0f1b3d] tracking-tight">
                Empowering Students Through Expert
                <span className="bg-gradient-to-r from-[#ea580c] to-[#3f159a] bg-clip-text text-transparent block mt-2">
                  Academic Support & Guidance
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-[13px] sm:text-[14px] text-gray-500 font-bold leading-relaxed max-w-[500px]">
                We connect students with professional academic experts who help
                them achieve their goals with confidence, quality and integrity.
              </p>

              {/* 3 Stats Row */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[480px]">
                <div className="flex flex-col bg-[#fbfaff] border border-purple-50 p-3 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] mb-2 shrink-0">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-extrabold text-[15px] text-[#0f1b3d] leading-none mb-1">
                    25,000+
                  </span>
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider leading-tight">
                    Students Supported
                  </span>
                </div>

                <div className="flex flex-col bg-[#fbfaff] border border-purple-50 p-3 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] mb-2 shrink-0">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-extrabold text-[15px] text-[#0f1b3d] leading-none mb-1">
                    150+
                  </span>
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider leading-tight">
                    Subject Experts
                  </span>
                </div>

                <div className="flex flex-col bg-[#fbfaff] border border-purple-50 p-3 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] mb-2 shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-extrabold text-[15px] text-[#0f1b3d] leading-none mb-1">
                    98%
                  </span>
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider leading-tight">
                    On-Time Delivery
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                <Link href="#experts-section">
                  <Button
                    variant="blueOpen"
                    size="md"
                    className="font-extrabold py-3.5 px-6 rounded-lg text-[11px] uppercase tracking-wider transition duration-200 shadow-md"
                  >
                    Meet Our Experts &rarr;
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="blueClose"
                    size="md"
                    className="font-extrabold py-3.5 px-6 rounded-lg text-[11px] uppercase tracking-wider transition duration-200 shadow-sm"
                  >
                    Get Free Quote &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[320px] md:h-[480px]">
              <Image
                src="/new-about-us-img/hero1.png"
                alt="Empowering Students illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3.3 "WHO WE ARE" SPLIT SECTION */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white border-b border-gray-150">
        <div className="max-w-[1250px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Student photo */}
            <div className="lg:col-span-5 relative w-full h-[260px] md:h-[320px] shrink-0">
              <Image
                src="/new-about-us-img/test1.png"
                alt="About Assignment In Need"
                fill
                className="object-contain"
              />
            </div>

            {/* Right Column Content */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <span className="text-[10px] font-extrabold text-[#3f159a] uppercase tracking-widest">
                WHO WE ARE
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-[900] text-[#0f1b3d] tracking-tight">
                About Assignment In Need
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm font-bold leading-relaxed max-w-[620px]">
                Assignment In Need was founded with a simple goal – to provide
                students with accessible, reliable and high-quality academic
                support. We understand the challenges students face, which is
                why we've built a platform that connects you with the best
                academic experts who deliver top-notch assistance tailored to
                your needs.
              </p>

              {/* Checklist */}
              <ul className="flex flex-col gap-3 mt-2">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f4f2ff] text-[#3f159a] flex items-center justify-center shrink-0 border border-purple-50 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#0f1b3d] font-bold">
                    Trusted by students across the UK and worldwide
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f4f2ff] text-[#3f159a] flex items-center justify-center shrink-0 border border-purple-50 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#0f1b3d] font-bold">
                    A team of qualified academic experts
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f4f2ff] text-[#3f159a] flex items-center justify-center shrink-0 border border-purple-50 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#0f1b3d] font-bold">
                    Commitment to quality, originality and confidentiality
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3.4 STATS BANNER — "Numbers Speak of Our Success Story" */}
      <section className="py-12 bg-white border-b border-gray-50">
        <div className="max-w-[1250px] mx-auto px-4">
          <div
            className="rounded-3xl overflow-hidden relative shadow-xl p-8 md:p-10 text-white text-center"
            style={{
              background:
                "linear-gradient(135deg, #120b3c 0%, #2b0e6c 60%, #4c119e 100%)",
            }}
          >
            {/* Subtle sparkle overlay pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

            <p className="text-[20px] sm:text-[24px] font-[900] text-white tracking-tight mb-8 relative z-10 font-heading">
              Numbers Speak of Our Success Story
            </p>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  val: "182,532+",
                  lbl: "Orders Delivered",
                  icon: <CheckCircle2 className="w-4 h-4" />,
                },
                {
                  val: "30,000+",
                  lbl: "Happy Clients",
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  val: "4.8/5",
                  lbl: "Client Rating",
                  icon: <Star className="w-4 h-4" />,
                },
                {
                  val: "4,500+",
                  lbl: "PhD Experts",
                  icon: <GraduationCap className="w-4 h-4" />,
                },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#3f159a] flex items-center justify-center shadow-md">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading font-[950] text-2xl text-white">
                      {stat.val}
                    </span>
                    <span className="text-[9px] text-purple-200/90 font-extrabold uppercase tracking-widest">
                      {stat.lbl}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 "HOW IT WORKS" — 5-step process */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white border-b border-gray-150">
        <div className="max-w-[1250px] mx-auto text-center">
          <h2 className="text-[26px] sm:text-[32px] font-[900] text-[#0f1b3d] tracking-tight mb-3 font-heading">
            How It Works
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full mx-auto mb-12" />

          {/* Desktop flow (horizontal) */}
          <div className="hidden md:flex items-start justify-center gap-0 w-full max-w-[1100px] mx-auto">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center text-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[#f4f2ff] border border-purple-100 flex items-center justify-center shadow-sm">
                      <span className="text-[20px] font-extrabold text-[#3f159a] font-heading">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-[#0f1b3d] leading-snug mt-1 font-heading">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-gray-500 font-bold max-w-[150px] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector */}
                {idx < steps.length - 1 && (
                  <div className="flex items-center pt-6 px-1 shrink-0">
                    <span className="text-[20px] font-extrabold text-[#3f159a]">
                      &rarr;
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile flow (vertical list) */}
          <div className="flex md:hidden flex-col items-center gap-4 w-full max-w-[320px] mx-auto">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="w-full bg-[#fbfaff] border border-gray-150 p-5 rounded-2xl flex flex-col items-center text-center gap-2 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#f4f2ff] flex items-center justify-center border border-purple-50">
                    <span className="text-[14px] font-extrabold text-[#3f159a] font-heading">
                      {step.number}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-[#0f1b3d] font-heading">
                    {step.title}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold leading-normal">
                    {step.description}
                  </p>
                </div>

                {/* Vertical down arrow */}
                {idx < steps.length - 1 && (
                  <div className="text-[20px] font-extrabold text-[#3f159a] py-1">
                    &darr;
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3.6 "OUR MISSION" SPLIT SECTION */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white border-b border-gray-150">
        <div className="max-w-[1250px] mx-auto">
          <div className="bg-[#faf9fe] rounded-3xl border border-purple-50/50 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column Mission content */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <span className="text-[10px] font-extrabold text-[#3f159a] uppercase tracking-widest">
                OUR MISSION
              </span>
              <h2 className="text-[26px] sm:text-[32px] font-[900] text-[#0f1b3d] tracking-tight leading-tight">
                We're On A Mission To Make A Difference
              </h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full mb-3" />
              <p className="text-gray-500 text-xs sm:text-sm font-bold leading-relaxed">
                Our mission is to empower students by providing expert academic
                support that enhances learning, builds confidence, and helps
                them achieve their full potential.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm font-bold leading-relaxed mt-1">
                We believe every student deserves the right guidance to succeed.
              </p>
            </div>

            {/* Right Column Target image graphic */}
            <div className="lg:col-span-5 relative w-full h-[280px] md:h-[350px] rounded-3xl overflow-hidden shadow-md shrink-0">
              <Image
                src="/new-about-us-img/replace1.png"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3.7 "MORE THAN A WRITING PLATFORM" — 4 feature cards */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white border-b border-gray-150">
        <div className="max-w-[1250px] mx-auto text-center">
          <h2 className="text-[26px] sm:text-[32px] font-[900] text-[#0f1b3d] tracking-tight mb-3 font-heading">
            More Than A Writing Platform
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full mx-auto mb-12" />

          {/* Cards container: row on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-150 p-6 rounded-2xl text-left flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shadow-sm shrink-0`}
                >
                  {item.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs sm:text-sm font-extrabold text-[#0f1b3d] font-heading group-hover:text-[#3f159a] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.8 "WHY STUDENTS TRUST US" — 6 icon items */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white border-b border-gray-150">
        <div className="max-w-[1250px] mx-auto text-center">
          <h2 className="text-[26px] sm:text-[32px] font-[900] text-[#0f1b3d] tracking-tight mb-3 font-heading">
            Why Students Trust Us
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#ea580c] to-[#3f159a] rounded-full mx-auto mb-12" />

          {/* 6 Grid items */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustBadges.map((b, idx) => (
              <div
                key={idx}
                className="bg-[#f5f3ff] border border-purple-50 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-[0_2px_8px_rgba(63,21,154,0.01)] hover:scale-[1.03] transition-transform duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-[#3f159a]">
                  {b.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#0f1b3d] leading-snug">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.9 "MEET OUR ACADEMIC EXPERTS" */}
      <section
        className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white border-b border-gray-150"
        id="experts-section"
      >
        <div className="max-w-[1250px] mx-auto">
          {/* Header Row: Title left, link right on desktop */}
          <div className="flex flex-row items-end justify-between mb-8 border-b border-gray-100 pb-3">
            <div className="text-left flex-1 min-w-0 pr-2">
              <h2 className="text-[22px] sm:text-[28px] font-[900] text-[#0f1b3d] tracking-tight font-heading leading-tight">
                Meet Our Academic Experts
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider leading-relaxed mt-1">
                Learn from the best. Our experts are here to help you achieve
                top grades.
              </p>
            </div>
            {/* Desktop link only */}
            <Link
              href="/writers"
              className="hidden md:flex text-[11px] font-extrabold text-[#3f159a] items-center hover:underline uppercase tracking-widest gap-0.5 shrink-0"
            >
              View All Experts <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Experts cards: row on desktop, stacked list on mobile */}
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.map((expert, i) => {
              const firstLetter = (expert.name || "A").charAt(0).toUpperCase();
              const bgGradients = [
                "bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 shadow-indigo-200",
                "bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 shadow-rose-200",
                "bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 shadow-emerald-200",
                "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-amber-200",
              ];
              const activeGradient = bgGradients[i % bgGradients.length];

              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-gray-100 flex flex-col items-center p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(63,21,154,0.06)] hover:-translate-y-1.5 duration-300 w-full relative"
                >
                  {/* Decorative top colored block */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-3xl" />

                  {/* Avatar Section */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shrink-0 mb-4 ring-4 ring-white shadow-md overflow-hidden mt-3 bg-gray-150">
                    <img
                      src={expert.img || "/assets/media/avatars/blank.png"}
                      alt={expert.name}
                      className="w-full h-full object-cover object-center bg-gray-100"
                    />
                  </div>

                  {/* Name and Role */}
                  <div className="flex flex-col items-center flex-1 min-w-0 w-full text-center">
                    <h3 className="font-extrabold text-[#0f1b3d] text-[15px] sm:text-base mb-1 tracking-tight truncate w-full">
                      {expert.name}
                    </h3>
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50/70 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                      {expert.role}
                    </span>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1.5 justify-center mb-4">
                      <div className="flex text-yellow-400 text-xs">
                        ★★★★★
                      </div>
                      <span className="text-[#0f1b3d] text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                        {expert.rating || 4.8}
                      </span>
                    </div>

                    {/* Mini stats row */}
                    <div className="grid grid-cols-2 gap-2 w-full pt-4 border-t border-gray-100 mt-auto text-left">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide m-0">Orders</p>
                        <p className="text-xs font-black text-slate-800 m-0">{expert.orders || "1,200+"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide m-0">Success Rate</p>
                        <p className="text-xs font-black text-emerald-600 m-0">{expert.success || "99"}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile view only "View All Experts" button */}
          <div className="flex md:hidden w-full mt-6">
            <Link href="/writers" className="w-full">
              <Button
                variant="blueClose"
                size="md"
                className="w-full font-extrabold text-[11px] uppercase tracking-wider py-3.5 rounded-lg text-center"
              >
                View All Experts &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3.10 BOTTOM CTA — "Need Expert Academic Support?" */}
      <section className="py-8 bg-white border-b border-gray-50">
        <div className="max-w-[1100px] mx-auto px-4">
          <div
            className="border border-purple-100 shadow-[0_8px_30px_rgba(63,21,154,0.04)] rounded-3xl p-6 pt-12 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative"
            style={{
              background:
                "linear-gradient(110deg, #24105f 0%, #3c168b 58%, #6a23b6 100%)",
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full md:w-auto">
              {/* Overflowing image wrapper */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 -mt-20 md:-my-12 md:-ml-6 shrink-0 z-10">
                <Image
                  src="/assets/media/avatars/books-with-graduation-cap-digital-art-style-education-day-removebg-preview.png"
                  alt="Graduation Cap Books"
                  fill
                  className="object-contain animate-pulse"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white text-[15px] sm:text-[18px] font-black tracking-tight leading-snug m-0">
                  Need Expert Academic Support?
                </p>
                <p className="text-purple-200 text-xs font-bold leading-normal m-0">
                  Join 25,000+ students who trust Assignment In Need for
                  quality, reliability and academic success.
                </p>
              </div>
            </div>
            <Link href="/pricing" className="w-full md:w-auto shrink-0 z-10">
              <Button
                variant="orangeOpen"
                size="md"
                className="font-extrabold py-3.5 px-6 rounded-lg text-[11px] uppercase tracking-wider shadow-md transition duration-200 w-full md:w-auto text-center"
              >
                Get Free Quote &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
