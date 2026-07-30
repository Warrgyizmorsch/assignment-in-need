import { NextResponse } from "next/server";
import { getFreshCityPage } from "@/lib/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const payload = await getFreshCityPage(slug);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: `City page not found for slug: ${slug}`,
        },
        { status: 404, headers: cacheHeaders },
      );
    }

    return NextResponse.json(
      { success: true, data: payload },
      { headers: cacheHeaders },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to city page backend service",
      },
      { status: 502, headers: cacheHeaders },
    );
  }
}
