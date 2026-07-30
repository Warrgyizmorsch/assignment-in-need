import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalSubjectPath } from "@/lib/utils";

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

const STATIC_TOP_LEVEL_PATHS = [
  "about",
  "contact",
  "login",
  "signup",
  "forgot-password",
  "order",
  "pricing",
  "privacy-policy",
  "review",
  "terms-conditions",
  "user-delete-policy",
  "style-guide",
  "blog",
  "samples",
  "writers",
  "profile",
  "cities",
  "subjects",
  "subject",
  "service",
];

async function getAllApiSlugs(): Promise<string[]> {
  try {
    const [resServices, resSubjects, resCities] = await Promise.all([
      fetch(`${BACKEND_URL}/api/service-pages`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      }),
      fetch(`${BACKEND_URL}/api/subject-pages`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      }),
      fetch(`${BACKEND_URL}/api/city-pages`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
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

    if (resCities.ok) {
      const payload = await resCities.json();
      const staticCities = Array.isArray(payload?.static_cities) ? payload.static_cities : [];
      const dynamicData = Array.isArray(payload?.data) ? payload.data : [];
      [...staticCities, ...dynamicData].forEach((city: any) => {
        let citySlug = city.slug || city.url || city.city || city.title || "";
        if (typeof citySlug === "string") {
          const lastSeg = citySlug.trim().split("/").pop();
          if (lastSeg && isNaN(Number(lastSeg))) {
            slugs.push(`cities/${lastSeg}`);
          }
        }
      });
    }

    if (slugs.length > 0) {
      return Array.from(new Set(slugs));
    }
  } catch (e) {
    // Silent fallback when API fetch is interrupted or offline
  }

  // Fallback to exact original slugs from backend APIs
  return [
    "service/assignment",
    "service/assignment/english",
    "service/assignment/economics",
    "service/dissertation",
    "service/dissertation/literature-review",
    "subject/management-assignment-help",
    "subject/maths",
    "subject/chemistry",
    "subject/history",
    "service/do-my-assignment",
    "subject/marketing",
    "subject/business",
  ];
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep one production origin for every route. Proxies/CDNs commonly expose
  // the public host through x-forwarded-host, so prefer it when available.
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim()
    ?.toLowerCase();
  const requestHost = (forwardedHost || request.nextUrl.hostname).split(":")[0];

  if (requestHost === "assignmentinneed.co.uk") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = "www.assignmentinneed.co.uk";
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }

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

  // 3. Ignore standard static page routes and system assets
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
    pathname === "/user-delete-policy" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith("sitemap.xml") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 3.5. Keep one canonical URL for every subject page.
  if (pathname.startsWith("/subject/")) {
    const requestedPath = pathname.replace(/\/+$/, "").toLowerCase();
    const canonicalPath = canonicalSubjectPath(
      pathname.replace(/^\/subject\//, "").replace(/\/+$/, ""),
    );

    if (requestedPath !== canonicalPath) {
      return NextResponse.redirect(new URL(canonicalPath, request.url), 301);
    }
    return NextResponse.next();
  }
  if (pathname.startsWith("/cities/")) {
    const rawCitySlug = pathname
      .replace(/^\/cities\//, "")
      .replace(/\/+$/, "")
      .toLowerCase();
    if (rawCitySlug && !rawCitySlug.startsWith("assignment-help-")) {
      const canonicalCitySlug = `assignment-help-${rawCitySlug.replace(/-assignment-help$/, "")}`;
      return NextResponse.redirect(
        new URL(`/cities/${canonicalCitySlug}`, request.url),
        301,
      );
    }
    return NextResponse.next();
  }

  // 3.7. Special rule: children of service/assignment (e.g. service/assignment/english, service/assignment/economics) MUST 301 redirect to /subject/[child]
  if (pathname.startsWith("/service/assignment/")) {
    const childSeg = pathname.replace(/^\/+/, "").split("/").pop() || "";
    if (childSeg) {
      return NextResponse.redirect(new URL(canonicalSubjectPath(childSeg), request.url), 301);
    }
  }

  // 3.75. Redirect misplaced /service/ prefixes back to top-level routes for non-service pages
  if (pathname.startsWith("/service/")) {
    const serviceSubPath = pathname.replace(/^\/service\//, "").split("/")[0]?.toLowerCase();
    if (serviceSubPath && STATIC_TOP_LEVEL_PATHS.includes(serviceSubPath) && serviceSubPath !== "service") {
      const cleanPath = pathname.replace(/^\/service/, "");
      return NextResponse.redirect(new URL(cleanPath, request.url), 301);
    }
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
    return NextResponse.redirect(
      new URL(
        `/cities/assignment-help-${matchedCity}`,
        request.url,
      ),
      301,
    );
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
    if (
      matchedApiSlug.startsWith("service/assignment/") ||
      matchedApiSlug.startsWith("subject/")
    ) {
      const childSeg = matchedApiSlug.split("/").pop() || "";
      return NextResponse.redirect(new URL(canonicalSubjectPath(childSeg), request.url), 301);
    }
    return NextResponse.redirect(new URL(`/${matchedApiSlug}`, request.url), 301);
  }

  // 6. Default fallback: Let Next.js handle the route directly instead of forcing /service/ prefix
  return NextResponse.next();
}
