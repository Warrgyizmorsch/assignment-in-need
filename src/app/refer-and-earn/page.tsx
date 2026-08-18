"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Gift,
  Link as LinkIcon,
  Share2,
  Copy,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  Zap,
  Lock,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trophy,
} from "lucide-react";

export default function ReferAndEarnPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [phoneTab, setPhoneTab] = useState<"link" | "share" | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [activeSharePopover, setActiveSharePopover] = useState<'hero' | 'footer' | null>(null);
  const [copiedState, setCopiedState] = useState<'phone' | 'popover' | 'banner' | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      setCanShare(true);
    }
  }, []);

  const handleNativeShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: "Assignment Help",
          text: "Get £10 off your first assignment order!",
          url: "https://www.assignmentinneed.co.uk/refer-and-earn"
        });
      } catch (e) {
        console.log("Share failed", e);
      }
    }
  };

  const handleCopy = (source: 'phone' | 'popover' | 'banner') => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://www.assignmentinneed.co.uk/refer-and-earn");
      setCopiedState(source);
      setTimeout(() => {
        setCopiedState((prev) => prev === source ? null : prev);
      }, 2000);
    }
  };

  const REVIEWS = [
    {
      name: "Emily R.",
      meta: "University of Leeds",
      text: "Amazing experience! Earning £10 for every friend I refer has been great.",
      image: "/assets/media/layout/testimonial/testimonial1.webp",
      rating: 5,
    },
    {
      name: "Daniel K.",
      meta: "University of Manchester",
      text: "High-quality work and excellent communication. The referral bonus was credited instantly!",
      image: "/assets/media/layout/testimonial/testimonial2.webp",
      rating: 5,
    },
    {
      name: "Sophia L.",
      meta: "King's College London",
      text: "Very professional and reliable service. Getting rewarded to share it is just a bonus.",
      image: "/assets/media/layout/testimonial/testimonial3.webp",
      rating: 5,
    }
  ];

  useEffect(() => {
    setRealReviews(REVIEWS);
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const json = await response.json();
          const raw = json?.data?.data ?? json?.data ?? json?.reviews ?? [];
          if (Array.isArray(raw) && raw.length > 0) {
            const mapped = raw.slice(0, 5).map((r: any) => ({
              name: r.name || r.student_name || "Student",
              meta: r.university || r.location || "UK University",
              text: r.description || r.review || r.text || r.message,
              image: r.image ? (r.image.startsWith("http") ? r.image : `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.assignmentinneed.com"}${r.image.startsWith("/") ? r.image : `/${r.image}`}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name || 'Student')}&background=f3e8ff&color=6b21a8&size=80`,
              rating: parseFloat(r.customer_rating || r.rating) || 5,
            }));
            setRealReviews(mapped);
          }
        }
      } catch (err) {
        console.log("Failed to load reviews");
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (isHovered || realReviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % realReviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, realReviews.length]);

  const activeReviews = realReviews.length > 0 ? realReviews : REVIEWS;
  const nextReview = () => setCurrentReview((prev) => (prev + 1) % activeReviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);

  const faqs = [
    {
      q: "How do I get my referral link?",
      a: "Simply log into your account and navigate to the Refer & Earn section to find your unique link.",
    },
    {
      q: "How much can I earn?",
      a: "You earn £10 for every friend who successfully places their first qualifying order. There is no limit!",
    },
    {
      q: "What does my friend receive?",
      a: "Your friend receives £10 off their very first order when they sign up using your referral link.",
    },
    {
      q: "When will I receive my reward?",
      a: "Rewards are credited to your account balance as soon as your friend completes their first payment.",
    },
    {
      q: "Is there a limit to referrals?",
      a: "No! You can refer as many friends as you want and keep earning £10 for every successful referral.",
    },
  ];

  const SharePopover = ({ id }: { id: 'hero' | 'footer' }) => (
    <AnimatePresence>
      {activeSharePopover === id && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-100 p-3 z-50 text-left min-w-[280px]"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-[12px] font-bold text-[#1e1b4b]">Share Via</p>
            <button onClick={() => setActiveSharePopover(null)} className="text-gray-400 hover:text-red-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
          </div>
          <div className="flex justify-around items-center mb-3">
            <a href="https://api.whatsapp.com/send?text=Get%20assignment%20help%20and%20%C2%A310%20off%20your%20first%20order!%20Use%20my%20referral%20link:%20https://www.assignmentinneed.co.uk/refer-and-earn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
              <div className="w-10 h-10 rounded-md bg-[#25D366] text-white flex items-center justify-center"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" /></svg></div>
              <span className="text-[10px] font-bold text-gray-500 mt-1">WhatsApp</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.assignmentinneed.co.uk/refer-and-earn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
              <div className="w-10 h-10 rounded-md bg-[#1877F2] text-white flex items-center justify-center"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg></div>
              <span className="text-[10px] font-bold text-gray-500 mt-1">Facebook</span>
            </a>
            <a href="mailto:?subject=Get%20%C2%A310%20off%20your%20first%20assignment%20order!&body=Hey!%20I%20found%20this%20great%20assignment%20help%20service.%20Use%20my%20referral%20link%20to%20get%20%C2%A310%20off%20your%20first%20order:%20https://www.assignmentinneed.co.uk/refer-and-earn" className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
              <div className="w-10 h-10 rounded-md bg-slate-800 text-white flex items-center justify-center"><Mail className="w-5 h-5" /></div>
              <span className="text-[10px] font-bold text-gray-500 mt-1">Email</span>
            </a>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-md flex items-center p-1.5">
            <input type="text" readOnly value="https://www.assignmentinneed.co.uk/refer-and-earn" className="bg-transparent text-[11px] font-semibold text-gray-600 w-full outline-none px-2" />
            <button onClick={() => handleCopy('popover')} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-md shrink-0 transition-colors min-w-[60px] text-center">
              {copiedState === 'popover' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-12">
      {/* ── HERO SECTION ── */}
      <section className="relative bg-white overflow-hidden py-10 md:py-24 border-b border-slate-100">

        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-[#3f159a] px-4 py-2 rounded-full font-bold text-sm mb-6 border border-purple-100 shadow-sm">
              <Gift className="w-4 h-4 text-orange-500" />
              Referral Rewards Program
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] leading-[1.15] mb-6 relative">
              Refer a Friend & <br />
              <span className="text-[#3f159a] relative inline-block">
                Earn Rewards!
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#3f159a] opacity-80" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10 T 200 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
              </span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Know someone who needs assignment help? <br className="hidden sm:block" />
              Share your referral link and <span className="font-extrabold text-[#3f159a]">earn £10</span> when they place their first qualifying order.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center lg:justify-start">
              <div className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#f8f5ff] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#3f159a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Your Friend Gets</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-extrabold text-[#1e1b4b]">£10 OFF</span>
                    <span className="text-[11px] text-gray-400 font-medium">on first order</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#f8f5ff] flex items-center justify-center shrink-0">
                  <Gift className="w-6 h-6 text-[#3f159a]" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">You Earn</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-extrabold text-[#1e1b4b]">£10</span>
                    <span className="text-[11px] text-gray-400 font-medium">for every referral</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto lg:mx-0 w-full sm:w-max block sm:inline-block">
              <Button onClick={() => setActiveSharePopover(activeSharePopover === 'hero' ? null : 'hero')} variant="orangeOpen" size="lg" icon={true} className="w-full !rounded-md">
                Refer a Friend Now
              </Button>
              <SharePopover id="hero" />
            </div>
            <div className="mt-5 flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500" /> 100% Safe</span> <span className="text-gray-300">|</span>
              <span>Quick & Easy</span> <span className="text-gray-300">|</span>
              <span>Win Together</span>
            </div>
          </div>

          {/* Right Image & Phone Mockup */}
          <div className="flex-1 relative w-full h-[500px] lg:h-[650px] flex items-center justify-center lg:justify-end mt-6 lg:mt-0">

            {/* Girl Background Image */}
            <div className="hidden md:block absolute inset-0 left-0 bottom-0 z-10 pointer-events-none">
              <img src="/images/Refer-and-Earn.webp" alt="Refer and Earn" className="absolute bottom-0 -left-24 lg:-left-64 h-[110%] lg:h-[135%] w-[120%] lg:w-[160%] max-w-none object-contain object-bottom" />
            </div>

            {/* CSS Phone Mockup */}
            <div className="relative z-20 w-[290px] h-[580px] bg-white rounded-[3rem] border-[6px] border-[#1e1b4b] shadow-[0_30px_60px_rgba(30,27,75,0.2)] flex flex-col overflow-hidden shrink-0 mr-0 lg:-mr-4 bg-gradient-to-b from-white to-slate-50">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                <div className="w-32 h-5 bg-[#1e1b4b] rounded-b-3xl"></div>
              </div>

              {/* Phone Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden pt-8 pb-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-40 bg-white">

                {/* Fake Navbar */}
                <div className="flex items-center justify-between mb-6">
                  <img src="/assets/media/layout/ain-logo.webp" alt="Assignment In Need Logo" className="h-6 object-contain" />
                  <div className="flex flex-col justify-between h-3.5 w-5 opacity-70">
                    <div className="w-full h-0.5 bg-[#1e1b4b] rounded-full"></div>
                    <div className="w-full h-0.5 bg-[#1e1b4b] rounded-full"></div>
                    <div className="w-full h-0.5 bg-[#1e1b4b] rounded-full"></div>
                  </div>
                </div>

                {/* Hero text inside phone */}
                <div className="text-center mb-5">
                  <h4 className="text-[22px] font-extrabold text-[#1e1b4b] leading-[1.15] mb-4">
                    Refer a Friend & <br />
                    <span className="text-[#3f159a] relative inline-block">
                      Earn Rewards!
                      <svg className="absolute w-full h-2 -bottom-1 left-0 text-[#3f159a] opacity-80" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10 T 200 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed max-w-[220px] mx-auto font-medium">Share your link and earn £10 when they place their first qualifying order.</p>
                </div>

                {/* Reward Cards inside phone */}
                <div className="flex flex-col gap-2 mb-6 px-1">
                  <div className="bg-white rounded-2xl p-2.5 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50">
                    <div className="w-9 h-9 rounded-full bg-[#f8f5ff] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[#3f159a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Your Friend Gets</p>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="text-[14px] font-extrabold text-[#1e1b4b]">£10 OFF</span>
                        <span className="text-[7px] text-gray-400 font-medium">on first order</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-2.5 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50">
                    <div className="w-9 h-9 rounded-full bg-[#f8f5ff] flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-[#3f159a]" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">You Earn</p>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="text-[14px] font-extrabold text-[#1e1b4b]">£10</span>
                        <span className="text-[7px] text-gray-400 font-medium">for every referral</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Button inside phone */}
                <div className="px-1 mb-6">
                  <Button onClick={() => setPhoneTab(phoneTab === "share" ? null : "share")} variant="orangeOpen" className="w-full !rounded-md shadow-md text-xs py-3">
                    Refer a Friend Now <span className="font-normal ml-2">→</span>
                  </Button>
                </div>

                {/* How it works inside phone */}
                <div className="text-center relative px-2">
                  <h5 className="font-extrabold text-[13px] text-[#1e1b4b] mb-4">How It Works</h5>
                  <div className="flex justify-between items-center px-1">
                    <div
                      className="flex flex-col items-center gap-2 group cursor-pointer relative"
                      onClick={() => setPhoneTab(phoneTab === "link" ? null : "link")}
                    >
                      <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-transform ${phoneTab === "link" ? "bg-blue-600 text-white shadow-md scale-110" : "bg-[#f4f7ff] text-blue-600 group-hover:scale-105"}`}>
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-[#1e1b4b]">Get Link</span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                      onClick={() => setPhoneTab(phoneTab === "share" ? null : "share")}
                    >
                      <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-transform ${phoneTab === "share" ? "bg-purple-600 text-white shadow-md scale-110" : "bg-[#fdf4ff] text-purple-600 group-hover:scale-105"}`}>
                        <Share2 className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-[#1e1b4b]">Share</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-[42px] h-[42px] rounded-full bg-[#f4f6ff] text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Gift className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-[#1e1b4b]">Earn</span>
                    </div>
                  </div>

                  {/* Popups inside phone */}
                  <AnimatePresence>
                    {phoneTab === "link" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-100 p-3 z-50 text-left"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-bold text-[#1e1b4b]">Your Link</p>
                          <button onClick={() => setPhoneTab(null)} className="text-gray-400 hover:text-red-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                          </button>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-md flex items-center p-1">
                          <input type="text" readOnly value="https://www.assignmentinneed.co.uk/refer-and-earn" className="bg-transparent text-[9px] font-semibold text-gray-600 w-full outline-none px-1" />
                          <button onClick={() => handleCopy('phone')} className="bg-blue-600 hover:bg-blue-700 text-white text-[8px] font-bold px-2 py-1 rounded-md shrink-0 transition-colors min-w-[45px] text-center">
                            {copiedState === 'phone' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {phoneTab === "share" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-100 p-3 z-50 text-left"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] font-bold text-[#1e1b4b]">Share Via</p>
                          <button onClick={() => setPhoneTab(null)} className="text-gray-400 hover:text-red-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                          </button>
                        </div>
                        <div className="flex justify-around">
                          <a href="https://api.whatsapp.com/send?text=Get%20assignment%20help%20and%20%C2%A310%20off%20your%20first%20order!%20Use%20my%20referral%20link:%20https://www.assignmentinneed.co.uk/refer-and-earn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                            <div className="w-8 h-8 rounded-md bg-[#25D366] text-white flex items-center justify-center"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" /></svg></div>
                            <span className="text-[8px] font-bold text-gray-500">WhatsApp</span>
                          </a>
                          <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.assignmentinneed.co.uk/refer-and-earn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                            <div className="w-8 h-8 rounded-md bg-[#1877F2] text-white flex items-center justify-center"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg></div>
                            <span className="text-[8px] font-bold text-gray-500">Facebook</span>
                          </a>
                          <a href="mailto:?subject=Get%20%C2%A310%20off%20your%20first%20assignment%20order!&body=Hey!%20I%20found%20this%20great%20assignment%20help%20service.%20Use%20my%20referral%20link%20to%20get%20%C2%A310%20off%20your%20first%20order:%20https://www.assignmentinneed.co.uk/refer-and-earn" className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                            <div className="w-8 h-8 rounded-md bg-slate-800 text-white flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                            <span className="text-[8px] font-bold text-gray-500">Email</span>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Phone bottom indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 rounded-full z-50"></div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e1b4b] mb-4">How Our Refer-a-Friend Program Works</h2>
        <p className="text-gray-500 mb-16 font-medium">It's simple. Just share, and get rewarded!</p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">

          {/* Step 1 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner mb-6 relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center font-bold text-sm text-[#1e1b4b]">1</div>
              <LinkIcon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#1e1b4b] mb-2">Get Your Link</h3>
            <p className="text-sm text-gray-500 max-w-[220px]">Create your referral account and get your unique referral link.</p>
          </div>

          <div className="hidden md:flex flex-shrink-0 text-[#3f159a] items-center justify-center -space-x-5">
            <motion.div animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>
              <ChevronRight className="w-10 h-10" />
            </motion.div>
            <motion.div animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>
              <ChevronRight className="w-10 h-10" />
            </motion.div>
            <motion.div animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>
              <ChevronRight className="w-10 h-10" />
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-20 h-20 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner mb-6 relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center font-bold text-sm text-[#1e1b4b]">2</div>
              <Share2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#1e1b4b] mb-2">Share With Friends</h3>
            <p className="text-sm text-gray-500 max-w-[220px]">Send your link through WhatsApp, Messenger, email or social media.</p>
          </div>

          <div className="hidden md:flex flex-shrink-0 text-[#3f159a] items-center justify-center -space-x-5">
            <motion.div animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>
              <ChevronRight className="w-10 h-10" />
            </motion.div>
            <motion.div animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>
              <ChevronRight className="w-10 h-10" />
            </motion.div>
            <motion.div animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>
              <ChevronRight className="w-10 h-10" />
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner mb-6 relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center font-bold text-sm text-[#1e1b4b]">3</div>
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#1e1b4b] mb-2">Get Rewarded</h3>
            <p className="text-sm text-gray-500 max-w-[220px]">When your friend completes a qualifying order, your reward is credited.</p>
          </div>
        </div>
      </section>

      {/* ── SHARE BANNER ── */}
      <section id="share-banner" className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-center justify-between gap-6 shadow-sm border border-white">

          {/* Left: Gift Box & Heading */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left shrink-0">
            {/* Gift Box */}
            <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 flex items-center justify-center relative">
              <img src="/images/gift.png" alt="Gift Box" className="w-full h-full object-contain drop-shadow-md" />
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-extrabold text-[#1e1b4b] mb-1">
                Share Your <span className="text-[#3f159a]">Referral Link</span>
              </h3>
              <p className="text-sm font-medium italic text-gray-600">and Start Earning!</p>
            </div>
          </div>

          {/* Middle: Link & Buttons Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-1 w-full max-w-2xl">
            <div className="bg-slate-50 p-1.5 rounded-xl flex items-center gap-2 mb-4 border border-slate-100 w-full overflow-hidden">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 shrink-0">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value="https://www.assignmentinneed.co.uk/refer-and-earn"
                className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-semibold text-gray-600 focus:outline-none px-1 sm:px-2"
              />
              <Button onClick={() => handleCopy('banner')} variant="blueOpen" size="sm" className="shrink-0 px-3 sm:px-5 text-xs sm:text-sm !rounded-md min-w-[100px]">
                {copiedState === 'banner' ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
              <span className="text-[10px] font-bold text-gray-600 tracking-wide">Share directly:</span>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <a href="https://api.whatsapp.com/send?text=Get%20assignment%20help%20and%20%C2%A310%20off%20your%20first%20order!%20Use%20my%20referral%20link:%20https://www.assignmentinneed.co.uk/refer-and-earn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" /></svg> WhatsApp
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.assignmentinneed.co.uk/refer-and-earn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg> Facebook
                </a>
                <a href="mailto:?subject=Get%20%C2%A310%20off%20your%20first%20assignment%20order!&body=Hey!%20I%20found%20this%20great%20assignment%20help%20service.%20Use%20my%20referral%20link%20to%20get%20%C2%A310%20off%20your%20first%20order:%20https://www.assignmentinneed.co.uk/refer-and-earn" className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-slate-100">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                {canShare && (
                  <button onClick={handleNativeShare} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-slate-100">
                    <MoreHorizontal className="w-3.5 h-3.5" /> More
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden xl:block w-px h-24 bg-purple-200 shrink-0 mx-2" />

          {/* Right: Pro Tip Card */}
          <div className="bg-[#e6f8ea] border border-[#c3eed1] rounded-2xl p-4 text-center w-full xl:w-40 shrink-0 shadow-sm">
            <div className="mx-auto text-[#1c9641] mb-2 flex justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#1c9641] text-xs mb-1">Pro Tip:</h4>
            <p className="text-[10px] text-[#247c3c] leading-snug">Share your link on WhatsApp for higher rewards!</p>
          </div>

        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section className="py-10 bg-white border-y border-slate-100 mb-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e1b4b] mb-2">Why Your Friends Will Thank You</h2>
          <p className="text-gray-500 mb-12 font-medium">More than just savings — share a trusted academic support service.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#1e1b4b] mb-2">Qualified Experts</h3>
              <p className="text-sm text-gray-500">Get help from subject specialists.</p>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#1e1b4b] mb-2">On-Time Delivery</h3>
              <p className="text-sm text-gray-500">Deadlines matter. We understand them.</p>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#1e1b4b] mb-2">Confidential</h3>
              <p className="text-sm text-gray-500">Your details stay completely private.</p>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#1e1b4b] mb-2">Quality Focused</h3>
              <p className="text-sm text-gray-500">Original, well-researched academic support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM INFO: TESTIMONIALS & FAQ ── */}
      <section className="max-w-6xl mx-auto px-4 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Testimonials */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-[#1e1b4b]">What Our Students Say</h2>
            <div className="flex gap-2">
              <button onClick={prevReview} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-gray-400 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextReview} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-gray-600 hover:bg-slate-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 min-h-[180px] items-start"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-200 shrink-0 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-gray-400 font-bold text-center">
              <img src={activeReviews[currentReview]?.image} alt={activeReviews[currentReview]?.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <div className="flex-1">
              <div className="flex text-amber-400 mb-2">
                {[...Array(activeReviews[currentReview]?.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[#1e1b4b] font-bold text-base sm:text-lg mb-3">
                “{activeReviews[currentReview]?.text}”
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">— {activeReviews[currentReview]?.name}, <span className="font-normal">{activeReviews[currentReview]?.meta}</span></p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#1e1b4b] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-[#1e1b4b] hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-4 text-sm text-gray-600 border-t border-slate-50 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA BANNER ── */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#290d6b] to-[#4c1db0] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Ready to Share & Earn?</h2>
              <p className="text-purple-200 text-sm">Refer your friends today and enjoy rewards together!</p>
            </div>
          </div>
          <div className="relative shrink-0 w-full md:w-max block md:inline-block mt-4 md:mt-0">
            <Button onClick={() => setActiveSharePopover(activeSharePopover === 'footer' ? null : 'footer')} variant="orangeOpen" size="lg" icon={true} className="w-full shadow-xl">
              Refer a Friend Now
            </Button>
            <SharePopover id="footer" />
          </div>
        </div>
      </section>

    </div>
  );
}
