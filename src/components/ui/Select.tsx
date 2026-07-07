"use client";

import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  labelIcon?: React.ReactNode;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  labelIcon,
  placeholder = "Select an option...",
  options,
  value,
  onValueChange,
  error,
  helperText,
  className,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="flex items-center gap-1.5 text-sm font-heading font-semibold text-text-heading">
          {labelIcon && <span className="text-primary-500 w-4 h-4 flex items-center justify-center">{labelIcon}</span>}
          {label}
        </span>
      )}
      <SelectPrimitive.Root value={value || undefined} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-gray-200 focus-visible:border-gray-200 focus:ring-transparent focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 text-left transition-all duration-200",
            error && "border-red-400",
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-40 text-gray-500" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-primary-100 bg-white text-text-body shadow-md transition-all duration-150">
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-text-body cursor-default">
              <ChevronDown className="h-4 w-4 rotate-180" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-2.5 pl-8 pr-2 text-sm outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0 border-transparent data-[disabled]:pointer-events-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700 data-[highlighted]:outline-none data-[disabled]:opacity-50 transition-colors duration-150"
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-primary-700" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
    </div>
  );
};
Select.displayName = "Select";
