import { NextRequest, NextResponse } from "next/server";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.assignmetinneed.ain";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/ain/id6829701003";

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // 1. iOS detection (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return NextResponse.redirect(APP_STORE_URL, 307);
  }

  // 2. Android detection
  if (/android/i.test(userAgent)) {
    return NextResponse.redirect(PLAY_STORE_URL, 307);
  }

  // 3. Desktop / Fallback -> show download app page
  const downloadPageUrl = new URL("/download-app", request.url);
  return NextResponse.redirect(downloadPageUrl, 307);
}
