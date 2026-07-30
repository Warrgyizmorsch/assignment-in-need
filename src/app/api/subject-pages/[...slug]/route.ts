import { NextResponse } from "next/server";
import { getFreshSubjectPage } from "@/lib/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const requestedSlug = slug.join("/");

  try {
    const payload = await getFreshSubjectPage(requestedSlug);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: `Subject page not found for slug: ${requestedSlug}`,
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
        message: "Unable to connect to subject page backend service",
      },
      { status: 502, headers: cacheHeaders },
    );
  }
}
