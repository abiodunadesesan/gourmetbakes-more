import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-orange-100/50 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-orange-200/50">
                        <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">
                            🍞 Fresh & Authentic
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        Welcome to <br />
                        <span className="text-orange-500">GourmetBakes</span> <br />
                        &amp; More
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-xl leading-relaxed">
                        Authentic Nigerian Delicacies Delivered — from golden Meat Pies and soft Agege Bread to celebration cakes, all baked fresh and brought straight to your door.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link
                            href="#menu"
                            className="w-full sm:w-auto px-10 py-5 bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300"
                        >
                            <span>Browse Products</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            href="#contact"
                            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all duration-300"
                        >
                            <ShoppingBag size={20} className="text-orange-500" />
                            <span>View Catering</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Image / Decoration for Desktop */}
            <div className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-[50%] aspect-square rounded-full bg-orange-100/50 backdrop-blur-3xl overflow-hidden border-8 border-white/50 shadow-2xl">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-80"></div>
            </div>
        </section>
    );
}
