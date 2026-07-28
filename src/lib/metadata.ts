import { Metadata } from "next";

type MetadataProps = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export const constructMetadata = ({
  title = "Assignment Help UK | Human-Written Academic Support",
  description = "Need reliable Assignment Help UK? Get human-written essays, reports, coursework, and dissertations from subject specialists who understand UK universities.",
  canonicalUrl = "",
  openGraph,
  twitter,
}: MetadataProps = {}): Metadata => {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.assignmentinneed.co.uk";
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `https://${baseUrl}`;
  }
  try {
    const parsedUrl = new URL(baseUrl);
    if (parsedUrl.hostname === "assignmentinneed.co.uk" || (parsedUrl.hostname.includes("assignmentinneed") && !parsedUrl.hostname.startsWith("www."))) {
      parsedUrl.hostname = "www.assignmentinneed.co.uk";
    }
    baseUrl = parsedUrl.toString().replace(/\/+$/, "");
  } catch {
    baseUrl = "https://www.assignmentinneed.co.uk";
  }
  const url = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: "Assignment In Need",
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: openGraph?.url || url,
      images: [
        {
          url: openGraph?.image || "/assets/media/layout/og-image.jpg",
          width: 1200,
          height: 630,
          alt: openGraph?.title || title,
        },
      ],
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      site: "@assignment_in",
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: [
        {
          url: twitter?.image || "/assets/media/layout/og-image.jpg",
          alt: twitter?.title || title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};
