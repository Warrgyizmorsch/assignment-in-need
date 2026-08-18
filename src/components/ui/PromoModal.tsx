"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, GraduationCap, ChevronDown, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { openQuoteModal } from "@/components/ui/QuoteModal";

interface CustomDropdownOption {
  label: string;
  value: string;
}

const COUNTRY_CODES: CustomDropdownOption[] = getCountries()
  .map((country) => {
    const code = getCountryCallingCode(country);
    const name = (en as any)[country] || country;
    return {
      label: `+${code} (${country === "GB" ? "UK" : name})`,
      value: `+${code}`,
    };
  })
  .sort((a, b) => {
    if (a.value === "+44" && a.label.includes("UK")) return -1;
    if (b.value === "+44" && b.label.includes("UK")) return 1;
    return a.label.localeCompare(b.label);
  });

const SEGMENTS = [
  { label: "40% OFF", color: "#3f159a", value: "40% OFF" }, // 0
  { label: "FREE", color: "#ffb800", value: "FREE" },        // 1
  { label: "10% OFF", color: "#3f159a", value: "10% OFF" }, // 2
  { label: "20% OFF", color: "#ff5500", value: "20% OFF" }, // 3
  { label: "40% OFF", color: "#3f159a", value: "40% OFF" }, // 4
  { label: "FREE", color: "#ffb800", value: "FREE" },        // 5
  { label: "10% OFF", color: "#3f159a", value: "10% OFF" }, // 6
  { label: "20% OFF", color: "#ff5500", value: "20% OFF" }, // 7
];

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [countryLabel, setCountryLabel] = useState("+44 (UK)");
  const [phone, setPhone] = useState("");

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [nextSpinTime, setNextSpinTime] = useState<number | null>(null);
  const [timeLeftStr, setTimeLeftStr] = useState<string>("");

  useEffect(() => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length >= 5) {
      const fullPhone = `${countryCode.trim() || "+44"}${cleanPhone}`;
      const historyRaw = localStorage.getItem("spin_history");
      if (historyRaw) {
        try {
          const history = JSON.parse(historyRaw);
          const lastSpin = history[fullPhone];
          if (lastSpin && Date.now() - lastSpin < 24 * 60 * 60 * 1000) {
            setNextSpinTime(lastSpin + 24 * 60 * 60 * 1000);
            return;
          }
        } catch (e) {}
      }
    }
    setNextSpinTime(null);
  }, [phone, countryCode]);

  useEffect(() => {
    if (!nextSpinTime) {
      setTimeLeftStr("");
      return;
    }
    const interval = setInterval(() => {
      const diff = nextSpinTime - Date.now();
      if (diff <= 0) {
        setNextSpinTime(null);
        setTimeLeftStr("");
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
        setTimeLeftStr(`${h}h : ${m}m : ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextSpinTime]);

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

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("promo_modal_closed", "true");
    }
    setIsOpen(false);
  };

  const getCountryIso = (code: string): string => {
    const digits = code.replace(/[^0-9]/g, "");
    if (!digits) return "GB";
    if (digits === "44") return "GB";
    const matched = getCountries().find((country) => getCountryCallingCode(country) === digits);
    return matched || "GB";
  };

  const getCouponCode = (val: string) => {
    if (val === "40% OFF") return "AIN40";
    if (val === "20% OFF") return "AIN20";
    if (val === "10% OFF") return "AIN10";
    return "AIN40";
  };

  const submitLead = async (wonValue: string) => {
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const cleanCode = countryCode.trim() || "+44";
      const fullPhone = `${cleanCode}${cleanPhone}`;
      const code = getCouponCode(wonValue);

      const payload = {
        name: name.trim(),
        user_name: name.trim(),
        email: `spin_${Date.now()}@assignmentinneed.co.uk`, // Dummy email
        phone: cleanPhone,
        mobile: cleanPhone,
        phone_number: fullPhone,
        countryCode: cleanCode,
        country_code: cleanCode,
        countrycode: cleanCode,
        countryIso: getCountryIso(cleanCode),
        service: "Assignment",
        subject: "General",
        deadline: "5",
        urgency: "5",
        wordCount: "250",
        pages: 1,
        description: `Spin wheel lead from ${name}. Won Coupon: ${code}`,
        message: `Spin wheel lead from ${name}. Won Coupon: ${code}`,
        requirements: `Spin wheel lead from ${name}. Won Coupon: ${code}`,
        notes: `Spin wheel lead from ${name}. Won Coupon: ${code}`,
        coupon_code: code,
        promo_code: code,
        coupon: code,
        source_page: typeof window !== "undefined" ? window.location.href : "https://www.assignmentinneed.co.uk/",
      };

      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };

      let res = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        res = await fetch("/api/submit-enquiry", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        res = await fetch("/api/web-place-order", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }
    } catch (e) {
      console.error("Lead submission failed", e);
    }
  };

  const handleSpin = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.length < 5) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const cleanCode = countryCode.trim() || "+44";
    const fullPhone = `${cleanCode}${cleanPhone}`;
    
    // Check 24-hour limit
    const historyRaw = localStorage.getItem("spin_history");
    let history: Record<string, number> = {};
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch (e) {}
    }
    
    const lastSpin = history[fullPhone];
    if (lastSpin && Date.now() - lastSpin < 24 * 60 * 60 * 1000) {
      toast.error("This number has already spun the wheel in the last 24 hours. Please try again later.");
      return;
    }

    setIsSpinning(true);
    setSpinResult(null);

    // Determine result
    const rand = Math.floor(Math.random() * 1000);
    let targetIndex = 0;

    if (rand < 960) {
      targetIndex = Math.random() > 0.5 ? 0 : 4; // 40% OFF
    } else if (rand < 990) {
      targetIndex = Math.random() > 0.5 ? 2 : 6; // 10% OFF
    } else {
      targetIndex = Math.random() > 0.5 ? 3 : 7; // 20% OFF
    }

    // SVG rotation calculation
    const segmentCenter = (targetIndex * 45) + 22.5;
    const extraSpins = 360 * 5; 
    const newRotation = rotation + extraSpins + (360 - segmentCenter) - (rotation % 360);

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonValue = SEGMENTS[targetIndex].value;
      setSpinResult(wonValue);
      
      // Save spin history
      history[fullPhone] = Date.now();
      localStorage.setItem("spin_history", JSON.stringify(history));
      localStorage.setItem("ain_won_discount", wonValue);

      // Submit lead with won coupon
      submitLead(wonValue);
      
    }, 4500); // Wait for CSS transition
  };

  if (!isOpen) return null;

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
          <path d={pathData} fill={seg.color} stroke="#fff" strokeWidth="1" />
          <text
            x="65"
            y="0"
            fill="#fff"
            fontSize="10"
            fontWeight="bold"
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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[800px] bg-[#f8f5fd] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 z-20 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left: Spin Wheel Area */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-[#fdfbf6] to-[#f4ebe1] flex items-center justify-center p-6 md:p-8 relative">
          <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">
            <div 
              className="w-full h-full rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-white overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
              }}
            >
              <svg viewBox="-100 -100 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                {renderSlices()}
                <circle cx="0" cy="0" r="22" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Center Cap Overlay (Static) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-700 pointer-events-none z-10">
              <GraduationCap className="w-5 h-5" />
            </div>
            
            <div className="absolute top-1/2 -right-4 sm:-right-5 -translate-y-1/2 z-10 filter drop-shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12L22 2V22L2 12Z" fill="#ea580c" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Form Area */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
          <h2 className="text-[26px] sm:text-[32px] font-black text-[#0f1b3d] leading-tight tracking-tight mb-2">
            Spin to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">Save</span> on Your UK Assignment!
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium mb-6">
            Spin the wheel for instant discounts on your first order.
          </p>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              disabled={!!spinResult || isSpinning}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
            />

            <div className="flex gap-2 relative" ref={dropdownRef}>
              <div 
                className={`w-[140px] shrink-0 border border-gray-200 rounded-xl px-3 py-3 sm:py-3.5 text-sm flex items-center justify-between transition-all font-medium ${(spinResult || isSpinning) ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 cursor-pointer hover:border-purple-400'}`}
                onClick={() => {
                  if (!spinResult && !isSpinning) setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <span className="truncate mr-2">{countryLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                disabled={!!spinResult || isSpinning}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
              />

              {isDropdownOpen && !spinResult && !isSpinning && (
                <div className="absolute top-full left-0 mt-1 w-[250px] bg-white border border-gray-100 shadow-xl rounded-xl max-h-60 overflow-y-auto z-50 py-1 text-sm font-medium">
                  {COUNTRY_CODES.map((opt) => (
                    <div
                      key={opt.value + opt.label}
                      onClick={() => {
                        setCountryCode(opt.value);
                        setCountryLabel(opt.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-purple-50 transition-colors ${countryLabel === opt.label ? 'bg-purple-50/50 text-purple-700' : 'text-gray-700'}`}
                    >
                      <span>{opt.label}</span>
                      {countryLabel === opt.label && <Check className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {spinResult ? (
              <button
                onClick={() => {
                  handleClose();
                  openQuoteModal();
                }}
                className="btn-shutter-orange-open w-full mt-3 sm:mt-4 py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-white font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(255,106,18,0.35)] flex items-center justify-center group tracking-wide cursor-pointer border-none uppercase transition-all"
              >
                <span className="relative z-10">REDEEM NOW</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || !!nextSpinTime}
                  className="btn-shutter-orange-open w-full mt-3 sm:mt-4 py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-white font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(255,106,18,0.35)] flex items-center justify-center group tracking-wide cursor-pointer border-none uppercase transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{isSpinning ? "SPINNING..." : "SPIN NOW"}</span>
                </button>
                {nextSpinTime && (
                  <div className="mt-2 text-center text-red-500 font-bold text-sm animate-fadeIn">
                    Next spin available in: {timeLeftStr}
                  </div>
                )}
              </>
            )}
            
            {spinResult && (
              <div className="mt-3 text-center animate-fadeIn text-sm sm:text-base font-bold text-purple-800 flex items-center justify-center gap-1.5">
                🎉 You won {spinResult}, {name}!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
