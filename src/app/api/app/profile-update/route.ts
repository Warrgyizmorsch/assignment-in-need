import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const res = await fetch(`${BACKEND_URL}/api/app/profile-update`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      body: formData,
    });

    const text = await res.text();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: res.status });
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON from backend" },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to reach backend";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
