"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBaseUrl } from "@/lib/api";

interface HomeService {
  id: string;
  title: string;
  description: string;
  href: string;
  price: string;
  orders: string;
  image: string;
  gradient: string;
}

type ApiRecord = Record<string, unknown>;

const SERVICE_STYLES = [
  {
    image: "/new-home-page-images/Assignment-Help.webp",
    gradient: "from-white to-[#f3e8ff]",
  },
  {
    image: "/new-home-page-images/Essay-Writing.webp",
    gradient: "from-white to-[#fff7ed]",
  },
  {
    image: "/new-home-page-images/Disseratation-Help.webp",
    gradient: "from-white to-[#e0e7ff]",
  },
  {
    image: "/new-home-page-images/Case-Study-Help.webp",
    gradient: "from-white to-[#fff1f2]",
  },
  {
    image: "/new-home-page-images/Report-Writing.webp",
    gradient: "from-white to-[#f0f9ff]",
  },
  {
    image: "/new-home-page-images/Coursework-Help.webp",
    gradient: "from-white to-[#f8fafc]",
  },
  {
    image: "/new-home-page-images/Proofreading.webp",
    gradient: "from-white to-[#fdf4ff]",
  },
  {
    image: "/new-home-page-images/Editing.webp",
    gradient: "from-white to-[#f0fdf4]",
  },
];

const FALLBACK_SERVICES: HomeService[] = [
  {
    id: "assignment-help",
    title: "Assignment Help",
    description: "All types of assignments on any subject",
    href: "/services/assignment-writing-uk",
    price: "From £12",
    orders: "12,500+ Orders",
    image: SERVICE_STYLES[0].image,
    gradient: SERVICE_STYLES[0].gradient,
  },
  {
    id: "essay-writing",
    title: "Essay Writing",
    description: "Well-researched, plagiarism-free essays",
    href: "/services/essay-writing-help-services",
    price: "From £12",
    orders: "18,600+ Orders",
    image: SERVICE_STYLES[1].image,
    gradient: SERVICE_STYLES[1].gradient,
  },
  {
    id: "dissertation-help",
    title: "Dissertation Help",
    description: "Expert assistance for Master's & PhD",
    href: "/services/dissertation-writing-help-services",
    price: "From £25",
    orders: "8,900+ Orders",
    image: SERVICE_STYLES[2].image,
    gradient: SERVICE_STYLES[2].gradient,
  },
  {
    id: "case-study-help",
    title: "Case Study Help",
    description: "In-depth case analysis and solutions",
    href: "/services/case-study-dissertation-help-uk",
    price: "From £15",
    orders: "6,200+ Orders",
    image: SERVICE_STYLES[3].image,
    gradient: SERVICE_STYLES[3].gradient,
  },
  {
    id: "report-writing",
    title: "Report Writing",
    description: "Detailed and structured reports",
    href: "/services/report-writing",
    price: "From £15",
    orders: "7,800+ Orders",
    image: SERVICE_STYLES[4].image,
    gradient: SERVICE_STYLES[4].gradient,
  },
  {
    id: "coursework-help",
    title: "Coursework Help",
    description: "Error-free coursework done on time",
    href: "/services/coursework-writing-help",
    price: "From £12",
    orders: "9,100+ Orders",
    image: SERVICE_STYLES[5].image,
    gradient: SERVICE_STYLES[5].gradient,
  },
  {
    id: "proofreading",
    title: "Proofreading",
    description: "Perfect grammar, zero errors",
    href: "/services/proofreading-and-editing-writing-help",
    price: "From £8",
    orders: "11,200+ Orders",
    image: SERVICE_STYLES[6].image,
    gradient: SERVICE_STYLES[6].gradient,
  },
  {
    id: "editing-formatting",
    title: "Editing & Formatting",
    description: "References, citations and formatting",
    href: "/services/dissertation-editing-and-proofreading-help-uk",
    price: "From £10",
    orders: "5,600+ Orders",
    image: SERVICE_STYLES[7].image,
    gradient: SERVICE_STYLES[7].gradient,
  },
];

const stripHtml = (value?: string) => (value || "").replace(/<[^>]*>/g, "").trim();

const isApiRecord = (value: unknown): value is ApiRecord =>
  value !== null && typeof value === "object";

const asString = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const formatTitle = (slug: string) =>
  slug
    .split("/")
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "Academic Service";

const mapService = (service: ApiRecord, index: number): HomeService => {
  const style = SERVICE_STYLES[index % SERVICE_STYLES.length];
  const slug = asString(service.slug);
  const title = asString(service.hero_heading) || asString(service.meta_title) || formatTitle(slug);
  const description =
    stripHtml(asString(service.hero_content) || asString(service.meta_description) || asString(service.why_subheading)) ||
    FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].description;
  const orderCount = asString(service.order_count) || asString(service.orders);

  return {
    id: asString(service.id) || slug || `${title}-${index}`,
    title,
    description,
    href: slug ? `/services/${slug}` : "/services",
    price: asString(service.starting_price) ? `From £${asString(service.starting_price)}` : FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].price,
    orders: orderCount ? `${orderCount}+ Orders` : FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].orders,
    image: asString(service.image) || asString(service.thumbnail) || style.image,
    gradient: style.gradient,
  };
};

function ServiceTile({
  service,
  index,
  isFeature = false,
}: {
  service: HomeService;
  index: number;
  isFeature?: boolean;
}) {
  const imageSize = isFeature
    ? "absolute bottom-[-5%] right-[-5%] w-[110%] max-h-[75%]"
    : "absolute bottom-[-15px] right-[-15px] w-[65%] max-h-[85%]";
  const minHeight = isFeature ? "min-h-[380px] md:min-h-[464px]" : "min-h-[180px] md:min-h-[220px]";

  return (
    <Link
      href={service.href}
      className={`group relative overflow-hidden rounded-[20px] p-6 bg-gradient-to-br ${service.gradient} shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between h-full ${minHeight}`}
    >
      <div className="flex flex-col justify-between h-full w-full relative z-[2] items-start text-left">
        <div>
          <h3 className={`${isFeature ? "text-[1.2rem]" : "text-[1.1rem]"} font-bold text-gray-900 m-0 mb-1 leading-tight line-clamp-2`}>
            {service.title}
          </h3>
          <p className={`hidden md:block text-[0.82rem] text-gray-600 m-0 mt-2 leading-relaxed ${isFeature ? "max-w-[90%]" : "max-w-[65%]"} line-clamp-2`}>
            {service.description}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 items-start mt-auto">
          <span className="text-xs text-gray-400 font-medium">{service.orders}</span>
          <span className="mt-2 inline-flex items-center justify-center rounded-lg bg-white/85 border border-indigo-100 px-3 py-1.5 text-[0.72rem] font-extrabold text-[#3f159a] shadow-[0_4px_10px_rgba(63,21,154,0.08)] transition-all duration-300 group-hover:bg-[#3f159a] group-hover:text-white group-hover:border-[#3f159a]">
            Explore More &rarr;
          </span>
        </div>
      </div>
      <img
        src={service.image}
        alt={service.title}
        className={`${imageSize} object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105`}
        onError={(event) => {
          event.currentTarget.src = SERVICE_STYLES[index % SERVICE_STYLES.length].image;
        }}
      />
    </Link>
  );
}

export default function PopularServices() {
  const [apiServices, setApiServices] = useState<HomeService[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/service-pages`);
        if (!response.ok) throw new Error("Failed to load homepage services");

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setApiServices(result.data.filter(isApiRecord).slice(0, 8).map(mapService));
        }
      } catch (err) {
        console.error("Error fetching homepage services:", err);
      }
    };

    fetchServices();
  }, []);

  const services = useMemo(() => {
    const ids = new Set(apiServices.map((service) => service.id));
    return [
      ...apiServices,
      ...FALLBACK_SERVICES.filter((service) => !ids.has(service.id)),
    ].slice(0, 8);
  }, [apiServices]);

  return (
    <section className="py-12 md:py-16 bg-white font-sans w-full flex justify-center">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 w-full">
        <h2 className="text-center text-2xl md:text-[2.2rem] font-black text-gray-900 m-0 mb-8 md:mb-12">
          Our Most Popular Services
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
          <div className="w-full md:w-1/4 shrink-0 h-full">
            <ServiceTile service={services[0]} index={0} isFeature />
          </div>

          <div className="flex flex-col gap-6 flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full flex-1">
              {services.slice(1, 4).map((service, index) => (
                <ServiceTile key={service.id} service={service} index={index + 1} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full flex-1">
              {services.slice(4, 8).map((service, index) => (
                <ServiceTile key={service.id} service={service} index={index + 4} />
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/services"
          className="flex md:hidden justify-center items-center w-full p-2.5 mt-6 bg-white border border-gray-200 rounded-lg text-indigo-600 font-semibold text-[0.8rem] transition-all duration-300 hover:bg-gray-50 hover:text-indigo-800"
        >
          View All Services &rarr;
        </Link>
      </div>
    </section>
  );
}
