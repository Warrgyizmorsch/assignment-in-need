import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${BACKEND_URL}/api/app/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(
      data || { success: res.ok, message: res.ok ? "OTP sent" : "Failed to send OTP" },
      { status: res.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Unable to process forgot password request." },
      { status: 500 }
    );
  }
}
