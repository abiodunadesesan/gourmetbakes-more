"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    name: string;
    count: number;
}

interface FilterSidebarProps {
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    inStockOnly: boolean;
    onInStockToggle: () => void;
    onClearAll: () => void;
}

export default function FilterSidebar({
    selectedCategories,
    onCategoryToggle,
    priceRange,
    onPriceChange,
    inStockOnly,
    onInStockToggle,
    onClearAll
}: FilterSidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    return (
        <aside className="w-full lg:w-72 space-y-10 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-slate-900">Filters</h3>
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider"
                >
                    <RotateCcw size={14} />
                    Reset
                </button>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Categories
                </h4>
                <div className="space-y-2">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-10 bg-slate-50 animate-pulse rounded-xl" />
                        ))
                    ) : (
                        categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => onCategoryToggle(cat.name)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                                    selectedCategories.includes(cat.name)
                                        ? "bg-orange-50 text-orange-600 font-bold shadow-sm ring-1 ring-orange-200"
                                        : "hover:bg-slate-50 text-slate-600 font-medium"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                        selectedCategories.includes(cat.name)
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : "bg-white border-slate-200 group-hover:border-orange-300"
                                    )}>
                                        {selectedCategories.includes(cat.name) && <Check size={14} />}
                                    </div>
                                    <span className="text-sm">{cat.name}</span>
                                </div>
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    selectedCategories.includes(cat.name)
                                        ? "bg-orange-100/50"
                                        : "bg-slate-100 text-slate-400"
                                )}>
                                    {cat.count}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Price Range
                </h4>
                <div className="space-y-4 px-1">
                    <input
                        type="range"
                        min="500"
                        max="20000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                    <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                        <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">₦{priceRange[0].toLocaleString()}</span>
                        <ChevronRight size={14} className="text-slate-300" />
                        <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg border border-orange-100">₦{priceRange[1].toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 tracking-tight">In Stock Only</span>
                        <span className="text-[11px] text-slate-400 font-medium">Hide out-of-stock items</span>
                    </div>
                    <div
                        onClick={onInStockToggle}
                        className={cn(
                            "w-12 h-6 rounded-full relative transition-all duration-300 flex items-center px-1",
                            inStockOnly ? "bg-orange-500 shadow-lg shadow-orange-100" : "bg-slate-200"
                        )}
                    >
                        <div className={cn(
                            "w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
                            inStockOnly ? "translate-x-6" : "translate-x-0"
                        )} />
                    </div>
                </label>
            </div>

            {/* Banner/Support */}
            <div className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')] group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <h5 className="text-white font-bold mb-2">Need Catering?</h5>
                    <p className="text-slate-400 text-xs mb-4 leading-relaxed">Planning a celebration? We offer custom platters and bulk orders.</p>
                    <a href="https://wa.me/2348001234567" className="text-orange-400 text-xs font-bold hover:text-orange-300 transition-colors flex items-center gap-1 group/link">
                        WhatsApp Us
                        <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </aside>
    );
}
