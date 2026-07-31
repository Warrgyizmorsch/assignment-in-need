"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Gift,
  ArrowRight,
  FileText,
  Cpu,
  RefreshCw,
  Headset,
  GraduationCap,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { openQuoteModal } from "@/components/ui/QuoteModal";

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup 12 seconds after page load / refresh
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("AIN40");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaimOffer = () => {
    setIsOpen(false);
    openQuoteModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-[600px] bg-white rounded-[22px] sm:rounded-[32px] p-4 sm:p-7 text-[#0f1b3d] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] border border-purple-100 overflow-hidden select-none animate-scaleUp max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-50 hover:bg-purple-100 active:scale-95 transition-all flex items-center justify-center text-purple-700 z-20 border border-purple-100/60 shadow-2xs"
          aria-label="Close promotion modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Header & Gift Box Section */}
        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 relative z-10 pt-0 sm:pt-1">
          {/* Left Text Column */}
          <div className="flex-1 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 text-purple-700 text-[9px] sm:text-xs font-bold tracking-wider uppercase mb-1.5 sm:mb-3 shadow-2xs whitespace-nowrap">
              <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600 shrink-0" />
              <span className="whitespace-nowrap">LIMITED TIME STUDENT OFFER</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-xl sm:text-[32px] font-black text-[#0f1b3d] tracking-tight leading-[1.15] font-heading">
              Get <span className="text-[#ff5500]">40% OFF</span>
              <br className="hidden sm:inline" /> Your First Assignment
            </h2>

            {/* Description */}
            <p className="text-[11px] sm:text-sm font-medium text-gray-500 mt-1 sm:mt-2 leading-tight sm:leading-relaxed max-w-sm">
              Save instantly on your first order and get expert help from{" "}
              <strong className="text-purple-700 font-bold">
                UK academic specialists
              </strong>
              .
            </p>
          </div>

          {/* Right Gift Box Illustration */}
          <div className="relative w-20 h-20 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
            <Image
              src="/images/gift.png"
              alt="40% OFF Gift Box Offer"
              fill
              sizes="(min-width: 640px) 144px, 80px"
              priority
              className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.16)]"
            />
          </div>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-3.5 sm:mt-5">
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#f8f6ff] border border-purple-100/70 text-left">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#0f1b3d] leading-tight">
              Free Plagiarism Report
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#f8f6ff] border border-purple-100/70 text-left">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#0f1b3d] leading-tight">
              Free AI Report
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#f8f6ff] border border-purple-100/70 text-left">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#0f1b3d] leading-tight">
              Unlimited Revisions
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#f8f6ff] border border-purple-100/70 text-left">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
              <Headset className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#0f1b3d] leading-tight">
              24/7 Expert Support
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#f8f6ff] border border-purple-100/70 text-left">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#0f1b3d] leading-tight">
              UK Academic Experts
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#f8f6ff] border border-purple-100/70 text-left">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#0f1b3d] leading-tight">
              100% Confidential Service
            </span>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="w-full mt-3.5 sm:mt-4 bg-[#faf8ff] border-2 border-dashed border-purple-200/90 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col items-start pl-1">
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-purple-600">
              YOUR PROMO CODE
            </span>
            <span className="text-lg sm:text-2xl font-black tracking-[0.2em] text-purple-900 font-mono mt-0.5">
              AIN40
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-white hover:bg-purple-50 active:scale-95 transition-all text-xs sm:text-sm font-bold text-purple-700 border border-purple-200 shadow-2xs shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Main Orange CTA Button */}
        <button
          onClick={handleClaimOffer}
          className="btn-shutter-orange-open w-full mt-3 sm:mt-4 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl text-white font-black text-sm sm:text-lg shadow-[0_10px_25px_rgba(255,106,18,0.35)] flex items-center justify-center gap-2 sm:gap-2.5 group tracking-wide cursor-pointer border-none"
        >
          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
          <span className="relative z-10">Claim My 40% Discount Now</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Dismiss Text */}
        <div className="text-center mt-2.5 sm:mt-3">
          <button
            onClick={handleClose}
            className="text-[11px] sm:text-sm font-semibold text-gray-500 hover:text-purple-800 underline underline-offset-4 transition-colors"
          >
            Continue Without Discount
          </button>
        </div>

        {/* Bottom Trust Strip */}
        <div className="w-full mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-2xl bg-[#f8f6ff] border border-purple-100/70 grid grid-cols-3 gap-1 sm:gap-2.5 text-center text-xs">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 border-r border-purple-100/80 pr-1 sm:pr-2">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#0f1b3d] text-[10px] sm:text-xs leading-none">
                Secure Payment
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight mt-0.5 hidden sm:inline">
                100% Safe & Secure
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 border-r border-purple-100/80 pr-1 sm:pr-2">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 fill-purple-100 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#0f1b3d] text-[10px] sm:text-xs leading-none">
                4.9/5 Rating
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight mt-0.5 hidden sm:inline">
                Trusted by Thousands
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#0f1b3d] text-[10px] sm:text-xs leading-none">
                Instant Response
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight mt-0.5 hidden sm:inline">
                We're Here 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
