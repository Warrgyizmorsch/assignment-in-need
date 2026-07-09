import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Trophy, Users, Star, GraduationCap } from "lucide-react";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Button } from "./Button";

interface StatsStripProps {
  className?: string;
  variant?: "purple" | "navy";
  showCta?: boolean;
  ctaText?: string;
  ctaDescription?: string;
}

const stats = [
  { icon: Trophy, value: "182,532+", label: "Orders Delivered" },
  { icon: Users, value: "30,000+", label: "Happy Clients" },
  { icon: Star, value: "4.8/5", label: "Clients Rating" },
  { icon: GraduationCap, value: "4,500+", label: "Ph.D Experts" },
];

export const StatsStrip: React.FC<StatsStripProps> = ({
  className,
  variant = "purple",
  showCta = true,
  ctaText = "Need Expert Help With Your Assignments?",
  ctaDescription = "Our professional academic writers are here to deliver high-quality, plagiarism-free assignments tailored to your requirements.",
}) => {
  const bgClass =
    variant === "purple"
      ? "bg-gradient-to-r from-[#1c0f6f] to-[#3a1baf]"
      : "bg-navy-900";

  if (!showCta) {
    return (
      <div
        className={cn(
          "w-full rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none",
          bgClass,
          className
        )}
      >
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 w-full">
          {stats.map((stat, idx, arr) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center justify-start md:justify-center relative px-4"
              >
                {/* White Circle Icon Container */}
                <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center text-[#3f159a] shrink-0 shadow-md">
                  <Icon className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                
                {/* Text Block */}
                <div className="flex flex-col text-left justify-center pl-3.5">
                  <span className="font-heading font-extrabold text-[18px] md:text-[20px] text-white leading-none mb-1 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-white/85 text-[11.5px] md:text-[12px] font-semibold tracking-wide whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>

                {/* Vertical Divider line for desktop */}
                {idx < arr.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-white/20 hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className={cn("w-full bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className={cn(
          "flex flex-col gap-8",
          showCta ? "lg:flex-row lg:items-center lg:justify-between" : "items-center"
        )}>
          {showCta && (
            <div className="flex flex-col gap-3 lg:max-w-md">
              <Heading level={3} className="text-white leading-tight">
                {ctaText}
              </Heading>
              <Text className="text-primary-100/70 text-sm leading-relaxed">
                {ctaDescription}
              </Text>
              <Link href="/pricing" className="mt-2 w-fit">
                <Button
                  variant="orangeOpen"
                  size="sm"
                  className="font-heading font-semibold rounded-btn transition-colors flex items-center gap-2"
                >
                  Get Free Quote Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          )}

          <div className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8",
            !showCta && "w-full"
          )}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-1">
                  <stat.icon className="w-6 h-6 text-accent-400" />
                </div>
                <span className="font-heading font-extrabold text-2xl md:text-3xl text-white">
                  {stat.value}
                </span>
                <span className="text-primary-100/70 text-xs md:text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
StatsStrip.displayName = "StatsStrip";
