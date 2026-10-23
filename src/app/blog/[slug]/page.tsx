import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SUBJECTS } from "@/lib/data";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getBaseUrl, getImageUrl } from "@/lib/api";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SidebarQuoteForm } from "@/components/ui/SidebarQuoteForm";
import { canonicalSubjectPath } from "@/lib/utils";

import type { Metadata } from "next";

import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { BlogAuthorHeader, BlogAuthorBio } from "@/components/ui/BlogAuthor";

interface Props {
  params: Promise<{ slug: string }>;
}

import { constructMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const backendUrl = getBaseUrl() || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
    const res = await fetch(`${backendUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    });
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
  } catch (e) { }

  return constructMetadata({
    title: "Blog - Assignment In Need",
    canonicalUrl: `/blog/${slug}`,
  });
}

import { buildPageSchema } from "@/lib/data";

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let post = null;
  let subjects: any[] = [];
  let allExperts: any[] = [];

  try {
    const backendUrl =
      getBaseUrl() ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://ain.warrgyizmorsch.com";

    const [resBlog, resExperts, resSubjects] = await Promise.all([
      fetch(`${backendUrl}/api/blogs/${slug}`, {
        cache: "no-store",
      }),
      fetch(`${backendUrl}/api/experts`, {
        next: { revalidate: 3600 },
      }).catch(() => null),
      fetch(`${backendUrl}/api/subject-pages`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }).catch(() => null),
    ]);

    if (resBlog.ok) {
      const result = await resBlog.json();
      if (result.success) {
        post = result.data;
      }
    }

    if (resExperts && resExperts.ok) {
      const expertsJson = await resExperts.json();
      if (Array.isArray(expertsJson?.data)) {
        allExperts = expertsJson.data;
      }
    }

    if (resSubjects && resSubjects.ok) {
      const payload = await resSubjects.json();
      if (
        (payload.success || payload.status === "success") &&
        Array.isArray(payload.data)
      ) {
        subjects = payload.data;
      }
    }
  } catch (error) {
    console.error("Error fetching blog detail:", error);
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

  let blogFaqs: any[] = [];
  if (post.faqs) {
    if (Array.isArray(post.faqs)) blogFaqs = post.faqs;
    else if (typeof post.faqs === "string") {
      try { blogFaqs = JSON.parse(post.faqs); } catch (e) { }
    }
  } else if (post.faq) {
    if (Array.isArray(post.faq)) blogFaqs = post.faq;
    else if (typeof post.faq === "string") {
      try { blogFaqs = JSON.parse(post.faq); } catch (e) { }
    }
  }

  let author = post.author;
  if (typeof author === "string") {
    try {
      author = JSON.parse(author);
    } catch (e) {
      author = null;
    }
  }
  if (Array.isArray(author)) {
    author = author[0] || null;
  }

  // Cross-reference with writers (experts) directory to get their actual verified profile picture and page
  if (author && author.name && allExperts.length > 0) {
    const cleanAuthorName = author.name.trim().toLowerCase();
    const cleanSlug = cleanAuthorName.replace(/[^a-z0-9]+/g, "-");

    const matchedExpert = allExperts.find((exp: any) => {
      const expName = (exp.name || "").trim().toLowerCase();
      const expSlug = (exp.slug || "").trim().toLowerCase();
      return (
        expName === cleanAuthorName ||
        expSlug === cleanSlug ||
        expName.includes(cleanAuthorName) ||
        cleanAuthorName.includes(expName)
      );
    });

    if (matchedExpert) {
      author = {
        ...author,
        name: matchedExpert.name || author.name,
        photo: matchedExpert.image || matchedExpert.images || author.photo,
        description: author.description || matchedExpert.description,
        slug: matchedExpert.slug || cleanSlug,
        role: matchedExpert.role || "Academic Writer",
        profileUrl: `/writers/${matchedExpert.slug || cleanSlug}`,
      };
    }
  }

  // Calculate estimated reading time
  const plainText = (post.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const readingTime = `${readingTimeMinutes} min read`;

  const blogTitle = post.meta_title || post.tittle || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.assignmentinneed.co.uk/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.assignmentinneed.co.uk/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": ${JSON.stringify(blogTitle)},
      "item": "https://www.assignmentinneed.co.uk/blog/${slug}"
    }
  ]
}`
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: blogTitle,
              description:
                post.meta_discribtion ||
                post.meta_description ||
                "Read expert academic articles and student guides.",
              image: getImageUrl(post.images),
              author: {
                "@type": "Person",
                name: author?.name || "Admin",
                url: author?.profileUrl
                  ? `https://www.assignmentinneed.co.uk${author.profileUrl}`
                  : `https://www.assignmentinneed.co.uk/author/${
                      author?.slug ||
                      (author?.name
                        ? author.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        : "admin")
                    }`,
              },
              publisher: {
                "@type": "Organization",
                name: "Assignment In Need",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
                },
              },
              datePublished: post.created_at
                ? new Date(post.created_at).toISOString()
                : "2026-10-23T10:00:00+00:00",
              dateModified: post.updated_at
                ? new Date(post.updated_at).toISOString()
                : post.created_at
                ? new Date(post.created_at).toISOString()
                : "2026-10-23T10:00:00+00:00",
              articleBody:
                post.meta_discribtion ||
                post.meta_description ||
                plainText ||
                "",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.assignmentinneed.co.uk/blog/${slug}`,
              },
            },
            null,
            2
          ).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPageSchema(blogFaqs, false), null, 2).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <section className="w-full pt-4 pb-1 md:pt-6 md:pb-2 bg-white text-text-body">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-text-heading">
              {post.tittle}
            </h1>
            
            <BlogAuthorHeader
              author={author}
              dateFormatted={dateFormatted}
              readingTime={readingTime}
            />

            <div className="w-full relative mb-8 rounded-2xl overflow-hidden shadow-md bg-white">
              <Image
                src={getImageUrl(post.images)}
                alt={post.tittle}
                width={1200}
                height={630}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            <article className="prose max-w-none text-text-body leading-relaxed">
              <div
                className="blog-content-container rich-text-content space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Author Profile Bio Section */}
            <BlogAuthorBio author={author} />
          </div>

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
                      finalSlug = cleanSlug.match(/^subjects?\//)
                        ? cleanSlug.replace(/^subjects?\//, "")
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
                    return (
                      <li key={finalSlug || idx}>
                        <Link
                          href={canonicalSubjectPath(finalSlug)}
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
      </div>
    </section>

      {/* Blog FAQs Section */}
      {(() => {
        let blogFaqs: any[] = [];
        if (post.faqs) {
          if (Array.isArray(post.faqs)) blogFaqs = post.faqs;
          else if (typeof post.faqs === "string") {
            try {
              blogFaqs = JSON.parse(post.faqs);
            } catch (e) { }
          }
        } else if (post.faq) {
          if (Array.isArray(post.faq)) blogFaqs = post.faq;
          else if (typeof post.faq === "string") {
            try {
              blogFaqs = JSON.parse(post.faq);
            } catch (e) { }
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
            containerClassName="pt-4 pb-8 md:pt-5 md:pb-10 bg-[#faf9fe] border-t border-slate-100"
          />
        );
      })()}
    </div>
  );
}
