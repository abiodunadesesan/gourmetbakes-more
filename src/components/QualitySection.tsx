'use client';

import { Sparkles, Heart, Zap, Coffee } from 'lucide-react';

const commitments = [
    {
        icon: <Heart size={20} />,
        title: "No Artificial Preservatives",
        description: "We believe in pure flavors. No additives, just natural ingredients."
    },
    {
        icon: <Sparkles size={20} />,
        title: "Fresh Ingredients Daily",
        description: "Everything is sourced fresh each morning to ensure peak taste."
    },
    {
        icon: <Zap size={20} />,
        title: "Small Batch Handcrafted",
        description: "We bake in small batches to maintain artisan quality standards."
    },
    {
        icon: <Coffee size={20} />,
        title: "Hygienic Preparation",
        description: "Strict hygiene and food safety standards in our modern bakery environment."
    }
];

export default function QualitySection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <span className="inline-block px-4 py-2 bg-amber-50 text-amber-600 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                            Quality First
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                            Our Commitment <br />
                            <span className="text-amber-600">to Quality</span>
                        </h2>
                        
                        <div className="space-y-6 text-slate-500 text-lg font-medium leading-relaxed mb-10">
                            <p>
                                At GourmetBakes & More, quality isn't just a promise—it's a practice. Every product that leaves our kitchen has been crafted with the same care and attention our founder learned in her grandmother's kitchen.
                            </p>
                            <p>
                                We source the finest ingredients, use traditional preparation methods, and maintain the highest standards of food safety and hygiene.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {commitments.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 rounded-3xl bg-amber-50/50 border border-amber-50 hover:border-amber-100 transition-colors">
                                    <div className="w-10 h-10 bg-white text-amber-600 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-amber-100/50 rounded-[2.5rem] blur-2xl group-hover:bg-amber-200/50 transition-all duration-500"></div>
                            <div className="relative aspect-square overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=800&auto=format&fit=crop"
                                    alt="Freshly baked artisan goods"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
