import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const pathSlug = Array.isArray(slug) ? slug.join("/") : slug;

    const targetUrl = `${BACKEND_URL}/api/service-pages/${pathSlug}`;

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
        return NextResponse.json(parsed, {
          status: response.status,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
        });
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: `Service Page detail API responded with status ${response.status}`,
          },
          {
            status: response.status,
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
          },
        );
      }
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Service Page detail API returned invalid JSON response",
        },
        { status: 502 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to service page detail backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
