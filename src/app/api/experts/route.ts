import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-fetch";

const BACKEND_URL = "https://ain.warrgyizmorsch.com";

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit")) || 8));
    const targetUrl = new URL("/api/experts", BACKEND_URL);
    targetUrl.searchParams.set("page", String(page));
    targetUrl.searchParams.set("limit", String(limit));

    const response = await fetchBackend(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const text = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed, {
          status: response.status,
          headers: cacheHeaders,
        });
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: `Experts API responded with status ${response.status}`,
          },
          { status: response.status, headers: cacheHeaders },
        );
      }
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed?.success) {
        const paginated = parsed.data && !Array.isArray(parsed.data)
          ? parsed.data
          : null;
        const experts = Array.isArray(paginated?.data)
          ? paginated.data
          : Array.isArray(parsed.data)
            ? parsed.data
            : [];
        const optimizedData = experts.map((expert: any) => {
          const { content, description, ...trimmed } = expert;
          return trimmed;
        });
        return NextResponse.json(
          {
            success: true,
            data: optimizedData,
            pagination: paginated
              ? {
                  currentPage: Number(paginated.current_page) || page,
                  lastPage: Number(paginated.last_page) || 1,
                  perPage: Number(paginated.per_page) || limit,
                  total: Number(paginated.total) || optimizedData.length,
                }
              : {
                  currentPage: 1,
                  lastPage: 1,
                  perPage: optimizedData.length,
                  total: optimizedData.length,
                },
          },
          { headers: cacheHeaders },
        );
      }
      return NextResponse.json(parsed, { headers: cacheHeaders });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Experts API returned invalid JSON response",
        },
        { status: 502, headers: cacheHeaders },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to experts backend service",
        error: err.message,
      },
      { status: 500, headers: cacheHeaders },
    );
  }
}
