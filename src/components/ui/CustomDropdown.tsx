"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
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
          } top-full mt-1.5 z-[9999] min-w-[120px] max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-1 ${dropdownClassName}`}
          style={{ width: align === "right" ? "auto" : "100%" }}
        >
          {options.map((opt, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
};
CustomDropdown.displayName = "CustomDropdown";
