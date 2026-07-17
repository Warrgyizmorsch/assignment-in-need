import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SUBJECTS } from "@/lib/data";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { getBaseUrl, getImageUrl } from "@/lib/api";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SidebarQuoteForm } from "@/components/ui/SidebarQuoteForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let post = null;
  let subjects: any[] = [];
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      next: { revalidate: 600 }, // Cache post detail for 10 minutes
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
      next: { revalidate: 3600 }, // Cache subject list for 1 hour
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
                className="blog-content-container space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={0.15} className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* WhatsApp Order Banner */}
              <div className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition duration-300">
                <Link
                  href="https://wa.me/447575757575"
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
                    const mappedSlug = finalSlug === "maths" || finalSlug === "math" ? "math" : finalSlug;
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
    </div>
  );
}
