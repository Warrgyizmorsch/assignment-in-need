import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SUBJECTS } from "@/lib/data";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getBaseUrl, getImageUrl } from "@/lib/api";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SidebarQuoteForm } from "@/components/ui/SidebarQuoteForm";

import type { Metadata } from "next";

import { FaqAccordion } from "@/components/ui/FaqAccordion";

interface Props {
  params: Promise<{ slug: string }>;
}

import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        const post = result.data;
        const title = post.meta_title || post.tittle || "Blog - Assignment In Need";
        const description = post.meta_discribtion || post.meta_description || "Read expert academic articles and student guides.";
        const image = post.image ? getImageUrl(post.image) : undefined;
        
        return constructMetadata({
          title,
          description,
          canonicalUrl: `/blog/${slug}`,
          openGraph: {
            title,
            description,
            image,
          },
        });
      }
    }
  } catch (e) {}

  return constructMetadata({
    title: "Blog - Assignment In Need",
    canonicalUrl: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let post = null;
  let subjects: any[] = [];
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        post = result.data;
      }
    }
  } catch (error) {
    console.error("Error fetching blog detail:", error);
  }

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
    const res = await fetch(`${backendUrl}/api/subject-pages`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const payload = await res.json();
      if (
        (payload.success || payload.status === "success") &&
        Array.isArray(payload.data)
      ) {
        subjects = payload.data;
      }
    }
  } catch (error) {
    console.error("Error fetching subjects list:", error);
  }

  if (!post) {
    return (
      <SectionContainer>
        <div className="py-20 text-center text-text-heading font-semibold">
          Post not found.
        </div>
      </SectionContainer>
    );
  }

  const dateFormatted = new Date(post.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white">
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          <AnimateIn variant="fadeUp" className="lg:col-span-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-text-heading">
              {post.tittle}
            </h1>
            <div className="text-sm text-text-muted mb-4 font-semibold">
              {dateFormatted} • by Admin
            </div>

            <div className="w-full h-64 sm:h-[380px] relative mb-8 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={getImageUrl(post.images)}
                alt={post.tittle}
                fill
                className="object-cover"
                priority
              />
            </div>

            <article className="prose max-w-none text-text-body leading-relaxed">
              <div
                className="blog-content-container rich-text-content space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={0.15} className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* WhatsApp Order Banner */}
              <div className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition duration-300">
                <Link
                  href="https://wa.me/447826233106"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/whatsapp-order-now.webp"
                    alt="Order Now on WhatsApp"
                    width={600}
                    height={400}
                    className="object-cover w-full h-auto"
                  />
                </Link>
              </div>

              {/* Get Free Assignment Quote Form */}
              <SidebarQuoteForm sourceName="Blog Detail Page" />

              {/* Popular Subjects */}
              <div className="rounded-2xl bg-slate-50 p-6 shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold text-primary-700 mb-4">
                  Our Popular Subjects
                </h4>
                <ul className="space-y-2.5">
                  {(subjects.length > 0
                    ? subjects.slice(0, 8)
                    : SUBJECTS.slice(0, 8)
                  ).map((s: any, idx: number) => {
                    let finalSlug = "";
                    let name = "";
                    if (s.title) {
                      const cleanSlug = (s.slug || "").replace(/^\/+/, "");
                      finalSlug = cleanSlug.startsWith("subject/")
                        ? cleanSlug.replace("subject/", "")
                        : cleanSlug;
                      const humanized = finalSlug
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());
                      name =
                        s.title.split(" Help")[0]?.split(" Assignment")[0] ||
                        humanized;
                    } else {
                      finalSlug = s.slug || "";
                      name = s.name || "";
                    }
                    const mappedSlug =
                      finalSlug === "maths" || finalSlug === "math"
                        ? "math"
                        : finalSlug;
                    return (
                      <li key={finalSlug || idx}>
                        <Link
                          href={`/${mappedSlug}-assignment-help`}
                          className="block rounded-xl px-4 py-2.5 border border-slate-200 text-sm font-semibold text-text-heading bg-white hover:bg-primary-700 hover:text-white hover:border-primary-700 transition duration-300"
                        >
                          {name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </AnimateIn>
        </div>
      </SectionContainer>

      {/* Blog FAQs Section */}
      {(() => {
        let blogFaqs: any[] = [];
        if (post.faqs) {
          if (Array.isArray(post.faqs)) blogFaqs = post.faqs;
          else if (typeof post.faqs === "string") {
            try {
              blogFaqs = JSON.parse(post.faqs);
            } catch (e) {}
          }
        } else if (post.faq) {
          if (Array.isArray(post.faq)) blogFaqs = post.faq;
          else if (typeof post.faq === "string") {
            try {
              blogFaqs = JSON.parse(post.faq);
            } catch (e) {}
          }
        }

        if (!Array.isArray(blogFaqs) || blogFaqs.length === 0) {
          blogFaqs = [
            {
              question:
                "How does Assignment In Need help students with academic writing?",
              answer:
                "Assignment In Need provides expert academic writing assistance, coursework planning, research guidance, and proofreading services tailored to UK university standards.",
            },
            {
              question: "Are the study guides and articles free to access?",
              answer:
                "Yes, all articles, guides, and tips published on our blog are 100% free for students to read and reference.",
            },
            {
              question:
                "Can I order custom assignment help based on these blog topics?",
              answer:
                "Absolutely. Our expert writers specialize in every subject covered on our blog and can assist you with custom assignments.",
            },
          ];
        }

        return (
          <FaqAccordion
            title="Frequently Asked Questions"
            description="Helpful answers to common questions about our articles and academic guidance."
            faqs={blogFaqs}
          />
        );
      })()}
    </div>
  );
}
