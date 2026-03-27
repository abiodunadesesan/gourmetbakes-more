import React from 'react';
import { Search, Filter } from 'lucide-react';

export interface RecipeFilters {
    difficulty: string;
    category: string;
    prepTime: string;
}

interface FilterBarProps {
    filters: RecipeFilters;
    setFilters: React.Dispatch<React.SetStateAction<RecipeFilters>>;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

export default function FilterBar({ filters, setFilters, searchQuery, setSearchQuery }: FilterBarProps) {
    const categories = ['All', 'Cakes', 'Pies', 'Bread', 'Snacks', 'Sauces'];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
    const prepTimes = ['All', 'Under 30 min', '30-60 min', 'Over 1 hour'];

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
            </div>
            
            <div className="flex w-full md:w-2/3 gap-4 flex-wrap md:flex-nowrap">
                <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 bg-slate-50"
                >
                    <option value="" disabled>Category</option>
                    {categories.map(c => (
                        <option key={c} value={c === 'All' ? '' : c}>{c}</option>
                    ))}
                </select>

                <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 bg-slate-50"
                >
                    <option value="" disabled>Difficulty</option>
                    {difficulties.map(d => (
                        <option key={d} value={d === 'All' ? '' : d}>{d}</option>
                    ))}
                </select>

                <select
                    value={filters.prepTime}
                    onChange={(e) => setFilters(prev => ({ ...prev, prepTime: e.target.value }))}
                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-slate-700 bg-slate-50"
                >
                    <option value="" disabled>Prep Time</option>
                    {prepTimes.map(p => (
                        <option key={p} value={p === 'All' ? '' : p}>{p}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
