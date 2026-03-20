'use client';

import { CheckCircle2 } from 'lucide-react';

export default function FounderSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-orange-100/50 rounded-[2.5rem] blur-2xl group-hover:bg-orange-200/50 transition-all duration-500"></div>
                        <div className="relative aspect-square overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop"
                                alt="Chioma, Founder of GourmetBakes & More"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-orange-50 animate-in zoom-in-50 duration-500">
                            <div className="text-center">
                                <span className="block text-3xl font-serif font-bold text-orange-500 mb-1">15+</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Years of Baking</span>
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                                The Heart of the Kitchen
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                                Meet Chioma, <br />
                                <span className="text-orange-500">Founder & Head Baker</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-slate-500 text-lg font-medium leading-relaxed">
                            <p>
                                Growing up in Lagos, Chioma spent her childhood in her grandmother's kitchen, learning the secrets of authentic Nigerian baking. Every recipe, every technique, every flavor was passed down with love and pride—a legacy she's determined to share with the world.
                            </p>
                            <p>
                                After years of perfecting her craft and building a loyal following through word-of-mouth, Chioma realized that authentic Nigerian delicacies deserved a proper home online. GourmetBakes & More was born from a simple belief: that food is more than sustenance—it's connection, culture, and love on a plate.
                            </p>
                            <p>
                                Today, Chioma leads a team of passionate bakers dedicated to bringing the warmth and authenticity of Nigerian cuisine to food lovers everywhere, whether they're craving a taste of home or discovering Nigerian flavors for the first time.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6">
                            {[
                                "Authentic Heritage",
                                "Family Recipes",
                                "Small Batch Love",
                                "Lagos Inspired"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
