"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, LogOut, Menu, Phone, User, X } from "lucide-react";
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
  meta_title?: string | null;
  hero_heading?: string | null;
};

const serviceHref = (slug: string) => `/${slug}`;

const SERVICE_PAGES_API_URL = "/api/admin/service-pages";

const humanizeSlug = (slug: string) =>
  slug
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getServiceLabel = (service: ServicePageApiItem) => {
  const title = service.hero_heading || service.meta_title || service.slug || "Service";
  return title.split("|")[0].trim() || humanizeSlug(service.slug || "service");
};

const mapServicePagesToMenu = (services: ServicePageApiItem[]): NavLinkItem[] => {
  const grouped = new Map<string, NavLinkItem>();
  const standalone: NavLinkItem[] = [];

  services.forEach((service) => {
    const slug = service.slug?.trim();
    if (!slug) return;

    const path = serviceHref(slug);
    const label = getServiceLabel(service);

    if (!slug.includes("/")) {
      if (grouped.has(slug)) {
        const existing = grouped.get(slug)!;
        existing.name = label;
        existing.path = path;
      } else {
        standalone.push({ name: label, path });
      }
      return;
    }

    const [parentSlug] = slug.split("/");
    if (!grouped.has(parentSlug)) {
      grouped.set(parentSlug, {
        name: humanizeSlug(parentSlug),
        path: serviceHref(parentSlug),
        children: [],
      });
    }

    grouped.get(parentSlug)!.children!.push({ name: label, path });
  });

  const groupedItems = Array.from(grouped.values()).map((item) => ({
    ...item,
    children: item.children?.sort((first, second) => first.name.localeCompare(second.name)),
  }));

  const groupedSlugs = new Set(groupedItems.map((item) => item.path.replace(/^\//, "")));
  const filteredStandalone = standalone.filter((item) => !groupedSlugs.has(item.path.replace(/^\//, "")));

  return [...groupedItems, ...filteredStandalone].sort((first, second) => first.name.localeCompare(second.name));
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
].map(([name, slug]) => ({ name, path: `/subjects/${slug}` }));

const RESOURCES: NavLinkItem[] = [
  { name: "Blog", path: "/blog" },
  { name: "Pricing", path: "/pricing" },
  { name: "Reviews", path: "/review" },
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
    <ul className={cn("znh-dropdown-menu", scrollable && "znh-dropdown-scrollable")}>
      {items.map((item) => (
        <li key={item.path} className="znh-dropdown-item">
          {item.disabled ? (
            <span className="znh-dropdown-link znh-dropdown-link-disabled">{item.name}</span>
          ) : (
            <Link href={item.path} className="znh-dropdown-link">
              <span>{item.name}</span>
              {item.children && item.children.length > 0 && <ChevronRight className="znh-right-icon" />}
            </Link>
          )}
          {item.children && item.children.length > 0 && (
            <ul className="znh-submenu">
              {item.children.map((child) => (
                <li key={child.path}>
                  {child.disabled ? (
                    <span className="znh-dropdown-link znh-dropdown-link-disabled">{child.name}</span>
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
      <ChevronDown className={cn("znh-down-icon", openGroups[id] && "rotate-180")} />
    </button>
    <ul className={cn("znh-dropdown-menu", openGroups[id] && "active")}>
      {items.map((item) => {
        const nestedKey = `${id}-${item.name}`;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item.path} className="znh-dropdown-item">
            {hasChildren ? (
              <button type="button" className="znh-dropdown-link" onClick={() => onNestedToggle(nestedKey)}>
                <span>{item.name}</span>
                <ChevronRight className={cn("znh-right-icon", nestedGroups[nestedKey] && "rotate-90")} />
              </button>
            ) : (
              <>
                {item.disabled ? (
                  <span className="znh-dropdown-link znh-dropdown-link-disabled">{item.name}</span>
                ) : (
                  <Link href={item.path} className="znh-dropdown-link" onClick={onNavigate}>
                    {item.name}
                  </Link>
                )}
              </>
            )}

            {hasChildren && (
              <ul className={cn("znh-submenu", nestedGroups[nestedKey] && "active")}>
                {item.children!.map((child) => (
                  <li key={child.path}>
                    {child.disabled ? (
                      <span className="znh-dropdown-link znh-dropdown-link-disabled">{child.name}</span>
                    ) : (
                      <Link href={child.path} className="znh-dropdown-link" onClick={onNavigate}>
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
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [nestedGroups, setNestedGroups] = useState<Record<string, boolean>>({});
  const [serviceMenu, setServiceMenu] = useState<NavLinkItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
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

    fetchServiceMenu();
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
    return () => window.removeEventListener("storage", loadAuthState);
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
              z-index: 9999;
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
              height: 50px;
              width: auto;
              transition: transform 0.3s ease;
            }
            .znh-logo img:hover {
              transform: scale(1.05);
            }
            .znh-nav {
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
              .znh-nav {
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
              .znh-nav.active {
                right: 0;
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
                height: 44px;
              }
              .znh-contact-icon,
              .znh-account-button,
              .znh-mobile-toggle {
                width: 38px;
                height: 38px;
              }
              .znh-nav {
                width: 300px;
              }
            }
          `,
        }}
      />

      <header className="znh-header-wrapper">
        <div className="znh-header-container">
          <Link href="/" className="znh-logo" aria-label="Assignment In Need home">
            <img src="/assets/media/layout/assignment_logo.webp" alt="Assignment In Need Logo" />
          </Link>

          <div className={cn("znh-mobile-overlay", isOpen && "active")} onClick={closeMobileMenu} />

          <ul className={cn("znh-nav", isOpen && "active")}>
            <button type="button" className="znh-mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
              <X className="h-7 w-7" />
            </button>

            <div className="hidden min-[1025px]:contents">
              <DesktopDropdown label="Services" items={serviceDropdownItems} />
              <DesktopDropdown label="Subjects" items={SUBJECTS} scrollable />

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

              <li className="znh-nav-item">
                <Link href="/about" className="znh-nav-link">
                  About Us
                </Link>
              </li>
              <li className="znh-nav-item">
                <Link href="/contact" className="znh-nav-link">
                  Contact
                </Link>
              </li>
            </div>

            <div className="contents min-[1025px]:hidden">
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
                items={SUBJECTS}
                openGroups={openGroups}
                nestedGroups={nestedGroups}
                onToggle={toggleMobileGroup}
                onNestedToggle={toggleNestedGroup}
                onNavigate={closeMobileMenu}
              />

              <li className="znh-nav-item">
                <Link href="/writers" className="znh-nav-link" onClick={closeMobileMenu}>
                  Experts
                </Link>
              </li>
              <li className="znh-nav-item">
                <Link href="/samples" className="znh-nav-link" onClick={closeMobileMenu}>
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

              <li className="znh-nav-item">
                <Link href="/about" className="znh-nav-link" onClick={closeMobileMenu}>
                  About Us
                </Link>
              </li>
              <li className="znh-nav-item">
                <Link href="/contact" className="znh-nav-link" onClick={closeMobileMenu}>
                  Contact
                </Link>
              </li>

              <li className="znh-mobile-only mt-4">
                <Link href="/order" className="btn-shutter-orange-open text-white py-3 px-6 rounded-lg font-semibold inline-flex items-center justify-center w-full" onClick={closeMobileMenu}>
                  Get Free Quote
                </Link>
              </li>

              <li className="znh-mobile-account">
                {isLoggedIn ? (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{userProfile?.name || "Student"}</div>
                        <div className="truncate text-xs text-white/65">{userProfile?.email || "No email available"}</div>
                      </div>
                    </div>
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
                ) : (
                  <Link href="/login" className="btn-shutter-blue-open text-white py-3 px-6 rounded-lg font-semibold inline-flex items-center justify-center w-full" onClick={closeMobileMenu}>
                    Login
                  </Link>
                )}
              </li>
            </div>
          </ul>

          <div className="znh-right-actions">
            <a href="tel:+447300640066" className="znh-contact-widget">
              <div className="znh-contact-icon">
                <Phone className="h-[18px] w-[18px]" />
              </div>
              <div className="znh-contact-text">
                <span className="znh-contact-number">+44 7300 640066</span>
                <span className="znh-contact-label">24/7 Support</span>
              </div>
            </a>

            <Link href="/order" className="btn-shutter-orange-open text-white py-3 px-6 rounded-lg font-semibold inline-flex items-center justify-center desktop-only">
              Get Free Quote
            </Link>

            <div ref={accountDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen((prev) => !prev)}
                className="znh-account-button desktop-account"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-3 min-w-[20rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <div className="bg-[#f8f4ff] px-4 py-4">
                    {isLoggedIn ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ede9fe] text-[#4a17a3]">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-gray-900">{userProfile?.name || "Student"}</div>
                          <div className="truncate text-xs text-gray-500">{userProfile?.email || "No email available"}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-gray-900">Welcome back</div>
                        <p className="text-sm text-gray-500">Login to access your orders, profile, and faster checkout.</p>
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
                    <div className="border-t border-gray-100 px-4 py-3">
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

            <button type="button" className="znh-mobile-toggle" onClick={() => setIsOpen(true)} aria-label="Open menu">
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
