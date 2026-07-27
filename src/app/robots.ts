import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.assignmentinneed.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/order", "/login", "/signup"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
