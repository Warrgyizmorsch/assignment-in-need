"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GraduationCap, ChevronDown, Check, Search } from "lucide-react";
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
  { label: "40% OFF", color: "#3f159a", value: "40% OFF" },
  { label: "FREE", color: "#ffb800", value: "FREE" },
  { label: "10% OFF", color: "#3f159a", value: "10% OFF" },
  { label: "20% OFF", color: "#ff5500", value: "20% OFF" },
  { label: "40% OFF", color: "#3f159a", value: "40% OFF" },
  { label: "FREE", color: "#ffb800", value: "FREE" },
  { label: "10% OFF", color: "#3f159a", value: "10% OFF" },
  { label: "20% OFF", color: "#ff5500", value: "20% OFF" },
];

export default function SpinPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [countryLabel, setCountryLabel] = useState("+44 (UK)");
  const [phone, setPhone] = useState("");

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        } catch (e) { }
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

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        email: `spin_${Date.now()}@assignmentinneed.co.uk`,
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

    const historyRaw = localStorage.getItem("spin_history");
    let history: Record<string, number> = {};
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch (e) { }
    }

    const lastSpin = history[fullPhone];
    if (lastSpin && Date.now() - lastSpin < 24 * 60 * 60 * 1000) {
      toast.error("This number has already spun the wheel in the last 24 hours. Please try again later.");
      return;
    }

    setIsSpinning(true);
    setSpinResult(null);

    const rand = Math.floor(Math.random() * 1000);
    let targetIndex = 0;

    if (rand < 960) {
      targetIndex = Math.random() > 0.5 ? 0 : 4;
    } else if (rand < 990) {
      targetIndex = Math.random() > 0.5 ? 2 : 6;
    } else {
      targetIndex = Math.random() > 0.5 ? 3 : 7;
    }

    const segmentCenter = (targetIndex * 45) + 22.5;
    const extraSpins = 360 * 5;
    const newRotation = rotation + extraSpins + (360 - segmentCenter) - (rotation % 360);

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonValue = SEGMENTS[targetIndex].value;
      setSpinResult(wonValue);

      history[fullPhone] = Date.now();
      localStorage.setItem("spin_history", JSON.stringify(history));
      localStorage.setItem("ain_won_discount", wonValue);

      submitLead(wonValue);

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
    <div className="w-full bg-gray-300 flex flex-col items-center justify-center py-4 md:py-8 px-4 min-h-[calc(100vh-140px)]">
      {/* Removed Company Logo */}

      <div className="relative w-full max-w-[800px] bg-[#f8f5fd] rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row">

        {/* Left: Spin Wheel Area */}
        <div className="w-full md:w-[45%] rounded-t-2xl md:rounded-tr-none md:rounded-l-3xl bg-gradient-to-br from-[#fdfbf6] to-[#f4ebe1] flex items-center justify-center p-4 sm:p-5 relative">
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
        <div className="w-full md:w-[55%] rounded-b-2xl md:rounded-bl-none md:rounded-r-3xl p-4 sm:p-6 flex flex-col justify-center bg-white">
          <h2 className="text-[20px] sm:text-[26px] font-black text-[#0f1b3d] leading-tight tracking-tight mb-2">
            Spin to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">Save</span> on Your UK Assignment!
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-4">
            Spin the wheel for instant discounts on your first order.
          </p>

          <div className="flex flex-col gap-3">
            {!spinResult ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  disabled={isSpinning}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                />

                <div className="flex gap-2 relative" ref={dropdownRef}>
                  <div
                    className={`w-[110px] sm:w-[130px] shrink-0 border border-gray-200 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center justify-between transition-all font-medium ${isSpinning ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 cursor-pointer hover:border-purple-400'}`}
                    onClick={() => {
                      if (!isSpinning) setIsDropdownOpen(!isDropdownOpen);
                    }}
                  >
                    <span className="truncate mr-1 sm:mr-2">{countryLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  </div>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    maxLength={13}
                    disabled={isSpinning}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      if (val.length <= 13) {
                        setPhone(val);
                      }
                    }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-500"
                  />

                  {isDropdownOpen && !isSpinning && (
                    <div className="absolute top-full left-0 mt-2 w-[240px] sm:w-[280px] bg-white border border-gray-100 shadow-2xl rounded-xl z-50 flex flex-col overflow-hidden">
                      <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm outline-none focus:border-purple-400 transition-colors"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1 text-sm font-medium">
                        {COUNTRY_CODES.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                          COUNTRY_CODES.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase())).map((opt) => (
                            <div
                              key={opt.value + opt.label}
                              onClick={() => {
                                setCountryCode(opt.value);
                                setCountryLabel(opt.label);
                                setIsDropdownOpen(false);
                                setSearchQuery("");
                              }}
                              className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-purple-50 transition-colors ${countryLabel === opt.label ? 'bg-purple-50/50 text-purple-700' : 'text-gray-700'}`}
                            >
                              <span>{opt.label}</span>
                              {countryLabel === opt.label && <Check className="w-4 h-4" />}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center text-sm">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSpin}
                  disabled={isSpinning || !!nextSpinTime}
                  className="btn-shutter-orange-open w-full mt-2 sm:mt-3 py-3 px-4 sm:px-6 rounded-xl text-white font-black text-sm shadow-[0_10px_25px_rgba(255,106,18,0.35)] flex items-center justify-center group tracking-wide cursor-pointer border-none uppercase transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{isSpinning ? "SPINNING..." : "SPIN NOW"}</span>
                </button>
                {nextSpinTime && (
                  <div className="mt-2 text-center text-red-500 font-bold text-sm animate-fadeIn">
                    Next spin available in: {timeLeftStr}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-2 py-4 px-2 sm:px-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-center flex flex-col items-center justify-center gap-2 transition-all duration-500" style={{ animation: "fadeIn 0.6s ease-out forwards" }}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce border-2 border-green-100">
                  <span className="text-2xl" role="img" aria-label="party">🎉</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-green-700 leading-tight">
                  Congratulations, {name}! You won <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 font-black">{spinResult}</span>
                </h3>
                <p className="text-xs sm:text-sm font-medium text-green-800">
                  Our team will contact you shortly to apply this discount to your first order.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
