'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import CategoryNav from './CategoryNav';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (category: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/products?featured=true${category !== 'all' ? `&category=${category}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(activeCategory);
    }, [activeCategory, fetchProducts]);

    // Activate scroll-reveal for featured section
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
    }, [products]);

    return (
        <section id="menu" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="reveal text-center mb-12">
                    <span className="text-orange-600 text-xs uppercase tracking-[0.4em] font-bold mb-4 block">
                        Our Bestsellers
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
                        Featured Creations
                    </h2>
                    <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Discover our most beloved artisanal creations, baked fresh daily with high-quality ingredients and traditional recipes.
                    </p>
                </div>

                {/* Categories */}
                <CategoryNav
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {/* Content Area */}
                <div className="mt-12 min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="animate-spin text-orange-500" size={48} />
                            <p className="text-slate-500 font-medium italic">Preparing the fresh batches...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-orange-50 rounded-3xl border border-orange-100 p-8">
                            <AlertCircle className="text-orange-500 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
                            <p className="text-slate-600 mb-6">{error}</p>
                            <button
                                onClick={() => fetchProducts(activeCategory)}
                                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <ShoppingBag className="text-slate-200 mb-4" size={64} />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                            <p className="text-slate-500">We're currently updating our menu for this category.</p>
                        </div>
                    ) : (
                        <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.product_id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* View Full Menu CTA */}
                <div className="text-center mt-20">
                    <Link
                        href="/menu"
                        className="group inline-flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest text-sm hover:text-orange-500 transition-all duration-300"
                    >
                        <span className="border-b-2 border-orange-100 group-hover:border-orange-500 transition-all pb-1">
                            View Full Menu
                        </span>
                        <div className="h-10 w-10 rounded-full bg-slate-100 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all">
                            <ShoppingBag size={18} />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
