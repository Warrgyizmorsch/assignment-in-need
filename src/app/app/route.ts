import { NextRequest, NextResponse } from "next/server";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.assignmetinneed.ain";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/ain/id6829701003";

export async function GET(request: NextRequest) {
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. Apple / iOS detection (iPhone, iPad, iPod, Mac) -> Direct to Apple App Store
  if (/iphone|ipad|ipod|darwin|macintosh/.test(userAgent)) {
    return NextResponse.redirect(APP_STORE_URL, 307);
  }

  // 2. Android & all other devices -> Direct to Google Play Store (NEVER to website)
  return NextResponse.redirect(PLAY_STORE_URL, 307);
}
