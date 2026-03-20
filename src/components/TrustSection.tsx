import { ShieldCheck, Truck, Users, Star } from 'lucide-react';

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
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Testimonial Column (Span 2 for desktop layout) */}
                    <div className="lg:col-span-1 bg-white p-10 rounded-3xl border border-slate-100 shadow-sm relative">
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className="fill-orange-500 text-orange-500" />
                            ))}
                        </div>
                        <p className="text-xl font-serif text-slate-900 mb-8 leading-relaxed italic">
                            "The Agege bread is exactly how I remember it from Lagos—soft, stretchy, and perfect with some Ewa Agoyin. GourmetBakes truly brings a piece of home to my doorstep."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                                AO
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Adebayo O.</h4>
                                <p className="text-slate-500 text-sm">Verified Customer</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="h-14 w-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-200">
                                    <stat.icon size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{stat.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
