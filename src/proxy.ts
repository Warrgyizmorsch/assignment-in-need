import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

const CITY_IDENTIFIERS = [
  "london", "birmingham", "manchester", "leeds", "glasgow", "edinburgh", "bristol", "liverpool",
  "sydney", "melbourne", "brisbane", "perth", "adelaide", "canberra",
  "toronto", "vancouver", "montreal", "ottawa",
  "dubai", "abu-dhabi", "sharjah",
  "kuala-lumpur", "penang"
];

let cachedApiSlugs: string[] | null = null;
let lastFetchedApiSlugs = 0;

async function getAllApiSlugs(): Promise<string[]> {
  const now = Date.now();
  if (cachedApiSlugs && now - lastFetchedApiSlugs < 300000) {
    return cachedApiSlugs;
  }

  try {
    const [resServices, resSubjects] = await Promise.all([
      fetch(`${BACKEND_URL}/api/service-pages`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`${BACKEND_URL}/api/subject-pages`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    const slugs: string[] = [];

    if (resServices.ok) {
      const payload = await resServices.json();
      const list = Array.isArray(payload?.data) ? payload.data : [];
      list.forEach((item: any) => {
        if (item.slug) slugs.push(item.slug.trim().replace(/^\/+/, ""));
        if (Array.isArray(item.children)) {
          item.children.forEach((child: any) => {
            if (child.slug) slugs.push(child.slug.trim().replace(/^\/+/, ""));
          });
        }
      });
    }

    if (resSubjects.ok) {
      const payload = await resSubjects.json();
      const list = Array.isArray(payload?.data) ? payload.data : [];
      list.forEach((item: any) => {
        if (item.slug) slugs.push(item.slug.trim().replace(/^\/+/, ""));
        if (Array.isArray(item.children)) {
          item.children.forEach((child: any) => {
            if (child.slug) slugs.push(child.slug.trim().replace(/^\/+/, ""));
          });
        }
      });
    }

    if (slugs.length > 0) {
      cachedApiSlugs = Array.from(new Set(slugs));
      lastFetchedApiSlugs = now;
      return cachedApiSlugs;
    }
  } catch (e) {
    // Silent fallback when API fetch is interrupted or offline
  }

  // Fallback to exact original slugs from backend APIs
  cachedApiSlugs = [
    "service/assignment",
    "service/assignment/english",
    "service/assignment/economics",
    "service/dissertation",
    "service/dissertation/literature-review",
    "subject/management-assignment-help",
    "subject/maths",
    "subject/chemistry",
    "subject/history",
    "subject/do-my-assignment",
    "subject/marketing",
    "subject/business",
  ];
  lastFetchedApiSlugs = now;
  return cachedApiSlugs;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignore files with extensions (e.g. .webp, .png, .jpg, .svg, .js, .css, .json, .ico, etc.)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // 2. Ignore known public asset directories
  const PUBLIC_FOLDERS = [
    "/assets",
    "/auth",
    "/images",
    "/new-about-us-img",
    "/new-blog-images",
    "/new-home-page-images",
    "/new-pricingimg",
    "/new-sample-img",
    "/new-subject-sectionimg",
    "/order-page"
  ];
  if (PUBLIC_FOLDERS.some((folder) => pathname.startsWith(folder))) {
    return NextResponse.next();
  }

  // 3. Ignore standard static page routes and sub-routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/samples") ||
    pathname.startsWith("/writers") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/cities") ||
    pathname.startsWith("/subjects") ||
    pathname.startsWith("/style-guide") ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/order" ||
    pathname === "/pricing" ||
    pathname === "/privacy-policy" ||
    pathname === "/review" ||
    pathname === "/terms-conditions" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith("sitemap.xml") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 3.5. Subject route canonical normalization
  if (pathname.startsWith("/subject/")) {
    const subSlug = pathname.replace(/^\/subject\//, "").replace(/\/+$/, "").toLowerCase();
    if (subSlug === "math" || subSlug === "math-assignment-help" || subSlug === "maths-assignment-help") {
      return NextResponse.redirect(new URL("/subject/maths", request.url), 301);
    }
    if (subSlug === "chemistry-assignment-help") {
      return NextResponse.redirect(new URL("/subject/chemistry", request.url), 301);
    }
    if (subSlug === "history-assignment-help") {
      return NextResponse.redirect(new URL("/subject/history", request.url), 301);
    }
    if (subSlug === "do-my-assignment-help") {
      return NextResponse.redirect(new URL("/subject/do-my-assignment", request.url), 301);
    }
    if (subSlug === "marketing-assignment-help") {
      return NextResponse.redirect(new URL("/subject/marketing", request.url), 301);
    }
    if (subSlug === "business-assignment-help") {
      return NextResponse.redirect(new URL("/subject/business", request.url), 301);
    }
    if (subSlug === "english-assignment-help") {
      return NextResponse.redirect(new URL("/subject/english", request.url), 301);
    }
    if (subSlug === "economics-assignment-help") {
      return NextResponse.redirect(new URL("/subject/economics", request.url), 301);
    }
    if (subSlug === "management") {
      return NextResponse.redirect(new URL("/subject/management-assignment-help", request.url), 301);
    }
    return NextResponse.next();
  }

  // 3.6. If already on /cities/, pass through directly
  if (pathname.startsWith("/cities/")) {
    return NextResponse.next();
  }

  // 3.7. Special rule: children of service/assignment (e.g. service/assignment/english, service/assignment/economics) MUST 301 redirect to /subject/[child]
  if (pathname.startsWith("/service/assignment/")) {
    const childSeg = pathname.replace(/^\/+/, "").split("/").pop() || "";
    if (childSeg) {
      return NextResponse.redirect(new URL(`/subject/${childSeg}`, request.url), 301);
    }
  }

  // 3.75. Redirect misplaced /service/ prefixes back to top-level routes
  if (pathname.startsWith("/service/blog")) {
    const cleanPath = pathname.replace(/^\/service\/blog/, "/blog");
    return NextResponse.redirect(new URL(cleanPath, request.url), 301);
  }
  if (pathname.startsWith("/service/samples")) {
    const cleanPath = pathname.replace(/^\/service\/samples/, "/samples");
    return NextResponse.redirect(new URL(cleanPath, request.url), 301);
  }
  if (pathname.startsWith("/service/writers")) {
    const cleanPath = pathname.replace(/^\/service\/writers/, "/writers");
    return NextResponse.redirect(new URL(cleanPath, request.url), 301);
  }
  if (pathname.startsWith("/service/profile")) {
    const cleanPath = pathname.replace(/^\/service\/profile/, "/profile");
    return NextResponse.redirect(new URL(cleanPath, request.url), 301);
  }

  // 3.8. If already on /service/, pass through directly
  if (pathname.startsWith("/service/")) {
    return NextResponse.next();
  }

  const rawPath = pathname.replace(/^\/+/, "");
  const segments = rawPath.toLowerCase().split("/");
  const lastSegment = segments[segments.length - 1] || "";
  const firstSegment = segments[0] || "";

  // 4. Check if it's a City route
  const matchedCity = CITY_IDENTIFIERS.find((city) => {
    return (
      pathname.includes("/uk/") ||
      firstSegment === city ||
      lastSegment === city ||
      lastSegment === `${city}-assignment-help` ||
      lastSegment === `${city}-assignment-writing-help`
    );
  });
  if (matchedCity) {
    return NextResponse.redirect(new URL(`/cities/${matchedCity}`, request.url), 301);
  }

  // 5. Match against exact original API slugs for shorthand/legacy URLs
  const allApiSlugs = await getAllApiSlugs();

  const cleanReq = lastSegment
    .replace("-assignment-writing-help", "")
    .replace("-assignment-help", "")
    .replace("-help", "")
    .trim();

  const matchedApiSlug = allApiSlugs.find((apiSlug) => {
    if (rawPath === apiSlug) return true;
    const apiLastSegment = apiSlug.split("/").pop() || "";
    if (lastSegment === apiLastSegment) return true;
    const apiCleaned = apiLastSegment
      .replace("-assignment-writing-help", "")
      .replace("-assignment-help", "")
      .replace("-help", "")
      .trim();

    if (cleanReq === apiCleaned) return true;
    if (cleanReq === "math" && (apiCleaned === "maths" || apiLastSegment === "maths")) return true;
    if (cleanReq === "maths" && (apiCleaned === "math" || apiLastSegment === "math")) return true;

    return false;
  });

  if (matchedApiSlug) {
    if (matchedApiSlug.startsWith("service/assignment/")) {
      const childSeg = matchedApiSlug.split("/").pop() || "";
      return NextResponse.redirect(new URL(`/subject/${childSeg}`, request.url), 301);
    }
    return NextResponse.redirect(new URL(`/${matchedApiSlug}`, request.url), 301);
  }

  return NextResponse.redirect(new URL(`/service/${rawPath}`, request.url), 301);
}
