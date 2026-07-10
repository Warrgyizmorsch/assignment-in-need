import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
const SUBJECT_PAGES_API_BASE_URL = `${BACKEND_URL}/api/subject-pages`;

// Helper function to recursively clean all "slug" properties by stripping leading slashes
function cleanSlugs(data: any): any {
  if (!data) return data;
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.map(cleanSlugs);
    }
    const result: any = {};
    for (const key in data) {
      if (key === "slug" && typeof data[key] === "string") {
        result[key] = data[key].replace(/^\/+/, "");
      } else {
        result[key] = cleanSlugs(data[key]);
      }
    }
    return result;
  }
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  // 1. If slug query param is present, fetch that specific subject page detail
  if (slug) {
    try {
      // Ensure we query with the prefix "subject/" if not present
      const fullSlug = slug.includes("/") ? slug : `subject/${slug}`;
      const targetUrl = `${SUBJECT_PAGES_API_BASE_URL}/${fullSlug}`;
      const response = await fetch(targetUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const text = await response.text();

      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: `Subject page API responded with ${response.status}`, debug: { targetUrl } },
          { status: response.status },
        );
      }

      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(cleanSlugs(parsed));
      } catch {
        return NextResponse.json({ success: false, message: "Subject page API returned invalid JSON", debug: { targetUrl } }, { status: 502 });
      }
    } catch (err: any) {
      return NextResponse.json({ success: false, message: "Unable to fetch subject page", error: err.message }, { status: 502 });
    }
  }

  // 2. If no slug is specified, fetch the list of all subject pages
  try {
    const response = await fetch(SUBJECT_PAGES_API_BASE_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Subject API responded with ${response.status}` },
        { status: response.status },
      );
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(cleanSlugs(parsed));
    } catch {
      return NextResponse.json({ success: false, message: "Subject API returned invalid JSON" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ success: false, message: "Unable to fetch subject pages" }, { status: 502 });
  }
}
