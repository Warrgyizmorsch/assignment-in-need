import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { Text } from "./Text";

export interface PromoBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  badgeItems: { icon: React.ReactNode; label: string }[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  backgroundVariant?: "primary" | "promo";
  couponCode?: string;
  layoutVariant?: "default" | "gift";
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  className,
  title,
  description,
  badgeItems,
  ctaLabel = "Get Started Now",
  onCtaClick,
  backgroundVariant = "promo",
  couponCode,
  layoutVariant = "default",
  ...props
}) => {
  const isGiftLayout = layoutVariant === "gift";

  return (
    <div
      className={cn(
        "w-full rounded-card p-6 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden",
        backgroundVariant === "promo" ? "bg-gradient-promo" : "bg-gradient-primary",
        className
      )}
      {...props}
    >
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {isGiftLayout ? (
        // Enhanced Gift Box Layout (Matching Homepage and Subject Page 30% OFF banner)
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full z-10">
          <div className="flex flex-col gap-4 max-w-xl text-left">
            <div className="inline-flex w-fit bg-white/15 px-3 py-1 rounded-pill text-xs font-heading font-semibold tracking-wide border border-white/10 uppercase">
              Limited Time Promo
            </div>
            
            <Heading level={2} className="text-white font-extrabold text-2xl md:text-3xl lg:text-4xl leading-tight">
              {title}
            </Heading>
            
            <Text className="text-primary-100 text-sm md:text-base leading-relaxed">
              {description}
            </Text>

            {couponCode && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary-200 font-semibold uppercase">Coupon Code:</span>
                <span className="bg-accent-600 font-heading font-extrabold text-white px-3.5 py-1.5 rounded-lg border-2 border-dashed border-white/20 select-all tracking-wider text-sm">
                  {couponCode}
                </span>
              </div>
            )}
          </div>

          {/* Badges and Gift graphic */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto lg:max-w-2xl">
            <div className="flex flex-col gap-3 flex-1">
              <span className="text-xs font-bold tracking-wider text-accent-400 uppercase">
                ✨ Included Absolutely FREE:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {badgeItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5 text-[10px] sm:text-xs font-semibold"
                  >
                    <span className="text-accent-500 w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift Box graphic representation */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 relative animate-pulse shadow-inner">
              <div className="text-4xl">🎁</div>
              <div className="absolute -top-1 -right-1 bg-accent-600 text-white font-heading font-extrabold text-[10px] px-1.5 py-0.5 rounded-full uppercase shadow">
                FREE
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Standard promo layout
        <>
          <div className="flex flex-col gap-4 max-w-xl w-full z-10 text-left">
            <Heading level={2} className="text-white font-extrabold text-2xl md:text-3xl lg:text-4xl leading-tight">
              {title}
            </Heading>
            <Text className="text-primary-100 text-base md:text-lg">
              {description}
            </Text>
            
            {/* Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {badgeItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-pill border border-white/5 text-xs font-semibold"
                >
                  <span className="text-accent-500 w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto z-10">
            <Button
              variant="orangeClose"
              size="lg"
              fullWidth={true}
              onClick={onCtaClick}
              className="shadow-xl shadow-black/10 hover:shadow-black/25 active:scale-95 text-base py-4 px-8"
            >
              {ctaLabel}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
PromoBanner.displayName = "PromoBanner";
