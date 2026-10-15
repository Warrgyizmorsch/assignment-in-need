import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone_no = typeof body.phone_no === "string" ? body.phone_no.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirm_password = typeof body.confirm_password === "string" ? body.confirm_password : password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone_no: phone_no || "+44 7000000000",
      password,
      confirm_password,
    };

    const res = await fetch(`${BACKEND_URL}/api/app/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg =
        data?.errors?.email?.[0] ||
        data?.errors?.password?.[0] ||
        data?.message ||
        "Unable to create account. Please check your details.";
      return NextResponse.json(
        { success: false, message: errorMsg, errors: data?.errors },
        { status: res.status }
      );
    }

    return NextResponse.json(
      data || { success: true, message: "Account registered successfully." },
      { status: res.status }
    );
  } catch (err: any) {
    console.error("[Register API] Error:", err);
    return NextResponse.json(
      { success: false, message: "Registration service temporarily unavailable." },
      { status: 500 }
    );
  }
}
