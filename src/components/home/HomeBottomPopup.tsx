"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { X, Phone, Mail } from "lucide-react";

export default function HomeBottomPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);
  const reOpenTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Initial 8-second trigger
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    // 2. Scroll trigger: as soon as user scrolls down on homepage
    const handleScroll = () => {
      if (window.scrollY > 250 && !isTemporarilyClosed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("scroll", handleScroll);
      if (reOpenTimerRef.current) clearTimeout(reOpenTimerRef.current);
    };
  }, [isTemporarilyClosed]);

  // Dispatch custom event to coordinate with side WhatsApp button (hide side button when this popup is active)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ain-bottom-popup-toggle", {
          detail: { isOpen: isVisible },
        })
      );
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setIsTemporarilyClosed(true);

    // Re-open every 18-20 seconds as requested: "8 se 20 second me har 8 se 10 second me aesa popup aaye"
    if (reOpenTimerRef.current) clearTimeout(reOpenTimerRef.current);
    reOpenTimerRef.current = setTimeout(() => {
      setIsTemporarilyClosed(false);
      setIsVisible(true);
    }, 18000);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Academic Support & App Download"
      className="fixed bottom-0 left-0 right-0 z-[60] px-3 pb-3 pt-1 pointer-events-none transition-all duration-500 ease-out animate-in slide-in-from-bottom-8"
    >
      <div className="max-w-6xl mx-auto pointer-events-auto relative rounded-2xl bg-gradient-to-r from-[#14052e] via-[#240b54] to-[#14052e] text-white border border-purple-500/30 shadow-[0_-10px_35px_rgba(20,5,46,0.6)] backdrop-blur-xl p-3 md:p-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close notification"
          className="absolute -top-3 -right-2 md:top-2.5 md:right-3 w-7 h-7 rounded-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center shadow-lg transition-transform hover:scale-110 focus:outline-none z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 md:gap-4">
          {/* Left: Text & Pitch */}
          <div className="text-center lg:text-left flex-1 min-w-0 pr-6 lg:pr-0">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <h3 className="font-extrabold text-sm sm:text-base md:text-lg tracking-wide uppercase bg-gradient-to-r from-amber-300 via-white to-purple-200 bg-clip-text text-transparent">
                Do You Face Academic Challenges?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 font-medium line-clamp-2 md:line-clamp-none">
              Turn Stress into Success : Receive expert solutions and academic support 24/7.
            </p>
          </div>

          {/* Center: Action Buttons (WhatsApp, Call, Email) */}
          <div className="flex items-center flex-wrap justify-center gap-2 shrink-0">
            {/* WhatsApp */}
            <a
              href="https://wa.me/447826233106?text=Hi%2C%20I%20need%20academic%20assignment%20help"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs md:text-sm shadow-md shadow-green-900/30 transition-transform hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
              </svg>
              <span>Whatsapp</span>
            </a>

            {/* Call */}
            <a
              href="tel:+447826233106"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs md:text-sm shadow-md shadow-sky-900/30 transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>

            {/* Email */}
            <a
              href="mailto:order@assignmentinneed.co.uk"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e56000] text-white font-bold text-xs md:text-sm shadow-md shadow-orange-900/30 transition-transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>

          {/* Right: QR Code Scanner + Store Links */}
          <div className="flex items-center gap-3 shrink-0">
            {/* QR Code Scanner (visible on desktop/tablet) */}
            <a
              href="/app"
              target="_blank"
              rel="noopener noreferrer"
              title="Scan to download App (iOS & Android)"
              className="hidden sm:flex flex-col items-center bg-white p-1.5 rounded-xl shadow-md border border-white/30 hover:scale-105 transition-transform"
            >
              <QRCode
                value="https://www.assignmentinneed.co.uk/app"
                size={56}
                level="M"
                fgColor="#14052e"
              />
              <span className="text-[8px] font-extrabold text-[#14052e] mt-1 tracking-tight uppercase">
                Scan App
              </span>
            </a>

            {/* App Store & Google Play Download Buttons */}
            <div className="flex flex-row sm:flex-col gap-2">
              {/* Apple App Store */}
              <a
                href="https://apps.apple.com/in/app/ain/id6829701003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-black/70 hover:bg-black text-white rounded-lg border border-white/20 transition-all hover:border-white/40 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.03-1.77.92-2.8-.88.04-1.95.59-2.58 1.33-.55.63-1.03 1.66-.9 2.67 1 .08 2-.47 2.56-1.2z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[8px] text-gray-300 font-medium">Download on the</span>
                  <span className="block text-[11px] font-bold text-white tracking-tight">App Store</span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=com.assignmetinneed.ain"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-black/70 hover:bg-black text-white rounded-lg border border-white/20 transition-all hover:border-white/40 shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.61 2.31c-.34.37-.54.91-.54 1.6v16.18c0 .69.2 1.23.54 1.6l.08.07 9.07-9.07v-.21L4.15 2.94l-.54-.63z" />
                  <path fill="#FBBC04" d="M15.77 15.48l-3.01-3.01v-.21l3.01-3.01.07.04 3.56 2.02c1.02.58 1.02 1.53 0 2.11l-3.56 2.02-.07.04z" />
                  <path fill="#EA4335" d="M15.84 15.44L12.76 12.36 3.61 21.51c.34.37.91.41 1.55.05l10.68-6.12z" />
                  <path fill="#34A853" d="M15.84 8.56L5.16 2.44c-.64-.36-1.21-.32-1.55.05l9.15 9.15 3.08-3.08z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[8px] text-gray-300 font-medium">GET IT ON</span>
                  <span className="block text-[11px] font-bold text-white tracking-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

