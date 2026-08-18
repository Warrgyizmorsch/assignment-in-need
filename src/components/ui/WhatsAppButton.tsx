"use client";

import React from "react";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-32 left-0 z-50">
      <a
        href="https://wa.me/447826233106"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center bg-[#25D366] hover:bg-[#20ba59] text-white rounded-r-full shadow-[2px_2px_10px_rgba(0,0,0,0.2)] transform -translate-x-[calc(100%-52px)] hover:translate-x-0 transition-transform duration-300 ease-in-out h-12 focus:outline-none"
      >
        <span className="font-bold text-sm md:text-base pl-5 pr-2 tracking-wide whitespace-nowrap">
          GET 10% OFF
        </span>
        <div className="w-[52px] h-12 flex items-center justify-center shrink-0 border-l border-white/20">
          <svg
            width="28"
            height="28"
            className="fill-current text-white drop-shadow-md"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.638-1.025 3.743 3.837-1.004.532.338zm10.744-6.333c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.966-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </div>
      </a>
    </div>
  );
}

