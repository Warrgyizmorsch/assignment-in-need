"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, Gift, Loader2, ChevronDown, Check } from "lucide-react";
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

    // Fallback timer: 3 seconds
    const fallbackTimer = setTimeout(showModal, 3000);

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
        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
      <div className="relative w-full max-w-[700px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col sm:flex-row animate-slideUp border border-purple-100">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-900 transition-colors z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side - Premium Look */}
        <div className="sm:w-[45%] bg-gradient-to-br from-[#1e143b] via-[#3a1d6b] to-[#5a2c99] p-6 sm:p-8 flex flex-col justify-center text-left text-white relative overflow-hidden hidden sm:flex">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-5 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-fuchsia-500 opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-center">
            <span className="bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest w-max mb-5 shadow-sm">
              Exclusive Offer
            </span>
            <h2 className="text-[32px] font-black leading-none mb-3 text-white">
              Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">500 Words</span> Free!
            </h2>
            <p className="text-sm font-medium text-purple-200 leading-relaxed mb-6">
              Boost your grades instantly. Claim your free words on your first assignment with us.
            </p>
            
            <div className="flex flex-col gap-3">
              {[
                "Premium Quality Content",
                "100% Plagiarism Free",
                "Expert UK Writers"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[13px] text-purple-100 font-medium">
                  <div className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="p-6 sm:p-8 sm:w-[55%] bg-white w-full flex flex-col justify-center">
          <div className="mb-5 text-center sm:text-left">
            <h3 className="text-[22px] font-extrabold text-purple-800 mb-1.5">Where should we send it?</h3>
            <p className="text-[13px] text-gray-500 font-medium">Enter your details below to claim your free words.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
            <div>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-[13px] transition-all text-gray-800 font-medium placeholder:text-gray-400" placeholder="Full Name" />
            </div>
            <div className="flex gap-2 relative" ref={dropdownRef}>
              <div 
                className={`w-[130px] shrink-0 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] flex items-center justify-between transition-all font-medium bg-gray-50 text-gray-800 cursor-pointer hover:bg-white hover:border-purple-500`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="truncate mr-2">{countryLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>
              
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-[13px] transition-all text-gray-800 font-medium placeholder:text-gray-400"
                placeholder="Phone Number"
              />

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[250px] bg-white border border-gray-100 shadow-xl rounded-xl max-h-60 overflow-y-auto z-50 py-1 text-[13px] font-medium">
                  {COUNTRY_CODES.map((opt) => (
                    <div
                      key={opt.value + opt.label}
                      onClick={() => {
                        setCountryCode(opt.value);
                        setCountryLabel(opt.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-purple-50 transition-colors ${countryLabel === opt.label ? 'bg-purple-50/50 text-purple-700' : 'text-gray-700'}`}
                    >
                      <span>{opt.label}</span>
                      {countryLabel === opt.label && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-[13px] transition-all text-gray-800 font-medium placeholder:text-gray-400" placeholder="Email Address" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-shutter-orange-open w-full text-white font-extrabold py-3 rounded-lg transition-all mt-1 shadow-[0_6px_20px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase text-[13px] tracking-wider border-none relative group overflow-hidden">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin relative z-10" /> <span className="relative z-10">Claiming...</span></> : <span className="relative z-10">Claim My 500 Words</span>}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-1">By claiming, you agree to our terms of service.</p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
