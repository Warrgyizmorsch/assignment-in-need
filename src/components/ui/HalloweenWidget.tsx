"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Copy, Check, X, Clock, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { openQuoteModal } from "@/components/ui/QuoteModal";

export function HalloweenWidget() {
  const [isAutoExpanded, setIsAutoExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isHoveredRef = useRef(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  // Keep ref in sync with hover state for timer callbacks
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Auto slide-out loop: stays expanded for 3.2s, then reappears every 2s
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const cycle = () => {
      setIsAutoExpanded(true);

      // Stay expanded for 3.2 seconds so user can read offer
      timer = setTimeout(() => {
        if (!isHoveredRef.current) {
          setIsAutoExpanded(false);
        }

        // Wait 2 seconds folded, then pop out again
        timer = setTimeout(() => {
          cycle();
        }, 2000);
      }, 3200);
    };

    // First trigger after 1 second on load
    timer = setTimeout(cycle, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // If user leaves hover while auto-expanded, allow collapse after small grace period
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsAutoExpanded(false);
      }
    }, 1500);
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText("SPOOKY25");
    setCopied(true);
    toast.success("🎃 Code SPOOKY25 copied! 25% OFF applied.", {
      icon: "👻",
      style: {
        borderRadius: "12px",
        background: "#1c0b2b",
        color: "#ff8c00",
        border: "1px solid #ff6a00",
        fontWeight: "bold",
      },
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClaimOffer = () => {
    setIsModalOpen(false);
    handleCopyCode();
    setTimeout(() => {
      openQuoteModal();
    }, 300);
  };

  const isExpanded = isAutoExpanded || isHovered;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. WHATSAPP-STYLE SLIDING HORIZONTAL PILL                      */}
      {/* Positioned comfortably above Refer & Earn with clean gap       */}
      {/* ============================================================== */}
      <div className="fixed bottom-[196px] md:bottom-[calc(50%+136px)] left-0 z-50 select-none max-w-[calc(100vw-16px)]">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Halloween 25% Off Discount Button"
          className={`flex items-center bg-gradient-to-r from-[#17072a] via-[#240b3f] to-[#1a0830] hover:from-[#210a3c] hover:to-[#270c46] text-white rounded-r-full shadow-[0_6px_24px_rgba(255,102,0,0.38)] transform transition-transform duration-500 ease-in-out h-11 sm:h-12 focus:outline-none cursor-pointer border-y border-r border-[#ff6600]/70 group ${
            isExpanded
              ? "translate-x-0"
              : "-translate-x-[calc(100%-48px)] sm:-translate-x-[calc(100%-52px)] hover:translate-x-0"
          }`}
        >
          {/* Text Content (Hidden when folded, revealed when expanded) */}
          <div className="flex items-center gap-2.5 pl-4 pr-3.5 whitespace-nowrap">
            {/* Halloween Mini Pill Tag */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black tracking-wider uppercase bg-[#ff6600]/25 text-[#ff9933] border border-[#ff6600]/60 shadow-sm">
              HALLOWEEN
            </span>

            {/* Offer Text */}
            <span className="font-black text-sm sm:text-base tracking-wide text-white drop-shadow-sm">
              FLAT <span className="text-[#ff7700]">25% OFF</span>
            </span>
          </div>

          {/* Right Icon Box (Always visible at left-0 when folded, identical to WhatsApp button) */}
          <div className="w-[48px] sm:w-[52px] h-11 sm:h-12 flex items-center justify-center shrink-0 bg-[#16062a] rounded-r-full relative border-l border-orange-500/30">
            {/* Glowing 3D Pumpkin Emblem */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#e63a00] p-1 flex items-center justify-center shadow-[0_0_12px_rgba(255,106,0,0.6)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,106,0,0.95)] transition-all duration-300">
              <svg
                className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Pumpkin Green Stem & Curly Vine */}
                <path
                  d="M16 2.5C16 2.5 17.6 3.1 17.9 4.6C18.2 6.1 17.2 7.5 16 8C14.8 7.5 13.8 6.1 14.1 4.6C14.4 3.1 16 2.5 16 2.5Z"
                  fill="#22C55E"
                />
                <path
                  d="M17.5 5C19 3.8 20.8 4.2 21.2 5.8"
                  stroke="#86EFAC"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* 3D Ribbed Pumpkin Segments */}
                <ellipse cx="9" cy="18.5" rx="6.5" ry="9" fill="#EA580C" />
                <ellipse cx="23" cy="18.5" rx="6.5" ry="9" fill="#EA580C" />
                <ellipse cx="12" cy="18.5" rx="6.5" ry="9.5" fill="#F97316" />
                <ellipse cx="20" cy="18.5" rx="6.5" ry="9.5" fill="#F97316" />
                <ellipse cx="16" cy="18.5" rx="6" ry="10" fill="#FB923C" />

                {/* Glowing Candlelit Eyes & Nose */}
                <polygon points="10,14.5 13,17.5 8,17.5" fill="#FEF08A" />
                <polygon points="22,14.5 24,17.5 19,17.5" fill="#FEF08A" />
                <polygon points="16,18 17.5,20.2 14.5,20.2" fill="#FEF08A" />

                {/* Glowing Tooth Carved Smile */}
                <path
                  d="M9 22C11 26 21 26 23 22C21.5 23 20 22 19 23.2C18.2 22 17 22 16 23C15 22 13.8 22 13 23.2C12 22 10.5 23 9 22Z"
                  fill="#FEF08A"
                />
              </svg>
            </div>

            {/* Glowing Accent Ring */}
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FULL INTERACTIVE HALLOWEEN DISCOUNT MODAL                   */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl p-5 sm:p-8 bg-gradient-to-b from-[#1b082e] via-[#120521] to-[#0a0214] text-white border-2 border-orange-500/80 shadow-[0_0_60px_rgba(255,107,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto"
          >
            {/* Background Spooky Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-56 h-56 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors z-10 cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center relative z-10">
              {/* Header Badges with floating bats & pumpkins */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl animate-bounce">🦇</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Spooky Halloween Savings
                </span>
                <span className="text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                  🎃
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 font-heading">
                Claim Your <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">FLAT 25% OFF</span>
              </h2>

              <p className="text-sm text-slate-300 max-w-sm mx-auto mb-5 leading-relaxed">
                Trick or Treat! Don&apos;t let tough assignments or dissertations scare you. Get top UK academic expert assistance at an exclusive 25% discount.
              </p>

              {/* Live Urgency Countdown Timer */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 border border-purple-500/40 mb-6 shadow-inner">
                <div className="flex items-center gap-1 text-xs text-slate-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Offer Ends In:</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-300">
                  <span className="bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/50">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </span>
                  <span>:</span>
                  <span className="bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/50">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </span>
                  <span>:</span>
                  <span className="bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/50 text-orange-400">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>

              {/* Promo Code Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-purple-950/30 to-orange-950/40 border-2 border-dashed border-orange-500/60 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Your Exclusive Coupon Code
                  </div>
                  <div className="text-2xl font-black font-mono tracking-widest text-orange-400 drop-shadow-[0_2px_8px_rgba(255,107,0,0.5)]">
                    SPOOKY25
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleClaimOffer}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-base shadow-[0_5px_25px_rgba(255,107,0,0.5)] hover:shadow-[0_8px_35px_rgba(255,107,0,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🎃 Claim 25% Discount Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href="https://wa.me/447826233106?text=Hi!%20I%20want%20to%20claim%20the%2025%25%20Halloween%20Discount%20(Code:%20SPOOKY25)%20for%20my%20assignment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>💬 Claim on WhatsApp (Fast Response)</span>
                </a>
              </div>

              <div className="mt-4 text-[11px] text-slate-400">
                🔒 Valid on all subjects, assignments, essays & dissertations. 100% Plagiarism-Free.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

