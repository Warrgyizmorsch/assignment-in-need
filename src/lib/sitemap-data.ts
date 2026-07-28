import { canonicalSubjectPath } from "@/lib/utils";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export function getSitemapBaseUrl(): string {
  let configuredUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://www.assignmentinneed.co.uk");

  if (!configuredUrl.startsWith("http://") && !configuredUrl.startsWith("https://")) {
    configuredUrl = `https://${configuredUrl}`;
  }

  try {
    const url = new URL(configuredUrl);
    if (url.hostname === "assignmentinneed.co.uk" || (url.hostname.includes("assignmentinneed") && !url.hostname.startsWith("www."))) {
      url.hostname = "www.assignmentinneed.co.uk";
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "https://www.assignmentinneed.co.uk";
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start of text
    .replace(/-+$/, "");            // Trim - from end of text
}

export const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/cities",
  "/contact",
  "/pricing",
  "/privacy-policy",
  "/review",
  "/samples",
  "/subjects",
  "/terms-conditions",
  "/writers",
];

export const citySlugs = [
  "london",
  "birmingham",
  "manchester",
  "leeds",
  "glasgow",
  "edinburgh",
  "bristol",
  "liverpool",
  "sydney",
  "melbourne",
  "brisbane",
  "perth",
  "adelaide",
  "canberra",
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "dubai",
  "abu-dhabi",
  "sharjah",
  "kuala-lumpur",
  "penang",
];

export function getCityRoutes(baseUrl: string): string[] {
  // Map standard UK and global city paths to the /cities/[slug] format
  return citySlugs.map((slug) =>
    slug === "london"
      ? `${baseUrl}/cities/assignment-help-london`
      : `${baseUrl}/cities/${slug}`,
  );
}

export async function fetchCityPages(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/city-pages`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const staticCities = Array.isArray(payload?.static_cities) ? payload.static_cities : [];
      const dynamicData = Array.isArray(payload?.data) ? payload.data : [];

      const routes: string[] = [];

      staticCities.forEach((city: any) => {
        if (city.id) {
          const citySlug = String(city.id);
          routes.push(
            citySlug === "london"
              ? `${baseUrl}/cities/assignment-help-london`
              : `${baseUrl}/cities/${citySlug}`,
          );
        } else if (city.slug) {
          const lastSeg = city.slug.split("/").pop();
          if (lastSeg) {
            routes.push(
              lastSeg === "london"
                ? `${baseUrl}/cities/assignment-help-london`
                : `${baseUrl}/cities/${lastSeg}`,
            );
          }
        }
      });

      dynamicData.forEach((city: any) => {
        if (city.id) {
          const citySlug = String(city.id);
          routes.push(
            citySlug === "london"
              ? `${baseUrl}/cities/assignment-help-london`
              : `${baseUrl}/cities/${citySlug}`,
          );
        } else if (city.slug) {
          const lastSeg = city.slug.split("/").pop();
          if (lastSeg) {
            routes.push(
              lastSeg === "london"
                ? `${baseUrl}/cities/assignment-help-london`
                : `${baseUrl}/cities/${lastSeg}`,
            );
          }
        }
      });

      if (routes.length > 0) {
        return Array.from(new Set(routes));
      }
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch city pages", e);
  }
  return getCityRoutes(baseUrl);
}

export async function fetchBlogs(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blogs?limit=2000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const list = payload?.data?.data || [];
      return list.map((blog: any) => `${baseUrl}/blog/${blog.slug}`);
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch blogs", e);
  }
  return [];
}

export async function fetchServicePages(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/service-pages`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const list = Array.isArray(payload?.data) ? payload.data : [];

      const routes: string[] = [];
      list.forEach((service: any) => {
        let parentSlug = service.slug?.trim().replace(/^\/+/, "") || "";
        if (parentSlug) {
          routes.push(`${baseUrl}/${parentSlug}`);
        }

        if (Array.isArray(service.children)) {
          service.children.forEach((child: any) => {
            let childSlug = child.slug?.trim().replace(/^\/+/, "") || "";
            if (childSlug) {
              if (childSlug.startsWith("service/assignment/")) {
                const lastSeg = childSlug.split("/").pop() || childSlug;
                routes.push(`${baseUrl}${canonicalSubjectPath(lastSeg)}`);
              } else {
                routes.push(`${baseUrl}/${childSlug}`);
              }
            }
          });
        }
      });
      return routes;
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch service pages", e);
  }
  return [];
}

export async function fetchSubjectPages(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/subject-pages`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const list = Array.isArray(payload?.data) ? payload.data : [];
      return list.map((subject: any) => {
        const slug = subject.slug?.trim().replace(/^\/+/, "") || "";
        return `${baseUrl}${canonicalSubjectPath(slug)}`;
      });
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch subject pages", e);
  }
  return [];
}

export async function fetchSamples(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/samples?limit=2000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const list = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      return list
        .filter((sample: any) => sample && (sample.slug || sample.id))
        .map((sample: any) => {
          const catName =
            sample.category_name ||
            sample.category_slug ||
            sample.category?.name ||
            sample.category?.slug ||
            "general";
          const cat = slugify(catName);
          const sampleSlug = sample.slug || sample.id;
          return `${baseUrl}/samples/${cat}/${sampleSlug}`;
        });
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch samples", e);
  }
  return [];
}

export async function fetchSampleCategories(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sample-categories`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const list = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      if (list.length > 0) {
        return list
          .filter((cat: any) => cat && (cat.name || cat.slug))
          .map((cat: any) => `${baseUrl}/samples/${slugify(cat.slug || cat.name)}`);
      }
    }
    // Fallback: fetch subject-pages if sample-categories empty
    const subRes = await fetch(`${BACKEND_URL}/api/subject-pages`, {
      next: { revalidate: 3600 },
    });
    if (subRes.ok) {
      const subPayload = await subRes.json();
      const subList = Array.isArray(subPayload?.data) ? subPayload.data : [];
      return subList
        .filter((s: any) => s && (s.slug || s.name || s.title))
        .map((s: any) => {
          const rawTitle = s.title || s.name || s.slug || "";
          const cleanTitle = rawTitle.split(" Help")[0]?.split(" Assignment")[0]?.trim() || rawTitle;
          return `${baseUrl}/samples/${slugify(cleanTitle)}`;
        });
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch sample categories", e);
  }
  return [];
}

export async function fetchWriters(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/experts`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const list = Array.isArray(payload?.data) ? payload.data : [];
      return list.map((writer: any) => `${baseUrl}/writers/${writer.slug}`);
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch writers", e);
  }
  return [];
}

export function toSitemapXml(
  urls: { loc: string; priority: string; lastmod?: string; changefreq?: string }[]
) {
  const today = new Date().toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `   <url>
      <loc>${item.loc}</loc>
      <lastmod>${item.lastmod || today}</lastmod>
      <changefreq>${item.changefreq || "daily"}</changefreq>
      <priority>${item.priority}</priority>
   </url>`
  )
  .join("\n")}
</urlset>`;
}
