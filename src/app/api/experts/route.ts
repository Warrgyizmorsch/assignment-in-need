import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/experts`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
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
            message: `Experts API responded with status ${response.status}`,
          },
          { status: response.status },
        );
      }
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed && parsed.success && Array.isArray(parsed.data)) {
        // Trim the extremely heavy HTML content and description to keep payload small
        const optimizedData = parsed.data.map((expert: any) => {
          const { content, description, ...trimmed } = expert;
          return trimmed;
        });
        return NextResponse.json({
          success: true,
          data: optimizedData,
        });
      }
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Experts API returned invalid JSON response",
        },
        { status: 502 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to experts backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
