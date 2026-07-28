import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const stripSubjectPrefix = (value: string) =>
  value.trim().replace(/^\/+|\/+$/g, "").replace(/^subject\//i, "");

export function canonicalSubjectSlug(value: string): string {
  let slug = stripSubjectPrefix(value).toLowerCase();
  if (slug === "math") slug = "maths";
  if (slug.startsWith("math-")) slug = `maths-${slug.slice(5)}`;
  if (slug.endsWith("-assignment-writing-help")) {
    return `${slug.slice(0, -"-assignment-writing-help".length)}-assignment-help`;
  }
  if (slug.endsWith("-assignment-help")) return slug;
  if (slug.endsWith("-assignment")) return `${slug}-help`;
  if (slug.endsWith("-help")) {
    return `${slug.slice(0, -"-help".length)}-assignment-help`;
  }
  return `${slug}-assignment-help`;
}

export function canonicalSubjectPath(value: string): string {
  return `/subject/${canonicalSubjectSlug(value)}`;
}

export function subjectDataSlug(value: string): string {
  const canonical = canonicalSubjectSlug(value);
  if (canonical === "do-my-assignment-help") return "do-my-assignment";
  return canonical.replace(/-assignment-help$/, "");
}