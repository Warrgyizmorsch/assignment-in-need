import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SUBJECTS } from "@/lib/data";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/assets/bg/blog-bg.png";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return `${baseUrl}/${imagePath}`;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let post = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        post = result.data;
      }
    }
  } catch (error) {
    console.error("Error fetching blog detail:", error);
  }

  if (!post) {
    return (
      <SectionContainer>
        <div className="py-20 text-center text-text-heading font-semibold">Post not found.</div>
      </SectionContainer>
    );
  }

  const dateFormatted = new Date(post.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="bg-white">
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          <main className="lg:col-span-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-text-heading">{post.tittle}</h1>
            <div className="text-sm text-text-muted mb-4 font-semibold">{dateFormatted} • by Admin</div>
            
            <div className="w-full h-64 sm:h-[380px] relative mb-8 rounded-2xl overflow-hidden shadow-md">
              <img src={getImageUrl(post.images)} alt={post.tittle} className="w-full h-full object-cover" />
            </div>

            <article className="prose max-w-none text-text-body leading-relaxed">
              <div 
                className="blog-content-container space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </article>
          </main>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              
              {/* WhatsApp Order Banner */}
              <div className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition duration-300">
                <Link href="https://wa.me/447575757575" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/whatsapp-order-now.webp" alt="Order Now on WhatsApp" width={600} height={400} className="object-cover w-full h-auto" />
                </Link>
              </div>

              {/* Popular Subjects */}
              <div className="rounded-2xl bg-slate-50 p-6 shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold text-primary-700 mb-4">Our Popular Subjects</h4>
                <ul className="space-y-2.5">
                  {SUBJECTS.slice(0, 8).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/subjects/${s.slug}`} className="block rounded-xl px-4 py-2.5 border border-slate-200 text-sm font-semibold text-text-heading bg-white hover:bg-primary-700 hover:text-white hover:border-primary-700 transition duration-300">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </aside>
        </div>
      </SectionContainer>
    </div>
  );
}
