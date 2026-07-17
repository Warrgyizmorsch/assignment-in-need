"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBaseUrl } from "@/lib/api";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

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
    href: "/assignment-writing-uk",
    price: "From £12",
    orders: "12,500+ Orders",
    image: SERVICE_STYLES[0].image,
    gradient: SERVICE_STYLES[0].gradient,
  },
  {
    id: "essay-writing",
    title: "Essay Writing",
    description: "Well-researched, plagiarism-free essays",
    href: "/essay-writing-help-services",
    price: "From £12",
    orders: "18,600+ Orders",
    image: SERVICE_STYLES[1].image,
    gradient: SERVICE_STYLES[1].gradient,
  },
  {
    id: "dissertation-help",
    title: "Dissertation Help",
    description: "Expert assistance for Master's & PhD",
    href: "/dissertation-writing-help-services",
    price: "From £25",
    orders: "8,900+ Orders",
    image: SERVICE_STYLES[2].image,
    gradient: SERVICE_STYLES[2].gradient,
  },
  {
    id: "case-study-help",
    title: "Case Study Help",
    description: "In-depth case analysis and solutions",
    href: "/case-study-dissertation-help-uk",
    price: "From £15",
    orders: "6,200+ Orders",
    image: SERVICE_STYLES[3].image,
    gradient: SERVICE_STYLES[3].gradient,
  },
  {
    id: "report-writing",
    title: "Report Writing",
    description: "Detailed and structured reports",
    href: "/report-writing",
    price: "From £15",
    orders: "7,800+ Orders",
    image: SERVICE_STYLES[4].image,
    gradient: SERVICE_STYLES[4].gradient,
  },
  {
    id: "coursework-help",
    title: "Coursework Help",
    description: "Error-free coursework done on time",
    href: "/coursework-writing-help",
    price: "From £12",
    orders: "9,100+ Orders",
    image: SERVICE_STYLES[5].image,
    gradient: SERVICE_STYLES[5].gradient,
  },
  {
    id: "proofreading",
    title: "Proofreading",
    description: "Perfect grammar, zero errors",
    href: "/proofreading-and-editing-writing-help",
    price: "From £8",
    orders: "11,200+ Orders",
    image: SERVICE_STYLES[6].image,
    gradient: SERVICE_STYLES[6].gradient,
  },
  {
    id: "editing-formatting",
    title: "Editing & Formatting",
    description: "References, citations and formatting",
    href: "/dissertation-editing-and-proofreading-help-uk",
    price: "From £10",
    orders: "5,600+ Orders",
    image: SERVICE_STYLES[7].image,
    gradient: SERVICE_STYLES[7].gradient,
  },
];

const stripHtml = (value?: string) =>
  (value || "").replace(/<[^>]*>/g, "").trim();

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
  const title =
    asString(service.hero_heading) ||
    asString(service.meta_title) ||
    formatTitle(slug);
  const description =
    stripHtml(
      asString(service.hero_content) ||
        asString(service.meta_description) ||
        asString(service.why_subheading),
    ) || FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].description;
  const orderCount = asString(service.order_count) || asString(service.orders);

  return {
    id: asString(service.id) || slug || `${title}-${index}`,
    title,
    description,
    href: slug ? `/${slug}` : "/",
    price: asString(service.starting_price)
      ? `From £${asString(service.starting_price)}`
      : FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].price,
    orders: orderCount
      ? `${orderCount}+ Orders`
      : FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].orders,
    image:
      asString(service.image) || asString(service.thumbnail) || style.image,
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
  const [imgSrc, setImgSrc] = useState(service.image);

  // Sync state when props change
  useEffect(() => {
    setImgSrc(service.image);
  }, [service.image]);

  const imageSize = isFeature
    ? "absolute bottom-[-5%] right-[-5%] w-[100%] max-h-[70%]"
    : "absolute bottom-[-10px] right-[-10px] w-[62%] max-h-[80%]";
  const minHeight = isFeature
    ? "min-h-[320px] md:min-h-[380px]"
    : "min-h-[150px] md:min-h-[180px]";

  return (
    <Link
      href={service.href}
      className={`group relative overflow-hidden rounded-[20px] p-5 bg-gradient-to-br ${service.gradient} shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-300/50 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between h-full ${minHeight}`}
    >
      <div className="flex flex-col justify-between h-full w-full relative z-[2] items-start text-left">
        <div>
          <h3
            className={`${isFeature ? "text-[1.2rem]" : "text-[1.1rem]"} font-bold text-gray-900 m-0 mb-1 leading-tight line-clamp-2`}
          >
            {service.title}
          </h3>
          <p
            className={`hidden md:block text-[0.82rem] text-gray-600 m-0 mt-2 leading-relaxed ${isFeature ? "max-w-[90%]" : "max-w-[65%]"} line-clamp-2`}
          >
            {service.description}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 items-start mt-auto">
          <span className="text-xs text-gray-400 font-medium">
            {service.orders}
          </span>
          <span className="mt-2">
            <span className="text-sm font-semibold text-[#3f159a] hover:text-[#EE662F] transition-colors duration-200">
              Explore More &rarr;
            </span>
          </span>
        </div>
      </div>
      <Image
        src={imgSrc}
        alt={service.title}
        width={isFeature ? 280 : 180}
        height={isFeature ? 240 : 130}
        className={`${imageSize} object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105`}
        onError={() => {
          setImgSrc(SERVICE_STYLES[index % SERVICE_STYLES.length].image);
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
        if (!response.ok) {
          console.error("Failed to load homepage services");
          return;
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setApiServices(
            result.data.filter(isApiRecord).slice(0, 8).map(mapService),
          );
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
    <section className="py-8 md:py-10 bg-white font-sans w-full flex justify-center">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 w-full">
        <AnimateIn variant="fadeUp" className="flex flex-col text-center items-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-[1.75rem] font-black text-gray-900 m-0 mb-3 leading-tight">
            Our Most 
            <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent overflow-hidden text-ellipsis"> Popular Services</span>
          </h2>
          <p className="text-[1.02rem] max-md:text-[0.95rem] text-gray-500 m-0 leading-normal max-w-2xl">
            Explore our top-rated academic writing and support services tailored to your module needs.
          </p>
        </AnimateIn>

        <StaggerContainer className="flex flex-col md:flex-row gap-6 items-stretch w-full">
          <StaggerItem className="w-full md:w-1/4 shrink-0 h-full">
            <ServiceTile service={services[0]} index={0} isFeature />
          </StaggerItem>

          <div className="flex flex-col gap-6 flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full flex-1">
              {services.slice(1, 4).map((service, index) => (
                <StaggerItem key={service.id}>
                  <ServiceTile
                    service={service}
                    index={index + 1}
                  />
                </StaggerItem>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full flex-1">
              {services.slice(4, 8).map((service, index) => (
                <StaggerItem key={service.id}>
                  <ServiceTile
                    service={service}
                    index={index + 4}
                  />
                </StaggerItem>
              ))}
            </div>
          </div>
        </StaggerContainer>

        <Link
          href="/services"
          className="flex md:hidden justify-center items-center w-full p-2.5 mt-6 btn-shutter-blue-close rounded-lg font-semibold text-[0.8rem] transition-all duration-300"
        >
          View All Services &rarr;
        </Link>
      </div>
    </section>
  );
}
