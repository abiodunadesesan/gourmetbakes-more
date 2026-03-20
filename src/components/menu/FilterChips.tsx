"use client";

import { X, RotateCcw } from "lucide-react";

interface FilterChipsProps {
    q: string;
    onClearQ: () => void;
    categories: string[];
    onRemoveCategory: (cat: string) => void;
    priceRange: [number, number];
    onResetPrice: () => void;
    inStockOnly: boolean;
    onToggleInStock: () => void;
    onClearAll: () => void;
}

export default function FilterChips({
    q,
    onClearQ,
    categories,
    onRemoveCategory,
    priceRange,
    onResetPrice,
    inStockOnly,
    onToggleInStock,
    onClearAll
}: FilterChipsProps) {
    const hasFilters = q || categories.length > 0 || priceRange[1] < 20000 || inStockOnly;

    if (!hasFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Active:</span>

            {/* Search Query */}
            {q && (
                <Chip label={`"${q}"`} onRemove={onClearQ} />
            )}

            {/* Categories */}
            {categories.map((cat) => (
                <Chip key={cat} label={cat} onRemove={() => onRemoveCategory(cat)} />
            ))}

            {/* Price */}
            {priceRange[1] < 20000 && (
                <Chip label={`Under ₦${priceRange[1].toLocaleString()}`} onRemove={onResetPrice} />
            )}

            {/* Stock */}
            {inStockOnly && (
                <Chip label="In Stock Only" onRemove={onToggleInStock} />
            )}

            {/* Clear All */}
            <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100"
            >
                <RotateCcw size={12} />
                Clear All
            </button>
        </div>
    );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50/30 group">
            <span>{label}</span>
            <button
                onClick={onRemove}
                className="p-0.5 text-slate-400 group-hover:text-orange-500 hover:bg-orange-100 rounded-full transition-all"
            >
                <X size={10} />
            </button>
        </div>
    );
}
