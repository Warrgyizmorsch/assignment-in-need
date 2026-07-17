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
import { cn } from "@/lib/utils";

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

const SERVICE_PAGES_API_URL = "/api/admin/service-pages";

const humanizeSlug = (slug: string) =>
  slug
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const mapServicePagesToMenu = (
  services: ServicePageApiItem[],
): NavLinkItem[] => {
  return services.map((service) => {
    const parentSlug = service.slug?.trim().replace(/^\/+/, "").replace(/^service\//, "") || "";
    const parentPath = `/${parentSlug}`;
    
    const parentName = service.title?.trim() || service.hero_heading?.trim() || service.meta_title?.trim() || humanizeSlug(parentSlug || "service");
    
    const mappedChildren = Array.isArray(service.children)
      ? service.children.map((child) => {
          const childSlug = child.slug?.trim().replace(/^\/+/, "").replace(/^service\/assignment\/|^service\/dissertation\/|^service\//, "") || "";
          const childPath = `/${childSlug}`;
          const childName = child.title?.trim() || child.hero_heading?.trim() || child.meta_title?.trim() || humanizeSlug(childSlug || "service");
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
  ["Maths", "math"],
  ["English", "english"],
  ["Economics", "economics"],
  ["Chemistry", "chemistry"],
  ["History", "history"],
  ["Law", "law"],
  ["Linguistic", "linguistic"],
  ["Nursing", "nursing"],
  ["Physics", "physics"],
  ["Sociology", "sociology"],
  ["Philosophy", "philosophy"],
  ["Statistics", "statistics"],
  ["Accounting", "accounting"],
  ["Programming", "programming"],
  ["Marketing", "marketing"],
  ["Computer Science", "computer-science"],
  ["Engineering", "engineering"],
  ["Finance", "finance"],
  ["Management", "management"],
  ["Business", "business"],
  ["Geography", "geography"],
  ["Psychology", "psychology"],
  ["Biology", "biology"],
  ["Entrepreneurship", "entrepreneurship"],
  ["Artificial Intelligence", "artificial-intelligence"],
  ["Machine Learning", "machine-learning"],
  ["Cybersecurity", "cybersecurity"],
  ["Humanities", "humanities"],
].map(([name, slug]) => {
  const mappedSlug = slug === "maths" || slug === "math" ? "math" : slug;
  return { name, path: `/${mappedSlug}-assignment-help` };
});

const RESOURCES: NavLinkItem[] = [
  { name: "Blog", path: "/blog" },
  { name: "Pricing", path: "/pricing" },
  { name: "Reviews", path: "/review" },
];

const CITIES: NavLinkItem[] = [
  { name: "London", path: "/london" },
  { name: "Birmingham", path: "/birmingham" },
  { name: "Manchester", path: "/manchester" },
  { name: "View All Cities", path: "/cities" },
];

const DesktopDropdown = ({
  label,
  items,
  scrollable = false,
}: {
  label: string;
  items: NavLinkItem[];
  scrollable?: boolean;
}) => (
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
      {items.map((item) => (
        <li key={item.path} className="znh-dropdown-item">
          {item.disabled ? (
            <span className="znh-dropdown-link znh-dropdown-link-disabled">
              {item.name}
            </span>
          ) : (
            <Link href={item.path} className="znh-dropdown-link">
              <span>{item.name}</span>
              {item.children && item.children.length > 0 && (
                <ChevronRight className="znh-right-icon" />
              )}
            </Link>
          )}
          {item.children && item.children.length > 0 && (
            <ul className="znh-submenu">
              {item.children.map((child) => (
                <li key={child.path}>
                  {child.disabled ? (
                    <span className="znh-dropdown-link znh-dropdown-link-disabled">
                      {child.name}
                    </span>
                  ) : (
                    <Link href={child.path} className="znh-dropdown-link">
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
      {items.map((item) => {
        const nestedKey = `${id}-${item.name}`;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item.path} className="znh-dropdown-item">
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
                    href={item.path}
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
                {item.children!.map((child) => (
                  <li key={child.path}>
                    {child.disabled ? (
                      <span className="znh-dropdown-link znh-dropdown-link-disabled">
                        {child.name}
                      </span>
                    ) : (
                      <Link
                        href={child.path}
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
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [subjects, setSubjects] = useState<NavLinkItem[]>([]);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchServiceMenu = async () => {
      try {
        setServicesLoading(true);
        setServicesError(false);

        const response = await fetch(SERVICE_PAGES_API_URL, {
          headers: { Accept: "application/json" },
        });

        const payload = await response.json();
        if (!response.ok || payload?.success === false) {
          setServiceMenu([]);
          setServicesError(true);
          return;
        }

        const services = Array.isArray(payload?.data) ? payload.data : [];
        setServiceMenu(mapServicePagesToMenu(services));
      } catch {
        setServiceMenu([]);
        setServicesError(true);
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/admin/subjects", {
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();
        if (
          response.ok &&
          (payload?.success || payload?.status === "success") &&
          Array.isArray(payload?.data)
        ) {
          const mapped = payload.data.map((item: any) => {
            const cleanSlug = (item.slug || "").replace(/^\/+/, "");
            const finalSlug = cleanSlug.startsWith("subject/")
              ? cleanSlug.replace("subject/", "")
              : cleanSlug;
            const humanized = finalSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase());
            const name = item.title?.trim() || humanized;
            const mappedSlug = finalSlug === "maths" || finalSlug === "math" ? "math" : finalSlug;
            return {
              name,
              path: `/${mappedSlug}-assignment-help`,
            };
          });
          setSubjects(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic subjects list:", err);
      }
    };

    fetchServiceMenu();
    fetchSubjects();
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

  const serviceDropdownItems = servicesLoading
    ? [{ name: "Loading services...", path: "#", disabled: true }]
    : servicesError
      ? [{ name: "Unable to load services", path: "#", disabled: true }]
      : serviceMenu.length > 0
        ? serviceMenu
        : [{ name: "No services found", path: "#", disabled: true }];

  const subjectsDropdownItems = subjects.length > 0 ? subjects : SUBJECTS;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .znh-header-wrapper {
              font-family: var(--font-nunito), sans-serif;
              background-color: #ffffff;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
              position: sticky;
              top: 0;
              z-index: 100;
              width: 100%;
            }
            .znh-header-container {
              max-width: 1400px;
              margin: 0 auto;
              padding: 10px 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 24px;
            }
            .znh-logo img {
              height: 55px;
              width: auto;
              transition: transform 0.3s ease;
            }
            .znh-logo img:hover {
              transform: scale(1.05);
            }
            .znh-nav-drawer {
              display: flex;
              align-items: center;
            }
            .znh-nav-list {
              display: flex;
              align-items: center;
              gap: 25px;
              margin: 0;
              padding: 0;
              list-style: none;
            }
            .znh-nav-item {
              position: relative;
            }
            .znh-nav-link {
              appearance: none;
              background: transparent;
              border: 0;
              text-decoration: none;
              color: #2d2d2d;
              font-weight: 600;
              font-size: 15px;
              display: flex;
              align-items: center;
              gap: 5px;
              padding: 10px 0;
              transition: color 0.3s ease;
              cursor: pointer;
              white-space: nowrap;
            }
            .znh-down-icon {
              width: 13px;
              height: 13px;
              transition: transform 0.3s ease;
            }
            .znh-right-icon {
              width: 14px;
              height: 14px;
              transition: transform 0.3s ease;
            }
            .znh-nav-link:hover,
            .znh-nav-item:hover > .znh-nav-link {
              color: #f06a33;
            }
            .znh-nav-item:hover > .znh-nav-link .znh-down-icon {
              transform: rotate(180deg);
            }
            .znh-dropdown-menu {
              position: absolute;
              top: 100%;
              left: 0;
              background: #ffffff;
              min-width: 240px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              padding: 10px 0;
              opacity: 0;
              visibility: hidden;
              transform: translateY(10px);
              transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              z-index: 100;
              list-style: none;
              margin: 0;
            }
            .znh-dropdown-scrollable {
              max-height: 70vh;
              overflow-y: auto;
              overflow-x: hidden;
            }
            .znh-dropdown-scrollable::-webkit-scrollbar,
            .znh-submenu::-webkit-scrollbar {
              width: 6px;
            }
            .znh-dropdown-scrollable::-webkit-scrollbar-track,
            .znh-submenu::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .znh-dropdown-scrollable::-webkit-scrollbar-thumb,
            .znh-submenu::-webkit-scrollbar-thumb {
              background: #cccccc;
              border-radius: 4px;
            }
            .znh-dropdown-scrollable::-webkit-scrollbar-thumb:hover,
            .znh-submenu::-webkit-scrollbar-thumb:hover {
              background: #f06a33;
            }
            .znh-nav-item:hover > .znh-dropdown-menu {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
            .znh-dropdown-item {
              position: relative;
            }
            .znh-dropdown-link {
              appearance: none;
              border: 0;
              background: transparent;
              text-decoration: none;
              color: #4a4a4a;
              font-size: 14px;
              font-weight: 500;
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;
              width: 100%;
              padding: 10px 20px;
              transition: all 0.2s ease;
              text-align: left;
              cursor: pointer;
            }
            .znh-dropdown-link:hover {
              background-color: #fdf3f0;
              color: #f06a33;
              padding-left: 25px;
            }
            .znh-dropdown-link-disabled,
            .znh-dropdown-link-disabled:hover {
              color: #8a8a8a;
              cursor: default;
              background: transparent;
              padding-left: 20px;
            }
            .znh-submenu {
              position: absolute;
              top: 0;
              left: 100%;
              background: #ffffff;
              min-width: 260px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              padding: 10px 0;
              opacity: 0;
              visibility: hidden;
              transform: translateX(10px);
              transition: all 0.3s ease;
              list-style: none;
              margin: 0;
              max-height: 60vh;
              overflow-y: auto;
              overflow-x: hidden;
            }
            .znh-dropdown-item:hover > .znh-submenu {
              opacity: 1;
              visibility: visible;
              transform: translateX(0);
            }
            .znh-right-actions {
              display: flex;
              align-items: center;
              gap: 20px;
              flex-shrink: 0;
            }
            .znh-contact-widget {
              display: flex;
              align-items: center;
              gap: 12px;
              text-decoration: none;
            }
            .znh-contact-icon {
              background-color: #f4eeff;
              color: #4a17a3;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            }
            .znh-contact-widget:hover .znh-contact-icon {
              background-color: #4a17a3;
              color: #ffffff;
              transform: rotate(15deg) scale(1.1);
            }
            .znh-contact-text {
              display: flex;
              flex-direction: column;
            }
            .znh-contact-number {
              color: #2d2d2d;
              font-weight: 700;
              font-size: 16px;
              line-height: 1.2;
            }
            .znh-contact-label {
              color: #777777;
              font-size: 12px;
              font-weight: 500;
            }
            .znh-btn-quote {
              background: linear-gradient(135deg, #f06a33, #e85a20);
              color: #ffffff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              box-shadow: 0 4px 15px rgba(240, 106, 51, 0.3);
              transition: all 0.3s ease;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
            }
            .znh-btn-quote:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(240, 106, 51, 0.4);
              color: #ffffff;
            }
            .znh-account-button {
              width: 42px;
              height: 42px;
              border-radius: 50%;
              border: 1px solid #ece7f7;
              background: #ffffff;
              color: #4a17a3;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(74, 23, 163, 0.08);
              transition: all 0.3s ease;
            }
            .znh-account-button:hover {
              background: #f4eeff;
              transform: translateY(-1px);
            }
            .znh-mobile-toggle,
            .znh-mobile-close,
            .znh-mobile-only,
            .znh-mobile-overlay {
              display: none;
            }
            @media (max-width: 1180px) {
              .znh-nav {
                gap: 17px;
              }
              .znh-right-actions {
                gap: 14px;
              }
            }
            @media (max-width: 1024px) {
              .znh-contact-text,
              .znh-btn-quote.desktop-only {
                display: none;
              }
              .znh-right-actions {
                gap: 15px;
              }
              .znh-mobile-toggle {
                display: inline-flex;
                width: 42px;
                height: 42px;
                align-items: center;
                justify-content: center;
                color: #2d2d2d;
                border: 0;
                background: transparent;
                cursor: pointer;
              }
              .znh-nav-drawer {
                position: fixed;
                top: 0;
                right: -320px;
                width: 300px;
                height: 100vh;
                background: linear-gradient(145deg, #1a1530 0%, #0f0c1b 100%);
                flex-direction: column;
                align-items: flex-start;
                padding: 80px 20px 20px 20px;
                box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
                transition: right 0.4s cubic-bezier(0.77, 0, 0.175, 1);
                z-index: 10001;
                overflow-y: auto;
                gap: 0;
              }
              .znh-nav-drawer.active {
                right: 0;
              }
              .znh-nav-list {
                flex-direction: column;
                align-items: flex-start;
                gap: 0;
                width: 100%;
              }
              .znh-mobile-overlay.active {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
              }
              .znh-mobile-close {
                display: inline-flex;
                position: absolute;
                top: 20px;
                right: 25px;
                width: 42px;
                height: 42px;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                border: 0;
                background: transparent;
                cursor: pointer;
                transition: transform 0.3s ease, color 0.3s ease;
              }
              .znh-mobile-close:hover {
                transform: rotate(90deg);
                color: #f06a33;
              }
              .znh-mobile-only {
                display: block;
                width: 100%;
              }
              .znh-dropdown-menu,
              .znh-submenu {
                position: static;
                transform: none;
                box-shadow: none;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                padding: 0;
                margin: 0;
                min-width: 100%;
                max-height: 0;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transition: max-height 0.4s ease, opacity 0.4s ease, margin 0.4s ease;
                display: block;
              }
              .znh-submenu {
                padding-left: 15px;
                background: transparent;
              }
              .znh-dropdown-menu.active,
              .znh-submenu.active {
                max-height: 2000px;
                opacity: 1;
                visibility: visible;
                margin-top: 10px;
                margin-bottom: 10px;
              }
              .znh-nav-item:hover > .znh-dropdown-menu,
              .znh-dropdown-item:hover > .znh-submenu {
                max-height: 0;
                opacity: 0;
                visibility: hidden;
                margin: 0;
              }
              .znh-nav-item:hover > .znh-dropdown-menu.active,
              .znh-dropdown-item:hover > .znh-submenu.active {
                max-height: 2000px;
                opacity: 1;
                visibility: visible;
                margin-top: 10px;
                margin-bottom: 10px;
              }
              .znh-nav-item,
              .znh-dropdown-item {
                width: 100%;
              }
              .znh-nav-link,
              .znh-dropdown-link {
                width: 100%;
                justify-content: space-between;
                padding: 14px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                color: #e2e8f0;
              }
              .znh-dropdown-link {
                padding: 12px 15px;
              }
              .znh-nav-link:hover,
              .znh-dropdown-link:hover,
              .znh-nav-item:hover > .znh-nav-link,
              .znh-dropdown-item:hover > .znh-dropdown-link {
                color: #f06a33;
                background-color: transparent;
                padding-left: 0;
              }
              .znh-dropdown-link:hover {
                padding-left: 15px;
              }
              .znh-mobile-account {
                width: 100%;
                border-top: 1px solid rgba(255, 255, 255, 0.12);
                margin-top: 18px;
                padding-top: 18px;
              }
              .znh-account-button.desktop-account {
                display: none;
              }
            }
            @media (max-width: 640px) {
              .znh-header-container {
                padding: 8px 14px;
                gap: 12px;
              }
              .znh-logo img {
                height: 35px;
                width: auto;
              }
              .znh-contact-icon,
              .znh-account-button,
              .znh-mobile-toggle {
                width: 32px;
                height: 32px;
              }
              .znh-nav {
                width: 300px;
              }

            }

          `,
        }}
      />

      {/* Marquee keyframes — only thing that needs internal CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes stripeMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `,
        }}
      />

      {/* Top Promotional Stripe */}
      <div
        className="w-full relative z-[10000] text-white font-[var(--font-nunito),sans-serif] [&_a]:text-white [&_a]:no-underline [&_a]:transition-opacity [&_a]:duration-200 [&_a:hover]:opacity-85"
        style={{
          background:
            "linear-gradient(90deg, #1e3a5f 0%, #0f2a4a 50%, #1e3a5f 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-[28px] max-md:gap-[8px] overflow-hidden text-[13px] max-md:text-[11px] py-[7px] px-5 max-md:py-1.5 max-md:px-3">
          {/* Contact — fixed left (hidden below 480px) */}
          <div className="flex items-center gap-[18px] max-md:gap-2.5 max-[480px]:hidden shrink-0">
            <a
              href="tel:+44 7826233106"
              className="flex items-center gap-[5px] font-semibold text-[12.5px] max-md:text-[11px] whitespace-nowrap [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:shrink-0"
            >
              <svg
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

          {/* Middle — marquee offers (constrained to max-w-[50%] on tablet/desktop, full width on mobile) */}
          <div className="flex-1 flex items-center gap-0 overflow-hidden relative min-w-0 max-w-[50%] max-[480px]:max-w-full">
            <div className="inline-flex items-center gap-[5px] bg-[#e85d04] text-white font-bold text-[11px] max-md:text-[10px] py-[3px] px-[10px] max-md:py-[2px] max-md:px-[8px] rounded-full uppercase tracking-[0.5px] whitespace-nowrap shrink-0">
              OFFER
            </div>
            <div
              className="flex-1 flex items-center justify-center overflow-hidden relative min-w-0"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0%, #000 3%, #000 97%, transparent 100%)",
              }}
            >
              <div
                className="flex items-center gap-0 w-max hover:[animation-play-state:paused]"
                style={{ animation: "stripeMarquee 14s linear infinite" }}
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 pr-10">
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
              <Link
                href="/order"
                className="inline-flex items-center gap-1 text-white font-extrabold text-[11px] max-md:text-[10px] py-1 px-3 max-md:py-[2px] max-md:px-2 rounded-full whitespace-nowrap cursor-pointer transition-all duration-200 no-underline hover:bg-green-300 hover:shadow-[0_2px_8px_rgba(34,197,94,0.4)]"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                }}
              >
                <svg
                  className="w-3.5 h-3.5 max-md:w-3 max-md:h-3 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a3.8 3.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>{" "}
                Extra 10% OFF
              </Link>
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

            <div className="hidden min-[1025px]:contents">
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

              <DesktopDropdown label="Cities" items={CITIES} />
              {/* <li className="znh-nav-item">
                <Link href="/about" className="znh-nav-link">
                  About Us
                </Link>
              </li>
              <li className="znh-nav-item">
                <Link href="/contact" className="znh-nav-link">
                  Contact
                </Link>
              </li> */}
              </ul>
            </div>

            <div className="contents min-[1025px]:hidden">
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
                items={CITIES}
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
