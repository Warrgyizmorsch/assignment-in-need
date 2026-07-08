"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, User, LogOut, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBaseUrl } from "@/lib/api";



const SUBJECTS = [
  { name: "Accounting", path: "/subjects/accounting" },
  { name: "Business Management", path: "/subjects/business" },
  { name: "Economics", path: "/subjects/economics" },
  { name: "Law", path: "/subjects/law" },
  { name: "Nursing", path: "/subjects/nursing" },
  { name: "Psychology", path: "/subjects/psychology" },
];

const CITIES = [
  { name: "London", path: "/uk/london" },
  { name: "Manchester", path: "/uk/manchester" },
  { name: "Birmingham", path: "/uk/birmingham" },
  { name: "Leeds", path: "/uk/leeds" },
];

const RESOURCES = [
  { name: "Blog", path: "/blog" },
  { name: "Pricing", path: "/pricing" },
  { name: "Reviews", path: "/review" },
];

export const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileSubjectsOpen, setMobileSubjectsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/service-pages`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            setDynamicServices(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching header services list:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const loadAuthState = () => {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("ain_auth_token") : null;
      const storedEmail = typeof window !== "undefined" ? window.localStorage.getItem("ain_user_email") : null;
      const storedName = typeof window !== "undefined" ? window.localStorage.getItem("ain_user_name") : null;
      const storedUserData = typeof window !== "undefined" ? window.localStorage.getItem("ain_user_data") : null;

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
      if (loggedIn) {
        setUserProfile({
          name: parsedUserData?.name || storedName || "Student",
          email: parsedUserData?.email || storedEmail || "",
        });
      } else {
        setUserProfile(null);
      }
    };

    loadAuthState();
    const handleStorage = () => loadAuthState();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("ain_auth_token");
    window.localStorage.removeItem("ain_user_email");
    window.localStorage.removeItem("ain_user_name");
    window.localStorage.removeItem("ain_user_data");
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsAccountOpen(false);
    router.push("/login");
  };

  const menuCategoriesMap = new Map<string, { name: string; path?: string; subItems: { name: string; path: string }[] }>();

  dynamicServices.forEach(ds => {
    const slug = ds.slug || "";
    if (slug.includes("/")) {
      const parts = slug.split("/");
      const parentSlug = parts[0];
      const childName = ds.hero_heading || ds.meta_title || parts[1].replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      const path = `/services/${slug}`;

      if (!menuCategoriesMap.has(parentSlug)) {
        const parentName = parentSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        menuCategoriesMap.set(parentSlug, {
          name: parentName,
          path: path,
          subItems: []
        });
      }
      menuCategoriesMap.get(parentSlug)!.subItems.push({
        name: childName,
        path: path
      });
    } else {
      const path = `/services/${slug}`;
      const name = ds.hero_heading || ds.meta_title || slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      
      if (!menuCategoriesMap.has(slug)) {
        menuCategoriesMap.set(slug, {
          name: name,
          path: path,
          subItems: []
        });
      } else {
        const cat = menuCategoriesMap.get(slug)!;
        cat.name = name;
        cat.path = path;
      }
    }
  });

  const menuItems = Array.from(menuCategoriesMap.values());



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountDropdownRef.current) return;
      const target = event.target as Node;
      if (!accountDropdownRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };

    if (isAccountOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isAccountOpen]);

  return (
    <>
      {/* Top Bar - Matches Laravel Design Exactly */}
      <div className={cn("bg-[#3F159A] text-white text-sm py-1 shadow-sm relative z-50", isOpen && "hidden")}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-1 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
            <a href="https://wa.me/+447917481696?text=Hi%20Dear,%20I%20need%20assignment%20help." target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-medium hover:text-[#ffcc00] transition-colors">
              <Phone className="w-4 h-4" />
              <span>+44 7917481696</span>
            </a>
            <span className="text-white/60 font-bold hidden md:inline">|</span>
            <a href="mailto:order@assignmentinneed.com" className="flex items-center gap-1.5 font-medium hover:text-[#ffcc00] transition-colors">
              <Mail className="w-4 h-4" />
              <span>order@assignmentinneed.com</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-2 overflow-hidden max-w-[360px]">
            <span className="bg-[#e60023] text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">OFFER</span>
            <div className="w-[240px] h-[22px] relative overflow-hidden flex items-center">
              <div className="absolute whitespace-nowrap text-[13px] font-semibold animate-[offerScroll_8s_linear_infinite] hover:[animation-play-state:paused]">
                🎁 Special Offer 🎁 40% Off On Every Order
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes offerScroll {
          0% { transform: translateX(240px); }
          100% { transform: translateX(-100%); }
        }
        @keyframes microSlide {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-micro-slide {
          animation: microSlide 2.8s ease-in-out infinite;
        }
        .animate-micro-slide:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-40 w-full bg-white transition-all duration-300",
        isScrolled ? "shadow-md" : "border-b border-gray-100"
      )}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo matching Laravel */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/images/icons/assignment_logo2.png" alt="assignment help services" className="w-[60px] lg:w-[80px] h-auto object-contain" />
          </Link>

          {/* Desktop Navigation - Exact Laravel Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
            
            {/* Services Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-[15px] xl:text-[16px] font-medium text-gray-800 group-hover:text-[#3F159A] transition-colors px-1 whitespace-nowrap">
                Services <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col gap-1 z-50">
                {menuItems.map((cat) => (
                  <div key={cat.path || cat.name} className="relative group/cat">
                    <Link
                      href={cat.path || "#"}
                      className="flex items-center justify-between text-[13px] font-medium text-gray-700 hover:text-[#3F159A] hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.subItems.length > 0 && <ChevronRight className="w-4 h-4 opacity-70 shrink-0 ml-2" />}
                    </Link>
                    {cat.subItems.length > 0 && (
                      <div className="absolute left-full top-0 ml-1 w-64 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 p-2 flex flex-col gap-1 z-50">
                        {cat.subItems.map((sub) => (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            className="text-[13px] font-medium text-gray-700 hover:text-[#3F159A] hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-[15px] xl:text-[16px] font-medium text-gray-800 group-hover:text-[#3F159A] transition-colors px-1 whitespace-nowrap">
                Subjects <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col gap-1 z-50">
                {SUBJECTS.map((s) => (
                  <Link key={s.path} href={s.path} className="text-[13px] font-medium text-gray-700 hover:text-[#3F159A] hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Experts */}
            <Link href="/writers" className="text-[15px] xl:text-[16px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1 whitespace-nowrap">Experts</Link>

            {/* Samples */}
            <Link href="/samples" className="text-[15px] xl:text-[16px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1 whitespace-nowrap">Samples</Link>

            {/* Resources Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-[15px] xl:text-[16px] font-medium text-gray-800 group-hover:text-[#3F159A] transition-colors px-1 whitespace-nowrap">
                Resources <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-40 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col gap-1 z-50">
                {RESOURCES.map((s) => (
                  <Link key={s.path} href={s.path} className="text-[13px] font-medium text-gray-700 hover:text-[#3F159A] hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* About Us */}
            <Link href="/about" className="text-[15px] xl:text-[16px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1 whitespace-nowrap">About Us</Link>

            {/* Contact */}
            <Link href="/contact" className="text-[15px] xl:text-[16px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1 whitespace-nowrap">Contact</Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 xl:gap-6">
            
            {/* Phone support section (visible on desktop md/lg and up) */}
            <a href="tel:+447300640066" className="hidden lg:flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#3f159a] shrink-0">
                <Phone className="w-[18px] h-[18px] fill-[#3f159a] text-[#3f159a]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[15px] text-gray-900 leading-none mb-0.5 whitespace-nowrap">
                  +44 7300 640066
                </span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wide leading-none">
                  24/7 Support
                </span>
              </div>
            </a>

            {/* Get Free Quote Button */}
            <Link 
              href="/order" 
              className="inline-flex items-center justify-center px-5 py-2.5 h-[42px] text-[15px] font-bold text-white bg-[#f26522] hover:bg-[#e05413] rounded-xl shadow-[0_4px_12px_rgba(242,101,34,0.2)] transition-colors duration-200 shrink-0"
            >
              Get Free Quote
            </Link>

            {/* User Account Icon */}
            <div ref={accountDropdownRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsAccountOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
                <span className="sr-only">Account</span>
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 min-w-[20rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <div className="bg-[#f8f4ff] px-4 py-4">
                    {isLoggedIn ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#5b21b6]">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{userProfile?.name || "Student"}</div>
                          <div className="text-xs text-gray-500 break-words">{userProfile?.email || "No email available"}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-gray-900">Welcome back</div>
                        <p className="text-sm text-gray-500">Login to access your orders, profile, and faster checkout.</p>
                        <Link
                          href="/login"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-[#7c3aed] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#6828d8]"
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
                        className="w-full rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay Drawer */}
        <div 
          className={cn(
            "lg:hidden fixed inset-0 bg-[#0f1b3d] z-50 overflow-y-auto transition-all duration-300 p-6 flex flex-col justify-between",
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          )}
        >
          {/* Top Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 z-60 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col flex-1 mt-4">
            
            {/* Services Dropdown Link */}
            <div className="border-b border-white/10 py-3.5 flex flex-col">
              <button 
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between w-full text-[17px] font-semibold text-white focus:outline-none"
              >
                <span>Services</span>
                <ChevronDown className={cn("w-4 h-4 text-white/70 transition-transform duration-250", mobileServicesOpen && "rotate-180")} />
              </button>
              
              {/* Services Submenu */}
              <div className={cn(
                "pl-3 flex flex-col gap-2 overflow-hidden transition-all duration-350",
                mobileServicesOpen ? "max-h-[350px] mt-3" : "max-h-0"
              )}>
                <div className="max-h-[320px] overflow-y-auto flex flex-col gap-2 pr-1" style={{ scrollbarWidth: "none" }}>
                  {menuItems.map((cat) => (
                    <div key={cat.path || cat.name} className="flex flex-col gap-1">
                      {cat.subItems.length > 0 ? (
                        <>
                          <span className="text-[13px] font-bold text-white/40 uppercase tracking-wider">{cat.name}</span>
                          <div className="pl-3.5 flex flex-col gap-2 border-l border-white/10 ml-1.5 mb-1.5">
                            {cat.subItems.map((sub) => (
                              <Link 
                                key={sub.path} 
                                href={sub.path} 
                                onClick={() => setIsOpen(false)}
                                className="text-[14px] text-white/80 hover:text-white"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link 
                          href={cat.path || "#"} 
                          onClick={() => setIsOpen(false)}
                          className="text-[14px] text-white/80 hover:text-white"
                        >
                          {cat.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subjects Dropdown Link */}
            <div className="border-b border-white/10 py-3.5 flex flex-col">
              <button 
                onClick={() => setMobileSubjectsOpen(!mobileSubjectsOpen)}
                className="flex items-center justify-between w-full text-[17px] font-semibold text-white focus:outline-none"
              >
                <span>Subjects</span>
                <ChevronDown className={cn("w-4 h-4 text-white/70 transition-transform duration-250", mobileSubjectsOpen && "rotate-180")} />
              </button>
              
              {/* Subjects Submenu */}
              <div className={cn(
                "pl-4 flex flex-col gap-2.5 overflow-hidden transition-all duration-300",
                mobileSubjectsOpen ? "max-h-[220px] mt-3" : "max-h-0"
              )}>
                {SUBJECTS.map((s) => (
                  <Link 
                    key={s.path} 
                    href={s.path}
                    onClick={() => setIsOpen(false)}
                    className="text-[14px] text-white/80 hover:text-white"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Experts */}
            <Link 
              href="/writers" 
              onClick={() => setIsOpen(false)}
              className="border-b border-white/10 py-3.5 text-[17px] font-semibold text-white block text-left"
            >
              Experts
            </Link>

            {/* Samples */}
            <Link 
              href="/samples" 
              onClick={() => setIsOpen(false)}
              className="border-b border-white/10 py-3.5 text-[17px] font-semibold text-white block text-left"
            >
              Samples
            </Link>

            {/* Resources Dropdown Link */}
            <div className="border-b border-white/10 py-3.5 flex flex-col">
              <button 
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="flex items-center justify-between w-full text-[17px] font-semibold text-white focus:outline-none"
              >
                <span>Resources</span>
                <ChevronDown className={cn("w-4 h-4 text-white/70 transition-transform duration-250", mobileResourcesOpen && "rotate-180")} />
              </button>
              
              {/* Resources Submenu */}
              <div className={cn(
                "pl-4 flex flex-col gap-2.5 overflow-hidden transition-all duration-300",
                mobileResourcesOpen ? "max-h-[150px] mt-3" : "max-h-0"
              )}>
                {RESOURCES.map((s) => (
                  <Link 
                    key={s.path} 
                    href={s.path}
                    onClick={() => setIsOpen(false)}
                    className="text-[14px] text-white/80 hover:text-white"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* About Us */}
            <Link 
              href="/about" 
              onClick={() => setIsOpen(false)}
              className="border-b border-white/10 py-3.5 text-[17px] font-semibold text-white block text-left"
            >
              About Us
            </Link>

            {/* Contact */}
            <Link 
              href="/contact" 
              onClick={() => setIsOpen(false)}
              className="border-b border-white/10 py-3.5 text-[17px] font-semibold text-white block text-left"
            >
              Contact
            </Link>
          </div>

          {/* Bottom Orange Button */}
          <div className="mt-6 pb-2">
            <Link 
              href="/order" 
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3.5 inline-block text-[15px] font-bold text-white bg-[#f26522] hover:bg-[#e05413] rounded-xl shadow-[0_4px_12px_rgba(242,101,34,0.3)] transition-colors"
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile Account Panel */}
          <div className="mt-6 border-t border-white/15 pt-6">
            <div className="mb-4">
              <div className="text-sm font-semibold text-white">Profile</div>
              <p className="mt-1 text-xs text-white/70">Open the profile panel for login, account details, and logout.</p>
            </div>

            {isLoggedIn ? (
              <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4 text-white">
                <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{userProfile?.name || "Student"}</div>
                    <div className="text-xs text-white/70 break-words">{userProfile?.email || "No email available"}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4 text-white">
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-white/80">
                  Login for faster ordering, saved profiles, and order tracking.
                </div>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#3f159a] transition hover:bg-gray-100"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
