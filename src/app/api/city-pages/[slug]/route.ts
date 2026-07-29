import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const targetUrl = `${BACKEND_URL}/api/city-pages/${encodeURIComponent(slug)}`;

    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    const text = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed, { status: response.status });
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: `City Page detail API responded with status ${response.status}`,
          },
          { status: response.status },
        );
      }
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "City Page detail API returned invalid JSON response",
        },
        { status: 502 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to city page detail backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
