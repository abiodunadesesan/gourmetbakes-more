'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-orange-200/50 shadow-sm"
                    >
                        <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">
                            🍞 Fresh &amp; Authentic
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 mb-8 leading-[1.1] tracking-tight"
                    >
                        Welcome to <br />
                        <span className="text-orange-500">GourmetBakes</span> <br />
                        &amp; More
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-700 mb-12 max-w-xl leading-relaxed"
                    >
                        Authentic Nigerian Delicacies Delivered — from golden Meat Pies and soft Agege Bread to celebration cakes, all baked fresh and brought straight to your door.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link
                            href="/menu"
                            className="w-full sm:w-auto px-10 py-5 bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-300/50 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300"
                        >
                            <span>Browse Products</span>
                            <ArrowRight size={20} />
                        </Link>
                        {/* Fixed: was href="#contact" (no-op anchor). Now routes to /contact page. */}
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl border border-slate-800 flex items-center justify-center gap-3 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-slate-900/20"
                        >
                            <ShoppingBag size={20} className="text-orange-400" />
                            <span>View Catering</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Floating badge — top right decoration */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1, type: "spring" }}
                className="float-badge hidden lg:flex absolute right-[8%] top-[20%] flex-col items-center justify-center w-28 h-28 bg-white rounded-full shadow-2xl border-4 border-orange-100 text-center"
            >
                <span className="text-3xl">🥧</span>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider mt-1">Fresh Daily</span>
            </motion.div>

            {/* Hero Image — Desktop */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-[48%] aspect-square rounded-full bg-orange-100/50 backdrop-blur-3xl overflow-hidden border-8 border-white/50 shadow-2xl"
            >
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-multiply opacity-80"></div>
            </motion.div>
        </section>
    );
}
