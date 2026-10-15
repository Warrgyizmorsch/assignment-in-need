import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    // Direct, secure verification against Laravel backend
    const loginRes = await fetch(`${BACKEND_URL}/api/app/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json().catch(() => null);

    if (loginRes.ok && loginData && (loginData.token || loginData.access_token || loginData.success)) {
      return NextResponse.json(loginData, { status: 200 });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          loginData?.message ||
          "Invalid email or password. Please check your credentials or use Forgot Password.",
      },
      { status: loginRes.status === 200 ? 401 : loginRes.status || 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication service temporarily unavailable.";
    return NextResponse.json(
      { success: false, message },
      { status: 502 }
    );
  }
}
