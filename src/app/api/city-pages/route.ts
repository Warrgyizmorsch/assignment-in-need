import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix");

    let targetUrl = `${BACKEND_URL}/api/city-pages`;
    if (prefix) {
      targetUrl += `?prefix=${encodeURIComponent(prefix)}`;
    }

    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed, { status: response.status });
      } catch {
        return NextResponse.json(
          {
            status: "error",
            message: `City Pages API responded with status ${response.status}`,
          },
          { status: response.status },
        );
      }
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "City Pages API returned invalid JSON response",
        },
        { status: 502 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to connect to city-pages backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
