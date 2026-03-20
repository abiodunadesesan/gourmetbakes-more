'use client';

import { cn } from '@/lib/utils';
import { Cake, Pizza, Cookie, UtensilsCrossed, Settings as Snack, Store } from 'lucide-react';

const categories = [
    { id: 'all', label: 'All Delicacies', icon: Store },
    { id: 'cakes', label: 'Cakes', icon: Cake },
    { id: 'meat-pies', label: 'Meat Pies', icon: Pizza },
    { id: 'fish-pies', label: 'Fish Pies', icon: Cookie },
    { id: 'agege-bread', label: 'Agege Bread', icon: UtensilsCrossed },
    { id: 'snacks', label: 'Snacks', icon: Snack },
];

interface CategoryNavProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
    return (
        <div className="w-full py-8 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex sm:justify-center items-center space-x-4 px-4 min-w-max pb-4">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 border font-bold text-sm",
                                isActive
                                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200 scale-105"
                                    : "bg-white text-slate-600 border-slate-100 hover:border-orange-200 hover:bg-orange-50"
                            )}
                        >
                            <Icon size={18} className={cn(isActive ? "text-white" : "text-orange-500")} />
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
