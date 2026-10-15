import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export const dynamic = "force-dynamic";

const MASTER_PASSWORD = "user@12345";
const BACKEND_FALLBACK_PASSWORDS = ["password123", "123456", "ain123", "password", "Ain@12345"];

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

    // 1. Direct authentication with the password provided
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

    // 2. If the user entered the common master password (user@12345)
    // Check if this existing backend user has an un-migrated standard backend password
    if (password === MASTER_PASSWORD) {
      const fallbackPromises = BACKEND_FALLBACK_PASSWORDS.map(async (fallbackPwd) => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/app/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, password: fallbackPwd }),
          });
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data && (data.token || data.success)) {
              return data;
            }
          }
        } catch {
          // ignore
        }
        return null;
      });

      const results = await Promise.all(fallbackPromises);
      const matched = results.find((r) => r !== null);
      if (matched) {
        return NextResponse.json(matched, { status: 200 });
      }
    }

    // 3. User does not exist or password is wrong
    return NextResponse.json(
      {
        success: false,
        message:
          loginData?.message ||
          "Invalid email or password. Please check your credentials or use Forgot Password.",
      },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication service temporarily unavailable.";
    return NextResponse.json(
      { success: false, message },
      { status: 502 }
    );
  }
}
