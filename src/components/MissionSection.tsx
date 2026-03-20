'use client';

import { Leaf, Award, Users, ShieldCheck } from 'lucide-react';

const values = [
    {
        icon: <Leaf className="w-8 h-8" />,
        title: "Authenticity",
        description: "We honor traditional recipes and methods, never compromising on what makes Nigerian food special.",
        color: "bg-green-50 text-green-600 border-green-100"
    },
    {
        icon: <Award className="w-8 h-8" />,
        title: "Quality",
        description: "Every ingredient is carefully selected, every batch is handcrafted, and every product reflects our commitment to excellence.",
        color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Community",
        description: "We are building a community of food lovers who celebrate Nigerian culture and support local artisans.",
        color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Tradition",
        description: "We preserve and celebrate the culinary traditions that have shaped Nigerian food for generations.",
        color: "bg-purple-50 text-purple-600 border-purple-100"
    }
];

export default function MissionSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-30"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-black text-xs uppercase tracking-widest mb-4">
                        Our Purpose
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">
                        Our Mission
                    </h2>
                    <p className="text-2xl font-serif italic text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        &quot;To celebrate and share authentic Nigerian culinary heritage with food lovers everywhere, ensuring every bite tastes like home.&quot;
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, idx) => (
                        <div 
                            key={idx}
                            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${value.color}`}>
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
