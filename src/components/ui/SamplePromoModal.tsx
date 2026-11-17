"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, Gift, Loader2, ChevronDown, Check, Sparkles, ShieldCheck, User, Mail, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

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

export function SamplePromoModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isClosedOnThisPageRef = useRef(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [countryLabel, setCountryLabel] = useState("+44 (UK)");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset closed state whenever path changes
  useEffect(() => {
    isClosedOnThisPageRef.current = false;
    if (typeof window !== "undefined") {
      (window as any).__ainSamplePromoOpen = false;
      (window as any).__ainSamplePromoClosed = false;
    }
  }, [pathname]);

  // Sync open state with global window for bottom popup coordination
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__ainSamplePromoOpen = isOpen;
      window.dispatchEvent(
        new CustomEvent("ain-sample-promo-state", {
          detail: { isOpen },
        })
      );
    }
  }, [isOpen]);

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

  const getCountryIso = (code: string): string => {
    const digits = code.replace(/[^0-9]/g, "");
    if (!digits) return "GB";
    if (digits === "44") return "GB";
    const matched = getCountries().find((country) => getCountryCallingCode(country) === digits);
    return matched || "GB";
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hasTriggered = false;

    const showModal = () => {
      if (hasTriggered || isClosedOnThisPageRef.current) return;
      hasTriggered = true;
      cleanup();
      setIsOpen(true);
    };

    // Trigger instantly when cursor moves anywhere
    const handleMouseMove = () => {
      showModal();
    };

    // Exit intent: cursor moves towards top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 50) {
        showModal();
      }
    };

    // Touch devices fallback (touch move / scroll)
    const handleTouchOrScroll = () => {
      showModal();
    };

    // Fallback timer: 1.2 seconds so promo modal opens first
    const fallbackTimer = setTimeout(showModal, 1200);

    const cleanup = () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchOrScroll);
      window.removeEventListener("scroll", handleTouchOrScroll);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchOrScroll, { passive: true });
    window.addEventListener("scroll", handleTouchOrScroll, { passive: true });

    return cleanup;
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/web-submit-quote", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          countryCode: countryCode,
          countryIso: getCountryIso(countryCode),
          service: "Assignment",
          subject: "Sample Free Words Promo",
          deadline: "5",
          wordCount: "500",
          description: `Promo Modal Request for 500 Free Words. Source: ${window.location.href}`,
          source_page: window.location.href,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        isClosedOnThisPageRef.current = true;
        setIsOpen(false);
        if (typeof window !== "undefined") {
          (window as any).__ainSamplePromoOpen = false;
          (window as any).__ainSamplePromoClosed = true;
          window.dispatchEvent(
            new CustomEvent("ain-sample-promo-closed", {
              detail: { closed: true },
            })
          );
        }
        toast.success("Congratulations! We will contact you shortly with your 500 free words!");
      } else {
        toast.error(data.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    isClosedOnThisPageRef.current = true;
    setIsOpen(false);
    if (typeof window !== "undefined") {
      (window as any).__ainSamplePromoOpen = false;
      (window as any).__ainSamplePromoClosed = true;
      window.dispatchEvent(
        new CustomEvent("ain-sample-promo-closed", {
          detail: { closed: true },
        })
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `,
        }}
      />
      <div 
        className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
      >
        <div className="relative w-full max-w-[730px] max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-[0_25px_70px_rgba(20,5,50,0.4)] flex flex-col sm:flex-row animate-slideUp border border-purple-100/80 overflow-hidden">
          {/* Close button - sleek elevated style */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-900 bg-white/90 hover:bg-white shadow-md rounded-full p-2 z-50 transition-all hover:scale-110 cursor-pointer border border-gray-200/80"
          >
            <X className="w-4 h-4 font-bold" />
          </button>

          {/* Left Side: Premium Brand Visual & Offer Highlight */}
          <div className="w-full sm:w-[46%] bg-gradient-to-br from-[#160b33] via-[#2c1356] to-[#4c1d95] p-6 sm:p-8 flex flex-col justify-between text-left text-white relative overflow-hidden shrink-0">
            {/* Glowing background ambient lights */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-fuchsia-500/25 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-purple-950 font-black px-3 py-1 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[0_2px_12px_rgba(245,158,11,0.35)] w-max mb-3">
                <Sparkles className="w-3.5 h-3.5 fill-purple-950 text-purple-950" />
                <span>Exclusive Offer</span>
              </div>

              {/* High-Impact Headline with Outstanding 500 Words Free Banner */}
              <h2 className="text-2xl sm:text-[28px] font-black leading-tight text-white mb-2">
                Unlock
                <span className="block my-1.5 py-1.5 px-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-[#1b0836] font-black rounded-xl shadow-[0_4px_18px_rgba(245,158,11,0.5)] w-max text-2xl sm:text-[30px] tracking-wide transform -rotate-1 border border-yellow-200/60">
                  500 WORDS FREE!
                </span>
              </h2>

              <p className="text-xs sm:text-[13px] font-medium text-purple-200/90 leading-relaxed mb-4">
                Boost your grades instantly. Claim your free 500 words on your first assignment with our UK experts.
              </p>

              {/* Benefits */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                {[
                  "Premium Quality Academic Content",
                  "100% Turnitin Plagiarism-Free Report",
                  "Top-Tier UK University Writers",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-[12.5px] text-white/95 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-300 stroke-[3]" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Bottom security pill */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-purple-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>No Payment Needed • Instant Voucher Code</span>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="p-6 sm:p-8 w-full sm:w-[54%] bg-white flex flex-col justify-center">
            <div className="mb-4 sm:mb-5 text-left">
              <h3 className="text-xl sm:text-[22px] font-black text-gray-900 leading-tight">
                Where should we send it?
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-1">
                Enter your details below to claim your free 500 words instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
              {/* Full Name */}
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 outline-none text-[13px] transition-all text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Full Name"
                />
              </div>

              {/* Phone + Country Code */}
              <div className="flex gap-2 relative" ref={dropdownRef}>
                <div
                  className="w-[125px] shrink-0 border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] flex items-center justify-between transition-all font-medium bg-gray-50 text-gray-800 cursor-pointer hover:bg-white hover:border-purple-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="truncate mr-1 text-xs sm:text-[13px]">{countryLabel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>

                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 outline-none text-[13px] transition-all text-gray-800 font-medium placeholder:text-gray-400"
                    placeholder="Phone Number"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 shadow-2xl rounded-xl max-h-60 overflow-y-auto z-50 py-1 text-[13px] font-medium">
                    {COUNTRY_CODES.map((opt) => (
                      <div
                        key={opt.value + opt.label}
                        onClick={() => {
                          setCountryCode(opt.value);
                          setCountryLabel(opt.label);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-purple-50 transition-colors ${
                          countryLabel === opt.label ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {countryLabel === opt.label && <Check className="w-3.5 h-3.5 text-purple-600" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 outline-none text-[13px] transition-all text-gray-800 font-medium placeholder:text-gray-400"
                  placeholder="Email Address"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 bg-gradient-to-r from-orange-500 via-[#ff6a1a] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3.5 rounded-xl shadow-[0_8px_25px_rgba(249,115,22,0.38)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 uppercase text-[13.5px] tracking-wider cursor-pointer border-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Claim My 500 Words</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10.5px] text-gray-400 mt-0.5 font-medium">
                🔒 100% Confidential • By claiming, you agree to our terms.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
