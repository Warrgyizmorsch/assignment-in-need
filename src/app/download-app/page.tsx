"use client";

import { useEffect } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.assignmetinneed.ain";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/ain/id6829701003";

export default function DownloadAppRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = (navigator.userAgent || "").toLowerCase();
      // iOS / Apple device -> Apple App Store
      if (/iphone|ipad|ipod|darwin|macintosh/.test(ua)) {
        window.location.replace(APP_STORE_URL);
      } else {
        // Android & all others -> Google Play Store
        window.location.replace(PLAY_STORE_URL);
      }
    }
  }, []);

  return null;
}
