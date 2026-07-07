import React, { InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelIcon?: React.ReactNode;
  icon?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, labelIcon, icon, helperText, error, id, type = "text", ...props }, ref) => {
    const reactId = useId();
    const inputId = id || reactId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="flex items-center gap-1.5 text-sm font-heading font-semibold text-text-heading">
            {labelIcon && <span className="text-primary-500 w-4 h-4 flex items-center justify-center">{labelIcon}</span>}
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3.5 text-text-muted w-5 h-5 flex items-center justify-center pointer-events-none">
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })
                : icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full bg-white text-gray-700 border border-gray-200 rounded-md py-2 px-3 text-sm focus-visible:ring-2 focus-visible:ring-[#6A2FD6]/30 focus-visible:border-[#6A2FD6] transition-all duration-200 placeholder:text-gray-400 h-10",
              icon && "pl-11",
              error && "border-red-400 focus-visible:ring-red-400/30",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelIcon?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, labelIcon, helperText, error, id, rows = 4, ...props }, ref) => {
    const reactId = useId();
    const inputId = id || reactId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="flex items-center gap-1.5 text-sm font-heading font-semibold text-text-heading">
            {labelIcon && <span className="text-primary-500 w-4 h-4 flex items-center justify-center">{labelIcon}</span>}
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            "w-full bg-white text-text-body border border-primary-100/50 rounded-btn py-3 px-4 text-base focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all duration-200 resize-none placeholder:text-text-muted/60",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
