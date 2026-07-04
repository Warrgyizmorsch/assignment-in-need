"use client";

import React from "react";
import { BlogCard } from "./BlogCard";
import { SectionContainer } from "./SectionContainer";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Badge } from "./Badge";

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

export interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <SectionContainer className="bg-white">
      <div className="flex flex-col gap-10">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
          <Badge variant="soft-purple" className="w-fit mx-auto text-xs px-3 py-1 font-bold">
            Academic Blog
          </Badge>
          <Heading level={2} className="text-3xl md:text-4xl font-extrabold text-text-heading">
            Academic Writing Tips & Guides
          </Heading>
          <Text className="text-text-muted text-sm md:text-base">
            Browse expert blog posts on assignments, dissertations, citation guides and university writing strategy.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.title} title={post.title} excerpt={post.excerpt} image={post.image} date={post.date} href={post.href} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

BlogSection.displayName = "BlogSection";
