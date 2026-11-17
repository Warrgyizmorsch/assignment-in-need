"use client";

import React, { useState, useEffect } from "react";

export function WhatsAppButton() {
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [isAutoPopped, setIsAutoPopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Listen to bottom popup active status
  useEffect(() => {
    // Check initial global state if already set
    if (typeof window !== "undefined" && (window as any).__ainBottomPopupActive) {
      setIsBannerActive(true);
    }

    const handleBannerActive = (e: any) => {
      setIsBannerActive(Boolean(e.detail?.active));
      if (e.detail?.active) {
        setIsAutoPopped(false); // Force close immediately when banner is active
      }
    };

    window.addEventListener("ain-bottom-popup-active", handleBannerActive);
    return () => {
      window.removeEventListener("ain-bottom-popup-active", handleBannerActive);
    };
  }, []);

  // "jb ye popup rhe tba whatsapp ka popup open close na ho udhar side me die (folded) rahe"
  // "jese vo popup close ker de to fhir vo popup bhar ander ho"
  useEffect(() => {
    // If bottom banner is showing, DO NOT auto-pop at all!
    if (isBannerActive) {
      setIsAutoPopped(false);
      return;
    }

    // When bottom banner is closed or absent:
    // 1. Initial pop after 3.5 seconds
    const initialTimer = setTimeout(() => {
      setIsAutoPopped(true);
      setTimeout(() => setIsAutoPopped(false), 3800);
    }, 3500);

    // 2. Auto-pop every 7 to 9 seconds (8s interval)
    const interval = setInterval(() => {
      setIsAutoPopped(true);
      setTimeout(() => {
        setIsAutoPopped(false);
      }, 3800);
    }, 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isBannerActive]);

  // Expand only if hovered, OR if auto-popped while banner is closed
  const isExpanded = isHovered || (!isBannerActive && isAutoPopped);

  return (
    <div
      className="fixed bottom-32 left-0 z-50 transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href="https://wa.me/447917481696?text=Hi%2C%20I%20want%20to%20claim%20EXTRA%20FLAT%2010%25%20OFF"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp - EXTRA FLAT 10% OFF"
        className="flex items-center bg-gradient-to-r from-[#20ba59] to-[#25D366] text-white rounded-r-full shadow-[0_4px_25px_rgba(37,211,102,0.5)] border border-green-300/40 h-[52px] focus:outline-none overflow-hidden transition-all duration-500 ease-out hover:scale-105"
      >
        {/* Expanded Content - smoothly expands/collapses width with zero overflow leakage */}
        <div
          className={`flex flex-col items-start leading-tight transition-all duration-500 ease-out overflow-hidden ${
            isExpanded
              ? "max-w-[200px] opacity-100 pl-4 pr-3 py-1"
              : "max-w-0 opacity-0 p-0 pointer-events-none"
          }`}
        >
          <span className="text-[11px] font-medium text-white/95 whitespace-nowrap">
            Order on WhatsApp
          </span>
          <span className="text-xs font-black text-yellow-300 tracking-wider whitespace-nowrap drop-shadow-sm">
            EXTRA FLAT 10% OFF
          </span>
        </div>

        {/* Circular WhatsApp Icon (Always visible on the folded edge) */}
        <div className="w-[52px] h-[52px] flex items-center justify-center shrink-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
            <svg
              width="24"
              height="24"
              className="fill-current text-[#25D366]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}
