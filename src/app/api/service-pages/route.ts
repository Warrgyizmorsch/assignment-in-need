import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-fetch";

export const revalidate = 3600;

const BACKEND_URL = "https://ain.warrgyizmorsch.com";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix");

    let targetUrl = `${BACKEND_URL}/api/service-pages`;
    if (prefix) {
      targetUrl += `?prefix=${encodeURIComponent(prefix)}`;
    }

    const response = await fetchBackend(targetUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed, { status: response.status });
      } catch {
        return NextResponse.json(
          {
            status: "error",
            message: `Service Pages API responded with status ${response.status}`,
          },
          { status: response.status },
        );
      }
    }

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Service Pages API returned invalid JSON response",
        },
        { status: 502 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unable to connect to service-pages backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
