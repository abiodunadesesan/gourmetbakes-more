"use client";

import { customerTestimonials } from "@/data/customer-testimonials";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { MobileSnapCarousel } from "@/components/testimonials/MobileSnapCarousel";

export default function TestimonialSection() {
  return (
    <section className="py-24 pb-28 sm:pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-slate-200 text-slate-700 rounded-full font-black text-xs uppercase tracking-widest mb-4">
            Customer Love
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-slate-500 text-sm max-w-xl mx-auto">
            Reviews rotate automatically every few seconds — swipe or use the dots anytime.
          </p>
        </div>

        <div className="mx-auto min-w-0 max-w-lg md:max-w-2xl">
          <MobileSnapCarousel
            autoPlayMs={3000}
            infinite
            items={customerTestimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} size="lg" />
            ))}
          />
        </div>
      </div>
    </section>
  );
}
