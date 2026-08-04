"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Tag,
  CheckCircle2,
  Loader2,
  Clock,
  Percent,
  Check,
  ArrowRight,
  Ticket,
  Sparkles,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export interface CouponItem {
  id?: string;
  code: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  min_order_amount?: number;
  title?: string;
  description?: string;
  badge?: string;
  expiry?: string;
}

export interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  appliedCouponCode?: string | null;
  onApplyCoupon: (appliedData: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
    message?: string;
  } | null) => void;
}

const DEFAULT_COUPONS: CouponItem[] = [
  {
    id: "c_aadi03",
    code: "AADI03",
    discount_type: "percentage",
    discount_value: 15,
    min_order_amount: 45,
    title: "Get Extra 15% OFF",
    description: "Valid on orders above £45",
    badge: "MIN £45",
  },
  {
    id: "c_ansh20",
    code: "ANSH20",
    discount_type: "percentage",
    discount_value: 20,
    min_order_amount: 0,
    title: "Get Flat 20% OFF",
    description: "Special discount code for assignment booking",
    badge: "POPULAR",
  },
  {
    id: "c_save20",
    code: "SAVE20",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 0,
    title: "Get Extra 10% OFF",
    description: "Applicable on your assignment order",
    badge: "BEST VALUE",
  },
];


export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  orderAmount,
  appliedCouponCode,
  onApplyCoupon,
}) => {
  const [manualCode, setManualCode] = useState("");
  const [coupons, setCoupons] = useState<CouponItem[]>(DEFAULT_COUPONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedInfo, setAppliedInfo] = useState<{
    code: string;
    discountValue: number;
    discountType: string;
  } | null>(null);

  // Dynamically find highest discount coupon THAT IS ACTUALLY APPLICABLE on the user's order right now
  const bestCoupon = React.useMemo(() => {
    if (!coupons || coupons.length === 0) return null;

    // Filter only coupons where minimum order requirement is met
    const applicable = coupons.filter((c: CouponItem) => {
      const minOrder = Number(c.min_order_amount || 0);
      return minOrder === 0 || orderAmount >= minOrder;
    });

    if (applicable.length > 0) {
      return [...applicable].sort((a, b) => (b.discount_value || 0) - (a.discount_value || 0))[0];
    }

    // Fallback if no coupon is applicable yet
    return [...coupons].sort((a, b) => Number(a.min_order_amount || 0) - Number(b.min_order_amount || 0))[0] || null;
  }, [coupons, orderAmount]);

  // Sort coupons: Applicable coupons top, locked/unmet min amount coupons bottom
  const sortedCoupons = React.useMemo(() => {
    if (!coupons || coupons.length === 0) return [];
    return [...coupons].sort((a, b) => {
      const minA = Number(a.min_order_amount || 0);
      const minB = Number(b.min_order_amount || 0);
      const notMetA = minA > 0 && orderAmount < minA;
      const notMetB = minB > 0 && orderAmount < minB;

      if (notMetA !== notMetB) {
        return notMetA ? 1 : -1;
      }
      return (b.discount_value || 0) - (a.discount_value || 0);
    });
  }, [coupons, orderAmount]);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Sync applied code from props
  useEffect(() => {
    if (appliedCouponCode) {
      setAppliedInfo({
        code: appliedCouponCode,
        discountValue: 20,
        discountType: "percentage",
      });
      setManualCode(appliedCouponCode);
    } else {
      setAppliedInfo(null);
    }
  }, [appliedCouponCode]);

  // Fetch coupons list on open
  useEffect(() => {
    if (!isOpen) return;

    const fetchCoupons = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("ain_auth_token") : null;
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/app/coupons", { headers });
        if (res.ok) {
          const payload = await res.json();
          if (payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
            const normalized = payload.data.map((item: any, idx: number) => {
              const minAmt = Number(item.min_order_amount || item.min_amount || item.min_order || 0);
              const discVal = Number(item.discount_value || 20);
              const discType = item.discount_type || "percentage";
              return {
                id: item.id || `c_${idx}`,
                code: String(item.code || item.coupon_code || "SAVE20").toUpperCase(),
                discount_type: discType,
                discount_value: discVal,
                min_order_amount: minAmt,
                title: item.title || `Get ${discVal}% OFF`,
                description: item.description || (minAmt > 0 ? `Valid on orders above £${minAmt}` : "Applicable on your assignment order"),
                badge: item.badge || (minAmt > 0 ? `MIN £${minAmt}` : "EXCLUSIVE"),
              };
            });
            setCoupons(normalized);
          } else {
            setCoupons(DEFAULT_COUPONS);
          }
        } else {
          setCoupons(DEFAULT_COUPONS);
        }
      } catch (err) {
        console.error("Failed to load coupons:", err);
        setCoupons(DEFAULT_COUPONS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [isOpen]);

  // Handle applying code
  const handleApply = async (codeToApply: string) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    setErrorMsg(null);

    // Match exact clicked/entered coupon or default
    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);
    const discountVal = foundCoupon?.discount_value || 20;
    const discountType = foundCoupon?.discount_type || "percentage";
    const minOrder = Number(foundCoupon?.min_order_amount || 0);

    // Minimum order amount validation
    if (minOrder > 0 && orderAmount < minOrder) {
      const shortfall = (minOrder - orderAmount).toFixed(2);
      const msg = `Add £${shortfall} more to your order to apply '${cleanCode}' (Min. order £${minOrder}.00 required).`;
      setErrorMsg(msg);
      toast.error(msg);
      setIsApplying(false);
      return;
    }

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("ain_auth_token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/app/apply-coupon", {
        method: "POST",
        headers,
        body: JSON.stringify({
          coupon_code: cleanCode,
          order_amount: orderAmount,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const type = data.discount_type || discountType;
        const value = Number(data.discount_value) || discountVal;
        const amount = Number(data.discount_amount) || Math.round((orderAmount * value) / 100);

        onApplyCoupon({
          code: cleanCode,
          discountType: type,
          discountValue: value,
          discountAmount: amount,
          message: data.message,
        });

        setAppliedInfo({
          code: cleanCode,
          discountValue: value,
          discountType: type,
        });

        toast.success(data.message || `Coupon '${cleanCode}' applied successfully!`);

        setTimeout(() => {
          onClose();
        }, 300);
      } else {
        const errMsg = data.message || `Coupon '${cleanCode}' cannot be applied.`;
        setErrorMsg(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = `Failed to apply coupon '${cleanCode}'. Please try again.`;
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setIsApplying(false);
    }
  };

  // Handle removing applied coupon
  const handleRemove = () => {
    onApplyCoupon(null);
    setAppliedInfo(null);
    setManualCode("");
    toast.success("Coupon removed successfully!");
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container: Swiggy Style Bottom Sheet on Mobile / Centered Card on Desktop */}
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.98 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 340,
            }}
            className="relative w-full max-w-lg md:max-w-3xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 my-0 md:my-auto max-h-[82vh] h-auto flex flex-col"
          >
            {/* Mobile Drag Top Bar Handle */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 md:hidden shrink-0" />

            {/* Desktop Floating Close Button */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 shadow-md border border-slate-200/80 items-center justify-center transition-all hover:scale-105 z-30 cursor-pointer outline-none"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Grid Layout: Left Visual Banner (DESKTOP ONLY) & Right Form Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar">

              {/* LEFT COLUMN: DESKTOP ONLY (Integrated gift-coupon.webp 3D Graphic) */}
              <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-[#f1ebfc] via-[#ece5fa] to-[#e4dcf7] p-5 flex-col justify-between relative overflow-hidden border-r border-purple-200/70 shrink-0 select-none">
                
                {/* Floating Background Sparkles */}
                <div className="absolute top-3 left-4 text-purple-300 opacity-60 text-xs select-none animate-pulse">✦</div>
                <div className="absolute top-10 right-6 text-purple-400 opacity-50 text-sm select-none animate-bounce">✸</div>
                <div className="absolute bottom-20 left-6 text-indigo-300 opacity-50 text-xs">★</div>

                {/* Desktop Header Banner */}
                <div className="relative z-10 flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-200/90 text-purple-950 text-[11px] font-black tracking-wider uppercase border border-purple-300/70 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-purple-700 animate-pulse" />
                    EXCLUSIVE OFFER
                  </span>

                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Special Discount <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">
                        Just For You!
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed max-w-xs">
                      Use coupon code to get instant discount on your booking.
                    </p>
                  </div>
                </div>

                {/* Interactive 3D Gift Coupon Graphic (gift-coupon.webp with Live Text Overlay) */}
                <div className="relative z-10 w-full my-auto flex justify-center items-center">
                  {(() => {
                    const currentCode = manualCode || appliedInfo?.code || bestCoupon?.code || coupons[0]?.code || "ANSH20";
                    const currentCoupon = coupons.find(c => c.code.toUpperCase() === currentCode.toUpperCase()) || bestCoupon || coupons[0];
                    const currentDiscount = currentCoupon?.discount_value || 20;

                    return (
                      <div className="relative w-full max-w-[275px] aspect-square flex items-center justify-center select-none group">
                        {/* Soft Ambient Glow behind image */}
                        <div className="absolute inset-0 bg-purple-400/20 blur-2xl rounded-full scale-95 group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* 3D Gift & Ticket Graphic */}
                        <img
                          src="/images/gift-coupon.webp"
                          alt="3D Gift Coupon"
                          className="w-full h-full object-contain relative z-10 drop-shadow-md transition-transform duration-500 group-hover:scale-102"
                        />

                        {/* Live Dynamic Text overlay over the 3D ticket area on the image (Tilted -8.5deg to match ticket angle) */}
                        <div
                          style={{ transform: "rotate(-8.5deg)" }}
                          className="absolute top-[17%] left-[17%] right-[17%] h-[33%] z-20 flex flex-col items-center justify-center text-center pointer-events-none"
                        >
                          <motion.div
                            key={currentCode}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="flex flex-col items-center justify-center"
                          >
                            <span className="text-[9px] font-black tracking-widest text-purple-200 uppercase drop-shadow-xs font-mono">
                              GET INSTANT
                            </span>
                            <div className="text-2xl font-black text-white tracking-tight leading-none my-0.5 font-mono drop-shadow-md">
                              {currentDiscount}% OFF
                            </div>
                            <div className="mt-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-mono font-extrabold tracking-wider text-amber-300 uppercase shadow-2xs flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5 text-amber-300" />
                              {currentCode}
                            </div>
                          </motion.div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>



              {/* RIGHT COLUMN: Compact Content-Hugging Layout */}
              <div className="col-span-12 md:col-span-7 p-4 sm:p-5 bg-white flex flex-col justify-start relative gap-3">

                {/* Mobile Header Bar with Close Button */}
                <div className="flex items-center justify-between pb-1 border-b md:border-b-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <Percent className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Apply Coupon Code
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Enter promo code to avail discount
                      </p>
                    </div>
                  </div>

                  {/* Mobile Close Button */}
                  <button
                    onClick={onClose}
                    className="md:hidden w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Action Area */}
                <div className="flex flex-col gap-2">
                  {appliedInfo ? (
                    /* APPLIED STATE BAR WITH REMOVE BUTTON */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-2 sm:p-2.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/80 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-mono font-extrabold text-xs tracking-wider uppercase flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                          {appliedInfo.code}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-emerald-900 truncate">
                            Coupon Applied ({appliedInfo.discountValue}% OFF)
                          </h4>
                          <p className="text-[10px] text-emerald-700 font-medium truncate">
                            Extra savings applied to your order!
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemove}
                        className="py-1.5 px-3 rounded-lg bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    /* REGULAR INPUT BOX (WHEN NO COUPON IS APPLIED) */
                    <div className="p-1 sm:p-1.5 rounded-xl border-2 border-dashed border-purple-300/80 bg-purple-50/40 focus-within:border-purple-600 focus-within:bg-white transition-all shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          <Percent className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={manualCode}
                          onChange={(e) => {
                            setManualCode(e.target.value.toUpperCase());
                            if (errorMsg) setErrorMsg(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApply(manualCode);
                            }
                          }}
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 uppercase placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal outline-none px-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleApply(manualCode)}
                          disabled={isApplying}
                          className="py-1.5 px-3.5 sm:py-2 sm:px-5 rounded-lg bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1"
                        >
                          {isApplying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMsg && (
                    <p className="text-xs text-red-500 font-semibold px-1">
                      {errorMsg}
                    </p>
                  )}
                </div>

                {/* AVAILABLE COUPONS LIST SECTION */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-purple-700" />
                      Available Coupons
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Tap to Apply / Remove
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                    {sortedCoupons.map((coupon: CouponItem) => {
                      const isApplied = appliedInfo?.code === coupon.code;
                      const minOrder = Number(coupon.min_order_amount || 0);
                      const isMinNotMet = minOrder > 0 && orderAmount < minOrder;
                      const shortfall = (minOrder - orderAmount).toFixed(2);

                      return (
                        <div
                          key={coupon.code}
                          onClick={() => {
                            if (isApplied) {
                              handleRemove();
                            } else if (isMinNotMet) {
                              // Locked coupon: Cannot be applied
                              return;
                            } else {
                              setManualCode(coupon.code);
                              handleApply(coupon.code);
                            }
                          }}
                          className={`rounded-xl border p-2.5 sm:p-3 flex items-center justify-between gap-2.5 transition-all ${
                            isApplied
                              ? "bg-emerald-50/90 border-emerald-400 shadow-2xs cursor-pointer"
                              : isMinNotMet
                              ? "bg-amber-50/30 border-amber-200/70 opacity-80 cursor-not-allowed select-none"
                              : "bg-slate-50/80 hover:bg-purple-50/60 border-slate-200 hover:border-purple-300 cursor-pointer group"
                          }`}
                        >
                          {/* Coupon Details Left */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`px-2 py-0.5 rounded-lg border font-mono font-black text-xs tracking-wider uppercase shrink-0 flex items-center gap-1 shadow-2xs ${
                                isApplied
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : isMinNotMet
                                  ? "bg-amber-100/80 border-amber-300 text-amber-900 font-bold"
                                  : "bg-white border-dashed border-purple-300 text-purple-800"
                              }`}
                            >
                              {isMinNotMet ? <Lock className="w-3 h-3 text-amber-700" /> : <Tag className="w-3 h-3" />}
                              {coupon.code}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <h5 className="font-extrabold text-xs text-slate-900 truncate">
                                  {coupon.title}
                                </h5>
                              </div>
                              <p className={`text-[10px] truncate mt-0.2 ${isMinNotMet ? "text-amber-800 font-semibold" : "text-slate-500 font-medium"}`}>
                                {isMinNotMet
                                  ? `Add £${shortfall} more to unlock (Min. order £${minOrder})`
                                  : coupon.description}
                              </p>
                            </div>
                          </div>

                          {/* Apply / Remove / Locked CTA Badge Right */}
                          {isMinNotMet ? (
                            <button
                              type="button"
                              disabled
                              className="py-1.5 px-3 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-100/80 text-amber-900 border border-amber-300/80 shadow-2xs flex items-center gap-1 shrink-0 cursor-not-allowed opacity-90"
                            >
                              <Lock className="w-3 h-3 text-amber-700" />
                              ADD £{shortfall} MORE
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isApplied) {
                                  handleRemove();
                                } else {
                                  setManualCode(coupon.code);
                                  handleApply(coupon.code);
                                }
                              }}
                              className={`py-1.5 px-3 sm:px-3.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                                isApplied
                                  ? "bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200"
                                  : "bg-purple-100 group-hover:bg-purple-700 text-purple-800 group-hover:text-white"
                              }`}
                            >
                              {isApplied ? (
                                <>
                                  <Trash2 className="w-3 h-3" />
                                  Remove
                                </>
                              ) : (
                                <>
                                  APPLY
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Time Limit Urgency Notice (Immediately Below Coupons) */}
                <div className="pt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 font-medium border-t border-slate-100 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Hurry up! This offer is valid for a limited time only.</span>
                </div>

              </div>



            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
