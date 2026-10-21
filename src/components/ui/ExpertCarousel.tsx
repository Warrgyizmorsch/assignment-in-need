"use client";

import React from "react";
import { ExpertSlider, ExpertItem } from "./ExpertSlider";

export interface ExpertData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  ordersCompleted: number | string;
  experience?: string;
  qualifications?: string;
  slug?: string;
  about?: string[] | string;
  description?: string;
}

interface ExpertCarouselProps {
  experts: ExpertData[];
  className?: string;
}

export const ExpertCarousel: React.FC<ExpertCarouselProps> = ({
  experts,
  className,
}) => {
  const mappedExperts: ExpertItem[] = experts.map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
    avatar: e.avatar,
    rating: e.rating,
    ordersCount: e.ordersCompleted,
    experience: e.experience,
    qualifications: e.qualifications,
    slug: e.slug,
    about: e.about,
    description: e.description,
  }));

  return <ExpertSlider experts={mappedExperts} className={className} />;
};

ExpertCarousel.displayName = "ExpertCarousel";
export { ExpertSlider };
