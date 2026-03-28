'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';

export default function RelatedProducts({ recipeId }: { recipeId: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products that might be related (or just some random baked goods for cross-sell)
        const fetchProducts = async () => {
             // In a real app, you might fetch products mapped to the recipe's ingredients here
             try {
                const res = await fetch('/api/products?limit=3');
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.products)) {
                        setProducts(data.products.slice(0, 3));
                    }
                }
             } catch (e) {
                console.error("Failed to load cross-sell products", e);
             } finally {
                setLoading(false);
             }
        };

        fetchProducts();
    }, [recipeId]);

    if (loading) {
        return <div className="animate-pulse h-64 bg-slate-50 rounded-2xl"></div>;
    }

    if (products.length === 0) return null;

    return (
        <div className="bg-white border text-center border-orange-100 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-lg text-slate-800 mb-6">Want to skip the baking?</h4>
            <div className="space-y-6">
                {products.map(p => (
                    <Link href={`/menu?product=${p.product_id}`} key={p.product_id} className="group block text-left flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                                <div className="w-full h-full bg-orange-100"></div>
                            )}
                        </div>
                        <div>
                            <h5 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2">{p.name}</h5>
                            <p className="text-orange-600 font-bold mt-1">₦{p.price?.toLocaleString()}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link href="/menu" className="mt-6 inline-block w-full py-2 px-4 rounded-xl border-2 border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition-colors">
                Order Ready Made
            </Link>
        </div>
    );
}
