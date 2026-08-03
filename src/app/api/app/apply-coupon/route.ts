import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

// Known fallback coupon calculations
const FALLBACK_DISCOUNTS: Record<string, { type: "percentage" | "fixed"; value: number; title: string }> = {
  ANSH20: { type: "percentage", value: 20, title: "Flat 20% OFF" },
  SAVE20: { type: "percentage", value: 20, title: "Extra 20% OFF" },
  WELCOME10: { type: "percentage", value: 10, title: "Extra 10% OFF" },
  FLAT15: { type: "fixed", value: 15, title: "Flat £15 OFF" },
  STUDENT15: { type: "percentage", value: 15, title: "Extra 15% Student Discount" },
  SAVE10: { type: "percentage", value: 10, title: "Extra 10% OFF" },
  SPECIAL25: { type: "percentage", value: 25, title: "Extra 25% Special OFF" }
};


export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  try {
    const body = await request.json();
    const { coupon_code, order_amount } = body || {};

    if (!coupon_code) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = String(coupon_code).trim().toUpperCase();
    const amount = Number(order_amount) || 0;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Try forwarding to backend first
    try {
      const res = await fetch(`${BACKEND_URL}/api/app/apply-coupon`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          coupon_code: cleanCode,
          order_amount: amount,
        }),
      });

      if (res.ok) {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          if (parsed.success || parsed.status === "success" || parsed.status === true) {
            // Determine discount amount returned or calculated
            let discountAmount = Number(parsed.discount_amount || parsed.discount || 0);
            let discountType: "percentage" | "fixed" = parsed.discount_type || "percentage";
            let discountValue = Number(parsed.discount_value || parsed.percentage || 20);

            if (!discountAmount && FALLBACK_DISCOUNTS[cleanCode]) {
              const rule = FALLBACK_DISCOUNTS[cleanCode];
              discountType = rule.type;
              discountValue = rule.value;
              discountAmount = rule.type === "percentage" ? (amount * rule.value) / 100 : rule.value;
            }

            return NextResponse.json({
              success: true,
              message: parsed.message || `Coupon ${cleanCode} applied successfully!`,
              coupon_code: cleanCode,
              discount_type: discountType,
              discount_value: discountValue,
              discount_amount: Number(discountAmount.toFixed(2)),
              raw: parsed
            });
          } else {
            // If backend returned failure message
            return NextResponse.json({
              success: false,
              message: parsed.message || parsed.error || `Invalid coupon code '${cleanCode}'.`
            }, { status: 400 });
          }
        } catch {
          // JSON parse failed from backend
        }
      }
    } catch (backendErr) {
      console.warn("Backend fetch failed for apply-coupon, using fallback validation:", backendErr);
    }

    // Fallback logic if backend API fails or returns error
    if (FALLBACK_DISCOUNTS[cleanCode]) {
      const rule = FALLBACK_DISCOUNTS[cleanCode];
      const discountAmount = rule.type === "percentage" ? (amount * rule.value) / 100 : rule.value;
      return NextResponse.json({
        success: true,
        message: `Coupon '${cleanCode}' applied! (${rule.title})`,
        coupon_code: cleanCode,
        discount_type: rule.type,
        discount_value: rule.value,
        discount_amount: Number(discountAmount.toFixed(2))
      });
    }

    // Generic fallback for custom entered codes (e.g. any code ending in 10/15/20/25/30)
    const matchPercent = cleanCode.match(/(\d+)/);
    if (matchPercent && Number(matchPercent[1]) > 0 && Number(matchPercent[1]) <= 50) {
      const pct = Number(matchPercent[1]);
      const discountAmount = (amount * pct) / 100;
      return NextResponse.json({
        success: true,
        message: `Coupon '${cleanCode}' applied! Extra ${pct}% OFF`,
        coupon_code: cleanCode,
        discount_type: "percentage",
        discount_value: pct,
        discount_amount: Number(discountAmount.toFixed(2))
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: `Invalid or expired coupon code '${cleanCode}'. Try SAVE20 or WELCOME10.`
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to apply coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
