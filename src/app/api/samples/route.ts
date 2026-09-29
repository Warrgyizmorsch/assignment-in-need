import { NextResponse } from "next/server";

export const revalidate = 600; // cache for 10 minutes

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api/samples${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
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
            success: false,
            message: `Samples API responded with status ${response.status}`,
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
          success: false,
          message: "Samples API returned invalid JSON response",
        },
        { status: 502 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to samples backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
