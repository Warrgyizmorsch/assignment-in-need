import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

// Fallback coupons list in case backend returns empty or is unreachable
const FALLBACK_COUPONS = [
  {
    id: "c1",
    code: "ANSH20",
    discount_type: "percentage",
    discount_value: 20,
    title: "Get Flat 20% OFF",
    description: "Special discount code for assignment booking.",
    badge: "POPULAR",
    expiry: "Valid till end of month"
  },
  {
    id: "c2",
    code: "SAVE20",
    discount_type: "percentage",
    discount_value: 20,
    title: "Get Extra 20% OFF",
    description: "Applicable on all academic assignment orders.",
    badge: "BEST VALUE",
    expiry: "Valid till end of month"
  },
  {
    id: "c3",
    code: "WELCOME10",
    discount_type: "percentage",
    discount_value: 10,
    title: "Get Extra 10% OFF",
    description: "First order welcome promo coupon.",
    badge: "WELCOME OFFER",
    expiry: "Valid indefinitely"
  },
  {
    id: "c4",
    code: "STUDENT15",
    discount_type: "percentage",
    discount_value: 15,
    title: "Get Extra 15% OFF",
    description: "Special student discount coupon.",
    badge: "STUDENT SPECIAL",
    expiry: "Valid till end of month"
  }
];

const normalizeCoupon = (item: any, idx: number) => {
  const code = String(
    item.coupon_code ||
    item.code ||
    item.coupon ||
    item.promo_code ||
    item.name ||
    item.title ||
    `COUPON${idx + 1}`
  ).trim().toUpperCase();

  const discount_value = Number(
    item.discount_value ||
    item.discount_percentage ||
    item.discount ||
    item.percentage ||
    item.value ||
    10
  );

  const discount_type: "percentage" | "fixed" =
    item.discount_type ||
    (item.percentage || item.discount_percentage ? "percentage" : item.type || "percentage");

  const title =
    item.title ||
    item.name ||
    item.coupon_name ||
    `Get Extra ${discount_value}${discount_type === "percentage" ? "%" : "£"} OFF`;

  const description =
    item.description ||
    item.details ||
    item.subtitle ||
    `Applicable on your assignment order. Apply at checkout.`;

  const badge =
    item.badge ||
    item.tag ||
    (discount_value >= 20 ? "BEST VALUE" : "SPECIAL OFFER");

  const expiry =
    item.expiry ||
    item.expiry_date ||
    item.valid_till ||
    item.end_date ||
    "Valid for limited time";

  return {
    id: item.id || `c_${idx}_${code}`,
    code,
    discount_type,
    discount_value,
    title,
    description,
    badge,
    expiry,
  };
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${BACKEND_URL}/api/app/coupons`, {
      method: "GET",
      headers,
    });

    if (res.ok) {
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        // Extract array from response payload
        let rawList = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.data)
          ? parsed.data
          : Array.isArray(parsed?.coupons)
          ? parsed.coupons
          : null;

        if (rawList && rawList.length > 0) {
          const normalized = rawList.map(normalizeCoupon);
          const existingCodes = new Set(normalized.map((c: any) => c.code));
          const extraFallback = FALLBACK_COUPONS.filter((f) => !existingCodes.has(f.code));
          const combined = [...normalized, ...extraFallback];

          return NextResponse.json(
            { success: true, data: combined, raw: parsed },
            { status: 200 }
          );
        }
      } catch {
        // Fallback below
      }
    }

    return NextResponse.json({ success: true, data: FALLBACK_COUPONS }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error calling /api/app/coupons:", err);
    return NextResponse.json({ success: true, data: FALLBACK_COUPONS }, { status: 200 });
  }
}
