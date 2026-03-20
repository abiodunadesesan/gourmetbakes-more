'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Amara O.",
        location: "Lagos, Nigeria",
        quote: "The meat pies taste exactly like my mother used to make them. I've ordered three times already and I'm recommending GourmetBakes to all my friends!",
        rating: 5
    },
    {
        name: "Tunde A.",
        location: "London, UK",
        quote: "Living in London, I've been craving authentic Nigerian food. GourmetBakes delivered exactly what I was looking for. The agege bread is incredible!",
        rating: 5
    },
    {
        name: "Zainab M.",
        location: "Abuja, Nigeria",
        quote: "I ordered cakes for my daughter's birthday party and everyone loved them. The quality is exceptional and the service was so smooth. Highly recommended!",
        rating: 5
    }
];

export default function TestimonialSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-slate-200 text-slate-700 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                        Customer Love
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                        What Our Customers Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2.5rem] relative group border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="absolute -top-4 left-10 w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform">
                                <Quote size={24} fill="currentColor" />
                            </div>
                            
                            <div className="flex gap-1 mb-6 text-yellow-400 pt-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-slate-500 text-lg font-serif italic mb-8 leading-relaxed">
                                &quot;{t.quote}&quot;
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">{t.name}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile carousel indicator indicator (simulated for MVP) */}
                <div className="flex md:hidden justify-center gap-2 mt-8">
                    <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
