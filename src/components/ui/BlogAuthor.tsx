"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export interface AuthorData {
  id?: number;
  name?: string;
  photo?: string | null;
  description?: string | null;
  slug?: string | null;
  role?: string | null;
  profileUrl?: string | null;
}

interface BlogAuthorHeaderProps {
  author?: AuthorData | null;
  dateFormatted: string;
  readingTime?: string;
}

interface BlogAuthorBioProps {
  author?: AuthorData | null;
}

export function getAuthorPhotoUrl(photo?: string | null, name?: string): string {
  if (photo && typeof photo === "string" && photo.trim() !== "") {
    let resolved = photo.trim();
    if (!resolved.startsWith("http://") && !resolved.startsWith("https://")) {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
      const cleanPath = resolved.startsWith("/") ? resolved : `/${resolved}`;
      resolved = `${backendUrl}${cleanPath}`;
    }
    return encodeURI(resolved);
  }
  const authorName = name || "Admin";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorName
  )}&background=4a17a3&color=ffffff&bold=true`;
}

export function BlogAuthorHeader({
  author,
  dateFormatted,
  readingTime,
}: BlogAuthorHeaderProps) {
  const authorName = author?.name?.trim() || "Admin";
  const initialPhoto = getAuthorPhotoUrl(author?.photo, authorName);
  const [imgSrc, setImgSrc] = useState(initialPhoto);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setImgSrc(initialPhoto);
    setHasError(false);
  }, [initialPhoto]);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorName
  )}&background=4a17a3&color=ffffff&bold=true`;

  const authorContent = (
    <div className="flex items-center gap-3">
      <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary-200 bg-white shadow-sm flex-shrink-0">
        <Image
          src={hasError ? fallbackAvatar : imgSrc}
          alt={authorName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="44px"
          unoptimized
          onError={() => {
            if (!hasError) {
              setHasError(true);
              setImgSrc(fallbackAvatar);
            }
          }}
        />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
            Written by
          </span>
          <span className="text-sm font-bold text-text-heading group-hover:text-primary-700 transition-colors">
            {authorName}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted font-medium mt-0.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary-600" />
            {dateFormatted}
          </span>
          {readingTime && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary-600" />
                {readingTime}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 mb-6 rounded-2xl bg-slate-50/80 border border-slate-100">
      {/* Left: Author avatar & information (Clickable if writer profile exists) */}
      {author?.profileUrl ? (
        <Link href={author.profileUrl} className="group cursor-pointer">
          {authorContent}
        </Link>
      ) : (
        <div className="group">{authorContent}</div>
      )}

      {/* Right: Verified Badge */}
      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" />
        {author?.role || "Verified Author"}
      </div>
    </div>
  );
}

export function BlogAuthorBio({ author }: BlogAuthorBioProps) {
  if (!author || (!author.name && !author.description)) {
    return null;
  }

  const authorName = author.name?.trim() || "Assignment In Need Expert";
  const initialPhoto = getAuthorPhotoUrl(author.photo, authorName);
  const [imgSrc, setImgSrc] = useState(initialPhoto);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setImgSrc(initialPhoto);
    setHasError(false);
  }, [initialPhoto]);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorName
  )}&background=4a17a3&color=ffffff&bold=true`;

  return (
    <div className="mt-6 p-4 sm:p-5 md:py-4 md:px-6 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-primary-50/25 border border-slate-200/80 shadow-sm w-full sm:-mx-1.5 md:-mx-3 sm:w-[calc(100%+0.75rem)] md:w-[calc(100%+1.5rem)]">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
        {/* Avatar */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-primary-100 shadow-sm flex-shrink-0 bg-white">
          <Image
            src={hasError ? fallbackAvatar : imgSrc}
            alt={authorName}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
            onError={() => {
              if (!hasError) {
                setHasError(true);
                setImgSrc(fallbackAvatar);
              }
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                About the Author
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {author.role || "Verified Academic Writer"}
              </span>
            </div>

            {author.profileUrl && (
              <Link
                href={author.profileUrl}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors group"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-text-heading mb-1">
            {author.profileUrl ? (
              <Link
                href={author.profileUrl}
                className="hover:text-primary-700 transition-colors"
              >
                {authorName}
              </Link>
            ) : (
              authorName
            )}
          </h3>

          {author.description && (
            <p className="text-xs sm:text-[13px] text-text-body leading-relaxed line-clamp-2">
              {author.description}
            </p>
          )}

          {author.profileUrl && (
            <div className="mt-2.5 sm:hidden flex justify-center">
              <Link
                href={author.profileUrl}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors group"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
