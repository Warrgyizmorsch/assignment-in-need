"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  orderCount: string;
  image: string;
  slug: string;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  orderCount,
  image,
  slug,
  className,
}) => {
  return (
    <Card
      hoverEffect={true}
      className={cn(
        "p-0 overflow-hidden flex flex-col h-full border border-primary-100/50 group/card",
        className
      )}
    >
      <div className="relative h-44 w-full bg-primary-50 overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <div className="absolute top-3 left-3 bg-primary-700 text-white font-heading font-bold text-xs px-2.5 py-1 rounded-pill">
          {orderCount} Orders
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <CardHeader className="p-0">
          <Heading level={3} className="text-base md:text-lg group-hover/card:text-primary-700 transition-colors line-clamp-2">
            {title}
          </Heading>
        </CardHeader>

        <CardBody className="p-0 text-sm line-clamp-3 text-text-body">
          {description}
        </CardBody>

        <CardFooter className="p-0 mt-auto flex items-center justify-between border-t border-primary-50 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Starting From</span>
            <span className="font-heading font-extrabold text-lg text-primary-700">£{price}</span>
          </div>
          <Link href={`/${slug}`}>
            <Button
              variant="orangeClose"
              size="sm"
              className="px-2 py-1 text-xs font-bold gap-1"
              icon={<ArrowRight className="w-3.5 h-3.5 text-current transition-transform duration-200 group-hover/card:translate-x-1" />}
            >
              Order Now
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};
ServiceCard.displayName = "ServiceCard";
