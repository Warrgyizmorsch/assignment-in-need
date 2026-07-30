"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Phone,
  User,
  X,
} from "lucide-react";
import { canonicalSubjectPath, cn } from "@/lib/utils";
import "./navbar.css";

type NavLinkItem = {
  name: string;
  path: string;
  disabled?: boolean;
  children?: NavLinkItem[];
};

type ServicePageApiItem = {
  id?: number;
  slug?: string | null;
  title?: string | null;
  meta_title?: string | null;
  hero_heading?: string | null;
  hasSubmenu?: boolean;
  children?: ServicePageApiItem[];
};

const serviceHref = (slug: string) => `/${slug.replace(/^\/+/, "")}`;

const SERVICE_PAGES_API_URL = "/api/service-pages";

const humanizeSlug = (slug: string) =>
  slug
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const ensureRelativePath = (url: string): string => {
  if (!url) return "/";
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch { }
  return url.startsWith("/") ? url : `/${url}`;
};

const ASSIGNMENT_SERVICE_SUBJECTS: NavLinkItem[] = [
  {
    name: "Marketing Assignment Help UK",
    path: canonicalSubjectPath("marketing"),
  },
  { name: "MBA Assignment Help", path: canonicalSubjectPath("mba") },
  {
    name: "Accounting Assignment Help",
    path: canonicalSubjectPath("accounting"),
  },
  { name: "Law Assignment Help", path: canonicalSubjectPath("law") },
  {
    name: "Programming Assignment Help",
    path: canonicalSubjectPath("programming"),
  },
  {
    name: "Nursing Assignment Help",
    path: canonicalSubjectPath("nursing"),
  },
];
const isNonServicePage = (item: ServicePageApiItem) => {
  const rawSlug = (item.slug || "").toLowerCase().trim().replace(/^\/+/, "");
  if (
    rawSlug.startsWith("cities/") ||
    rawSlug.startsWith("city/") ||
    rawSlug.includes("/cities/") ||
    rawSlug.includes("/city/") ||
    rawSlug.startsWith("assignment-help-") ||
    rawSlug.startsWith("subject/") ||
    rawSlug.includes("/subject/") ||
    rawSlug.includes("management-assignment-help")
  ) {
    return true;
  }
  const searchableText = [
    item.slug,
    item.title,
    item.hero_heading,
    item.meta_title,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\b(london|birmingham|manchester|leeds|glasgow|edinburgh|bristol|liverpool|sydney|melbourne|brisbane|perth|adelaide|canberra|toronto|vancouver|montreal|ottawa|dubai|abu-dhabi|sharjah|kuala-lumpur|penang)\b/i.test(
    searchableText,
  );
};

const mapServicePagesToMenu = (
  services: ServicePageApiItem[],
): NavLinkItem[] => {
  return services
    .filter((service) => !isNonServicePage(service))
    .map((service) => {
      const parentSlug = service.slug?.trim().replace(/^\/+/, "") || "";
      const parentPath = `/${parentSlug}`;

      const parentName = service.title?.trim() || service.hero_heading?.trim() || service.meta_title?.trim() || humanizeSlug(parentSlug || "service");

      const isAssignmentParent =
        parentSlug === "service/assignment" ||
        parentSlug === "assignment" ||
        parentSlug === "assignment-writing-uk" ||
        /assignment writing (?:help )?uk/i.test(parentName);

      const mappedChildren = isAssignmentParent
        ? ASSIGNMENT_SERVICE_SUBJECTS
        : Array.isArray(service.children)
          ? service.children
            .filter((child) => !isNonServicePage(child))
            .map((child) => {
              const rawChildSlug = child.slug?.trim().replace(/^\/+/, "") || "";
              let childPath = `/${rawChildSlug}`;

              if (isAssignmentParent || rawChildSlug.startsWith("service/assignment/")) {
                const lastSeg = rawChildSlug.split("/").pop() || rawChildSlug;
                childPath = canonicalSubjectPath(lastSeg);
              }

              const childName = child.title?.trim() || child.hero_heading?.trim() || child.meta_title?.trim() || humanizeSlug(rawChildSlug || "service");
              return {
                name: childName,
                path: childPath,
              };
            }).sort((first, second) => first.name.localeCompare(second.name))
          : undefined;

      return {
        name: parentName,
        path: parentPath,
        children: mappedChildren,
      };
    }).sort((first, second) => first.name.localeCompare(second.name));
};

const SUBJECTS: NavLinkItem[] = [
  ["Math Assignment Help", "subject/maths"],
  ["Chemistry Assignment Help", "subject/chemistry"],
  ["History Assignment Help UK", "subject/history"],
  ["Marketing Assignment Help UK", "subject/marketing"],
  ["Business Assignment Help", "subject/business"],
  ["MBA Assignment Help", "subject/mba-assignment-help"],
  ["Finance Assignment Help", "subject/finance-assignment-help"],
  ["Accounting Assignment Help", "subject/accounting-assignment-help"],
  ["Statistics Assignment Help", "subject/statistics-assignment-help"],
  ["Law Assignment Help", "subject/law-assignment-help"],
  ["Corporate Law Assignment Help", "subject/corporate-law-assignment-help"],
  ["HR Assignment Help", "subject/hr-assignment-help"],
  ["Project Management Assignment Help", "subject/project-management-assignment-help"],
  ["Programming Assignment Help", "subject/programming-assignment-help"],
].map(([name, slug]) => {
  return { name, path: canonicalSubjectPath(slug) };
});

const RESOURCES: NavLinkItem[] = [
  { name: "Blog", path: "/blog" },
  { name: "Pricing", path: "/pricing" },
  { name: "Reviews", path: "/review" },
];

const FALLBACK_SERVICES: NavLinkItem[] = [
  {
    name: "Assignment Writing Help UK",
    path: "/assignment-writing-uk",
    children: [
      ...ASSIGNMENT_SERVICE_SUBJECTS,
    ],
  },
  {
    name: "Dissertation Writing Services UK",
    path: "/dissertation-writing-help-services",
    children: [
      { name: "Dissertation Help", path: "/dissertation-writing-help-services" },
      { name: "Proofreading", path: "/proofreading-and-editing-writing-help" },
      { name: "Editing & Formatting", path: "/dissertation-editing-and-proofreading-help-uk" },
    ],
  },
  {
    name: "Pay Someone To Do My Assignment",
    path: "/assignment-writing-uk",
  },
];

const CITIES: NavLinkItem[] = [];


const DesktopDropdown = ({
  label,
  items,
  scrollable = false,
}: {
  label: string;
  items: NavLinkItem[];
  scrollable?: boolean;
}) => {
  if (!items || items.length === 0) {
    return (
      <li className="znh-nav-item">
        <Link href="/cities" className="znh-nav-link">
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li className="znh-nav-item">
      <button type="button" className="znh-nav-link">
        {label}
        <ChevronDown className="znh-down-icon" />
      </button>
      <ul
        className={cn(
          "znh-dropdown-menu",
          scrollable && "znh-dropdown-scrollable",
        )}
      >
      {items.map((item, idx) => (
        <li key={`${item.path}-${item.name}-${idx}`} className="znh-dropdown-item">
          {item.disabled ? (
            <span className="znh-dropdown-link znh-dropdown-link-disabled">
              {item.name}
            </span>
          ) : (
            <Link href={ensureRelativePath(item.path)} className="znh-dropdown-link">
              <span>{item.name}</span>
              {item.children && item.children.length > 0 && (
                <ChevronRight className="znh-right-icon" />
              )}
            </Link>
          )}
          {item.children && item.children.length > 0 && (
            <ul className="znh-submenu">
              {item.children.map((child, childIdx) => (
                <li key={`${child.path}-${child.name}-${childIdx}`}>
                  {child.disabled ? (
                    <span className="znh-dropdown-link znh-dropdown-link-disabled">
                      {child.name}
                    </span>
                  ) : (
                    <Link href={ensureRelativePath(child.path)} className="znh-dropdown-link">
                      {child.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </li>
  );
};

const MobileDropdown = ({
  label,
  items,
  id,
  openGroups,
  nestedGroups,
  onToggle,
  onNestedToggle,
  onNavigate,
}: {
  label: string;
  items: NavLinkItem[];
  id: string;
  openGroups: Record<string, boolean>;
  nestedGroups: Record<string, boolean>;
  onToggle: (key: string) => void;
  onNestedToggle: (key: string) => void;
  onNavigate: () => void;
}) => (
  <li className="znh-nav-item">
    <button type="button" className="znh-nav-link" onClick={() => onToggle(id)}>
      {label}
      <ChevronDown
        className={cn("znh-down-icon", openGroups[id] && "rotate-180")}
      />
    </button>
    <ul className={cn("znh-dropdown-menu", openGroups[id] && "active")}>
      {items.map((item, idx) => {
        const nestedKey = `${id}-${item.name}-${idx}`;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={`${item.path}-${item.name}-${idx}`} className="znh-dropdown-item">
            {hasChildren ? (
              <button
                type="button"
                className="znh-dropdown-link"
                onClick={() => onNestedToggle(nestedKey)}
              >
                <span>{item.name}</span>
                <ChevronRight
                  className={cn(
                    "znh-right-icon",
                    nestedGroups[nestedKey] && "rotate-90",
                  )}
                />
              </button>
            ) : (
              <>
                {item.disabled ? (
                  <span className="znh-dropdown-link znh-dropdown-link-disabled">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={ensureRelativePath(item.path)}
                    className="znh-dropdown-link"
                    onClick={onNavigate}
                  >
                    {item.name}
                  </Link>
                )}
              </>
            )}

            {hasChildren && (
              <ul
                className={cn(
                  "znh-submenu",
                  nestedGroups[nestedKey] && "active",
                )}
              >
                {item.children!.map((child, childIdx) => (
                  <li key={`${child.path}-${child.name}-${childIdx}`}>
                    {child.disabled ? (
                      <span className="znh-dropdown-link znh-dropdown-link-disabled">
                        {child.name}
                      </span>
                    ) : (
                      <Link
                        href={ensureRelativePath(child.path)}
                        className="znh-dropdown-link"
                        onClick={onNavigate}
                      >
                        {child.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  </li>
);

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [nestedGroups, setNestedGroups] = useState<Record<string, boolean>>({});
  const [serviceMenu, setServiceMenu] = useState<NavLinkItem[]>([]);
  const [subjects, setSubjects] = useState<NavLinkItem[]>([]);
  const [citiesMenu, setCitiesMenu] = useState<NavLinkItem[]>([]);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchServiceMenu = async () => {
      try {
        const response = await fetch(SERVICE_PAGES_API_URL, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const payload = await response.json();
        if (!response.ok || payload?.success === false) {
          setServiceMenu([]);
          return;
        }

        const services = Array.isArray(payload?.data) ? payload.data : [];
        setServiceMenu(mapServicePagesToMenu(services));
      } catch {
        setServiceMenu([]);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subject-pages", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const payload = await response.json();
        if (
          response.ok &&
          (payload?.success || payload?.status === "success") &&
          Array.isArray(payload?.data)
        ) {
          const mapped = payload.data.map((item: any) => {
            const cleanSlug = (item.slug || "").replace(/^\/+/, "");
            const humanized = cleanSlug
              .replace(/^subject\//, "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase());
            const rawName = item.title?.trim() || humanized;
            const name = /\bassignment help\b/i.test(rawName)
              ? rawName
              : `${rawName} Assignment Help`;
            return {
              name,
              path: canonicalSubjectPath(cleanSlug),
            };
          });

          const hasEconomics = mapped.some((s: any) =>
            s.path.toLowerCase().includes("economics")
          );
          if (!hasEconomics) {
            mapped.push({
              name: "Economics Assignment Help",
              path: canonicalSubjectPath("economics"),
            });
          }

          setSubjects(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic subjects list:", err);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await fetch("/api/city-pages", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = await response.json();
        const dynamicBackendCities =
          Array.isArray(payload?.data) && payload.data.length > 0
            ? payload.data
            : Array.isArray(payload?.data?.pages) && payload.data.pages.length > 0
            ? payload.data.pages
            : Array.isArray(payload?.pages) && payload.pages.length > 0
            ? payload.pages
            : Array.isArray(payload?.cities) && payload.cities.length > 0
            ? payload.cities
            : Array.isArray(payload?.static_cities)
            ? payload.static_cities
            : [];

        const seenPaths = new Set<string>();
        const completeCities: NavLinkItem[] = [];

        if (dynamicBackendCities.length > 0) {
          for (const c of dynamicBackendCities) {
            const rawTitle = c.title || c.city || c.hero_heading || c.meta_title || c.name || c.id || "";
            let rawSlug = (c.slug || c.url || c.id || rawTitle).toString().trim().replace(/^\/+/, "").replace(/^cities\//, "").replace(/^uk\//, "");

            let cSlug = rawSlug.toLowerCase();
            if (cSlug && !cSlug.startsWith("assignment-help-")) {
              cSlug = `assignment-help-${cSlug.replace(/-assignment-help$/, "")}`;
            }

            let cleanedName = rawTitle.replace(/^Assignment Help\s+/i, "").replace(/-/g, " ").trim();
            if (!cleanedName || cleanedName === rawSlug) {
              cleanedName = cSlug.replace(/^assignment-help-/, "").replace(/-/g, " ");
            }
            const formattedName = `Assignment Help ${cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1)}`;
            const finalPath = `/cities/${cSlug}`;

            if (!seenPaths.has(finalPath)) {
              seenPaths.add(finalPath);
              completeCities.push({
                name: formattedName,
                path: finalPath,
              });
            }
          }
        }

        if (completeCities.length > 0) {
          setCitiesMenu(completeCities);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic cities list:", err);
      }
    };

    fetchServiceMenu();
    fetchSubjects();
    fetchCities();
  }, []);

  useEffect(() => {
    const loadAuthState = () => {
      const token = window.localStorage.getItem("ain_auth_token");
      const storedEmail = window.localStorage.getItem("ain_user_email");
      const storedName = window.localStorage.getItem("ain_user_name");
      const storedUserData = window.localStorage.getItem("ain_user_data");

      let parsedUserData: { name?: string; email?: string } | null = null;
      if (storedUserData) {
        try {
          parsedUserData = JSON.parse(storedUserData);
        } catch (error) {
          console.warn("Failed to parse stored user data:", error);
        }
      }

      const loggedIn = Boolean(token);
      setIsLoggedIn(loggedIn);
      setUserProfile(
        loggedIn
          ? {
            name: parsedUserData?.name || storedName || "Student",
            email: parsedUserData?.email || storedEmail || "",
          }
          : null,
      );
    };

    loadAuthState();
    window.addEventListener("storage", loadAuthState);
    window.addEventListener("ain-auth-change", loadAuthState);
    return () => {
      window.removeEventListener("storage", loadAuthState);
      window.removeEventListener("ain-auth-change", loadAuthState);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountDropdownRef.current) return;
      if (!accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    if (isAccountOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isAccountOpen]);

  const closeMobileMenu = () => setIsOpen(false);

  const handleLogout = () => {
    window.localStorage.removeItem("ain_auth_token");
    window.localStorage.removeItem("ain_user_email");
    window.localStorage.removeItem("ain_user_name");
    window.localStorage.removeItem("ain_user_data");
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsAccountOpen(false);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const toggleMobileGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNestedGroup = (key: string) => {
    setNestedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const serviceDropdownItems =
    serviceMenu.length > 0 ? serviceMenu : FALLBACK_SERVICES;

  const subjectsDropdownItems = subjects.length > 0 ? subjects : SUBJECTS;
  const citiesDropdownItems = citiesMenu;

  return (
    <>
      {/* Top Promotional Stripe */}

      {/* Top Promotional Stripe */}
      <div
        className="znh-top-stripe-wrapper"
        style={{
          width: "100%",
          position: "relative",
          zIndex: 10000,
          color: "#ffffff",
          background:
            "linear-gradient(90deg, #1e3a5f 0%, #0f2a4a 50%, #1e3a5f 100%)",
        }}
      >
        <div
          className="znh-top-stripe-container"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "28px",
            overflow: "hidden",
            fontSize: "13px",
            padding: "7px 20px",
          }}
        >
          {/* Contact — fixed left */}
          <div
            className="znh-top-contact"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              flexShrink: 0,
            }}
          >
            <a
              href="tel:+44 7826233106"
              className="flex items-center gap-[5px] font-semibold text-[12.5px] max-md:text-[11px] whitespace-nowrap [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:shrink-0"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +44 7826233106
            </a>
            {/* <a
              href="mailto:order@assignmentinneed.co.uk"
              className="flex items-center gap-[5px] font-semibold text-[12.5px] max-md:text-[11px] whitespace-nowrap [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:shrink-0"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
              order@assignmentinneed.co.uk
            </a> */}
          </div>

          {/* Middle — marquee offers */}
          <div
            className="znh-top-marquee-box"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              overflow: "hidden",
              position: "relative",
              minWidth: 0,
              flex: 1,
            }}
          >
            <div className="inline-flex items-center gap-[5px] bg-[#e85d04] text-white font-bold text-[11px] max-md:text-[10px] py-[3px] px-[10px] max-md:py-[2px] max-md:px-[8px] rounded-full uppercase tracking-[0.5px] whitespace-nowrap shrink-0">
              OFFER
            </div>
            <div
              className="flex-1 flex items-center justify-center overflow-hidden relative min-w-0"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flex: 1,
                minWidth: 0,
                maskImage:
                  "linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%)",
              }}
            >
              <div
                className="flex items-center gap-0 w-max hover:[animation-play-state:paused]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "max-content",
                  animation: "stripeMarquee 14s linear infinite",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 pr-10"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      paddingRight: "40px",
                    }}
                  >
                    <span className="inline-flex items-center gap-[5px] bg-white/[0.12] border border-white/20 text-[#fbbf24] font-bold text-[11px] max-md:text-[10px] py-[3px] px-[10px] max-md:py-[2px] max-md:px-[8px] rounded-full whitespace-nowrap">
                      🎁 Special Offer
                    </span>
                    <span className="font-bold text-[12.5px] max-md:text-[11px] whitespace-nowrap text-white">
                      🎉{" "}
                      <span className="text-[#fbbf24] font-extrabold">
                        Discounts – Up to 40% OFF!
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Fixed CTA */}
            <div className="shrink-0 pl-2 md:pl-3">
              <a
                href="https://wa.me/447826233106"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white font-extrabold text-[11px] max-md:text-[10px] py-1 px-3 max-md:py-[2px] max-md:px-2 rounded-full whitespace-nowrap cursor-pointer transition-all duration-200 no-underline hover:bg-green-300 hover:shadow-[0_2px_8px_rgba(34,197,94,0.4)]"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  className="w-3.5 h-3.5 max-md:w-3 max-md:h-3 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a3.8 3.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>{" "}
                Extra 10% OFF
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="znh-header-wrapper">
        <div className="znh-header-container">
          <Link
            href="/"
            className="znh-logo"
            aria-label="Assignment In Need home"
          >
            <Image
              src="/assets/media/layout/ain-logo.webp"
              alt="Assignment In Need Logo"
              width={160}
              height={55}
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <div
            className={cn("znh-mobile-overlay", isOpen && "active")}
            onClick={closeMobileMenu}
          />

          <nav className={cn("znh-nav-drawer", isOpen && "active")}>
            <button
              type="button"
              className="znh-mobile-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="znh-desktop-menu-container">
              <ul className="znh-nav-list">
                <DesktopDropdown label="Services" items={serviceDropdownItems} />
                <DesktopDropdown
                  label="Subjects"
                  items={subjectsDropdownItems}
                  scrollable
                />

                <li className="znh-nav-item">
                  <Link href="/writers" className="znh-nav-link">
                    Experts
                  </Link>
                </li>
                <li className="znh-nav-item">
                  <Link href="/samples" className="znh-nav-link">
                    Samples
                  </Link>
                </li>

                <DesktopDropdown label="Resources" items={RESOURCES} />

                <DesktopDropdown
                  label="Cities"
                  items={citiesDropdownItems}
                  scrollable
                />
              </ul>
            </div>

            <div className="znh-mobile-menu-container">
              <ul className="znh-nav-list w-full">
                <MobileDropdown
                  label="Services"
                  id="services"
                  items={serviceDropdownItems}
                  openGroups={openGroups}
                  nestedGroups={nestedGroups}
                  onToggle={toggleMobileGroup}
                  onNestedToggle={toggleNestedGroup}
                  onNavigate={closeMobileMenu}
                />
                <MobileDropdown
                  label="Subjects"
                  id="subjects"
                  items={subjectsDropdownItems}
                  openGroups={openGroups}
                  nestedGroups={nestedGroups}
                  onToggle={toggleMobileGroup}
                  onNestedToggle={toggleNestedGroup}
                  onNavigate={closeMobileMenu}
                />

                <li className="znh-nav-item">
                  <Link
                    href="/writers"
                    className="znh-nav-link"
                    onClick={closeMobileMenu}
                  >
                    Experts
                  </Link>
                </li>
                <li className="znh-nav-item">
                  <Link
                    href="/samples"
                    className="znh-nav-link"
                    onClick={closeMobileMenu}
                  >
                    Samples
                  </Link>
                </li>

                <MobileDropdown
                  label="Resources"
                  id="resources"
                  items={RESOURCES}
                  openGroups={openGroups}
                  nestedGroups={nestedGroups}
                  onToggle={toggleMobileGroup}
                  onNestedToggle={toggleNestedGroup}
                  onNavigate={closeMobileMenu}
                />

                <MobileDropdown
                  label="Cities"
                  id="cities"
                  items={citiesDropdownItems}
                  openGroups={openGroups}
                  nestedGroups={nestedGroups}
                  onToggle={toggleMobileGroup}
                  onNestedToggle={toggleNestedGroup}
                  onNavigate={closeMobileMenu}
                />

                {/* <li className="znh-nav-item">
                <Link
                  href="/about"
                  className="znh-nav-link"
                  onClick={closeMobileMenu}
                >
                  About Us
                </Link>
              </li>
              <li className="znh-nav-item">
                <Link
                  href="/contact"
                  className="znh-nav-link"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li> */}

                <li className="znh-mobile-only mt-4">
                  <Link
                    href="/order"
                    className="btn-shutter-orange-open text-white lg:py-3! py-2! lg:px-6! px-2! rounded-lg font-semibold inline-flex items-center justify-center w-56px! lg:w-full!"
                    onClick={closeMobileMenu}
                  >
                    Get Free Quote
                  </Link>
                </li>

                <li className="znh-mobile-account">
                  {isLoggedIn ? (
                    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white font-bold text-sm">
                          {isLoggedIn && userProfile?.name ? (
                            userProfile.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">
                            {userProfile?.name || "Student"}
                          </div>
                          <div className="truncate text-xs text-white/65">
                            {userProfile?.email || "No email available"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <Link
                          href="/profile"
                          onClick={closeMobileMenu}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f159a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-900"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="btn-shutter-blue-open text-white py-3 px-6 rounded-lg font-semibold inline-flex items-center justify-center w-full"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </nav>

          <div className="znh-right-actions">
            <a
              href="tel:+447826233106"
              className="znh-contact-widget"
              aria-label="Call +44 78262 33106 for 24/7 Support"
            >
              <div className="znh-contact-icon">
                <Phone className="h-[18px] w-[18px]" />
              </div>
              <div className="znh-contact-text">
                <span className="znh-contact-number">+44 78262 33106</span>
                <span className="znh-contact-label">24/7 Support</span>
              </div>
            </a>

            <Link
              href="/order"
              className="btn-shutter-orange-open text-white py-2 px-3 md:py-3 md:px-6 rounded-lg font-semibold text-[11px] md:text-base inline-flex items-center justify-center whitespace-nowrap"
            >
              Get Free Quote
            </Link>

            <div ref={accountDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((prev) => !prev)}
                className="znh-account-button desktop-account font-bold text-base"
                aria-label="Account"
              >
                {isLoggedIn && userProfile?.name ? (
                  userProfile.name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-5 w-5" />
                )}
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-3 min-w-[20rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <div className="bg-[#f8f4ff] px-4 py-4">
                    {isLoggedIn ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ede9fe] text-[#4a17a3] font-bold text-lg">
                          {isLoggedIn && userProfile?.name ? (
                            userProfile.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-gray-900">
                            {userProfile?.name || "Student"}
                          </div>
                          <div className="truncate text-xs text-gray-500">
                            {userProfile?.email || "No email available"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-gray-900">
                          Welcome back
                        </div>
                        <p className="text-sm text-gray-500">
                          Login to access your orders, profile, and faster
                          checkout.
                        </p>
                        <Link
                          href="/login"
                          className="btn-shutter-blue-open inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Login
                        </Link>
                      </div>
                    )}
                  </div>

                  {isLoggedIn && (
                    <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsAccountOpen(false)}
                        className="btn-shutter-blue-close flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-center"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="btn-shutter-orange-close flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="znh-mobile-toggle"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
