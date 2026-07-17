"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export interface CustomDropdownOption {
  label: string;
  value: string;
}

export interface CustomDropdownProps {
  options: CustomDropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  align?: "left" | "right";
  enableSearch?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select Option",
  className = "w-full",
  triggerClassName = "",
  dropdownClassName = "",
  align = "left",
  enableSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const shouldSearch = enableSearch ?? options.length > 8;

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) setSearchQuery("");
      return next;
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen && shouldSearch) {
      // Focus on search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, shouldSearch]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between bg-transparent border-none outline-none cursor-pointer py-0.5 text-[0.72rem] text-slate-800 font-medium ${triggerClassName}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-3 h-3 shrink-0 opacity-60 text-slate-500 ml-1" />
      </button>

      {isOpen && (
        <div 
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-1.5 z-[9999] min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-1 flex flex-col ${dropdownClassName}`}
          style={{ width: align === "right" ? "auto" : "100%" }}
        >
          {shouldSearch && (
            <div className="px-2 py-1.5 border-b border-gray-100 flex items-center gap-1.5 sticky top-0 bg-white z-10">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent dropdown close when typing
                className="w-full bg-transparent border-none outline-none text-[0.72rem] text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
          )}
          
          <div className="overflow-y-auto max-h-[180px] w-full">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <div
                  key={`${opt.value}-${index}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 text-[0.72rem] text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors"
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && <Check className="w-3 h-3 text-purple-700 shrink-0 ml-2" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-[0.72rem] text-slate-400 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
CustomDropdown.displayName = "CustomDropdown";
