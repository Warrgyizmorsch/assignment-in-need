import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: backendProtocol,
        hostname: backendHostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
