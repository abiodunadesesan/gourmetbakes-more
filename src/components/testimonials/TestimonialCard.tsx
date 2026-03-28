"use client";

import { Quote, Star } from "lucide-react";
import type { CustomerTestimonial } from "@/data/customer-testimonials";

function initials(name: string): string {
  const parts = name
    .replace(/\./g, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0];
    const b = parts[parts.length - 1][0];
    return `${a}${b}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type Props = {
  testimonial: CustomerTestimonial;
  size?: "lg" | "sm";
};

export function TestimonialCard({ testimonial: t, size = "lg" }: Props) {
  const lg = size === "lg";

  return (
    <article
      className={
        lg
          ? "flex w-full max-w-full min-w-0 flex-col self-start overflow-x-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm sm:rounded-[2.5rem] sm:p-10"
          : "flex w-full max-w-full min-w-0 flex-col self-start overflow-x-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      }
    >
      {/* Quote icon + stars in normal flow (fixes mobile overlap / misalignment) */}
      <div className="flex flex-shrink-0 flex-wrap items-center gap-3 mb-5">
        <div
          className={
            lg
              ? "shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-md"
              : "shrink-0 w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-md"
          }
          aria-hidden
        >
          <Quote size={lg ? 22 : 18} fill="currentColor" className="opacity-95" />
        </div>
        <div className="flex gap-0.5 text-yellow-400" aria-label={`${t.rating} out of 5 stars`}>
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} size={lg ? 16 : 14} fill="currentColor" className="shrink-0" />
          ))}
        </div>
      </div>

      <p
        className={
          lg
            ? "text-slate-600 text-base sm:text-lg font-serif italic leading-relaxed mb-8 w-full min-w-0 max-w-full hyphens-auto break-words [overflow-wrap:anywhere] text-pretty"
            : "text-slate-600 text-sm sm:text-base font-serif italic leading-relaxed mb-6 w-full min-w-0 max-w-full hyphens-auto break-words [overflow-wrap:anywhere] text-pretty"
        }
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      <footer className="flex w-full min-w-0 shrink-0 items-center gap-3 sm:gap-4 border-t border-slate-50 pt-3">
        <div
          className={
            lg
              ? "h-12 w-12 shrink-0 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm"
              : "h-10 w-10 shrink-0 rounded-full bg-orange-50 flex items-center justify-center font-bold text-orange-600 text-xs"
          }
          aria-hidden
        >
          {initials(t.name)}
        </div>
        <div className="min-w-0 text-left">
          <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{t.name}</p>
          <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5 line-clamp-2">
            {t.location}
          </p>
        </div>
      </footer>
    </article>
  );
}
