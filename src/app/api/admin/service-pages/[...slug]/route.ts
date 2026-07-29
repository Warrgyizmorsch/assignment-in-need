import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";
const SERVICE_PAGES_API_BASE_URL = `${BACKEND_URL}/api/service-pages`;

type RouteContext = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const fullSlug = slug.map((part) => encodeURIComponent(part)).join("/");

  try {
    const response = await fetch(`${SERVICE_PAGES_API_BASE_URL}/${fullSlug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Service page API responded with ${response.status}`,
        },
        { status: response.status },
      );
    }

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json(
        { success: false, message: "Service page API returned invalid JSON" },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to fetch service page" },
      { status: 502 },
    );
  }
}
