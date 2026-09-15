"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";
import { openQuoteModal } from "@/components/ui/QuoteModal";

const SEGMENTS = [
  { label: "40%", color: "#f0f8ff", value: "40% OFF", isWin: true },
  { label: "10%", color: "#ffffff", value: "10% OFF", isWin: true },
  { label: "20%", color: "#f0f8ff", value: "20% OFF", isWin: true },
  { label: "Sorry", color: "#ffffff", value: "Sorry", isWin: false },
  { label: "40%", color: "#f0f8ff", value: "40% OFF", isWin: true },
  { label: "10%", color: "#ffffff", value: "10% OFF", isWin: true },
  { label: "20%", color: "#f0f8ff", value: "20% OFF", isWin: true },
  { label: "Sorry", color: "#ffffff", value: "Sorry", isWin: false },
];

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [spinsLeft, setSpinsLeft] = useState(3);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [wonCode, setWonCode] = useState<string | null>(null);

  // Robust trigger logic preserved from original
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("promo_modal_closed")) {
      return;
    }

    let triggered = false;
    let timer: NodeJS.Timeout | null = null;

    const triggerPopup = () => {
      if (triggered) return;
      if (typeof window !== "undefined" && sessionStorage.getItem("promo_modal_closed")) return;
      triggered = true;
      setIsOpen(true);
      cleanup();
    };

    const handleMouseMove = () => {
      if (!timer) timer = setTimeout(triggerPopup, 1000);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15) triggerPopup();
    };

    const handleScrollOrTouch = () => {
      if (window.scrollY > 30 || window.pageYOffset > 30) {
        if (!timer) timer = setTimeout(triggerPopup, 800);
      }
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScrollOrTouch);
      window.removeEventListener("touchmove", handleScrollOrTouch);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScrollOrTouch, { passive: true });
    window.addEventListener("touchmove", handleScrollOrTouch, { passive: true });

    return cleanup;
  }, [pathname]);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("promo_modal_closed", "true");
    }
    setIsOpen(false);
  };

  const handleUnlock = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Check if user entered a code
    const enteredCode = clientCode.trim().toUpperCase();
    const isSpecialCode = /^SPIN-[A-Z0-9]{4}-2X$/.test(enteredCode);

    if (enteredCode && !isSpecialCode && enteredCode !== "CLIENT2SPIN") {
      toast.error("Invalid Promo Code.");
      return;
    }

    const historyRaw = localStorage.getItem("spin_history_emails");
    let history: Record<string, { spinsLeft: number, lastSpin: number }> = {};
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch (e) { }
    }

    // If they used a valid special code, give them exactly 2 spins for this session!
    if (isSpecialCode || enteredCode === "CLIENT2SPIN") {
      setSpinsLeft(2);
    } else {
      const userData = history[email.toLowerCase()];
      if (userData) {
        if (Date.now() - userData.lastSpin > 24 * 60 * 60 * 1000) {
          setSpinsLeft(3); // Default 3 daily spins
        } else {
          if (userData.spinsLeft <= 0) {
            toast.error("You have 0 spins left for today. Please come back tomorrow!");
            return;
          }
          setSpinsLeft(userData.spinsLeft);
        }
      } else {
        setSpinsLeft(3); // Default 3 spins for new users
      }
    }

    setStep(2);
  };

  const getCouponCode = (val: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    if (val === "40% OFF") return `AIN40-${randomSuffix}`;
    if (val === "20% OFF") return `AIN20-${randomSuffix}`;
    if (val === "15% OFF") return `AIN15-${randomSuffix}`;
    if (val === "10% OFF") return `AIN10-${randomSuffix}`;
    if (val === "5% OFF") return `AIN5-${randomSuffix}`;
    return `AIN40-${randomSuffix}`;
  };

  const submitLead = async (wonValue: string, code: string) => {
    try {
      const payload = {
        name: "Spin Wheel User",
        user_name: "Spin Wheel User",
        email: email,
        phone: "0000000000",
        mobile: "0000000000",
        phone_number: "+440000000000",
        countryCode: "+44",
        country_code: "+44",
        countrycode: "+44",
        countryIso: "GB",
        service: "Assignment",
        subject: "General",
        deadline: "5",
        urgency: "5",
        wordCount: "250",
        pages: 1,
        description: `Spin wheel lead. Email: ${email}. Won: ${wonValue}. Coupon: ${code}`,
        message: `Spin wheel lead. Email: ${email}. Won: ${wonValue}. Coupon: ${code}`,
        requirements: `Spin wheel lead. Email: ${email}. Won: ${wonValue}. Coupon: ${code}`,
        notes: `Spin wheel lead. Email: ${email}. Won: ${wonValue}. Coupon: ${code}`,
        coupon_code: code,
        promo_code: code,
        coupon: code,
        source_page: typeof window !== "undefined" ? window.location.href : "https://www.assignmentinneed.co.uk/",
      };

      const headers = { "Accept": "application/json", "Content-Type": "application/json" };
      let res = await fetch("/api/web-submit-quote", { method: "POST", headers, body: JSON.stringify(payload) });
      if (!res.ok) {
        res = await fetch("/api/submit-enquiry", { method: "POST", headers, body: JSON.stringify(payload) });
      }
      if (!res.ok) {
        res = await fetch("/api/web-place-order", { method: "POST", headers, body: JSON.stringify(payload) });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    setIsSpinning(true);
    setSpinResult(null);
    setWonCode(null);

    // Weighted probability out of 1000 spins:
    // 40% OFF -> 900 times (indices 0, 4)
    // 10% OFF -> 15 times (indices 1, 5)
    // 20% OFF -> 5 times (indices 2, 6)
    // Sorry -> 80 times (indices 3, 7)

    let targetIndex = 0;
    const rand = Math.floor(Math.random() * 1000); // 0 to 999

    if (rand < 900) {
      const idx = [0, 4];
      targetIndex = idx[Math.floor(Math.random() * idx.length)]; // 40% OFF (900/1000)
    } else if (rand < 915) {
      const idx = [1, 5];
      targetIndex = idx[Math.floor(Math.random() * idx.length)]; // 10% OFF (15/1000)
    } else if (rand < 920) {
      const idx = [2, 6];
      targetIndex = idx[Math.floor(Math.random() * idx.length)]; // 20% OFF (5/1000)
    } else {
      const sorryIndexes = [3, 7];
      targetIndex = sorryIndexes[Math.floor(Math.random() * sorryIndexes.length)]; // Sorry (80/1000)
    }

    const segmentCenter = (targetIndex * 45) + 22.5;
    const extraSpins = 360 * 5;
    const currentRotationMod = rotation % 360;
    const nextRotation = rotation + extraSpins + ((270 - segmentCenter - currentRotationMod + 720) % 360);

    setRotation(nextRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const result = SEGMENTS[targetIndex];
      setSpinResult(result.value);

      const newSpinsLeft = spinsLeft - 1;
      setSpinsLeft(newSpinsLeft);

      const historyRaw = localStorage.getItem("spin_history_emails");
      let history: any = {};
      if (historyRaw) {
        try { history = JSON.parse(historyRaw); } catch (e) { }
      }
      history[email.toLowerCase()] = {
        spinsLeft: newSpinsLeft,
        lastSpin: Date.now()
      };
      localStorage.setItem("spin_history_emails", JSON.stringify(history));

      if (result.isWin) {
        const code = getCouponCode(result.value);
        setWonCode(code);
        localStorage.setItem("ain_won_discount", result.value);
        localStorage.setItem("ain_won_code", code);
        submitLead(result.value, code);
        toast.success(`Congratulations! You won ${result.value} (Code: ${code})`);
      } else {
        if (newSpinsLeft > 0) {
          toast.error(`Aw, you got ${result.value}. You have ${newSpinsLeft} spin(s) left!`);
        } else {
          toast.error("Sorry, you didn't win this time and have no spins left.");
        }
      }
    }, 4500);
  };

  const renderSlices = () => {
    return SEGMENTS.map((seg, i) => {
      const startAngle = (i * 45 * Math.PI) / 180;
      const endAngle = ((i + 1) * 45 * Math.PI) / 180;
      const x1 = Math.cos(startAngle) * 100;
      const y1 = Math.sin(startAngle) * 100;
      const x2 = Math.cos(endAngle) * 100;
      const y2 = Math.sin(endAngle) * 100;

      const largeArcFlag = 0;
      const pathData = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      const textAngle = (i * 45) + 22.5;

      return (
        <g key={i}>
          <path d={pathData} fill={seg.color} stroke="#93c5fd" strokeWidth="1.5" />
          <text
            x="65"
            y="0"
            fill="#3b1c7a"
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${textAngle})`}
          >
            {seg.label}
          </text>
        </g>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#eef4f9]/95 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[500px] flex flex-col items-center my-auto py-8">

        {/* Brand header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-8 h-8 text-[#3b1c7a]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#3b1c7a] tracking-wider uppercase">
              Assignment In Need
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold tracking-widest uppercase">
            Quality Assignments. Trusted by Thousands.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn border border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 z-20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 1 ? (
            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d42] mb-3">
                Spin the wheel
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mb-8 px-2 font-medium">
                Enter your email to unlock your spins. Each email gets 2 spins.
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-base outline-none focus:border-[#4c1d95] focus:ring-4 focus:ring-purple-50 transition-all text-gray-800 font-semibold mb-4 shadow-sm"
              />

              <input
                type="text"
                placeholder="Special Code (Optional)"
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 text-base outline-none focus:border-[#4c1d95] focus:ring-4 focus:ring-purple-50 transition-all text-gray-800 font-semibold mb-6 shadow-sm"
              />

              <button
                onClick={handleUnlock}
                className="btn-shutter-primary w-full text-white font-bold py-4 rounded-2xl uppercase tracking-wide text-[15px]"
              >
                Unlock my spins
              </button>
            </div>
          ) : (
            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
              <p className="text-gray-600 font-semibold text-[17px] mb-8">
                You have {spinsLeft} spin{spinsLeft !== 1 ? 's' : ''} left. Good luck!
              </p>

              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mb-8">
                <div
                  className="w-full h-full rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.12)] bg-white overflow-hidden border-[4px] border-[#60a5fa]"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: "transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
                  }}
                >
                  <svg viewBox="-100 -100 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    {renderSlices()}
                    <circle cx="0" cy="0" r="18" fill="#fff" stroke="#60a5fa" strokeWidth="2.5" />
                    <text x="0" y="2" fill="#3b1c7a" fontSize="10" fontWeight="900" textAnchor="middle" alignmentBaseline="middle">
                      SPIN
                    </text>
                  </svg>
                </div>

                {/* Pointer Arrow */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 filter drop-shadow-md">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="#3b1c7a" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22L2 2h20L12 22z" />
                  </svg>
                </div>
              </div>

              {spinResult && (
                <div className="mb-5 flex flex-col items-center">
                  <div className="text-[#3b1c7a] font-black text-[22px] animate-bounce">
                    {spinResult === "Sorry" ? "Better luck next time!" : `You won ${spinResult}!`}
                  </div>
                  {wonCode && (
                    <div className="mt-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-bold border border-purple-200">
                      Your Code: {wonCode}
                    </div>
                  )}
                </div>
              )}

              {spinResult && spinResult !== "Sorry" ? (
                <button
                  onClick={() => {
                    handleClose();
                    openQuoteModal();
                  }}
                  className="btn-shutter-orange-open w-full text-white font-black py-4 rounded-2xl uppercase tracking-wider text-[15px] mb-4"
                >
                  Claim Discount Now
                </button>
              ) : (
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || spinsLeft <= 0}
                  className="btn-shutter-primary w-full text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-[15px] mb-4"
                >
                  {isSpinning ? "Spinning..." : "Spin the wheel"}
                </button>
              )}

              <p className="text-[15px] text-gray-500 font-medium">
                {spinsLeft} spin{spinsLeft !== 1 ? 's' : ''} remaining for this email.
              </p>

              <p className="text-[13px] text-gray-400 mt-5 font-medium max-w-xs leading-relaxed">
                Screenshot this screen where the arrow stops as proof of your discount.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
