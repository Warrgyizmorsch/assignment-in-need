"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { X, Phone, Mail } from "lucide-react";

export default function HomeBottomPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [qrTargetUrl, setQrTargetUrl] = useState("https://www.assignmentinneed.co.uk/app");

  useEffect(() => {
    // Dynamically set QR URL:
    // In local dev, use local LAN IP so scanning from a phone on WiFi works immediately!
    // In production, use the live assignmentinneed.co.uk/app router!
    if (typeof window !== "undefined") {
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        setQrTargetUrl("http://192.168.29.27:3000/app");
      } else {
        setQrTargetUrl(`${window.location.origin}/app`);
      }
    }

    // 1. Initial 1.5-second trigger on page visit/load
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 1500);

    // 2. Show immediately on scroll down on homepage
    const handleScroll = () => {
      if (!isDismissed && window.scrollY > 80) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDismissed]);

  // Sync banner active status across all widgets (WhatsApp button, etc.)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__ainBottomPopupActive = isVisible;
      window.dispatchEvent(
        new CustomEvent("ain-bottom-popup-active", {
          detail: { active: isVisible },
        })
      );
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true); // Closed for this view only. When user revisits/refreshes, it shows again!
    if (typeof window !== "undefined") {
      (window as any).__ainBottomPopupActive = false;
      window.dispatchEvent(
        new CustomEvent("ain-bottom-popup-active", {
          detail: { active: false },
        })
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Academic Support & App Download"
      // Positioned at the bottom with subtle gap (bottom-2) and maximum browser z-index (2147483647) to overlap over any widget
      style={{ zIndex: 2147483647 }}
      className="fixed bottom-2 md:bottom-2.5 left-0 right-0 px-2 sm:px-4 pointer-events-none transition-all duration-500 ease-out animate-in slide-in-from-bottom-6"
    >
      {/* Taller height (min-h-[115px] md:min-h-[125px], py-5 md:py-6) and generous width for a prominent, premium banner */}
      <div className="max-w-5xl mx-auto pointer-events-auto relative rounded-3xl bg-gradient-to-r from-[#14052e] via-[#260b57] to-[#14052e] text-white border-2 border-purple-400/40 shadow-[0_12px_50px_rgba(10,2,26,0.9)] backdrop-blur-2xl py-5 px-4 sm:py-5.5 sm:px-6 md:py-6 md:px-8 min-h-[115px] md:min-h-[125px] flex items-center">
        {/* Close Button - elevated on top right */}
        <button
          onClick={handleClose}
          aria-label="Close notification"
          className="absolute -top-3.5 -right-2 md:top-3 md:right-3.5 w-8 h-8 rounded-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 focus:outline-none z-30 border border-gray-200 cursor-pointer"
        >
          <X className="w-4 h-4 font-bold" />
        </button>

        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3.5 md:gap-5">
          {/* Left: Text & Pitch (Bigger font sizes and clear spacing) */}
          <div className="text-center lg:text-left flex-1 min-w-0 pr-6 lg:pr-2">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
              <h3 className="font-black text-base sm:text-lg md:text-xl tracking-wide uppercase bg-gradient-to-r from-amber-300 via-white to-purple-200 bg-clip-text text-transparent whitespace-nowrap">
                Do You Face Academic Challenges?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 font-medium">
              Turn Stress into Success : Receive expert solutions & 24/7 academic support.
            </p>
          </div>

          {/* Center: Action Buttons (WhatsApp, Call, Email - Taller and prominent) */}
          <div className="flex items-center flex-wrap justify-center gap-2.5 shrink-0">
            {/* WhatsApp */}
            <a
              href="https://wa.me/447826233106?text=Hi%2C%20I%20need%20academic%20assignment%20help"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
              </svg>
              <span>Whatsapp</span>
            </a>

            {/* Call */}
            <a
              href="tel:+447917481696"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>

            {/* Email */}
            <a
              href="mailto:order@assignmentinneed.co.uk"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-xl bg-[#ff6b00] hover:bg-[#e56000] text-white font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>

          {/* Right: Universal Smart QR Code Scanner + Store Links */}
          <div className="flex items-center gap-3 shrink-0">
            {/* QR Code Scanner - Proper Clean Square */}
            <a
              href={qrTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Scan to download App (Auto-detects iOS & Android)"
              className="hidden sm:flex items-center justify-center bg-white p-1.5 rounded-lg shadow-md border border-white/40 shrink-0 hover:scale-105 transition-transform"
            >
              <QRCode
                value={qrTargetUrl}
                size={70}
                level="M"
                fgColor="#000000"
              />
            </a>

            {/* App Store & Google Play Download Buttons */}
            <div className="flex flex-row sm:flex-col gap-2">
              {/* Apple App Store */}
              <a
                href="https://apps.apple.com/in/app/ain/id6829701003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-black/90 hover:bg-black text-white rounded-xl border border-white/20 transition-all shadow-sm hover:border-white/50"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.03-1.77.92-2.8-.88.04-1.95.59-2.58 1.33-.55.63-1.03 1.66-.9 2.67 1 .08 2-.47 2.56-1.2z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[7px] text-gray-300 font-medium">Download on</span>
                  <span className="block text-[11px] font-black text-white tracking-tight">App Store</span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.assignmetinneed.ain"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-black/90 hover:bg-black text-white rounded-xl border border-white/20 transition-all shadow-sm hover:border-white/50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.61 2.31c-.34.37-.54.91-.54 1.6v16.18c0 .69.2 1.23.54 1.6l.08.07 9.07-9.07v-.21L4.15 2.94l-.54-.63z" />
                  <path fill="#FBBC04" d="M15.77 15.48l-3.01-3.01v-.21l3.01-3.01.07.04 3.56 2.02c1.02.58 1.02 1.53 0 2.11l-3.56 2.02-.07.04z" />
                  <path fill="#EA4335" d="M15.84 15.44L12.76 12.36 3.61 21.51c.34.37.91.41 1.55.05l10.68-6.12z" />
                  <path fill="#34A853" d="M15.84 8.56L5.16 2.44c-.64-.36-1.21-.32-1.55.05l9.15 9.15 3.08-3.08z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[7px] text-gray-300 font-medium">GET IT ON</span>
                  <span className="block text-[11px] font-black text-white tracking-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
