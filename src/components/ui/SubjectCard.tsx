"use client";

import React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { canonicalSubjectPath } from "@/lib/utils";
import { Card } from "./Card";
import { Heading } from "./Heading";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  name: string;
  iconName: string;
  orderCount?: string;
  sampleCount?: number;
  letterBadge: string;
  letterColorClass?: string; // e.g. bg-primary-100 text-primary-700
  slug: string;
  className?: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  name,
  iconName,
  orderCount,
  sampleCount,
  letterBadge,
  letterColorClass = "bg-primary-100 text-primary-700",
  slug,
  className,
}) => {
  const IconComponent =
    (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
      >
    )[iconName] || Icons.BookOpen;

  const cleanSlug = (slug || "").replace(/^\/+/, "");
  const finalSlug = cleanSlug.startsWith("subject/")
    ? cleanSlug.replace("subject/", "")
    : cleanSlug;
  const path = canonicalSubjectPath(finalSlug);

  return (
    <Link href={path} className="block">
      <Card
        hoverEffect={true}
        className={cn(
          "flex-row items-center gap-4 p-4 border border-primary-100/50 hover:border-primary-200 bg-white group/card",
          className,
        )}
      >
        {/* Letter Badge Indicator */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-heading font-extrabold text-sm shrink-0",
            letterColorClass,
          )}
        >
          {letterBadge}
        </div>

        {/* Icon and metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-primary-500 shrink-0" />
            <Heading
              level={4}
              className="text-sm md:text-base group-hover/card:text-primary-700 transition-colors truncate"
            >
              {name}
            </Heading>
          </div>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            {orderCount
              ? `${orderCount} Orders Completed`
              : `${sampleCount} Free Samples`}
          </p>
        </div>

        {/* Action arrow */}
        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 group-hover/card:bg-primary-700 group-hover/card:text-white transition-colors duration-200">
          <Icons.ChevronRight className="w-4 h-4" />
        </div>
      </Card>
    </Link>
  );
};
SubjectCard.displayName = "SubjectCard";
