"use client";

import { useEffect, useState, useCallback, Suspense, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, SlidersHorizontal, PackageX, ChevronDown, X } from "lucide-react";
import { Product } from "@/types";
import SearchBar from "@/components/menu/SearchBar";
import FilterSidebar from "@/components/menu/FilterSidebar";
import FilterChips from "@/components/menu/FilterChips";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/menu/ProductDetailModal";
import { cn } from "@/lib/utils";

function MenuContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- Stability fix: keep a ref to searchParams so handlers that read it
    // don't need it as a useCallback dependency (prevents cascade re-renders).
    const searchParamsRef = useRef(searchParams);
    useEffect(() => {
        searchParamsRef.current = searchParams;
    });

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Derived State from URL — use a stable string so downstream deps are stable
    const searchParamsString = searchParams.toString();

    const q = searchParams.get("q") || "";
    const categories = useMemo(
        () => searchParams.get("categories")?.split(",").filter(Boolean) || [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParamsString]
    );
    const sort = searchParams.get("sort") || "newest";
    const minPrice = Number(searchParams.get("min_price")) || 500;
    const maxPrice = Number(searchParams.get("max_price")) || 20000;
    const inStock = searchParams.get("in_stock") === "true";

    // URL State Helpers — only depend on pathname & router, read searchParams from ref
    const updateUrl = useCallback((newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParamsRef.current);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === "" || value === "false") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router]); // ← no searchParams dependency here

    const handleCategoryToggle = useCallback((category: string) => {
        const current = searchParamsRef.current.get("categories")?.split(",").filter(Boolean) || [];
        const newCats = current.includes(category)
            ? current.filter(c => c !== category)
            : [...current, category];
        updateUrl({ categories: newCats.join(",") });
    }, [updateUrl]);

    // Fetch Products — only re-creates when the serialized URL string changes
    const fetchProducts = useCallback(async (targetPage?: number) => {
        const isLoadMore = !!targetPage;
        const page = targetPage || 1;

        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        try {
            const params = new URLSearchParams(searchParamsRef.current);
            params.set("page", page.toString());
            params.set("limit", "12");

            const res = await fetch(`/api/products?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                if (isLoadMore) {
                    setProducts(prev => [...prev, ...data.products]);
                } else {
                    setProducts(data.products);
                }
                setMeta({
                    total: data.meta.total,
                    page: data.meta.page,
                    totalPages: data.meta.totalPages,
                });
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []); // ← NO searchParams dependency — reads from ref at call time

    // Only re-fetch when the URL string actually changes
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParamsString]);

    // Memoised handlers
    const handlePriceChange = useCallback((range: [number, number]) => {
        updateUrl({ min_price: range[0].toString(), max_price: range[1].toString() });
    }, [updateUrl]);

    const handleInStockToggle = useCallback(() => {
        const current = searchParamsRef.current.get("in_stock") === "true";
        updateUrl({ in_stock: (!current).toString() });
    }, [updateUrl]);

    const handleClearAll = useCallback(() => {
        router.push(pathname);
    }, [router, pathname]);

    const handleSearch = useCallback((val: string) => {
        updateUrl({ q: val });
    }, [updateUrl]);

    const handleClearQ = useCallback(() => {
        updateUrl({ q: null });
    }, [updateUrl]);

    const handleResetPrice = useCallback(() => {
        updateUrl({ min_price: null, max_price: null });
    }, [updateUrl]);

    const handleToggleInStock = useCallback(() => {
        updateUrl({ in_stock: null });
    }, [updateUrl]);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        updateUrl({ sort: e.target.value });
    }, [updateUrl]);

    const handleLoadMore = useCallback(() => {
        fetchProducts(meta.page + 1);
    }, [fetchProducts, meta.page]);

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Our Full Menu</h1>
                    <p className="text-slate-500 font-medium">Explore our authentic Nigerian treats, baked fresh and delivered with love.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <FilterSidebar
                            selectedCategories={categories}
                            onCategoryToggle={handleCategoryToggle}
                            priceRange={[minPrice, maxPrice]}
                            onPriceChange={handlePriceChange}
                            inStockOnly={inStock}
                            onInStockToggle={handleInStockToggle}
                            onClearAll={handleClearAll}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">

                        {/* Search & Sort Bar */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    initialValue={q}
                                    onSearch={handleSearch}
                                />
                            </div>

                            <div className="flex gap-2">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="lg:hidden flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-orange-200 hover:text-orange-600 transition-all"
                                >
                                    <SlidersHorizontal size={20} />
                                    Filters
                                </button>

                                {/* Sort Dropdown */}
                                <div className="relative group">
                                    <select
                                        value={sort}
                                        onChange={handleSortChange}
                                        className="appearance-none pl-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer min-w-[180px]"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="best_rated">Best Rated</option>
                                        <option value="most_popular">Most Popular</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        <FilterChips
                            q={q}
                            onClearQ={handleClearQ}
                            categories={categories}
                            onRemoveCategory={handleCategoryToggle}
                            priceRange={[minPrice, maxPrice]}
                            onResetPrice={handleResetPrice}
                            inStockOnly={inStock}
                            onToggleInStock={handleToggleInStock}
                            onClearAll={handleClearAll}
                        />

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-3xl" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.product_id}
                                            product={product}
                                            onViewDetails={setSelectedProduct}
                                        />
                                    ))}
                                </div>

                                {/* Load More */}
                                {meta.page < meta.totalPages && (
                                    <div className="flex justify-center pt-8">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={loadingMore}
                                            className="px-10 py-4 bg-white border-2 border-slate-900 rounded-2xl font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-100"
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Loading...
                                                </>
                                            ) : (
                                                "Load More Delicacies"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                    <PackageX size={40} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">No treats found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8">We couldn't find any products matching your current filters. Try adjusting them!</p>
                                <button
                                    onClick={handleClearAll}
                                    className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-8 animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-serif font-bold text-slate-900">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
                            <FilterSidebar
                                selectedCategories={categories}
                                onCategoryToggle={handleCategoryToggle}
                                priceRange={[minPrice, maxPrice]}
                                onPriceChange={handlePriceChange}
                                inStockOnly={inStock}
                                onInStockToggle={handleInStockToggle}
                                onClearAll={handleClearAll}
                            />
                        </div>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="mt-8 w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-xl shadow-orange-100"
                        >
                            Show Results ({meta.total})
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </main>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="text-slate-500 font-medium animate-pulse">Warming up the oven...</p>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}
