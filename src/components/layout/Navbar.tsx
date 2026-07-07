"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, User, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate auth state
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);

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
          path: `/services/${parentSlug}`,
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

  return (
    <>
      {/* Top Bar - Matches Laravel Design Exactly */}
      <div className="bg-[#3F159A] text-white text-sm py-1 shadow-sm relative z-50">
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
            <img src="/images/icons/Assignment-in-need.png" alt="assignment help services" className="w-[125px] lg:w-[155px] h-auto object-contain" />
          </Link>

          {/* Desktop Navigation - Exact Laravel Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link href="/" className="text-[17px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1">Home</Link>
            
            {/* Services Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-[17px] font-medium text-gray-800 group-hover:text-[#3F159A] transition-colors px-1">
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
              <button className="flex items-center gap-1 text-[17px] font-medium text-gray-800 group-hover:text-[#3F159A] transition-colors px-1">
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
            <Link href="/writers" className="text-[17px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1">Experts</Link>

            {/* Samples */}
            <Link href="/samples" className="text-[17px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1">Samples</Link>

            {/* Resources Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 text-[17px] font-medium text-gray-800 group-hover:text-[#3F159A] transition-colors px-1">
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
            <Link href="/about" className="text-[17px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1">About Us</Link>

            {/* Contact */}
            <Link href="/contact" className="text-[17px] font-medium text-gray-800 hover:text-[#3F159A] transition-colors py-2 px-1">Contact</Link>

            {/* Order Now Button - Laravel Style */}
            <Link 
              href="/order" 
              className="animate-micro-slide ml-2 inline-flex items-center justify-center px-5 py-2 h-[38px] text-[14px] font-semibold text-white bg-gradient-to-br from-[#5b22c6] to-[#4a17a3] hover:from-[#4a17a3] hover:to-[#3d1288] rounded-[10px] shadow-[0_6px_14px_rgba(74,23,163,0.3)] transition-all duration-250 min-w-[120px]"
            >
              Order Now
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            
            {/* User Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#3F159A] transition-colors p-2">
                <User className="w-[26px] h-[26px]" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-gray-100 rounded-[12px] shadow-[0_10px_24px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-5 z-50">
                {isLoggedIn ? (
                  <div className="text-center">
                    <img src="/assets/media/avatars/blank.png" alt="User Profile" className="w-[60px] h-[60px] rounded-full mx-auto object-cover mb-3 shadow-sm" />
                    <h3 className="text-[16px] font-semibold text-gray-800 mb-1">John Doe</h3>
                    <div className="text-[13px] text-gray-500 mb-1">john@example.com</div>
                    <div className="text-[13px] text-gray-500 mb-4">+1234567890</div>
                    
                    <div className="flex flex-col gap-2.5">
                      <Link href="/myProfile" className="block text-center px-5 py-3 rounded-[10px] text-[15px] font-semibold text-white bg-gradient-to-r from-[#3F159A] to-[#0E8FCE] shadow-md hover:-translate-y-0.5 transition-transform">
                        View Profile
                      </Link>
                      <Link href="/MyOrders" className="block text-center px-5 py-3 rounded-[10px] text-[15px] font-semibold text-white bg-gradient-to-r from-[#3F159A] to-[#0E8FCE] shadow-md hover:-translate-y-0.5 transition-transform">
                        My Orders
                      </Link>
                      <button onClick={() => setIsLoggedIn(false)} className="block w-full text-center px-5 py-3 rounded-[10px] text-[15px] font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 shadow-md hover:-translate-y-0.5 transition-transform">
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Welcome!</h4>
                    <p className="text-[15px] text-gray-600 mb-5">Please login or sign up to continue.</p>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => setIsLoggedIn(true)} className="flex-1 py-2.5 rounded-lg text-[15px] font-semibold text-[#3F159A] border-2 border-[#3F159A] hover:bg-[#3F159A] hover:text-white transition-colors">
                        Login
                      </button>
                      <Link href="/register" className="flex-1 py-2.5 rounded-lg text-[15px] font-semibold text-white bg-gradient-to-r from-[#3F159A] to-[#0E8FCE] hover:shadow-lg transition-shadow text-center">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden fixed inset-0 top-[110px] bg-white z-40 overflow-y-auto transition-all duration-300",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}>
          <div className="p-4 flex flex-col gap-4">
            <Link href="/" className="font-semibold text-gray-800 py-2 border-b">Home</Link>
             <div className="flex flex-col border-b py-2">
               <span className="font-semibold text-gray-800 mb-2">Services</span>
               <div className="pl-2 flex flex-col gap-2">
                 {menuItems.map(cat => (
                   <div key={cat.path || cat.name} className="flex flex-col gap-1">
                     {cat.subItems.length > 0 ? (
                       <>
                         <div className="flex items-center justify-between text-sm font-semibold text-gray-800 py-1 px-2 bg-gray-50/50 rounded-md">
                           <span>{cat.name}</span>
                         </div>
                         <div className="pl-4 flex flex-col gap-1.5 border-l border-gray-150 ml-3 mt-1">
                           {cat.subItems.map(sub => (
                             <Link key={sub.path} href={sub.path} className="text-sm text-gray-600 py-0.5">
                               {sub.name}
                             </Link>
                           ))}
                         </div>
                       </>
                     ) : (
                       <Link href={cat.path || "#"} className="text-sm text-gray-600 py-1 px-2 hover:bg-gray-50 rounded-md">
                         {cat.name}
                       </Link>
                     )}
                   </div>
                 ))}
               </div>
             </div>
            <div className="flex flex-col border-b py-2">
              <span className="font-semibold text-gray-800 mb-2">Subjects</span>
              <div className="pl-4 flex flex-col gap-2">
                {SUBJECTS.map(s => <Link key={s.path} href={s.path} className="text-sm text-gray-600">{s.name}</Link>)}
              </div>
            </div>
            <Link href="/writers" className="font-semibold text-gray-800 py-2 border-b">Experts</Link>
            <Link href="/samples" className="font-semibold text-gray-800 py-2 border-b">Samples</Link>
            <div className="flex flex-col border-b py-2">
              <span className="font-semibold text-gray-800 mb-2">Resources</span>
              <div className="pl-4 flex flex-col gap-2">
                {RESOURCES.map(s => <Link key={s.path} href={s.path} className="text-sm text-gray-600">{s.name}</Link>)}
              </div>
            </div>
            <Link href="/about" className="font-semibold text-gray-800 py-2 border-b">About Us</Link>
            <Link href="/contact" className="font-semibold text-gray-800 py-2 border-b">Contact</Link>
            
            <Link 
              href="/order" 
              className="mt-4 text-center py-3 text-[15px] font-semibold text-white bg-gradient-to-br from-[#5b22c6] to-[#4a17a3] rounded-[10px]"
            >
              Order Now
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
