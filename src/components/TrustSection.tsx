"use client";

import { useEffect } from "react";
import { ShieldCheck, Truck, Users } from "lucide-react";
import { homeSpotlightTestimonials } from "@/data/customer-testimonials";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { MobileSnapCarousel } from "@/components/testimonials/MobileSnapCarousel";

const stats = [
    {
        icon: Users,
        title: '1000+ Happy Customers',
        description: 'Serving authentic joy to thousands of Nigerian food lovers across the region.',
    },
    {
        icon: Truck,
        title: 'Same-Day Delivery',
        description: 'Swift, reliable delivery for orders placed before 10 AM. Freshness guaranteed.',
    },
    {
        icon: ShieldCheck,
        title: 'Quality Ingredients',
        description: 'We use only premium, traditional ingredients to ensure that "tastes like home" quality.',
    },
];

export default function TrustSection() {
    // Activate scroll-reveal on mount (runs once, globally for this section)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            }),
            { threshold: 0.1 }
        );
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-24 pb-28 sm:pb-24 bg-slate-50 relative overflow-hidden">
            {/* Subtle decorative blob */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Customer voices — horizontal swipe / scroll in narrow column */}
                    <div className="reveal lg:col-span-1 space-y-3">
                        <h3 className="text-lg font-bold text-slate-900 font-serif">
                            What customers say
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm">
                            Reviews rotate automatically every few seconds — swipe or use the dots anytime.
                        </p>
                        <div className="-mx-1">
                            <MobileSnapCarousel
                                autoPlayMs={3000}
                                infinite
                                items={homeSpotlightTestimonials.map((t) => (
                                    <TestimonialCard key={t.id} testimonial={t} size="sm" />
                                ))}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="reveal-stagger lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="h-14 w-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-200">
                                    <stat.icon size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{stat.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{stat.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
