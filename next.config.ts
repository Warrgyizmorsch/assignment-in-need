import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

let backendHostname = "";
let backendProtocol: "http" | "https" = "https";
if (backendUrl) {
  try {
    const parsed = new URL(backendUrl);
    backendHostname = parsed.hostname;
    backendProtocol = parsed.protocol.replace(":", "") as "http" | "https";
  } catch (e) {
    // fallback
  }
}

const remotePatterns: any[] = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "ui-avatars.com",
    pathname: "/**",
  },
];

if (backendHostname) {
  remotePatterns.push({
    protocol: backendProtocol,
    hostname: backendHostname,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
