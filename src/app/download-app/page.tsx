"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.assignmetinneed.ain";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/ain/id6829701003";

export default function DownloadAppPage() {
  useEffect(() => {
    // Client-side auto-redirect for mobile visitors
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      if (/iphone|ipad|ipod/i.test(ua)) {
        window.location.href = APP_STORE_URL;
      } else if (/android/i.test(ua)) {
        window.location.href = PLAY_STORE_URL;
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#14052e] via-[#240b54] to-[#14052e] text-white flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 text-center">
        {/* Back Link */}
        <div className="flex justify-start mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-purple-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Assignment In Need Official App
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Get the AIN Mobile App
        </h1>
        <p className="text-sm sm:text-base text-purple-200 mb-8 max-w-md mx-auto">
          Track assignments on the go, chat with expert writers 24/7, and get instant updates directly on your phone.
        </p>

        {/* QR Code Container */}
        <div className="inline-flex flex-col items-center bg-white p-4 rounded-2xl shadow-xl border border-white/20 mb-8">
          <QRCode
            value="https://www.assignmentinneed.co.uk/app"
            size={160}
            level="H"
            fgColor="#14052e"
          />
          <span className="text-xs font-bold text-[#14052e] mt-3 uppercase tracking-wider">
            Scan to Download
          </span>
          <span className="text-[10px] text-gray-500">
            Auto-detects iOS & Android
          </span>
        </div>

        {/* Store Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* App Store */}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-black hover:bg-neutral-900 text-white rounded-xl border border-white/20 hover:border-white/50 transition-all shadow-md group"
          >
            <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.03-1.77.92-2.8-.88.04-1.95.59-2.58 1.33-.55.63-1.03 1.66-.9 2.67 1 .08 2-.47 2.56-1.2z" />
            </svg>
            <div className="text-left leading-none">
              <span className="block text-[10px] text-gray-400 font-medium">Download on the</span>
              <span className="block text-sm font-bold text-white tracking-tight">App Store</span>
            </div>
          </a>

          {/* Google Play */}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-black hover:bg-neutral-900 text-white rounded-xl border border-white/20 hover:border-white/50 transition-all shadow-md group"
          >
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M3.61 2.31c-.34.37-.54.91-.54 1.6v16.18c0 .69.2 1.23.54 1.6l.08.07 9.07-9.07v-.21L4.15 2.94l-.54-.63z" />
              <path fill="#FBBC04" d="M15.77 15.48l-3.01-3.01v-.21l3.01-3.01.07.04 3.56 2.02c1.02.58 1.02 1.53 0 2.11l-3.56 2.02-.07.04z" />
              <path fill="#EA4335" d="M15.84 15.44L12.76 12.36 3.61 21.51c.34.37.91.41 1.55.05l10.68-6.12z" />
              <path fill="#34A853" d="M15.84 8.56L5.16 2.44c-.64-.36-1.21-.32-1.55.05l9.15 9.15 3.08-3.08z" />
            </svg>
            <div className="text-left leading-none">
              <span className="block text-[10px] text-gray-400 font-medium">GET IT ON</span>
              <span className="block text-sm font-bold text-white tracking-tight">Google Play</span>
            </div>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 text-left pt-6 border-t border-white/10 text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Real-time order tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Direct chat with writers</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Secure & confidential</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant discount notifications</span>
          </div>
        </div>
      </div>
    </main>
  );
}
